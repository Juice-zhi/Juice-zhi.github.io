/* ==========================================================================
   mascot.js — Byte the robo-cat. Follows the cursor with its eyes, blinks,
   talks in comic bubbles, reacts to sections, clicks, idling and driving.
   ========================================================================== */
window.Mascot = (() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let el, bubble, eyes, peek, t = (v) => v, lines = {};
  let faceTimer, hideTimer, typeTimer, idleTimer, sleeping = false, clickIdx = -1;
  const seen = new Set();

  function setFace(face, ms) {
    el.dataset.face = face;
    clearTimeout(faceTimer);
    if (ms) faceTimer = setTimeout(() => { el.dataset.face = sleeping ? "sleep" : "normal"; }, ms);
  }

  function say(text, ms = 4600) {
    if (!el || el.classList.contains("hidden")) return;
    clearTimeout(hideTimer);
    clearTimeout(typeTimer);
    bubble.classList.add("show");
    const chars = Array.from(text);
    if (reduce) bubble.textContent = text;
    else {
      let i = 0;
      bubble.textContent = "";
      const step = () => {
        bubble.textContent = chars.slice(0, ++i).join("");
        if (i < chars.length) typeTimer = setTimeout(step, 22);
      };
      step();
    }
    hideTimer = setTimeout(() => bubble.classList.remove("show"), ms + chars.length * 22);
  }

  function blinkLoop() {
    setTimeout(() => {
      if (el.dataset.face === "normal") {
        el.classList.add("blink");
        setTimeout(() => el.classList.remove("blink"), 140);
      }
      blinkLoop();
    }, 2200 + Math.random() * 3600);
  }

  function lookAt(x, y) {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height * 0.42;
    const dx = x - cx, dy = y - cy;
    const d = Math.hypot(dx, dy) || 1;
    const k = Math.min(1, d / 260);
    eyes.setAttribute("transform", `translate(${((dx / d) * 4.5 * k).toFixed(2)} ${((dy / d) * 3.2 * k).toFixed(2)})`);
  }

  function wake() {
    if (sleeping) { sleeping = false; setFace("wow", 700); }
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { sleeping = true; setFace("sleep"); say(t(lines.sleepy), 3500); }, 30000);
  }

  function onClick(e) {
    if (e.target.closest("#mascot-hide")) return;
    const r = el.getBoundingClientRect();
    clickIdx = (clickIdx + 1) % t(lines.clicks).length;
    setFace(Math.random() < 0.5 ? "happy" : "love", 1800);
    say(t(lines.clicks)[clickIdx]);
    window.FX && FX.hearts(r.left + r.width / 2, r.top + 20, 8);
    el.classList.remove("jump");
    void el.offsetWidth;
    el.classList.add("jump");
  }

  function hide() {
    el.classList.add("hidden");
    bubble.classList.remove("show");
    peek.classList.add("show");
    try { localStorage.setItem("mascotHidden", "1"); } catch (_) {}
  }
  function show() {
    el.classList.remove("hidden");
    peek.classList.remove("show");
    try { localStorage.removeItem("mascotHidden"); } catch (_) {}
    setFace("happy", 1200);
  }

  function init(opts) {
    el = document.getElementById("mascot");
    if (!el) return;
    bubble = document.getElementById("bubble");
    eyes = document.getElementById("m-eyes");
    t = opts.t;
    lines = opts.lines;

    peek = document.createElement("button");
    peek.type = "button";
    peek.className = "mascot-peek";
    peek.setAttribute("aria-label", "Show Byte the robo-cat");
    peek.innerHTML = '<svg aria-hidden="true"><use href="#cat-head"/></svg>';
    document.body.appendChild(peek);
    peek.addEventListener("click", show);

    el.addEventListener("click", onClick);
    el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(e); } });
    document.getElementById("mascot-hide").addEventListener("click", (e) => { e.stopPropagation(); hide(); });
    window.addEventListener("pointermove", (e) => { lookAt(e.clientX, e.clientY); wake(); }, { passive: true });
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("keydown", wake);

    let hidden = false;
    try { hidden = localStorage.getItem("mascotHidden") === "1"; } catch (_) {}
    if (hidden) { el.classList.add("hidden"); peek.classList.add("show"); }

    blinkLoop();
    wake();
  }

  function greet() { setTimeout(() => { setFace("happy", 1600); say(t(lines.hello), 5200); }, 600); }

  function react(section) {
    if (!lines.sections || !lines.sections[section] || seen.has(section)) return;
    if (window.innerWidth < 640) return; // on phones the bubble would cover the text
    seen.add(section);
    setFace("wow", 900);
    say(t(lines.sections[section]));
  }

  return { init, say, setFace, greet, react };
})();
