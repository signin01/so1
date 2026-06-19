import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { fetchDashboardStats } from '../../redux/slices/dashboardSlice';
import StatsCard from './StatsCard';
import CategoryChart from './CategoryChart';
import RecentActivity from './RecentActivity';
import { formatCurrency } from '../../utils/formatters';

const Dashboard = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { stats, loading, error, lastUpdated } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchDashboardStats());
  };

  if (loading && !stats.totalMedicines) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, bgcolor: '#fef2f2', borderRadius: 3 }}>
          <Typography color="error">Error loading dashboard: {error}</Typography>
          <Button variant="contained" onClick={handleRefresh} sx={{ mt: 2 }}>
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  const statData = [
    {
      title: 'Total Medicines',
      value: stats.totalMedicines?.toLocaleString() || 0,
      icon: '💊',
      color: '#2563eb',
      change: '+12%',
      changeType: 'up',
      subtitle: 'Active medicines in inventory',
    },
    {
      title: 'Low Stock',
      value: stats.lowStock?.toLocaleString() || 0,
      icon: '⚠️',
      color: '#f59e0b',
      change: '-3%',
      changeType: 'down',
      subtitle: 'Need to reorder',
    },
    {
      title: 'Expiring Soon',
      value: stats.expiringSoon?.toLocaleString() || 0,
      icon: '📅',
      color: '#ef4444',
      change: '+5%',
      changeType: 'up',
      subtitle: 'Within 30 days',
    },
    {
      title: 'Total Value',
      value: formatCurrency(stats.totalValue || 0),
      icon: '💰',
      color: '#10b981',
      change: '+8%',
      changeType: 'up',
      subtitle: 'Inventory valuation',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back! Here's your pharmacy overview
            {lastUpdated && (
              <span style={{ marginLeft: 8 }}>
                • Last updated: {new Date(lastUpdated).toLocaleTimeString()}
              </span>
            )}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
          sx={{ borderRadius: 2 }}
        >
          Refresh
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <StatsCard {...stat} />
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <CategoryChart categories={stats.categories || []} />
          </motion.div>
        </Grid>
        <Grid item xs={12} md={5}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <RecentActivity />
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;