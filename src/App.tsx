import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {
  Layout,
  Dashboard,
  TranscriptionPage,
  ReviewQueue,
  UploadZip,
  Export,
  UserManagement,
  SystemAnalytics,
  Guidelines,
  Login,
  ProtectedRoute
} from './components';
import { AppProvider, AuthProvider, useAuth } from './contexts';
import './App.css';

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={() => window.location.reload()} />;
  }

  // Role-based default route
  const getDefaultRoute = () => {
    switch (user.role) {
      case 'worker':
        return '/dashboard';
      case 'admin':
        return '/review';
      case 'super-admin':
        return '/analytics';
      default:
        return '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Worker Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['worker', 'admin', 'super-admin']}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/transcription/:segmentId" 
                element={
                  <ProtectedRoute allowedRoles={['worker']}>
                    <TranscriptionPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/review" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'super-admin']}>
                    <ReviewQueue />
                  </ProtectedRoute>
                } 
              />
              <Route 
                 path="/upload" 
                 element={
                   <ProtectedRoute allowedRoles={['admin', 'super-admin']}>
                     <UploadZip />
                   </ProtectedRoute>
                 } 
               />
               <Route 
                 path="/export" 
                 element={
                   <ProtectedRoute allowedRoles={['admin', 'super-admin']}>
                     <Export />
                   </ProtectedRoute>
                 } 
               />
              
              {/* Super Admin Routes */}
              <Route 
                path="/users" 
                element={
                  <ProtectedRoute allowedRoles={['super-admin']}>
                    <UserManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/analytics" 
                element={
                  <ProtectedRoute allowedRoles={['super-admin']}>
                    <SystemAnalytics />
                  </ProtectedRoute>
                } 
              />
              
              {/* Shared Routes */}
              <Route 
                path="/guidelines" 
                element={
                  <ProtectedRoute allowedRoles={['worker', 'admin', 'super-admin']}>
                    <Guidelines />
                  </ProtectedRoute>
                } 
              />
              
              {/* Default redirect based on user role */}
              <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
            </Routes>
          </Layout>
        </Router>
      </AppProvider>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;