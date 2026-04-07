import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft } from 'react-icons/fi';

function CartPage({ cart, removeFromCart, updateCartQuantity }) {
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountCode, setDiscountCode] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal > 50 ? 0 : 9.99;
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percentage) / 100 : 0;
  const total = subtotal + shippingCost - discountAmount;

  const handleApplyDiscount = () => {
    if (discountCode === 'SPIRITUAL10') {
      setAppliedDiscount({ code: 'SPIRITUAL10', percentage: 10 });
    } else if (discountCode === 'WELLNESS20') {
      setAppliedDiscount({ code: 'WELLNESS20', percentage: 20 });
    } else {
      alert('Invalid discount code');
      setDiscountCode('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container py-5">
        <div
          style={{
            textAlign: 'center',
            padding: '3rem',
            background: 'linear-gradient(135deg, var(--primary-light-lavender) 0%, var(--primary-soft-mint) 100%)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <h2 style={{ color: 'var(--spiritual-purple)', marginBottom: '1rem' }}>
            Your Cart is Empty
          </h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
            Begin your spiritual journey by exploring our wellness collection.
          </p>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
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
        <FiArrowLeft /> Continue Shopping
      </Link>

      <h1 style={{ color: 'var(--spiritual-purple)', marginBottom: '2rem' }}>
        Shopping Cart
      </h1>

      <div className="row g-4">
        {/* Cart Items */}
        <div className="col-lg-8">
          {cart.map(item => (
            <div
              key={item.id}
              className="card mb-3"
              style={{
                display: 'flex',
                flexDirection: 'row',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, var(--primary-light-lavender) 0%, var(--primary-soft-mint) 100%)',
                  width: '150px',
                  minHeight: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-lg) 0 0 var(--radius-lg)',
                  fontSize: '2rem',
                }}
              >
                ✨
              </div>

              <div className="card-body d-flex flex-column justify-content-between" style={{ flex: 1 }}>
                <div>
                  <h5 style={{ color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
                    {item.name}
                  </h5>
                  <p style={{ color: 'var(--text-light)', marginBottom: 0, fontSize: '0.9rem' }}>
                    {item.description}
                  </p>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className="price">${item.price.toFixed(2)}</span>

                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center',
                    }}
                  >
                    <button
                      className="btn btn-sm"
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      style={{
                        backgroundColor: 'var(--accent-lavender)',
                        border: 'none',
                        color: 'var(--spiritual-purple)',
                      }}
                    >
                      <FiMinus />
                    </button>
                    <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: '600' }}>
                      {item.quantity}
                    </span>
                    <button
                      className="btn btn-sm"
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      style={{
                        backgroundColor: 'var(--accent-lavender)',
                        border: 'none',
                        color: 'var(--spiritual-purple)',
                      }}
                    >
                      <FiPlus />
                    </button>
                  </div>

                  <span style={{ fontWeight: '600', minWidth: '80px', textAlign: 'right' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="btn btn-sm"
                    style={{
                      color: 'var(--danger)',
                      border: '1px solid var(--danger)',
                      backgroundColor: 'transparent',
                    }}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar - Summary */}
        <div className="col-lg-4">
          <div
            className="card"
            style={{
              background: 'linear-gradient(135deg, var(--primary-light-lavender) 0%, var(--primary-soft-mint) 100%)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              position: 'sticky',
              top: '80px',
            }}
          >
            <h5 style={{ color: 'var(--spiritual-purple)', marginBottom: '1.5rem', fontWeight: '600' }}>
              Order Summary
            </h5>

            {/* Discount Code */}
            <div className="mb-3">
              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                Discount Code
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="SPIRITUAL10"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  style={{ borderRadius: 'var(--radius-md)' }}
                />
                <button
                  onClick={handleApplyDiscount}
                  className="btn btn-sm btn-primary"
                  style={{ borderRadius: 'var(--radius-md)' }}
                >
                  Apply
                </button>
              </div>
              <small style={{ color: 'var(--text-light)' }}>
                Try: SPIRITUAL10 or WELLNESS20
              </small>
            </div>

            <hr />

            {/* Pricing Breakdown */}
            <div style={{ fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>
                  {shippingCost === 0 ? (
                    <span style={{ color: 'var(--accent-sage)', fontWeight: '600' }}>FREE</span>
                  ) : (
                    `$${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>

              {appliedDiscount && (
                <div className="d-flex justify-content-between mb-2" style={{ color: 'var(--accent-sage)' }}>
                  <span>Discount ({appliedDiscount.percentage}%):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div
                className="d-flex justify-content-between"
                style={{
                  fontWeight: '700',
                  fontSize: '1.1rem',
                  paddingTop: '0.5rem',
                  borderTop: '2px solid var(--accent-lavender)',
                  color: 'var(--spiritual-gold)',
                }}
              >
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link to="/checkout" className="btn btn-primary w-100 mb-2" style={{ borderRadius: 'var(--radius-md)' }}>
              Proceed to Checkout
            </Link>

            <button
              onClick={() => window.history.back()}
              className="btn btn-outline-primary w-100"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              Continue Shopping
            </button>

            {/* Info */}
            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'rgba(196, 181, 253, 0.3)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ color: 'var(--text-dark)', fontSize: '0.85rem', marginBottom: 0 }}>
                💡 Free shipping on orders over $50!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
