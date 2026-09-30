/* ==========================================================================
   gallery.js: "The Darkroom" photography section.
   Masonry grid (JS columns, so "load more" never reshuffles what's on screen),
   year filters, batches that "develop" in like prints in a tray, and a
   live-view style viewer with an EXIF HUD. Data comes from photos.js.
   ========================================================================== */
window.Gallery = (() => {
  const P = window.PHOTOS || { albums: {}, items: [] };
  const ITEMS = P.items.filter((p) => !p.hidden); // tools/photo-editor.html can hide photos
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const year = (p) => p.album.slice(0, 4);
  const years = [...new Set(ITEMS.map(year))].sort().reverse();

  let t = (v) => (v && typeof v === "object" ? v.en : v);
  let ui = (k) => k;
  let grid, chipsEl, statsEl, moreBtn, endEl;
  let filter = "all", list = [], shown = 0, cols = [], heights = [], nCols = 0;

  /* ---------------- data helpers ---------------- */
  function ordered(f) {
    if (f !== "all") return ITEMS.filter((p) => year(p) === f); // photos.js is already newest first
    const featured = ITEMS.filter((p) => p.featured).sort((a, b) => a.featured - b.featured);
    return featured.concat(ITEMS.filter((p) => !p.featured));
  }
  const batch = () => (window.innerWidth < 640 ? 12 : 20);
  const colCount = () => {
    const w = grid.clientWidth || window.innerWidth;
    return w < 520 ? 2 : w < 860 ? 3 : 4;
  };
  function meta(p) {
    const a = P.albums[p.album] || {};
    const place = p.place || a.place; // a photo can override its album's place
    return [t(a.title), place && t(place), p.album.replace(/-/g, ".")].filter(Boolean).join(" · ");
  }
  function settings(p) {
    if (p.film) return `${ui("dr.film")} · ${p.film}`;
    const e = p.exif || {};
    return [e.focal, e.f, e.ss, e.iso].filter(Boolean).join(" · ");
  }

  /* ---------------- grid ---------------- */
  function tile(p, i) {
    const a = document.createElement("a");
    a.className = "shot";
    a.href = p.src;
    a.dataset.i = i;
    a.style.setProperty("--c", p.color);
    a.style.aspectRatio = `${p.tw} / ${p.th}`;
    a.setAttribute("aria-label", ui("dr.open").replace("{t}", t(p.title)));
    a.innerHTML = `
      <img src="${p.thumb}" alt="${esc(t(p.title))}" width="${p.tw}" height="${p.th}" loading="lazy" decoding="async" />
      <span class="shot-vf" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
      <span class="shot-cap" aria-hidden="true"><b>${esc(t(p.title))}</b><small>${esc(settings(p) || meta(p))}</small></span>`;
    const img = a.firstElementChild;
    const develop = () => a.classList.add("dev");
    if (img.complete && img.naturalWidth) develop();
    else {
      img.addEventListener("load", develop, { once: true });
      img.addEventListener("error", develop, { once: true });
    }
    return a;
  }

  function add(n) {
    const end = Math.min(list.length, shown + n);
    for (let i = shown; i < end; i++) {
      const p = list[i];
      let c = 0;
      for (let k = 1; k < nCols; k++) if (heights[k] < heights[c] - 0.01) c = k; // shortest column, ties go left
      cols[c].appendChild(tile(p, i));
      heights[c] += p.th / p.tw + 0.05; // aspect + gap, in column-width units
    }
    shown = end;
    updateMore();
  }

  function build() {
    nCols = colCount();
    grid.innerHTML = "";
    cols = [];
    heights = [];
    for (let c = 0; c < nCols; c++) {
      const col = document.createElement("div");
      col.className = "dr-col";
      grid.appendChild(col);
      cols.push(col);
      heights.push(0);
    }
    const n = shown;
    shown = 0;
    add(n);
  }

  function updateMore() {
    const left = list.length - shown;
    moreBtn.hidden = left <= 0;
    moreBtn.innerHTML = `${ui("dr.more").replace("{n}", Math.min(batch(), left))} <small>${ui("dr.left").replace("{n}", left)}</small>`;
    endEl.hidden = left > 0;
    endEl.textContent = ui("dr.end");
  }

  function renderChips() {
    const count = (f) => (f === "all" ? ITEMS.length : ITEMS.filter((p) => year(p) === f).length);
    chipsEl.innerHTML = ["all", ...years]
      .map((f) => `<button type="button" class="dr-chip${f === filter ? " on" : ""}" data-f="${f}" aria-pressed="${f === filter}">${f === "all" ? ui("dr.all") : f}<sup>${count(f)}</sup></button>`)
      .join("");
  }

  function renderStats() {
    const rolls = new Set(ITEMS.map((p) => p.album)).size;
    statsEl.innerHTML = `<span><b>${ITEMS.length}</b> ${ui("dr.frames")}</span> · <span><b>${rolls}</b> ${ui("dr.rolls")}</span> · <span><b>${years[years.length - 1]}</b> → <b>${years[0]}</b></span>`;
  }

  function setFilter(f) {
    filter = f;
    list = ordered(f);
    shown = Math.min(batch(), list.length);
    renderChips();
    build();
  }

  /* ---------------- viewer ---------------- */
  const V = {};
  let vIdx = 0, vOpen = false, lastFocus = null, touchX = null;

  function exifRows(p) {
    if (p.film) return `<li><em>FILM</em>${esc(p.film)}</li>`;
    const e = p.exif || {};
    const rows = [["CAM", e.cam], ["LENS", e.lens], ["FOCAL", e.focal], ["APERTURE", e.f], ["SHUTTER", e.ss], ["ISO", e.iso && e.iso.replace(/^ISO /, "")]];
    return rows.filter((r) => r[1]).map(([k, v]) => `<li><em>${k}</em>${esc(v)}</li>`).join(""); // some exports carry no EXIF: show nothing
  }

  function vShow(i) {
    vIdx = (i + list.length) % list.length;
    const p = list[vIdx];
    V.screen.classList.remove("ready");
    V.img.onload = () => V.screen.classList.add("ready");
    V.img.width = p.w;
    V.img.height = p.h;
    V.img.src = p.src;
    if (V.img.complete && V.img.naturalWidth) V.screen.classList.add("ready");
    V.img.alt = t(p.title);
    V.title.textContent = t(p.title);
    V.meta.textContent = meta(p);
    V.count.textContent = `${String(vIdx + 1).padStart(3, "0")} / ${String(list.length).padStart(3, "0")}`;
    V.exif.innerHTML = exifRows(p);
    V.exif.style.display = V.exif.innerHTML ? "" : "none";
    [vIdx + 1, vIdx - 1].forEach((k) => { new Image().src = list[(k + list.length) % list.length].src; }); // preload neighbours
  }

  function vOpenAt(i) {
    lastFocus = document.activeElement;
    vShow(i);
    vOpen = true;
    V.box.classList.add("open");
    V.box.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => V.buttons[0].focus());
  }

  function vClose() {
    if (!vOpen) return;
    vOpen = false;
    V.box.classList.remove("open");
    V.box.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ---------------- public ---------------- */
  function init(opts) {
    t = opts.t;
    ui = opts.ui;
    grid = $("#dr-grid");
    chipsEl = $("#dr-chips");
    statsEl = $("#dr-stats");
    moreBtn = $("#dr-more");
    endEl = $("#dr-end");
    if (!grid || !ITEMS.length) return;
    Object.assign(V, {
      box: $("#viewer"), screen: $("#vw-screen"), img: $("#vw-img"), title: $("#vw-title"),
      meta: $("#vw-meta"), count: $("#vw-count"), exif: $("#vw-exif"),
      buttons: [$("#vw-close"), $("#vw-prev"), $("#vw-next")],
    });

    renderStats();
    setFilter("all");

    chipsEl.addEventListener("click", (e) => {
      const b = e.target.closest(".dr-chip");
      if (b && b.dataset.f !== filter) setFilter(b.dataset.f);
    });
    moreBtn.addEventListener("click", () => add(batch()));
    grid.addEventListener("click", (e) => {
      const a = e.target.closest(".shot");
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // modified clicks open the file itself
      e.preventDefault();
      vOpenAt(+a.dataset.i);
    });

    V.box.addEventListener("click", (e) => { if (e.target === V.box) vClose(); });
    V.buttons[0].addEventListener("click", vClose);
    V.buttons[1].addEventListener("click", () => vShow(vIdx - 1));
    V.buttons[2].addEventListener("click", () => vShow(vIdx + 1));
    window.addEventListener("keydown", (e) => {
      if (!vOpen) return;
      if (e.key === "Escape") vClose();
      else if (e.key === "ArrowLeft") vShow(vIdx - 1);
      else if (e.key === "ArrowRight") vShow(vIdx + 1);
      else if (e.key === "Tab") { // keep focus inside the viewer
        e.preventDefault();
        const k = V.buttons.indexOf(document.activeElement);
        V.buttons[(k + (e.shiftKey ? V.buttons.length - 1 : 1) + V.buttons.length) % V.buttons.length].focus();
      }
    });
    V.box.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    V.box.addEventListener("touchend", (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) vShow(vIdx + (dx < 0 ? 1 : -1));
      touchX = null;
    });

    let rt;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(() => { if (colCount() !== nCols) build(); }, 150);
    });
  }

  function refresh() { // language switch: update text in place, keep what's developed
    if (!grid || !ITEMS.length) return;
    renderStats();
    renderChips();
    updateMore();
    grid.querySelectorAll(".shot").forEach((a) => {
      const p = list[+a.dataset.i];
      a.setAttribute("aria-label", ui("dr.open").replace("{t}", t(p.title)));
      a.querySelector("img").alt = t(p.title);
      a.querySelector(".shot-cap b").textContent = t(p.title);
      a.querySelector(".shot-cap small").textContent = settings(p) || meta(p);
    });
    if (vOpen) vShow(vIdx);
  }

  return { init, refresh, get open() { return vOpen; } };
})();
