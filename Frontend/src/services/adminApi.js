import apiClient from './api';

// ─── Admin API Service ──────────────────────────────────────
const adminAPI = {
  // Dashboard
  getDashboard: () => apiClient.get('/admin/dashboard/'),

  // Users
  getUsers: (params = {}) => apiClient.get('/admin/users/', { params }),
  getUser: (id) => apiClient.get(`/admin/users/${id}/`),
  createUser: (data) => apiClient.post('/admin/users/', data),
  updateUser: (id, data) => apiClient.patch(`/admin/users/${id}/`, data),
  deleteUser: (id) => apiClient.delete(`/admin/users/${id}/`),
  toggleUserActive: (id) => apiClient.post(`/admin/users/${id}/toggle_active/`),
  toggleUserStaff: (id) => apiClient.post(`/admin/users/${id}/toggle_staff/`),

  // Categories
  getCategories: (params = {}) => apiClient.get('/admin/categories/', { params }),
  getCategory: (id) => apiClient.get(`/admin/categories/${id}/`),
  createCategory: (data) => apiClient.post('/admin/categories/', data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  }),
  updateCategory: (id, data) => apiClient.patch(`/admin/categories/${id}/`, data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  }),
  deleteCategory: (id) => apiClient.delete(`/admin/categories/${id}/`),

  // Products
  getProducts: (params = {}) => apiClient.get('/admin/products/', { params }),
  getProduct: (id) => apiClient.get(`/admin/products/${id}/`),
  createProduct: (data) => apiClient.post('/admin/products/', data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  }),
  updateProduct: (id, data) => apiClient.patch(`/admin/products/${id}/`, data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  }),
  deleteProduct: (id) => apiClient.delete(`/admin/products/${id}/`),
  toggleProductActive: (id) => apiClient.post(`/admin/products/${id}/toggle_active/`),
  toggleProductFeatured: (id) => apiClient.post(`/admin/products/${id}/toggle_featured/`),

  // Reviews
  getReviews: (params = {}) => apiClient.get('/admin/reviews/', { params }),
  deleteReview: (id) => apiClient.delete(`/admin/reviews/${id}/`),

  // Orders
  getOrders: (params = {}) => apiClient.get('/admin/orders/', { params }),
  getOrder: (id) => apiClient.get(`/admin/orders/${id}/`),
  updateOrder: (id, data) => apiClient.patch(`/admin/orders/${id}/`, data),
  updateOrderStatus: (id, status, note = '') =>
    apiClient.post(`/admin/orders/${id}/update_status/`, { status, note }),

  // Payments
  getPayments: (params = {}) => apiClient.get('/admin/payments/', { params }),
  getPayment: (id) => apiClient.get(`/admin/payments/${id}/`),

  // Carts
  getCarts: (params = {}) => apiClient.get('/admin/carts/', { params }),

  // Addresses
  getAddresses: (params = {}) => apiClient.get('/admin/addresses/', { params }),
};

export default adminAPI;
