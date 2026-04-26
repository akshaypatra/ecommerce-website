import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Token refresh logic
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Add auth token to requests
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Handle response errors with token refresh
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${API_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });
        localStorage.setItem('accessToken', data.access);
        if (data.refresh) {
          localStorage.setItem('refreshToken', data.refresh);
        }
        processQueue(null, data.access);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ─── Auth API ───────────────────────────────────────────────
export const authAPI = {
  register: (userData) =>
    apiClient.post('/auth/register/', userData),

  login: (email, password) =>
    apiClient.post('/auth/login/', { email, password }),

  logout: (refreshToken) =>
    apiClient.post('/auth/logout/', { refresh: refreshToken }),

  refreshToken: (refreshToken) =>
    apiClient.post('/auth/token/refresh/', { refresh: refreshToken }),

  googleLogin: (accessToken) =>
    apiClient.post('/auth/google/', { access_token: accessToken }),

  getProfile: () =>
    apiClient.get('/auth/profile/'),

  updateProfile: (data) =>
    apiClient.patch('/auth/profile/', data),

  getAddresses: () =>
    apiClient.get('/auth/addresses/'),

  createAddress: (data) =>
    apiClient.post('/auth/addresses/', data),

  updateAddress: (id, data) =>
    apiClient.patch(`/auth/addresses/${id}/`, data),

  deleteAddress: (id) =>
    apiClient.delete(`/auth/addresses/${id}/`),
};

// ─── Product API ────────────────────────────────────────────
export const productAPI = {
  getAll: (params = {}) =>
    apiClient.get('/products/', { params }),

  getById: (id) =>
    apiClient.get(`/products/${id}/`),

  search: (query) =>
    apiClient.get('/products/', { params: { search: query } }),

  getByCategory: (categorySlug) =>
    apiClient.get('/products/', { params: { category_slug: categorySlug } }),

  getFeatured: () =>
    apiClient.get('/products/', { params: { is_featured: true } }),

  getCategories: () =>
    apiClient.get('/products/categories/'),

  getReviews: (productId) =>
    apiClient.get(`/products/${productId}/reviews/`),

  createReview: (productId, data) =>
    apiClient.post(`/products/${productId}/reviews/`, data),
};

// ─── Cart API ───────────────────────────────────────────────
export const cartAPI = {
  getCart: () =>
    apiClient.get('/cart/'),

  addItem: (productId, quantity = 1) =>
    apiClient.post('/cart/add/', { product_id: productId, quantity }),

  updateItem: (itemId, quantity) =>
    apiClient.patch(`/cart/items/${itemId}/`, { quantity }),

  removeItem: (itemId) =>
    apiClient.delete(`/cart/items/${itemId}/`),

  clearCart: () =>
    apiClient.delete('/cart/'),
};

// ─── Order API ──────────────────────────────────────────────
export const orderAPI = {
  create: (addressId, notes = '', shippingCharge = 0) =>
    apiClient.post('/orders/create/', {
      address_id: addressId,
      notes,
      shipping_charge: shippingCharge,
    }),

  getAll: () =>
    apiClient.get('/orders/'),

  getById: (orderId) =>
    apiClient.get(`/orders/${orderId}/`),

  downloadInvoice: (orderId) =>
    apiClient.get(`/orders/${orderId}/invoice/`, { responseType: 'blob' }),

  cancelOrder: (orderId, reason = '') =>
    apiClient.post(`/orders/${orderId}/cancel/`, { reason }),
};

// ─── Payment API ────────────────────────────────────────────
export const paymentAPI = {
  createRazorpayOrder: (orderId) =>
    apiClient.post('/payments/razorpay/create/', { order_id: orderId }),

  verifyRazorpayPayment: (data) =>
    apiClient.post('/payments/razorpay/verify/', data),

  createStripePaymentIntent: (orderId, currency = 'inr') =>
    apiClient.post('/payments/stripe/create/', { order_id: orderId, currency }),

  getPaymentDetails: (orderId) =>
    apiClient.get(`/payments/${orderId}/`),
};

export default apiClient;
