import React from 'react';
import { Card, CardContent, Typography, Box, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

const StatsCard = ({ title, value, icon, color, change, changeType, subtitle }) => {
  return (
    <Card
      component={motion.div}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      sx={{
        borderRadius: 3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        border: `1px solid ${color}20`,
        bgcolor: `${color}08`,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          borderColor: color,
        },
        cursor: 'pointer',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: `${color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Box>

        {change && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1.5 }}>
            {changeType === 'up' ? (
              <ArrowUpward sx={{ color: '#10b981', fontSize: 14 }} />
            ) : (
              <ArrowDownward sx={{ color: '#ef4444', fontSize: 14 }} />
            )}
            <Typography
              variant="caption"
              sx={{
                color: changeType === 'up' ? '#10b981' : '#ef4444',
                fontWeight: 600,
              }}
            >
              {change}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              vs last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;