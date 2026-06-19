import { createSlice } from '@reduxjs/toolkit';

// ============================================
// SLICE
// ============================================

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode: localStorage.getItem('darkMode') === 'true',
    sidebarOpen: true,
    notifications: [],
    loading: false,
    mobileView: window.innerWidth < 768,
    snackbar: {
      open: false,
      message: '',
      severity: 'info',
    },
    dialog: {
      open: false,
      title: '',
      content: '',
      onConfirm: null,
    },
  },
  reducers: {
    // Theme
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', String(state.darkMode));
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem('darkMode', String(action.payload));
      if (action.payload) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },

    // Sidebar
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },

    // Notifications
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
        read: false,
        timestamp: new Date().toISOString(),
      });
    },
    markNotificationRead: (state, action) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification) notification.read = true;
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach((n) => (n.read = true));
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },

    // Loading
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Mobile view
    setMobileView: (state, action) => {
      state.mobileView = action.payload;
    },

    // Snackbar
    showSnackbar: (state, action) => {
      state.snackbar.open = true;
      state.snackbar.message = action.payload.message;
      state.snackbar.severity = action.payload.severity || 'info';
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false;
    },

    // Dialog
    openDialog: (state, action) => {
      state.dialog.open = true;
      state.dialog.title = action.payload.title;
      state.dialog.content = action.payload.content;
      state.dialog.onConfirm = action.payload.onConfirm || null;
    },
    closeDialog: (state) => {
      state.dialog.open = false;
      state.dialog.onConfirm = null;
    },
  },
});

// ============================================
// EXPORTS
// ============================================

export const {
  toggleDarkMode,
  setDarkMode,
  toggleSidebar,
  setSidebarOpen,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  clearNotifications,
  removeNotification,
  setLoading,
  setMobileView,
  showSnackbar,
  hideSnackbar,
  openDialog,
  closeDialog,
} = uiSlice.actions;

export default uiSlice.reducer;