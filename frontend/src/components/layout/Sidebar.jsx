import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  Chip,
  useTheme,
  IconButton,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Medication as MedicationIcon,
  Warning as WarningIcon,
  BarChart as BarChartIcon,
  ShoppingCart as ShoppingCartIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { toggleDarkMode } from '../../redux/slices/uiSlice';
import { logoutUser } from '../../redux/slices/authSlice';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/medicines', label: 'Medicines', icon: <MedicationIcon /> },
  { path: '/alerts', label: 'Alerts', icon: <WarningIcon /> },
  { path: '/reports', label: 'Reports', icon: <BarChartIcon /> },
  { path: '/checkout', label: 'Checkout', icon: <ShoppingCartIcon /> },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const handleToggleTheme = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: theme.palette.primary.main,
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
          }}
        >
          <MedicationIcon />
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight={700} color="primary">
            PharmaCare
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Hospital Pharmacy
          </Typography>
        </Box>
        <Chip
          label="v2.0"
          size="small"
          color="primary"
          variant="outlined"
          sx={{ ml: 'auto', fontSize: '0.6rem', height: 20 }}
        />
      </Box>

      <Divider />

      {/* User Info */}
      <Box sx={{ px: 3, py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 42,
              height: 42,
              bgcolor: theme.palette.secondary.main,
            }}
          >
            {user?.fullName?.[0] || 'A'}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {user?.fullName || 'Admin User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.role || 'Administrator'}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Navigation */}
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
          MAIN MENU
        </Typography>
      </Box>

      <List sx={{ px: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  backgroundColor: isActive
                    ? theme.palette.primary.main + '15'
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive
                      ? theme.palette.primary.main + '25'
                      : theme.palette.action.hover,
                  },
                }}
                component={motion.div}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                    minWidth: 40,
                  }}
                >
                  {item.path === '/alerts' ? (
                    <Badge badgeContent={3} color="error">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                    color: isActive
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                  }}
                />
                {isActive && (
                  <Box
                    sx={{
                      width: 4,
                      height: 24,
                      borderRadius: 2,
                      bgcolor: theme.palette.primary.main,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ mt: 'auto' }} />

      {/* Footer */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
            p: 1,
            borderRadius: 2,
            bgcolor: theme.palette.action.hover,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {darkMode ? '🌙 Dark' : '☀️ Light'}
          </Typography>
          <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton onClick={handleToggleTheme} size="small">
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Box>

        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              '&:hover': {
                bgcolor: theme.palette.error.main + '15',
              },
            }}
            component={motion.div}
            whileHover={{ x: 4 }}
          >
            <ListItemIcon sx={{ color: theme.palette.error.main, minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                color: theme.palette.error.main,
                fontWeight: 500,
              }}
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </Drawer>
  );
};

export default Sidebar;