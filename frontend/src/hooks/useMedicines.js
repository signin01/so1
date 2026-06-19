import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  fetchMedicines,
  addMedicine,
  editMedicine,
  removeMedicine,
  setPage,
  setSearch,
  setCategory,
  setSort,
  setLimit,
  selectMedicine,
  clearError,
} from '../redux/slices/medicineSlice';
import { useToast } from './useToast';

export const useMedicines = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const {
    items,
    total,
    totalPages,
    currentPage,
    limit,
    search,
    category,
    sortBy,
    sortOrder,
    loading,
    error,
    selectedMedicine,
  } = useSelector((state) => state.medicines);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sortBy: 'name',
    sortOrder: 'ASC',
  });

  // Load medicines on filter/ page change
  useEffect(() => {
    dispatch(
      fetchMedicines({
        page: currentPage,
        limit,
        search,
        category,
        sortBy,
        sortOrder,
      })
    );
  }, [dispatch, currentPage, limit, search, category, sortBy, sortOrder]);

  const loadMedicines = (params = {}) => {
    dispatch(
      fetchMedicines({
        page: params.page || currentPage,
        limit: params.limit || limit,
        search: params.search || search,
        category: params.category || category,
        sortBy: params.sortBy || sortBy,
        sortOrder: params.sortOrder || sortOrder,
      })
    );
  };

  const handleAddMedicine = async (data) => {
    try {
      const result = await dispatch(addMedicine(data)).unwrap();
      showToast('Medicine added successfully!', 'success');
      loadMedicines();
      return { success: true, data: result };
    } catch (error) {
      showToast(error || 'Failed to add medicine', 'error');
      return { success: false, error };
    }
  };

  const handleEditMedicine = async (id, data) => {
    try {
      const result = await dispatch(editMedicine({ id, data })).unwrap();
      showToast('Medicine updated successfully!', 'success');
      loadMedicines();
      return { success: true, data: result };
    } catch (error) {
      showToast(error || 'Failed to update medicine', 'error');
      return { success: false, error };
    }
  };

  const handleDeleteMedicine = async (id) => {
    try {
      await dispatch(removeMedicine(id)).unwrap();
      showToast('Medicine deleted successfully!', 'success');
      loadMedicines();
      return { success: true };
    } catch (error) {
      showToast(error || 'Failed to delete medicine', 'error');
      return { success: false, error };
    }
  };

  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };

  const handleSearchChange = (searchTerm) => {
    dispatch(setSearch(searchTerm));
    setFilters((prev) => ({ ...prev, search: searchTerm }));
  };

  const handleCategoryChange = (categoryValue) => {
    dispatch(setCategory(categoryValue));
    setFilters((prev) => ({ ...prev, category: categoryValue }));
  };

  const handleSortChange = (sortByValue, sortOrderValue = 'ASC') => {
    dispatch(setSort({ sortBy: sortByValue, sortOrder: sortOrderValue }));
    setFilters((prev) => ({ ...prev, sortBy: sortByValue, sortOrder: sortOrderValue }));
  };

  const handleLimitChange = (newLimit) => {
    dispatch(setLimit(newLimit));
  };

  const handleSelectMedicine = (medicine) => {
    dispatch(selectMedicine(medicine));
  };

  const clearMedicineError = () => {
    dispatch(clearError());
  };

  const resetFilters = () => {
    setFilters({ search: '', category: '', sortBy: 'name', sortOrder: 'ASC' });
    dispatch(setSearch(''));
    dispatch(setCategory(''));
    dispatch(setSort({ sortBy: 'name', sortOrder: 'ASC' }));
  };

  return {
    // State
    medicines: items,
    total,
    totalPages,
    currentPage,
    limit,
    search,
    category,
    sortBy,
    sortOrder,
    loading,
    error,
    selectedMedicine,
    filters,

    // Actions
    loadMedicines,
    addMedicine: handleAddMedicine,
    editMedicine: handleEditMedicine,
    deleteMedicine: handleDeleteMedicine,
    onPageChange: handlePageChange,
    onSearchChange: handleSearchChange,
    onCategoryChange: handleCategoryChange,
    onSortChange: handleSortChange,
    onLimitChange: handleLimitChange,
    onSelectMedicine: handleSelectMedicine,
    clearError: clearMedicineError,
    resetFilters,
  };
};