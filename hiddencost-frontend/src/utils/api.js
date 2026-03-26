import axios from 'axios';

// ============================================================
// API Service — Centralized API calls (CLO4)
// ============================================================

// === BRANDS ===
export const brandsAPI = {
  getAll: () => axios.get('/brands'),
  getById: (id) => axios.get(`/brands/${id}`),
  create: (data) => axios.post('/brands', data),
  update: (id, data) => axios.put(`/brands/${id}`, data),
  delete: (id) => axios.delete(`/brands/${id}`),
};

// === PRODUCTS ===
export const productsAPI = {
  getAll: () => axios.get('/products'),
  getById: (id) => axios.get(`/products/${id}`),
  create: (data) => axios.post('/products', data),
  update: (id, data) => axios.put(`/products/${id}`, data),
  delete: (id) => axios.delete(`/products/${id}`),
};

// === COST FACTORS ===
export const costFactorsAPI = {
  getAll: () => axios.get('/cost-factors'),
  getByProduct: (productId) => axios.get(`/cost-factors/product/${productId}`),
  getById: (id) => axios.get(`/cost-factors/${id}`),
  create: (data) => axios.post('/cost-factors', data),
  update: (id, data) => axios.put(`/cost-factors/${id}`, data),
  delete: (id) => axios.delete(`/cost-factors/${id}`),
};

// === AUTH ===
export const authAPI = {
  getProfile: () => axios.get('/auth/me'),
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
    const amount = parseFloat(cf.amount || 0);
    if (cf.frequency === 'monthly') recurring += amount * 12 * years;
    else if (cf.frequency === 'yearly') recurring += amount * years;
    else if (cf.frequency === 'one-time') recurring += amount;
  });
  return base + recurring;
};
