// ============================================
// API ENDPOINTS
// ============================================

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  MEDICINES: {
    BASE: '/medicines',
    LOW_STOCK: '/medicines/low-stock',
    EXPIRING: '/medicines/expiring',
    BULK_STOCK: '/medicines/bulk-stock',
    CATEGORIES: '/medicines/categories',
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    ACTIVITY: '/dashboard/activity',
  },
  PAYMENTS: {
    CREATE_ORDER: '/payments/create-order',
    VERIFY: '/payments/verify',
    HISTORY: '/payments/history',
  },
  REPORTS: {
    BASE: '/reports',
    INVENTORY: '/reports/inventory',
    SALES: '/reports/sales',
    EXPIRY: '/reports/expiry',
  },
  SUPPLIERS: {
    BASE: '/suppliers',
  },
  PRESCRIPTIONS: {
    BASE: '/prescriptions',
  },
};

// ============================================
// MEDICINE CATEGORIES
// ============================================

export const MEDICINE_CATEGORIES = [
  { id: 'pain-relief', label: 'Pain Relief', icon: '💊' },
  { id: 'antibiotics', label: 'Antibiotics', icon: '🧬' },
  { id: 'cardiac', label: 'Cardiac', icon: '❤️' },
  { id: 'diabetes', label: 'Diabetes', icon: '🩸' },
  { id: 'digestive', label: 'Digestive', icon: '🍽️' },
  { id: 'respiratory', label: 'Respiratory', icon: '🫁' },
  { id: 'anti-inflammatory', label: 'Anti-inflammatory', icon: '🔥' },
  { id: 'antidepressant', label: 'Antidepressant', icon: '🧠' },
  { id: 'antifungal', label: 'Antifungal', icon: '🍄' },
  { id: 'antiviral', label: 'Antiviral', icon: '🦠' },
  { id: 'vitamin', label: 'Vitamins & Supplements', icon: '💪' },
  { id: 'other', label: 'Other', icon: '📦' },
];

// ============================================
// MEDICINE FORMS
// ============================================

export const MEDICINE_FORMS = [
  { id: 'tablet', label: 'Tablet' },
  { id: 'capsule', label: 'Capsule' },
  { id: 'syrup', label: 'Syrup' },
  { id: 'injection', label: 'Injection' },
  { id: 'cream', label: 'Cream' },
  { id: 'ointment', label: 'Ointment' },
  { id: 'drops', label: 'Drops' },
  { id: 'inhaler', label: 'Inhaler' },
  { id: 'spray', label: 'Spray' },
  { id: 'suppository', label: 'Suppository' },
];

// ============================================
// STOCK STATUS
// ============================================

export const STOCK_STATUS = {
  CRITICAL: { label: 'Critical', color: 'error', threshold: 10 },
  LOW: { label: 'Low', color: 'warning', threshold: 50 },
  MEDIUM: { label: 'Medium', color: 'info', threshold: 100 },
  HIGH: { label: 'High', color: 'success', threshold: 1000 },
};

// ============================================
// PAGINATION
// ============================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [5, 10, 25, 50, 100],
};

// ============================================
// DATE FORMATS
// ============================================

export const DATE_FORMATS = {
  DISPLAY: 'dd MMM yyyy',
  DISPLAY_TIME: 'dd MMM yyyy hh:mm a',
  DISPLAY_SHORT: 'dd MMM',
  API: 'yyyy-MM-dd',
  API_TIME: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
  TIME: 'hh:mm a',
};

// ============================================
// TOAST MESSAGES
// ============================================

export const TOAST_MESSAGES = {
  SUCCESS: {
    ADD_MEDICINE: '✅ Medicine added successfully!',
    UPDATE_MEDICINE: '✅ Medicine updated successfully!',
    DELETE_MEDICINE: '✅ Medicine deleted successfully!',
    PAYMENT_SUCCESS: '✅ Payment completed successfully!',
    LOGIN_SUCCESS: '✅ Welcome back!',
    LOGOUT_SUCCESS: '✅ Logged out successfully!',
    REGISTER_SUCCESS: '✅ Registration successful! Please login.',
    COPY_SUCCESS: '✅ Copied to clipboard!',
    EXPORT_SUCCESS: '✅ Report exported successfully!',
  },
  ERROR: {
    ADD_MEDICINE: '❌ Failed to add medicine. Please try again.',
    UPDATE_MEDICINE: '❌ Failed to update medicine. Please try again.',
    DELETE_MEDICINE: '❌ Failed to delete medicine. Please try again.',
    PAYMENT_FAILED: '❌ Payment failed. Please try again.',
    LOGIN_FAILED: '❌ Invalid email or password.',
    LOGOUT_FAILED: '❌ Logout failed. Please try again.',
    REGISTER_FAILED: '❌ Registration failed. Please try again.',
    NETWORK_ERROR: '❌ Network error. Please check your connection.',
    SERVER_ERROR: '❌ Server error. Please try again later.',
    NOT_FOUND: '❌ Resource not found.',
    UNAUTHORIZED: '❌ Unauthorized. Please login again.',
  },
  INFO: {
    LOADING: '⏳ Loading...',
    SAVING: '💾 Saving...',
    PROCESSING: '🔄 Processing...',
    UPDATING: '🔄 Updating...',
    DELETING: '🗑️ Deleting...',
  },
};

// ============================================
// ROUTES
// ============================================

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/',
  MEDICINES: '/medicines',
  ALERTS: '/alerts',
  REPORTS: '/reports',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  PROFILE: '/profile',
  SETTINGS: '/settings',
};

// ============================================
// SIDEBAR MENU
// ============================================

export const SIDEBAR_MENU = [
  { path: '/', label: 'Dashboard', icon: 'Dashboard' },
  { path: '/medicines', label: 'Medicines', icon: 'Medication' },
  { path: '/alerts', label: 'Alerts', icon: 'Warning' },
  { path: '/reports', label: 'Reports', icon: 'BarChart' },
  { path: '/checkout', label: 'Checkout', icon: 'ShoppingCart' },
];

// ============================================
// CHART COLORS
// ============================================

export const CHART_COLORS = [
  '#2563eb', // Blue
  '#10b981', // Green
  '#f59e0b', // Yellow
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#14b8a6', // Teal
  '#6366f1', // Indigo
];

// ============================================
// PAYMENT METHODS
// ============================================

export const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit/Debit Card', icon: 'CreditCard' },
  { id: 'upi', label: 'UPI', icon: 'QrCode' },
  { id: 'netbanking', label: 'Net Banking', icon: 'AccountBalance' },
  { id: 'cash', label: 'Cash', icon: 'Money' },
];

// ============================================
// PAYMENT STATUS
// ============================================

export const PAYMENT_STATUS = {
  PENDING: { label: 'Pending', color: 'warning' },
  COMPLETED: { label: 'Completed', color: 'success' },
  FAILED: { label: 'Failed', color: 'error' },
  REFUNDED: { label: 'Refunded', color: 'info' },
  CANCELLED: { label: 'Cancelled', color: 'secondary' },
};

// ============================================
// USER ROLES
// ============================================

export const USER_ROLES = {
  ADMIN: 'admin',
  PHARMACIST: 'pharmacist',
  CASHIER: 'cashier',
  DOCTOR: 'doctor',
  STAFF: 'staff',
};

// ============================================
// FILE TYPES
// ============================================

export const FILE_TYPES = {
  PDF: 'application/pdf',
  EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  CSV: 'text/csv',
  JPEG: 'image/jpeg',
  PNG: 'image/png',
};

// ============================================
// STORAGE KEYS
// ============================================

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  DARK_MODE: 'darkMode',
  THEME: 'theme',
  LANGUAGE: 'language',
  CART: 'cart',
  NOTIFICATIONS: 'notifications',
};

export default {
  API_ENDPOINTS,
  MEDICINE_CATEGORIES,
  MEDICINE_FORMS,
  STOCK_STATUS,
  PAGINATION,
  DATE_FORMATS,
  TOAST_MESSAGES,
  ROUTES,
  SIDEBAR_MENU,
  CHART_COLORS,
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  USER_ROLES,
  FILE_TYPES,
  STORAGE_KEYS,
};