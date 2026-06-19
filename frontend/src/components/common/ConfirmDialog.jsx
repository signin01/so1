import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const ConfirmDialog = ({
  open,
  title = 'Confirm',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  severity = 'warning',
  loading = false,
}) => {
  const colors = {
    warning: { bg: '#fef3c7', text: '#92400e', icon: '#f59e0b' },
    error: { bg: '#fee2e2', text: '#991b1b', icon: '#ef4444' },
    info: { bg: '#dbeafe', text: '#1e40af', icon: '#3b82f6' },
    success: { bg: '#dcfce7', text: '#166534', icon: '#22c55e' },
  };

  const color = colors[severity] || colors.warning;

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, scale: 0.9, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9, y: 20 },
        sx: { borderRadius: 3, overflow: 'hidden' },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: color.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <WarningIcon sx={{ color: color.icon }} />
          </Box>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Box>

        <DialogContent sx={{ px: 0 }}>
          <DialogContentText color="text.secondary" sx={{ fontSize: '1rem' }}>
            {message}
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 0, pt: 2, gap: 1 }}>
          <Button onClick={onCancel} disabled={loading} variant="outlined" sx={{ borderRadius: 2 }}>
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            variant="contained"
            color={severity === 'error' ? 'error' : 'primary'}
            sx={{ borderRadius: 2, minWidth: 100 }}
          >
            {loading ? 'Processing...' : confirmText}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ConfirmDialog;