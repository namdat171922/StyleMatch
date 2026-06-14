import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import './index.css';

// Pages
import HomePage from './pages/HomePage';
import BusinessesPage from './pages/BusinessesPage';
import BusinessDetailPage from './pages/BusinessDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateBusinessPage from './pages/CreateBusinessPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/businesses" element={<BusinessesPage />} />
        <Route path="/businesses/:id" element={<BusinessDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-business"
          element={
            <ProtectedRoute>
              <CreateBusinessPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" richColors />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
