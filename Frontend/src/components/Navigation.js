import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut,
  FiHome, FiPackage, FiInfo, FiPhone, FiChevronDown,
} from 'react-icons/fi';

function Navigation({ cartItemCount, isLoggedIn, user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const displayName = user?.first_name || user?.email?.split('@')[0] || 'Account';

  const navLinks = [
    { to: '/', label: 'Home', icon: <FiHome size={16} /> },
    { to: '/products', label: 'Shop', icon: <FiPackage size={16} /> },
    { to: '/about', label: 'About', icon: <FiInfo size={16} /> },
    { to: '/contact', label: 'Contact', icon: <FiPhone size={16} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="site-nav">
        <div className="nav-inner container">
          {/* Brand */}
          <Link className="nav-brand" to="/">
            <span className="nav-brand-icon">🙏</span> Divine Gems
          </Link>

          {/* Desktop Links */}
          <ul className="nav-links">
            {navLinks.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`nav-link-item ${isActive(link.to) ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Right Actions */}
          <div className="nav-actions">
            {isLoggedIn ? (
              <>
                <Link
                  to="/orders"
                  className={`nav-link-item ${isActive('/orders') ? 'active' : ''}`}
                >
                  My Orders
                </Link>

                {/* Profile Dropdown */}
                <div className="nav-dropdown" ref={profileRef}>
                  <button
                    className="nav-dropdown-trigger"
                    onClick={() => setProfileOpen(!profileOpen)}
                  >
                    <div className="nav-avatar">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <span className="nav-dropdown-name">{displayName}</span>
                    <FiChevronDown
                      size={14}
                      style={{
                        transform: profileOpen ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.2s',
                      }}
                    />
                  </button>

                  {profileOpen && (
                    <div className="nav-dropdown-menu">
                      <Link to="/profile" className="nav-dropdown-item">
                        <FiUser size={15} /> My Profile
                      </Link>
                      <Link to="/orders" className="nav-dropdown-item">
                        <FiPackage size={15} /> My Orders
                      </Link>
                      <div className="nav-dropdown-divider" />
                      <button className="nav-dropdown-item" onClick={handleLogout}>
                        <FiLogOut size={15} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login" className="nav-login-btn">
                <FiUser size={16} /> Login
              </Link>
            )}

            {/* Cart */}
            <Link
              to={isLoggedIn ? '/cart' : '/login'}
              className="nav-cart-btn"
            >
              <FiShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="nav-cart-badge">{cartItemCount}</span>
              )}
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="nav-mobile-actions">
            <Link to={isLoggedIn ? '/cart' : '/login'} className="nav-cart-btn">
              <FiShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="nav-cart-badge">{cartItemCount}</span>
              )}
            </Link>
            <button
              className="nav-hamburger"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <FiMenu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Off-canvas Drawer */}
      <div className={`mobile-backdrop ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} />
      <aside className={`mobile-drawer ${mobileOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <span className="nav-brand" style={{ fontSize: '1.25rem' }}>🙏 Divine Gems</span>
          <button className="nav-hamburger" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <FiX size={22} />
          </button>
        </div>

        {isLoggedIn && (
          <div className="mobile-user-card">
            <div className="nav-avatar" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{displayName}</div>
              <small style={{ color: 'var(--text-light)' }}>{user?.email}</small>
            </div>
          </div>
        )}

        <ul className="mobile-nav-links">
          {navLinks.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`mobile-nav-link ${isActive(link.to) ? 'active' : ''}`}
              >
                {link.icon} {link.label}
              </Link>
            </li>
          ))}

          {isLoggedIn ? (
            <>
              <li className="mobile-nav-divider" />
              <li>
                <Link to="/orders" className={`mobile-nav-link ${isActive('/orders') ? 'active' : ''}`}>
                  <FiPackage size={16} /> My Orders
                </Link>
              </li>
              <li>
                <Link to="/profile" className={`mobile-nav-link ${isActive('/profile') ? 'active' : ''}`}>
                  <FiUser size={16} /> My Profile
                </Link>
              </li>
              <li className="mobile-nav-divider" />
              <li>
                <button className="mobile-nav-link" onClick={handleLogout} style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}>
                  <FiLogOut size={16} /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="mobile-nav-divider" />
              <li>
                <Link to="/login" className="mobile-nav-link">
                  <FiUser size={16} /> Login / Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </aside>
    </>
  );
}

export default Navigation;
