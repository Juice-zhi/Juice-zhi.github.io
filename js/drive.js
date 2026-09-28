/* ==========================================================================
   drive.js — a tiny top-down arcade car you can drive over the page.
   A nod to two years of vehicle gameplay: grip, handbrake drifts,
   boost, neon skid marks and a drift score.
   WASD / arrows drive · Space drifts · Shift boosts · Esc exits.
   On touch screens, hold a finger where the car should go.
   ========================================================================== */
window.Drive = (() => {
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const coarse = matchMedia("(pointer: coarse)").matches;
  const INK = "#170d33";
  const SC = 1.3; // car scale
  const CONTROL = new Set(["arrowup", "arrowdown", "arrowleft", "arrowright", " ", "w", "a", "s", "d", "shift"]);
  const keys = Object.create(null);
  const car = { x: 0, y: 0, a: 0, vx: 0, vy: 0, steer: 0 };
  let cv, ctx, W = 0, H = 0, active = false, raf = 0, last = 0, frameNo = 0;
  let skids = [], puffs = [], popups = [], prevRear = null;
  let score = 0, best = 0, driftPts = 0, driftTime = 0, driftGrace = 0;
  let touch = null, cb = {}, hud = {};

  function rr(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    cv.width = Math.round(W * DPR);
    cv.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function start() {
    if (active || !cv) return;
    active = true;
    document.body.classList.add("driving");
    resize();
    Object.assign(car, { x: W * 0.5, y: H * 0.7, a: -Math.PI / 2, vx: 0, vy: 0, steer: 0 });
    skids = []; puffs = []; popups = []; prevRear = null;
    score = 0; driftPts = 0; driftTime = 0;
    if (coarse) cv.style.pointerEvents = "auto";
    updateHud(0);
    last = performance.now();
    raf = requestAnimationFrame(loop);
    cb.onStart && cb.onStart(coarse);
  }

  function stop() {
    if (!active) return;
    active = false;
    cancelAnimationFrame(raf);
    document.body.classList.remove("driving");
    cv.style.pointerEvents = "";
    for (const k in keys) keys[k] = false;
    touch = null;
    ctx.clearRect(0, 0, W, H);
    cb.onStop && cb.onStop();
  }

  function onKey(e, down) {
    if (!active) return;
    const k = e.key === " " ? " " : String(e.key).toLowerCase();
    if (k === "escape") { if (down) stop(); return; }
    if (CONTROL.has(k)) { keys[k] = down; e.preventDefault(); }
  }

  function bankDrift() {
    if (driftPts > 20) {
      const pts = Math.round(driftPts);
      score += pts;
      popups.push({ x: car.x, y: car.y - 34, text: `+${pts}`, life: 1 });
      if (score > best) { best = score; try { localStorage.setItem("driftBest", String(best)); } catch (_) {} }
      cb.onDrift && cb.onDrift(pts);
    }
    driftPts = 0;
    driftTime = 0;
  }

  function step(dt) {
    let up = keys.w || keys.arrowup;
    const down = keys.s || keys.arrowdown;
    const hb = keys[" "];
    const boost = keys.shift;
    let steerIn = (keys.d || keys.arrowright ? 1 : 0) - (keys.a || keys.arrowleft ? 1 : 0);
    if (touch) {
      const dist = Math.hypot(touch.x - car.x, touch.y - car.y);
      let diff = Math.atan2(touch.y - car.y, touch.x - car.x) - car.a;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      steerIn = Math.max(-1, Math.min(1, diff * 2.2));
      up = dist > 50;
    }

    const fx = Math.cos(car.a), fy = Math.sin(car.a);
    const rx = -fy, ry = fx;
    let vf = car.vx * fx + car.vy * fy; // forward speed
    let vl = car.vx * rx + car.vy * ry; // sideways slip
    const maxF = boost ? 1000 : 620;

    if (up) vf += (boost ? 1500 : 820) * dt;
    if (down) vf -= (vf > 20 ? 1500 : 520) * dt;
    vf -= vf * Math.min(1, (up || down ? 0.25 : 1.1) * dt);
    if (hb) vf -= vf * Math.min(1, 0.5 * dt);
    if (vf > maxF) vf += (maxF - vf) * Math.min(1, 4 * dt);
    if (vf < -240) vf = -240;
    vl -= vl * Math.min(1, (hb ? 1.2 : 8) * dt); // tyre grip

    car.steer += (steerIn - car.steer) * Math.min(1, 10 * dt);
    const turn = Math.min(1, Math.abs(vf) / 170);
    car.a += car.steer * (hb ? 3.9 : 3.0) * turn * Math.sign(vf) * dt;

    // velocity keeps the old heading; the next frame sees it as sideways slip
    car.vx = fx * vf + rx * vl;
    car.vy = fy * vf + ry * vl;
    car.x += car.vx * dt;
    car.y += car.vy * dt;

    const m = 40;
    let wrapped = false;
    if (car.x < -m) { car.x = W + m; wrapped = true; }
    else if (car.x > W + m) { car.x = -m; wrapped = true; }
    if (car.y < -m) { car.y = H + m; wrapped = true; }
    else if (car.y > H + m) { car.y = -m; wrapped = true; }

    const speed = Math.hypot(car.vx, car.vy);
    const drifting = Math.abs(vl) > 80 && speed > 150;

    // rear wheels → skid marks
    const nfx = Math.cos(car.a), nfy = Math.sin(car.a);
    const rb = 14 * SC, rs = 10 * SC;
    const rear = [
      [car.x - nfx * rb - nfy * rs, car.y - nfy * rb + nfx * rs],
      [car.x - nfx * rb + nfy * rs, car.y - nfy * rb - nfx * rs],
    ];
    if ((drifting || (down && vf > 250)) && prevRear && !wrapped) {
      for (let i = 0; i < 2; i++) skids.push({ x1: prevRear[i][0], y1: prevRear[i][1], x2: rear[i][0], y2: rear[i][1], life: 1 });
      if (skids.length > 800) skids.splice(0, skids.length - 800);
    }
    prevRear = rear;

    if (drifting) {
      driftTime += dt;
      driftGrace = 0.25;
      driftPts += Math.abs(vl) * dt * 0.5 * (1 + driftTime * 0.8);
      if (Math.random() < 0.6) puffs.push({ x: rear[(Math.random() * 2) | 0][0], y: rear[(Math.random() * 2) | 0][1], vx: -car.vx * 0.05, vy: -car.vy * 0.05, r: 5, grow: 26, life: 1, decay: 1.4, c: "210,190,255" });
    } else if (driftPts > 0) {
      driftGrace -= dt;
      if (driftGrace <= 0) bankDrift();
    }

    const tail = [car.x - nfx * 26 * SC, car.y - nfy * 26 * SC];
    if (up && Math.random() < 0.35) puffs.push({ x: tail[0], y: tail[1], vx: -nfx * 40, vy: -nfy * 40, r: 3, grow: 14, life: 1, decay: 2.2, c: "184,156,255" });
    if (boost && up) {
      for (let i = 0; i < 2; i++) puffs.push({ x: tail[0], y: tail[1], vx: -nfx * 260 + (Math.random() - 0.5) * 80, vy: -nfy * 260 + (Math.random() - 0.5) * 80, r: 4 + Math.random() * 3, grow: -6, life: 1, decay: 4.5, c: Math.random() < 0.5 ? "255,228,94" : "255,165,62", flame: true });
    }

    return { speed, drifting, braking: down && vf > 0, boosting: boost && up };
  }

  function render(st, dt) {
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = "round";
    for (const s of skids) s.life -= dt / 6;
    skids = skids.filter((s) => s.life > 0);
    for (const s of skids) {
      ctx.strokeStyle = `rgba(255,78,205,${0.16 * s.life})`;
      ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(s.x1, s.y1); ctx.lineTo(s.x2, s.y2); ctx.stroke();
    }
    for (const s of skids) {
      ctx.strokeStyle = `rgba(62,247,255,${0.75 * s.life})`;
      ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(s.x1, s.y1); ctx.lineTo(s.x2, s.y2); ctx.stroke();
    }

    for (let i = puffs.length - 1; i >= 0; i--) {
      const p = puffs[i];
      p.life -= p.decay * dt;
      if (p.life <= 0) { puffs.splice(i, 1); continue; }
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.r = Math.max(0.5, p.r + p.grow * dt);
      ctx.fillStyle = `rgba(${p.c},${(p.flame ? 0.9 : 0.28) * p.life})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }

    drawCar(st.braking);

    if (st.drifting && driftPts > 10) {
      ctx.font = "700 15px Fredoka, 'ZCOOL KuaiLe', sans-serif";
      ctx.textAlign = "center";
      ctx.lineWidth = 4;
      ctx.strokeStyle = INK;
      ctx.fillStyle = "#ffe45e";
      const txt = `DRIFT ×${(1 + driftTime * 0.8).toFixed(1)}  ${Math.round(driftPts)}`;
      ctx.strokeText(txt, car.x, car.y - 38);
      ctx.fillText(txt, car.x, car.y - 38);
    }
    for (let i = popups.length - 1; i >= 0; i--) {
      const p = popups[i];
      p.life -= dt * 0.9;
      p.y -= 40 * dt;
      if (p.life <= 0) { popups.splice(i, 1); continue; }
      ctx.globalAlpha = Math.min(1, p.life * 2);
      ctx.font = "700 24px Fredoka, sans-serif";
      ctx.textAlign = "center";
      ctx.lineWidth = 5;
      ctx.strokeStyle = INK;
      ctx.strokeText(p.text, p.x, p.y);
      ctx.fillStyle = "#5effc8";
      ctx.fillText(p.text, p.x, p.y);
      ctx.globalAlpha = 1;
    }
  }

  function drawCar(braking) {
    ctx.save();
    ctx.translate(car.x + 4, car.y + 7);
    ctx.rotate(car.a);
    ctx.scale(SC, SC);
    ctx.fillStyle = "rgba(0,0,0,.35)";
    rr(-24, -12, 48, 24, 9);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.a);
    ctx.scale(SC, SC);
    const cone = ctx.createLinearGradient(22, 0, 170, 0);
    cone.addColorStop(0, "rgba(255,240,170,.32)");
    cone.addColorStop(1, "rgba(255,240,170,0)");
    ctx.fillStyle = cone;
    ctx.beginPath(); ctx.moveTo(22, -9); ctx.lineTo(170, -56); ctx.lineTo(170, 56); ctx.lineTo(22, 9); ctx.closePath(); ctx.fill();

    ctx.fillStyle = INK;
    for (const [wx, wy, front] of [[-13, -13, 0], [-13, 13, 0], [13, -13, 1], [13, 13, 1]]) {
      ctx.save();
      ctx.translate(wx, wy);
      if (front) ctx.rotate(car.steer * 0.45);
      rr(-6, -3.5, 12, 7, 2.5);
      ctx.fill();
      ctx.restore();
    }
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = INK;
    ctx.fillStyle = "#ff4ecd";
    rr(-24, -12, 48, 24, 9); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.92)";
    ctx.fillRect(-22, -3, 44, 2.2);
    ctx.fillRect(-22, 0.8, 44, 2.2);
    ctx.fillStyle = "#3ef7ff";
    rr(3, -9, 9, 18, 3.5); ctx.fill(); ctx.stroke();
    rr(-15, -8, 6, 16, 3); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#ffe45e";
    ctx.beginPath(); ctx.arc(22, -7.5, 2.6, 0, Math.PI * 2); ctx.arc(22, 7.5, 2.6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = braking ? "#ff2d55" : "#8f1a3a";
    ctx.fillRect(-25, -10, 3, 5);
    ctx.fillRect(-25, 5, 3, 5);
    if (braking) {
      const g = ctx.createRadialGradient(-26, 0, 0, -26, 0, 26);
      g.addColorStop(0, "rgba(255,45,85,.45)");
      g.addColorStop(1, "rgba(255,45,85,0)");
      ctx.fillStyle = g;
      ctx.fillRect(-52, -26, 30, 52);
    }
    ctx.restore();
  }

  function updateHud(speed) {
    hud.speed.textContent = Math.round(speed * 0.3);
    hud.score.textContent = score.toLocaleString();
    hud.best.textContent = Math.max(best, score).toLocaleString();
  }

  function loop(now) {
    if (!active) return;
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    if (!document.hidden) {
      const st = step(dt);
      render(st, dt);
      if (++frameNo % 4 === 0) updateHud(st.speed);
    }
    raf = requestAnimationFrame(loop);
  }

  function init(opts = {}) {
    cv = document.getElementById("drive");
    if (!cv) return;
    ctx = cv.getContext("2d");
    cb = opts;
    hud = { speed: document.getElementById("hud-speed"), score: document.getElementById("hud-score"), best: document.getElementById("hud-best") };
    try { best = Number(localStorage.getItem("driftBest")) || 0; } catch (_) { best = 0; }
    window.addEventListener("keydown", (e) => onKey(e, true));
    window.addEventListener("keyup", (e) => onKey(e, false));
    window.addEventListener("blur", () => { for (const k in keys) keys[k] = false; });
    window.addEventListener("resize", () => { if (active) resize(); });
    const setTouch = (e) => { if (active) touch = { x: e.clientX, y: e.clientY }; };
    cv.addEventListener("pointerdown", setTouch);
    cv.addEventListener("pointermove", (e) => { if (touch) setTouch(e); });
    ["pointerup", "pointercancel", "pointerleave"].forEach((ev) => cv.addEventListener(ev, () => { touch = null; }));
    document.getElementById("drive-exit").addEventListener("click", stop);
  }

  return { init, start, stop, get active() { return active; } };
})();
