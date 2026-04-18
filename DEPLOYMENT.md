# Deployment Guide — Divine Gems E-commerce

> **Cost: $0/month** for up to 1000+ daily customers on free tiers.

## Architecture Overview

```
┌──────────────┐      ┌──────────────────┐      ┌──────────────┐
│   Vercel      │      │   Render          │      │   Neon        │
│   (Frontend)  │─────▶│   (Django API)    │─────▶│  (PostgreSQL) │
│   React SPA   │ API  │   Gunicorn        │      │   Free tier   │
│   Global CDN  │      │   WhiteNoise      │      └──────────────┘
└──────────────┘      │                    │      ┌──────────────┐
                       │                    │─────▶│   Upstash     │
                       │                    │      │   (Redis)     │
                       └──────────────────┘      └──────────────┘
                              │
                              ▼
                       ┌──────────────┐
                       │  Cloudinary   │
                       │  (Media/Imgs) │
                       └──────────────┘
```

| Service | Platform | Free Tier Limits | Enough? |
|---------|----------|-----------------|---------|
| Frontend | **Vercel** | 100GB bandwidth, unlimited deploys | Yes — React build is ~2MB |
| Backend | **Render** | 750h/month, auto-sleep after 15min | Yes — wakes in ~30s on request |
| Database | **Neon** | 0.5GB storage, 190h compute/month | Yes — 1000 users ≈ 50-100MB |
| Redis | **Upstash** | 10K commands/day, 256MB | Yes — caching only |
| Media | **Cloudinary** | 25GB bandwidth, 25K transforms | Yes — product images |

---

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
cd B:\Ecommerce_website
git init
git add .
git commit -m "Initial commit — Divine Gems E-commerce"
git remote add origin https://github.com/YOUR_USERNAME/divine-gems.git
git push -u origin main
```

---

### 2. Setup Neon (PostgreSQL) — 5 minutes

1. Go to [https://console.neon.tech](https://console.neon.tech) → Sign up free
2. **Create Project** → Name: `divine-gems` → Region: **US East** (closest to Render Oregon)
3. Copy the **Connection String** — looks like:
   ```
   postgresql://neondb_owner:xxxx@ep-cool-name-123.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Save this — you'll use it as `DATABASE_URL` on Render.

---

### 3. Setup Upstash (Redis) — 3 minutes

1. Go to [https://console.upstash.com](https://console.upstash.com) → Sign up free
2. **Create Database** → Name: `divine-gems-cache` → Region: **US East 1**
3. Copy the **Redis URL** (TLS) — looks like:
   ```
   rediss://default:xxxx@us1-xxx.upstash.io:6379
   ```
4. Save this — you'll use it as `REDIS_URL` on Render.

---

### 4. Setup Cloudinary (Media) — 3 minutes

1. Go to [https://console.cloudinary.com](https://console.cloudinary.com) → Sign up free
2. From Dashboard, copy:
   - **Cloud Name**, **API Key**, **API Secret**
3. Save these for Render env vars.

---

### 5. Deploy Backend on Render — 10 minutes

1. Go to [https://dashboard.render.com](https://dashboard.render.com) → Sign up free
2. **New → Web Service** → Connect your GitHub repo
3. Configure:
   - **Name:** `divine-gems-api`
   - **Root Directory:** `Backend`
   - **Runtime:** Python
   - **Build Command:** `chmod +x build.sh && ./build.sh`
   - **Start Command:** `gunicorn core.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --threads 2 --timeout 120`
   - **Plan:** Free

4. **Environment Variables** — Add these:

   | Key | Value |
   |-----|-------|
   | `DEBUG` | `False` |
   | `SECRET_KEY` | *(click Generate)* |
   | `DATABASE_URL` | *(Neon connection string from step 2)* |
   | `REDIS_URL` | *(Upstash URL from step 3)* |
   | `ALLOWED_HOSTS` | `divine-gems-api.onrender.com` |
   | `CORS_ALLOWED_ORIGINS` | `https://divine-gems.vercel.app` |
   | `FRONTEND_URL` | `https://divine-gems.vercel.app` |
   | `CLOUDINARY_URL` | `cloudinary://key:secret@cloud_name` |
   | `CLOUDINARY_CLOUD_NAME` | *(from Cloudinary)* |
   | `CLOUDINARY_API_KEY` | *(from Cloudinary)* |
   | `CLOUDINARY_API_SECRET` | *(from Cloudinary)* |
   | `RAZORPAY_KEY_ID` | *(your key)* |
   | `RAZORPAY_KEY_SECRET` | *(your secret)* |
   | `STRIPE_PUBLISHABLE_KEY` | *(your key)* |
   | `STRIPE_SECRET_KEY` | *(your secret)* |
   | `STRIPE_WEBHOOK_SECRET` | *(your secret)* |
   | `PYTHON_VERSION` | `3.12.4` |

5. Click **Create Web Service** → Wait for build (~3-5 min)
6. Your API is live at: `https://divine-gems-api.onrender.com`

---

### 6. Deploy Frontend on Vercel — 5 minutes

1. Go to [https://vercel.com](https://vercel.com) → Sign up with GitHub
2. **Import Project** → Select your GitHub repo
3. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `Frontend`
   - **Build Command:** `npm run build` *(auto-detected)*
   - **Output Directory:** `build` *(auto-detected)*

4. **Environment Variables** — Add:

   | Key | Value |
   |-----|-------|
   | `REACT_APP_API_URL` | `https://divine-gems-api.onrender.com/api` |
   | `REACT_APP_RAZORPAY_KEY_ID` | *(your Razorpay publishable key)* |
   | `REACT_APP_STRIPE_PUBLISHABLE_KEY` | *(your Stripe publishable key)* |

5. Click **Deploy** → Live in ~1 minute at `https://divine-gems.vercel.app`

---

### 7. Create Django Superuser (one-time)

After Render deploys successfully, go to Render Dashboard → your service → **Shell** tab:

```bash
python manage.py createsuperuser
```

Then access admin at: `https://divine-gems-api.onrender.com/admin/`

---

### 8. Setup Payment Webhooks

**Stripe:**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://divine-gems-api.onrender.com/api/payments/stripe/webhook/`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy webhook secret → Update `STRIPE_WEBHOOK_SECRET` on Render

**Razorpay:**
1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add endpoint: `https://divine-gems-api.onrender.com/api/payments/razorpay/webhook/`
3. Select: `payment.captured`, `payment.failed`

---

## Post-Deployment Checklist

- [ ] Visit `https://divine-gems.vercel.app` — frontend loads
- [ ] Visit `https://divine-gems-api.onrender.com/api/products/` — API responds
- [ ] Register a user, login, browse products
- [ ] Add to cart, checkout, test payment flow
- [ ] Upload product images via admin → confirm Cloudinary stores them
- [ ] Check Neon dashboard → verify tables created
- [ ] Test on mobile — responsive menu works

---

## Important Notes

### Render Free Tier Cold Starts
Render's free tier spins down after 15 minutes of inactivity. First request after sleep takes **~30-50 seconds**. With 1000+ daily customers, the site stays warm during business hours. For always-on:
- **Option A:** Use [UptimeRobot](https://uptimerobot.com) (free) to ping your API every 14 minutes
- **Option B:** Upgrade to Render Starter ($7/month) — always on, much faster

### Custom Domain (Free)
- **Vercel:** Settings → Domains → Add `www.divinegems.com`
- **Render:** Settings → Custom Domains → Add `api.divinegems.com`
- Point DNS: Frontend `CNAME → cname.vercel-dns.com`, API `CNAME → divine-gems-api.onrender.com`

### Scaling Beyond Free Tier
When you outgrow free tiers:

| Service | Upgrade | Cost |
|---------|---------|------|
| Render | Starter plan | $7/mo (always-on, faster) |
| Neon | Launch plan | $19/mo (10GB, more compute) |
| Vercel | Pro | $20/mo (team features) |
| **Total** | | **$46/mo** for full production |

---

## File Reference

| File | Purpose |
|------|---------|
| `Backend/build.sh` | Render build script (pip install, migrate, collectstatic) |
| `Backend/Procfile` | Gunicorn start command |
| `Backend/.env.example` | All required environment variables |
| `Frontend/vercel.json` | SPA routing + cache headers for Vercel |
| `Frontend/.env.example` | Frontend environment variables |
| `render.yaml` | Render Blueprint (auto-config) |
