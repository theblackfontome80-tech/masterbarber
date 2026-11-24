/* ==========================================================================
   MASTER BARBER — Interactions
   Modules : navigation · tarifs · horaires · galerie · avant/après ·
             lightbox · formulaire · animations
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");
  const CFG = window.MB_CONFIG || {};
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /** Construit une URL Unsplash optimisée (les chemins locaux restent inchangés). */
  function img(src, width, quality = 70) {
    if (!/images\.unsplash\.com/.test(src)) return src;
    const base = src.split("?")[0];
    return `${base}?w=${width}&q=${quality}&auto=format&fit=crop`;
  }

  /* ---------- Navigation ---------- */
  function initNav() {
    const header = $("#header");
    const burger = $("#burger");
    const nav = $("#nav");

    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const setMenu = (open) => {
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
    };
    burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
    $$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

    // Lien actif selon la section visible
    const links = $$(".nav__list a");
    const sections = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) => a.classList.toggle("is-current", a.getAttribute("href") === "#" + entry.target.id));
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      sections.forEach((s) => io.observe(s));
    }
  }

  /* ---------- Tarifs ---------- */
  function initPrices() {
    const prices = CFG.prices || {};
    $$("[data-price]").forEach((el) => {
      const value = prices[el.dataset.price];
      if (value) { el.textContent = value; el.classList.add("has-price"); }
    });
  }

  /* ---------- Horaires ---------- */
  function initHours() {
    const hours = CFG.hours || {};
    const days = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
    if (!days.some((d) => hours[d])) return; // rien de renseigné : message par défaut

    const table = $("#hours");
    const tbody = $("tbody", table);
    const today = days[(new Date().getDay() + 6) % 7];
    tbody.innerHTML = days.map((d) => `
      <tr class="${d === today ? "is-today" : ""}">
        <td>${d.charAt(0).toUpperCase() + d.slice(1)}</td>
        <td>${hours[d] || "—"}</td>
      </tr>`).join("");
    table.hidden = false;
    $("#hours-fallback").hidden = true;
  }

  /* ---------- Galerie ---------- */
  const LABELS = { degrades: "Dégradé", coupes: "Coupe", barbes: "Barbe", salon: "Le salon" };
  let visibleItems = [];

  function renderGallery(filter = "all") {
    const wrap = $("#gallery");
    const items = (CFG.gallery || []).filter((it) => filter === "all" || it.category === filter);
    visibleItems = items;
    wrap.innerHTML = items.map((it, i) => `
      <button class="gallery__item${it.tall && filter === "all" ? " gallery__item--tall" : ""}"
              data-index="${i}" data-label="${LABELS[it.category] || ""}"
              aria-label="Agrandir : ${it.alt}" style="animation-delay:${i * 50}ms">
        <img src="${img(it.src, 700)}"
             ${/images\.unsplash\.com/.test(it.src) ? `srcset="${img(it.src, 450)} 450w, ${img(it.src, 700)} 700w, ${img(it.src, 1000)} 1000w"
             sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 25vw"` : ""}
             alt="${it.alt}" loading="lazy" decoding="async" width="700" height="${it.tall ? 1050 : 700}">
      </button>`).join("");
  }

  function initGallery() {
    renderGallery();
    $$(".filter").forEach((btn) => btn.addEventListener("click", () => {
      $$(".filter").forEach((b) => { b.classList.remove("is-active"); b.setAttribute("aria-pressed", "false"); });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
      renderGallery(btn.dataset.filter);
    }));
    $("#gallery").addEventListener("click", (e) => {
      const item = e.target.closest(".gallery__item");
      if (item) Lightbox.open(Number(item.dataset.index), item);
    });
  }

  /* ---------- Avant / Après ---------- */
  function initBeforeAfter() {
    const pairs = CFG.beforeAfter || [];
    if (!pairs.length) return;
    const list = $("#ba-list");
    list.innerHTML = pairs.map((p, i) => `
      <figure>
        <div class="compare">
          <img src="${img(p.before, 900)}" alt="Avant : ${p.label || "coupe"}" loading="lazy">
          <img class="compare__after" src="${img(p.after, 900)}" alt="Après : ${p.label || "coupe"}" loading="lazy">
          <span class="compare__handle" aria-hidden="true"></span>
          <span class="compare__tag compare__tag--before">Avant</span>
          <span class="compare__tag compare__tag--after">Après</span>
          <input type="range" min="0" max="100" value="50" aria-label="Comparer avant et après ${i + 1}">
        </div>
        ${p.label ? `<figcaption class="compare__label">${p.label}</figcaption>` : ""}
      </figure>`).join("");
    $$(".compare", list).forEach((c) => {
      const range = $("input", c);
      range.addEventListener("input", () => c.style.setProperty("--pos", range.value + "%"));
    });
    $("#before-after").hidden = false;
  }

  /* ---------- Lightbox ---------- */
  const Lightbox = (() => {
    const box = $("#lightbox");
    const image = $("img", box);
    const caption = $("figcaption", box);
    let index = 0;
    let trigger = null;

    function show(i) {
      index = (i + visibleItems.length) % visibleItems.length;
      const it = visibleItems[index];
      image.src = img(it.src, 1800, 78);
      image.alt = it.alt;
      caption.textContent = it.alt;
    }
    function open(i, from) {
      trigger = from;
      show(i);
      box.hidden = false;
      document.body.style.overflow = "hidden";
      $(".lightbox__close", box).focus();
    }
    function close() {
      box.hidden = true;
      document.body.style.overflow = "";
      if (trigger) trigger.focus();
    }

    $(".lightbox__close", box).addEventListener("click", close);
    $(".lightbox__nav--prev", box).addEventListener("click", () => show(index - 1));
    $(".lightbox__nav--next", box).addEventListener("click", () => show(index + 1));
    box.addEventListener("click", (e) => { if (e.target === box) close(); });
    document.addEventListener("keydown", (e) => {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
    // Balayage tactile
    let startX = 0;
    box.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    });

    return { open };
  })();

  /* ---------- Formulaire de rendez-vous ---------- */
  function initForm() {
    const form = $("#reservation");
    const status = $("#form-status");
    const date = $("#f-date");
    const service = $("#f-service");

    // Date minimale : aujourd'hui
    const now = new Date();
    date.min = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

    // Les boutons « Réserver » des cartes présélectionnent la prestation
    $$("[data-service]").forEach((a) => a.addEventListener("click", () => {
      service.value = a.dataset.service;
      setTimeout(() => $("#f-name").focus({ preventScroll: true }), 700);
    }));

    const messages = {
      name: "Merci d'indiquer votre nom.",
      phone: "Merci d'indiquer un numéro valide.",
      service: "Choisissez une prestation.",
      date: "Choisissez une date à partir d'aujourd'hui."
    };

    function validate(field) {
      const wrap = field.closest(".field");
      const ok = field.checkValidity();
      wrap.classList.toggle("has-error", !ok);
      $(".field__error", wrap).textContent = ok ? "" : (messages[field.name] || "Champ invalide.");
      return ok;
    }

    $$("input, select", form).forEach((f) => f.addEventListener("blur", () => { if (f.value) validate(f); }));

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fields = $$("input[required], select[required]", form);
      const valid = fields.map(validate).every(Boolean);
      if (!valid) {
        status.textContent = "Certains champs sont à compléter.";
        fields.find((f) => !f.checkValidity()).focus();
        return;
      }

      const data = Object.fromEntries(new FormData(form));
      const dateFr = new Date(data.date + "T00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
      const lines = [
        "Bonjour Master Barber, je souhaite prendre rendez-vous.",
        "",
        `• Nom : ${data.name}`,
        `• Téléphone : ${data.phone}`,
        `• Prestation : ${data.service}`,
        `• Date : ${dateFr}${data.time ? " à " + data.time : ""}`
      ];
      if (data.message.trim()) lines.push(`• Message : ${data.message.trim()}`);

      const number = (CFG.business && CFG.business.whatsapp) || "21629030826";
      const url = `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;
      const win = window.open(url, "_blank");
      if (win) win.opener = null; else window.location.href = url;
      status.textContent = "WhatsApp s'ouvre avec votre demande : il ne reste plus qu'à l'envoyer.";
    });
  }

  /* ---------- Animations au défilement ---------- */
  function initReveal() {
    const els = $$(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("is-visible")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el, i) => {
      if (el.closest(".hero")) {
        // le hero s'affiche dès le chargement, en cascade courte
        el.style.transitionDelay = `${150 + i * 110}ms`;
        requestAnimationFrame(() => el.classList.add("is-visible"));
        return;
      }
      // léger décalage pour les éléments voisins
      el.style.transitionDelay = `${(i % 3) * 80}ms`;
      io.observe(el);
    });
  }

  /* ---------- Démarrage ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    $("#year").textContent = new Date().getFullYear();
    initNav();
    initPrices();
    initHours();
    initGallery();
    initBeforeAfter();
    initForm();
    initReveal();
  });
})();
