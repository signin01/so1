import React, { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import { getDashboardStats } from '../utils/api';

const Home = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return <Dashboard stats={stats} loading={loading} />;
};

export default Home;