import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiLoader } from 'react-icons/fi';
import { cartAPI } from '../services/api';

const PLACEHOLDER_IMG = 'data:image/svg+xml;base64,' + btoa(`
  <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150">
    <rect fill="#e8e0f0" width="150" height="150"/>
    <circle cx="75" cy="75" r="30" fill="#d4af37" opacity="0.3"/>
    <circle cx="75" cy="75" r="20" fill="#9966cc" opacity="0.2"/>
  </svg>
`);

function CartPage({ updateCartCount }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await cartAPI.getCart();
      setCart(res.data);
      updateCartCount(res.data.total_items || 0);
    } catch (err) {
      console.error('Error loading cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateQuantity = async (itemId, newQty) => {
    if (newQty < 1) {
      handleRemoveItem(itemId);
      return;
    }
    setUpdating(itemId);
    try {
      await cartAPI.updateItem(itemId, newQty);
      await fetchCart();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update quantity');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    setUpdating(itemId);
    try {
      await cartAPI.removeItem(itemId);
      await fetchCart();
    } catch (err) {
      alert('Failed to remove item');
    } finally {
      setUpdating(null);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Clear entire cart?')) return;
    try {
      await cartAPI.clearCart();
      await fetchCart();
    } catch (err) {
      alert('Failed to clear cart');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <FiLoader className="spinner" style={{ fontSize: '2rem' }} />
        <p className="mt-3">Loading your cart...</p>
      </div>
    );
  }

  const items = cart?.items || [];
  const totalPrice = parseFloat(cart?.total_price || 0);
  const shippingCost = totalPrice >= 999 ? 0 : 99;
  const grandTotal = totalPrice + shippingCost;

  if (items.length === 0) {
    return (
      <div className="container py-5">
        <div className="empty-state">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
          <h2 style={{ color: 'var(--spiritual-purple)', marginBottom: '1rem' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
            Explore our divine collection of Rudraksha and gemstones.
          </p>
          <Link to="/products" className="btn btn-primary">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <Link to="/products" className="back-link">
        <FiArrowLeft /> Continue Shopping
      </Link>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 style={{ color: 'var(--spiritual-purple)' }}>Shopping Cart</h1>
        <button onClick={handleClearCart} className="btn btn-sm btn-outline-danger">
          Clear Cart
        </button>
      </div>

      <div className="row g-4">
        {/* Cart Items */}
        <div className="col-lg-8">
          {items.map(item => {
            const product = item.product_detail || {};
            const imgUrl = product.primary_image || PLACEHOLDER_IMG;
            
            return (
              <div key={item.id} className="cart-item-card">
                <div className="cart-item-image">
                  <img
                    src={imgUrl}
                    alt={product.name || 'Product'}
                    loading="lazy"
                    onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                  />
                </div>

                <div className="cart-item-details">
                  <div>
                    <Link to={`/products/${item.product}`} style={{ textDecoration: 'none' }}>
                      <h5 style={{ color: 'var(--text-dark)', marginBottom: '0.25rem' }}>
                        {product.name || 'Product'}
                      </h5>
                    </Link>
                    {product.category_name && (
                      <small style={{ color: 'var(--text-light)' }}>{product.category_name}</small>
                    )}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span style={{ fontWeight: '600', color: 'var(--spiritual-gold)' }}>
                      ₹{parseFloat(product.effective_price || product.price || 0).toFixed(0)}
                    </span>

                    <div className="d-flex gap-2 align-items-center">
                      <button
                        className="btn btn-sm qty-btn"
                        disabled={updating === item.id}
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        <FiMinus size={14} />
                      </button>
                      <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: '600' }}>
                        {updating === item.id ? '...' : item.quantity}
                      </span>
                      <button
                        className="btn btn-sm qty-btn"
                        disabled={updating === item.id}
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>

                    <span style={{ fontWeight: '600', minWidth: '80px', textAlign: 'right' }}>
                      ₹{parseFloat(item.subtotal || 0).toFixed(0)}
                    </span>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="btn btn-sm"
                      disabled={updating === item.id}
                      style={{ color: 'var(--danger)', border: '1px solid var(--danger)', backgroundColor: 'transparent' }}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="col-lg-4">
          <div className="summary-card">
            <h5 style={{ color: 'var(--spiritual-purple)', marginBottom: '1.5rem', fontWeight: '600' }}>
              Order Summary
            </h5>

            <div style={{ fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({cart.total_items} items):</span>
                <span>₹{totalPrice.toFixed(0)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>
                  {shippingCost === 0 ? (
                    <span style={{ color: 'var(--accent-sage)', fontWeight: '600' }}>FREE</span>
                  ) : (
                    `₹${shippingCost}`
                  )}
                </span>
              </div>
              <div className="summary-total">
                <span>Total:</span>
                <span>₹{grandTotal.toFixed(0)}</span>
              </div>
            </div>

            <Link to="/checkout" className="btn btn-primary w-100 mb-2" style={{ borderRadius: 'var(--radius-md)' }}>
              Proceed to Checkout
            </Link>

            <Link to="/products" className="btn btn-outline-primary w-100" style={{ borderRadius: 'var(--radius-md)' }}>
              Continue Shopping
            </Link>

            {shippingCost > 0 && (
              <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'rgba(196, 181, 253, 0.3)', borderRadius: 'var(--radius-md)' }}>
                <small style={{ color: 'var(--text-dark)' }}>
                  📿 Free shipping on orders above ₹999!
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
