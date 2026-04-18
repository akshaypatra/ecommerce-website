import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';

function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate sending — replace with real endpoint when backend supports it
    await new Promise(r => setTimeout(r, 1000));
    setSubmitted(true);
    setSending(false);
  };

  return (
    <div className="container py-5">
      <h1 style={{ color: 'var(--spiritual-purple)', marginBottom: '0.5rem' }}>Contact Us</h1>
      <p style={{ color: 'var(--text-light)', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
        Have a question about our products or need astrological guidance? We'd love to hear from you.
      </p>

      <div className="row g-5">
        {/* Contact Form */}
        <div className="col-lg-7">
          {submitted ? (
            <div className="empty-state" style={{ background: 'linear-gradient(135deg, var(--primary-soft-mint) 0%, var(--primary-light-lavender) 100%)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🙏</div>
              <h3 style={{ color: 'var(--spiritual-purple)', marginBottom: '0.5rem' }}>Message Sent!</h3>
              <p style={{ color: 'var(--text-light)' }}>We'll get back to you within 24 hours. Namaste!</p>
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
          <div className="card" style={{ borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, var(--primary-light-lavender) 0%, var(--primary-soft-mint) 100%)' }}>
            <div className="card-body p-4">
              <h5 style={{ color: 'var(--spiritual-purple)', fontWeight: '600', marginBottom: '1.5rem' }}>Get In Touch</h5>

              <div className="d-flex align-items-start mb-3">
                <FiMapPin style={{ color: 'var(--spiritual-teal)', fontSize: '1.3rem', marginTop: '2px', flexShrink: 0 }} />
                <div className="ms-3">
                  <strong style={{ fontSize: '0.9rem' }}>Address</strong>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: 0 }}>
                    123 Sacred Lane, Varanasi,<br />Uttar Pradesh 221001, India
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-start mb-3">
                <FiPhone style={{ color: 'var(--spiritual-teal)', fontSize: '1.3rem', marginTop: '2px', flexShrink: 0 }} />
                <div className="ms-3">
                  <strong style={{ fontSize: '0.9rem' }}>Phone</strong>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: 0 }}>
                    +91 98765 43210
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-start mb-3">
                <FiMail style={{ color: 'var(--spiritual-teal)', fontSize: '1.3rem', marginTop: '2px', flexShrink: 0 }} />
                <div className="ms-3">
                  <strong style={{ fontSize: '0.9rem' }}>Email</strong>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: 0 }}>
                    support@divinegems.in
                  </p>
                </div>
              </div>

              <hr style={{ borderColor: 'var(--accent-lavender)' }} />

              <h6 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Business Hours</h6>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Mon – Sat: 10:00 AM – 7:00 PM IST</p>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: 0 }}>Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
