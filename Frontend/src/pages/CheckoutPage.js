import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';

function CheckoutPage({ cart, clearCart }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shippingCost;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would normally call your backend API to create the order
      console.log('Order placed:', { cart, formData, total });

      setOrderPlaced(true);
      clearCart();

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="container py-5">
        <div
          style={{
            textAlign: 'center',
            padding: '3rem',
            background: 'linear-gradient(135deg, var(--primary-soft-mint) 0%, var(--primary-light-lavender) 100%)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div
            style={{
              fontSize: '3rem',
              marginBottom: '1rem',
              color: 'var(--accent-sage)',
              animation: 'pulse 1s ease-in-out infinite',
            }}
          >
            <FiCheck />
          </div>
          <h1 style={{ color: 'var(--spiritual-purple)', marginBottom: '1rem' }}>
            Order Placed Successfully!
          </h1>
          <p style={{ color: 'var(--text-light)', marginBottom: '2rem', fontSize: '1.1rem' }}>
            Thank you for your purchase. Your order is being processed.
          </p>
          <p style={{ color: 'var(--text-medium)', marginBottom: '2rem' }}>
            Redirecting to your orders...
          </p>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <Link
        to="/cart"
        style={{
          color: 'var(--spiritual-teal)',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '2rem',
        }}
      >
        <FiArrowLeft /> Back to Cart
      </Link>

      <h1 style={{ color: 'var(--spiritual-purple)', marginBottom: '2rem' }}>
        Checkout
      </h1>

      <div className="row g-4">
        {/* Checkout Form */}
        <div className="col-lg-8">
          <form onSubmit={handleSubmit}>
            {/* Shipping Information */}
            <div className="card mb-4" style={{ borderRadius: 'var(--radius-lg)' }}>
              <div
                className="card-header"
                style={{
                  background: 'linear-gradient(135deg, var(--primary-light-lavender) 0%, var(--primary-soft-mint) 100%)',
                  borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                  padding: '1rem',
                }}
              >
                <h5 style={{ color: 'var(--spiritual-purple)', marginBottom: 0, fontWeight: '600' }}>
                  Shipping Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      style={{ borderRadius: 'var(--radius-md)' }}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      style={{ borderRadius: 'var(--radius-md)' }}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      style={{ borderRadius: 'var(--radius-md)' }}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      style={{ borderRadius: 'var(--radius-md)' }}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    style={{ borderRadius: 'var(--radius-md)' }}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      style={{ borderRadius: 'var(--radius-md)' }}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      style={{ borderRadius: 'var(--radius-md)' }}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">ZIP Code</label>
                    <input
                      type="text"
                      className="form-control"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      style={{ borderRadius: 'var(--radius-md)' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="card mb-4" style={{ borderRadius: 'var(--radius-lg)' }}>
              <div
                className="card-header"
                style={{
                  background: 'linear-gradient(135deg, var(--primary-light-lavender) 0%, var(--primary-soft-mint) 100%)',
                  borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                  padding: '1rem',
                }}
              >
                <h5 style={{ color: 'var(--spiritual-purple)', marginBottom: 0, fontWeight: '600' }}>
                  Payment Information
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Cardholder Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    required
                    style={{ borderRadius: 'var(--radius-md)' }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                    style={{ borderRadius: 'var(--radius-md)' }}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Expiry Date</label>
                    <input
                      type="text"
                      className="form-control"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      required
                      style={{ borderRadius: 'var(--radius-md)' }}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">CVV</label>
                    <input
                      type="text"
                      className="form-control"
                      name="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      required
                      style={{ borderRadius: 'var(--radius-md)' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100"
              style={{
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem',
                fontSize: '1rem',
                fontWeight: '600',
              }}
            >
              {loading ? 'Processing Order...' : `Place Order - ${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
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

            {cart.map(item => (
              <div key={item.id} className="mb-2 pb-2" style={{ borderBottom: '1px solid var(--accent-lavender)' }}>
                <div className="d-flex justify-content-between" style={{ fontSize: '0.9rem' }}>
                  <span>{item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <small style={{ color: 'var(--text-light)' }}>
                  Qty: {item.quantity}
                </small>
              </div>
            ))}

            <hr />

            <div className="mb-2">
              <div className="d-flex justify-content-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <span>Shipping:</span>
                <span>
                  {shippingCost === 0 ? (
                    <span style={{ color: 'var(--accent-sage)', fontWeight: '600' }}>FREE</span>
                  ) : (
                    `$${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>
            </div>

            <div
              className="d-flex justify-content-between"
              style={{
                fontWeight: '700',
                fontSize: '1.1rem',
                paddingTop: '1rem',
                borderTop: '2px solid var(--accent-lavender)',
                color: 'var(--spiritual-gold)',
              }}
            >
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
