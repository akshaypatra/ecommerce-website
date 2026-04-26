import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import siteConfig from '../config/siteConfig.json';

function Footer() {
  const { brand, contact, social, footer } = siteConfig;

  return (
    <footer className="py-5 mt-5 decorated-mandala decorated-mandala--left" style={{ position: 'relative' }}>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="row">
          {/* Brand */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h5 style={{ color: '#c18d52', marginBottom: '1rem', fontWeight: '700', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.3rem', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {brand.name}
            </h5>
            <p style={{ color: '#96cdb0', fontSize: '0.9rem', lineHeight: '1.6' }}>
              {brand.tagline}
            </p>
            <div className="d-flex gap-3">
              {social.facebook && <a href={social.facebook} target="_blank" rel="noopener noreferrer" style={{ color: '#c18d52' }}><FiFacebook size={20} /></a>}
              {social.twitter && <a href={social.twitter} target="_blank" rel="noopener noreferrer" style={{ color: '#c18d52' }}><FiTwitter size={20} /></a>}
              {social.instagram && <a href={social.instagram} target="_blank" rel="noopener noreferrer" style={{ color: '#c18d52' }}><FiInstagram size={20} /></a>}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h6 style={{ color: '#eee8b2', marginBottom: '1rem', fontWeight: '600' }}>Quick Links</h6>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {footer.quickLinks.map(link => (
                <li key={link.to} className="mb-1">
                  <Link to={link.to} className="footer-link" style={{ color: '#96cdb0', textDecoration: 'none' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h6 style={{ color: '#eee8b2', marginBottom: '1rem', fontWeight: '600' }}>Customer Service</h6>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {footer.customerService.map(item => (
                <li key={item.to} className="mb-1">
                  <Link to={item.to} className="footer-link" style={{ color: '#96cdb0', textDecoration: 'none' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-md-3">
            <h6 style={{ color: '#eee8b2', marginBottom: '1rem', fontWeight: '600' }}>Contact Us</h6>
            <div style={{ color: '#96cdb0', fontSize: '0.9rem' }}>
              <div className="mb-2 d-flex align-items-center">
                <FiMapPin className="me-2" style={{ color: '#c18d52' }} />
                <span>{contact.address.short}</span>
              </div>
              <div className="mb-2 d-flex align-items-center">
                <FiPhone className="me-2" style={{ color: '#c18d52' }} />
                <span>{contact.phone}</span>
              </div>
              <div className="d-flex align-items-center">
                <FiMail className="me-2" style={{ color: '#c18d52' }} />
                <span>{contact.email}</span>
              </div>
            </div>
          </div>
        </div>

        <hr style={{ margin: '2rem 0', borderColor: '#203b37' }} />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start" style={{ color: '#7a9e96', fontSize: '0.9rem' }}>
            &copy; {new Date().getFullYear()} {brand.name}. All rights reserved.
          </div>
          <div className="col-md-6 text-center text-md-end" style={{ color: '#7a9e96', fontSize: '0.9rem' }}>
            {footer.bottomText}
          </div>
        </div>
      </div>

      <style>{`
        .footer-link { transition: all 0.3s ease; display: inline-block; }
        .footer-link:hover { color: #c18d52 !important; transform: translateX(4px); }
      `}</style>
    </footer>
  );
}

export default Footer;
