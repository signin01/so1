import React, { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import Spinner from './components/common/Spinner';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const Medicines = lazy(() => import('./pages/Medicines'));
const Alerts = lazy(() => import('./pages/Alerts'));
const Reports = lazy(() => import('./pages/Reports'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));

// Route wrapper with Suspense
const RouteWrapper = ({ children }) => (
  <Suspense fallback={<Spinner fullPage />}>
    {children}
  </Suspense>
);

export const routes = [
  {
    path: '/',
    element: <RouteWrapper><Dashboard /></RouteWrapper>,
    protected: true,
  },
  {
    path: '/medicines',
    element: <RouteWrapper><Medicines /></RouteWrapper>,
    protected: true,
  },
  {
    path: '/alerts',
    element: <RouteWrapper><Alerts /></RouteWrapper>,
    protected: true,
  },
  {
    path: '/reports',
    element: <RouteWrapper><Reports /></RouteWrapper>,
    protected: true,
  },
  {
    path: '/checkout',
    element: <RouteWrapper><Checkout /></RouteWrapper>,
    protected: true,
  },
  {
    path: '/login',
    element: <RouteWrapper><Login /></RouteWrapper>,
    protected: false,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
    protected: false,
  },
];

// Helper function to check if route is protected
export const isProtectedRoute = (path) => {
  const route = routes.find(r => r.path === path);
  return route ? route.protected : true;
};