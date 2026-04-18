import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import siteConfig from '../config/siteConfig.json';

function Footer() {
  const { brand, contact, social, footer } = siteConfig;

  return (
    <footer className="py-5 mt-5">
      <div className="container">
        <div className="row">
          {/* Brand */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h5 style={{ color: 'var(--spiritual-purple)', marginBottom: '1rem', fontWeight: '600' }}>
              {brand.emoji} {brand.name}
            </h5>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              {brand.tagline}
            </p>
            <div className="d-flex gap-3">
              {social.facebook && <a href={social.facebook} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--spiritual-teal)' }}><FiFacebook size={20} /></a>}
              {social.twitter && <a href={social.twitter} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--spiritual-teal)' }}><FiTwitter size={20} /></a>}
              {social.instagram && <a href={social.instagram} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--spiritual-teal)' }}><FiInstagram size={20} /></a>}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h6 style={{ color: 'var(--text-dark)', marginBottom: '1rem', fontWeight: '600' }}>Quick Links</h6>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {footer.quickLinks.map(link => (
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
              {footer.customerService.map(item => (
                <li key={item.to} className="mb-1">
                  <Link to={item.to} className="footer-link" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>
                    {item.label}
                  </Link>
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
                <span>{contact.address.short}</span>
              </div>
              <div className="mb-2 d-flex align-items-center">
                <FiPhone className="me-2" style={{ color: 'var(--spiritual-teal)' }} />
                <span>{contact.phone}</span>
              </div>
              <div className="d-flex align-items-center">
                <FiMail className="me-2" style={{ color: 'var(--spiritual-teal)' }} />
                <span>{contact.email}</span>
              </div>
            </div>
          </div>
        </div>

        <hr style={{ margin: '2rem 0', borderColor: 'var(--accent-lavender)' }} />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start" style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
            &copy; {new Date().getFullYear()} {brand.name}. All rights reserved.
          </div>
          <div className="col-md-6 text-center text-md-end" style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
            {footer.bottomText}
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
