import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiStar, FiTruck, FiGift } from 'react-icons/fi';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import siteConfig from '../config/siteConfig.json';

const iconMap = { FiShield: <FiShield />, FiStar: <FiStar />, FiTruck: <FiTruck />, FiGift: <FiGift /> };

function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  // eslint-disable-next-line
  const [loading, setLoading] = useState(true);

  const { hero, trustBadges, fallbackCategories, whyChooseUs, newsletter } = siteConfig;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, prodRes] = await Promise.allSettled([
          productAPI.getCategories(),
          productAPI.getFeatured(),
        ]);
        
        if (catRes.status === 'fulfilled' && catRes.value.data?.length > 0) {
          setCategories(catRes.value.data);
        } else {
          setCategories(fallbackCategories);
        }

        if (prodRes.status === 'fulfilled') {
          const products = prodRes.value.data?.results || prodRes.value.data || [];
          setFeaturedProducts(products.slice(0, 4));
        }
      } catch {
        setCategories(fallbackCategories);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categoryEmojis = {
    'rudraksha': '📿', 'gemstone': '💎', 'mala': '🙏', 'yantra': '🕉️',
    'crystal': '🔮', 'jewelry': '✨', 'bracelet': '📿', 'pendant': '✨',
    'ring': '💍', 'default': '🙏',
  };

  const getCategoryEmoji = (cat) => {
    if (cat.emoji) return cat.emoji;
    const name = (cat.name || '').toLowerCase();
    for (const [key, emoji] of Object.entries(categoryEmojis)) {
      if (name.includes(key)) return emoji;
    }
    return categoryEmojis.default;
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            {hero.title}
          </h1>
          <p className="hero-subtitle">
            {hero.subtitle}
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to={hero.primaryCTA.link} className="hero-btn hero-btn-primary">
              {hero.primaryCTA.label} <FiArrowRight />
            </Link>
            <Link to={hero.secondaryCTA.link} className="hero-btn hero-btn-outline">
              {hero.secondaryCTA.label}
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-bar">
        <div className="container">
          <div className="row g-3 text-center">
            {trustBadges.map((badge, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="trust-item">
                  <div className="trust-icon">{iconMap[badge.icon] || badge.icon}</div>
                  <div className="trust-title">{badge.title}</div>
                  <div className="trust-desc">{badge.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-5">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Explore our divine collection of spiritual products</p>

          <div className="row g-4">
            {(categories.length > 0 ? categories : fallbackCategories).slice(0, 6).map((category, index) => (
              <div key={category.id || index} className="col-md-6 col-lg-4">
                <Link
                  to={`/products?category=${category.slug || category.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="category-card">
                    {category.image ? (
                      <div className="category-image-wrapper">
                        <img 
                          src={category.image} 
                          alt={category.name} 
                          loading="lazy"
                          className="category-image"
                        />
                        <div className="category-overlay">
                          <h5>{category.name}</h5>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
                          {getCategoryEmoji(category)}
                        </div>
                        <h5 style={{ color: 'var(--spiritual-purple)', fontWeight: '600' }}>
                          {category.name}
                        </h5>
                        <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', margin: 0 }}>
                          {category.description || 'Explore collection'}
                        </p>
                      </>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-5" style={{ background: 'var(--bg)' }}>
          <div className="container">
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Handpicked divine items for you</p>
            <div className="row g-4">
              {featuredProducts.map(product => (
                <div key={product.id} className="col-md-6 col-lg-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <Link to="/products" className="btn btn-primary">
                View All Products <FiArrowRight className="ms-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-5">
        <div className="container">
          <h2 className="section-title">Why Choose {siteConfig.brand.name}?</h2>
          <div className="row g-4 mt-2">
            {whyChooseUs.map((item, i) => (
              <div key={i} className="col-md-6 col-lg-3">
                <div className="feature-card">
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.emoji}</div>
                  <h5 style={{ color: 'var(--spiritual-purple)', fontWeight: '600', marginBottom: '0.5rem' }}>
                    {item.title}
                  </h5>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, var(--primary-light-lavender) 0%, var(--primary-pale-gold) 100%)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '550px' }}>
          <h2 style={{ color: 'var(--spiritual-purple)', marginBottom: '1rem', fontWeight: '700' }}>
            {newsletter.title}
          </h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
            {newsletter.subtitle}
          </p>
          <form 
            style={{ display: 'flex', gap: '0.5rem' }} 
            onSubmit={(e) => { e.preventDefault(); alert(newsletter.successMessage); }}
          >
            <input
              type="email"
              placeholder="Your email address"
              className="form-control"
              required
              style={{ borderRadius: 'var(--radius-md)' }}
            />
            <button type="submit" className="btn btn-primary" style={{ borderRadius: 'var(--radius-md)', whiteSpace: 'nowrap' }}>
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
