import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiStar, FiTruck, FiGift } from 'react-icons/fi';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  // eslint-disable-next-line
  const [loading, setLoading] = useState(true);

  // Fallback categories when API is unavailable
  const fallbackCategories = [
    { id: 1, name: 'Rudraksha Beads', slug: 'rudraksha-beads', emoji: '📿', description: 'Sacred seeds of Lord Shiva for spiritual protection' },
    { id: 2, name: 'Gemstones', slug: 'gemstones', emoji: '💎', description: 'Natural precious & semi-precious healing stones' },
    { id: 3, name: 'Malas & Rosaries', slug: 'malas-rosaries', emoji: '🙏', description: 'Handcrafted prayer beads for meditation' },
    { id: 4, name: 'Yantras', slug: 'yantras', emoji: '🕉️', description: 'Sacred geometric diagrams for energy & prosperity' },
    { id: 5, name: 'Crystal Healing', slug: 'crystal-healing', emoji: '🔮', description: 'Natural crystals for chakra balancing' },
    { id: 6, name: 'Spiritual Jewelry', slug: 'spiritual-jewelry', emoji: '✨', description: 'Blessed rings, pendants & bracelets' },
  ];

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
        <div className="hero-overlay">
          <h1 className="hero-title">
            🙏 Divine Gems & Sacred Rudraksha
          </h1>
          <p className="hero-subtitle">
            Discover authentic Rudraksha beads, precious gemstones, and sacred spiritual items 
            sourced directly from Nepal, India & Sri Lanka. Each piece is energized and blessed 
            for your spiritual journey.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/products" className="btn btn-primary btn-lg hero-btn">
              Shop Collection <FiArrowRight />
            </Link>
            <Link to="/about" className="btn btn-outline-light btn-lg hero-btn">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section style={{ padding: '2rem 1rem', backgroundColor: 'var(--primary-pale-gold)' }}>
        <div className="container">
          <div className="row g-3 text-center">
            {[
              { icon: <FiShield />, title: 'Certified Authentic', desc: 'Lab-tested gemstones' },
              { icon: <FiStar />, title: 'Energized & Blessed', desc: 'Vedic rituals performed' },
              { icon: <FiTruck />, title: 'Free Shipping', desc: 'On orders above ₹999' },
              { icon: <FiGift />, title: 'Gift Packaging', desc: 'Premium box included' },
            ].map((badge, i) => (
              <div key={i} className="col-6 col-md-3">
                <div style={{ color: 'var(--spiritual-gold)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>
                  {badge.icon}
                </div>
                <h6 style={{ color: 'var(--text-dark)', fontWeight: '600', fontSize: '0.9rem' }}>
                  {badge.title}
                </h6>
                <small style={{ color: 'var(--text-light)' }}>{badge.desc}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section style={{ padding: '4rem 2rem' }}>
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
        <section style={{ padding: '4rem 2rem', backgroundColor: 'var(--primary-cream)' }}>
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
      <section style={{ padding: '4rem 2rem', backgroundColor: 'var(--primary-soft-mint)' }}>
        <div className="container">
          <h2 className="section-title">Why Choose Divine Gems?</h2>
          <div className="row g-4 mt-2">
            {[
              { 
                emoji: '📿', 
                title: 'Authentic Rudraksha', 
                desc: 'Every Rudraksha is X-ray tested and verified from Nepal orchards. Genuine Mukhi certification provided.' 
              },
              { 
                emoji: '💎', 
                title: 'Natural Gemstones', 
                desc: 'Unheated, untreated gemstones with lab certificates. Blue Sapphire, Ruby, Emerald, Pearl & more.' 
              },
              { 
                emoji: '🕉️', 
                title: 'Vedic Energization', 
                desc: 'All products undergo proper Vedic Puja and energization by certified priests before shipping.' 
              },
              { 
                emoji: '🔬', 
                title: 'Lab Certified', 
                desc: 'Government-approved gem lab certificates included with every gemstone purchase.' 
              },
            ].map((item, i) => (
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
      <section style={{ background: 'linear-gradient(135deg, var(--primary-light-lavender) 0%, var(--primary-pale-gold) 100%)', padding: '4rem 2rem', textAlign:  'center' }}>
        <div className="container" style={{ maxWidth: '550px' }}>
          <h2 style={{ color: 'var(--spiritual-purple)', marginBottom: '1rem', fontWeight: '700' }}>
            Join Our Spiritual Community
          </h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
            Get exclusive deals on Rudraksha & gemstones, Puja dates, and spiritual tips.
          </p>
          <form 
            style={{ display: 'flex', gap: '0.5rem' }} 
            onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing! 🙏'); }}
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
