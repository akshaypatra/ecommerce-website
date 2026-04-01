# E-commerce Backend API

A Django REST API for an e-commerce platform with product catalog, shopping cart, order management, and payment processing.

---

## Prerequisites

- **Python 3.10+**
- **Redis**: For caching and session management
- **PostgreSQL** (optional): Database backend (SQLite used by default in development)
- **Git**: Version control

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Ecommerce_website/Backend
```

### 2. Create and Activate Virtual Environment

**Windows (PowerShell):**
```powershell
python -m venv venv
& .\venv\Scripts\Activate.ps1
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Set Up Environment Variables

Create a `.env` file in the project root:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (optional, uses SQLite by default)
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce_db

# Redis Cache
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Email (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Payment Gateway (Stripe/Razorpay)
STRIPE_SECRET_KEY=your-stripe-key
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

### 5. Start Redis Server

**Windows (Docker):**
```powershell
docker run -d -p 6379:6379 redis
```

**Windows (Direct Installation):**
- Download [Memurai](https://www.memurai.com/) or [Redis for Windows](https://github.com/microsoftarchive/redis/releases)
- Install and start the service

**macOS/Linux:**
```bash
redis-server
```

### 6. Apply Database Migrations

```bash
python manage.py migrate
```

### 7. Create a Superuser (Admin Account)

```bash
python manage.py createsuperuser
```

Follow the prompts to set username, email, and password.

### 8. Load Sample Data (Optional)

```bash
python manage.py loaddata initial_data.json
```

### 9. Run the Development Server

```bash
python manage.py runserver
```

The API will be available at: `http://localhost:8000/api/`

Admin dashboard: `http://localhost:8000/admin/`

---

## Project Structure

```
Backend/
├── cart/              # Shopping cart management
├── core/              # Project settings & configuration
├── docs/              # API documentation
├── orders/            # Order management
├── payments/          # Payment processing
├── products/          # Product catalog
├── users/             # User authentication & profiles
├── manage.py          # Django management script
├── requirements.txt   # Python dependencies
└── Readme.md          # This file
```

---

## API Documentation

See the [docs/](docs/) folder for detailed API documentation:

- [docs/01_auth.md](docs/01_auth.md) - Authentication & User Management
- [docs/02_products.md](docs/02_products.md) - Products & Categories
- [docs/03_cart.md](docs/03_cart.md) - Shopping Cart
- [docs/04_orders.md](docs/04_orders.md) - Orders
- [docs/05_payments.md](docs/05_payments.md) - Payments

---

## Running Tests

```bash
python manage.py test
```

Run tests for a specific app:
```bash
python manage.py test products
python manage.py test orders
```

---

## Troubleshooting

### Redis Connection Error

**Error:** `redis.exceptions.ConnectionError: Error 10061 connecting to 127.0.0.1:6379`

**Solution:** Start Redis server (see Step 5 above)

### Database Migration Issues

```bash
python manage.py makemigrations
python manage.py migrate
```

### Port Already in Use

If port 8000 is already in use:
```bash
python manage.py runserver 8080
```

### Clear Cache

```bash
python manage.py shell
>>> from django.core.cache import cache
>>> cache.clear()
```

---

## Key Features

- ✅ User authentication (JWT tokens)
- ✅ Product catalog with filtering & search
- ✅ Shopping cart functionality
- ✅ Order management with invoices
- ✅ Payment integration (Stripe & Razorpay)
- ✅ Redis caching for performance
- ✅ Admin dashboard
- ✅ CORS support for frontend integration

---

## Tech Stack

- **Framework**: Django 6.0.3
- **API**: Django REST Framework 3.17.0
- **Authentication**: JWT (Simple JWT)
- **Database**: PostgreSQL (production) / SQLite (development)
- **Cache**: Redis
- **Payment**: Stripe & Razorpay
- **File Storage**: Pillow for image handling

---

## Future Implementation

- [ ] Google OAuth integration
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Inventory management system
- [ ] Review & rating system enhancements
- [ ] Mobile app API versioning  