import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMedicines, deleteMedicine, createMedicine, updateMedicine } from '../../utils/api';
import { toast } from 'react-toastify';

// ============================================
// ASYNC THUNKS
// ============================================

// Fetch medicines with pagination and filters
export const fetchMedicines = createAsyncThunk(
  'medicines/fetch',
  async ({ page = 1, limit = 10, search = '', category = '', sortBy = 'name', sortOrder = 'ASC' }, { rejectWithValue }) => {
    try {
      const response = await getMedicines({ page, limit, search, category, sortBy, sortOrder });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch medicines');
    }
  }
);

// Add new medicine
export const addMedicine = createAsyncThunk(
  'medicines/add',
  async (data, { rejectWithValue }) => {
    try {
      const response = await createMedicine(data);
      toast.success('Medicine added successfully!');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add medicine');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Edit existing medicine
export const editMedicine = createAsyncThunk(
  'medicines/edit',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateMedicine(id, data);
      toast.success('Medicine updated successfully!');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update medicine');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Delete medicine
export const removeMedicine = createAsyncThunk(
  'medicines/remove',
  async (id, { rejectWithValue }) => {
    try {
      await deleteMedicine(id);
      toast.success('Medicine deleted successfully!');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete medicine');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// ============================================
// SLICE
// ============================================

const medicineSlice = createSlice({
  name: 'medicines',
  initialState: {
    items: [],
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
    search: '',
    category: '',
    sortBy: 'name',
    sortOrder: 'ASC',
    loading: false,
    error: null,
    selectedMedicine: null,
  },
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
      state.currentPage = 1;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
      state.currentPage = 1;
    },
    setSort: (state, action) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
      state.currentPage = 1;
    },
    selectMedicine: (state, action) => {
      state.selectedMedicine = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetFilters: (state) => {
      state.search = '';
      state.category = '';
      state.sortBy = 'name';
      state.sortOrder = 'ASC';
      state.currentPage = 1;
    },
    clearMedicines: (state) => {
      state.items = [];
      state.total = 0;
      state.totalPages = 0;
      state.selectedMedicine = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== FETCH =====
      .addCase(fetchMedicines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicines.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.medicines || [];
        state.total = action.payload.total || 0;
        state.totalPages = action.payload.totalPages || 0;
      })
      .addCase(fetchMedicines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch medicines';
      })

      // ===== ADD =====
      .addCase(addMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMedicine.fulfilled, (state) => {
        state.loading = false;
        // Don't add to items - will refetch on page change
      })
      .addCase(addMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add medicine';
      })

      // ===== EDIT =====
      .addCase(editMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editMedicine.fulfilled, (state) => {
        state.loading = false;
        // Don't update in items - will refetch on page change
      })
      .addCase(editMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update medicine';
      })

      // ===== REMOVE =====
      .addCase(removeMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.total = state.total - 1;
      })
      .addCase(removeMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete medicine';
      });
  },
});

// ============================================
// EXPORTS
// ============================================

export const {
  setPage,
  setSearch,
  setCategory,
  setSort,
  setLimit,
  selectMedicine,
  clearError,
  resetFilters,
  clearMedicines,
} = medicineSlice.actions;

export default medicineSlice.reducer;