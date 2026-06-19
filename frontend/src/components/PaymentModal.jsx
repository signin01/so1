import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  CreditCard as CreditCardIcon,
  QrCode as QrCodeIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/formatters';

const PaymentModal = ({ isOpen, onClose, amount, medicineName, onSuccess }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [step, setStep] = useState(1);

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    setStep(2);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError('Failed to load payment gateway. Please try again.');
        setLoading(false);
        setStep(1);
        return;
      }

      // Create order on backend
      const response = await fetch('http://localhost:5000/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'INR',
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Failed to create order');
        setLoading(false);
        setStep(1);
        return;
      }

      // Razorpay options
      const options = {
        key: 'rzp_test_T3RXpEtcModxHk',
        amount: data.amount * 100,
        currency: data.currency || 'INR',
        name: 'PharmaCare',
        description: medicineName || 'Medicine Purchase',
        order_id: data.orderId,
        prefill: {
          name: 'Customer',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#2563eb',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            setStep(1);
          }
        },
        handler: async function(response) {
          // Verify payment
          try {
            const verifyRes = await fetch('http://localhost:5000/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              setStep(3);
              onSuccess && onSuccess({ 
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
              });
            } else {
              setError(verifyData.message || 'Payment verification failed');
              setStep(1);
            }
          } catch (err) {
            setError('Payment verification failed. Please try again.');
            setStep(1);
          }
          setLoading(false);
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment failed. Please try again.');
      setLoading(false);
      setStep(1);
    }
  };

  const handleClose = () => {
    if (step === 3) {
      setStep(1);
      setError(null);
      onClose();
    } else if (!loading) {
      setStep(1);
      setError(null);
      onClose();
    }
  };

  const renderPaymentStep = () => {
    if (step === 3) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', padding: '2rem 0' }}
        >
          <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Payment Successful!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your payment of {formatCurrency(amount)} has been completed.
          </Typography>
        </motion.div>
      );
    }

    return (
      <>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
            Select Payment Method
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {[
              { id: 'card', label: 'Credit/Debit Card', icon: <CreditCardIcon /> },
              { id: 'upi', label: 'UPI', icon: <QrCodeIcon /> },
              { id: 'netbanking', label: 'Net Banking', icon: <PaymentIcon /> },
            ].map((method) => (
              <Button
                key={method.id}
                variant={paymentMethod === method.id ? 'contained' : 'outlined'}
                onClick={() => setPaymentMethod(method.id)}
                startIcon={method.icon}
                sx={{
                  borderRadius: 2,
                  flex: 1,
                  minWidth: 100,
                  py: 1,
                  ...(paymentMethod === method.id && {
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': { bgcolor: theme.palette.primary.dark },
                  }),
                }}
              >
                {method.label}
              </Button>
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Alert severity="info" sx={{ mt: 2 }} icon={<PaymentIcon />}>
          <Typography variant="caption">
            <strong>Test Mode:</strong> Use 4111 1111 1111 1111 | Exp: Any future | CVV: 111
          </Typography>
        </Alert>
      </>
    );
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        },
      }}
      TransitionProps={{
        component: motion.div,
        initial: { opacity: 0, scale: 0.9, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9, y: 20 },
        transition: { duration: 0.3 },
      }}
    >
      <Box
        sx={{
          p: 3,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={600}>
            💳 Payment
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Complete your purchase securely
          </Typography>
        </Box>
        {step !== 3 && (
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Box
        sx={{
          p: 3,
          bgcolor: theme.palette.primary.main + '08',
          borderBottom: `1px solid ${theme.palette.divider}`,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Amount to Pay
        </Typography>
        <Typography variant="h4" fontWeight={700} color="primary">
          {formatCurrency(amount)}
        </Typography>
        {medicineName && (
          <Typography variant="caption" color="text.secondary">
            {medicineName}
          </Typography>
        )}
      </Box>

      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <IconButton color="inherit" size="small" onClick={() => setError(null)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {error}
          </Alert>
        )}

        {renderPaymentStep()}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        {step === 3 ? (
          <Button
            variant="contained"
            fullWidth
            onClick={handleClose}
            sx={{ borderRadius: 2, py: 1.5 }}
          >
            Done
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleClose}
              disabled={loading}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={handlePayment}
              disabled={loading}
              sx={{ borderRadius: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : `Pay ${formatCurrency(amount)}`}
            </Button>
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;