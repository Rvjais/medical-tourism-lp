/* ============================================================
   [Brand] — Cancer Treatment in India · Landing Page
   Slider · navbar · scroll-spy · tabs · FAQ · form · tracking
   Events per doc: form_submit, whatsapp_click, call_click,
   doctor_profile_click, hospital_profile_click
============================================================ */

/* ------------------------------------------------------------
   1) CONFIG — single place to configure brand contact details.
   Replace these placeholders when the client details are final
   (doc: phone 9971316164 / mail@shifarahealth.com are the
   reference values from the requirement sheet).
------------------------------------------------------------ */
const CONFIG = {
  phoneDisplay: "+91 XXXXX XXXXX",
  phoneHref: "tel:+91XXXXXXXXXX",
  whatsappHref: "https://wa.me/91XXXXXXXXXX?text=" +
    encodeURIComponent("Hello, I would like a free cancer treatment plan. I am sharing my diagnosis and reports."),
  emailDisplay: "hello@[brand].com",
  emailHref: "mailto:hello@[brand].com",
};

/* ------------------------------------------------------------
   2) Google Tag Manager data layer (container is already live).
------------------------------------------------------------ */
window.dataLayer = window.dataLayer || [];

function trackEvent(eventName, extra) {
  const payload = Object.assign({ event: eventName }, extra || {});
  if (window.dataLayer) window.dataLayer.push(payload);
  if (window.gtag) window.gtag("event", eventName, extra || {});
}

/* ------------------------------------------------------------
   3) Inject contact details into links/text marked data-contact.
------------------------------------------------------------ */
function applyContactDetails() {
  document.querySelectorAll("[data-contact]").forEach((el) => {
    switch (el.dataset.contact) {
      case "phoneText": el.textContent = CONFIG.phoneDisplay; break;
      case "mailText":  el.textContent = CONFIG.emailDisplay; break;
      case "phoneLink": el.setAttribute("href", CONFIG.phoneHref); break;
      case "mailLink":  el.setAttribute("href", CONFIG.emailHref); break;
      case "waLink":
        el.setAttribute("href", CONFIG.whatsappHref);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
        break;
    }
  });
}

/* ------------------------------------------------------------
   4) HERO SLIDER — 4 slides, autoplay, arrows, dots, swipe.
------------------------------------------------------------ */
function initSlider() {
  const viewport = document.getElementById("slidesViewport");
  const dotsWrap = document.getElementById("slideDots");
  if (!viewport) return;

  const slides = Array.from(viewport.children);
  let current = 0;
  let timer = null;
  const DELAY = 5500;

  /* build dots */
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to slide ${i + 1} of ${slides.length}`);
    dot.addEventListener("click", () => { go(i); restart(); });
    dotsWrap.appendChild(dot);
  });

  function go(index) {
    current = (index + slides.length) % slides.length;
    viewport.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll("button").forEach((b, i) => {
      b.classList.toggle("is-active", i === current);
    });
  }

  function next() { go(current + 1); }
  function prev() { go(current - 1); }

  function restart() {
    clearInterval(timer);
    timer = setInterval(next, DELAY);
  }

  /* arrows */
  const nextBtn = document.querySelector(".slide-next");
  const prevBtn = document.querySelector(".slide-prev");
  if (nextBtn) nextBtn.addEventListener("click", () => { next(); restart(); });
  if (prevBtn) prevBtn.addEventListener("click", () => { prev(); restart(); });

  /* pause on hover / focus */
  const slider = document.getElementById("heroSlider");
  if (slider) {
    slider.addEventListener("mouseenter", () => clearInterval(timer));
    slider.addEventListener("mouseleave", restart);
    slider.addEventListener("focusin", () => clearInterval(timer));
    slider.addEventListener("focusout", restart);
  }

  /* swipe support */
  let startX = null;
  viewport.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const delta = e.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 50) (delta < 0 ? next() : prev());
    startX = null;
    restart();
  }, { passive: true });

  /* keyboard when slider region in focus */
  slider.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { next(); restart(); }
    if (e.key === "ArrowLeft")  { prev(); restart(); }
  });

  /* pause when tab is hidden */
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearInterval(timer); else restart();
  });

  go(0);
  restart();
}

/* ------------------------------------------------------------
   5) Modern navbar — mobile drawer + scroll-spy + shadow.
------------------------------------------------------------ */
function initNav() {
  const toggle = document.getElementById("navToggle");
  const drawer = document.getElementById("navDrawer");

  if (toggle && drawer) {
    toggle.addEventListener("click", () => {
      const open = drawer.hidden;
      drawer.hidden = !open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-open", open);
    });

    /* close the drawer when any link inside it is used */
    drawer.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        drawer.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      })
    );
  }

  /* scroll-spy: highlight the section currently in view */
  const links = document.querySelectorAll("#navLinks a");
  const sections = Array.from(links)
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const spy = () => {
    const pos = window.scrollY + 140;
    let activeId = null;
    sections.forEach((sec) => { if (sec.offsetTop <= pos) activeId = sec.id; });
    links.forEach((a) =>
      a.classList.toggle("is-active", a.getAttribute("href") === "#" + activeId)
    );
  };
  window.addEventListener("scroll", spy, { passive: true });
  spy();
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
  const rest = CountriesExcept(PREFERRED);

  function add(sepLabel, list) {
    if (sepLabel) {
      const sep = document.createElement("option");
      sep.disabled = true;
      sep.textContent = sepLabel;
      select.appendChild(sep);
    }
    list.forEach(([name, dial]) => {
      const opt = document.createElement("option");
      opt.value = dial;
      opt.textContent = dial === "+__" ? name : `${name} (${dial})`;
      select.appendChild(opt);
    });
  }

  add("— Popular source markets —", preferred);
  add("— All countries —", rest);

  select.addEventListener("change", () => {
    const dial = document.getElementById("dialCode");
    if (dial && select.value) dial.textContent = select.value;
  });
}

function CountriesExcept(exclude) {
  return COUNTRIES.filter((c) => !exclude.includes(c[0])).sort((a, b) =>
    a[0].localeCompare(b[0])
  );
}

/* ------------------------------------------------------------
   7) Tabs (cancer types & oncology services) — single open panel.
      On mobile the menu becomes a scrollable pill bar.
------------------------------------------------------------ */
function initTabs() {
  document.querySelectorAll("[data-tabs]").forEach((wrap) => {
    const btns = wrap.querySelectorAll(".tab-btn");
    const panels = wrap.querySelectorAll(".tab-panel");
    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        btns.forEach((b) => {
          b.classList.toggle("is-active", b === btn);
          b.setAttribute("aria-selected", b === btn ? "true" : "false");
        });
        panels.forEach((p) => p.classList.toggle("is-active", p.id === btn.dataset.panel));
        trackEvent("tab_click", { tab: btn.textContent.trim() });
      });
    });
  });
}

/* ------------------------------------------------------------
   8) FAQ accordion
------------------------------------------------------------ */
function initFaq() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    q.addEventListener("click", () => {
      const open = item.classList.toggle("open");
      q.setAttribute("aria-expanded", open ? "true" : "false");
      a.hidden = !open;
      if (open) trackEvent("faq_open", { question: q.querySelector("span").textContent.trim() });
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

  const setErr = (id, msg) => {
    const field = document.getElementById(id);
    const errEl = form.querySelector(`[data-err="${id}"]`);
    if (field) field.classList.toggle("is-invalid", !!msg);
    if (errEl) errEl.textContent = msg || "";
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("fullName");
    const country = document.getElementById("country");
    const phone = document.getElementById("phone");

    setErr("fullName", name.value.trim().length < 3 ? "Please enter your full name." : "");
    setErr("country", country.value ? "" : "Please select your country.");

    const digits = phone.value.replace(/\D/g, "");
    setErr("phone",
      digits.length >= 7 && digits.length <= 15
        ? ""
        : "Please enter a valid phone / WhatsApp number.");

    if (form.querySelector(".is-invalid")) {
      form.querySelector(".is-invalid").focus();
      return;
    }

    trackEvent("form_submit", {
      formSource: form.formSource.value,
      country: country.value,
    });

    /* TODO — send to CRM endpoint here, e.g.:
       fetch("https://[crm-endpoint]", { method: "POST", body: new FormData(form) })
       .then(showSuccess).catch(showWhatsAppFallback); */

    showSuccess();
  });

  function showSuccess() {
    form.hidden = true;
    const success = document.getElementById("formSuccess");
    success.hidden = false;
    success.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /* clear error state while typing */
  form.querySelectorAll("input, select").forEach((el) => {
    el.addEventListener("input", () => setErr(el.id, ""));
  });

  /* digits only in phone field */
  const phone = document.getElementById("phone");
  phone.addEventListener("input", () => {
    phone.value = phone.value.replace(/[^\d\s-]/g, "");
  });
}

/* ------------------------------------------------------------
   10) Click-tracking via [data-event] attributes
------------------------------------------------------------ */
function initTracking() {
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-event]");
    if (!el || el.matches('#enquiryForm [data-event="form_submit"]')) return; // form handled in initForm
    trackEvent(el.dataset.event);
  });
}

/* ------------------------------------------------------------
   11) Scroll effects — sticky header shadow + reveal animations
------------------------------------------------------------ */
function initScrollEffects() {
  const header = document.getElementById("siteHeader");
  window.addEventListener("scroll", () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }, { passive: true });

  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => io.observe(el));
}

/* ------------------------------------------------------------
   Boot
------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  applyContactDetails();
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
