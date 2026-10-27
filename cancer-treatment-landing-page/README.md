# Cancer Treatment in India — Shifara Health Landing Page

A conversion-focused medical-tourism landing page for **Shifara Health**, built from
`Cancer Treatment Landing Page Content Requirement Sheet.docx` and aligned with the
brand assets and data on shifarahealth.com.

> **Template status:** clinical content is generic and safe to publish, but the patient
> stories are sample copy. Confirm written consent or replace them before launch.
> Doctor and hospital profile sections have been removed from this shortened build.

## Files

```
cancer-treatment-landing-page/
├── index.html                    — full page (12 sections + footer)
├── css/style.css                 — Shifara design system + responsive styles
├── js/script.js                  — CONFIG + carousel, navbar, tabs, form, tracking
├── assets/images/                — hero slides, hubs, stories, brand logo, favicon
├── assets/illustrations/         — flat SVG artwork (available as fallbacks)
└── README.md
```

## Design system (Shifara brand)

- **Palette:** navy `#102949`, ink `#16202e`, teal `#48b5b2`, teal-deep `#2f8f8c`,
  coral `#eb6861`, coral-dark `#d9524b`, blush `#fcf4f2`, sand `#ead8d0`,
  slate `#68788c`. **Solid colours only — no gradients anywhere.**
- **Typography:** Plus Jakarta Sans for headings, Inter for body — the pairing used on
  shifarahealth.com. Both load from Google Fonts with a system-font fallback.
- **Shape language:** pill buttons and chip rows, 18–26px rounded cards, flat teal
  tint panels for tab rails.
- **Theme layer:** base rules live at the top of `css/style.css`; the Shifara brand
  layer is appended in a clearly marked block plus its own responsive section, so it
  can be tuned without disturbing the original cascade.
- **Hero:** 4 full-bleed clinical photo banners (radiation therapy, oncology
  consultation, chemotherapy infusion, tumour board) under a flat navy scrim, with a
  floating lead-form card at ≥1081px that stacks below the banner on smaller screens.
  Arrows, dots, swipe, pause and reduced-motion are supported.
- **Logo:** `assets/images/shifara-logo.png` (378×240, trimmed and recompressed),
  shared by the header and footer.
- **Dark navy footer** — enquiry card, link columns, socials and the mandatory
  medical disclaimer.
- Use **margins, not transforms**, for offset layout: `.reveal.visible` resets
  `transform` to `none` once a section scrolls into view.

Hero photo credit: `hero-slide-3.jpg` is a public-domain National Cancer Institute
photograph (Rhoda Baer, 2010), sourced via Unsplash. Replace or re-credit it when the
brand supplies its own hospital photography.

## Sections (shortened build)

| # | Section | Contents |
|---|---------|----------|
| 1 | Hero + lead form | 4-slide banner, eyebrow, 4 benefit pills, country-driven dial code, privacy microcopy |
| 2 | Trust bar | 2×2 stat grid + savings/visa footnote |
| 3 | Find the Right Support | 4 cards with CTAs, 2×2 on mobile |
| 4 | Cancer types | 8 tabbed panels with checklists and one published cost badge |
| 5 | Oncology services | 8 service panels |
| 6 | Why choose India | 4 cards |
| 7 | Transparent costs | 2 published price cards + 2 "custom quote" cards |
| 8 | Treatment journey | 3 phases · 6 numbered steps |
| 9 | Cancer care hubs | Delhi NCR, Mumbai, Bengaluru |
| 10 | Why choose Shifara Health | 4 numbered trust blocks |
| 11 | Patient stories | quote cards (sample copy — consent required) |
| 12 | Final CTA | buttons, trust strip, contact line |
| 13 | FAQ | 8 accordions + FAQ JSON-LD schema |
| 14 | Footer | links, contact, socials, **mandatory medical disclaimer** |

## Contact wiring

Brand details live in the `CONFIG` object at the top of `js/script.js`:

- Phone: `+91 99713 16164`
- Email: `mail@shifarahealth.com`
- WhatsApp: `919971316164`

Everything in the header, topbar, hero, final CTA and footer reads from that config.
The registered address, social links and canonical/OG URLs are set directly in
`index.html`.

## How to preview

Open `index.html` in any browser. No build step needed.

## Before going live — replace these

1. **Patient stories** — confirm written consent for each quote, name and photo, or
   replace with approved testimonials.
2. **Form routing** — the submit handler in `js/script.js` shows a success state; wire
   the `TODO` fetch() call to the CRM endpoint.
3. **GTM** — the data layer is already wired (`form_submit`, `whatsapp_click`,
   `call_click`, `email_click`, `faq_open`, `tab_click`). Add the container snippet to
   `<head>` if not injected site-wide.
4. **Pricing** — only the brain tumour surgery and liver transplant ranges are
   published. Keep other estimates as "custom quote" until verified.
5. **Outcome/cost claims** — the "60–80% lower cost" comparison is a category claim;
   keep a source on file or soften it for regulated markets.
6. **Accreditation** — hospital badges describe the partner network generally; show
   per-hospital accreditation only once verified.

## Compliance notes

- Tone: calm and factual, no fear-based wording, no survival or cure claims.
- Competitor figures and ratings deliberately excluded.
- Patient stories may only be published with written consent and per-story approval.
- Mobile-first: click-to-call, sticky bottom CTA bar, form directly after hero copy.
- Main site navigation is intentionally hidden from the header.
