import axios from 'axios';

// ============================================
// API BASE URL - Change for local development
// ============================================
// For production (Render):
const API_BASE_URL = 'https://so1-orma.onrender.com/api';
// For local development (uncomment this and comment the above):
// const API_BASE_URL = 'http://localhost:5000/api';

// ============================================
// AXIOS INSTANCE
// ============================================

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// ============================================
// REQUEST INTERCEPTOR - Add auth token
// ============================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================
// RESPONSE INTERCEPTOR - Clean data & handle errors
// ============================================

api.interceptors.response.use(
  (response) => {
    // Clean string responses
    if (typeof response.data === 'string') {
      let cleaned = response.data.trim();
      if (cleaned.startsWith('@')) cleaned = cleaned.substring(1);
      if (cleaned.startsWith('{') || cleaned.startsWith('[')) {
        try {
          response.data = JSON.parse(cleaned);
        } catch (e) {
          // Keep as string if not JSON
        }
      }
    }
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTHENTICATION API
// ============================================

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// ============================================
// MEDICINES API
// ============================================

export const getMedicines = async (params = {}) => {
  const response = await api.get('/medicines', { params });
  return response.data;
};

export const getMedicine = async (id) => {
  const response = await api.get(`/medicines/${id}`);
  return response.data;
};

export const createMedicine = async (data) => {
  const response = await api.post('/medicines', data);
  return response.data;
};

export const updateMedicine = async (id, data) => {
  const response = await api.put(`/medicines/${id}`, data);
  return response.data;
};

export const deleteMedicine = async (id) => {
  const response = await api.delete(`/medicines/${id}`);
  return response.data;
};

export const getLowStock = async () => {
  const response = await api.get('/medicines/low-stock');
  return response.data;
};

export const getExpiring = async (days = 30) => {
  const response = await api.get('/medicines/expiring', { params: { days } });
  return response.data;
};

export const bulkUpdateStock = async (items) => {
  const response = await api.post('/medicines/bulk-stock', { items });
  return response.data;
};

// ============================================
// DASHBOARD API
// ============================================

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

// ============================================
// PAYMENT API
// ============================================

export const createPaymentOrder = async (amount, currency = 'INR') => {
  const response = await api.post('/payments/create-order', { amount, currency });
  return response.data;
};

export const verifyPayment = async (data) => {
  const response = await api.post('/payments/verify', data);
  return response.data;
};

// ============================================
// REPORTS API
// ============================================

export const generateReport = async (type, params = {}) => {
  const response = await api.get(`/reports/${type}`, { params });
  return response.data;
};

export default api;