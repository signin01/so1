import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, logoutUser, fetchCurrentUser, clearError } from '../redux/slices/authSlice';
import { useToast } from './useToast';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user, token, isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  const login = async (email, password) => {
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      showToast('Welcome back!', 'success');
      navigate('/');
      return { success: true, data: result };
    } catch (error) {
      showToast(error || 'Login failed. Please try again.', 'error');
      return { success: false, error };
    }
  };

  const logout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      showToast('Logged out successfully', 'info');
      navigate('/login');
      return { success: true };
    } catch (error) {
      showToast('Logout failed', 'error');
      return { success: false, error };
    }
  };

  const fetchUser = async () => {
    try {
      const result = await dispatch(fetchCurrentUser()).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    fetchUser,
    clearAuthError,
  };
};