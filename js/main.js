/* ==========================================================================
   main.js — renders content.js into the page and wires up the interactions:
   i18n, boot screen, typing, reveals, counters, tilt, orbiters, nav/XP bar,
   achievements, toasts, easter eggs (Konami code, drive mode), clock.
   ========================================================================== */
(() => {
  const C = window.SITE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;

  /* ---------------- i18n ---------------- */
  let lang = (() => {
    try { const s = localStorage.getItem("lang"); if (s === "en" || s === "zh") return s; } catch (_) {}
    return /^zh/i.test(navigator.language || "") ? "zh" : "en";
  })();
  const isLocalized = (v) => v && typeof v === "object" && !Array.isArray(v) && ("en" in v || "zh" in v);
  const t = (v) => (isLocalized(v) ? v[lang] ?? v.en : v);
  const ui = (k) => t(C.ui[k]) ?? "";
  const escapeHTML = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function applyStatic() {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    $$("[data-i18n]").forEach((el) => { const v = C.ui[el.dataset.i18n]; if (v) el.innerHTML = t(v); });
    $$("[data-i18n-title]").forEach((el) => {
      const v = C.ui[el.dataset.i18nTitle];
      if (v) { el.title = t(v); el.setAttribute("aria-label", t(v)); }
    });
    $$("#lang-btn [data-l]").forEach((s) => s.classList.toggle("on", s.dataset.l === lang));
    const name = $("#name");
    name.textContent = name.dataset.text = t(C.profile.name);
  }

  /* ---------------- renderers ---------------- */
  const linkBtn = (l) => `<a class="link-btn" href="${l.url}" target="_blank" rel="noopener">${t(l.label)} <span class="arr" aria-hidden="true">↗</span></a>`;
  const chips = (arr) => arr.map((x) => `<span class="chip">${t(x)}</span>`).join("");
  const bulletList = (items, withTitle) =>
    `<ul class="bullets">${items.map((b) => `<li><span class="bi" aria-hidden="true">${b.icon}</span><div>${withTitle ? `<strong>${t(b.title)}</strong>` : ""}<p>${t(b.text)}</p></div></li>`).join("")}</ul>`;
  const worksStrip = (works) => `
    <div class="works">
      <h4 class="works-head"><span class="works-ic" aria-hidden="true">🎬</span>${ui("works.title")}</h4>
      <p class="works-sub">${ui("works.sub")}</p>
      <div class="works-grid">${works.map((w, i) => `
        <a class="work" href="${w.url}" target="_blank" rel="noopener" style="--i:${i}">
          <span class="work-thumb">
            <img src="${w.thumb}" alt="" width="800" height="450" loading="lazy" decoding="async" />
            <span class="work-tag">${t(w.tag)}</span>
            <span class="work-sticker" aria-hidden="true">${w.sticker}</span>
            <span class="work-play" aria-hidden="true"></span>
            <span class="work-dur">${w.duration}</span>
          </span>
          <span class="work-body">
            <span class="work-map">📍 ${t(w.map)}</span>
            <strong class="work-title">${t(w.title)}</strong>
            <span class="work-desc">${t(w.desc)}</span>
            <span class="work-src"><span class="work-bili">▶ ${ui("works.watch")} ↗</span><span class="work-up">${ui("works.by")} ${escapeHTML(w.uploader)}</span></span>
          </span>
        </a>`).join("")}
      </div>
    </div>`;

  let statsCounted = false, achUnlocked = false;

  function renderAbout() {
    $("#bio").innerHTML = t(C.bio).map((p) => `<p>${p}</p>`).join("");
    $("#stats").innerHTML = C.stats.map((s, i) => `
      <div class="stat" data-reveal style="--d:${i}">
        <div class="stat-num">${s.display ? s.display : `<span data-count="${s.count}">${statsCounted || reduce ? s.count : 0}</span>${t(s.suffix)}`}</div>
        <div class="stat-label">${t(s.label)}</div>
      </div>`).join("");
    $("#charsheet").innerHTML = C.charsheet.map((r) => `<dt>${t(r.k)}</dt><dd>${t(r.v)}</dd>`).join("");
    $("#now").innerHTML = C.now.map((n) => `<li><span class="ic" aria-hidden="true">${n.icon}</span><span>${t(n.text)}</span></li>`).join("");
  }

  function renderQuests() {
    $("#quests-list").innerHTML = C.experience.map((q, i) => `
      <article class="quest" data-reveal style="--d:${Math.min(i, 1)}">
        <div class="quest-node" aria-hidden="true">${q.icon}</div>
        <div class="panel quest-card neon">
          <span class="badge ${q.badgeClass || ""}">${t(q.badge)}</span>
          <div class="quest-head">
            <div>
              <h3 class="quest-org">${q.orgUrl ? `<a href="${q.orgUrl}" target="_blank" rel="noopener">${t(q.org)}</a>` : t(q.org)}${q.project ? `<span class="quest-proj">${t(q.project)}</span>` : ""}</h3>
              <p class="quest-role">${t(q.role)}</p>
            </div>
            <div class="quest-meta"><span class="pill-date">${t(q.date)}</span>${q.place ? `<span class="pill-place">📍 ${t(q.place)}</span>` : ""}</div>
          </div>
          <p class="summary">${t(q.summary)}</p>
          ${bulletList(q.bullets, true)}
          ${q.works ? worksStrip(q.works) : ""}
          <div class="tags">${chips(q.tags)}</div>
          ${q.links && q.links.length ? `<div class="links">${q.links.map(linkBtn).join("")}</div>` : ""}
        </div>
      </article>`).join("");
  }

  function renderLab() {
    $("#lab-grid").innerHTML = C.research.map((r, i) => `
      <article class="panel lab-card neon${r.compact ? " compact" : ""}" data-reveal style="--d:${i % 2}">
        <div class="lab-viz">
          <canvas data-viz="${r.viz}" aria-hidden="true"></canvas>
          <span class="viz-label">${t(r.vizLabel)}</span>
          <span class="status ${r.status.en === "ONGOING" ? "live" : "done"}">${t(r.status)}</span>
        </div>
        <div class="lab-body">
          <div class="lab-org">${t(r.org)}</div>
          <h3 class="lab-title">${t(r.title)}</h3>
          ${r.sub ? `<div class="lab-sub">${t(r.sub)}</div>` : ""}
          <div class="lab-meta"><span class="pill-date">${t(r.date)}</span>${r.advisor ? `<span>${ui("lab.with")} <a class="ln" href="${r.advisor.url}" target="_blank" rel="noopener">${t(r.advisor.name)}</a></span>` : ""}</div>
          <p class="summary">${t(r.summary)}</p>
          ${r.bullets ? bulletList(r.bullets, false) : ""}
          <div class="lab-foot">${r.tags ? `<div class="tags">${chips(r.tags)}</div>` : ""}<div class="links">${r.links.map(linkBtn).join("")}</div></div>
        </div>
      </article>`).join("");
    window.LabViz && LabViz.mount($("#lab-grid"));
  }

  function renderProjects() {
    $("#loot-grid").innerHTML = C.projects.map((p, i) => `
      <article class="loot r-${p.rarity}" data-reveal style="--d:${i % 3}">
        <div class="shine" aria-hidden="true"></div>
        <div class="loot-top"><span class="slot" aria-hidden="true">${p.icon}</span><span class="rarity">${ui("rarity." + p.rarity)}</span></div>
        <h3>${p.name}</h3>
        <p>${t(p.desc)}</p>
        <div class="tags">${chips(p.tags)}</div>
        <div class="links">${p.links.map(linkBtn).join("")}</div>
      </article>`).join("");
    $("#more-loot").innerHTML = C.moreLoot.map((m) => `<a class="mini" href="${m.url}" target="_blank" rel="noopener"><b>${m.name} ↗</b><span>${t(m.desc)}</span></a>`).join("");
    bindLootTilt();
  }

  function renderAcademy() {
    const out = [];
    C.education.forEach((e, i) => {
      if (i) out.push(`<div class="flight" aria-hidden="true"><span class="plane">✈️</span></div>`);
      out.push(`
        <article class="panel school neon" data-reveal style="--d:${i}">
          <span class="badge ${i === C.education.length - 1 ? "b-now" : ""}">${t(e.badge)}</span>
          <div class="stamp" style="--sc:${e.stamp.color}" aria-hidden="true"><span>${e.stamp.city}<b>${e.stamp.year}</b></span></div>
          <div class="school-head">
            <h3 class="school-name"><a href="${e.url}" target="_blank" rel="noopener">${t(e.school)}</a></h3>
            <div class="degree">${t(e.degree)}</div>
          </div>
          <div class="school-meta"><span class="pill-date">${t(e.date)}</span><span class="pill-place">📍 ${t(e.place)}</span></div>
          <div class="courses"><h4 class="mini-head">${ui("academy.courses")}</h4><div class="tags">${chips(t(e.courses))}</div></div>
          <p class="school-note">${t(e.note)}</p>
          <div class="links">${e.links.map(linkBtn).join("")}</div>
        </article>`);
    });
    $("#academy-list").innerHTML = out.join("");
  }

  function renderSkills() {
    $("#skill-grid").innerHTML = C.skills.map((s, i) => `
      <div class="panel skill-card neon" data-reveal style="--d:${i % 3};--kc:${s.color}">
        <h3><span class="ic" aria-hidden="true">${s.icon}</span>${t(s.name)}</h3>
        <div class="tags">${s.items.map((it) => `<span class="chip${it.core ? " core" : ""}">${t(it.n)}</span>`).join("")}</div>
      </div>`).join("");
  }

  function renderAchievements() {
    $("#ach-grid").innerHTML = C.achievements.map((a, i) => {
      const tag = a.url ? "a" : "div";
      const attrs = a.url ? ` href="${a.url}" target="_blank" rel="noopener"` : "";
      return `<${tag} class="ach${achUnlocked ? "" : " locked"}"${attrs} data-reveal style="--d:${i % 4}">
          <div class="medal-wrap"><div class="medal" aria-hidden="true">${a.icon}</div><span class="lock" aria-hidden="true">🔒</span></div>
          <h3>${t(a.name)}</h3><p>${t(a.desc)}</p>
        </${tag}>`;
    }).join("");
  }

  function renderGallery() {
    $("#gallery").innerHTML = C.gallery.map((g, i) => `
      <a class="polaroid${g.w > g.h ? " land" : ""}" href="${g.src}" data-idx="${i}" data-reveal style="--d:${i % 3}">
        <span class="tape" aria-hidden="true"></span>
        <span class="ph"><img src="${g.thumb}" alt="${escapeHTML(t(g.alt))}" width="${g.tw}" height="${g.th}" loading="lazy" decoding="async" /></span>
        <span class="cap">${t(g.caption)}</span>
      </a>`).join("");
  }

  function renderBands() {
    const w1 = ["GAMEPLAY", "GRAPHICS", "PHOTONS", "UNREAL ENGINE", "CUDA", "NEURAL RENDERING", "CTF", "JUICE POWERED 🧃"];
    const w2 = ["可爱 × 酷炫", "SCI-FI", "CARTOON", "VEHICLE PHYSICS", "SPAD", "VOLUMETRIC", "HELLO, WORLD", "(=^･ω･^=)"];
    const fill = (id, words) => { $(id).innerHTML = Array(4).fill(words).flat().map((w) => `<span>${w}</span>`).join(""); };
    fill("#band-1", w1);
    fill("#band-2", w2);
  }

  function renderAll(instant) {
    renderAbout();
    renderQuests();
    renderLab();
    renderProjects();
    renderAcademy();
    renderSkills();
    renderAchievements();
    renderGallery();
    observeReveals(instant);
    setupCounters();
  }

  /* ---------------- reveal on scroll ---------------- */
  const revealIO = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("is-in"); revealIO.unobserve(e.target); }
  }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });

  function observeReveals(instant) {
    $$("[data-reveal]:not(.is-in)").forEach((el) => {
      if (reduce || (instant && el.getBoundingClientRect().top < window.innerHeight)) el.classList.add("is-in");
      else revealIO.observe(el);
    });
  }

  /* ---------------- counters ---------------- */
  let counterIO = null;
  function setupCounters() {
    if (statsCounted || reduce) return;
    if (counterIO) counterIO.disconnect();
    counterIO = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      counterIO.disconnect();
      statsCounted = true;
      const t0 = performance.now();
      const tick = (now) => {
        const k = Math.min(1, (now - t0) / 1600);
        const ease = 1 - Math.pow(1 - k, 4);
        $$("[data-count]").forEach((n) => { n.textContent = Math.round(+n.dataset.count * ease); });
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    counterIO.observe($("#stats"));
  }

  /* ---------------- toasts ---------------- */
  function toast(icon, title, text, ms = 3400) {
    const box = $("#toasts");
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `<span class="t-ic" aria-hidden="true">${icon}</span><div><small>${title}</small><b>${text}</b></div>`;
    box.appendChild(el);
    while (box.children.length > 3) box.firstElementChild.remove();
    setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 400); }, ms);
  }

  /* ---------------- boot screen ---------------- */
  function boot() {
    const el = $("#boot");
    let seen = false;
    try { seen = sessionStorage.getItem("booted") === "1"; sessionStorage.setItem("booted", "1"); } catch (_) {}
    if (reduce || seen || !el) { el && el.remove(); return Promise.resolve(); }
    const lines = ui("boot");
    const out = $("#boot-lines"), fill = $("#boot-fill"), pct = $("#boot-pct");
    return new Promise((resolve) => {
      let i = 0, done = false;
      const finish = () => {
        if (done) return;
        done = true;
        el.classList.add("done");
        setTimeout(() => el.remove(), 700);
        resolve();
      };
      el.addEventListener("click", finish);
      window.addEventListener("keydown", finish, { once: true });
      const step = () => {
        if (done) return;
        out.insertAdjacentHTML("beforeend", `<span class="ok">[ OK ]</span> ${escapeHTML(lines[i])}\n`);
        i++;
        const p = Math.round((i / lines.length) * 100);
        fill.style.width = p + "%";
        pct.textContent = p + "%";
        if (i >= lines.length) setTimeout(finish, 480);
        else setTimeout(step, 170 + Math.random() * 110);
      };
      setTimeout(step, 220);
    });
  }

  /* ---------------- typing roles ---------------- */
  const typer = (() => {
    const el = $("#typer-text");
    let ri = 0, ci = 0, del = false, timer = 0;
    function tick() {
      const roles = t(C.roles);
      const word = Array.from(roles[ri % roles.length]);
      if (!del) {
        el.textContent = word.slice(0, ++ci).join("");
        if (ci >= word.length) { del = true; timer = setTimeout(tick, 1700); return; }
      } else {
        el.textContent = word.slice(0, --ci).join("");
        if (ci <= 0) { del = false; ri++; timer = setTimeout(tick, 320); return; }
      }
      timer = setTimeout(tick, del ? 30 : 62 + Math.random() * 45);
    }
    return {
      start() {
        clearTimeout(timer);
        ri = 0; ci = 0; del = false;
        if (reduce) { el.textContent = t(C.roles)[0]; return; }
        tick();
      },
    };
  })();

  /* ---------------- hero: glitch, tilt, orbiters, parallax ---------------- */
  function heroFx() {
    const name = $("#name"), portrait = $(".hc-portrait");
    const glitch = () => {
      name.classList.add("is-glitching");
      portrait.classList.add("glitchy");
      setTimeout(() => { name.classList.remove("is-glitching"); portrait.classList.remove("glitchy"); }, 520);
    };
    name.addEventListener("mouseenter", glitch);
    if (!reduce) (function loop() { setTimeout(() => { if (!document.hidden) glitch(); loop(); }, 4200 + Math.random() * 4200); })();

    const hero = $("#home"), stage = $("#card-stage"), holo = $("#holo");
    if (finePointer && !reduce) {
      hero.addEventListener("pointermove", (e) => {
        hero.style.setProperty("--px", ((e.clientX / window.innerWidth - 0.5) * 2).toFixed(3));
        hero.style.setProperty("--py", ((e.clientY / window.innerHeight - 0.5) * 2).toFixed(3));
      });
      stage.addEventListener("pointermove", (e) => {
        const r = holo.getBoundingClientRect();
        const px = clamp((e.clientX - r.left) / r.width, 0, 1), py = clamp((e.clientY - r.top) / r.height, 0, 1);
        holo.classList.add("tilting");
        holo.style.setProperty("--ry", `${((px - 0.5) * 26).toFixed(2)}deg`);
        holo.style.setProperty("--rx", `${((0.5 - py) * 22).toFixed(2)}deg`);
        holo.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        holo.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      });
      stage.addEventListener("pointerleave", () => {
        holo.classList.remove("tilting");
        holo.style.setProperty("--rx", "0deg");
        holo.style.setProperty("--ry", "0deg");
        holo.style.setProperty("--mx", "50%");
        holo.style.setProperty("--my", "50%");
      });
    }

    // a halo of stickers orbiting the top of the card: in front above it, behind it lower down,
    // so they never cover the card's text
    const items = $$("#orbit .orbiter");
    let visible = true;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(stage);
    const place = (time) => {
      const small = window.innerWidth < 640;
      const Rx = small ? 172 : 236, Ry = small ? 46 : 62, cy = small ? -172 : -206, tilt = -0.1;
      items.forEach((el, i) => {
        const a = time * 0.00032 + (i / items.length) * Math.PI * 2;
        const x = Math.cos(a) * Rx, y = Math.sin(a) * Ry;
        const depth = (1 - Math.sin(a)) / 2; // 1 = top of the halo = closest to the viewer
        const X = x * Math.cos(tilt) - y * Math.sin(tilt), Y = x * Math.sin(tilt) + y * Math.cos(tilt) + cy;
        el.style.transform = `translate(${X.toFixed(1)}px, ${Y.toFixed(1)}px) scale(${(0.74 + 0.32 * depth).toFixed(3)})`;
        el.style.zIndex = depth > 0.5 ? 3 : 1;
        el.style.opacity = (0.5 + 0.5 * depth).toFixed(2);
      });
    };
    if (reduce) place(0);
    else (function frame(time) { if (visible && !document.hidden) place(time); requestAnimationFrame(frame); })(0);

    const pauseIO = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle("paused", !e.isIntersecting)));
    pauseIO.observe(hero);
    pauseIO.observe($(".marquee"));
  }

  /* ---------------- tilt on project cards ---------------- */
  function bindLootTilt() {
    if (!finePointer || reduce) return;
    $$(".loot").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.classList.add("tilting");
        card.style.setProperty("--ry", `${((px - 0.5) * 12).toFixed(2)}deg`);
        card.style.setProperty("--rx", `${((0.5 - py) * 12).toFixed(2)}deg`);
        card.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        card.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      });
      card.addEventListener("pointerleave", () => {
        card.classList.remove("tilting");
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }

  /* ---------------- magnetic buttons ---------------- */
  function magnetic() {
    if (!finePointer || reduce) return;
    $$(".magnetic").forEach((b) => {
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        b.style.setProperty("--tx", `${((e.clientX - r.left - r.width / 2) * 0.28).toFixed(1)}px`);
        b.style.setProperty("--ty", `${((e.clientY - r.top - r.height / 2) * 0.38).toFixed(1)}px`);
      });
      b.addEventListener("pointerleave", () => { b.style.setProperty("--tx", "0px"); b.style.setProperty("--ty", "0px"); });
    });
  }

  /* ---------------- nav, XP bar, level, parallax ---------------- */
  const nav = $("#nav"), menuBtn = $("#menu-btn");
  function navClose() {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  function navSetup() {
    menuBtn.addEventListener("click", () => {
      const open = !nav.classList.contains("open");
      nav.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    $$(".nav-links a").forEach((a) => a.addEventListener("click", navClose));
  }

  const secIds = ["about", "quests", "lab", "gadgets", "academy", "skills", "achievements", "photos", "side", "contact"];
  let currentSec = null, leveledUp = false, ticking = false;
  function onScroll() {
    ticking = false;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    $("#xp").style.transform = `scaleX(${max > 0 ? clamp(y / max, 0, 1).toFixed(4) : 0})`;

    let cur = "home";
    for (const id of secIds) if (document.getElementById(id).getBoundingClientRect().top <= window.innerHeight * 0.42) cur = id;
    if (cur !== currentSec) {
      currentSec = cur;
      const lv = $("#lv");
      lv.textContent = `LV.${String(cur === "home" ? 0 : secIds.indexOf(cur) + 1).padStart(2, "0")}`;
      lv.classList.remove("bump");
      void lv.offsetWidth;
      lv.classList.add("bump");
      $$(".nav-links a").forEach((a) => a.classList.toggle("active", a.dataset.sec === cur));
      if (cur !== "home") Mascot.react(cur);
    }

    const tl = $("#timeline"), r = tl.getBoundingClientRect();
    tl.style.setProperty("--p", clamp((window.innerHeight * 0.55 - r.top) / r.height, 0, 1).toFixed(4));

    const photo = $("#photo-card"), pr = photo.getBoundingClientRect();
    if (!reduce && pr.bottom > 0 && pr.top < window.innerHeight) {
      photo.style.setProperty("--py", `${(((pr.top + pr.height / 2 - window.innerHeight / 2) / window.innerHeight) * -40).toFixed(1)}px`);
    }

    $("#to-top").classList.toggle("show", y > window.innerHeight * 1.2);

    if (!leveledUp && max > 400 && y >= max - 8) {
      leveledUp = true;
      toast("🎉", ui("toast.level"), ui("toast.levelText"));
      FX.confetti(160);
      Mascot.setFace("love", 2400);
      Mascot.say(t(C.mascot.levelUp));
    }
  }
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener("resize", () => requestAnimationFrame(onScroll));

  /* ---------------- achievements ---------------- */
  function setupAchievements() {
    const grid = $("#ach-grid");
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      achUnlocked = true;
      const items = $$(".ach", grid);
      const gap = reduce ? 0 : 170;
      items.forEach((a, i) => setTimeout(() => {
        a.classList.remove("locked");
        a.classList.add("unlocking");
        setTimeout(() => a.classList.remove("unlocking"), 1100);
      }, (reduce ? 0 : 250) + i * gap));
      setTimeout(() => {
        toast("🏆", ui("toast.ach"), ui("toast.achText"));
        const r = grid.getBoundingClientRect();
        FX.burst(r.left + r.width / 2, r.top + Math.min(r.height / 2, window.innerHeight / 2), 26);
      }, (reduce ? 0 : 250) + items.length * gap);
    }, { threshold: 0.3 });
    io.observe(grid);
  }

  /* ---------------- contact: email, clock, terminal ---------------- */
  function contactSetup() {
    $$('a[href^="mailto:"]').forEach((a) => { a.href = "mailto:" + C.profile.email; });
    $("#email-big").textContent = C.profile.email;
    $$("[data-copy]").forEach((b) => b.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(C.profile.email);
        toast("📋", ui("toast.copied"), ui("toast.copiedText"), 2400);
      } catch (_) {
        window.location.href = "mailto:" + C.profile.email;
      }
    }));
    clock();
    setInterval(clock, 30000);
  }

  function clock() {
    const now = new Date();
    try {
      const tz = C.profile.timezone;
      const time = new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", { timeZone: tz, hour: "numeric", minute: "2-digit", hour12: lang !== "zh" }).format(now);
      const zone = (new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "short" }).formatToParts(now).find((p) => p.type === "timeZoneName") || {}).value || "";
      const hr = parseInt(new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", hourCycle: "h23" }).format(now), 10);
      $("#clock-time").textContent = `${time} ${zone}`.trim();
      const moods = ui("clockMood");
      $("#clock-mood").textContent = moods[hr < 7 ? 0 : hr < 12 ? 1 : hr < 18 ? 2 : 3];
    } catch (_) { /* very old browser: leave the placeholder */ }
  }

  const terminal = (() => {
    const el = $("#terminal");
    let started = false, timer = 0;
    function run() {
      clearTimeout(timer);
      const lines = ui("terminal").map(escapeHTML);
      if (reduce) { el.innerHTML = `<span class="cmd">${lines[0]}</span>\n${lines.slice(1).join("\n")}\n<span class="cur"></span>`; return; }
      let html = "", li = 0, ci = 0;
      const cmd = Array.from(ui("terminal")[0]);
      const step = () => {
        if (li === 0) {
          ci++;
          el.innerHTML = `<span class="cmd">${escapeHTML(cmd.slice(0, ci).join(""))}</span><span class="cur"></span>`;
          if (ci >= cmd.length) { html = `<span class="cmd">${lines[0]}</span>\n`; li = 1; timer = setTimeout(step, 450); return; }
          timer = setTimeout(step, 55);
          return;
        }
        if (li >= lines.length) { el.innerHTML = html + '<span class="cur"></span>'; return; }
        html += lines[li++] + "\n";
        el.innerHTML = html + '<span class="cur"></span>';
        timer = setTimeout(step, 360);
      };
      step();
    }
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      started = true;
      run();
    }, { threshold: 0.4 });
    io.observe(el);
    return { rerun() { if (started) run(); } };
  })();

  /* ---------------- photo viewer ---------------- */
  const lightbox = (() => {
    const box = $("#lightbox"), img = $("#lb-img"), cap = $("#lb-cap"), count = $("#lb-count");
    const buttons = [$("#lb-close"), $("#lb-prev"), $("#lb-next")];
    let idx = 0, open = false, lastFocus = null, touchX = null;
    function show(i) {
      idx = (i + C.gallery.length) % C.gallery.length;
      const g = C.gallery[idx];
      img.src = g.src;
      img.width = g.w;
      img.height = g.h;
      img.alt = t(g.alt);
      cap.innerHTML = t(g.caption);
      count.textContent = `${idx + 1} / ${C.gallery.length}`;
      if (!reduce) { box.classList.remove("swap"); void box.offsetWidth; box.classList.add("swap"); }
    }
    function openAt(i) {
      lastFocus = document.activeElement;
      show(i);
      open = true;
      box.classList.add("open");
      box.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => buttons[0].focus());
    }
    function close() {
      if (!open) return;
      open = false;
      box.classList.remove("open");
      box.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    $("#gallery").addEventListener("click", (e) => {
      const a = e.target.closest(".polaroid");
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return; // modified clicks still open the full image
      e.preventDefault();
      openAt(+a.dataset.idx);
    });
    box.addEventListener("click", (e) => { if (e.target === box) close(); });
    buttons[0].addEventListener("click", close);
    buttons[1].addEventListener("click", () => show(idx - 1));
    buttons[2].addEventListener("click", () => show(idx + 1));
    window.addEventListener("keydown", (e) => {
      if (!open) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(idx - 1);
      else if (e.key === "ArrowRight") show(idx + 1);
      else if (e.key === "Tab") { // keep keyboard focus inside the viewer
        e.preventDefault();
        const k = buttons.indexOf(document.activeElement);
        buttons[(k + (e.shiftKey ? buttons.length - 1 : 1) + buttons.length) % buttons.length].focus();
      }
    });
    box.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
      touchX = null;
    });
    return { get open() { return open; }, refresh() { if (open) show(idx); } };
  })();

  /* ---------------- easter eggs ---------------- */
  const KONAMI = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
  let kIdx = 0, party = false;
  function toggleParty() {
    party = !party;
    document.body.classList.toggle("party", party);
    toast("🎮", ui("toast.party"), ui(party ? "toast.partyOn" : "toast.partyOff"));
    if (party) { FX.confetti(220); Mascot.setFace("love", 2500); Mascot.say(t(C.mascot.party)); }
  }
  const typingTarget = (e) => e.target.closest && e.target.closest("input, textarea, select, [contenteditable='true']");
  window.addEventListener("keydown", (e) => {
    const k = String(e.key).toLowerCase();
    if (k === KONAMI[kIdx]) { if (++kIdx === KONAMI.length) { kIdx = 0; toggleParty(); } }
    else kIdx = k === KONAMI[0] ? 1 : 0;
    if (k === "escape") navClose();
    if (k === "d" && !Drive.active && !lightbox.open && !e.ctrlKey && !e.metaKey && !e.altKey && !typingTarget(e)) startDrive();
  });

  function startDrive() {
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    Drive.start();
  }

  function visibilityTitle() {
    const base = document.title;
    let timer = 0;
    document.addEventListener("visibilitychange", () => {
      clearTimeout(timer);
      if (document.hidden) document.title = ui("title.away");
      else { document.title = ui("title.back"); timer = setTimeout(() => { document.title = base; }, 1800); }
    });
  }

  /* ---------------- language switch ---------------- */
  function setLang(next) {
    lang = next;
    try { localStorage.setItem("lang", lang); } catch (_) {}
    const main = $("#main");
    if (!reduce) { main.classList.remove("flip"); void main.offsetWidth; main.classList.add("flip"); }
    applyStatic();
    renderAll(true);
    typer.start();
    clock();
    terminal.rerun();
    lightbox.refresh();
    toast(lang === "zh" ? "🀄" : "🔤", ui("toast.lang"), ui("toast.langText"), 2200);
  }

  /* ---------------- init ---------------- */
  applyStatic();
  renderBands();
  renderAll(false);
  heroFx();
  magnetic();
  navSetup();
  setupAchievements();
  contactSetup();
  visibilityTitle();
  Mascot.init({ t, lines: C.mascot });
  Drive.init({
    onStart(isTouch) {
      navClose();
      toast("🏎️", ui("toast.drive"), ui(isTouch ? "toast.driveTouch" : "toast.driveText"), 5200);
      Mascot.setFace("wow", 1200);
      Mascot.say(t(C.mascot.drive));
    },
    onDrift(pts) {
      if (pts > 300 && Math.random() < 0.6) { Mascot.setFace("happy", 1200); Mascot.say(`${t(C.mascot.drift)} +${pts}`, 1800); }
    },
  });

  $("#lang-btn").addEventListener("click", () => setLang(lang === "en" ? "zh" : "en"));
  $("#drive-btn").addEventListener("click", () => (Drive.active ? Drive.stop() : startDrive()));
  $("#drive-start").addEventListener("click", startDrive);
  $("#to-top").addEventListener("click", (e) => {
    const b = e.currentTarget;
    if (!reduce) { b.classList.add("launch"); setTimeout(() => b.classList.remove("launch"), 1000); }
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });

  onScroll();
  boot().then(() => {
    document.body.classList.add("booted");
    typer.start();
    Mascot.greet();
  });

  console.log("%c ᓚᘏᗢ  hi there, fellow developer!", "font: 700 16px Fredoka, sans-serif; color: #ff4ecd");
  console.log(`%cThis page is hand-rolled HTML/CSS/JS, no frameworks. Want to chat? ${C.profile.email}`, "color: #3ef7ff");
})();
