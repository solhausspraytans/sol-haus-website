/* Sol Haus — site behaviour. Content lives in config.js; you shouldn't need to edit this file. */
(function () {
  "use strict";
  const C = window.SOL_HAUS || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const page = (location.pathname.split("/").pop() || "index.html").replace(/^$/, "index.html");

  /* ---------- link resolution (never a dead button) ---------- */
  const FALLBACK = { bookingBridal: "#form:bridal", bookingGroup: "#form:group", bookingCompetition: "booking" };
  function resolve(key) {
    const L = C.links || {};
    if (L[key]) return { href: L[key], external: true };
    const fb = FALLBACK[key];
    if (fb && fb.startsWith("#form:")) {
      const id = fb.slice(6);
      return { href: (document.getElementById(id + "-inquiry") ? "" : "forms.html") + "#" + id + "-inquiry", external: false };
    }
    if (fb) return resolve(fb);
    if (key === "booking" && C.business && C.business.email) return { href: "mailto:" + C.business.email + "?subject=Booking%20request", external: true };
    return null;
  }
  function applyLinks(root = document) {
    $$("[data-link]", root).forEach((a) => {
      // optional accounts: hide their buttons entirely until a link is added in config.js
      if (["tiktok"].includes(a.dataset.link) && !(C.links || {})[a.dataset.link]) { (a.closest("li") || a).remove(); return; }
      const r = resolve(a.dataset.link);
      if (r) {
        a.href = r.href;
        if (r.external && /^https?:/.test(r.href)) { a.target = "_blank"; a.rel = "noopener"; }
        a.removeAttribute("aria-disabled"); a.classList.remove("is-pending");
      } else {
        a.removeAttribute("href");
        a.setAttribute("aria-disabled", "true");
        a.setAttribute("role", "link");
        a.setAttribute("tabindex", "0");
        a.classList.add("is-pending");
        a.title = "Coming soon";
      }
    });
  }

  /* ---------- shared header / footer ---------- */
  const EDITS = [["everyday.html", "Everyday Tan"], ["bridal.html", "Bridal Tan"], ["competition.html", "Competition Tan"]];
  const NAV = [
    ["#edits", "The Edits", EDITS], ["pricing.html", "Pricing"], ["before-your-glow.html", "Before Your Glow"],
    ["reviews.html", "Love Letters"], ["about.html", "About"], ["shop.html", "Shop"],
  ];
  const FLAT = [["index.html", "Home"], ...EDITS, ["pricing.html", "Pricing"], ["before-your-glow.html", "Before Your Glow"], ["reviews.html", "Love Letters"], ["about.html", "About"], ["shop.html", "Shop"]];
  const cur = (h) => (h === page ? ' aria-current="page"' : "");
  const navItem = ([h, t, sub]) => sub
    ? `<li class="has-sub"><button class="sub-toggle" aria-expanded="false"${sub.some(([x]) => x === page) ? ' data-current="true"' : ""}>${t}<span aria-hidden="true">▾</span></button><ul class="sub">${sub.map(([x, y]) => `<li><a href="${x}"${cur(x)}>${y}</a></li>`).join("")}</ul></li>`
    : `<li><a href="${h}"${cur(h)}>${t}</a></li>`;
  const ICON = {
    ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="17.5" cy="6.5" r="1.1" fill="currentColor"/></svg>',
    tt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M14 3c.4 2.6 2.2 4.4 5 4.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    up: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 14l6-6 6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  };

  function chrome() {
    const A = C.announcement || {};
    let hidden = false;
    try { hidden = sessionStorage.getItem("sh-ann") === A.text; } catch (e) {}
    if (A.show && A.text && !hidden) {
      const bar = document.createElement("div");
      bar.className = "announce";
      bar.innerHTML = `<p>${esc(A.text)}</p><button class="announce__x" aria-label="Hide announcement">×</button>`;
      document.body.prepend(bar);
      $(".announce__x", bar).addEventListener("click", () => { bar.remove(); try { sessionStorage.setItem("sh-ann", A.text); } catch (e) {} });
    }
    const header = $("#site-header");
    if (header) {
      header.className = "site-header";
      header.innerHTML = `
        <a class="skip" href="#main">Skip to content</a>
        <div class="site-header__inner">
          <a class="brand" href="index.html" aria-label="Sol Haus home"><img class="brand__badge" src="images/brand/illustration-badge.png" alt="" width="52" height="52"><span class="wordmark"><span>SOL HAUS</span><em>spray tans</em></span></a>
          <nav class="nav" aria-label="Main">
            <ul>${NAV.map(navItem).join("")}</ul>
          </nav>
          <div class="site-header__actions">
            <a class="icon-link" data-link="instagram" aria-label="Sol Haus on Instagram">${ICON.ig}</a>
            <a class="btn btn--pink btn--sm" data-link="booking" data-chooser>Book now</a>
            <button class="menu-toggle" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span><span class="sr">Menu</span></button>
          </div>
        </div>
        <div class="mobile-menu" id="mobile-menu" hidden>
          <ul>
            <li><a href="index.html"${cur("index.html")}>Home</a></li>
            <li class="mobile-menu__group"><p class="eyebrow">The Edits</p><ul>${EDITS.map(([h, t]) => `<li><a href="${h}"${cur(h)}>${t}</a></li>`).join("")}</ul></li>
            ${NAV.slice(1).map(([h, t]) => `<li><a href="${h}"${cur(h)}>${t}</a></li>`).join("")}
          </ul>
          <p class="script">your glow era</p>
          <div class="mobile-menu__social"><a data-link="instagram">${ICON.ig} Instagram</a><a data-link="tiktok">${ICON.tt} TikTok</a></div>
        </div>`;
      const btn = $(".menu-toggle", header), menu = $("#mobile-menu");
      header.after(menu); // keep the full-screen menu outside the blurred header
      const setMenu = (open) => {
        menu.style.top = Math.max(0, header.getBoundingClientRect().bottom) + "px";
        btn.setAttribute("aria-expanded", open); menu.hidden = !open;
        document.body.classList.toggle("menu-open", open);
        if (open) $("a", menu).focus();
      };
      btn.addEventListener("click", () => setMenu(btn.getAttribute("aria-expanded") !== "true"));
      document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { setMenu(false); btn.focus(); } });
      $$(".sub-toggle", header).forEach((b) => {
        b.addEventListener("click", (e) => { e.stopPropagation(); const o = b.getAttribute("aria-expanded") !== "true"; b.setAttribute("aria-expanded", o); });
      });
      document.addEventListener("click", () => $$(".sub-toggle", header).forEach((b) => b.setAttribute("aria-expanded", "false")));
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") $$(".sub-toggle", header).forEach((b) => b.setAttribute("aria-expanded", "false")); });
      const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 30);
      addEventListener("scroll", onScroll, { passive: true }); onScroll();
    }

    const footer = $("#site-footer");
    if (footer) {
      const B = C.business || {};
      footer.className = "site-footer";
      footer.innerHTML = `
        <div class="stripes stripes--band" aria-hidden="true"></div>
        <div class="site-footer__inner">
          <div class="site-footer__brand">
            <img class="footer-illustration" src="images/brand/illustration.png" alt="Sol Haus signature illustration" width="160" height="200" loading="lazy">
            <div>
              <p class="wordmark wordmark--lg"><span>SOL HAUS</span><em>spray tans</em></p>
              <p class="script script--pink">enhance your good genes</p>
            </div>
          </div>
          <nav class="site-footer__col" aria-label="Footer">
            <h2 class="eyebrow">Explore</h2>
            <ul>${[...FLAT, ["social.html", "Keep Up with the Haus"]].map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join("")}</ul>
          </nav>
          <div class="site-footer__col">
            <h2 class="eyebrow">Clients</h2>
            <ul>
              <li><a href="forms.html">Client forms</a></li>
              <li><a href="before-your-glow.html#faq">FAQs</a></li>
              <li><a href="policies.html#cancellation">Cancellation policy</a></li>
              <li><a href="policies.html#privacy">Privacy policy</a></li>
              <li><a data-link="googleReviewLeave">Leave a Google review</a></li>
              ${C.links && C.links.giftCards ? '<li><a data-link="giftCards">Gift cards</a></li>' : ""}
            </ul>
          </div>
          <div class="site-footer__col">
            <h2 class="eyebrow">Say hello</h2>
            <ul>
              ${B.email ? `<li><a href="mailto:${esc(B.email)}">${esc(B.email)}</a></li>` : '<li class="muted">Email coming soon</li>'}
              <li><a data-link="instagram">${ICON.ig} Instagram</a></li>
              <li><a data-link="tiktok">${ICON.tt} TikTok</a></li>
            </ul>
            <p class="small">${esc(B.serviceArea || "")}</p>
            ${C.forms && C.forms.newsletter ? `<div data-form="newsletter"></div>` : ""}
          </div>
        </div>
        <div class="site-footer__base"><p>© <span data-year></span> Sol Haus Spray Tans · Mobile spray tanning · ${esc(B.serviceAreaShort || "")}</p></div>`;
    }

    // Mobile sticky book + back to top
    const top = document.createElement("button");
    top.className = "to-top"; top.setAttribute("aria-label", "Back to top"); top.innerHTML = ICON.up;
    top.addEventListener("click", () => scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" }));
    document.body.append(top);
    addEventListener("scroll", () => {
      const y = scrollY;
      top.classList.toggle("is-on", y > 900);
    }, { passive: true });
    $$("[data-year]").forEach((n) => (n.textContent = new Date().getFullYear()));
  }

  /* ---------- gallery item ---------- */
  const img = (it, eager) => `<img src="${esc(it.src)}" alt="${esc(it.alt || "")}"${it.position ? ` style="object-position:${esc(it.position)}"` : ""} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" draggable="false">`;

  /* ---------- continuous marquee (drag / swipe / pause, reduced-motion aware) ---------- */
  class Marquee {
    constructor(root) {
      this.root = root;
      this.items = (C.galleries || {})[root.dataset.gallery] || [];
      this.dir = root.dataset.direction === "right" ? 1 : -1;
      this.speed = parseFloat(root.dataset.speed || "38");
      this.x = 0; this.paused = false; this.hover = false; this.visible = true; this.dragging = false;
      if (!this.items.length) { root.innerHTML = '<p class="empty">Photos coming soon.</p>'; return; }
      this.track = document.createElement("div");
      this.track.className = "marquee__track";
      root.append(this.track);
      this.btn = root.parentElement.querySelector("[data-marquee-toggle]") || root.querySelector("[data-marquee-toggle]");
      this.build();
      this.bind();
      reduceMotion.addEventListener?.("change", () => this.build());
    }
    build() {
      const eager = this.root.dataset.eager === "true";
      const unit = this.items.map((it, i) => `<figure class="m-item m-item--${esc(it.shape || "square")}">${img(it, eager && i < 4)}</figure>`).join("");
      this.static = reduceMotion.matches;
      this.root.classList.toggle("is-static", this.static);
      if (this.static) { this.track.innerHTML = unit; this.track.style.transform = ""; if (this.btn) this.btn.hidden = true; return; }
      if (this.btn) this.btn.hidden = false;
      this.track.innerHTML = `<div class="marquee__set">${unit}</div>`;
      const set = this.track.firstElementChild;
      // repeat until one set is wider than the screen, then clone once for the seamless loop
      let guard = 0;
      while (set.scrollWidth < innerWidth * 1.2 && guard++ < 6) set.insertAdjacentHTML("beforeend", unit);
      const clone = set.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.querySelectorAll("img").forEach((i) => (i.alt = ""));
      this.track.append(clone);
      this.measure();
      if (!this.running) { this.running = true; this.last = performance.now(); requestAnimationFrame((t) => this.tick(t)); }
    }
    measure() { const s = this.track.firstElementChild; this.w = s ? s.getBoundingClientRect().width : 0; }
    wrap() { if (!this.w) return; while (this.x <= -this.w) this.x += this.w; while (this.x > 0) this.x -= this.w; }
    tick(t) {
      if (this.static) { this.running = false; return; }
      const dt = Math.min(0.05, (t - this.last) / 1000); this.last = t;
      if (!this.paused && !this.hover && !this.dragging && this.visible) { this.x += this.dir * this.speed * dt; }
      this.wrap();
      this.track.style.transform = `translate3d(${this.x}px,0,0)`;
      requestAnimationFrame((n) => this.tick(n));
    }
    bind() {
      const r = this.root;
      if (this.btn) this.btn.addEventListener("click", () => {
        this.paused = !this.paused;
        this.btn.setAttribute("aria-pressed", this.paused);
        this.btn.querySelector("span").textContent = this.paused ? "Play" : "Pause";
      });
      if (matchMedia("(hover:hover)").matches) {
        r.addEventListener("mouseenter", () => (this.hover = r.dataset.hoverPause !== "false"));
        r.addEventListener("mouseleave", () => (this.hover = false));
      }
      let sx = 0, ox = 0, moved = 0;
      r.addEventListener("pointerdown", (e) => {
        if (this.static || e.button > 0) return;
        this.dragging = true; sx = e.clientX; ox = this.x; moved = 0;
        r.classList.add("is-dragging");
      });
      addEventListener("pointermove", (e) => {
        if (!this.dragging) return;
        const dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx));
        this.x = ox + dx; this.wrap();
      }, { passive: true });
      const end = () => { if (this.dragging) { this.dragging = false; r.classList.remove("is-dragging"); } };
      addEventListener("pointerup", end); addEventListener("pointercancel", end);
      r.addEventListener("click", (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
      new IntersectionObserver(([en]) => (this.visible = en.isIntersecting)).observe(r);
      let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => this.static ? null : this.build(), 250); });
      $$("img", r).forEach((i) => i.complete || i.addEventListener("load", () => this.measure(), { once: true }));
    }
  }

  /* ---------- homepage video hero ---------- */
  function heroVideo() {
    const V = C.heroVideo || {};
    const hero = $(".hero[data-home]");
    if (!hero || !V.src) return false;
    const mq = $(".marquee", hero); if (mq) mq.remove();
    const v = document.createElement("video");
    v.className = "hero__video"; v.src = V.src; v.muted = true; v.loop = true; v.playsInline = true;
    v.setAttribute("playsinline", ""); v.setAttribute("aria-hidden", "true");
    if (V.poster) v.poster = V.poster;
    // blurred copy fills the wide screen behind the vertical video
    const bg = v.cloneNode(); bg.className = "hero__video-bg"; bg.muted = true;
    hero.classList.add("hero--video");
    hero.prepend(v); hero.prepend(bg);
    if (!reduceMotion.matches) bg.play().catch(() => {});
    const btn = $("[data-marquee-toggle]", hero);
    if (reduceMotion.matches) { if (btn) { btn.setAttribute("aria-pressed", "true"); btn.querySelector("span").textContent = "Play"; } }
    else v.play().catch(() => {});
    if (btn) btn.addEventListener("click", () => {
      const bgv = $(".hero__video-bg", hero);
      if (v.paused) { v.play(); bgv && bgv.play(); btn.setAttribute("aria-pressed", "false"); btn.querySelector("span").textContent = "Pause"; }
      else { v.pause(); bgv && bgv.pause(); btn.setAttribute("aria-pressed", "true"); btn.querySelector("span").textContent = "Play"; }
    });
    return true;
  }

  /* ---------- swipe carousel (scroll-snap + arrows) ---------- */
  function carousel(el) {
    const track = $(".carousel__track", el);
    const prev = $("[data-prev]", el), next = $("[data-next]", el);
    if (!track) return;
    const step = () => (track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 24 : 300);
    const go = (d) => track.scrollBy({ left: d * step(), behavior: reduceMotion.matches ? "auto" : "smooth" });
    prev && prev.addEventListener("click", () => go(-1));
    next && next.addEventListener("click", () => go(1));
    const sync = () => {
      if (prev) prev.disabled = track.scrollLeft < 8;
      if (next) next.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 8;
    };
    track.addEventListener("scroll", sync, { passive: true }); addEventListener("resize", sync); setTimeout(sync, 100);
  }

  function renderGalleries() {
    $$("[data-gallery]").forEach((el) => {
      const items = (C.galleries || {})[el.dataset.gallery] || [];
      const v = el.dataset.variant || "marquee";
      if (v === "marquee") { if (el.closest(".hero[data-home]") && heroVideo()) return; return new Marquee(el); }
      if (!items.length) { el.innerHTML = '<p class="empty">Photos coming soon.</p>'; return; }
      if (v === "carousel") {
        el.classList.add("carousel");
        el.innerHTML = `<div class="carousel__track" tabindex="0" aria-label="Photo gallery — scroll or swipe">${items.map((it) => `<figure class="c-item c-item--${esc(it.shape || "tall")}">${img(it)}</figure>`).join("")}</div>
          <div class="carousel__nav"><button data-prev aria-label="Previous photos">←</button><button data-next aria-label="Next photos">→</button></div>`;
        carousel(el);
      } else if (v === "editorial") {
        el.classList.add("editorial");
        el.innerHTML = items.slice(0, 6).map((it, i) => `<figure class="ed ed--${i % 6} reveal">${img(it)}</figure>`).join("");
      } else if (v === "feed") {
        el.classList.add("feed");
        const ig = resolve("instagram");
        const lim = parseInt(el.dataset.limit || "0", 10);
        el.innerHTML = (el.hasAttribute("data-reel-tile") ? reelTile() : "") + (lim ? items.slice(0, lim) : items).map((it) => ig
          ? `<a class="feed__item reveal" href="${esc(ig.href)}" target="_blank" rel="noopener" aria-label="${esc(it.alt)} — view on Instagram">${img(it)}<span aria-hidden="true">${ICON.ig}</span></a>`
          : `<figure class="feed__item reveal">${img(it)}</figure>`).join("");
      }
    });
  }

  /* ---------- featured Instagram reel as a small feed square ---------- */
  function reelTile() {
    const R = C.reel || {};
    const url = (R.url || "").split("?")[0];
    if (!url) return "";
    const inner = R.video
      ? `<video src="${esc(R.video)}" ${R.poster ? `poster="${esc(R.poster)}"` : ""} ${reduceMotion.matches ? "" : "autoplay"} muted loop playsinline preload="metadata"></video>`
      : `<span class="reel-tile__art" aria-hidden="true"><span class="reel-tile__play"></span><span class="script">watch the reel</span></span>`;
    return `<a class="feed__item reel-tile reveal" href="${esc(url)}" target="_blank" rel="noopener" aria-label="Watch the Sol Haus reel on Instagram">${inner}<span class="reel-tile__badge" aria-hidden="true">${ICON.ig} Reel</span></a>`;
  }

  /* ---------- services, events, reviews ---------- */
  function renderServices() {
    $$("[data-services]").forEach((el) => {
      const which = el.dataset.services, noBook = el.hasAttribute("data-no-book");
      const list = (C.services || []).filter((s) => which === "all" || s.edit === which || which.split(",").includes(s.id));
      el.innerHTML = list.map((s, i) => `
        <article class="service ${s.image ? (i % 2 ? "service--flip" : "") : "service--text"} reveal" id="${esc(s.id)}">
          ${s.image ? `<figure class="service__img frame">${img({ src: s.image, alt: s.name + " — " + (s.kicker || "") })}</figure>` : ""}
          <div class="service__body">
            <p class="script">${esc(s.kicker || "")}</p>
            <h3 class="h3">${esc(s.name)}</h3>
            <p>${esc(s.description)}</p>
            <p class="service__meta"><span class="eyebrow">Processing</span> ${esc(s.processing || "")}</p>
            <p class="price">${s.price ? String(s.price).replace(/<(?!\/?small>)/g, '&lt;') : '<em class="muted">Pricing coming soon</em>'}</p>
            <div class="btn-row">
              ${noBook ? "" : `<a class="btn btn--green" data-link="${esc(s.bookingKey || "booking")}">Book now</a>`}
              ${s.page ? `<a class="link-arrow" href="${esc(s.page)}">Explore the edit</a>` : ""}
            </div>
          </div>
        </article>`).join("");
    });
  }
  function renderEvents() {
    const el = $("[data-events]"); if (!el) return;
    const ev = C.events || [];
    if (!ev.length) { el.innerHTML = `<div class="empty-state"><p class="script">dates coming soon</p><p>Upcoming competition appointments will be posted here. Follow along on Instagram for the first look.</p><a class="btn btn--outline" data-link="instagram">Follow Sol Haus</a></div>`; return; }
    el.innerHTML = `<ul class="events">${ev.map((e) => `
      <li class="event reveal">
        <div><p class="eyebrow">${esc(e.dates)}</p><h3 class="h4">${esc(e.name)}</h3><p class="muted">${esc(e.location)}</p></div>
        <div><p class="eyebrow">Appointments</p><p>${esc(e.bookingDates || "TBA")}</p></div>
        <div class="event__cta"><span class="status status--${esc((e.status || "").toLowerCase().replace(/\s+/g, "-"))}">${esc(e.status || "")}</span>
        ${e.url ? `<a class="btn btn--green btn--sm" href="${esc(e.url)}" target="_blank" rel="noopener">Book</a>` : ""}</div>
      </li>`).join("")}</ul>`;
  }
  function renderReviews() {
    $$("[data-reviews]").forEach((el) => {
      const r = C.reviews || [];
      if (!r.length) {
        el.innerHTML = `<p class="letters__empty">Love letters from clients will live here soon.</p>`;
        return;
      }
      el.classList.add("carousel", "carousel--reviews");
      el.innerHTML = `<div class="carousel__track" tabindex="0" aria-label="Client reviews">${r.map((x) => `
        <blockquote class="note note--light">
          ${x.stars ? `<p class="stars" aria-label="${x.stars} out of 5 stars">${"★".repeat(x.stars)}</p>` : ""}
          <p class="note__text">“${esc(x.text)}”</p>
          <footer>— ${esc(x.name)}${x.source ? ` <span class="muted">· ${esc(x.source)}</span>` : ""}</footer>
        </blockquote>`).join("")}</div>
        <div class="carousel__nav"><button data-prev aria-label="Previous review">←</button><button data-next aria-label="Next review">→</button></div>`;
      carousel(el);
    });
  }

  /* ---------- forms ---------- */
  const F = {
    bridal: { title: "Bridal inquiry", fields: [
      ["name", "Name", "text", 1, "name"], ["email", "Email", "email", 1, "email"], ["phone", "Phone", "tel", 0, "tel"],
      ["wedding_date", "Wedding date", "date", 1], ["location", "Wedding / getting-ready location (town)", "text", 1],
      ["clients", "Number of people to tan", "number", 0], ["trial", "Interested in a trial?", "select", 0, ["Yes", "No", "Not sure yet"]],
      ["details", "Anything else we should know?", "textarea", 0]] },
    group: { title: "Group tanning inquiry", fields: [
      ["name", "Name", "text", 1, "name"], ["email", "Email", "email", 1, "email"], ["phone", "Phone", "tel", 0, "tel"],
      ["event_date", "Event date", "date", 1], ["location", "Location (town)", "text", 1], ["clients", "Number of people", "number", 1],
      ["service", "Service type", "select", 0, ["Traditional", "Express", "Mix of both", "Not sure — advise me"]], ["details", "Details", "textarea", 0]] },
    competition: { title: "Competition inquiry", note: "If the dancer is under 18, a parent or guardian should complete this form.", fields: [
      ["dancer_name", "Dancer name", "text", 1], ["guardian_name", "Parent / guardian name (if dancer is under 18)", "text", 0],
      ["email", "Contact email", "email", 1, "email"], ["phone", "Contact phone", "tel", 0, "tel"],
      ["competition", "Competition name", "text", 1], ["event_date", "Event date", "date", 1],
      ["service", "Requested service", "select", 0, ["Competition tan", "Group / school appointment", "Not sure — advise me"]], ["details", "Details", "textarea", 0]] },
  };
  function renderForms() {
    $$("[data-form]").forEach((el) => {
      const key = el.dataset.form, url = (C.forms || {})[key], email = (C.business || {}).email;
      if (key === "newsletter") {
        el.innerHTML = `<form class="newsletter" action="${esc(url)}" method="POST"><label for="nl-email" class="eyebrow">Glow notes — occasional news & openings</label>
          <div class="newsletter__row"><input id="nl-email" type="email" name="email" required autocomplete="email" placeholder="Your email"><button class="btn btn--pink btn--sm">Sign up</button></div>
          <label class="consent"><input type="checkbox" name="consent" required> <span>I agree to receive emails from Sol Haus. Unsubscribe anytime.</span></label><p class="form-status" role="status"></p></form>`;
        wire($("form", el), url); return;
      }
      const def = F[key]; if (!def) return;
      // no on-site form service yet, but a booking form link exists → show a button to it
      const linkKey = { bridal: "bookingBridal", group: "bookingGroup", competition: "bookingCompetition" }[key];
      if (!url && linkKey && (C.links || {})[linkKey]) {
        const label = { bridal: "Request your bridal glow", group: "Request a group appointment", competition: "Request a competition tan" }[key];
        el.innerHTML = `<div class="form form--link"><p>Fill out a short request form and Katie will confirm your date, time and shade.</p><div class="btn-row"><a class="btn btn--green" data-link="${linkKey}">${label}</a></div><p class="small muted">Before your appointment, please also complete the <a data-link="consentForm">client agreement</a>.</p></div>`;
        return;
      }
      const id = (n) => `${key}-${n}`;
      const field = ([n, label, type, req, extra]) => {
        const r = req ? " required" : "", star = req ? ' <span aria-hidden="true">*</span>' : "";
        const ac = typeof extra === "string" ? ` autocomplete="${extra}"` : "";
        let input;
        if (type === "textarea") input = `<textarea id="${id(n)}" name="${n}" rows="4"${r}></textarea>`;
        else if (type === "select") input = `<select id="${id(n)}" name="${n}"${r}><option value="">Choose…</option>${extra.map((o) => `<option>${esc(o)}</option>`).join("")}</select>`;
        else input = `<input id="${id(n)}" name="${n}" type="${type}"${type === "number" ? ' min="1" inputmode="numeric"' : ""}${ac}${r}>`;
        return `<div class="field ${type === "textarea" ? "field--full" : ""}"><label for="${id(n)}">${esc(label)}${star}</label>${input}</div>`;
      };
      el.innerHTML = `
        <form class="form" ${url ? `action="${esc(url)}" method="POST"` : ""} novalidate>
          <input type="hidden" name="_subject" value="Sol Haus — ${esc(def.title)}">
          <input type="text" name="_gotcha" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
          ${def.note ? `<p class="small">${esc(def.note)}</p>` : ""}
          <div class="form__grid">${def.fields.map(field).join("")}</div>
          <label class="consent"><input type="checkbox" name="privacy_consent" required> <span>I agree that Sol Haus may use these details to respond to my inquiry. See the <a href="policies.html#privacy">privacy policy</a>.</span></label>
          <div class="btn-row"><button class="btn btn--green" type="submit"${url ? "" : " disabled"}>Send inquiry</button></div>
          <p class="form-status" role="status">${url ? "" : `This form isn't connected yet. ${email ? `Please email <a href="mailto:${esc(email)}">${esc(email)}</a> in the meantime.` : "Please reach out on Instagram in the meantime."}`}</p>
        </form>`;
      wire($("form", el), url);
    });
  }
  function wire(form, url) {
    if (!form) return;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = $(".form-status", form);
      if (!url) return;
      if (!form.checkValidity()) { form.reportValidity(); status.textContent = "Please complete the required fields."; return; }
      if (form._gotcha && form._gotcha.value) return;
      const btn = $("button[type=submit], button", form); btn.disabled = true; status.textContent = "Sending…";
      try {
        const res = await fetch(url, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(res.status);
        form.reset(); status.textContent = "Thank you — your message is on its way. We'll be in touch soon.";
      } catch (err) {
        status.textContent = "Sorry, that didn't send. Please try again or contact us on Instagram.";
      } finally { btn.disabled = false; }
    });
  }

  /* ---------- small things ---------- */
  function reveals() {
    const els = $$(".reveal");
    if (reduceMotion.matches || !("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-visible")); return; }
    const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach((e) => io.observe(e));
  }
  /* ---------- "Book now" chooser ---------- */
  function bookingChooser() {
    const L = C.links || {};
    const opts = [
      ["booking", "Signature Spray Tan", "Traditional or express, custom-matched to you"],
      ["bookingGroup", "Group Spray Tan", "Bridal parties, bachelorettes, sip & tans and more"],
      ["bookingCompetition", "Competition Spray Tan", "Stage-ready Irish dance tans"],
    ].filter(([k]) => L[k]);
    if (opts.length < 2) return;
    const dlg = document.createElement("div");
    dlg.className = "chooser"; dlg.hidden = true;
    dlg.innerHTML = `<div class="chooser__backdrop" data-close></div>
      <div class="chooser__panel" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="chooser-title">
        <button class="chooser__x" data-close aria-label="Close">×</button>
        <p class="script">book your glow</p>
        <h2 class="h3" id="chooser-title">Which tan are you booking?</h2>
        <ul class="chooser__list">${opts.map(([k, t, d]) => `<li><a href="${esc(L[k])}" target="_blank" rel="noopener"><span><strong>${t}</strong><em>${d}</em></span><i aria-hidden="true">→</i></a></li>`).join("")}</ul>
        <div class="stripes stripes--thin" aria-hidden="true"></div>
      </div>`;
    document.body.append(dlg);
    let last;
    const close = () => { dlg.hidden = true; document.body.classList.remove("menu-open"); last && last.focus(); };
    const open = (from) => {
      last = from; dlg.hidden = false; document.body.classList.add("menu-open");
      const m = $("#mobile-menu"); if (m && !m.hidden) $(".menu-toggle").click();
      $(".chooser__panel", dlg).focus();
    };
    dlg.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) close(); else if (e.target.closest(".chooser__list a")) setTimeout(close, 50); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !dlg.hidden) close(); });
    $$("[data-chooser]").forEach((a) => {
      // no real link on the button itself, so no browser/app can jump straight to one form
      a.removeAttribute("target"); a.removeAttribute("rel");
      a.setAttribute("href", "#book"); a.setAttribute("role", "button"); a.setAttribute("aria-haspopup", "dialog");
      a.addEventListener("click", (e) => { e.preventDefault(); open(a); });
    });
  }
  function guideSpy() {
    const links = $$(".guide-nav a"); if (!links.length) return;
    const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((l) => l.classList.remove("is-active"));
      const a = map.get(en.target.id); if (a) { a.classList.add("is-active"); a.scrollIntoView({ block: "nearest", inline: "center" }); }
    }), { rootMargin: "-45% 0px -50% 0px" });
    map.forEach((_, id) => { const t = document.getElementById(id); t && io.observe(t); });
  }
  function toggles() {
    if (!C.showApprovalFlags) $$(".needs-approval").forEach((n) => n.remove());
    if (C.links && C.links.giftCards) $$("[data-giftcards]").forEach((n) => (n.hidden = false));
    $$("[data-if-link]").forEach((n) => { if (!(C.links || {})[n.dataset.ifLink]) n.hidden = true; });
  }
  function setupNotice() {
    if (!C.showSetupNotice) return;
    const L = C.links || {}, Fm = C.forms || {};
    const need = [["instagram", "Instagram"], ["googleReviewsRead", "Google reviews link"], ["googleReviewLeave", "Leave-a-review link"], ["consentForm", "Consent & intake form"]]
      .filter(([k]) => !L[k]).map(([, t]) => t);
    ["bridal", "group", "competition"].forEach((k) => !Fm[k] && need.push(`${k[0].toUpperCase() + k.slice(1)} form endpoint`));
    if (!(C.business || {}).email) need.push("Business email");
    if (!need.length) return;
    const d = document.createElement("details");
    d.className = "setup-chip";
    d.innerHTML = `<summary>Preview · ${need.length} items to set up</summary><p>Add these in <code>assets/js/config.js</code>. Buttons for them show as “coming soon” until then.</p><ul>${need.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>`;
    document.body.append(d);
  }
  // keyboard support for pending links
  document.addEventListener("click", (e) => { const a = e.target.closest("[aria-disabled=true]"); if (a) e.preventDefault(); });

  function init() {
    chrome(); toggles(); renderServices(); renderEvents(); renderReviews(); renderForms(); renderGalleries();
    applyLinks(); reveals(); setupNotice(); guideSpy(); bookingChooser();
    if (location.hash) { const t = document.getElementById(location.hash.slice(1)); t && setTimeout(() => t.scrollIntoView(), 60); }
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", init) : init();
})();
