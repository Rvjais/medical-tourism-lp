# Cancer Treatment in India — Landing Page (Template)

A ready-to-use medical-tourism landing page built from
`Cancer Treatment Landing Page Content Requirement Sheet.docx`
(the "Cancer Treatment in India" content sheet).

> **Template status:** the brand is shown as `[Brand]` and contact details are wired from
> one config file. Doctor and hospital sections use **sample photo cards** — replace them with
> the verified roster before launch (the doc keeps Sections 7 & 8 "on hold" until supplied).

## Files

```
cancer-treatment-landing-page/
├── index.html                    — full page (17 sections from the doc)
├── css/style.css                 — warm theme design system + responsive styles
├── js/script.js                  — CONFIG + carousel, navbar, tabs, form, tracking
├── assets/images/                — photography (hero slides, doctors, hospitals,
│                                   cities, patient stories, why-us / step-down care)
├── assets/illustrations/         — flat SVG artwork (available as fallbacks)
│   ├── cost-savings.svg
│   ├── oncology-care.svg
│   ├── journey-support.svg
│   ├── second-opinion.svg
│   ├── hospital-accredited.svg
│   └── recovery-care.svg
└── README.md
```

## Design system (v4 — warm premium)

- **Palette:** ivory paper (`#fffdf6` / `#fdf6e5`), coffee-brown ink (`#3f2c12`),
  amber `#916301`, brushed gold `#b29257` and copper accents. **Solid colours only —
  no gradients anywhere.**
- **Typography:** Poppins with tighter headline tracking and a soft `#8c7a5c` body tone.
- **Shape language:** 999px pill buttons and pill lists, 20–28px rounded cards,
  dashed gold pill tiles for the cancer-type and service rails.
- **Warm theme layer:** the base rules live at the top of `css/style.css`; the warm
  redesign is appended as a clearly marked `WARM PREMIUM THEME` block plus its own
  responsive section, so it can be tuned without touching the original cascade.
- **Hero:** 4 full-bleed, full-screen clinical photo banners (radiation therapy, oncology
  consultation, chemotherapy infusion, tumour board) under a flat brown scrim, with a
  floating lead-form card on ≥1081px that stacks below the banner on smaller screens.
  Copy sits on the left with four cream benefit pills; arrows, dots, swipe, pause and
  reduced-motion are supported. On tablets the arrows sit bottom-right, clear of the copy.
- **Card sections:** support, why-India, experts, hospitals, costs, journey, healing,
  hubs, why-us, stories, FAQ and the final CTA are re-boxed as warm rounded cards with
  bottom-aligned card links.
- **Stats strip:** solid gold band with coffee-brown text (AA contrast), footnote included.
- **Modern navbar** — cream utility topbar, pill nav links with scroll-spy, mobile drawer.
- **Dark coffee footer** — floating enquiry card, link columns, badge strip, mandatory
  disclaimer.
- Use **margins, not transforms**, for any offset layout: `.reveal.visible` resets
  `transform` to `none` once a section scrolls into view.

Hero photo credit: `hero-slide-3.jpg` is a public-domain National Cancer Institute
photograph (Rhoda Baer, 2010), sourced via Unsplash. Replace or re-credit it when the
brand supplies its own hospital photography.

## Sections included (matching the doc)

| # | Section | Extras |
|---|---------|--------|
| 1 | Hero + lead form | eyebrow, 4 key points, country-driven dial code, privacy microcopy |
| 2 | Trust bar | 4 verifiable stats + savings/visa footnote; optional 5th card (commented) |
| 3 | Find the Right Support | 8 cards with CTAs from the doc |
| 4 | Cancer types | 12 tabbed panels, checklists, published cost badges (brain / liver) |
| 5 | Oncology services | 11 service panels (Hemato-Oncology & BMT merged, per clean-up notes) |
| 6 | Why choose India | 6 cards (figure pending source → softened wording) |
| 7–8 | Doctors & Hospitals | photo profile cards (sample content — verify roster/accreditation before launch) |
| 9 | Transparent costs | 2 published price cards + "custom quote" rows + covers/disclaimer |
| 10 | Treatment journey | 3 phases · 8 numbered steps |
| 11 | Focus on Healing | 7 support items |
| 12 | Cancer care hubs | 5 cities (Chennai withheld pending oncology partners, per doc) |
| 13 | Why choose [Brand] | 8 numbered trust blocks |
| 14 | Patient stories | photo + quote cards (written consent required before publishing) |
| 15 | Final CTA | buttons + trust strip + contact line |
| 16 | FAQ | 12 accordions + FAQ JSON-LD schema + "View all FAQs" |
| 17 | Footer | links, contact, socials, **mandatory medical disclaimer** |

## How to preview

Just open `index.html` in any browser (double-click). No build step needed.

## Before going live — replace these

1. **Brand** — search-and-replace `[Brand]` (and `[brand]`, `[domain.com]`, `[Hospital Name]`, `[Full Name]`, `[Designation, …]`, `[City]`, `[Speciality]`, `[Office Address…]`) with the client's real values.
2. **Contact details** — edit the `CONFIG` object at the top of `js/script.js`
   (phone link, WhatsApp number with country code, email). Everything updates automatically.
3. **Form routing** — the submit handler in `js/script.js` shows a success state;
   wire the `TODO` fetch() call to the CRM endpoint (doc: CRM + email routing).
4. **GTM** — the data layer is already wired (`form_submit`, `whatsapp_click`, `call_click`,
   `doctor_profile_click`, `hospital_profile_click`, plus `email_click`, `faq_open`, `tab_click`).
   Add your GTM container snippet to `<head>` if not already injected site-wide.
5. **Doctors section 7 & hospitals section 8** — verify every profile, designation, experience
   figure and hospital/accreditation claim against the roster before launch; show only
   **verified per-hospital** accreditation (doc clean-up note). Replace any sample names
   shown in the current build.
6. **Patient stories** — confirm written consent for each quote, name and photo.
7. **Old headline figures** — the doc's "644,000 international patients (2024)" is kept
   softened with an HTML comment; restore it only after a verified source.
8. **Doc [CONFIRM] items** — commented in the HTML where each applies
   (visa wording, response-time promise, interpreter languages, legal claims, etc.).

## Doc compliance notes

- Tone: warm, calm, no fear-based wording, no survival/cure claims (doc Section B).
- Competitor figures/testimonials (patient counts, Google ratings) deliberately excluded.
- Real photography is used for section imagery. Patient stories may only be published with
  written consent, with per-story approval (doc requirement).
- Mobile-first: click-to-call, sticky bottom CTA bar, form directly after hero copy.
- Main site navigation intentionally hidden from the header (doc Section B, [CONFIRM]).
