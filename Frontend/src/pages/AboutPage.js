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
      <section className="hero-section" style={{ minHeight: '50vh', background: 'linear-gradient(135deg, #081b1b 0%, #203b37 50%, #0f2b28 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#fff', position: 'relative' }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2.75rem', fontWeight: '700', marginBottom: '1rem', color: '#eee8b2' }}>{about.heroTitle}</h1>
          <p style={{ fontSize: '1.15rem', maxWidth: '700px', margin: '0 auto', color: '#96cdb0' }}>
            {about.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Rudraksh Divider */}
      <div className="rudraksh-divider" />

      {/* Story */}
      <section className="container py-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <h2 className="section-title" style={{ color: '#081b1b' }}>Our Story</h2>
            {about.story.map((para, i) => (
              <p key={i} style={{ color: 'var(--text-light)', lineHeight: '1.8', fontSize: '1.05rem' }}>{para}</p>
            ))}
          </div>
          <div className="col-lg-6">
            <div style={{ background: 'linear-gradient(135deg, #081b1b 0%, #203b37 100%)', borderRadius: 'var(--radius-lg)', padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{brand.emoji}</div>
              <h3 style={{ color: '#c18d52', marginBottom: '0.5rem', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{about.stat.value}</h3>
              <p style={{ color: '#96cdb0' }}>{about.stat.label}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Speciality */}
      <section className="om-watermark" style={{ background: 'linear-gradient(135deg, #081b1b 0%, #203b37 100%)', padding: '4rem 0', position: 'relative' }}>
        <div className="shimmer-overlay" />
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2rem', fontWeight: '700', color: '#c18d52', marginBottom: '1.5rem' }}>Our Speciality</h2>
          <p style={{ color: '#96cdb0', fontSize: '1.1rem', lineHeight: '1.9' }}>
            {about.speciality}
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="decorated-gemstones" style={{ background: 'var(--primary-cream)', padding: '4rem 0' }}>
        <div className="container">
          <h2 className="section-title text-center" style={{ color: '#081b1b', marginBottom: '3rem' }}>Why Trust {brand.name}</h2>
          <div className="row g-4">
            {about.values.map((val, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <div className="feature-card text-center" style={{ background: 'var(--white)', padding: '2rem', borderRadius: 'var(--radius-lg)', height: '100%', boxShadow: '0 2px 12px rgba(8,27,27,0.06)' }}>
                  <div style={{ fontSize: '2rem', color: '#5abf76', marginBottom: '1rem' }}>{iconMap[val.icon] || val.icon}</div>
                  <h5 style={{ color: '#081b1b', fontWeight: '600', marginBottom: '0.5rem' }}>{val.title}</h5>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', marginBottom: 0 }}>{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rudraksh Divider */}
      <div className="rudraksh-divider" />

      {/* CTA */}
      <section className="container py-5 text-center decorated-mandala decorated-mandala--center">
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#081b1b', marginBottom: '1rem' }}>{about.ctaTitle}</h2>
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
