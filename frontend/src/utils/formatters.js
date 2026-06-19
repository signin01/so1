import { format, formatDistanceToNow, parseISO, differenceInDays } from 'date-fns';
import { DATE_FORMATS } from './constants';

// ============================================
// CURRENCY FORMATTER
// ============================================

export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === null || amount === undefined) return '₹0.00';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '₹0.00';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    currencyDisplay: 'symbol',
  }).format(num);
};

export const formatCurrencyCompact = (amount) => {
  if (amount === null || amount === undefined) return '₹0';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '₹0';
  
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(1)}Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(1)}L`;
  }
  if (num >= 1000) {
    return `₹${(num / 1000).toFixed(1)}K`;
  }
  return `₹${num.toFixed(2)}`;
};

// ============================================
// DATE FORMATTERS
// ============================================

export const formatDate = (date, formatStr = DATE_FORMATS.DISPLAY) => {
  if (!date) return 'N/A';
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, formatStr);
  } catch (e) {
    return 'Invalid Date';
  }
};

export const formatDateTime = (date) => {
  return formatDate(date, DATE_FORMATS.DISPLAY_TIME);
};

export const formatShortDate = (date) => {
  return formatDate(date, DATE_FORMATS.DISPLAY_SHORT);
};

export const formatTimeAgo = (date) => {
  if (!date) return 'N/A';
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  } catch (e) {
    return 'Invalid Date';
  }
};

export const formatDaysUntil = (date) => {
  if (!date) return 'N/A';
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    const days = differenceInDays(parsedDate, new Date());
    if (days < 0) return `Expired ${Math.abs(days)} days ago`;
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `${days} days`;
  } catch (e) {
    return 'Invalid Date';
  }
};

export const formatTime = (date) => {
  return formatDate(date, DATE_FORMATS.TIME);
};

// ============================================
// NUMBER FORMATTERS
// ============================================

export const formatNumber = (num, digits = 0) => {
  if (num === null || num === undefined) return '0';
  const number = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(number)) return '0';
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(number);
};

export const formatCompactNumber = (num) => {
  if (num === null || num === undefined) return '0';
  const number = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(number)) return '0';
  
  if (number >= 1000000000) {
    return `${(number / 1000000000).toFixed(1)}B`;
  }
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }
  return number.toString();
};

export const formatPercentage = (value, digits = 1) => {
  if (value === null || value === undefined) return '0%';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0%';
  return `${num.toFixed(digits)}%`;
};

// ============================================
// STRING FORMATTERS
// ============================================

export const truncateText = (text, maxLength = 50, suffix = '...') => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + suffix;
};

export const capitalizeWords = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const titleCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const slugify = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// ============================================
// PHONE FORMATTERS
// ============================================

export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{5})(\d{5})/, '$1 $2');
  }
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return cleaned.replace(/(\d{1})(\d{5})(\d{5})/, '+$1 $2 $3');
  }
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{5})/, '+$1 $2 $3');
  }
  return phone;
};

// ============================================
// ADDRESS FORMATTERS
// ============================================

export const formatAddress = (address) => {
  if (!address) return '';
  const parts = [];
  if (address.line1) parts.push(address.line1);
  if (address.line2) parts.push(address.line2);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.pincode) parts.push(address.pincode);
  if (address.country) parts.push(address.country);
  return parts.join(', ');
};

// ============================================
// FILE SIZE FORMATTERS
// ============================================

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// ============================================
// EXPORT
// ============================================

export default {
  formatCurrency,
  formatCurrencyCompact,
  formatDate,
  formatDateTime,
  formatShortDate,
  formatTimeAgo,
  formatDaysUntil,
  formatTime,
  formatNumber,
  formatCompactNumber,
  formatPercentage,
  truncateText,
  capitalizeWords,
  titleCase,
  slugify,
  formatPhone,
  formatAddress,
  formatFileSize,
};