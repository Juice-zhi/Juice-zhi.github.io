/* ==========================================================================
   labviz.js — tiny live visualizations on the research cards.
   photon : single photons slowly reveal a shape (sphere / torus / cat)
   vision : a tiny object detector tracking some very cute objects
   cloud  : a lit volumetric cloud from fBm noise + light marching
   indoor : indoor positioning with beacons and a noisy estimate
   Each viz only animates while it is on screen.
   ========================================================================== */
window.LabViz = (() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const BG = "#06031a";
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  function setup(cv) {
    const ctx = cv.getContext("2d");
    const r = cv.getBoundingClientRect();
    const w = Math.max(1, r.width), h = Math.max(1, r.height);
    cv.width = Math.round(w * DPR);
    cv.height = Math.round(h * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    return { ctx, w, h };
  }

  function label(ctx, x, y, text, color = "#5effc8") {
    ctx.font = "600 10.5px 'JetBrains Mono', Consolas, monospace";
    const tw = ctx.measureText(text).width;
    ctx.fillStyle = "rgba(0,0,0,.6)";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, tw + 12, 18, 5); else ctx.rect(x, y, tw + 12, 18);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.fillText(text, x + 6, y + 13);
  }

  /* ---------- value noise ---------- */
  function hash(x, y) {
    let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  }
  function vnoise(x, y) {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  function fbm(x, y) {
    let s = 0, amp = 0.5, f = 1;
    for (let o = 0; o < 4; o++) { s += amp * vnoise(x * f, y * f); f *= 2.03; amp *= 0.5; }
    return s;
  }

  /* ---------- 1. photons ---------- */
  function photon(cv) {
    let ctx, w, h, count = 0, scene = 0, start = 0, fading = 0;
    const scenes = [
      (x, y) => { // lambertian sphere
        const R = Math.min(w, h) * 0.37;
        const dx = (x - w * 0.5) / R, dy = (y - h * 0.5) / R;
        const d2 = dx * dx + dy * dy;
        if (d2 > 1) return y > h * 0.5 + R * 0.75 ? 0.06 : 0.025;
        const nz = Math.sqrt(1 - d2);
        return Math.max(0.05, -0.5 * dx - 0.55 * dy + 0.67 * nz);
      },
      (x, y) => { // torus seen at an angle
        const S = Math.min(w * 0.3, h * 0.88);
        const u = (x - w * 0.5) / S, v = (y - h * 0.5) / (S * 0.5);
        const d = Math.hypot(u, v);
        const t = (d - 0.74) / 0.26;
        if (Math.abs(t) > 1) return 0.025;
        return 0.08 + 0.85 * Math.sqrt(1 - t * t) * (0.62 + 0.38 * (-v / (d || 1)));
      },
      (x, y) => { // a cat, obviously
        const R = Math.min(w, h) * 0.33, cx = w * 0.5, cy = h * 0.56;
        const dx = (x - cx) / R, dy = (y - cy) / R;
        const inEar = (sx) => {
          const ax = -0.9 * sx, ay = -0.35, bx = -0.62 * sx, by = -1.22, qx = -0.12 * sx, qy = -0.86;
          const s1 = (bx - ax) * (dy - ay) - (by - ay) * (dx - ax);
          const s2 = (qx - bx) * (dy - by) - (qy - by) * (dx - bx);
          const s3 = (ax - qx) * (dy - qy) - (ay - qy) * (dx - qx);
          return (s1 >= 0 && s2 >= 0 && s3 >= 0) || (s1 <= 0 && s2 <= 0 && s3 <= 0);
        };
        const d = Math.hypot(dx, dy);
        if (d > 1 && !inEar(1) && !inEar(-1)) return 0.025;
        for (const ex of [-0.38, 0.38]) if (Math.hypot((dx - ex) / 0.13, (dy + 0.08) / 0.17) < 1) return 0.03;
        if (Math.hypot(dx / 0.08, (dy - 0.18) / 0.06) < 1) return 0.05;
        return clamp(0.9 - 0.42 * Math.min(1, d), 0.1, 1);
      },
    ];

    function resize() { ({ ctx, w, h } = setup(cv)); reset(); }
    function reset() { ctx.fillStyle = BG; ctx.fillRect(0, 0, w, h); count = 0; }
    function shoot(n) {
      const f = scenes[scene];
      for (let i = 0; i < n; i++) {
        const x = Math.random() * w, y = Math.random() * h;
        if (Math.random() < f(x, y) * 0.9) {
          ctx.fillStyle = Math.random() < 0.85 ? "rgba(150,250,255,.6)" : "rgba(255,255,255,.85)";
          ctx.fillRect(x, y, 1.7, 1.7);
          count++;
        } else if (Math.random() < 0.012) {
          ctx.fillStyle = "rgba(255,110,220,.4)"; // dark counts
          ctx.fillRect(x, y, 1.5, 1.5);
          count++;
        }
      }
    }
    function frame(t, once) {
      if (!ctx) resize();
      if (once) { shoot(22000); label(ctx, 10, 10, `photons: ${count.toLocaleString()}`); return; }
      if (!start) start = t;
      if (fading) {
        ctx.fillStyle = "rgba(6,3,26,.16)";
        ctx.fillRect(0, 0, w, h);
        if (t - fading > 700) { fading = 0; scene = (scene + 1) % scenes.length; reset(); start = t; }
        return;
      }
      shoot(300);
      label(ctx, 10, 10, `photons: ${count.toLocaleString()}`);
      if (t - start > 7000) fading = t;
    }
    return { resize, frame };
  }

  /* ---------- 2. vision: a tiny detector tracking cute objects ---------- */
  function vision(cv) {
    let ctx, w, h;
    const INK = "#170d33";
    const dot = (x, y, r) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); };
    function cat(x, y, s) {
      ctx.lineWidth = 2.5; ctx.lineJoin = "round"; ctx.strokeStyle = INK; ctx.fillStyle = "#f4f1ff";
      for (const k of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(x + k * s * 0.82, y - s * 0.2); ctx.lineTo(x + k * s * 0.62, y - s * 1.02); ctx.lineTo(x + k * s * 0.14, y - s * 0.62);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      ctx.beginPath(); ctx.ellipse(x, y, s, s * 0.82, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = INK; dot(x - s * 0.36, y - s * 0.06, s * 0.11); dot(x + s * 0.36, y - s * 0.06, s * 0.11);
      ctx.fillStyle = "#ff9fd6"; dot(x - s * 0.56, y + s * 0.22, s * 0.1); dot(x + s * 0.56, y + s * 0.22, s * 0.1);
      ctx.lineWidth = 2; ctx.beginPath();
      ctx.moveTo(x - s * 0.15, y + s * 0.18); ctx.quadraticCurveTo(x - s * 0.075, y + s * 0.32, x, y + s * 0.18);
      ctx.quadraticCurveTo(x + s * 0.075, y + s * 0.32, x + s * 0.15, y + s * 0.18); ctx.stroke();
    }
    function star(x, y, s, t) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 0.002) * 0.3);
      ctx.beginPath();
      for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? s * 0.46 : s; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
      ctx.closePath(); ctx.fillStyle = "#ffe45e"; ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.lineJoin = "round"; ctx.fill(); ctx.stroke();
      ctx.fillStyle = INK; dot(-s * 0.18, -s * 0.05, s * 0.08); dot(s * 0.18, -s * 0.05, s * 0.08);
      ctx.restore();
    }
    function ufo(x, y, s) {
      ctx.lineWidth = 2.5; ctx.strokeStyle = INK;
      ctx.fillStyle = "#bff8ff"; ctx.beginPath(); ctx.ellipse(x, y - s * 0.18, s * 0.45, s * 0.42, 0, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#ff4ecd"; ctx.beginPath(); ctx.ellipse(x, y, s, s * 0.32, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#ffe45e"; for (const k of [-0.55, 0, 0.55]) dot(x + k * s, y + s * 0.05, s * 0.09);
    }
    const objs = [
      { label: "cat", conf: 0.97, color: "#3ef7ff", draw: cat, px: 0.24, py: 0.58, ax: 0.07, ay: 0.08, fx: 0.0007, fy: 0.0011, ph: 0, size: 0.22 },
      { label: "star", conf: 0.93, color: "#ffe45e", draw: star, px: 0.54, py: 0.5, ax: 0.1, ay: 0.12, fx: 0.0009, fy: 0.0008, ph: 1, size: 0.15 },
      { label: "ufo?", conf: 0.61, color: "#ff4ecd", draw: ufo, px: 0.8, py: 0.48, ax: 0.07, ay: 0.12, fx: 0.0012, fy: 0.0015, ph: 2, size: 0.15 },
    ];
    const track = objs.map(() => null);
    function resize() { ({ ctx, w, h } = setup(cv)); track.fill(null); }
    function frame(t, once) {
      if (!ctx) resize();
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(62,247,255,.06)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < w; x += 22) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, h); }
      for (let y = 0; y < h; y += 22) { ctx.moveTo(0, y + 0.5); ctx.lineTo(w, y + 0.5); }
      ctx.stroke();
      const sx = ((t * 0.12) % (w + 80)) - 40; // the detector's scan pass
      const sweep = ctx.createLinearGradient(sx - 40, 0, sx + 4, 0);
      sweep.addColorStop(0, "rgba(62,247,255,0)");
      sweep.addColorStop(1, "rgba(62,247,255,.2)");
      ctx.fillStyle = sweep;
      ctx.fillRect(sx - 40, 0, 44, h);
      objs.forEach((o, i) => {
        const s = o.size * h;
        const x = w * (o.px + o.ax * Math.sin(t * o.fx + o.ph));
        const y = h * (o.py + o.ay * Math.sin(t * o.fy + o.ph * 1.7));
        o.draw(x, y, s, t);
        // the box lags a little behind the object, like a real tracker
        const box = { x: x - s * 1.2, y: y - s * 1.2, w: s * 2.4, h: s * 2.3 };
        const tr = track[i] || (track[i] = { ...box });
        const k = once ? 1 : 0.18;
        for (const key of ["x", "y", "w", "h"]) tr[key] += (box[key] - tr[key]) * k;
        const L = Math.min(tr.w, tr.h) * 0.22;
        ctx.strokeStyle = o.color;
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.beginPath();
        for (const [cx, cy, dx, dy] of [[tr.x, tr.y, 1, 1], [tr.x + tr.w, tr.y, -1, 1], [tr.x, tr.y + tr.h, 1, -1], [tr.x + tr.w, tr.y + tr.h, -1, -1]]) {
          ctx.moveTo(cx + dx * L, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + dy * L);
        }
        ctx.stroke();
        const conf = Math.min(0.99, o.conf + 0.015 * Math.sin(t * 0.004 + i * 2));
        const text = `${o.label} ${conf.toFixed(2)}`;
        ctx.font = "700 11px 'JetBrains Mono', Consolas, monospace";
        const tw = ctx.measureText(text).width + 10;
        const ly = Math.max(0, tr.y - 18);
        ctx.fillStyle = o.color;
        ctx.fillRect(tr.x, ly, tw, 16);
        ctx.fillStyle = INK;
        ctx.fillText(text, tr.x + 5, ly + 12);
      });
      label(ctx, 10, 10, `objects: ${objs.length}`, "#5effc8");
    }
    return { resize, frame };
  }

  /* ---------- 3. volumetric cloud ---------- */
  function cloud(cv) {
    let ctx, w, h, off, octx, img, last = 0, aspect = 2.8;
    const gw = 120, gh = 52;
    const dens = new Float32Array(gw * gh);
    // a cumulus = a few soft blobs (in "height units") roughened by fBm, drifting left
    const blobs = [
      { x: 0.06, y: 0.66, r: 0.34 }, { x: 0.22, y: 0.58, r: 0.42 }, { x: 0.4, y: 0.62, r: 0.38 },
      { x: 0.57, y: 0.54, r: 0.44 }, { x: 0.75, y: 0.6, r: 0.38 }, { x: 0.92, y: 0.64, r: 0.34 },
      { x: 0.31, y: 0.42, r: 0.26 }, { x: 0.66, y: 0.38, r: 0.28 },
    ];
    function resize() {
      ({ ctx, w, h } = setup(cv));
      aspect = w / h;
      off = document.createElement("canvas");
      off.width = gw; off.height = gh;
      octx = off.getContext("2d");
      img = octx.createImageData(gw, gh);
    }
    function frame(t, once) {
      if (!ctx) resize();
      if (!once && t - last < 33) return;
      last = t;
      const time = t * 0.00004;
      const drift = t * 0.000012;
      for (let j = 0; j < gh; j++) {
        const v = (j + 0.5) / gh;
        const flatBase = v > 0.76 ? Math.max(0, 1 - (v - 0.76) / 0.07) : 1;
        for (let i = 0; i < gw; i++) {
          const u = (i + 0.5) / gw;
          let base = 0;
          for (const b of blobs) {
            const bx = ((((b.x - drift) % 1.3) + 1.3) % 1.3) - 0.15;
            const dx = (u - bx) * aspect, dy = (v - b.y) * 1.5;
            const q = 1 - (dx * dx + dy * dy) / (b.r * b.r);
            if (q > 0) base += q * q;
          }
          const n = fbm(u * aspect * 2.6 + time * 2, v * 2.6 - time);
          const d = (base * 1.1 + (n - 0.47) * 1.1 - 0.28) * 2.2 * flatBase;
          dens[j * gw + i] = clamp(d, 0, 1);
        }
      }
      const data = img.data;
      for (let j = 0; j < gh; j++) {
        for (let i = 0; i < gw; i++) {
          const k = j * gw + i, d = dens[k];
          // march toward the sun (top-left) and accumulate optical depth
          let sum = 0;
          for (let s = 1; s <= 8; s++) {
            const y = j - s;
            if (y < 0) break; // above the grid there is only sky
            sum += dens[y * gw + Math.max(0, i - s * 2)]; // clamp at the left edge instead of stopping (avoids stripes)
          }
          const T = Math.exp(-sum * 0.45);
          const u = i / gw, v = j / gh;
          const glow = Math.max(0, 1 - Math.hypot((u - 0.06) * aspect, v - 0.12) / 1.3);
          let r = 16 + 48 * v + 170 * glow * glow, g = 10 + 16 * v + 90 * glow * glow, b = 44 + 44 * v + 60 * glow * glow;
          const edge = d > 0 ? Math.pow(1 - d, 4) * T : 0;
          const cr = 92 + 163 * T + 90 * edge + 30 * (1 - T) * v;
          const cg = 62 + 160 * T + 70 * edge + 10 * (1 - T) * v;
          const cb = 150 + 55 * T + 50 * edge + 40 * (1 - T) * v;
          const a = Math.pow(d, 0.7);
          r = r * (1 - a) + cr * a; g = g * (1 - a) + cg * a; b = b * (1 - a) + cb * a;
          const p = k * 4;
          data[p] = clamp(r, 0, 255); data[p + 1] = clamp(g, 0, 255); data[p + 2] = clamp(b, 0, 255); data[p + 3] = 255;
        }
      }
      octx.putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(off, 0, 0, w, h);
      const lx = w * 0.06, ly = h * 0.12;
      const sun = ctx.createRadialGradient(lx, ly, 0, lx, ly, 34);
      sun.addColorStop(0, "rgba(255,247,215,1)");
      sun.addColorStop(0.35, "rgba(255,226,170,.8)");
      sun.addColorStop(1, "rgba(255,190,140,0)");
      ctx.fillStyle = sun;
      ctx.fillRect(lx - 36, ly - 36, 72, 72);
    }
    return { resize, frame };
  }

  /* ---------- 4. indoor positioning ---------- */
  function indoor(cv) {
    let ctx, w, h, ex = 0, ey = 0, trail = [];
    function resize() { ({ ctx, w, h } = setup(cv)); ex = w / 2; ey = h / 2; trail = []; }
    function frame(t, once) {
      if (!ctx) resize();
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, w, h);
      // blueprint grid
      ctx.strokeStyle = "rgba(62,247,255,.07)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < w; x += 18) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, h); }
      for (let y = 0; y < h; y += 18) { ctx.moveTo(0, y + 0.5); ctx.lineTo(w, y + 0.5); }
      ctx.stroke();
      // floor plan
      const m = 14;
      ctx.strokeStyle = "rgba(184,156,255,.75)";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.rect(m, m, w - 2 * m, h - 2 * m);
      ctx.moveTo(w * 0.36, m); ctx.lineTo(w * 0.36, h * 0.38);
      ctx.moveTo(w * 0.36, h * 0.62); ctx.lineTo(w * 0.36, h - m);
      ctx.moveTo(w * 0.36, h * 0.55); ctx.lineTo(w * 0.52, h * 0.55);
      ctx.moveTo(w * 0.66, h * 0.55); ctx.lineTo(w - m, h * 0.55);
      ctx.moveTo(w * 0.7, m); ctx.lineTo(w * 0.7, h * 0.3);
      ctx.stroke();
      // beacons
      const beacons = [[w * 0.12, h * 0.22], [w * 0.88, h * 0.24], [w * 0.56, h * 0.84]];
      beacons.forEach(([bx, by], i) => {
        for (let k = 0; k < 3; k++) {
          const r = ((t * 0.045 + k * 26 + i * 11) % 78);
          ctx.strokeStyle = `rgba(94,255,200,${(1 - r / 78) * 0.55})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.fillStyle = "#5effc8";
        ctx.strokeStyle = "#170d33";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.rect(bx - 5, by - 5, 10, 10); ctx.fill(); ctx.stroke();
      });
      // true path + noisy, smoothed estimate
      const tx = w * 0.5 + w * 0.3 * Math.sin(t * 0.00045), ty = h * 0.5 + h * 0.26 * Math.sin(t * 0.0009 + 1);
      const nx = tx + (Math.random() - 0.5) * 34, ny = ty + (Math.random() - 0.5) * 34;
      ex += (nx - ex) * (once ? 1 : 0.12);
      ey += (ny - ey) * (once ? 1 : 0.12);
      trail.push([ex, ey]);
      if (trail.length > 46) trail.shift();
      trail.forEach(([x, y], i) => { ctx.fillStyle = `rgba(62,247,255,${(i / trail.length) * 0.5})`; ctx.fillRect(x - 1.5, y - 1.5, 3, 3); });
      ctx.setLineDash([4, 5]);
      ctx.strokeStyle = "rgba(94,255,200,.35)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      beacons.forEach(([bx, by]) => { ctx.moveTo(bx, by); ctx.lineTo(ex, ey); });
      ctx.stroke();
      ctx.setLineDash([]);
      const ur = 16 + 6 * Math.sin(t * 0.003);
      ctx.fillStyle = "rgba(255,78,205,.16)";
      ctx.strokeStyle = "rgba(255,78,205,.8)";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(ex, ey, ur, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      // the phone, as a little pin
      ctx.fillStyle = "#ff4ecd";
      ctx.strokeStyle = "#170d33";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ex, ey - 9, 6, Math.PI, 0);
      ctx.lineTo(ex, ey + 1);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(ex, ey - 9, 2.2, 0, Math.PI * 2); ctx.fill();
      label(ctx, w - 88, h - 32, `±${(ur / 8).toFixed(1)} m`, "#ff9fd6");
    }
    return { resize, frame };
  }

  /* ---------- manager ---------- */
  const makers = { photon, vision, cloud, indoor };
  const active = new Map();
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) { const v = active.get(e.target); if (v) v.visible = e.isIntersecting; }
  }, { threshold: 0.05 });

  function mount(root = document) {
    for (const [cv] of active) if (!cv.isConnected) { io.unobserve(cv); active.delete(cv); }
    root.querySelectorAll("canvas[data-viz]").forEach((cv) => {
      if (active.has(cv) || !makers[cv.dataset.viz]) return;
      const inst = makers[cv.dataset.viz](cv);
      inst.visible = false;
      active.set(cv, inst);
      io.observe(cv);
      if (reduce) requestAnimationFrame(() => { inst.resize(); inst.frame(performance.now(), true); });
    });
  }

  function loop(t) {
    if (!document.hidden && !reduce) for (const inst of active.values()) if (inst.visible) inst.frame(t, false);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  let rt;
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      for (const inst of active.values()) { inst.resize(); if (reduce) inst.frame(performance.now(), true); }
    }, 150);
  });

  return { mount };
})();
