import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiShoppingCart, FiCheck } from 'react-icons/fi';

function ProductDetailPage({ addToCart }) {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Mock product data
  const mockProduct = {
    id: parseInt(id),
    name: 'Amethyst Crystal Cluster',
    price: 45.99,
    description: 'Natural amethyst crystal cluster for energy healing and meditation',
    longDescription: `Our premium Amethyst Crystal Cluster is sourced directly from sustainable 
    mines and carefully selected for its radiant beauty and powerful energy. This natural crystal 
    is known for its calming properties and spiritual benefits. Perfect for meditation spaces, 
    bedrooms, or as a meaningful gift for someone on their wellness journey.`,
    reviews_count: 128,
    rating: 4.8,
    in_stock: true,
    image: null,
    specifications: {
      'Origin': 'Brazil',
      'Weight': '500g - 600g',
      'Color': 'Deep Purple',
      'Care': 'Keep away from direct sunlight for long periods',
    },
    benefits: [
      'Promotes peaceful sleep and meditation',
      'Calms anxiety and stress',
      'Enhances spiritual awareness',
      'Natural energy purification',
    ],
  };

  const handleAddToCart = () => {
    addToCart(mockProduct, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="container py-4">
      {/* Back Button */}
      <Link
        to="/products"
        style={{
          color: 'var(--spiritual-teal)',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '2rem',
        }}
      >
        <FiArrowLeft /> Back to Products
      </Link>

      <div className="row g-4">
        {/* Product Image */}
        <div className="col-lg-5">
          <div
            style={{
              background: 'linear-gradient(135deg, var(--primary-light-lavender) 0%, var(--primary-soft-mint) 100%)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '5rem',
            }}
          >
            ✨
          </div>
        </div>

        {/* Product Details */}
        <div className="col-lg-7">
          <h1 style={{ color: 'var(--spiritual-purple)', marginBottom: '1rem', fontSize: '2rem' }}>
            {mockProduct.name}
          </h1>

          {/* Rating */}
          <div className="d-flex align-items-center mb-3">
            <span style={{ color: 'var(--spiritual-gold)', fontSize: '1.5rem' }}>★★★★★</span>
            <span style={{ color: 'var(--text-light)', marginLeft: '0.5rem' }}>
              {mockProduct.rating} ({mockProduct.reviews_count} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mb-4">
            <span
              className="price"
              style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: 'var(--spiritual-gold)',
              }}
            >
              ${mockProduct.price.toFixed(2)}
            </span>
          </div>

          {/* Stock Status */}
          <div className="mb-4">
            {mockProduct.in_stock ? (
              <span
                className="badge"
                style={{
                  backgroundColor: 'var(--accent-sage)',
                  color: 'var(--text-dark)',
                  padding: '0.5rem 1rem',
                  fontSize: '0.9rem',
                }}
              >
                <FiCheck className="me-1" /> In Stock
              </span>
            ) : (
              <span className="badge bg-danger">Out of Stock</span>
            )}
          </div>

          {/* Description */}
          <p style={{ color: 'var(--text-medium)', marginBottom: '1.5rem', lineHeight: '1.8' }}>
            {mockProduct.longDescription}
          </p>

          {/* Add to Cart Section */}
          <div className="card mb-4" style={{ background: 'var(--primary-soft-mint)', border: 'none' }}>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label style={{ marginBottom: '0.5rem', display: 'block', fontWeight: '600' }}>
                    Quantity:
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center',
                    }}
                  >
                    <button
                      className="btn btn-sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={{
                        backgroundColor: 'var(--accent-lavender)',
                        border: 'none',
                        color: 'var(--spiritual-purple)',
                      }}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      style={{
                        width: '50px',
                        textAlign: 'center',
                        border: '1px solid var(--accent-lavender)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.5rem',
                      }}
                    />
                    <button
                      className="btn btn-sm"
                      onClick={() => setQuantity(quantity + 1)}
                      style={{
                        backgroundColor: 'var(--accent-lavender)',
                        border: 'none',
                        color: 'var(--spiritual-purple)',
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="col-md-6">
                  <button
                    onClick={handleAddToCart}
                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                    style={{
                      borderRadius: 'var(--radius-md)',
                      fontWeight: '600',
                      padding: '0.75rem',
                    }}
                  >
                    <FiShoppingCart />
                    {added ? 'Added to Cart! ✓' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-4">
            <h5 style={{ color: 'var(--spiritual-purple)', marginBottom: '1rem', fontWeight: '600' }}>
              Spiritual Benefits
            </h5>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {mockProduct.benefits.map((benefit, index) => (
                <li
                  key={index}
                  style={{
                    color: 'var(--text-medium)',
                    paddingLeft: '1.5rem',
                    marginBottom: '0.5rem',
                    position: 'relative',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      color: 'var(--accent-sage)',
                    }}
                  >
                    ✓
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Specifications */}
          <div>
            <h5 style={{ color: 'var(--spiritual-purple)', marginBottom: '1rem', fontWeight: '600' }}>
              Specifications
            </h5>
            <table style={{ width: '100%' }}>
              <tbody>
                {Object.entries(mockProduct.specifications).map(([key, value]) => (
                  <tr key={key} style={{ borderBottom: '1px solid var(--accent-lavender)' }}>
                    <td style={{ padding: '0.75rem 0', fontWeight: '600', color: 'var(--text-dark)' }}>
                      {key}
                    </td>
                    <td style={{ padding: '0.75rem 0', color: 'var(--text-light)', textAlign: 'right' }}>
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
