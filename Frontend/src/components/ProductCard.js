import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiLoader } from 'react-icons/fi';

function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      onAddToCart(product, quantity);
      setQuantity(1);
      alert('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="product-card">
        {/* Product Image */}
        <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="product-image">
            {product.image ? (
              <img src={product.image} alt={product.name} loading="lazy" />
            ) : (
              <div
                style={{
                  fontSize: '3rem',
                  textAlign: 'center',
                  color: 'var(--spiritual-purple)',
                }}
              >
                ✨
              </div>
            )}
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-4">
          <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h6
              style={{
                marginBottom: '0.5rem',
                color: 'var(--text-dark)',
                fontWeight: '600',
                minHeight: '2.5rem',
              }}
            >
              {product.name}
            </h6>
          </Link>

          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            {product.description?.substring(0, 50)}...
          </p>

          {/* Rating */}
          <div className="d-flex align-items-center mb-3">
            <span style={{ color: 'var(--spiritual-gold)' }} className="me-2">
              ★★★★★
            </span>
            <small style={{ color: 'var(--text-light)' }}>({product.reviews_count || 0})</small>
          </div>

          {/* Price */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="price">${parseFloat(product.price).toFixed(2)}</span>
            {product.discount && (
              <span className="badge badge-spiritual">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <div className="d-flex gap-2">
            <input
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="form-control"
              style={{
                flex: '0.5',
                padding: '0.5rem',
                textAlign: 'center',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--accent-lavender)',
              }}
            />
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="btn btn-primary flex-grow-1 d-flex align-items-center justify-content-center gap-2"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              {isAdding ? (
                <FiLoader className="spinner" />
              ) : (
                <>
                  <FiShoppingCart size={18} />
                  Add
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
