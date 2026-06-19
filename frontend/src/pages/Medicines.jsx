import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Button,
  LinearProgress,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { DataGrid } from '@mui/x-data-grid';
import { fetchMedicines, setPage, setSearch, setCategory, removeMedicine } from '../redux/slices/medicineSlice';
import MedicineForm from '../components/medicines/MedicineForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { MEDICINE_CATEGORIES } from '../utils/constants';

const Medicines = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {
    items,
    total,
    totalPages,
    currentPage,
    limit,
    search,
    category,
    loading,
  } = useSelector((state) => state.medicines);

  const [searchInput, setSearchInput] = useState(search);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [openForm, setOpenForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [viewDialog, setViewDialog] = useState({ open: false, medicine: null });

  useEffect(() => {
    dispatch(fetchMedicines({
      page: currentPage,
      limit,
      search,
      category,
    }));
  }, [dispatch, currentPage, limit, search, category]);

  const handleSearch = () => {
    dispatch(setSearch(searchInput));
    dispatch(setPage(1));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    dispatch(setCategory(value));
    dispatch(setPage(1));
  };

  const handleRefresh = () => {
    dispatch(fetchMedicines({
      page: currentPage,
      limit,
      search,
      category,
    }));
  };

  const handlePageChange = (event, newPage) => {
    dispatch(setPage(newPage + 1));
  };

  const handleLimitChange = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    dispatch({ type: 'medicines/setLimit', payload: newLimit });
    dispatch(setPage(1));
  };

  const handleDelete = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const confirmDelete = () => {
    dispatch(removeMedicine(deleteDialog.id));
    setDeleteDialog({ open: false, id: null });
  };

  const handleEdit = (row) => {
    setEditingMedicine(row);
    setOpenForm(true);
  };

  const handleView = (row) => {
    setViewDialog({ open: true, medicine: row });
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1.5,
      minWidth: 180,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>{params.value}</Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.generic_name || 'N/A'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={params.value || 'N/A'}
          size="small"
          sx={{ borderRadius: 1 }}
        />
      ),
    },
    {
      field: 'unit_price',
      headerName: 'Price',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => (
        <Typography fontWeight={500}>
          ₹{params.value ? parseFloat(params.value).toFixed(2) : '0.00'}
        </Typography>
      ),
    },
    {
      field: 'stock_quantity',
      headerName: 'Stock',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => {
        const stock = params.value || 0;
        const color = stock <= 50 ? 'error' : stock <= 100 ? 'warning' : 'success';
        return <Chip label={stock} size="small" color={color} />;
      },
    },
    {
      field: 'expiry_date',
      headerName: 'Expiry',
      flex: 0.8,
      minWidth: 110,
      renderCell: (params) => {
        if (!params.value) return 'N/A';
        const date = new Date(params.value);
        return date.toLocaleDateString();
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.6,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" color="info" onClick={() => handleView(params.row)}>
            👁️
          </IconButton>
          <IconButton size="small" color="warning" onClick={() => handleEdit(params.row)}>
            ✏️
          </IconButton>
          <IconButton size="small" color="error" onClick={() => handleDelete(params.row.id)}>
            🗑️
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Medicines
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { setEditingMedicine(null); setOpenForm(true); }}
          sx={{ borderRadius: 2 }}
        >
          Add Medicine
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5} md={4}>
            <TextField
              placeholder="Search medicines..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleSearch}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <FormControl size="small" fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {MEDICINE_CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
              fullWidth
            >
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Data Grid */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {loading && <LinearProgress />}
        <Box sx={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={items}
            columns={columns}
            rowCount={total}
            paginationMode="server"
            pageSizeOptions={[5, 10, 25, 50]}
            onPaginationModelChange={(model) => {
              dispatch(setPage(model.page + 1));
              if (model.pageSize !== limit) {
                dispatch({ type: 'medicines/setLimit', payload: model.pageSize });
              }
            }}
            paginationModel={{
              page: currentPage - 1,
              pageSize: limit,
            }}
            loading={loading}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
            sx={{
              '& .MuiDataGrid-cell': { py: 1 },
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: theme.palette.background.default,
              },
            }}
          />
        </Box>
      </Paper>

      {/* Add/Edit Form Dialog */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
        </DialogTitle>
        <DialogContent>
          <MedicineForm
            initialData={editingMedicine}
            onSuccess={() => {
              setOpenForm(false);
              setEditingMedicine(null);
              handleRefresh();
            }}
            onCancel={() => {
              setOpenForm(false);
              setEditingMedicine(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog
        open={viewDialog.open}
        onClose={() => setViewDialog({ open: false, medicine: null })}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>Medicine Details</DialogTitle>
        <DialogContent>
          {viewDialog.medicine && (
            <Box sx={{ py: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                  <Typography variant="body1" fontWeight={500}>{viewDialog.medicine.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Generic Name</Typography>
                  <Typography variant="body1">{viewDialog.medicine.generic_name || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                  <Typography variant="body1">{viewDialog.medicine.category || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Price</Typography>
                  <Typography variant="body1" fontWeight={500}>
                    ₹{viewDialog.medicine.unit_price ? parseFloat(viewDialog.medicine.unit_price).toFixed(2) : '0.00'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Stock</Typography>
                  <Typography variant="body1">{viewDialog.medicine.stock_quantity || 0}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Minimum Stock</Typography>
                  <Typography variant="body1">{viewDialog.medicine.minimum_stock || 50}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Expiry Date</Typography>
                  <Typography variant="body1">
                    {viewDialog.medicine.expiry_date ? new Date(viewDialog.medicine.expiry_date).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog({ open: false, medicine: null })}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Medicine"
        message="Are you sure you want to delete this medicine? This action cannot be undone."
        confirmText="Delete"
        severity="error"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ open: false, id: null })}
      />
    </Box>
  );
};

export default Medicines;