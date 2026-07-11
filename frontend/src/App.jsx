import React, { useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@bmdinner/logreg';
import { Toaster } from 'react-hot-toast';
import HospitalLogin from './pages/login';
import PatientProfile from './pages/patient';
import Appointment from './components/appointment/Appointment';
import LoadingOverlay from './components/common/LoadingOverlay';
import './index.css';

function AppContent() {
  const { isAuthenticated, loading, user } = useAuth();

  useEffect(() => {
    if (user) {
      localStorage.setItem('userData', JSON.stringify(user));
    }
  }, [user]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800">
        <LoadingOverlay message="Loading..." show={true} />
      </div>
    );
  }

  return (
    <div className="App">
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/patient" /> : <HospitalLogin />}
        />
        <Route
          path="/patient"
          element={isAuthenticated ? <PatientProfile /> : <Navigate to="/login" />}
        />
        <Route
          path="/appointment"
          element={isAuthenticated ? <Appointment user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/patient" : "/login"} />}
        />
      </Routes>
    </div>
  );
}

function App() {
  const apiKey = import.meta.env.VITE_API_KEY || '';
  const projectId = import.meta.env.VITE_PROJECT_ID || '';

  return (
    <ThemeProvider>
      <AuthProvider
        authUrl="/api/auth"
        apiKey=""
        projectId=""
        loginEndpoint="/login"
        registerEndpoint="/register"
        logoutEndpoint="/logout"
        refreshEndpoint="/refresh"
        verifyEndpoint="/verify"
      >
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;