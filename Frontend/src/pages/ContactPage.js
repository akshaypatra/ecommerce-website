import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import siteConfig from '../config/siteConfig.json';

function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const { contact, contactPage, brand } = siteConfig;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    setSubmitted(true);
    setSending(false);
  };

  return (
    <div className="container py-5 decorated-mandala decorated-mandala--right">
      <h1 style={{ color: 'var(--spiritual-purple)', marginBottom: '0.5rem' }}>{contactPage.title}</h1>
      <p style={{ color: 'var(--text-light)', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
        {contactPage.subtitle}
      </p>

      <div className="row g-5">
        {/* Contact Form */}
        <div className="col-lg-7">
          {submitted ? (
            <div className="empty-state" style={{ background: 'linear-gradient(135deg, #eee8b220 0%, #96cdb020 100%)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{brand.emoji}</div>
              <h3 style={{ color: 'var(--spiritual-purple)', marginBottom: '0.5rem' }}>{contactPage.successTitle}</h3>
              <p style={{ color: 'var(--text-light)' }}>{contactPage.successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Your Name *</label>
                  <input type="text" className="form-control" required value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Email *</label>
                  <input type="email" className="form-control" required value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Subject *</label>
                  <input type="text" className="form-control" required value={form.subject}
                    onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Message *</label>
                  <textarea className="form-control" rows="5" required value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-primary" disabled={sending}
                    style={{ borderRadius: 'var(--radius-md)', padding: '0.6rem 2rem' }}>
                    <FiSend className="me-1" /> {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div className="col-lg-5">
          <div className="card" style={{ borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, #081b1b 0%, #203b37 100%)' }}>
            <div className="card-body p-4">
              <h5 style={{ color: '#c18d52', fontWeight: '600', marginBottom: '1.5rem' }}>Get In Touch</h5>

              <div className="d-flex align-items-start mb-3">
                <FiMapPin style={{ color: '#5abf76', fontSize: '1.3rem', marginTop: '2px', flexShrink: 0 }} />
                <div className="ms-3">
                  <strong style={{ fontSize: '0.9rem', color: '#eee8b2' }}>Address</strong>
                  <p style={{ color: '#96cdb0', fontSize: '0.9rem', marginBottom: 0 }}>
                    {contact.address.full}
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-start mb-3">
                <FiPhone style={{ color: '#5abf76', fontSize: '1.3rem', marginTop: '2px', flexShrink: 0 }} />
                <div className="ms-3">
                  <strong style={{ fontSize: '0.9rem', color: '#eee8b2' }}>Phone</strong>
                  <p style={{ color: '#96cdb0', fontSize: '0.9rem', marginBottom: 0 }}>
                    {contact.phone}
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-start mb-3">
                <FiMail style={{ color: '#5abf76', fontSize: '1.3rem', marginTop: '2px', flexShrink: 0 }} />
                <div className="ms-3">
                  <strong style={{ fontSize: '0.9rem', color: '#eee8b2' }}>Email</strong>
                  <p style={{ color: '#96cdb0', fontSize: '0.9rem', marginBottom: 0 }}>
                    {contact.email}
                  </p>
                </div>
              </div>

              <hr style={{ borderColor: '#203b37' }} />

              <h6 style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#eee8b2' }}>Business Hours</h6>
              <p style={{ color: '#96cdb0', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{contact.businessHours.weekdays}</p>
              <p style={{ color: '#96cdb0', fontSize: '0.9rem', marginBottom: 0 }}>{contact.businessHours.weekend}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
