import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Brands from './pages/Brands';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';
import ProductDetail from './pages/ProductDetail';
import Compare from './pages/Compare';
import NotFound from './pages/NotFound';

// ============================================================
// App.js — Root component with routing (CLO3, CLO4)
// ============================================================

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes — Require Authentication */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/brands"
              element={<ProtectedRoute><Brands /></ProtectedRoute>}
            />
            <Route
              path="/brands/new"
              element={<ProtectedRoute><Brands /></ProtectedRoute>}
            />
            <Route
              path="/products"
              element={<ProtectedRoute><Products /></ProtectedRoute>}
            />
            <Route
              path="/products/new"
              element={<ProtectedRoute><ProductForm /></ProtectedRoute>}
            />
            <Route
              path="/products/:id"
              element={<ProtectedRoute><ProductDetail /></ProtectedRoute>}
            />
            <Route
              path="/products/:id/edit"
              element={<ProtectedRoute><ProductForm /></ProtectedRoute>}
            />
            <Route
              path="/compare"
              element={<ProtectedRoute><Compare /></ProtectedRoute>}
            />

            {/* Fallback */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
