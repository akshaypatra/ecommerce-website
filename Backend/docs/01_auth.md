# Auth Service — `/api/auth/`

Base URL: `http://localhost:8000/api/auth`

All protected endpoints require the header:
```
Authorization: Bearer <access_token>
```

---

## POST `/register/`
Register a new user. Returns user profile + JWT token pair.

**Request**
```json
{
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "9876543210",
  "password": "StrongPass@123",
  "password2": "StrongPass@123"
}
```

**Response `201`**
```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "9876543210",
    "avatar": null,
    "date_joined": "2026-03-24T10:00:00Z"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1Q...",
    "access": "eyJ0eXAiOiJKV1Q..."
  }
}
```

---

## POST `/login/`
Login with email & password. Returns user profile + JWT token pair.

**Request**
```json
{
  "email": "john@example.com",
  "password": "StrongPass@123"
}
```

**Response `200`**
```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "9876543210",
    "avatar": null,
    "date_joined": "2026-03-24T10:00:00Z"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1Q...",
    "access": "eyJ0eXAiOiJKV1Q..."
  }
}
```

---

## POST `/logout/`
Blacklists the refresh token. Requires authentication.

**Request**
```json
{
  "refresh": "eyJ0eXAiOiJKV1Q..."
}
```

**Response `205`**
```json
{
  "detail": "Logged out successfully."
}
```

---

## POST `/token/refresh/`
Get a new access token using a valid refresh token.

**Request**
```json
{
  "refresh": "eyJ0eXAiOiJKV1Q..."
}
```

**Response `200`**
```json
{
  "access": "eyJ0eXAiOiJKV1Q..."
}
```

---

## POST `/google/`
Authenticate via Google OAuth2. Exchange a Google access token for a JWT pair.

> Get `access_token` from Google Sign-In on the frontend.

**Request**
```json
{
  "access_token": "ya29.a0AfH6SM..."
}
```

**Response `200`**
```json
{
  "user": {
    "id": 2,
    "email": "jane@gmail.com",
    "first_name": "Jane",
    "last_name": "Smith",
    "phone": "",
    "avatar": null,
    "date_joined": "2026-03-24T10:05:00Z"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1Q...",
    "access": "eyJ0eXAiOiJKV1Q..."
  }
}
```

---

## GET `/profile/`
Get the authenticated user's profile.

**Response `200`**
```json
{
  "id": 1,
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "9876543210",
  "avatar": null,
  "date_joined": "2026-03-24T10:00:00Z"
}
```

## PATCH `/profile/`
Update first name, last name, phone, or avatar.

**Request** (`multipart/form-data` for avatar upload, or `application/json` for text fields)
```json
{
  "first_name": "Johnny",
  "phone": "9999999999"
}
```

**Response `200`** — returns updated profile object.

---

## GET `/addresses/`
List all saved addresses for the authenticated user.

**Response `200`**
```json
[
  {
    "id": 1,
    "user": 1,
    "address_type": "home",
    "full_name": "John Doe",
    "phone": "9876543210",
    "address_line1": "123 MG Road",
    "address_line2": "Apt 4B",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001",
    "country": "India",
    "is_default": true,
    "created_at": "2026-03-24T10:10:00Z"
  }
]
```

## POST `/addresses/`
Add a new address.

**Request**
```json
{
  "address_type": "home",
  "full_name": "John Doe",
  "phone": "9876543210",
  "address_line1": "123 MG Road",
  "address_line2": "Apt 4B",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560001",
  "country": "India",
  "is_default": true
}
```

**Response `201`** — returns the created address object.

---

## GET `/addresses/<id>/`
Retrieve a specific address.

## PATCH `/addresses/<id>/`
Update a specific address (partial update supported).

**Request**
```json
{
  "city": "Mumbai",
  "pincode": "400001"
}
```

## DELETE `/addresses/<id>/`
Delete a specific address.

**Response `204`** — No content.

---

## Error Responses

| Code | Meaning |
|------|---------|
| `400` | Validation error / passwords mismatch |
| `401` | Not authenticated |
| `403` | Permission denied |
