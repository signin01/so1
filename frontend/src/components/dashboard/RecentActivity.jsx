import React from 'react';
import { Card, CardContent, Typography, Box, List, ListItem, ListItemText, Divider, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { Inventory, Add, Warning, CheckCircle } from '@mui/icons-material';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'stock',
      title: 'Stock Updated',
      description: 'Paracetamol 500mg +50 units',
      time: '2 min ago',
      icon: <Inventory sx={{ color: '#2563eb' }} />,
      color: '#2563eb',
    },
    {
      id: 2,
      type: 'add',
      title: 'New Medicine Added',
      description: 'Azithromycin 500mg',
      time: '1 hour ago',
      icon: <Add sx={{ color: '#10b981' }} />,
      color: '#10b981',
    },
    {
      id: 3,
      type: 'alert',
      title: 'Low Stock Alert',
      description: '3 medicines below minimum stock',
      time: '3 hours ago',
      icon: <Warning sx={{ color: '#f59e0b' }} />,
      color: '#f59e0b',
    },
    {
      id: 4,
      type: 'success',
      title: 'Order Completed',
      description: 'Order #ORD-2024-001 delivered',
      time: '5 hours ago',
      icon: <CheckCircle sx={{ color: '#10b981' }} />,
      color: '#10b981',
    },
  ];

  const getTypeColor = (type) => {
    const colors = {
      stock: 'info',
      add: 'success',
      alert: 'warning',
      success: 'success',
    };
    return colors[type] || 'default';
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Recent Activity
        </Typography>

        <List sx={{ p: 0 }}>
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <ListItem sx={{ px: 0, py: 1.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: `${activity.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    flexShrink: 0,
                  }}
                >
                  {activity.icon}
                </Box>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {activity.title}
                      </Typography>
                      <Chip
                        label={activity.type}
                        size="small"
                        color={getTypeColor(activity.type)}
                        sx={{ height: 20, fontSize: '0.6rem' }}
                      />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {activity.description}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {activity.time}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < activities.length - 1 && <Divider />}
            </motion.div>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;