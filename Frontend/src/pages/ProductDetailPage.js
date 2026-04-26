import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShoppingCart, FiCheck, FiStar, FiLoader } from 'react-icons/fi';
import { productAPI, cartAPI } from '../services/api';

const PLACEHOLDER_IMG = 'data:image/svg+xml;base64,' + btoa(`
  <svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
    <rect fill="#f7f5ef" width="500" height="500"/>
    <circle cx="250" cy="210" r="60" fill="#C18D52" opacity="0.12"/>
    <circle cx="250" cy="210" r="40" fill="#5abf76" opacity="0.1"/>
    <circle cx="250" cy="210" r="22" fill="#C18D52" opacity="0.15"/>
    <text x="250" y="310" text-anchor="middle" font-size="18" fill="#081b1b" font-family="Georgia, serif" font-weight="bold" letter-spacing="4">VASTU</text>
  </svg>
`);

function ProductDetailPage({ isLoggedIn, updateCartCount }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productAPI.getById(id);
        setProduct(res.data);
      } catch (err) {
        setError('Product not found or server unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await cartAPI.addItem(product.id, quantity);
      setAdded(true);
      // Update cart count
      try {
        const cartRes = await cartAPI.getCart();
        updateCartCount(cartRes.data.total_items || 0);
      } catch {}
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to add to cart';
      alert(msg);
    } finally {
      setAdding(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setSubmittingReview(true);
    try {
      await productAPI.createReview(id, reviewForm);
      // Refresh product to show new review
      const res = await productAPI.getById(id);
      setProduct(res.data);
      setReviewForm({ rating: 5, title: '', comment: '' });
      alert('Review submitted! 🙏');
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data?.product?.[0] || 'You may have already reviewed this product.';
      alert(msg);
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        size={interactive ? 24 : 18}
        style={{
          color: i < rating ? 'var(--spiritual-gold)' : '#ddd',
          fill: i < rating ? 'var(--spiritual-gold)' : 'none',
          cursor: interactive ? 'pointer' : 'default',
          marginRight: '2px',
        }}
        onClick={interactive && onChange ? () => onChange(i + 1) : undefined}
      />
    ));
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <FiLoader className="spinner" style={{ fontSize: '2rem' }} />
        <p className="mt-3">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5 text-center">
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
        <h3 style={{ color: 'var(--spiritual-purple)' }}>{error || 'Product not found'}</h3>
        <Link to="/products" className="btn btn-primary mt-3">Back to Products</Link>
      </div>
    );
  }

  const images = product.images || [];
  const currentImage = images.length > 0 ? images[selectedImage]?.image : null;
  const price = parseFloat(product.effective_price || product.price || 0);
  const originalPrice = parseFloat(product.price || 0);
  const discountPct = product.discount_percentage || 0;
  const reviews = product.reviews || [];

  return (
    <div className="container py-4 product-detail-container">
      <Link to="/products" className="back-link">
        <FiArrowLeft /> Back to Products
      </Link>

      <div className="row g-4 g-lg-5 mt-2">
        {/* Product Images */}
        <div className="col-lg-5">
          <div className="product-detail-image-wrapper">
            <img
              src={currentImage || PLACEHOLDER_IMG}
              alt={product.name}
              onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
            />
            {discountPct > 0 && (
              <span className="discount-badge" style={{ fontSize: '0.9rem', padding: '0.45rem 0.9rem' }}>
                {Math.round(discountPct)}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="product-detail-thumbnails">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  onClick={() => setSelectedImage(idx)}
                  className={`thumb ${selectedImage === idx ? 'active' : ''}`}
                >
                  <img
                    src={img.image}
                    alt={img.alt_text || product.name}
                    loading="lazy"
                    onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="col-lg-7">
          <div className="product-detail-info">
            {product.category_name && (
              <span className="product-detail-category">{product.category_name}</span>
            )}

            <h1 className="product-detail-name">{product.name}</h1>

            {/* Rating */}
            <div className="product-detail-rating">
              <div className="d-flex">{renderStars(Math.round(product.average_rating || 0))}</div>
              <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                {product.average_rating || 0} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            {/* Price */}
            <div className="product-detail-price-box">
              <span className="product-detail-price">₹{price.toFixed(0)}</span>
              {discountPct > 0 && originalPrice > price && (
                <>
                  <span className="product-detail-original">₹{originalPrice.toFixed(0)}</span>
                  <span className="product-detail-save">Save ₹{(originalPrice - price).toFixed(0)}</span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div>
              {product.stock > 0 ? (
                <span className="product-detail-stock in-stock">
                  <FiCheck size={14} /> In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="product-detail-stock out-of-stock">Out of Stock</span>
              )}
            </div>

            {/* Description */}
            <div className="product-detail-desc"
              dangerouslySetInnerHTML={{ __html: product.description?.replace(/\n/g, '<br/>') }}
            />

            {/* Add to Cart */}
            {product.stock > 0 && (
              <div className="product-detail-cart-box">
                <div className="row align-items-center">
                  <div className="col-md-5 mb-3 mb-md-0">
                    <label style={{ marginBottom: '0.5rem', display: 'block', fontWeight: '600', fontSize: '0.88rem', color: '#081b1b' }}>Quantity</label>
                    <div className="d-flex gap-2 align-items-center">
                      <button className="btn btn-sm qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                      <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                        className="qty-input"
                      />
                      <button className="btn btn-sm qty-btn" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
                    </div>
                  </div>
                  <div className="col-md-7">
                    <button
                      onClick={handleAddToCart}
                      disabled={adding}
                      className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                      style={{ borderRadius: 'var(--radius-full)', fontWeight: '600', padding: '0.8rem 1.5rem', fontSize: '1rem' }}
                    >
                      {adding ? (
                        <FiLoader className="spinner" />
                      ) : added ? (
                        <><FiCheck /> Added to Cart!</>
                      ) : (
                        <><FiShoppingCart /> Add to Cart — ₹{(price * quantity).toFixed(0)}</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SKU */}
            {product.sku && (
              <span className="product-detail-sku">SKU: {product.sku}</span>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-5 pt-3">
        <h3 className="review-section-title">
          Customer Reviews ({reviews.length})
        </h3>

        {/* Write Review Form */}
        {isLoggedIn && (
          <div className="review-write-box mb-4">
            <h6 style={{ color: '#081b1b', fontWeight: '700', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.15rem', marginBottom: '1rem' }}>Write a Review</h6>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-3">
                <label className="form-label small" style={{ fontWeight: '600' }}>Rating</label>
                <div className="d-flex">
                  {renderStars(reviewForm.rating, true, (r) => setReviewForm(prev => ({ ...prev, rating: r })))}
                </div>
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Review title (optional)"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Share your experience with this product..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                />
              </div>
              <button type="submit" disabled={submittingReview} className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)' }}>
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {/* Review List */}
        {reviews.length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {reviews.map((review, idx) => (
              <div key={review.id || idx} className="review-card">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="d-flex mb-1">{renderStars(review.rating)}</div>
                    {review.title && <h6 style={{ color: '#081b1b', fontWeight: '600', marginBottom: '0.35rem' }}>{review.title}</h6>}
                    <p style={{ color: 'var(--text-medium)', margin: 0, lineHeight: '1.7' }}>{review.comment}</p>
                  </div>
                  <small style={{ color: 'var(--text-light)', whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                    {review.user_email?.split('@')[0]} · {new Date(review.created_at).toLocaleDateString()}
                  </small>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: 'linear-gradient(135deg, rgba(238,232,178,0.1) 0%, rgba(150,205,176,0.08) 100%)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🙏</div>
            <p style={{ color: 'var(--text-light)', margin: 0 }}>No reviews yet. Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetailPage;
