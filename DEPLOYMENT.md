# Deployment Guide — VASTU (stonesbyvastu.in)

> **Domain:** https://stonesbyvastu.in  
> **Architecture:** Vercel (Frontend) + Render (Backend API) + Neon (PostgreSQL) + Upstash (Redis) + Cloudinary (Images)

---

## Architecture

```
              stonesbyvastu.in                    api.stonesbyvastu.in
         ┌────────────────────┐              ┌──────────────────────┐
         │     Vercel CDN     │    API       │     Render           │
         │   React SPA Build  │─────────────▶│   Django + Gunicorn  │
         │   Global Edge      │              │   WhiteNoise Static  │
         └────────────────────┘              └──────┬───────┬───────┘
                                                    │       │
                                              ┌─────▼──┐ ┌──▼──────┐
                                              │  Neon   │ │ Upstash │
                                              │ Postgres│ │  Redis  │
                                              └────────┘ └─────────┘
                                                    │
                                              ┌─────▼──────┐
                                              │ Cloudinary  │
                                              │ Image CDN   │
                                              └────────────┘
```

| Service    | Platform       | Free Tier                          |
|------------|----------------|------------------------------------|
| Frontend   | **Vercel**     | 100GB bandwidth, unlimited deploys |
| Backend    | **Render**     | 750h/month (sleeps after 15min)    |
| Database   | **Neon**       | 0.5GB storage, 190h compute/month  |
| Redis      | **Upstash**    | 10K commands/day, 256MB            |
| Images     | **Cloudinary** | 25GB storage, 25GB bandwidth/month |

---

## Prerequisites

- GitHub repo with this code pushed
- Domain `stonesbyvastu.in` purchased and DNS accessible
- Accounts on: Vercel, Render, Neon, Upstash, Cloudinary

---

## Step 1 — Setup Neon PostgreSQL (5 min)

1. Go to [console.neon.tech](https://console.neon.tech) → Sign up
2. **Create Project** → Name: `vastu-db` → Region: **Singapore** (closest to India)
3. Copy the **Connection String**:
   ```
   postgresql://neondb_owner:xxxx@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
4. Save this as your `DATABASE_URL`

---

## Step 2 — Setup Cloudinary Image CDN (3 min)

> **Why Cloudinary?** Render's free tier has ephemeral storage — uploaded images
> (products, categories, avatars) are **deleted on every deploy/restart**.
> Cloudinary stores them permanently and serves via a global CDN.

1. Go to [cloudinary.com](https://cloudinary.com) → Sign up (free)
2. Dashboard shows your credentials immediately:
   - **Cloud Name** — e.g. `dxyz1234`
   - **API Key** — e.g. `123456789012345`
   - **API Secret** — e.g. `aBcDeFgHiJkLmNoPqRsTuVwXyZ`
3. Save these three values — you'll set them as Render env vars in Step 4

### What happens automatically:
- In **production** (`DEBUG=False`): All `ImageField` uploads go to Cloudinary CDN
- In **local dev** (`DEBUG=True`): Images save to `Backend/media/` as before
- **No model changes needed** — Django uses Cloudinary as the default storage backend

---

## Step 3 — Setup Upstash Redis (3 min)

1. Go to [console.upstash.com](https://console.upstash.com) → Sign up
2. **Create Database** → Name: `vastu-cache` → Region: **AP-Southeast-1** (Singapore)
3. Copy the **Redis URL (TLS)**:
   ```
   rediss://default:xxxx@apn1-xxx.upstash.io:6379
   ```
4. Save this as your `REDIS_URL`

---

## Step 4 — Deploy Backend on Render (10 min)

1. Go to [dashboard.render.com](https://dashboard.render.com) → Sign up with GitHub
2. **New → Web Service** → Connect your GitHub repo
3. Configure:

   | Setting         | Value                                                                                  |
   |-----------------|----------------------------------------------------------------------------------------|
   | Name            | `vastu-api`                                                                            |
   | Root Directory  | `Backend`                                                                              |
   | Runtime         | Python                                                                                 |
   | Build Command   | `chmod +x build.sh && ./build.sh`                                                      |
   | Start Command   | `gunicorn core.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --threads 2 --timeout 120` |
   | Plan            | Free                                                                                   |

4. **Environment Variables** — Add all of these:

   | Key                           | Value                                                          |
   |-------------------------------|----------------------------------------------------------------|
   | `DEBUG`                       | `False`                                                        |
   | `SECRET_KEY`                  | *(click Generate or use a random 50-char string)*              |
   | `DATABASE_URL`                | *(Neon connection string from Step 1)*                         |
   | `REDIS_URL`                   | *(Upstash URL from Step 2)*                                    |
   | `ALLOWED_HOSTS`               | `vastu-api-4155.onrender.com,api.stonesbyvastu.in`             |
   | `CORS_ALLOWED_ORIGINS`        | `https://stonesbyvastu.in,https://www.stonesbyvastu.in`        |
   | `FRONTEND_URL`                | `https://stonesbyvastu.in`                                     |
   | `PYTHON_VERSION`              | `3.12.4`                                                       |
   | `RAZORPAY_KEY_ID`             | *(your Razorpay key)*                                          |
   | `RAZORPAY_KEY_SECRET`         | *(your Razorpay secret)*                                       |
   | `STRIPE_PUBLISHABLE_KEY`      | *(your Stripe publishable key)*                                |
   | `STRIPE_SECRET_KEY`           | *(your Stripe secret key)*                                     |
   | `STRIPE_WEBHOOK_SECRET`       | *(your Stripe webhook secret)*                                 |
   | `GOOGLE_CLIENT_ID`            | *(Google OAuth client ID)*                                     |
   | `GOOGLE_CLIENT_SECRET`        | *(Google OAuth client secret)*                                 |
   | `CLOUDINARY_CLOUD_NAME`       | *(Cloudinary cloud name from Step 2)*                          |
   | `CLOUDINARY_API_KEY`          | *(Cloudinary API key from Step 2)*                             |
   | `CLOUDINARY_API_SECRET`       | *(Cloudinary API secret from Step 2)*                          |

5. Click **Create Web Service** → Wait for build (~3-5 min)
6. Test: Visit `https://vastu-api-4155.onrender.com/api/products/` — should return JSON

---

## Step 5 — Deploy Frontend on Vercel (5 min)

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. **Add New Project** → Import your GitHub repo
3. Configure:

   | Setting           | Value              |
   |-------------------|--------------------|
   | Framework Preset  | Create React App   |
   | Root Directory    | `Frontend`         |
   | Build Command     | `npm run build`    |
   | Output Directory  | `build`            |

4. **Environment Variables** — Add:

   | Key                                  | Value                                                |
   |--------------------------------------|------------------------------------------------------|
   | `REACT_APP_API_URL`                  | `https://vastu-api-4155.onrender.com/api`            |
   | `REACT_APP_RAZORPAY_KEY_ID`          | *(your Razorpay publishable key)*                    |
   | `REACT_APP_STRIPE_PUBLISHABLE_KEY`   | *(your Stripe publishable key)*                      |

5. Click **Deploy** → Live in ~1 minute

---

## Step 6 — Configure Custom Domain (10 min)

### Frontend: stonesbyvastu.in → Vercel

1. Vercel Dashboard → Your project → **Settings → Domains**
2. Add: `stonesbyvastu.in` and `www.stonesbyvastu.in`
3. Vercel will show DNS records to add:

   | Type    | Name  | Value                      |
   |---------|-------|----------------------------|
   | A       | @     | `76.76.21.21`              |
   | CNAME   | www   | `cname.vercel-dns.com`     |

### Backend: api.stonesbyvastu.in → Render

1. Render Dashboard → Your service → **Settings → Custom Domains**
2. Add: `api.stonesbyvastu.in`
3. Add DNS record:

   | Type    | Name  | Value                          |
   |---------|-------|--------------------------------|
   | CNAME   | api   | `vastu-api-4155.onrender.com`  |

### Update After Domain Setup

Once DNS propagates (5-30 min), update environment variables:

**On Render (backend):**
- `CORS_ALLOWED_ORIGINS` = `https://stonesbyvastu.in,https://www.stonesbyvastu.in`
- `ALLOWED_HOSTS` = `vastu-api-4155.onrender.com,api.stonesbyvastu.in`

**On Vercel (frontend):**
- `REACT_APP_API_URL` = `https://api.stonesbyvastu.in/api`

Redeploy both services after updating env vars.

---

## Step 7 — Create Django Superuser (one-time)

Go to Render Dashboard → Your service → **Shell** tab:

```bash
python manage.py createsuperuser
```

Admin panel: `https://api.stonesbyvastu.in/admin/`

---

## Step 8 — Setup Payment Webhooks

### Razorpay
1. Razorpay Dashboard → Settings → Webhooks
2. Add endpoint: `https://api.stonesbyvastu.in/api/payments/razorpay/webhook/`
3. Events: `payment.captured`, `payment.failed`

### Stripe
1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://api.stonesbyvastu.in/api/payments/stripe/webhook/`
3. Events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy webhook secret → Update `STRIPE_WEBHOOK_SECRET` on Render

---

## DNS Summary (add at your domain registrar)

| Type    | Name  | Value                      | Purpose                    |
|---------|-------|----------------------------|----------------------------|
| A       | @     | `76.76.21.21`              | stonesbyvastu.in → Vercel  |
| CNAME   | www   | `cname.vercel-dns.com`     | www → Vercel               |
| CNAME   | api   | `vastu-api-4155.onrender.com` | API subdomain → Render  |

SSL certificates are **automatically provisioned** by both Vercel and Render.

---

## Post-Deployment Checklist

- [ ] `https://stonesbyvastu.in` loads the React frontend
- [ ] `https://api.stonesbyvastu.in/api/products/` returns JSON
- [ ] Register → Login → Browse products
- [ ] Add to cart → Checkout → Payment works
- [ ] Admin panel → Upload product with image → image URL is `res.cloudinary.com/...`
- [ ] Existing images load correctly after migration
- [ ] Mobile responsive — test on phone
- [ ] SSL padlock shows on both frontend & API

---

## Keep API Awake (Free Tier)

Render free tier sleeps after 15 min of inactivity. To prevent cold starts:

1. Go to [uptimerobot.com](https://uptimerobot.com) → Sign up (free)
2. Add monitor:
   - Type: **HTTP(s)**
   - URL: `https://vastu-api-4155.onrender.com/api/products/`
   - Interval: **every 14 minutes**

This pings the API continuously and prevents sleep.

---

## Scaling When You Grow

| Service  | Upgrade To       | Cost        | When                     |
|----------|------------------|-------------|--------------------------|
| Render   | Starter plan     | $7/mo       | Need always-on, no sleep |
| Neon     | Launch plan      | $19/mo      | >500MB data              |
| Vercel   | Pro plan         | $20/mo      | Team features            |
| **Total**|                  | **~$46/mo** | 10K+ daily users         |

---

## Files Created/Modified for Deployment

| File                       | Purpose                                          |
|----------------------------|--------------------------------------------------|
| `Backend/build.sh`         | Render build script (install, migrate, static)   |
| `Backend/Procfile`         | Gunicorn start command                           |
| `Backend/core/settings.py` | Production-ready (DATABASE_URL, WhiteNoise, Cloudinary, SSL) |
| `Frontend/vercel.json`     | SPA routing + security headers + caching         |
| `Frontend/.env.example`    | Frontend env var template                        |
| `render.yaml`              | Render Blueprint auto-config                     |
