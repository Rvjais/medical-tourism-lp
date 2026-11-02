"""Update the Specialists (#doctors) section of the International Patient LP
with REAL doctors from the scraped Shifara catalog.

Source of truth : scraped_site/assets/data/catalog.js  (window.SHIFARA)
                  - generated from shifarahealth.com listings by WebRip
Target           : international-patient/index.html  → section#doctors
                   6 panels, each panel = one department, ranked by
                   experience, doctors WITHOUT a local photo are skipped.

Re-run any time after re-scraping: it regenerates the cards in place and
copies the used photos into international-patient/assets/images/doctors/.
"""

import html
import json
import os
import re
import shutil
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Sifra L-P/
CATALOG = os.path.join(ROOT, "scraped_site", "assets", "data", "catalog.js")
PAGES_DIR = os.path.join(ROOT, "scraped_site", "pages")
PAGES = os.path.join(ROOT, "international-patient", "index.html")
CSS = os.path.join(ROOT, "international-patient", "css", "style.css")
IMG_OUT = os.path.join(ROOT, "international-patient", "assets", "images", "doctors")

# panel id → departments that legitimately belong to that panel topic.
# The 4th field (optional) augments a too-small pool: for topics with few
# tagged doctors, accept specialists from related departments whose
# designation names the panel's topic (e.g. "Neurosurgery & Spine Surgery"
# tagged under neurology).
PANELS = [
    ("d-kidney",   ["nephrology"],    "Kidney Transplant",       None),
    ("d-knee",     ["orthopedics"],   "Knee & Hip Replacement",  None),
    ("d-bariatric", ["bariatric"],    "Bariatric Surgery",       None),
    ("d-cosmetic", ["cosmetic"],      "Cosmetic Surgery",        None),
    ("d-bmt",      ["hematology"],    "Bone Marrow Transplant",  None),
    ("d-spine",    ["spine-surgery"], "Spine Surgery",
     (("orthopedics", "neurology", "general-surgery"), "spine")),
]
# keep the 4-across grid; spine has only 3 real specialists → shows 3
MAX_PER_PANEL = 4

# Designations look like: "MBBS, MD (Medicine), DM (Nephrology) Chairman & Head – ..."
# → degrees prefix, then the real role. Split at the first role keyword.
ROLE_WORD = re.compile(
    r"(?<![\w&/,])((?:Senior |Principal |Sr\. |Attending |Associate |Deputy )?"
    r"(?:Chairman|Chief|Director|HOD|Head|Consultant|Professor|Prof\.|Chair))"
)


def split_designation(text: str):
    """(degrees, role) — role starts at the first ranking keyword."""
    if not text:
        return "", ""
    m = ROLE_WORD.search(text)
    if not m or m.start() < 2:
        return "", text.strip()
    return text[: m.start()].strip().rstrip(", "), text[m.start():].strip()


def main():
    raw = open(CATALOG, encoding="utf-8").read()
    data = json.loads(re.search(r"window\.SHIFARA\s*=\s*(\{.*\})\s*;?\s*$", raw, re.S).group(1))
    city_name = {c["slug"]: c["name"] for c in data["cities"]}

    used = set()
    chosen_panels = {}

    for panel_id, depts, _title, aug in PANELS:
        primary_pool = []
        aug_pool = []
        for doc in data["doctors"]:
            did = doc.get("id") or doc.get("url")
            if not did or did in used:
                continue
            if not doc.get("departments"):
                continue
            img = doc.get("image") or ""
            src = os.path.normpath(os.path.join(PAGES_DIR, img)) if img else ""
            if not img or not os.path.exists(src):
                continue
            depts_set = set(doc["departments"])
            if depts_set & set(depts):
                primary_pool.append((doc["name"], doc, src))
            elif aug:
                # specialist tagged under a related department, but the
                # designation names this panel's topic (e.g. "Neurosurgery
                # & Spine Surgery" under neurology) → topic-matched, not random
                extra_depts, keyword = aug
                haystack = ((doc.get("designation") or "") + " " +
                            (doc.get("speciality") or "")).lower()
                if (depts_set & set(extra_depts)) and keyword in haystack:
                    aug_pool.append((doc["name"], doc, src))

        rank = lambda lst: sorted(
            lst, key=lambda p: (-(p[1].get("experience") or 0), p[0]))
        # primary department fills the slots first; augmentation only tops up
        picks = rank(primary_pool)[:MAX_PER_PANEL]
        if len(picks) < MAX_PER_PANEL:
            picks += rank(aug_pool)[:MAX_PER_PANEL - len(picks)]
        picks = rank(picks)
        if not picks:
            sys.exit(f" Panel {panel_id}: no doctors with local photos for {depts}")
        for _name, doc, _src in picks:
            used.add(doc.get("id") or doc.get("url"))
        chosen_panels[panel_id] = picks

    # ── copy photos into the LP ────────────────────────────────────────────
    os.makedirs(IMG_OUT, exist_ok=True)
    copied = 0
    for picks in chosen_panels.values():
        for _name, doc, src in picks:
            dst = os.path.join(IMG_OUT, doc["id"] + os.path.splitext(src)[1].lower())
            if not os.path.exists(dst) or os.path.getmtime(src) > os.path.getmtime(dst):
                shutil.copy2(src, dst)
                copied += 1

    # ── regenerate the cards ───────────────────────────────────────────────
    page = open(PAGES, encoding="utf-8").read()
    count_field = {}

    for panel_id, depts, title, _aug in PANELS:
        picks = chosen_panels[panel_id]
        cards = []
        for name, doc, src in picks:
            slug = doc["id"]
            ext = os.path.splitext(src)[1].lower()
            rel = f"assets/images/doctors/{slug}{ext}"
            degrees, role = split_designation(doc.get("designation") or "")

            exp = doc.get("experience")
            exp_html = f'\n                  <span class="doc-exp">{exp}+ years experience</span>' if exp else ""
            title_attr = f' title="{html.escape(degrees, quote=True)}"' if degrees else ""
            hospital = doc.get("hospital") or ""
            city = city_name.get(doc.get("city", ""), doc.get("city", "") or "").strip()
            place = ", ".join(p for p in (hospital, city) if p)

            cards.append(
                f'''<article class="card doc-card">
                  <img class="doc-photo" src="{rel}" alt="{html.escape(name)}" loading="lazy">
                  <h3>{html.escape(name)}</h3>
                  <p class="doc-role"{title_attr}>{html.escape(role or degrees)}</p>
                  <p class="doc-meta"><svg class="ic" aria-hidden="true"><use href="#i-hospital"/></svg> {html.escape(place)}</p>{exp_html}
                  <a class="card-link" href="#contact" data-event="form_intent">Request Consultation <svg class="ic" aria-hidden="true"><use href="#i-arrow"/></svg></a>
                </article>'''
            )

        start = page.index(f'id="{panel_id}"')
        gstart = page.index('<div class="doc-grid">', start)
        gend = page.index("</div>", gstart) + len("</div>")
        page = page[:gstart] + '<div class="doc-grid">\n                ' + \
            "\n                ".join(cards) + "\n              </div>" + page[gend:]

        # panel-head count
        seg_start = page.index(f'id="{panel_id}"')
        seg_end = page.index('<div class="doc-grid">', seg_start)
        seg = page[seg_start:seg_end]
        seg2, n = re.subn(r"(<span>)\d+ specialists(</span>)",
                          rf"\g<1>{len(picks)} specialists\g<2>", seg)
        count_field[panel_id] = len(picks)
        if n != 1:
            sys.exit(f" panel {panel_id}: expected 1 count span, patched {n}")
        page = page[:seg_start] + seg2 + page[seg_end:]

    open(PAGES, "w", encoding="utf-8", newline="\n").write(page)

    # ── CSS: photo avatar (once) ───────────────────────────────────────────
    css = open(CSS, encoding="utf-8").read()
    if ".doc-photo" not in css:
        rule = """
/* ---------- Doctor photo avatars (real images via update_doctors.py) ---------- */
.doc-photo {
  display: block;
  width: 76px;
  height: 76px;
  margin: 0 auto .85rem;
  border-radius: 50%;
  border: 3px solid #ffffff;
  box-shadow: 0 8px 20px rgba(16, 41, 73, .12);
  object-fit: cover;
  object-position: top;
}
"""
        anchor = css.index(".doc-card h3")
        css = css[:anchor] + rule.lstrip("\n") + "\n" + css[anchor:]
        open(CSS, "w", encoding="utf-8", newline="\n").write(css)

    print("Panels updated:")
    for panel_id, _depts, title, _aug in PANELS:
        picks = chosen_panels[panel_id]
        print("  %-12s %-26s %d doctors" % (panel_id, title, len(picks)))
        for name, doc, _src in picks:
            print("      %-34s %-28s %s+ yrs  %s" %
                  (name[:34], (doc.get("hospital") or "")[:28], doc.get("experience"), (doc.get("city") or "")))
    print("photos copied: %d (%d total in %s)" % (copied, len(os.listdir(IMG_OUT)), IMG_OUT))


if __name__ == "__main__":
    main()
