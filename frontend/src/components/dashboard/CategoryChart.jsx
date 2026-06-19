import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress, Chip } from '@mui/material';
import { motion } from 'framer-motion';

const CategoryChart = ({ categories }) => {
  const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

  if (!categories || categories.length === 0) {
    return (
      <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Category Distribution
          </Typography>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No category data available
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const total = categories.reduce((sum, cat) => sum + cat.count, 0);
  const maxCount = categories[0]?.count || 1;

  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Category Distribution
          </Typography>
          <Chip label={`${total} items`} size="small" variant="outlined" />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {categories.map((cat, index) => {
            const percentage = Math.min((cat.count / maxCount) * 100, 100);
            const color = colors[index % colors.length];

            return (
              <motion.div
                key={cat.category || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                    {cat.category || 'Uncategorized'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cat.count} ({Math.round((cat.count / total) * 100)}%)
                  </Typography>
                </Box>
                <Box sx={{ position: 'relative' }}>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: '#f1f5f9',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: color,
                        borderRadius: 4,
                        transition: 'width 1s ease',
                      },
                    }}
                  />
                </Box>
              </motion.div>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CategoryChart;