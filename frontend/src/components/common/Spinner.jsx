import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const Spinner = ({ size = 40, text = 'Loading...', fullPage = false }) => {
  if (fullPage) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100%',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <CircularProgress size={size} />
        </motion.div>
        {text && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {text}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <CircularProgress size={size} />
      </motion.div>
      {text && (
        <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default Spinner;