import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiLogOut, FiHome } from 'react-icons/fi';

function Navigation({ cartItemCount, isLoggedIn, user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/" style={{ letterSpacing: '1px', fontSize: '1.8rem' }}>
          ✨ Spiritual Harmony
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <FiMenu size={24} />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-2">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <FiHome className="me-2" style={{ marginRight: '5px' }} />
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">
                Products
              </Link>
            </li>
            
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/orders">
                    My Orders
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#profile"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    <FiUser className="me-2" style={{ marginRight: '5px' }} />
                    {user?.username || 'Profile'}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" style={{ background: 'var(--primary-light-lavender)' }}>
                    <li>
                      <a className="dropdown-item" href="#profile">
                        My Profile
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={handleLogout}
                        style={{ cursor: 'pointer' }}
                      >
                        <FiLogOut className="me-2" />
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  <FiUser className="me-2" style={{ marginRight: '5px' }} />
                  Login
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link
                className="nav-link position-relative"
                to="/cart"
                style={{ color: 'var(--spiritual-gold)' }}
              >
                <FiShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                    style={{
                      backgroundColor: 'var(--spiritual-rose)',
                      color: 'white',
                      fontSize: '0.7rem',
                    }}
                  >
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
