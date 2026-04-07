import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiHeart, FiAward, FiTrendingUp } from 'react-icons/fi';

function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--primary-light-lavender) 0%, var(--primary-soft-mint) 100%)',
          padding: '4rem 2rem',
          textAlign: 'center',
          minHeight: '500px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '3rem',
            color: 'var(--spiritual-purple)',
            marginBottom: '1rem',
            fontWeight: '700',
          }}
        >
          ✨ Welcome to Spiritual Harmony ✨
        </h1>
        <p
          style={{
            fontSize: '1.2rem',
            color: 'var(--text-medium)',
            marginBottom: '2rem',
            maxWidth: '600px',
          }}
        >
          Discover wellness products that nurture your mind, body, and soul. Embrace peace and spiritual growth on your unique journey.
        </p>
        <Link
          to="/products"
          className="btn btn-primary"
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            borderRadius: 'var(--radius-lg)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          Explore Our Collection <FiArrowRight />
        </Link>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 2rem', backgroundColor: 'var(--primary-cream)' }}>
        <div className="container">
          <h2
            style={{
              textAlign: 'center',
              color: 'var(--spiritual-purple)',
              marginBottom: '3rem',
              fontSize: '2rem',
              fontWeight: '700',
            }}
          >
            Why Choose Spiritual Harmony?
          </h2>

          <div className="row g-4">
            {/* Feature 1 */}
            <div className="col-md-4">
              <div className="card h-100" style={{ borderRadius: 'var(--radius-lg)', border: 'none' }}>
                <div className="card-body text-center p-4">
                  <div
                    style={{
                      fontSize: '2.5rem',
                      marginBottom: '1rem',
                      color: 'var(--spiritual-teal)',
                    }}
                  >
                    <FiHeart />
                  </div>
                  <h5 style={{ color: 'var(--spiritual-purple)', marginBottom: '1rem', fontWeight: '600' }}>
                    Curated Selection
                  </h5>
                  <p style={{ color: 'var(--text-light)', marginBottom: 0 }}>
                    Every product is handpicked for quality and spiritual authenticity.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="col-md-4">
              <div className="card h-100" style={{ borderRadius: 'var(--radius-lg)', border: 'none' }}>
                <div className="card-body text-center p-4">
                  <div
                    style={{
                      fontSize: '2.5rem',
                      marginBottom: '1rem',
                      color: 'var(--accent-sage)',
                    }}
                  >
                    <FiAward />
                  </div>
                  <h5 style={{ color: 'var(--spiritual-purple)', marginBottom: '1rem', fontWeight: '600' }}>
                    Premium Quality
                  </h5>
                  <p style={{ color: 'var(--text-light)', marginBottom: 0 }}>
                    Sourced from ethical suppliers with a commitment to sustainability.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="col-md-4">
              <div className="card h-100" style={{ borderRadius: 'var(--radius-lg)', border: 'none' }}>
                <div className="card-body text-center p-4">
                  <div
                    style={{
                      fontSize: '2.5rem',
                      marginBottom: '1rem',
                      color: 'var(--accent-blush)',
                    }}
                  >
                    <FiTrendingUp />
                  </div>
                  <h5 style={{ color: 'var(--spiritual-purple)', marginBottom: '1rem', fontWeight: '600' }}>
                    Growth Journey
                  </h5>
                  <p style={{ color: 'var(--text-light)', marginBottom: 0 }}>
                    Support your personal and spiritual development with intention.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ padding: '4rem 2rem' }}>
        <div className="container">
          <h2
            style={{
              textAlign: 'center',
              color: 'var(--spiritual-purple)',
              marginBottom: '3rem',
              fontSize: '2rem',
              fontWeight: '700',
            }}
          >
            Shop by Category
          </h2>

          <div className="row g-4">
            {[
              { name: 'Crystals & Minerals', emoji: '💎' },
              { name: 'Meditation Tools', emoji: '🧘' },
              { name: 'Aromatherapy', emoji: '🌿' },
              { name: 'Wellness Books', emoji: '📚' },
              { name: 'Spiritual Art', emoji: '🎨' },
              { name: 'Energy Healing', emoji: '✨' },
            ].map((category, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <Link
                  to="/products"
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      background: 'linear-gradient(135deg, var(--primary-light-lavender) 0%, var(--primary-soft-mint) 100%)',
                      padding: '2rem',
                      borderRadius: 'var(--radius-lg)',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      transform: 'scale(1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                      {category.emoji}
                    </div>
                    <h5 style={{ color: 'var(--spiritual-purple)', fontWeight: '600' }}>
                      {category.name}
                    </h5>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--primary-light-lavender) 0%, var(--primary-soft-mint) 100%)',
          padding: '4rem 2rem',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '500px' }}>
          <h2
            style={{
              color: 'var(--spiritual-purple)',
              marginBottom: '1rem',
              fontWeight: '700',
            }}
          >
            Join Our Wellness Community
          </h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
            Subscribe to receive spiritual tips, exclusive offers, and product recommendations.
          </p>
          <form style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="email"
              placeholder="Your email address"
              className="form-control"
              style={{ borderRadius: 'var(--radius-md)' }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
