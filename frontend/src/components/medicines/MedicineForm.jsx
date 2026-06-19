import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { addMedicine, editMedicine } from '../../redux/slices/medicineSlice';
import { medicineSchema } from '../../utils/validators';
import { MEDICINE_CATEGORIES, MEDICINE_FORMS } from '../../utils/constants';

const MedicineForm = ({ initialData = null, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(medicineSchema),
    defaultValues: {
      name: '',
      generic_name: '',
      category: '',
      strength: '',
      unit_price: '',
      stock_quantity: '',
      minimum_stock: '50',
      expiry_date: '',
      manufacturer: '',
      batch_number: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        generic_name: initialData.generic_name || '',
        category: initialData.category || '',
        strength: initialData.strength || '',
        unit_price: initialData.unit_price || '',
        stock_quantity: initialData.stock_quantity || '',
        minimum_stock: initialData.minimum_stock || '50',
        expiry_date: initialData.expiry_date ? initialData.expiry_date.split('T')[0] : '',
        manufacturer: initialData.manufacturer || '',
        batch_number: initialData.batch_number || '',
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (initialData) {
        await dispatch(editMedicine({ id: initialData.id, data })).unwrap();
      } else {
        await dispatch(addMedicine(data)).unwrap();
      }
      onSuccess();
    } catch (error) {
      console.error('Form error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ pt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Medicine Name *"
                fullWidth
                size="small"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="generic_name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Generic Name"
                fullWidth
                size="small"
                error={!!errors.generic_name}
                helperText={errors.generic_name?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select {...field} label="Category">
                  <MenuItem value="">None</MenuItem>
                  {MEDICINE_CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="strength"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Strength"
                fullWidth
                size="small"
                placeholder="e.g., 500mg"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Controller
            name="unit_price"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Unit Price (₹)"
                fullWidth
                size="small"
                type="number"
                error={!!errors.unit_price}
                helperText={errors.unit_price?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Controller
            name="stock_quantity"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Stock Quantity"
                fullWidth
                size="small"
                type="number"
                error={!!errors.stock_quantity}
                helperText={errors.stock_quantity?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Controller
            name="minimum_stock"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Minimum Stock"
                fullWidth
                size="small"
                type="number"
                error={!!errors.minimum_stock}
                helperText={errors.minimum_stock?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="expiry_date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Expiry Date"
                fullWidth
                size="small"
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!errors.expiry_date}
                helperText={errors.expiry_date?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="manufacturer"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Manufacturer"
                fullWidth
                size="small"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="batch_number"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Batch Number"
                fullWidth
                size="small"
              />
            )}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ flex: 1, borderRadius: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : (initialData ? 'Update' : 'Add')}
        </Button>
        <Button
          variant="outlined"
          onClick={onCancel}
          sx={{ flex: 1, borderRadius: 2 }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default MedicineForm;