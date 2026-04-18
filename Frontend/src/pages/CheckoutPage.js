import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiPlus } from 'react-icons/fi';
import { cartAPI, authAPI, orderAPI, paymentAPI } from '../services/api';

function CheckoutPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [addressForm, setAddressForm] = useState({
    full_name: '', phone: '', address_line1: '', address_line2: '',
    city: '', state: '', pincode: '', country: 'India', address_type: 'home',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cartRes, addrRes] = await Promise.all([
          cartAPI.getCart(),
          authAPI.getAddresses(),
        ]);
        setCart(cartRes.data);
        setAddresses(addrRes.data || []);
        const defaultAddr = (addrRes.data || []).find(a => a.is_default) || (addrRes.data || [])[0];
        if (defaultAddr) setSelectedAddress(defaultAddr.id);
      } catch (err) {
        console.error('Error loading checkout data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.createAddress(addressForm);
      setAddresses(prev => [...prev, res.data]);
      setSelectedAddress(res.data.id);
      setShowAddressForm(false);
      setAddressForm({
        full_name: '', phone: '', address_line1: '', address_line2: '',
        city: '', state: '', pincode: '', country: 'India', address_type: 'home',
      });
    } catch (err) {
      alert('Failed to save address. Please check all fields.');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!selectedAddress) {
      alert('Please select or add a delivery address.');
      return;
    }

    setPlacing(true);
    try {
      const shippingCharge = totalPrice >= 999 ? 0 : 99;
      const orderRes = await orderAPI.create(selectedAddress, notes, shippingCharge);
      const order = orderRes.data;

      if (paymentMethod === 'cod') {
        setOrderPlaced(true);
        setTimeout(() => navigate('/orders'), 3000);
      } else if (paymentMethod === 'razorpay') {
        try {
          const payRes = await paymentAPI.createRazorpayOrder(order.order_id);
          const options = {
            key: payRes.data.razorpay_key,
            amount: payRes.data.amount,
            currency: payRes.data.currency,
            name: 'Divine Gems',
            description: `Order #${order.order_id.substring(0, 8)}`,
            order_id: payRes.data.razorpay_order_id,
            handler: async function (response) {
              try {
                await paymentAPI.verifyRazorpayPayment({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                });
                setOrderPlaced(true);
                setTimeout(() => navigate('/orders'), 3000);
              } catch {
                alert('Payment verification failed. Contact support.');
                navigate('/orders');
              }
            },
            prefill: { email: payRes.data.email, contact: payRes.data.contact, name: payRes.data.name },
            theme: { color: '#9966cc' },
          };
          // eslint-disable-next-line no-undef
          if (window.Razorpay) {
            const rzp = new window.Razorpay(options);
            rzp.open();
          } else {
            alert('Razorpay SDK not loaded. Please refresh and try again.');
          }
        } catch (err) {
          alert('Failed to initiate payment. Order created as COD.');
          setOrderPlaced(true);
          setTimeout(() => navigate('/orders'), 3000);
        }
      } else {
        setOrderPlaced(true);
        setTimeout(() => navigate('/orders'), 3000);
      }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to place order. Please try again.';
      alert(msg);
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" style={{ color: 'var(--spiritual-teal)' }} />
        <p className="mt-3">Loading checkout...</p>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="container py-5">
        <div className="empty-state" style={{ background: 'linear-gradient(135deg, var(--primary-soft-mint) 0%, var(--primary-light-lavender) 100%)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--accent-sage)' }}>
            <FiCheck />
          </div>
          <h1 style={{ color: 'var(--spiritual-purple)', marginBottom: '1rem' }}>Order Placed Successfully! 🙏</h1>
          <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '1.1rem' }}>
            Thank you for your purchase. Your order is being processed.
          </p>
          <p style={{ color: 'var(--text-medium)' }}>Redirecting to your orders...</p>
        </div>
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
          <h2 style={{ color: 'var(--spiritual-purple)' }}>Your cart is empty</h2>
          <Link to="/products" className="btn btn-primary mt-3">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <Link to="/cart" className="back-link">
        <FiArrowLeft /> Back to Cart
      </Link>

      <h1 style={{ color: 'var(--spiritual-purple)', marginBottom: '2rem' }}>Checkout</h1>

      <div className="row g-4">
        <div className="col-lg-8">
          <form onSubmit={handlePlaceOrder}>
            {/* Delivery Address */}
            <div className="card mb-4" style={{ borderRadius: 'var(--radius-lg)' }}>
              <div className="card-header" style={{ background: 'linear-gradient(135deg, var(--primary-light-lavender) 0%, var(--primary-soft-mint) 100%)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', padding: '1rem' }}>
                <h5 style={{ color: 'var(--spiritual-purple)', marginBottom: 0, fontWeight: '600' }}>
                  Delivery Address
                </h5>
              </div>
              <div className="card-body">
                {addresses.length > 0 ? (
                  <div className="row g-3">
                    {addresses.map(addr => (
                      <div key={addr.id} className="col-md-6">
                        <div
                          className={`p-3 border rounded ${selectedAddress === addr.id ? 'border-primary' : ''}`}
                          style={{ cursor: 'pointer', borderWidth: selectedAddress === addr.id ? '2px' : '1px' }}
                          onClick={() => setSelectedAddress(addr.id)}
                        >
                          <div className="form-check">
                            <input
                              type="radio"
                              className="form-check-input"
                              checked={selectedAddress === addr.id}
                              onChange={() => setSelectedAddress(addr.id)}
                            />
                            <label className="form-check-label">
                              <strong>{addr.full_name}</strong>
                              <br />
                              <small style={{ color: 'var(--text-light)' }}>
                                {addr.address_line1}, {addr.city}, {addr.state} - {addr.pincode}
                                <br />📞 {addr.phone}
                              </small>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-light)' }}>No saved addresses. Add one below.</p>
                )}

                <button
                  type="button"
                  className="btn btn-outline-primary mt-3"
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  style={{ borderRadius: 'var(--radius-md)' }}
                >
                  <FiPlus className="me-1" /> Add New Address
                </button>

                {showAddressForm && (
                  <div className="mt-3 p-3 border rounded">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <input type="text" className="form-control" placeholder="Full Name *" required
                          value={addressForm.full_name} onChange={e => setAddressForm(p => ({ ...p, full_name: e.target.value }))} />
                      </div>
                      <div className="col-md-6">
                        <input type="tel" className="form-control" placeholder="Phone *" required
                          value={addressForm.phone} onChange={e => setAddressForm(p => ({ ...p, phone: e.target.value }))} />
                      </div>
                      <div className="col-12">
                        <input type="text" className="form-control" placeholder="Address Line 1 *" required
                          value={addressForm.address_line1} onChange={e => setAddressForm(p => ({ ...p, address_line1: e.target.value }))} />
                      </div>
                      <div className="col-12">
                        <input type="text" className="form-control" placeholder="Address Line 2"
                          value={addressForm.address_line2} onChange={e => setAddressForm(p => ({ ...p, address_line2: e.target.value }))} />
                      </div>
                      <div className="col-md-4">
                        <input type="text" className="form-control" placeholder="City *" required
                          value={addressForm.city} onChange={e => setAddressForm(p => ({ ...p, city: e.target.value }))} />
                      </div>
                      <div className="col-md-4">
                        <input type="text" className="form-control" placeholder="State *" required
                          value={addressForm.state} onChange={e => setAddressForm(p => ({ ...p, state: e.target.value }))} />
                      </div>
                      <div className="col-md-4">
                        <input type="text" className="form-control" placeholder="Pincode *" required
                          value={addressForm.pincode} onChange={e => setAddressForm(p => ({ ...p, pincode: e.target.value }))} />
                      </div>
                      <div className="col-12">
                        <button type="button" className="btn btn-primary" onClick={handleAddAddress}>
                          Save Address
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="card mb-4" style={{ borderRadius: 'var(--radius-lg)' }}>
              <div className="card-header" style={{ background: 'linear-gradient(135deg, var(--primary-light-lavender) 0%, var(--primary-soft-mint) 100%)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', padding: '1rem' }}>
                <h5 style={{ color: 'var(--spiritual-purple)', marginBottom: 0, fontWeight: '600' }}>Payment Method</h5>
              </div>
              <div className="card-body">
                {[
                  { value: 'cod', label: 'Cash on Delivery', icon: '💵' },
                  { value: 'razorpay', label: 'Razorpay (UPI / Cards / NetBanking)', icon: '💳' },
                  { value: 'stripe', label: 'Stripe (International Cards)', icon: '🌐' },
                ].map(method => (
                  <div key={method.value} className="form-check mb-2">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="paymentMethod"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label className="form-check-label">
                      {method.icon} {method.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="form-label" style={{ fontWeight: '600' }}>Order Notes (optional)</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Any special instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={placing || !selectedAddress}
              className="btn btn-primary w-100"
              style={{ borderRadius: 'var(--radius-md)', padding: '0.75rem', fontSize: '1rem', fontWeight: '600' }}
            >
              {placing ? 'Processing...' : `Place Order — ₹${grandTotal.toFixed(0)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="summary-card">
            <h5 style={{ color: 'var(--spiritual-purple)', marginBottom: '1.5rem', fontWeight: '600' }}>Order Summary</h5>

            {items.map(item => {
              const product = item.product_detail || {};
              return (
                <div key={item.id} className="mb-2 pb-2" style={{ borderBottom: '1px solid var(--accent-lavender)' }}>
                  <div className="d-flex justify-content-between" style={{ fontSize: '0.9rem' }}>
                    <span>{product.name || 'Product'}</span>
                    <span>₹{parseFloat(item.subtotal || 0).toFixed(0)}</span>
                  </div>
                  <small style={{ color: 'var(--text-light)' }}>Qty: {item.quantity}</small>
                </div>
              );
            })}

            <hr />
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span>₹{totalPrice.toFixed(0)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span>Shipping:</span>
              <span>{shippingCost === 0 ? <span style={{ color: 'var(--accent-sage)', fontWeight: '600' }}>FREE</span> : `₹${shippingCost}`}</span>
            </div>
            <div className="summary-total">
              <span>Total:</span>
              <span>₹{grandTotal.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
