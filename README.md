# Shifara Health — landing pages

Two static landing pages served from one domain:

| URL | Folder |
|-----|--------|
| `https://lp.shifarahealth.com/cancer-treatment/` | `cancer-treatment/` |
| `https://lp.shifarahealth.com/international-patient/` | `international-patient/` |
| `https://lp.shifarahealth.com/` | `index.html` (small hub linking both) |

There is no build step: the HTML, CSS, JS and assets are served as-is. The repo
root is the web root (`public_html`), so `git pull` is the deploy.

## Repo layout

```
index.html                    ← hub page at the domain root
cancer-treatment/
├── index.html
├── css/  js/  assets/
└── README.md                 ← page-specific notes and launch checklist
international-patient/
├── index.html
└── css/  js/  assets/

.htaccess                     ← Apache: blocks .git/docs, caching headers
deploy/nginx.conf             ← equivalent nginx server block
DEPLOY.md                     ← server setup + update steps
docs/                         ← client briefs (git-ignored, never deployed)
```

## Local preview

From the repository root:

```bash
python -m http.server 8080
```

Then open <http://localhost:8080/>.

## Deploying

```bash
cd /home/shifarahealth.com/public_html
git pull --ff-only
```

See [`DEPLOY.md`](DEPLOY.md) for first-time clone and server setup.
