/* ==========================================================================
   fx.js — parallax starfield, shooting stars, sparkle cursor trail,
   cartoon click bursts and confetti. Two fixed full-screen canvases.
   ========================================================================== */
window.FX = (() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const INK = "#170d33";
  const STAR_COLORS = ["#ffffff", "#bfe9ff", "#ffd6f2", "#fff3b0", "#c9b8ff"];
  const POP = ["#3ef7ff", "#ff4ecd", "#ffe45e", "#5effc8", "#b89cff", "#ffa3dc"];
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];

  const sf = document.getElementById("starfield");
  const fx = document.getElementById("fx");
  if (!sf || !fx) return { burst() {}, confetti() {}, hearts() {} };
  const sctx = sf.getContext("2d");
  const fctx = fx.getContext("2d");

  let W = 0, H = 0, scrollY = window.scrollY, mx = 0, my = 0;
  let stars = [], shooting = [], parts = [];

  /* ---------- shapes ---------- */
  function sparklePath(ctx, r) {
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.quadraticCurveTo(0, 0, 0, r);
    ctx.quadraticCurveTo(0, 0, -r, 0);
    ctx.quadraticCurveTo(0, 0, 0, -r);
    ctx.closePath();
  }
  function starPath(ctx, r) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 ? r * 0.46 : r;
      ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    ctx.closePath();
  }
  function heartPath(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, s * 0.9);
    ctx.bezierCurveTo(-s * 1.3, s * 0.1, -s * 0.7, -s * 1.0, 0, -s * 0.35);
    ctx.bezierCurveTo(s * 0.7, -s * 1.0, s * 1.3, s * 0.1, 0, s * 0.9);
    ctx.closePath();
  }

  /* ---------- starfield ---------- */
  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    for (const [cv, ctx] of [[sf, sctx], [fx, fctx]]) {
      cv.width = Math.round(W * DPR);
      cv.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    const n = Math.min(340, Math.round((W * H) / 5200));
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      z: rand(0.1, 1),
      r: rand(0.25, 1.4),
      tw: Math.random() * Math.PI * 2,
      ts: rand(0.6, 2.4),
      c: pick(STAR_COLORS),
      sparkle: Math.random() < 0.06,
    }));
    if (reduce) drawStars(0);
  }

  function drawStars(t) {
    sctx.clearRect(0, 0, W, H);
    const px = mx / (W || 1) - 0.5;
    const py = my / (H || 1) - 0.5;
    for (const s of stars) {
      let y = (s.y - scrollY * s.z * 0.22 - py * 14 * s.z) % H;
      if (y < 0) y += H;
      let x = (s.x - px * 22 * s.z) % W;
      if (x < 0) x += W;
      const tw = reduce ? 0.8 : 0.5 + 0.5 * Math.sin(t * 0.001 * s.ts + s.tw);
      const a = (0.3 + 0.7 * tw) * (0.45 + s.z * 0.55);
      sctx.globalAlpha = a;
      sctx.fillStyle = s.c;
      if (s.sparkle) {
        sctx.save();
        sctx.translate(x, y);
        sctx.rotate(t * 0.0003 * s.ts);
        sparklePath(sctx, 2.5 + s.z * 4 * (0.6 + tw * 0.4));
        sctx.fill();
        sctx.restore();
      } else {
        sctx.beginPath();
        sctx.arc(x, y, s.r * (0.6 + s.z), 0, Math.PI * 2);
        sctx.fill();
      }
    }
    // shooting stars
    if (!reduce && Math.random() < 0.005 && shooting.length < 2) {
      shooting.push({ x: rand(W * 0.3, W * 1.1), y: rand(-20, H * 0.45), vx: -rand(7, 12), vy: rand(2.5, 4.5), life: 1 });
    }
    sctx.globalAlpha = 1;
    for (let i = shooting.length - 1; i >= 0; i--) {
      const s = shooting[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life -= 0.011;
      const tx = s.x - s.vx * 12, ty = s.y - s.vy * 12;
      const g = sctx.createLinearGradient(s.x, s.y, tx, ty);
      g.addColorStop(0, `rgba(255,255,255,${Math.max(0, s.life)})`);
      g.addColorStop(0.4, `rgba(255,164,220,${Math.max(0, s.life * 0.6)})`);
      g.addColorStop(1, "rgba(62,247,255,0)");
      sctx.strokeStyle = g;
      sctx.lineWidth = 2.2;
      sctx.lineCap = "round";
      sctx.beginPath();
      sctx.moveTo(s.x, s.y);
      sctx.lineTo(tx, ty);
      sctx.stroke();
      if (s.life <= 0 || s.x < -300 || s.y > H + 300) shooting.splice(i, 1);
    }
  }

  /* ---------- particles ---------- */
  function add(p) {
    if (parts.length > 420) parts.shift();
    parts.push(Object.assign({ rot: 0, vr: 0, g: 0, drag: 0.985, life: 1, decay: 0.02, size: 6, outline: true }, p));
  }

  function burst(x, y, n = 14, kinds = ["star", "heart", "sparkle", "dot"]) {
    if (reduce) return;
    add({ type: "ring", x, y, size: 4, grow: 3.2, decay: 0.045, color: pick(POP), outline: false });
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + rand(-0.3, 0.3);
      const sp = rand(2.2, 6.2);
      add({
        type: pick(kinds), x, y,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1.2,
        g: 0.12, drag: 0.965, size: rand(4.5, 8.5),
        rot: rand(0, Math.PI * 2), vr: rand(-0.2, 0.2),
        decay: rand(0.016, 0.026), color: pick(POP),
      });
    }
  }

  function hearts(x, y, n = 7) {
    if (reduce) return;
    for (let i = 0; i < n; i++) {
      add({ type: "heart", x: x + rand(-18, 18), y, vx: rand(-1.2, 1.2), vy: rand(-3.4, -1.6), g: -0.01, drag: 0.99, size: rand(5, 9), vr: rand(-0.05, 0.05), decay: rand(0.012, 0.02), color: pick(["#ff4ecd", "#ffa3dc", "#ff7ac8"]) });
    }
  }

  function trail(x, y) {
    add({ type: "sparkle", x: x + rand(-4, 4), y: y + rand(-4, 4), vx: rand(-0.6, 0.6), vy: rand(0.2, 1.1), g: 0.02, size: rand(2.5, 5), vr: rand(-0.1, 0.1), decay: rand(0.025, 0.04), color: pick(POP), outline: false });
  }

  function confetti(n = 140) {
    if (reduce) return;
    for (let i = 0; i < n; i++) {
      add({ type: pick(["rect", "rect", "star", "heart"]), x: rand(0, W), y: rand(-H * 0.4, -10), vx: rand(-1.5, 1.5), vy: rand(1.5, 4), g: 0.03, drag: 0.995, size: rand(4, 8), rot: rand(0, 6.28), vr: rand(-0.2, 0.2), decay: rand(0.004, 0.008), color: pick(POP), wobble: rand(0, 6.28) });
    }
  }

  function drawParts() {
    fctx.clearRect(0, 0, W, H);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.life -= p.decay;
      if (p.life <= 0 || p.y > H + 60) { parts.splice(i, 1); continue; }
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.g;
      p.x += p.vx + (p.wobble !== undefined ? Math.sin((p.wobble += 0.08)) * 0.6 : 0);
      p.y += p.vy;
      p.rot += p.vr;
      fctx.save();
      fctx.globalAlpha = Math.min(1, p.life * 1.4);
      fctx.translate(p.x, p.y);
      fctx.rotate(p.rot);
      fctx.fillStyle = p.color;
      fctx.strokeStyle = INK;
      fctx.lineWidth = 1.6;
      fctx.lineJoin = "round";
      switch (p.type) {
        case "ring":
          p.size += p.grow;
          fctx.globalAlpha = p.life * 0.8;
          fctx.strokeStyle = p.color;
          fctx.lineWidth = 3;
          fctx.beginPath();
          fctx.arc(0, 0, p.size, 0, Math.PI * 2);
          fctx.stroke();
          break;
        case "star": starPath(fctx, p.size); fctx.fill(); if (p.outline) fctx.stroke(); break;
        case "heart": heartPath(fctx, p.size * 0.9); fctx.fill(); if (p.outline) fctx.stroke(); break;
        case "sparkle": sparklePath(fctx, p.size * 1.3); fctx.fill(); if (p.outline) fctx.stroke(); break;
        case "rect": {
          const w = p.size * 1.4, h = p.size * 0.7 * Math.abs(Math.cos(p.rot * 2));
          fctx.fillRect(-w / 2, -h / 2, w, h);
          break;
        }
        default:
          fctx.beginPath();
          fctx.arc(0, 0, p.size * 0.55, 0, Math.PI * 2);
          fctx.fill();
          if (p.outline) fctx.stroke();
      }
      fctx.restore();
    }
  }

  /* ---------- loop ---------- */
  let fxDirty = false;
  function loop(t) {
    if (!document.hidden) {
      if (!reduce) drawStars(t);
      if (parts.length) { drawParts(); fxDirty = true; }
      else if (fxDirty) { fctx.clearRect(0, 0, W, H); fxDirty = false; }
    }
    requestAnimationFrame(loop);
  }

  /* ---------- events ---------- */
  let resizeTimer;
  window.addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 120); });
  window.addEventListener("scroll", () => { scrollY = window.scrollY; if (reduce) drawStars(0); }, { passive: true });
  let lastTrail = 0;
  window.addEventListener("pointermove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (reduce || !finePointer || document.body.classList.contains("driving")) return;
    const now = performance.now();
    if (now - lastTrail > 28) { lastTrail = now; trail(mx, my); }
  }, { passive: true });
  window.addEventListener("pointerdown", (e) => {
    if (document.body.classList.contains("driving")) return;
    if (e.target.closest && e.target.closest("#mascot, input, textarea, select")) return;
    burst(e.clientX, e.clientY);
  });

  resize();
  requestAnimationFrame(loop);

  return { burst, confetti, hearts };
})();
