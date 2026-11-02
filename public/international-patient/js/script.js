/* ============================================================
   Shifara Health — International Patients · Landing Page
   Slider · navbar · scroll-spy · tabs · FAQ · forms · tracking
   Events per doc: form_submit, whatsapp_click, call_click,
   doctor_profile_click, hospital_profile_click
============================================================ */

/* ------------------------------------------------------------
   1) CONFIG — single place to configure brand contact details.
------------------------------------------------------------ */
const CONFIG = {
  phoneDisplay: "+91 99713 16164",
  phoneHref: "tel:+919971316164",
  whatsappHref:
    "https://wa.me/919971316164?text=" +
    encodeURIComponent(
      "Hello Shifara Health, I would like a free consultation for medical treatment in India. I am sharing my reports."
    ),
  emailDisplay: "mail@shifarahealth.com",
  emailHref: "mailto:mail@shifarahealth.com",

  /* Formester lead capture (international patients page).
     The plain endpoint stores the POST server-side and redirects to
     its own thank-you page — used via a hidden iframe because the
     .json endpoint does not allow cross-origin reads (CORS). */
  formesterEndpoint: "https://app.formester.com/forms/4RkE3znWs/submissions",
  formesterTimeoutMs: 45000,
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
  /* Retired with the old hero carousel (replaced by the static bright
     banner). Kept only as a fallback: the element checks below no
     longer match, so the function safely does nothing. */
  return;

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
   3b) Row sliders — [data-slider] wrappers (treatment cards,
       patient stories). Arrows scroll the row, edges disable,
       native swipe on touch. Reduced motion scrolls instantly.
------------------------------------------------------------ */
function initRowSliders() {
  document.querySelectorAll("[data-slider]").forEach((wrap) => {
    const track = wrap.querySelector(".row-track");
    const nav = wrap.querySelector("[data-slider-nav]");
    if (!track) return;

    const prev = nav ? nav.querySelector(".row-prev") : null;
    const next = nav ? nav.querySelector(".row-next") : null;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stepPx = () => Math.max(track.clientWidth * 0.85, 240);

    const update = () => {
      if (!prev || !next) return;
      const max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
      if (max <= 4) {
        prev.hidden = true;
        next.hidden = true;
      }
    };

    if (prev) {
      prev.addEventListener("click", () => {
        track.scrollBy({ left: -stepPx(), behavior: reduce ? "auto" : "smooth" });
        trackEvent("slider_scroll", { slider: track.id || "row" });
      });
    }
    if (next) {
      next.addEventListener("click", () => {
        track.scrollBy({ left: stepPx(), behavior: reduce ? "auto" : "smooth" });
        trackEvent("slider_scroll", { slider: track.id || "row" });
      });
    }

    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
  });
}

/* ------------------------------------------------------------
   3c) Treatment-plan stepper — the hero card's 3-step flow.
       Step 1: pick a treatment pill (stores value in a hidden
       field). Step 2: name / phone / country. Step 3: message
       + submit (validated by initForm). Progress bar follows.
------------------------------------------------------------ */
function initPlanStepper() {
  const form = document.getElementById("enquiryForm");
  if (!form || !form.querySelector(".plan-step")) return;

  const steps = Array.from(form.querySelectorAll(".plan-step"));
  const segs = Array.from(document.querySelectorAll(".plan-progress i"));
  const treatment = form.querySelector("[data-plan-treatment]");
  const pills = Array.from(form.querySelectorAll(".plan-pill"));

  const name = form.querySelector('[name="fullName"]');
  const phone = form.querySelector('[name="phone"]');
  const country = form.querySelector("select[data-country]");

  const setErr = (field, message) => {
    if (!field) return;
    field.classList.toggle("is-invalid", Boolean(message));
    const errEl = form.querySelector('[data-err="' + field.id + '"]');
    if (errEl) errEl.textContent = message || "";
    if (message) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");
  };

  let step = 1;

  function show(next) {
    step = next;
    steps.forEach((el) => {
      const active = Number(el.dataset.step) === step;
      el.hidden = !active;
      el.classList.toggle("is-active", active);
    });
    segs.forEach((seg) => {
      seg.classList.toggle("is-on", Number(seg.dataset.seg) <= step);
    });
    const active = steps.find((el) => Number(el.dataset.step) === step);
    if (active) active.focus({ preventScroll: true });
  }

  function validateStep(current) {
    if (current === 1) {
      const err = form.querySelector(".plan-error");
      const picked = pills.some((p) => p.getAttribute("aria-pressed") === "true");
      if (!picked) {
        if (err) {
          err.hidden = false;
          err.textContent = "Please choose a treatment so a case manager can match the right specialist.";
        }
        trackEvent("plan_step_block", { step: "1", reason: "treatment" });
        return false;
      }
      if (err) err.hidden = true;
      return true;
    }

    const nameErr = !name || name.value.trim().length < 3;
    setErr(name, nameErr ? "Please enter your full name." : "");

    const digits = phone ? phone.value.replace(/\D/g, "") : "";
    const phoneErr = digits.length < 7 || digits.length > 15;
    setErr(phone, phoneErr ? "Please enter a valid phone / WhatsApp number." : "");

    const countryErr = !country || !country.value;
    setErr(country, countryErr ? "Please select your country." : "");

    if (nameErr || phoneErr || countryErr) {
      const firstBad = form.querySelector(".is-invalid");
      if (firstBad) firstBad.focus();
      return false;
    }
    return true;
  }

  form.addEventListener("click", (e) => {
    if (!(e.target instanceof Element)) return;

    /* treatment pills behave like a single-choice group */
    const pill = e.target.closest(".plan-pill");
    if (pill) {
      const wasOn = pill.getAttribute("aria-pressed") === "true";
      pills.forEach((p) => p.setAttribute("aria-pressed", "false"));
      pill.setAttribute("aria-pressed", "true");
      if (treatment) treatment.value = pill.dataset.value || "";
      const err = form.querySelector(".plan-error");
      if (err) err.hidden = true;
      if (!wasOn) trackEvent("plan_treatment", { treatment: pill.dataset.value || "" });
      return;
    }

    /* step navigation — validate before moving forward */
    const nav = e.target.closest("[data-plan-next]");
    if (nav) {
      const target = Number(nav.dataset.planNext);
      if (target > step && !validateStep(step)) return;
      show(target);
      trackEvent("plan_step", { step: String(target) });
    }
  });

  /* Enter inside a field advances instead of submitting early */
  form.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" || step >= 3) return;
    if (!(e.target instanceof Element)) return;
    if (e.target.matches("input, select, textarea")) {
      e.preventDefault();
      if (validateStep(step)) show(step + 1);
    }
  });
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
    /* use the header's real outer height (it includes the 1px bottom border) */
    const drawer = header.querySelector(".nav-drawer");
    let h = header.getBoundingClientRect().height;
    if (drawer && !drawer.hidden) h -= drawer.getBoundingClientRect().height;
    /* keep the fractional height so a 100vh hero lands exactly on the fold */
    if (h > 0) document.documentElement.style.setProperty("--header-h", h.toFixed(2) + "px");
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
  document.querySelectorAll("select[data-country]").forEach((select) => {
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

    const form = select.closest("form");
    const dial = form ? form.querySelector(".dial") : null;
    select.addEventListener("change", () => {
      if (dial && select.value) dial.textContent = select.value;
    });
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
   9) Lead forms — inline validation, dial-code aware phone rule,
      success state, GTM form_submit event.
      Both the hero form and the full final-CTA form are handled
      by the same routine via [data-lead-form].
      Submissions are stored by Formester (endpoint in
      CONFIG.formesterEndpoint) — see submitViaFormester below.
------------------------------------------------------------ */
/* Post the form to Formester through a hidden iframe.
   A native form post needs no CORS clearance; Formester stores the
   submission and answers with its own thank-you redirect, which
   lands inside the iframe. The page itself never navigates, so our
   success panel keeps working. If no response arrives in time, we
   show the inline WhatsApp suggestion instead of losing the lead. */
function submitViaFormester(form, onSuccess, onFailure) {
  if (form.dataset.sending === "true") return;
  form.dataset.sending = "true";

  const submitBtn = form.querySelector('[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.setAttribute("aria-busy", "true");
  }
  const status = form.querySelector(".form-status");
  if (status) status.hidden = true;

  /* readable companions for the CRM (stripped again after the try) */
  const extras = [];
  const addHidden = (name, value) => {
    if (!value) return;
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
    extras.push(input);
  };
  const dial = form.querySelector(".dial");
  const countrySel = form.querySelector("select[data-country]");
  const treatSel = form.querySelector('select[name="treatment"]');
  addHidden("dialCode", dial ? dial.textContent.trim() : "");
  addHidden(
    "countryName",
    countrySel && countrySel.selectedIndex >= 0
      ? countrySel.options[countrySel.selectedIndex].textContent
      : ""
  );
  addHidden(
    "treatmentName",
    treatSel && treatSel.selectedIndex >= 0
      ? treatSel.options[treatSel.selectedIndex].textContent
      : ""
  );

  /* hidden iframe target — created once per form, reused */
  const frameName = "formester-frame-" + (form.id || "lead");
  let frame = document.querySelector('iframe[data-form-frame="' + frameName + '"]');
  if (!frame) {
    frame = document.createElement("iframe");
    frame.name = frameName;
    frame.dataset.formFrame = frameName;
    frame.title = "Form submission";
    frame.setAttribute("aria-hidden", "true");
    frame.tabIndex = -1;
    frame.style.cssText = "position:absolute;left:-9999px;width:0;height:0;border:0;";
    document.body.appendChild(frame);
  }

  form.action = CONFIG.formesterEndpoint;
  form.method = "POST";
  form.enctype = "multipart/form-data";
  form.acceptCharset = "UTF-8";
  form.target = frameName;

  let settled = false;
  const restore = () => {
    settled = true;
    form.target = "";
    form.dataset.sending = "false";
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.removeAttribute("aria-busy");
    }
    extras.forEach((el) => el.remove());
  };
  const finishOk = () => {
    if (settled) return;
    clearTimeout(watchdog);
    restore();
    onSuccess();
  };
  const finishFail = () => {
    if (settled) return;
    clearTimeout(watchdog);
    frame.removeEventListener("load", onLoad);
    restore();
    if (status) status.hidden = false;
    onFailure();
  };
  const onLoad = () => {
    if (settled) return;
    setTimeout(finishOk, 300); /* let a redirect chain settle */
  };

  frame.addEventListener("load", onLoad, { once: true });
  const watchdog = setTimeout(finishFail, CONFIG.formesterTimeoutMs);

  form.submit(); /* native submit — does not re-fire our handler */
}

function initForm() {
  document.querySelectorAll("form[data-lead-form]").forEach((form) => {
    const successId = form.dataset.success;
    const success = successId ? document.getElementById(successId) : null;

    const name = form.querySelector('[name="fullName"]');
    const country = form.querySelector("select[data-country]");
    const phone = form.querySelector('[name="phone"]');
    const email = form.querySelector('[name="email"]');
    const treatment = form.querySelector('[name="treatment"]');

    const setErr = (field, msg) => {
      if (!field) return;
      field.classList.toggle("is-invalid", Boolean(msg));
      const errEl = form.querySelector('[data-err="' + field.id + '"]');
      if (errEl) errEl.textContent = msg || "";
      if (msg) field.setAttribute("aria-invalid", "true");
      else field.removeAttribute("aria-invalid");
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!name || !country || !phone) return;

      setErr(name, name.value.trim().length < 3 ? "Please enter your full name." : "");
      setErr(country, country.value ? "" : "Please select your country.");

      const digits = phone.value.replace(/\D/g, "");
      setErr(
        phone,
        digits.length >= 7 && digits.length <= 15
          ? ""
          : "Please enter a valid phone / WhatsApp number."
      );

      if (email) {
        const value = email.value.trim();
        setErr(
          email,
          !value || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
            ? "Please enter a valid email address."
            : ""
        );
      }

      if (treatment) {
        setErr(treatment, treatment.value ? "" : "Please select a treatment.");
      }

      const firstInvalid = form.querySelector(".is-invalid");
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const sourceField = form.elements.namedItem("formSource");
      const countryText =
        country.selectedIndex >= 0 ? country.options[country.selectedIndex].textContent : "";
      const treatmentText = treatment && treatment.selectedIndex >= 0
        ? treatment.options[treatment.selectedIndex].textContent
        : "";

      /* report uploads: enforce the 10 MB-per-file hint client-side */
      const fileInput = form.querySelector('input[type="file"]');
      if (fileInput && fileInput.files.length) {
        const tooBig = Array.from(fileInput.files).some((f) => f.size > 10 * 1024 * 1024);
        if (tooBig) {
          setErr(fileInput, "Each report file must be 10 MB or smaller. Try a smaller file or share it on WhatsApp.");
          fileInput.focus();
          return;
        }
      }

      submitViaFormester(
        form,
        () => {
          trackEvent("form_submit", {
            formSource: sourceField ? sourceField.value : "",
            country: countryText,
            treatment: treatmentText,
          });
          showSuccess();
        },
        () => {
          /* lead not confirmed — keep the form on screen so the
             patient can retry or use the WhatsApp link shown */
          trackEvent("form_error", { formSource: sourceField ? sourceField.value : "" });
        }
      );
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
      el.addEventListener("input", () => setErr(el, ""));
      el.addEventListener("change", () => setErr(el, ""));
    });

    /* digits only in the phone field */
    if (phone) {
      phone.addEventListener("input", () => {
        phone.value = phone.value.replace(/[^\d\s-]/g, "");
      });
    }
  });
}

/* ------------------------------------------------------------
   10) Click-tracking via [data-event] attributes
------------------------------------------------------------ */
function initTracking() {
  document.addEventListener("click", (e) => {
    if (!(e.target instanceof Element)) return;
    const el = e.target.closest("[data-event]");
    if (!el) return;
    /* form submit buttons are tracked in initForm */
    if (el.matches('form [data-event="form_submit"]')) return;
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
  initRowSliders();
  initPlanStepper();
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
