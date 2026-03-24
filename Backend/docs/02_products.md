# Product Service — `/api/products/`

Base URL: `http://localhost:8000/api/products`

- **Public** endpoints: product list, detail, categories, reviews (GET)
- **Auth required**: POST review
- **Admin only**: create/update/delete products & categories

Authorization header for protected routes:
```
Authorization: Bearer <access_token>
```

---

## GET `/`
List all active products. Supports search, filters, and ordering.

**Query Parameters**

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Search in name, description, category name |
| `category` | int | Filter by category ID |
| `category_slug` | string | Filter by category slug |
| `min_price` | decimal | Minimum price |
| `max_price` | decimal | Maximum price |
| `in_stock` | boolean | `true` → only items with stock > 0 |
| `is_featured` | boolean | `true` → only featured products |
| `ordering` | string | One of: `price`, `-price`, `created_at`, `-created_at`, `name` |
| `page` | int | Page number (20 items per page) |

**Example**
```
GET /api/products/?search=shirt&category=3&min_price=500&max_price=2000&ordering=-price
```

**Response `200`**
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Classic White Shirt",
      "slug": "classic-white-shirt",
      "category": 3,
      "category_name": "Shirts",
      "price": "1299.00",
      "discount_price": "999.00",
      "discount_percentage": 23.1,
      "effective_price": "999.00",
      "stock": 50,
      "is_active": true,
      "is_featured": true,
      "average_rating": 4.5,
      "primary_image": "http://localhost:8000/media/products/shirt.jpg"
    }
  ]
}
```

---

## GET `/<id>/`
Get full product details including all images and reviews.

**Response `200`**
```json
{
  "id": 1,
  "name": "Classic White Shirt",
  "slug": "classic-white-shirt",
  "description": "Premium cotton classic white shirt.",
  "category": 3,
  "category_name": "Shirts",
  "price": "1299.00",
  "discount_price": "999.00",
  "discount_percentage": 23.1,
  "effective_price": "999.00",
  "stock": 50,
  "sku": "SHIRT-WHT-001",
  "is_active": true,
  "is_featured": true,
  "average_rating": 4.5,
  "created_at": "2026-03-20T08:00:00Z",
  "updated_at": "2026-03-24T10:00:00Z",
  "images": [
    {
      "id": 1,
      "image": "http://localhost:8000/media/products/shirt.jpg",
      "alt_text": "Front view",
      "is_primary": true,
      "order": 0
    }
  ],
  "reviews": [
    {
      "id": 1,
      "user_email": "john@example.com",
      "rating": 5,
      "title": "Great quality",
      "comment": "Love this shirt!",
      "created_at": "2026-03-22T14:00:00Z"
    }
  ]
}
```

---

## POST `/create/`  *(Admin only)*
Create a new product.

**Request**
```json
{
  "name": "Classic White Shirt",
  "description": "Premium cotton classic white shirt.",
  "category": 3,
  "price": "1299.00",
  "discount_price": "999.00",
  "stock": 100,
  "sku": "SHIRT-WHT-001",
  "is_active": true,
  "is_featured": false
}
```

**Response `201`** — returns the created product object.

---

## PATCH `/<id>/manage/`  *(Admin only)*
Partially update a product.

**Request**
```json
{
  "price": "1199.00",
  "stock": 75,
  "is_featured": true
}
```

**Response `200`** — returns updated product.

## DELETE `/<id>/manage/`  *(Admin only)*
Delete a product.

**Response `204`** — No content. Also invalidates Redis cache.

---

## POST `/<id>/images/`  *(Admin only)*
Upload one or more images for a product.

**Request** (`multipart/form-data`)

| Field | Type | Description |
|-------|------|-------------|
| `images` | file(s) | One or multiple image files |
| `is_primary` | boolean | Mark as primary image |

**Example (curl)**
```bash
curl -X POST http://localhost:8000/api/products/1/images/ \
  -H "Authorization: Bearer <token>" \
  -F "images=@shirt_front.jpg" \
  -F "images=@shirt_back.jpg" \
  -F "is_primary=true"
```

**Response `201`**
```json
[
  { "id": 1, "image": "http://localhost:8000/media/products/shirt_front.jpg" },
  { "id": 2, "image": "http://localhost:8000/media/products/shirt_back.jpg" }
]
```

---

## GET `/categories/`
List all active root categories with nested children.  
**Redis cached for 5 minutes.**

**Response `200`**
```json
[
  {
    "id": 1,
    "name": "Clothing",
    "slug": "clothing",
    "description": "All clothing items",
    "image": null,
    "parent": null,
    "children": [
      {
        "id": 3,
        "name": "Shirts",
        "slug": "shirts",
        "description": "",
        "image": null,
        "parent": 1,
        "children": [],
        "is_active": true
      }
    ],
    "is_active": true
  }
]
```

## POST `/categories/create/`  *(Admin only)*
Create a new category.

**Request**
```json
{
  "name": "Footwear",
  "description": "All kinds of footwear",
  "parent": null,
  "is_active": true
}
```

**Response `201`** — returns created category.

## PATCH `/categories/<id>/`  *(Admin only)*
Update a category.

**Request**
```json
{
  "description": "Updated description",
  "is_active": false
}
```

## DELETE `/categories/<id>/`  *(Admin only)*
Delete a category.

---

## GET `/<id>/reviews/`
List all reviews for a product.

**Response `200`**
```json
[
  {
    "id": 1,
    "user_email": "john@example.com",
    "rating": 5,
    "title": "Excellent!",
    "comment": "Best purchase I've made.",
    "created_at": "2026-03-22T14:00:00Z"
  }
]
```

## POST `/<id>/reviews/`  *(Auth required)*
Submit a review. Each user can review a product only once.

**Request**
```json
{
  "rating": 4,
  "title": "Good product",
  "comment": "Fits perfectly, good quality fabric."
}
```

**Response `201`** — returns the created review.

---

## Caching Notes

| Cache Key | TTL | Invalidated on |
|-----------|-----|----------------|
| `ecommerce:categories_list` | 5 min | Category create/update/delete |
| `ecommerce:product_list` | 5 min | Product create/update/delete |

---

## Error Responses

| Code | Meaning |
|------|---------|
| `400` | Validation error |
| `401` | Not authenticated |
| `403` | Not admin |
| `404` | Product/Category not found |
