import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiHeart, FiStar, FiAward } from 'react-icons/fi';
import siteConfig from '../config/siteConfig.json';

const iconMap = { FiShield: <FiShield />, FiHeart: <FiHeart />, FiStar: <FiStar />, FiAward: <FiAward /> };

function AboutPage() {
  const { about, brand } = siteConfig;

  return (
    <div>
      {/* Hero */}
      <section className="hero-section" style={{ minHeight: '50vh', background: 'linear-gradient(135deg, #2d1b69 0%, #1a3a4a 50%, #2d4a3e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#fff', position: 'relative' }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>{about.heroTitle}</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', opacity: 0.9 }}>
            {about.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="container py-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <h2 className="section-title" style={{ color: 'var(--spiritual-purple)' }}>Our Story</h2>
            {about.story.map((para, i) => (
              <p key={i} style={{ color: 'var(--text-light)', lineHeight: '1.8', fontSize: '1.05rem' }}>{para}</p>
            ))}
          </div>
          <div className="col-lg-6">
            <div style={{ background: 'linear-gradient(135deg, var(--primary-light-lavender) 0%, var(--primary-soft-mint) 100%)', borderRadius: 'var(--radius-lg)', padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{brand.emoji}</div>
              <h3 style={{ color: 'var(--spiritual-purple)', marginBottom: '0.5rem' }}>{about.stat.value}</h3>
              <p style={{ color: 'var(--text-light)' }}>{about.stat.label}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ background: 'var(--primary-cream)', padding: '4rem 0' }}>
        <div className="container">
          <h2 className="section-title text-center" style={{ color: 'var(--spiritual-purple)', marginBottom: '3rem' }}>Why Trust {brand.name}</h2>
          <div className="row g-4">
            {about.values.map((val, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <div className="feature-card text-center" style={{ background: '#fff', padding: '2rem', borderRadius: 'var(--radius-lg)', height: '100%', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '2rem', color: 'var(--spiritual-teal)', marginBottom: '1rem' }}>{iconMap[val.icon] || val.icon}</div>
                  <h5 style={{ color: 'var(--spiritual-purple)', fontWeight: '600', marginBottom: '0.5rem' }}>{val.title}</h5>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', marginBottom: 0 }}>{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-5 text-center">
        <h2 style={{ color: 'var(--spiritual-purple)', marginBottom: '1rem' }}>{about.ctaTitle}</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
          {about.ctaText}
        </p>
        <Link to="/products" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-md)', padding: '0.75rem 2rem' }}>
          Explore Collection
        </Link>
      </section>
    </div>
  );
}

export default AboutPage;
