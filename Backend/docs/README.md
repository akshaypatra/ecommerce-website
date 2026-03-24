# Ecommerce Backend — API Reference

Django REST Framework backend with PostgreSQL + Redis.

## Services

| File | Service | Base URL |
|------|---------|----------|
| [01_auth.md](01_auth.md) | Auth (JWT + Google OAuth) | `/api/auth/` |
| [02_products.md](02_products.md) | Products, Categories, Reviews | `/api/products/` |
| [03_cart.md](03_cart.md) | Shopping Cart | `/api/cart/` |
| [04_orders.md](04_orders.md) | Orders, Tracking, Invoice | `/api/orders/` |
| [05_payments.md](05_payments.md) | Razorpay & Stripe | `/api/payments/` |

---

## Quick Endpoint Reference

### Auth — `/api/auth/`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register/` | Public | Register user |
| POST | `/login/` | Public | Login |
| POST | `/logout/` | ✓ | Blacklist refresh token |
| POST | `/token/refresh/` | Public | Refresh access token |
| POST | `/google/` | Public | Google OAuth2 login |
| GET/PATCH | `/profile/` | ✓ | User profile |
| GET/POST | `/addresses/` | ✓ | List / create addresses |
| GET/PATCH/DELETE | `/addresses/<id>/` | ✓ | Manage address |

### Products — `/api/products/`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Public | List products (search + filter + paginate) |
| GET | `/<id>/` | Public | Product detail |
| POST | `/create/` | Admin | Create product |
| PATCH/DELETE | `/<id>/manage/` | Admin | Update / delete product |
| POST | `/<id>/images/` | Admin | Upload product images |
| GET | `/categories/` | Public | List categories (cached) |
| POST | `/categories/create/` | Admin | Create category |
| PATCH/DELETE | `/categories/<id>/` | Admin | Update / delete category |
| GET | `/<id>/reviews/` | Public | List reviews |
| POST | `/<id>/reviews/` | ✓ | Submit review |

### Cart — `/api/cart/`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ✓ | View cart |
| DELETE | `/` | ✓ | Clear cart |
| POST | `/add/` | ✓ | Add item |
| PATCH | `/items/<id>/` | ✓ | Update quantity |
| DELETE | `/items/<id>/` | ✓ | Remove item |

### Orders — `/api/orders/`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/create/` | ✓ | Create order from cart |
| GET | `/` | ✓ | Order history |
| GET | `/<order_id>/` | ✓ | Order detail |
| PATCH | `/<order_id>/status/` | Admin | Update order status |
| GET | `/admin/` | Admin | All orders |
| GET | `/<order_id>/invoice/` | ✓ | Download PDF invoice |

### Payments — `/api/payments/`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/razorpay/create/` | ✓ | Create Razorpay order |
| POST | `/razorpay/verify/` | ✓ | Verify Razorpay payment |
| POST | `/razorpay/webhook/` | Public | Razorpay webhook |
| POST | `/stripe/create/` | ✓ | Create Stripe PaymentIntent |
| POST | `/stripe/webhook/` | Public | Stripe webhook |
| GET | `/<order_id>/` | ✓ | Payment details |

---

## Authentication

JWT-based. Tokens delivered on login/register.

```
Authorization: Bearer <access_token>
```

- Access token lifetime: **60 minutes**
- Refresh token lifetime: **7 days**
- Refresh token is rotated and blacklisted on each use

---

## Running the Server

```bash
# Activate virtual environment
.\venv\Scripts\Activate.ps1          # Windows
source venv/bin/activate             # Linux/Mac

# Run development server
python manage.py runserver
```

Make sure **PostgreSQL** and **Redis** are running before starting the server.

---

## Environment Variables

Copy `.env` and fill in your keys:

```env
SECRET_KEY=...
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=ecommerce_db
DB_USER=ecommerce_user
DB_PASSWORD=admin
DB_HOST=localhost
DB_PORT=5432

REDIS_URL=redis://127.0.0.1:6379/1

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...

STRIPE_PUBLISHABLE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...

FRONTEND_URL=http://localhost:3000
```
