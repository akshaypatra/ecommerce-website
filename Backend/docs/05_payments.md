# Payment Service — `/api/payments/`

Base URL: `http://localhost:8000/api/payments`

---

## Payment Flow Overview

```
1. Create Order  →  POST /api/orders/create/
2. Initiate Payment:
      Razorpay  →  POST /api/payments/razorpay/create/
      Stripe    →  POST /api/payments/stripe/create/
3. Frontend completes checkout using gateway SDK
4. Verify / Webhook marks order as paid
5. Order status → "confirmed", payment_status → "paid"
```

---

# Razorpay

## POST `/razorpay/create/`  *(Auth required)*
Creates a Razorpay order on the backend. The returned values are passed to the Razorpay checkout SDK on the frontend.

**Request**
```json
{
  "order_id": "a3f7b2c1-84d2-4e6a-b123-000000000001"
}
```

**Response `200`**
```json
{
  "razorpay_key": "rzp_test_XXXXXXXXXXXX",
  "razorpay_order_id": "order_XXXXXXXXXXXXXXXX",
  "amount": 204700,
  "currency": "INR",
  "order_id": "a3f7b2c1-84d2-4e6a-b123-000000000001",
  "name": "John Doe",
  "email": "john@example.com",
  "contact": "9876543210"
}
```

> `amount` is in **paise** (₹2047.00 → `204700`).

**Frontend usage (Razorpay JS SDK):**
```javascript
const options = {
  key: response.razorpay_key,
  amount: response.amount,
  currency: response.currency,
  order_id: response.razorpay_order_id,
  prefill: {
    name: response.name,
    email: response.email,
    contact: response.contact,
  },
  handler: function (paymentResult) {
    // Call /api/payments/razorpay/verify/ with paymentResult
  },
};
const rzp = new Razorpay(options);
rzp.open();
```

---

## POST `/razorpay/verify/`  *(Auth required)*
Verifies the Razorpay payment HMAC signature after the user completes checkout.  
On success: marks `payment_status = "paid"` and `order.status = "confirmed"`.

**Request**
```json
{
  "razorpay_order_id": "order_XXXXXXXXXXXXXXXX",
  "razorpay_payment_id": "pay_XXXXXXXXXXXXXXXX",
  "razorpay_signature": "abc123def456..."
}
```

**Response `200`**
```json
{
  "detail": "Payment verified successfully.",
  "payment": {
    "id": 1,
    "order": 1,
    "gateway": "razorpay",
    "status": "captured",
    "amount": "2047.00",
    "currency": "INR",
    "gateway_order_id": "order_XXXXXXXXXXXXXXXX",
    "gateway_payment_id": "pay_XXXXXXXXXXXXXXXX",
    "created_at": "2026-03-24T12:05:00Z"
  }
}
```

**Error `400`** — Invalid signature:
```json
{ "detail": "Invalid payment signature." }
```

---

## POST `/razorpay/webhook/`  *(Public — called by Razorpay)*
Handles Razorpay server-to-server webhook events.

> Configure this URL in the Razorpay Dashboard under **Settings → Webhooks**.  
> Set `RAZORPAY_WEBHOOK_SECRET` in your `.env` file.

**Supported events:**

| Event | Action |
|-------|--------|
| `payment.captured` | Marks payment `captured`, order `paid + confirmed` |
| `payment.failed` | Marks payment `failed`, order `payment_status = failed` |

**Headers sent by Razorpay:**
```
X-Razorpay-Signature: <hmac_sha256>
Content-Type: application/json
```

**Response `200`** — Always returns `200` to acknowledge receipt.

---

# Stripe

## POST `/stripe/create/`  *(Auth required)*
Creates a Stripe PaymentIntent and returns the `client_secret` for the frontend Stripe Elements / Payment Sheet.

**Request**
```json
{
  "order_id": "a3f7b2c1-84d2-4e6a-b123-000000000001",
  "currency": "inr"
}
```

| Field | Required | Default |
|-------|----------|---------|
| `order_id` | Yes | — |
| `currency` | No | `inr` |

**Response `200`**
```json
{
  "client_secret": "pi_XXXXXXXXXXXXXX_secret_XXXXXXXX",
  "payment_intent_id": "pi_XXXXXXXXXXXXXX",
  "amount": 204700,
  "currency": "inr",
  "publishable_key": "pk_test_XXXXXXXXXXXX"
}
```

**Frontend usage (Stripe Elements):**
```javascript
const stripe = Stripe(response.publishable_key);
const elements = stripe.elements();
// Mount card element, then:
const result = await stripe.confirmCardPayment(response.client_secret, {
  payment_method: {
    card: cardElement,
    billing_details: { name: "John Doe" },
  },
});
// Stripe webhook or polling handles order confirmation
```

---

## POST `/stripe/webhook/`  *(Public — called by Stripe)*
Handles Stripe server-to-server webhook events.

> Configure this URL in the Stripe Dashboard under **Developers → Webhooks**.  
> Set `STRIPE_WEBHOOK_SECRET` in your `.env` file.

**Supported events:**

| Event | Action |
|-------|--------|
| `payment_intent.succeeded` | Marks payment `captured`, order `paid + confirmed` |
| `payment_intent.payment_failed` | Marks payment `failed`, order `payment_status = failed` |

**Headers sent by Stripe:**
```
Stripe-Signature: t=...,v1=...
Content-Type: application/json
```

**Response `200`** — Always returns `200` to acknowledge receipt.

---

## GET `/<order_id>/`  *(Auth required)*
Retrieve the payment record for a specific order.

**URL Parameter:** `order_id` — UUID of the order.

**Response `200`**
```json
{
  "id": 1,
  "order": 1,
  "gateway": "razorpay",
  "status": "captured",
  "amount": "2047.00",
  "currency": "INR",
  "gateway_order_id": "order_XXXXXXXXXXXXXXXX",
  "gateway_payment_id": "pay_XXXXXXXXXXXXXXXX",
  "created_at": "2026-03-24T12:05:00Z"
}
```

---

## Payment Status Values

| Status | Meaning |
|--------|---------|
| `created` | Gateway order/intent created on backend |
| `pending` | Awaiting user action |
| `captured` | Payment successful |
| `failed` | Payment failed |
| `refunded` | Payment refunded |

---

## `.env` Keys Required

```env
# Razorpay
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=your_key_secret
# RAZORPAY_WEBHOOK_SECRET=your_webhook_secret  # optional but recommended

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXX
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXX
```

---

## Error Responses

| Code | Meaning |
|------|---------|
| `400` | Invalid signature / already paid / bad payload |
| `401` | Not authenticated |
| `404` | Order or payment not found |
