import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiHeart, FiStar, FiAward } from 'react-icons/fi';

function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="hero-section" style={{ minHeight: '50vh', background: 'linear-gradient(135deg, #2d1b69 0%, #1a3a4a 50%, #2d4a3e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#fff', position: 'relative' }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>About Divine Gems</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', opacity: 0.9 }}>
            Your trusted source for authentic Rudraksha beads, certified gemstones, and sacred spiritual products since 2020.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="container py-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <h2 className="section-title" style={{ color: 'var(--spiritual-purple)' }}>Our Story</h2>
            <p style={{ color: 'var(--text-light)', lineHeight: '1.8', fontSize: '1.05rem' }}>
              Divine Gems was born from a deep reverence for India's ancient spiritual traditions. We started with a simple mission:
              to make authentic, lab-certified Rudraksha beads and natural gemstones accessible to seekers worldwide.
            </p>
            <p style={{ color: 'var(--text-light)', lineHeight: '1.8', fontSize: '1.05rem' }}>
              Every product in our collection is carefully sourced from trusted suppliers in Nepal, Indonesia, and select mines
              across India. Our in-house gemologists verify each stone's authenticity before it reaches you.
            </p>
          </div>
          <div className="col-lg-6">
            <div style={{ background: 'linear-gradient(135deg, var(--primary-light-lavender) 0%, var(--primary-soft-mint) 100%)', borderRadius: 'var(--radius-lg)', padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🙏</div>
              <h3 style={{ color: 'var(--spiritual-purple)', marginBottom: '0.5rem' }}>5,000+</h3>
              <p style={{ color: 'var(--text-light)' }}>Happy customers across India & abroad</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ background: 'var(--primary-cream)', padding: '4rem 0' }}>
        <div className="container">
          <h2 className="section-title text-center" style={{ color: 'var(--spiritual-purple)', marginBottom: '3rem' }}>Why Trust Divine Gems</h2>
          <div className="row g-4">
            {[
              { icon: <FiShield />, title: 'Certified Authentic', desc: 'Every Rudraksha & gemstone comes with a certificate of authenticity from accredited labs.' },
              { icon: <FiHeart />, title: 'Ethically Sourced', desc: 'We work directly with miners and growers to ensure fair practices and sustainable sourcing.' },
              { icon: <FiStar />, title: 'Expert Guidance', desc: 'Our astrologer consultants help you choose the right product based on your horoscope.' },
              { icon: <FiAward />, title: 'Quality Promise', desc: 'Not satisfied? We offer hassle-free returns within 15 days of delivery.' },
            ].map((val, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <div className="feature-card text-center" style={{ background: '#fff', padding: '2rem', borderRadius: 'var(--radius-lg)', height: '100%', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '2rem', color: 'var(--spiritual-teal)', marginBottom: '1rem' }}>{val.icon}</div>
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
        <h2 style={{ color: 'var(--spiritual-purple)', marginBottom: '1rem' }}>Ready to Begin Your Spiritual Journey?</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
          Browse our curated collection of Rudraksha, gemstones, malas, and more.
        </p>
        <Link to="/products" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-md)', padding: '0.75rem 2rem' }}>
          Explore Collection
        </Link>
      </section>
    </div>
  );
}

export default AboutPage;
