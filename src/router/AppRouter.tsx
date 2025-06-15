// src/router/AppRouter.tsx
import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import Auth from '../modules/auth/containers/Auth';
import Home from '../modules/home/containers/Home';

// Define routes using the new createBrowserRouter (React Router v6.4+)
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to='/home' replace />, // Redirect root to home
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '*',
    element: <Navigate to='/home' replace />, // Catch-all route redirects to home
  },
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
