import * as yup from 'yup';

// ============================================
// MEDICINE VALIDATION SCHEMA
// ============================================

export const medicineSchema = yup.object({
  name: yup
    .string()
    .required('Medicine name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must be less than 255 characters')
    .trim(),
  
  generic_name: yup
    .string()
    .max(255, 'Generic name must be less than 255 characters')
    .nullable()
    .trim(),
  
  category: yup
    .string()
    .max(100, 'Category must be less than 100 characters')
    .nullable()
    .trim(),
  
  strength: yup
    .string()
    .max(100, 'Strength must be less than 100 characters')
    .nullable()
    .trim(),
  
  unit_price: yup
    .number()
    .typeError('Price must be a number')
    .min(0, 'Price must be greater than or equal to 0')
    .max(999999, 'Price is too high')
    .nullable(),
  
  stock_quantity: yup
    .number()
    .typeError('Stock must be a number')
    .integer('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .nullable(),
  
  minimum_stock: yup
    .number()
    .typeError('Minimum stock must be a number')
    .integer('Minimum stock must be a whole number')
    .min(0, 'Minimum stock cannot be negative')
    .nullable()
    .default(50),
  
  expiry_date: yup
    .date()
    .typeError('Invalid date format')
    .nullable()
    .min(new Date(), 'Expiry date must be in the future'),
  
  manufacturer: yup
    .string()
    .max(255, 'Manufacturer name must be less than 255 characters')
    .nullable()
    .trim(),
  
  batch_number: yup
    .string()
    .max(50, 'Batch number must be less than 50 characters')
    .nullable()
    .trim(),
});

// ============================================
// LOGIN VALIDATION SCHEMA
// ============================================

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .trim()
    .lowercase(),
  
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  
  rememberMe: yup
    .boolean()
    .default(false),
});

// ============================================
// REGISTER VALIDATION SCHEMA
// ============================================

export const registerSchema = yup.object({
  fullName: yup
    .string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .trim(),
  
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .trim()
    .lowercase(),
  
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase, one lowercase, and one number'
    ),
  
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
  
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number')
    .nullable(),
  
  role: yup
    .string()
    .oneOf(['admin', 'pharmacist', 'cashier', 'staff'], 'Invalid role')
    .default('staff'),
});

// ============================================
// CHECKOUT VALIDATION SCHEMA
// ============================================

export const checkoutSchema = yup.object({
  customerName: yup
    .string()
    .required('Customer name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .trim(),
  
  customerPhone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number')
    .trim(),
  
  customerEmail: yup
    .string()
    .email('Please enter a valid email address')
    .nullable()
    .trim()
    .lowercase(),
  
  prescription: yup
    .boolean()
    .default(false),
  
  prescriptionImage: yup
    .mixed()
    .nullable()
    .when('prescription', {
      is: true,
      then: (schema) => schema.required('Prescription image is required'),
      otherwise: (schema) => schema.nullable(),
    }),
});

// ============================================
// SUPPLIER VALIDATION SCHEMA (FIXED)
// ============================================

export const supplierSchema = yup.object({
  name: yup
    .string()
    .required('Supplier name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name is too long')
    .trim(),
  
  contactPerson: yup
    .string()
    .max(255, 'Contact person name is too long')
    .nullable()
    .trim(),
  
  email: yup
    .string()
    .email('Please enter a valid email address')
    .nullable()
    .trim()
    .lowercase(),
  
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number')
    .nullable(),
  
  address: yup
    .string()
    .max(500, 'Address is too long')
    .nullable()
    .trim(),
  
  // ✅ FIXED: Using transform instead of toUpperCase()
  gstNumber: yup
    .string()
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      'Please enter a valid GST number'
    )
    .nullable()
    .trim()
    .transform((value) => (value ? value.toUpperCase() : value)),
  
  rating: yup
    .number()
    .min(0, 'Rating must be between 0 and 5')
    .max(5, 'Rating must be between 0 and 5')
    .nullable(),
});

// ============================================
// PAYMENT VALIDATION SCHEMA
// ============================================

export const paymentSchema = yup.object({
  cardNumber: yup
    .string()
    .matches(/^[0-9\s]{16,19}$/, 'Please enter a valid card number')
    .nullable(),
  
  expiryDate: yup
    .string()
    .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Please enter a valid expiry date (MM/YY)')
    .nullable(),
  
  cvv: yup
    .string()
    .matches(/^[0-9]{3,4}$/, 'Please enter a valid CVV')
    .nullable(),
  
  cardholderName: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .nullable()
    .trim(),
});

// ============================================
// VALIDATION HELPERS
// ============================================

export const validateField = (schema, field, value) => {
  try {
    const fieldSchema = yup.reach(schema, field);
    fieldSchema.validateSync(value);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
};

export const validateForm = async (schema, data) => {
  try {
    await schema.validate(data, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.inner.forEach((err) => {
      if (err.path) {
        errors[err.path] = err.message;
      }
    });
    return { isValid: false, errors };
  }
};

export const getFieldError = (errors, field) => {
  return errors[field] || null;
};

// ============================================
// EXPORT
// ============================================

export default {
  medicineSchema,
  loginSchema,
  registerSchema,
  checkoutSchema,
  supplierSchema,
  paymentSchema,
  validateField,
  validateForm,
  getFieldError,
};