import React from 'react';
import { Skeleton, Box, Card, CardContent, Grid } from '@mui/material';

const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  if (type === 'card') {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: count }).map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="80%" height={40} sx={{ mt: 1 }} />
                <Skeleton variant="text" width="40%" height={16} sx={{ mt: 2 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (type === 'table') {
    return (
      <Box sx={{ width: '100%' }}>
        {Array.from({ length: count }).map((_, index) => (
          <Box
            key={index}
            sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid #e2e8f0' }}
          >
            <Skeleton variant="text" width="25%" sx={{ mr: 2 }} />
            <Skeleton variant="text" width="15%" sx={{ mr: 2 }} />
            <Skeleton variant="text" width="15%" sx={{ mr: 2 }} />
            <Skeleton variant="text" width="15%" sx={{ mr: 2 }} />
            <Skeleton variant="text" width="20%" />
          </Box>
        ))}
      </Box>
    );
  }

  if (type === 'detail') {
    return (
      <Box>
        <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="40%" height={24} />
          <Skeleton variant="text" width="100%" height={80} />
        </Box>
      </Box>
    );
  }

  return null;
};

export default LoadingSkeleton;