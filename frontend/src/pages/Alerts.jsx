import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Paper,
  LinearProgress,
  Button,
  Alert,
  AlertTitle,
  useTheme,
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getLowStock, getExpiring } from '../utils/api';
import { formatDate } from '../utils/formatters';

const Alerts = () => {
  const theme = useTheme();
  const [lowStock, setLowStock] = useState([]);
  const [expiring, setExpiring] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const [lowResponse, expResponse] = await Promise.all([
        getLowStock(),
        getExpiring(30),
      ]);
      setLowStock(lowResponse.medicines || []);
      setExpiring(expResponse.medicines || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setError('Failed to load alerts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (stock, minStock) => {
    if (stock <= 10) return { label: 'Critical', color: 'error', severity: 'critical' };
    if (stock <= minStock) return { label: 'Low', color: 'warning', severity: 'low' };
    return { label: 'Ok', color: 'success', severity: 'ok' };
  };

  const getExpiryStatus = (date) => {
    const days = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    if (days <= 7) return { label: 'Critical', color: 'error' };
    if (days <= 15) return { label: 'Warning', color: 'warning' };
    if (days <= 30) return { label: 'Soon', color: 'info' };
    return { label: 'Ok', color: 'success' };
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2, textAlign: 'center' }}>Loading alerts...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
          <Button onClick={fetchAlerts} variant="outlined" size="small" sx={{ mt: 1 }}>
            Retry
          </Button>
        </Alert>
      </Box>
    );
  }

  const hasAlerts = lowStock.length > 0 || expiring.length > 0;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Alerts
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchAlerts}
          size="small"
        >
          Refresh
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card sx={{ borderRadius: 3, borderLeft: `4px solid ${theme.palette.warning.main}` }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Low Stock Items</Typography>
                <Typography variant="h4" fontWeight={700} color="warning.main">
                  {lowStock.length}
                </Typography>
                <Chip label="Need attention" size="small" color="warning" sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card sx={{ borderRadius: 3, borderLeft: `4px solid ${theme.palette.error.main}` }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Expiring Soon</Typography>
                <Typography variant="h4" fontWeight={700} color="error.main">
                  {expiring.length}
                </Typography>
                <Chip label="Within 30 days" size="small" color="error" sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card sx={{ borderRadius: 3, borderLeft: `4px solid ${theme.palette.info.main}` }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Total Medicines</Typography>
                <Typography variant="h4" fontWeight={700} color="info.main">
                  {lowStock.length + expiring.length}
                </Typography>
                <Chip label="With alerts" size="small" color="info" sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card sx={{ borderRadius: 3, borderLeft: `4px solid ${theme.palette.success.main}` }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <Typography variant="h4" fontWeight={700} color={hasAlerts ? 'warning.main' : 'success.main'}>
                  {hasAlerts ? '⚠️' : '✅'}
                </Typography>
                <Chip 
                  label={hasAlerts ? 'Attention Needed' : 'All Clear'} 
                  size="small" 
                  color={hasAlerts ? 'warning' : 'success'} 
                  sx={{ mt: 1 }} 
                />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* No Alerts */}
      {!hasAlerts && (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" fontWeight={600}>All Clear!</Typography>
          <Typography color="text.secondary">
            No low stock or expiring medicines to report.
          </Typography>
        </Paper>
      )}

      {/* Alert Lists */}
      {hasAlerts && (
        <Grid container spacing={3}>
          {/* Low Stock Alerts */}
          {lowStock.length > 0 && (
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                  <Box sx={{ p: 2, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <InventoryIcon />
                      <Typography variant="h6" fontWeight={600}>Low Stock Alerts</Typography>
                      <Chip label={`${lowStock.length} items`} size="small" color="warning" sx={{ ml: 'auto' }} />
                    </Box>
                  </Box>
                  <Divider />
                  <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                    {lowStock.map((item, index) => {
                      const status = getStockStatus(item.stock_quantity, item.minimum_stock || 50);
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              p: 2,
                              borderBottom: '1px solid #e2e8f0',
                              '&:hover': { bgcolor: 'action.hover' },
                            }}
                          >
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {item.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Min: {item.minimum_stock || 50} | Current: {item.stock_quantity}
                              </Typography>
                            </Box>
                            <Chip
                              label={`${item.stock_quantity} left`}
                              size="small"
                              color={status.color}
                              sx={{ borderRadius: 1 }}
                            />
                          </Box>
                        </motion.div>
                      );
                    })}
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          )}

          {/* Expiry Alerts */}
          {expiring.length > 0 && (
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                  <Box sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ScheduleIcon />
                      <Typography variant="h6" fontWeight={600}>Expiry Alerts</Typography>
                      <Chip label={`${expiring.length} items`} size="small" color="error" sx={{ ml: 'auto' }} />
                    </Box>
                  </Box>
                  <Divider />
                  <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                    {expiring.map((item, index) => {
                      const status = getExpiryStatus(item.expiry_date);
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              p: 2,
                              borderBottom: '1px solid #e2e8f0',
                              '&:hover': { bgcolor: 'action.hover' },
                            }}
                          >
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {item.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Expires: {formatDate(item.expiry_date)}
                              </Typography>
                            </Box>
                            <Chip
                              label={status.label}
                              size="small"
                              color={status.color}
                              sx={{ borderRadius: 1 }}
                            />
                          </Box>
                        </motion.div>
                      );
                    })}
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default Alerts;