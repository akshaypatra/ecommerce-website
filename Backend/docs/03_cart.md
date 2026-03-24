# Cart Service — `/api/cart/`

Base URL: `http://localhost:8000/api/cart`

All endpoints require authentication:
```
Authorization: Bearer <access_token>
```

**Storage strategy:**  
- Cart data is persisted in **PostgreSQL** (`Cart` + `CartItem` tables).  
- A **Redis cache** (TTL 10 min) is maintained per user for fast GET reads.  
- Cache is automatically invalidated on any add/update/remove/clear operation.

---

## GET `/`
Retrieve the authenticated user's cart with all items, subtotals, and grand total.

**Response `200`**
```json
{
  "id": 1,
  "items": [
    {
      "id": 1,
      "product": 1,
      "product_detail": {
        "id": 1,
        "name": "Classic White Shirt",
        "slug": "classic-white-shirt",
        "price": "1299.00",
        "discount_price": "999.00",
        "effective_price": "999.00",
        "primary_image": "http://localhost:8000/media/products/shirt.jpg"
      },
      "quantity": 2,
      "subtotal": "1998.00",
      "added_at": "2026-03-24T11:00:00Z"
    }
  ],
  "total_price": "1998.00",
  "total_items": 2,
  "updated_at": "2026-03-24T11:00:00Z"
}
```

---

## DELETE `/`
Clear the entire cart (remove all items).

**Response `204`** — No content.

---

## POST `/add/`
Add a product to the cart.  
- If the product is already in the cart, quantity is **incremented** by the given amount.  
- Validates that enough stock is available.

**Request**
```json
{
  "product_id": 1,
  "quantity": 2
}
```

**Response `201`**
```json
{
  "id": 1,
  "product": 1,
  "product_detail": {
    "id": 1,
    "name": "Classic White Shirt",
    "price": "1299.00",
    "effective_price": "999.00"
  },
  "quantity": 2,
  "subtotal": "1998.00",
  "added_at": "2026-03-24T11:00:00Z"
}
```

**Error `400`** — if stock is insufficient:
```json
{
  "detail": "Only 1 items available."
}
```

---

## PATCH `/items/<item_id>/`
Update the quantity of a specific cart item.

**Request**
```json
{
  "quantity": 3
}
```

**Response `200`** — returns updated cart item.

**Error `400`** — if new quantity exceeds stock:
```json
{
  "detail": "Only 2 in stock."
}
```

---

## DELETE `/items/<item_id>/`
Remove a specific item from the cart.

**Response `204`** — No content.

---

## Error Responses

| Code | Meaning |
|------|---------|
| `400` | Invalid quantity / insufficient stock |
| `401` | Not authenticated |
| `404` | Cart item or product not found |
