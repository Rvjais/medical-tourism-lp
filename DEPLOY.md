# Deployment — lp.shifarahealth.com

The repository is the website: `public_html` is both the git checkout and the web
root, and every `git pull` is a deploy. No build step.

```
public_html/                     ← DocumentRoot + git checkout
├── index.html                   ← https://lp.shifarahealth.com/
├── cancer-treatment/            ← https://lp.shifarahealth.com/cancer-treatment/
├── international-patient/       ← https://lp.shifarahealth.com/international-patient/
├── .htaccess                    ← Apache: blocks .git/docs, sets caching
├── deploy/  docs/  *.md         ← repo files, blocked from the web
└── .git/
```

## 1. Clone into `public_html` (one time)

The directory must be empty (or contain only the host's default placeholder files).

```bash
cd /home/lp.shifarahealth.com/public_html
ls -A                 # check what is already there

git clone https://github.com/Rvjais/medical-tourism-lp.git .
```

If files are present, move them aside first instead of deleting them:

```bash
mkdir -p /root/public_html_backup
mv /home/lp.shifarahealth.com/public_html/* /root/public_html_backup/
mv /home/lp.shifarahealth.com/public_html/.[!.]* /root/public_html_backup/ 2>/dev/null
```

Then run the `git clone ... .` command above.

## 2. Set the document root

Point `lp.shifarahealth.com` at:

```
/home/lp.shifarahealth.com/public_html
```

- **Apache panel (cPanel/Hestia/CloudPanel/etc.):** the domain's document root
  should already be `public_html`; otherwise set it to the path above.
- **Plain nginx:** use `deploy/nginx.conf` (it already has
  `root /home/lp.shifarahealth.com/public_html;`).
- **Plain Apache:** `DocumentRoot /home/lp.shifarahealth.com/public_html` and allow
  `.htaccess` overrides (`AllowOverride All`).

The included `.htaccess` blocks `/.git`, `/docs/`, `/deploy/`, `README.md` and
`DEPLOY.md`, so cloning into the web root does not expose them. **This only works
on Apache with `AllowOverride All`.** On nginx, the deny rules in
`deploy/nginx.conf` do the same job.

## 3. Permissions

The web server user must be able to read the files:

```bash
chmod -R a+rX /home/lp.shifarahealth.com/public_html
```

## 4. Verify

```bash
curl -I http://lp.shifarahealth.com/
curl -I http://lp.shifarahealth.com/cancer-treatment/
curl -I http://lp.shifarahealth.com/international-patient/
curl -I http://lp.shifarahealth.com/.git/config        # must be 403/404
```

All three pages should return `200`. Requests without the trailing slash get a
`301` to the slash version, which keeps relative asset paths working.

## 5. HTTPS (one time)

```bash
# Debian / Ubuntu
apt update && apt install -y certbot python3-certbot-nginx   # nginx
# or: apt install -y certbot python3-certbot-apache          # Apache

certbot --nginx -d lp.shifarahealth.com       # nginx
certbot --apache -d lp.shifarahealth.com      # Apache
```

Certbot edits the vhost and sets up auto-renewal. Check it with:

```bash
certbot renew --dry-run
```

## 6. Deploying updates

```bash
cd /home/lp.shifarahealth.com/public_html
git pull --ff-only
```

No build, restart or reload is needed for HTML/CSS/JS/image changes. Only reload
nginx if `deploy/nginx.conf` itself changes.

On plain Apache, `.htaccess` sends HTML with `Cache-Control: no-cache`, CSS/JS for
1 hour and images/fonts for 30 days.

**Bump the asset version on every CSS or JS change.** The live server is LiteSpeed,
which ignores the `.htaccess` cache headers: HTML goes out with no cache header
(so a pull shows up quickly) but CSS goes out with `max-age=604800` (7 days). Without a new URL, returning visitors get the new HTML with the old CSS
and the page looks broken. In the page you changed, update the `?v=` value on both
links (use the date, e.g. `?v=20261111`):

```html
<link rel="stylesheet" href="css/style.css?v=20261111">
<script src="js/script.js?v=20261111"></script>
```

## Troubleshooting

| Symptom | Check |
|---------|-------|
| `destination path '.' already exists` | `public_html` is not empty — see step 1 |
| `403 Forbidden` | `chmod -R a+rX /home/lp.shifarahealth.com/public_html` |
| `/.git/config` returns a file | `.htaccess` is ignored: enable `AllowOverride All`, or use the nginx config |
| Assets `404` but HTML loads | URL is missing the trailing slash |
| Old content after pull | Confirm `git log -1` on the server, then hard-refresh |
| New HTML but unstyled/old layout | CSS is cached for 7 days — bump `?v=` on the CSS/JS links (see step 6) |
| Form/GTM blocked | No build step; check the browser console for the third-party script |
