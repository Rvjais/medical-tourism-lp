# Shifara Health — landing pages

Two static landing pages served from one domain:

| URL | Folder |
|-----|--------|
| `https://lp.shifarahealth.com/cancer-treatment/` | `public/cancer-treatment/` |
| `https://lp.shifarahealth.com/international-patient/` | `public/international-patient/` |
| `https://lp.shifarahealth.com/` | `public/index.html` (small hub linking both) |

There is no build step: the HTML, CSS, JS and assets in `public/` are served as-is.

## Repo layout

```
public/                       ← the only directory exposed by nginx
├── index.html                ← hub page at the domain root
├── cancer-treatment/
│   ├── index.html
│   ├── css/  js/  assets/
│   └── README.md             ← page-specific notes and launch checklist
└── international-patient/
    ├── index.html
    └── css/  js/  assets/

deploy/nginx.conf             ← nginx server block for lp.shifarahealth.com
DEPLOY.md                     ← one-time server setup + update steps
docs/                         ← client briefs (git-ignored, never deployed)
```

## Local preview

From the repository root:

```bash
python -m http.server 8080 --directory public
```

Then open <http://localhost:8080/>.

## Deploying

The server serves `public/` directly, so an update is just a pull:

```bash
cd /var/www/lp.shifarahealth.com
git pull --ff-only
```

See [`DEPLOY.md`](DEPLOY.md) for first-time server setup (clone, nginx, TLS).
