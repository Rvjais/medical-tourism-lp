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
├── css/style.css                 — flat editorial design system + responsive styles
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

## Design system (v3 — flat / de-boxed)

- **Flat, gradient-free** design: cream background, deep-teal ink, coral/saffron accents.
- **De-boxed editorial layout:** repeated cards were replaced by open columns separated
  by 1px hairlines. Sections read as type + imagery, not as stacked panels.
  - List sections (support, why India, costs, healing, why-us, doctors, hospitals, cities)
    use a hairline above each item, icons as plain colored line-art, and no fills.
  - Pills became small uppercase meta labels separated by a middot.
  - FAQs are a ruled accordion; tabs are a bare list with a single divider.
  - Enclosed surfaces are kept only where they earn it: the lead form, the final CTA
    panel, the footer enquiry card, and photo overlays.
- **Imagery:** real photography in `assets/images/` for hero slides, doctors, hospitals,
  cities, why-us and patient stories; flat SVG artwork in `assets/illustrations/`
  remains available for fallbacks.
- **Hero slider** — 4 auto-rotating banners (arrows, dots, swipe, pause, reduced-motion aware).
- **Modern navbar** — utility topbar, anchor links with scroll-spy, mobile drawer.
- **Aesthetic dark footer** — enquiry card, link columns, badge strip, disclaimer.
- Use **margins, not transforms**, for any offset layout: `.reveal.visible` resets
  `transform` to `none` once a section scrolls into view.

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
