import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

function Footer() {
  return (
    <footer className="py-5 mt-5">
      <div className="container">
        <div className="row">
          {/* Brand Section */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h5 style={{ color: 'var(--spiritual-purple)', marginBottom: '1rem', fontWeight: '600' }}>
              ✨ Spiritual Harmony
            </h5>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Bringing peace, wellness, and spiritual growth to your everyday life.
            </p>
            <div className="d-flex gap-3">
              <a href="#facebook" style={{ color: 'var(--spiritual-teal)' }}>
                <FiFacebook size={20} />
              </a>
              <a href="#twitter" style={{ color: 'var(--spiritual-teal)' }}>
                <FiTwitter size={20} />
              </a>
              <a href="#instagram" style={{ color: 'var(--spiritual-teal)' }}>
                <FiInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h6 style={{ color: 'var(--text-dark)', marginBottom: '1rem', fontWeight: '600' }}>
              Quick Links
            </h6>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>
                <Link to="/" style={{ color: 'var(--text-light)', textDecoration: 'none' }} className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" style={{ color: 'var(--text-light)', textDecoration: 'none' }} className="footer-link">
                  Products
                </Link>
              </li>
              <li>
                <a href="#about" style={{ color: 'var(--text-light)', textDecoration: 'none' }} className="footer-link">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" style={{ color: 'var(--text-light)', textDecoration: 'none' }} className="footer-link">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h6 style={{ color: 'var(--text-dark)', marginBottom: '1rem', fontWeight: '600' }}>
              Customer Service
            </h6>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>
                <a href="#shipping" style={{ color: 'var(--text-light)', textDecoration: 'none' }} className="footer-link">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#returns" style={{ color: 'var(--text-light)', textDecoration: 'none' }} className="footer-link">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#faq" style={{ color: 'var(--text-light)', textDecoration: 'none' }} className="footer-link">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#privacy" style={{ color: 'var(--text-light)', textDecoration: 'none' }} className="footer-link">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-md-3">
            <h6 style={{ color: 'var(--text-dark)', marginBottom: '1rem', fontWeight: '600' }}>
              Contact Us
            </h6>
            <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
              <div className="mb-2 d-flex align-items-center">
                <FiMapPin className="me-2" style={{ color: 'var(--spiritual-teal)' }} />
                <span>123 Wellness Street, Peace City</span>
              </div>
              <div className="mb-2 d-flex align-items-center">
                <FiPhone className="me-2" style={{ color: 'var(--spiritual-teal)' }} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="d-flex align-items-center">
                <FiMail className="me-2" style={{ color: 'var(--spiritual-teal)' }} />
                <span>hello@spiritualharmony.com</span>
              </div>
            </div>
          </div>
        </div>

        <hr style={{ margin: '2rem 0', borderColor: 'var(--accent-lavender)' }} />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start" style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
            &copy; 2026 Spiritual Harmony. All rights reserved.
          </div>
          <div className="col-md-6 text-center text-md-end" style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
            Made with <span style={{ color: 'var(--spiritual-rose)' }}>💜</span> for your wellness
          </div>
        </div>
      </div>

      <style>{`
        .footer-link {
          transition: all 0.3s ease;
          display: inline-block;
        }
        .footer-link:hover {
          color: var(--spiritual-teal) !important;
          transform: translateX(4px);
        }
      `}</style>
    </footer>
  );
}

export default Footer;
