# Cancer Treatment in India — Landing Page (Template)

A ready-to-use medical-tourism landing page built from
`Cancer Treatment Landing Page Content Requirement Sheet.docx`
(the "Cancer Treatment in India" content sheet).

> **Template status:** as requested, **doctor names and hospital names are NOT included** —
> the brand is shown as `[Brand]` and contact details are wired from one config file.
> Doctors' and hospitals' sections are visible placeholder slots (the doc keeps Sections 7 & 8
> "on hold" until the roster is supplied).

## Files

```
cancer-treatment-landing-page/
├── index.html        — full page (17 sections from the doc)
├── css/style.css     — design system + responsive styles
├── js/script.js      — interactions, tracking, contact CONFIG
└── README.md
```

## Sections included (matching the doc)

| # | Section | Extras |
|---|---------|--------|
| 1 | Hero + lead form | eyebrow, 4 key points, country-driven dial code, privacy microcopy |
| 2 | Trust bar | 4 verifiable stats + savings/visa footnote; optional 5th card (commented) |
| 3 | Find the Right Support | 8 cards with CTAs from the doc |
| 4 | Cancer types | 12 tabbed panels, checklists, published cost badges (brain / liver) |
| 5 | Oncology services | 11 service panels (Hemato-Oncology & BMT merged, per clean-up notes) |
| 6 | Why choose India | 6 cards (figure pending source → softened wording) |
| 7–8 | Doctors & Hospitals | **Placeholder slots** (robin roster / accreditation pending per doc) |
| 9 | Transparent costs | 2 published price cards + "custom quote" cards + covers/disclaimer |
| 10 | Treatment journey | 3 phases · 8 numbered steps |
| 11 | Focus on Healing | 7 support cards |
| 12 | Cancer care hubs | 5 cities (Chennai withheld pending oncology partners, per doc) |
| 13 | Why choose [Brand] | 8 numbered trust blocks |
| 14 | Patient stories | doc's fallback strip (stories are [REQUIRED] with written consent) |
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
5. **Doctors section 7 & hospitals section 8** — fill the placeholder cards with the verified
   roster; show only **verified per-hospital** accreditation (doc clean-up note).
6. **Old headline figures** — the doc's "644,000 international patients (2024)" is kept
   softened with an HTML comment; restore it only after a verified source.
7. **Doc [CONFIRM] items** — commented in the HTML where each applies
   (visa wording, response-time promise, interpreter languages, legal claims, etc.).

## Doc compliance notes

- Tone: warm, calm, no fear-based wording, no survival/cure claims (doc Section B).
- Competitor figures/testimonials (patient counts, Google ratings) deliberately excluded.
- Real photography guidance from the doc is respected by using an illustration instead of
  stock-style medical imagery.
- Mobile-first: click-to-call, sticky bottom CTA bar, form directly after hero copy.
- Main site navigation intentionally hidden from the header (doc Section B, [CONFIRM]).
