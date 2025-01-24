import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Pricing from './pages/Pricing';
import Features from './pages/Features';
import HowItWorks from './pages/HowItWorks';
import CreateClient from './pages/CreateClient';
import ClientDetails from './pages/ClientDetails';
import EditClient from './pages/EditClient';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn } = useAuth();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/features" element={<Features />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/dashboard/*">
        <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="clients/new" element={<ProtectedRoute><CreateClient /></ProtectedRoute>} />
        <Route path="clients/:clientId" element={<ProtectedRoute><ClientDetails /></ProtectedRoute>} />
        <Route path="clients/:clientId/edit" element={<ProtectedRoute><EditClient /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default App;