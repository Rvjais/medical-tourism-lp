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

## Lead routing

Both landing-page forms submit to **two destinations in parallel** (see
`submitLead` in each page's `js/script.js`):

| Destination | How | Config |
|---|---|---|
| Formester | hidden iframe post | `formesterEndpoint` |
| VS CRM (`vscrm.in`) | `fetch` POST, form-encoded | `crmEndpoint`, `crmApiKey` |

The thank-you panel appears as soon as the first destination confirms; the inline
error/WhatsApp fallback only appears if both fail. GTM's `form_submit` event carries
a `channels` field (e.g. `vscrm+formester`) so you can see which one answered first.

**Caveat:** the VS CRM API replies `405` to `OPTIONS`, so it must be called with
`Content-Type: application/x-www-form-urlencoded` (a CORS simple request). Sending
JSON from the browser is blocked by the preflight. The API also answers HTTP `200`
even on failure — always check `Error === false` in the JSON body.

The CRM key is therefore visible in page source. It is a write-only lead key; if it
is ever abused, rotate it in VS CRM and update `crmApiKey` in both scripts. A
server-side proxy (e.g. `lead.php` on the same host) would hide it if required.

## Deploying

```bash
cd /home/lp.shifarahealth.com/public_html
git pull --ff-only
```

See [`DEPLOY.md`](DEPLOY.md) for first-time clone and server setup.
