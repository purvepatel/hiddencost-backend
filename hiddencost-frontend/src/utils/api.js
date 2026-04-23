import axios from 'axios';

// ============================================================
// API Service — Centralized API calls (CLO4)
// ============================================================

// Configure axios defaults
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}` : '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses and errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('hc_token');
      localStorage.removeItem('hc_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// === BRANDS ===
export const brandsAPI = {
  getAll: () => axiosInstance.get('/brands'),
  getById: (id) => axiosInstance.get(`/brands/${id}`),
  create: (data) => axiosInstance.post('/brands', data),
  update: (id, data) => axiosInstance.put(`/brands/${id}`, data),
  delete: (id) => axiosInstance.delete(`/brands/${id}`),
};

// === PRODUCTS ===
export const productsAPI = {
  getAll: () => axiosInstance.get('/products'),
  getById: (id) => axiosInstance.get(`/products/${id}`),
  create: (data) => axiosInstance.post('/products', data),
  update: (id, data) => axiosInstance.put(`/products/${id}`, data),
  delete: (id) => axiosInstance.delete(`/products/${id}`),
};

// === COST FACTORS ===
export const costFactorsAPI = {
  getAll: () => axiosInstance.get('/cost-factors'),
  getByProduct: (productId) => axiosInstance.get(`/cost-factors/product/${productId}`),
  getById: (id) => axiosInstance.get(`/cost-factors/${id}`),
  create: (data) => axiosInstance.post('/cost-factors', data),
  update: (id, data) => axiosInstance.put(`/cost-factors/${id}`, data),
  delete: (id) => axiosInstance.delete(`/cost-factors/${id}`),
};

// === AUTH ===
export const authAPI = {
  register: (data) => axiosInstance.post('/auth/register', data),
  login: (data) => axiosInstance.post('/auth/login', data),
  getProfile: () => axiosInstance.get('/auth/me'),
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount || 0);
};

// Calculate total cost of ownership
export const calculateTotalCost = (product, costFactors, years = 5) => {
  const base = parseFloat(product?.base_price || 0);
  let recurring = 0;
  costFactors?.forEach((cf) => {
    const amount = parseFloat(cf.cost_amount ?? cf.amount ?? 0);
    if (cf.frequency === 'monthly') recurring += amount * 12 * years;
    else if (cf.frequency === 'yearly') recurring += amount * years;
    else if (cf.frequency === 'one-time') recurring += amount;
  });
  return base + recurring;
};
