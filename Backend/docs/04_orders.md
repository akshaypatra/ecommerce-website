# Order Service — `/api/orders/`

Base URL: `http://localhost:8000/api/orders`

All endpoints require authentication:
```
Authorization: Bearer <access_token>
```

---

## POST `/create/`
Create a new order from the current cart.

**Flow:**
1. Validates all cart items have sufficient stock.
2. Snapshots product names & prices into `OrderItem` rows.
3. Deducts stock from each `Product`.
4. Calculates subtotal and total.
5. Clears the cart.
6. Records initial status history entry (`pending`).

**Request**
```json
{
  "address_id": 1,
  "notes": "Please leave at door.",
  "shipping_charge": 49.00
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `address_id` | Yes | ID of a saved address belonging to the user |
| `notes` | No | Delivery instructions |
| `shipping_charge` | No | Defaults to `0` |

**Response `201`**
```json
{
  "id": 1,
  "order_id": "a3f7b2c1-84d2-4e6a-b123-000000000001",
  "user": 1,
  "shipping_full_name": "John Doe",
  "shipping_phone": "9876543210",
  "shipping_address_line1": "123 MG Road",
  "shipping_address_line2": "Apt 4B",
  "shipping_city": "Bangalore",
  "shipping_state": "Karnataka",
  "shipping_pincode": "560001",
  "shipping_country": "India",
  "status": "pending",
  "payment_status": "pending",
  "payment_method": "",
  "subtotal": "1998.00",
  "discount": "0.00",
  "shipping_charge": "49.00",
  "total": "2047.00",
  "notes": "Please leave at door.",
  "tracking_number": "",
  "items": [
    {
      "id": 1,
      "product": 1,
      "product_name": "Classic White Shirt",
      "product_price": "999.00",
      "quantity": 2,
      "subtotal": "1998.00"
    }
  ],
  "status_history": [
    {
      "status": "pending",
      "note": "Order placed.",
      "created_at": "2026-03-24T12:00:00Z"
    }
  ],
  "created_at": "2026-03-24T12:00:00Z",
  "updated_at": "2026-03-24T12:00:00Z"
}
```

**Error `400`** — Cart is empty:
```json
{ "detail": "Cart is empty." }
```

**Error `400`** — Insufficient stock:
```json
{ "detail": "Insufficient stock for Classic White Shirt." }
```

---

## GET `/`
List all orders placed by the authenticated user, newest first.

**Response `200`**
```json
[
  {
    "id": 1,
    "order_id": "a3f7b2c1-84d2-4e6a-b123-000000000001",
    "status": "confirmed",
    "payment_status": "paid",
    "total": "2047.00",
    "created_at": "2026-03-24T12:00:00Z",
    "items": [ ... ],
    "status_history": [ ... ]
  }
]
```

---

## GET `/<order_id>/`
Get full details of a single order by its UUID.

**URL Parameter:** `order_id` — UUID of the order (e.g., `a3f7b2c1-84d2-4e6a-b123-000000000001`)

**Response `200`** — Full order object (same as create response above).

---

## PATCH `/<order_id>/status/`  *(Admin only)*
Update order status and optionally set a tracking number.

**Valid status values:**
`pending` → `confirmed` → `processing` → `shipped` → `out_for_delivery` → `delivered`  
Also: `cancelled`, `refunded`

**Request**
```json
{
  "status": "shipped",
  "tracking_number": "DTDC123456789",
  "note": "Shipped via DTDC."
}
```

**Response `200`** — Full updated order object.

---

## GET `/admin/`  *(Admin only)*
List all orders across all users.

**Query Parameters**

| Param | Description |
|-------|-------------|
| `status` | Filter by order status |
| `payment_status` | Filter by payment status |
| `search` | Search by user email, order_id, or shipping name |
| `ordering` | `created_at`, `-created_at`, `total`, `-total` |
| `page` | Page number |

---

## GET `/<order_id>/invoice/`
Download a PDF invoice for the order.

> Only available for orders with `payment_status = "paid"`.

**Response `200`**  
`Content-Type: application/pdf`  
`Content-Disposition: attachment; filename="invoice_a3f7b2c1.pdf"`

The PDF includes:
- Invoice number and date
- Billed-to / Ship-to details
- Line items table with unit price, quantity, subtotal
- Discount, shipping charge, and grand total

**Error `400`** — Order not yet paid:
```json
{ "detail": "Invoice available only for paid orders." }
```

---

## Order Status Flow

```
pending ──► confirmed ──► processing ──► shipped ──► out_for_delivery ──► delivered
                │
                └──► cancelled
                └──► refunded
```

Each status change is recorded in `status_history` with timestamp, note, and changed-by user.

---

## Error Responses

| Code | Meaning |
|------|---------|
| `400` | Empty cart / insufficient stock / order not paid |
| `401` | Not authenticated |
| `403` | Not admin (for admin endpoints) |
| `404` | Order or address not found |
