import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  FiHome, FiUsers, FiPackage, FiGrid, FiShoppingCart,
  FiCreditCard, FiStar, FiArrowLeft, FiMenu, FiX, FiMapPin,
} from 'react-icons/fi';
import '../../styles/admin.css';

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', icon: <FiHome size={18} />, exact: true },
  { to: '/admin/users', label: 'Users', icon: <FiUsers size={18} /> },
  { to: '/admin/categories', label: 'Categories', icon: <FiGrid size={18} /> },
  { to: '/admin/products', label: 'Products', icon: <FiPackage size={18} /> },
  { to: '/admin/orders', label: 'Orders', icon: <FiShoppingCart size={18} /> },
  { to: '/admin/payments', label: 'Payments', icon: <FiCreditCard size={18} /> },
  { to: '/admin/reviews', label: 'Reviews', icon: <FiStar size={18} /> },
  { to: '/admin/addresses', label: 'Addresses', icon: <FiMapPin size={18} /> },
];

export default function AdminLayout({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const isActive = (link) => {
    if (link.exact) return location.pathname === link.to;
    return location.pathname.startsWith(link.to);
  };

  return (
    <div className="admin-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <h2 className="admin-sidebar-title">Admin Panel</h2>
          <button className="admin-sidebar-close" onClick={() => setSidebarOpen(false)}>
            <FiX size={20} />
          </button>
        </div>

        <div className="admin-sidebar-user">
          <div className="admin-sidebar-avatar">
            {(user?.first_name || user?.email || 'A').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="admin-sidebar-name">{user?.first_name || 'Admin'}</div>
            <div className="admin-sidebar-email">{user?.email}</div>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {sidebarLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`admin-sidebar-link ${isActive(link) ? 'active' : ''}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-sidebar-link" onClick={() => navigate('/')}>
            <FiArrowLeft size={18} />
            <span>Back to Store</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-menu-btn" onClick={() => setSidebarOpen(true)}>
            <FiMenu size={20} />
          </button>
          <h1 className="admin-page-title">
            {sidebarLinks.find(l => isActive(l))?.label || 'Admin'}
          </h1>
          <Link to="/" className="admin-back-link">
            <FiArrowLeft size={16} /> Store
          </Link>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
