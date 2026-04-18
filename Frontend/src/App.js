import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import AdminCategories from './pages/admin/AdminCategories';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductDetail from './pages/admin/AdminProductDetail';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminPayments from './pages/admin/AdminPayments';
import AdminReviews from './pages/admin/AdminReviews';
import AdminAddresses from './pages/admin/AdminAddresses';
import './styles/global.css';

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      } catch {
        localStorage.clear();
      }
    }
  }, []);

  const updateCartCount = useCallback((count) => {
    setCartCount(count);
  }, []);

  const handleLogin = (userData, tokens) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    // Best-effort logout on server
    if (refreshToken) {
      try {
        const { authAPI } = require('./services/api');
        authAPI.logout(refreshToken).catch(() => {});
      } catch {}
    }
    setIsLoggedIn(false);
    setUser(null);
    setCartCount(0);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <AppContent
        cartCount={cartCount}
        isLoggedIn={isLoggedIn}
        user={user}
        setUser={setUser}
        handleLogout={handleLogout}
        updateCartCount={updateCartCount}
        handleLogin={handleLogin}
      />
    </Router>
  );
}

function AppContent({ cartCount, isLoggedIn, user, setUser, handleLogout, updateCartCount, handleLogin }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className={isAdmin ? '' : 'd-flex flex-column min-vh-100'}>
      {!isAdmin && (
        <Navigation 
          cartItemCount={cartCount} 
          isLoggedIn={isLoggedIn}
          user={user}
          onLogout={handleLogout}
        />
      )}
      
      <main className={isAdmin ? '' : 'flex-grow-1'}>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route 
              path="/products/:id" 
              element={<ProductDetailPage isLoggedIn={isLoggedIn} updateCartCount={updateCartCount} />} 
            />
            <Route 
              path="/cart" 
              element={
                isLoggedIn 
                  ? <CartPage updateCartCount={updateCartCount} /> 
                  : <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/checkout" 
              element={
                isLoggedIn 
                  ? <CheckoutPage /> 
                  : <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/orders" 
              element={
                isLoggedIn 
                  ? <OrdersPage /> 
                  : <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/profile" 
              element={
                isLoggedIn 
                  ? <ProfilePage user={user} setUser={setUser} /> 
                  : <Navigate to="/login" replace />
              } 
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route 
              path="/login" 
              element={
                isLoggedIn 
                  ? <Navigate to="/" replace /> 
                  : <LoginPage onLogin={handleLogin} />
              } 
            />
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                isLoggedIn && user?.is_staff
                  ? <AdminLayout user={user} />
                  : <Navigate to="/login" replace />
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/:id" element={<AdminUserDetail />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/:id" element={<AdminProductDetail />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:id" element={<AdminOrderDetail />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="addresses" element={<AdminAddresses />} />
            </Route>
          </Routes>
        </main>
        
        {!isAdmin && <Footer />}
      </div>
  );
}

export default App;
