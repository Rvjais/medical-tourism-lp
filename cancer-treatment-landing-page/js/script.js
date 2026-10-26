/* ============================================================
   [Brand] — Cancer Treatment in India · Landing Page
   Slider · navbar · scroll-spy · tabs · FAQ · form · tracking
   Events per doc: form_submit, whatsapp_click, call_click,
   doctor_profile_click, hospital_profile_click
============================================================ */

/* ------------------------------------------------------------
   1) CONFIG — single place to configure brand contact details.
   Replace these placeholders when the client details are final
   (doc reference values: phone 9971316164 / mail@shifarahealth.com).
------------------------------------------------------------ */
const CONFIG = {
  phoneDisplay: "+91 XXXXX XXXXX",
  phoneHref: "tel:+91XXXXXXXXXX",
  whatsappHref:
    "https://wa.me/91XXXXXXXXXX?text=" +
    encodeURIComponent(
      "Hello, I would like a free cancer treatment plan. I am sharing my diagnosis and reports."
    ),
  emailDisplay: "hello@[brand].com",
  emailHref: "mailto:hello@[brand].com",
};

/* ------------------------------------------------------------
   2) Google Tag Manager data layer (container is already live).
------------------------------------------------------------ */
window.dataLayer = window.dataLayer || [];

function trackEvent(eventName, extra) {
  const payload = Object.assign({ event: eventName }, extra || {});
  window.dataLayer.push(payload);
  if (typeof window.gtag === "function") window.gtag("event", eventName, extra || {});
}

/* ------------------------------------------------------------
   3) Inject contact details into links/text marked data-contact.
------------------------------------------------------------ */
function applyContactDetails() {
  document.querySelectorAll("[data-contact]").forEach((el) => {
    switch (el.dataset.contact) {
      case "phoneText":
        el.textContent = CONFIG.phoneDisplay;
        break;
      case "mailText":
        el.textContent = CONFIG.emailDisplay;
        break;
      case "phoneLink":
        el.setAttribute("href", CONFIG.phoneHref);
        break;
      case "mailLink":
        el.setAttribute("href", CONFIG.emailHref);
        break;
      case "waLink":
        el.setAttribute("href", CONFIG.whatsappHref);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
        break;
    }
  });
}

/* ------------------------------------------------------------
   4) HERO SLIDER — 4 full-width slides, autoplay, arrows,
      dots, swipe, keyboard. Autoplay stops after interaction
      and is disabled for prefers-reduced-motion users.
------------------------------------------------------------ */
function initSlider() {
  const slider = document.getElementById("heroSlider");
  const track = document.getElementById("slidesViewport");
  const dotsWrap = document.getElementById("slideDots");
  if (!slider || !track || !dotsWrap) return;

  const slides = Array.from(track.querySelectorAll(".hero-slide"));
  if (slides.length < 2) return;

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const DELAY = 6000;

  let index = 0;
  let timer = null;
  let hoverPaused = false;
  let stoppedByUser = false; // manual navigation stops autoplay
  let pausedByToggle = false;
  let motionOverride = false;

  /* ---- dots ---- */
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "slide-dot";
    dot.setAttribute("aria-label", "Go to slide " + (i + 1) + " of " + slides.length);
    dot.addEventListener("click", () => {
      go(i);
      stopAutoplay();
    });
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.querySelectorAll(".slide-dot"));
  const toggleBtn = dotsWrap.querySelector(".slide-toggle");
  const toggleIcon = toggleBtn ? toggleBtn.querySelector("use") : null;

  /* ---- render ---- */
  function render() {
    track.style.transform = "translateX(-" + index * 100 + "%)";

    slides.forEach((slide, i) => {
      const isActive = i === index;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", isActive ? "false" : "true");

      /* keep hidden slides out of the accessibility tree and tab order */
      if (isActive) {
        slide.removeAttribute("inert");
      } else {
        slide.setAttribute("inert", "");
      }
      slide.querySelectorAll("a, button").forEach((el) => {
        if (isActive) el.removeAttribute("tabindex");
        else el.setAttribute("tabindex", "-1");
      });
    });

    dots.forEach((dot, i) => {
      const isActive = i === index;
      dot.classList.toggle("is-active", isActive);
      if (isActive) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  }

  /* ---- navigation ---- */
  function go(next) {
    index = (next + slides.length) % slides.length;
    render();
  }

  const nextBtn = slider.querySelector(".slide-next");
  const prevBtn = slider.querySelector(".slide-prev");

  function manualNext() {
    go(index + 1);
    stopAutoplay();
  }
  function manualPrev() {
    go(index - 1);
    stopAutoplay();
  }

  if (nextBtn) nextBtn.addEventListener("click", manualNext);
  if (prevBtn) prevBtn.addEventListener("click", manualPrev);

  /* ---- autoplay ---- */
  function clearTimer() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function canAutoplay() {
    if (hoverPaused || stoppedByUser || pausedByToggle || document.hidden) return false;
    if (motionQuery.matches && !motionOverride) return false;
    return true;
  }

  function startAutoplay() {
    clearTimer();
    if (!canAutoplay()) return;
    timer = window.setInterval(() => go(index + 1), DELAY);
  }

  function stopAutoplay() {
    stoppedByUser = true;
    clearTimer();
    syncToggle();
  }

  /* pause / play control (WCAG 2.2.2) */
  function syncToggle() {
    if (!toggleBtn) return;
    const isPaused = stoppedByUser || pausedByToggle;
    toggleBtn.setAttribute("aria-pressed", isPaused ? "true" : "false");
    toggleBtn.setAttribute("aria-label", isPaused ? "Play slideshow" : "Pause slideshow");
    if (toggleIcon) toggleIcon.setAttribute("href", isPaused ? "#i-play" : "#i-pause");
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      if (stoppedByUser || pausedByToggle) {
        stoppedByUser = false;
        pausedByToggle = false;
        motionOverride = true;
      } else {
        pausedByToggle = true;
      }
      syncToggle();
      startAutoplay();
    });
  }

  /* ---- pause while hovered / focused / tab hidden ---- */
  slider.addEventListener("mouseenter", () => {
    hoverPaused = true;
    clearTimer();
  });
  slider.addEventListener("mouseleave", () => {
    hoverPaused = false;
    startAutoplay();
  });
  slider.addEventListener("focusin", () => {
    hoverPaused = true;
    clearTimer();
  });
  slider.addEventListener("focusout", (e) => {
    if (slider.contains(e.relatedTarget)) return;
    hoverPaused = false;
    startAutoplay();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearTimer();
    else startAutoplay();
  });

  if (typeof motionQuery.addEventListener === "function") {
    motionQuery.addEventListener("change", () => {
      if (motionQuery.matches) clearTimer();
      else startAutoplay();
    });
  }

  /* ---- keyboard ---- */
  slider.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        manualNext();
        break;
      case "ArrowLeft":
        e.preventDefault();
        manualPrev();
        break;
      case "Home":
        e.preventDefault();
        go(0);
        stopAutoplay();
        break;
      case "End":
        e.preventDefault();
        go(slides.length - 1);
        stopAutoplay();
        break;
    }
  });

  /* ---- swipe ---- */
  let startX = null;
  let startY = null;

  track.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    },
    { passive: true }
  );

  track.addEventListener(
    "touchend",
    (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      startX = null;
      startY = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) manualNext();
        else manualPrev();
      }
    },
    { passive: true }
  );

  render();
  syncToggle();
  startAutoplay();
}

/* ------------------------------------------------------------
   5) Modern navbar — mobile drawer, Escape / outside click,
      scroll-spy and sticky-header shadow.
------------------------------------------------------------ */
function initNav() {
  const header = document.getElementById("siteHeader");
  const toggle = document.getElementById("navToggle");
  const drawer = document.getElementById("navDrawer");

  if (toggle && drawer) {
    const setOpen = (open) => {
      drawer.hidden = !open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("nav-open", open);
    };

    toggle.addEventListener("click", () => setOpen(drawer.hidden));

    drawer.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => setOpen(false))
    );

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !drawer.hidden) {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", (e) => {
      if (drawer.hidden) return;
      if (drawer.contains(e.target) || toggle.contains(e.target)) return;
      setOpen(false);
    });

    const desktop = window.matchMedia("(min-width: 981px)");
    if (typeof desktop.addEventListener === "function") {
      desktop.addEventListener("change", (e) => {
        if (e.matches) setOpen(false);
      });
    }
  }

  /* scroll-spy: highlight the section currently in view */
  const links = Array.from(document.querySelectorAll("#navLinks a"));
  const sections = links
    .map((a) => {
      const id = a.getAttribute("href");
      return id && id.length > 1 ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if (!sections.length) return;

  let ticking = false;
  const spy = () => {
    ticking = false;
    const pos = window.scrollY + (header ? header.offsetHeight : 0) + 40;
    let activeId = "";
    sections.forEach((section) => {
      if (section.offsetTop <= pos) activeId = section.id;
    });
    links.forEach((a) => {
      a.classList.toggle("is-active", a.getAttribute("href") === "#" + activeId);
    });
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(spy);
    },
    { passive: true }
  );
  spy();
}

/* ------------------------------------------------------------
   5b) Keep --header-h in sync so anchors are not hidden under
       the sticky header (CSS uses it for scroll-padding-top).
------------------------------------------------------------ */
function initHeaderHeight() {
  const header = document.getElementById("siteHeader");
  if (!header) return;

  const sync = () => {
    const bar = header.querySelector(".navbar");
    const top = header.querySelector(".topbar");
    let h = 0;
    if (bar) h += bar.getBoundingClientRect().height;
    if (top) h += top.getBoundingClientRect().height;
    /* fall back to the whole header if the markup changes */
    if (!h) {
      const drawer = header.querySelector(".nav-drawer");
      h = header.getBoundingClientRect().height;
      if (drawer && !drawer.hidden) h -= drawer.getBoundingClientRect().height;
    }
    if (h > 0) document.documentElement.style.setProperty("--header-h", Math.round(h) + "px");
  };

  sync();
  window.addEventListener("resize", sync, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sync);
  window.addEventListener("load", sync);
}

/* ------------------------------------------------------------
   6) Country dropdown — target markets first (Bangladesh, Gulf,
      Africa, Iran etc. per doc), then the rest alphabetically.
      Selecting a country auto-fills the dial code.
------------------------------------------------------------ */
const COUNTRIES = [
  ["Afghanistan", "+93"], ["Albania", "+355"], ["Algeria", "+213"], ["Angola", "+244"],
  ["Argentina", "+54"], ["Australia", "+61"], ["Austria", "+43"], ["Azerbaijan", "+994"],
  ["Bahrain", "+973"], ["Bangladesh", "+880"], ["Belarus", "+375"], ["Belgium", "+32"],
  ["Benin", "+229"], ["Bhutan", "+975"], ["Botswana", "+267"], ["Brazil", "+55"],
  ["Bulgaria", "+359"], ["Burkina Faso", "+226"], ["Cambodia", "+855"], ["Cameroon", "+237"],
  ["Canada", "+1"], ["Chad", "+235"], ["Chile", "+56"], ["China", "+86"],
  ["Colombia", "+57"], ["Congo (DRC)", "+243"], ["Costa Rica", "+506"], ["Croatia", "+385"],
  ["Czechia", "+420"], ["Djibouti", "+253"], ["Egypt", "+20"], ["Eritrea", "+291"],
  ["Ethiopia", "+251"], ["Fiji", "+679"], ["Finland", "+358"], ["France", "+33"],
  ["Gabon", "+241"], ["Gambia", "+220"], ["Georgia", "+995"], ["Germany", "+49"],
  ["Ghana", "+233"], ["Greece", "+30"], ["Guinea", "+224"], ["Hungary", "+36"],
  ["Indonesia", "+62"], ["Iran", "+98"], ["Iraq", "+964"], ["Ireland", "+353"],
  ["Italy", "+39"], ["Jordan", "+962"], ["Kazakhstan", "+7"], ["Kenya", "+254"],
  ["Kuwait", "+965"], ["Kyrgyzstan", "+996"], ["Lebanon", "+961"], ["Liberia", "+231"],
  ["Libya", "+218"], ["Madagascar", "+261"], ["Malawi", "+265"], ["Malaysia", "+60"],
  ["Maldives", "+960"], ["Mali", "+223"], ["Mauritania", "+222"], ["Mauritius", "+230"],
  ["Mexico", "+52"], ["Moldova", "+373"], ["Mongolia", "+976"], ["Morocco", "+212"],
  ["Mozambique", "+258"], ["Myanmar", "+95"], ["Namibia", "+264"], ["Nepal", "+977"],
  ["Netherlands", "+31"], ["Niger", "+227"], ["Nigeria", "+234"], ["Oman", "+968"],
  ["Pakistan", "+92"], ["Papua New Guinea", "+675"], ["Philippines", "+63"], ["Poland", "+48"],
  ["Qatar", "+974"], ["Romania", "+40"], ["Russia", "+7"], ["Rwanda", "+250"],
  ["Saudi Arabia", "+966"], ["Senegal", "+221"], ["Seychelles", "+248"], ["Sierra Leone", "+232"],
  ["Singapore", "+65"], ["Somalia", "+252"], ["South Africa", "+27"], ["South Sudan", "+211"],
  ["Spain", "+34"], ["Sri Lanka", "+94"], ["Sudan", "+249"], ["Sweden", "+46"],
  ["Switzerland", "+41"], ["Syria", "+963"], ["Tajikistan", "+992"], ["Tanzania", "+255"],
  ["Thailand", "+66"], ["Togo", "+228"], ["Tunisia", "+216"], ["Turkey", "+90"],
  ["Turkmenistan", "+993"], ["UAE", "+971"], ["Uganda", "+256"], ["United Kingdom", "+44"],
  ["United States", "+1"], ["Uruguay", "+598"], ["Uzbekistan", "+998"], ["Vanuatu", "+678"],
  ["Venezuela", "+58"], ["Vietnam", "+84"], ["Yemen", "+967"], ["Zambia", "+260"],
  ["Zimbabwe", "+263"],
];

/* Markets prioritised in this landing page's targeting (doc Section B) */
const PREFERRED = [
  "Bangladesh", "Iraq", "Iran", "Nigeria", "Oman", "Saudi Arabia", "UAE",
  "Qatar", "Kuwait", "Bahrain", "Yemen", "Egypt", "Kenya", "Ethiopia", "Tanzania", "Ghana",
];

function populateCountries() {
  const select = document.getElementById("country");
  if (!select) return;

  const preferred = COUNTRIES.filter((c) => PREFERRED.includes(c[0]));
  const rest = COUNTRIES.filter((c) => !PREFERRED.includes(c[0])).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  const add = (separator, list) => {
    if (separator) {
      const sep = document.createElement("option");
      sep.disabled = true;
      sep.textContent = separator;
      select.appendChild(sep);
    }
    list.forEach(([name, dial]) => {
      const opt = document.createElement("option");
      opt.value = dial;
      opt.textContent = name + " (" + dial + ")";
      select.appendChild(opt);
    });
  };

  add("— Popular source markets —", preferred);
  add("— All countries —", rest);

  const dial = document.getElementById("dialCode");
  select.addEventListener("change", () => {
    if (dial && select.value) dial.textContent = select.value;
  });
}

/* ------------------------------------------------------------
   7) Tabs (cancer types & oncology services) — single open panel,
      wired ARIA + keyboard support.
------------------------------------------------------------ */
function initTabs() {
  document.querySelectorAll("[data-tabs]").forEach((wrap) => {
    const btns = Array.from(wrap.querySelectorAll(".tab-btn"));
    const panels = Array.from(wrap.querySelectorAll(".tab-panel"));

    btns.forEach((btn) => {
      const panel = panels.find((p) => p.id === btn.dataset.panel);
      if (panel) {
        btn.id = btn.id || "tab-" + panel.id;
        btn.setAttribute("aria-controls", panel.id);
        panel.setAttribute("role", "tabpanel");
        panel.setAttribute("aria-labelledby", btn.id);
      }
      btn.tabIndex = btn.classList.contains("is-active") ? 0 : -1;

      btn.addEventListener("click", () => activate(btn, true));
      btn.addEventListener("keydown", (e) => {
        const current = btns.indexOf(btn);
        let nextIndex = null;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") nextIndex = (current + 1) % btns.length;
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") nextIndex = (current - 1 + btns.length) % btns.length;
        if (e.key === "Home") nextIndex = 0;
        if (e.key === "End") nextIndex = btns.length - 1;
        if (nextIndex === null) return;
        e.preventDefault();
        btns[nextIndex].focus();
        activate(btns[nextIndex], true);
      });
    });

    function activate(btn, notify) {
      btns.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle("is-active", isActive);
        b.setAttribute("aria-selected", isActive ? "true" : "false");
        b.tabIndex = isActive ? 0 : -1;
      });
      panels.forEach((p) => {
        const isActive = p.id === btn.dataset.panel;
        p.classList.toggle("is-active", isActive);
        p.setAttribute("aria-hidden", isActive ? "false" : "true");
      });
      if (notify) trackEvent("tab_click", { tab: btn.textContent.trim() });
    }

    activate(btns.find((b) => b.classList.contains("is-active")) || btns[0], false);
  });
}

/* ------------------------------------------------------------
   8) FAQ accordion
------------------------------------------------------------ */
function initFaq() {
  document.querySelectorAll(".faq-item").forEach((item, i) => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    if (!q || !a) return;

    if (!a.id) a.id = "faq-answer-" + (i + 1);
    q.setAttribute("aria-controls", a.id);
    q.setAttribute("aria-expanded", "false");

    q.addEventListener("click", () => {
      const open = item.classList.toggle("open");
      q.setAttribute("aria-expanded", open ? "true" : "false");
      a.hidden = !open;
      if (open) {
        const label = q.querySelector("span");
        trackEvent("faq_open", { question: label ? label.textContent.trim() : "" });
      }
    });
  });
}

/* ------------------------------------------------------------
   9) Lead form — inline validation, dial-code aware phone rule,
      success state, GTM form_submit event.
      TEMPLATE NOTE: replace the simulated success with a POST to
      the CRM / form endpoint once routing is confirmed
      (doc: CRM + mail@[brand].com).
------------------------------------------------------------ */
function initForm() {
  const form = document.getElementById("enquiryForm");
  if (!form) return;

  const success = document.getElementById("formSuccess");
  const submitBtn = form.querySelector('button[type="submit"]');

  const setErr = (id, msg) => {
    const field = document.getElementById(id);
    const errEl = form.querySelector('[data-err="' + id + '"]');
    if (field) field.classList.toggle("is-invalid", Boolean(msg));
    if (errEl) errEl.textContent = msg || "";
    if (field && msg) field.setAttribute("aria-invalid", "true");
    if (field && !msg) field.removeAttribute("aria-invalid");
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("fullName");
    const country = document.getElementById("country");
    const phone = document.getElementById("phone");
    if (!name || !country || !phone) return;

    setErr("fullName", name.value.trim().length < 3 ? "Please enter your full name." : "");
    setErr("country", country.value ? "" : "Please select your country.");

    const digits = phone.value.replace(/\D/g, "");
    setErr(
      "phone",
      digits.length >= 7 && digits.length <= 15
        ? ""
        : "Please enter a valid phone / WhatsApp number."
    );

    const firstInvalid = form.querySelector(".is-invalid");
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const sourceField = form.elements.namedItem("formSource");
    const countryText =
      country.selectedIndex >= 0 ? country.options[country.selectedIndex].textContent : "";

    trackEvent("form_submit", {
      formSource: sourceField ? sourceField.value : "",
      country: countryText,
    });

    /* TODO — send to CRM endpoint here, e.g.:
       fetch("https://[crm-endpoint]", { method: "POST", body: new FormData(form) })
       .then(showSuccess).catch(showWhatsAppFallback); */

    showSuccess();
  });

  function showSuccess() {
    if (!success) return;
    form.hidden = true;
    success.hidden = false;

    const title = success.querySelector("h3");
    if (title) {
      title.tabIndex = -1;
      title.focus({ preventScroll: true });
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    success.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  }

  /* clear error state while typing */
  form.querySelectorAll("input, select, textarea").forEach((el) => {
    el.addEventListener("input", () => setErr(el.id, ""));
  });

  /* digits only in the phone field */
  const phone = document.getElementById("phone");
  if (phone) {
    phone.addEventListener("input", () => {
      phone.value = phone.value.replace(/[^\d\s-]/g, "");
    });
  }

  if (submitBtn) submitBtn.addEventListener("click", () => trackEvent("form_intent"));
}

/* ------------------------------------------------------------
   10) Click-tracking via [data-event] attributes
------------------------------------------------------------ */
function initTracking() {
  document.addEventListener("click", (e) => {
    if (!(e.target instanceof Element)) return;
    const el = e.target.closest("[data-event]");
    if (!el) return;
    /* the form submit button is tracked in initForm */
    if (el.matches('#enquiryForm [data-event="form_submit"]')) return;
    trackEvent(el.dataset.event);
  });
}

/* ------------------------------------------------------------
   11) Scroll effects — sticky header shadow + reveal animations
------------------------------------------------------------ */
function initScrollEffects() {
  const header = document.getElementById("siteHeader");
  if (header) {
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
          header.classList.toggle("is-scrolled", window.scrollY > 8);
          ticking = false;
        });
      },
      { passive: true }
    );
  }

  const revealEls = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));
}

/* ------------------------------------------------------------
   Boot
------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  applyContactDetails();
  initHeaderHeight();
  initSlider();
  initNav();
  populateCountries();
  initTabs();
  initFaq();
  initForm();
  initTracking();
  initScrollEffects();

  const yearEl = document.getElementById("fyear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
