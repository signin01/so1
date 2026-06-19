import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboardStats } from '../../utils/api';
import { toast } from 'react-toastify';

// ============================================
// ASYNC THUNKS
// ============================================

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDashboardStats();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }
);

// ============================================
// SLICE
// ============================================

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: {
      totalMedicines: 0,
      lowStock: 0,
      expiringSoon: 0,
      totalValue: 0,
      categories: [],
      recentActivities: [],
    },
    loading: false,
    error: null,
    lastUpdated: null,
    refreshInterval: null,
  },
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
    setRefreshInterval: (state, action) => {
      if (state.refreshInterval) {
        clearInterval(state.refreshInterval);
      }
      state.refreshInterval = action.payload;
    },
    clearRefreshInterval: (state) => {
      if (state.refreshInterval) {
        clearInterval(state.refreshInterval);
        state.refreshInterval = null;
      }
    },
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
      state.lastUpdated = new Date().toISOString();
    },
    resetDashboard: (state) => {
      state.stats = {
        totalMedicines: 0,
        lowStock: 0,
        expiringSoon: 0,
        totalValue: 0,
        categories: [],
        recentActivities: [],
      };
      state.lastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = {
          totalMedicines: action.payload.totalMedicines || 0,
          lowStock: action.payload.lowStock || 0,
          expiringSoon: action.payload.expiringSoon || 0,
          totalValue: action.payload.totalValue || 0,
          categories: action.payload.categories || [],
          recentActivities: action.payload.recentActivities || [],
        };
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch dashboard stats';
      });
  },
});

// ============================================
// EXPORTS
// ============================================

export const {
  clearDashboardError,
  setRefreshInterval,
  clearRefreshInterval,
  updateStats,
  resetDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;