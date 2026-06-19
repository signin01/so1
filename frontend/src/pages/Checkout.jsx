import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent,
  TextField,
  Grid,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Chip,
  useTheme,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { checkoutSchema } from '../utils/validators';
import PaymentModal from '../components/PaymentModal';
import { formatCurrency } from '../utils/formatters';

const Checkout = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Paracetamol 500mg', qty: 2, price: 3.57 },
    { id: 2, name: 'Ibuprofen 400mg', qty: 1, price: 1.32 },
  ]);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      prescription: false,
    },
  });

  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handlePaymentSuccess = (data) => {
    setOrderSuccess(true);
    setShowPayment(false);
    setActiveStep(2);
  };

  const onSubmit = (data) => {
    setActiveStep(1);
    setShowPayment(true);
  };

  const steps = ['Cart Review', 'Payment', 'Confirmation'];

  if (orderSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <CheckCircleIcon sx={{ fontSize: 72, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Order Confirmed!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Thank you for your purchase. Your order has been placed successfully.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" onClick={() => window.location.href = '/'}>
              Go to Dashboard
            </Button>
            <Button variant="outlined" onClick={() => window.print()}>
              Print Receipt
            </Button>
          </Box>
        </Paper>
      </motion.div>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={3}>
        {/* Cart Items */}
        <Grid item xs={12} md={7}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <ShoppingCartIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Cart Items
                  </Typography>
                  <Chip label={`${cartItems.length} items`} size="small" />
                </Box>

                {cartItems.length === 0 ? (
                  <Alert severity="info">Your cart is empty</Alert>
                ) : (
                  <List>
                    {cartItems.map((item, index) => (
                      <ListItem
                        key={item.id}
                        sx={{
                          borderBottom: index < cartItems.length - 1 ? '1px solid #e2e8f0' : 'none',
                          py: 2,
                        }}
                        secondaryAction={
                          <IconButton edge="end" color="error" onClick={() => removeItem(item.id)}>
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight={500}>
                            {item.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatCurrency(item.price)} × {item.qty}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton size="small" onClick={() => updateQuantity(item.id, -1)}>
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography variant="body2" fontWeight={600} sx={{ minWidth: 24, textAlign: 'center' }}>
                            {item.qty}
                          </Typography>
                          <IconButton size="small" onClick={() => updateQuantity(item.id, 1)}>
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                )}

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" fontWeight={500}>
                    Total
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="primary">
                    {formatCurrency(total)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Customer Details & Payment */}
        <Grid item xs={12} md={5}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                  Customer Details
                </Typography>

                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                  <Controller
                    name="customerName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Customer Name *"
                        fullWidth
                        size="small"
                        sx={{ mb: 2 }}
                        error={!!errors.customerName}
                        helperText={errors.customerName?.message}
                      />
                    )}
                  />

                  <Controller
                    name="customerPhone"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Phone Number *"
                        fullWidth
                        size="small"
                        sx={{ mb: 2 }}
                        error={!!errors.customerPhone}
                        helperText={errors.customerPhone?.message}
                      />
                    )}
                  />

                  <Controller
                    name="customerEmail"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Email (Optional)"
                        fullWidth
                        size="small"
                        sx={{ mb: 2 }}
                        error={!!errors.customerEmail}
                        helperText={errors.customerEmail?.message}
                      />
                    )}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={cartItems.length === 0}
                    sx={{ borderRadius: 2, py: 1.5, mt: 1 }}
                  >
                    Proceed to Pay {formatCurrency(total)}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={total}
        onSuccess={handlePaymentSuccess}
      />
    </Box>
  );
};

export default Checkout;