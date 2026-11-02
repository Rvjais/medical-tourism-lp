# Deployment — lp.shifarahealth.com

Static site, no build step. Nginx serves the repository's `public/` folder as the
web root, so `/cancer-treatment/` and `/international-patient/` map directly to the
two folders and every `git pull` is a deploy.

## 1. DNS

Point the subdomain at the VPS before requesting TLS:

```bash
dig +short lp.shifarahealth.com
```

This should return the VPS public IP.

## 2. Clone the repository (one time)

```bash
sudo mkdir -p /var/www/lp.shifarahealth.com
sudo chown -R "$USER":"$(id -gn)" /var/www/lp.shifarahealth.com

git clone https://github.com/Rvjais/medical-tourism-lp.git /var/www/lp.shifarahealth.com
```

The web root is `/var/www/lp.shifarahealth.com/public` — **not** the repo root. The
repo root also contains `.git/`, `deploy/`, `docs/` and docs, which must stay private.

If the repository is private, set up a read-only deploy key on the server first
(Settings → Deploy keys in GitHub) or use a personal access token in the clone URL.

## 3. Nginx (one time)

```bash
sudo cp /var/www/lp.shifarahealth.com/deploy/nginx.conf \
        /etc/nginx/sites-available/lp.shifarahealth.com

sudo ln -sfn /etc/nginx/sites-available/lp.shifarahealth.com \
             /etc/nginx/sites-enabled/lp.shifarahealth.com

sudo nginx -t && sudo systemctl reload nginx
```

Check HTTP first:

```bash
curl -I http://lp.shifarahealth.com/cancer-treatment/
curl -I http://lp.shifarahealth.com/international-patient/
```

Both should return `200`. Requests without the trailing slash return `301` to the
slash version, which keeps relative asset paths working.

## 4. HTTPS (one time)

```bash
# Debian / Ubuntu
sudo apt update && sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d lp.shifarahealth.com
```

Certbot edits the nginx config in place, adds the `443` server block and sets up
auto-renewal. Verify with `sudo certbot renew --dry-run`.

If another server block already answers for this name, remove or rename it so only
`lp.shifarahealth.com` handles this host.

## 5. Deploying updates

Every push to `main` is picked up with:

```bash
cd /var/www/lp.shifarahealth.com
git pull --ff-only
```

No build, service restart or nginx reload is needed for HTML/CSS/JS/image changes.
Only reload nginx when `deploy/nginx.conf` itself changes:

```bash
sudo cp /var/www/lp.shifarahealth.com/deploy/nginx.conf \
        /etc/nginx/sites-available/lp.shifarahealth.com
sudo nginx -t && sudo systemctl reload nginx
```

HTML is sent with `Cache-Control: no-cache`, so a pull is visible on the next page
load. CSS/JS are cached for 1 hour and images/fonts for 30 days.

## Troubleshooting

| Symptom | Check |
|---------|-------|
| `403 Forbidden` | Nginx user cannot read the files: `sudo chmod -R a+rX /var/www/lp.shifarahealth.com/public` |
| `404` on both pages | `root` in the nginx config does not end in `/public`, or the clone is in another path |
| Assets `404` but HTML loads | URL is missing the trailing slash (the config adds it with a redirect) |
| Old content after pull | Confirm `git log -1` on the server; hard-refresh the browser |
| `nginx -t` fails after certbot | Check the certificate paths printed by certbot |
| SELinux blocks reads (CentOS/RHEL) | `sudo chcon -R -t httpd_sys_content_t /var/www/lp.shifarahealth.com/public` |

## What is intentionally not deployed

`docs/` (client briefs), `deploy/`, `README.md`, `DEPLOY.md` and `.git/` live outside
the web root and are not reachable over HTTP.
