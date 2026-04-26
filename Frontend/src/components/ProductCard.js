import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar } from 'react-icons/fi';

const PLACEHOLDER_IMG = 'data:image/svg+xml;base64,' + btoa(`
  <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
    <rect fill="#eee8b2" width="300" height="300" rx="8"/>
    <circle cx="150" cy="130" r="40" fill="#203b37" opacity="0.15"/>
    <circle cx="150" cy="130" r="28" fill="#5abf76" opacity="0.12"/>
    <circle cx="150" cy="130" r="16" fill="#c18d52" opacity="0.2"/>
    <text x="150" y="195" text-anchor="middle" font-size="13" fill="#081b1b" font-family="Georgia, serif" font-weight="bold" letter-spacing="3">VASTU</text>
  </svg>
`);

function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false);

  const imageUrl = !imgError && (product.primary_image || product.image) 
    ? (product.primary_image || product.image) 
    : PLACEHOLDER_IMG;

  const price = parseFloat(product.effective_price || product.price || 0);
  const originalPrice = parseFloat(product.price || 0);
  const discountPct = product.discount_percentage || 0;
  const rating = product.average_rating || 0;
  const reviewCount = product.reviews_count || product.reviews?.length || 0;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FiStar
          key={i}
          size={14}
          style={{
            color: i <= Math.round(rating) ? 'var(--spiritual-gold)' : '#ddd',
            fill: i <= Math.round(rating) ? 'var(--spiritual-gold)' : 'none',
          }}
        />
      );
    }
    return stars;
  };

  return (
    <div className="fade-in">
      <div className="product-card">
        <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="product-image">
            <img
              src={imageUrl}
              alt={product.name}
              loading="lazy"
              onError={() => setImgError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {discountPct > 0 && (
              <span className="discount-badge">
                {Math.round(discountPct)}% OFF
              </span>
            )}
            {product.is_featured && (
              <span className="featured-badge">Featured</span>
            )}
          </div>
        </Link>

        <div className="p-3">
          <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h6 className="product-title">{product.name}</h6>
          </Link>

          {product.category_name && (
            <small className="product-category">{product.category_name}</small>
          )}

          {/* Rating */}
          <div className="d-flex align-items-center mb-2 mt-1">
            <div className="d-flex me-1">{renderStars(rating)}</div>
            <small style={{ color: 'var(--text-light)' }}>
              {rating > 0 ? `${rating}` : ''} ({reviewCount})
            </small>
          </div>

          {/* Price */}
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="product-price">₹{price.toFixed(0)}</span>
            {discountPct > 0 && originalPrice > price && (
              <span className="product-original-price">₹{originalPrice.toFixed(0)}</span>
            )}
          </div>

          {/* Stock */}
          {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
            <small style={{ color: 'var(--danger)', fontWeight: '500' }}>
              Only {product.stock} left!
            </small>
          )}
          {product.stock === 0 && (
            <small style={{ color: 'var(--danger)', fontWeight: '500' }}>Out of Stock</small>
          )}

          {/* View Details */}
          <Link
            to={`/products/${product.id}`}
            className="btn btn-primary w-100 mt-2 d-flex align-items-center justify-content-center gap-2"
            style={{ borderRadius: 'var(--radius-md)', fontSize: '0.9rem' }}
          >
            <FiShoppingCart size={16} />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
