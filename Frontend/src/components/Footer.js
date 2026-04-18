import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

function Footer() {
  return (
    <footer className="py-5 mt-5">
      <div className="container">
        <div className="row">
          {/* Brand */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h5 style={{ color: 'var(--spiritual-purple)', marginBottom: '1rem', fontWeight: '600' }}>
              🙏 Divine Gems
            </h5>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Authentic Rudraksha, Gemstones &amp; spiritual products to empower your journey.
            </p>
            <div className="d-flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--spiritual-teal)' }}><FiFacebook size={20} /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--spiritual-teal)' }}><FiTwitter size={20} /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--spiritual-teal)' }}><FiInstagram size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h6 style={{ color: 'var(--text-dark)', marginBottom: '1rem', fontWeight: '600' }}>Quick Links</h6>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'Shop' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
              ].map(link => (
                <li key={link.to} className="mb-1">
                  <Link to={link.to} className="footer-link" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h6 style={{ color: 'var(--text-dark)', marginBottom: '1rem', fontWeight: '600' }}>Customer Service</h6>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {['Shipping Info', 'Returns & Exchanges', 'FAQ', 'Privacy Policy'].map(item => (
                <li key={item} className="mb-1">
                  <span className="footer-link" style={{ color: 'var(--text-light)', cursor: 'pointer' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-md-3">
            <h6 style={{ color: 'var(--text-dark)', marginBottom: '1rem', fontWeight: '600' }}>Contact Us</h6>
            <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
              <div className="mb-2 d-flex align-items-center">
                <FiMapPin className="me-2" style={{ color: 'var(--spiritual-teal)' }} />
                <span>123 Sacred Lane, Varanasi, India</span>
              </div>
              <div className="mb-2 d-flex align-items-center">
                <FiPhone className="me-2" style={{ color: 'var(--spiritual-teal)' }} />
                <span>+91 98765 43210</span>
              </div>
              <div className="d-flex align-items-center">
                <FiMail className="me-2" style={{ color: 'var(--spiritual-teal)' }} />
                <span>support@divinegems.in</span>
              </div>
            </div>
          </div>
        </div>

        <hr style={{ margin: '2rem 0', borderColor: 'var(--accent-lavender)' }} />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start" style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
            &copy; {new Date().getFullYear()} Divine Gems. All rights reserved.
          </div>
          <div className="col-md-6 text-center text-md-end" style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
            Made with <span style={{ color: 'var(--spiritual-rose)' }}>💜</span> for your spiritual journey
          </div>
        </div>
      </div>

      <style>{`
        .footer-link { transition: all 0.3s ease; display: inline-block; }
        .footer-link:hover { color: var(--spiritual-teal) !important; transform: translateX(4px); }
      `}</style>
    </footer>
  );
}

export default Footer;
