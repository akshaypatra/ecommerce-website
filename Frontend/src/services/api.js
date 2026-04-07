import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Handle response errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Product API
export const productAPI = {
  getAll: () => apiClient.get('/products/'),
  getById: (id) => apiClient.get(`/products/${id}/`),
  search: (query) => apiClient.get(`/products/?search=${query}`),
};

// Cart API
export const cartAPI = {
  addItem: (productId, quantity) =>
    apiClient.post('/cart/', { product: productId, quantity }),
  getCart: () => apiClient.get('/cart/'),
  removeItem: (itemId) => apiClient.delete(`/cart/${itemId}/`),
  updateItem: (itemId, quantity) =>
    apiClient.patch(`/cart/${itemId}/`, { quantity }),
};

// Order API
export const orderAPI = {
  create: (orderData) => apiClient.post('/orders/', orderData),
  getAll: () => apiClient.get('/orders/'),
  getById: (id) => apiClient.get(`/orders/${id}/`),
};

// Auth API
export const authAPI = {
  login: (username, password) =>
    apiClient.post('/auth/login/', { username, password }),
  register: (userData) =>
    apiClient.post('/auth/register/', userData),
  logout: () => apiClient.post('/auth/logout/'),
};

// User API
export const userAPI = {
  getProfile: () => apiClient.get('/users/profile/'),
  updateProfile: (userData) =>
    apiClient.patch('/users/profile/', userData),
};

export default apiClient;
