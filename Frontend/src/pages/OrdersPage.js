import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiDownload, FiChevronDown, FiChevronUp, FiXCircle } from 'react-icons/fi';
import { orderAPI } from '../services/api';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await orderAPI.getAll();
      setOrders(res.data?.results || res.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusColor = (status) => {
    const map = {
      pending: '#f0ad4e',
      confirmed: '#5bc0de',
      processing: '#5bc0de',
      shipped: '#0275d8',
      delivered: '#5cb85c',
      cancelled: '#d9534f',
      refunded: '#868e96',
    };
    return map[status] || 'var(--text-light)';
  };

  const getPaymentBadge = (paymentStatus) => {
    const map = {
      pending: { bg: '#f0ad4e', text: 'Payment Pending' },
      completed: { bg: '#5cb85c', text: 'Paid' },
      failed: { bg: '#d9534f', text: 'Failed' },
      refunded: { bg: '#868e96', text: 'Refunded' },
    };
    return map[paymentStatus] || { bg: '#868e96', text: paymentStatus };
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const res = await orderAPI.downloadInvoice(orderId);
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${orderId.substring(0, 8)}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download invoice.');
    }
  };

  const canCancelOrder = (order) => {
    if (['cancelled', 'delivered', 'refunded', 'shipped', 'out_for_delivery'].includes(order.status)) return false;
    const hoursSinceOrder = (Date.now() - new Date(order.created_at).getTime()) / (1000 * 60 * 60);
    return hoursSinceOrder <= 24;
  };

  const getTimeRemaining = (order) => {
    const msRemaining = 24 * 60 * 60 * 1000 - (Date.now() - new Date(order.created_at).getTime());
    if (msRemaining <= 0) return null;
    const hours = Math.floor(msRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleCancelOrder = async (orderId) => {
    setCancellingOrder(orderId);
    try {
      await orderAPI.cancelOrder(orderId, cancelReason);
      setShowCancelModal(null);
      setCancelReason('');
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to cancel order.');
    } finally {
      setCancellingOrder(null);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" style={{ color: 'var(--spiritual-teal)' }} />
        <p className="mt-3">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 style={{ color: 'var(--spiritual-purple)', marginBottom: '2rem' }}>My Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-state">
          <FiPackage style={{ fontSize: '3rem', color: 'var(--spiritual-teal)', marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--spiritual-purple)', marginBottom: '1rem' }}>No Orders Yet</h3>
          <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
            Start your spiritual journey by exploring our collection.
          </p>
          <Link to="/products" className="btn btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {orders.map(order => {
            const isExpanded = expandedOrder === order.order_id;
            const payBadge = getPaymentBadge(order.payment_status);
            return (
              <div key={order.order_id} className="card" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                {/* Order Header */}
                <div
                  className="card-body"
                  style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #eee8b218 0%, #96cdb015 100%)' }}
                  onClick={() => setExpandedOrder(isExpanded ? null : order.order_id)}
                >
                  <div className="row align-items-center">
                    <div className="col-md-3">
                      <small style={{ color: 'var(--text-light)' }}>Order ID</small>
                      <div style={{ fontWeight: '600', color: 'var(--spiritual-purple)', fontSize: '0.9rem' }}>
                        #{order.order_id?.substring(0, 8)}
                      </div>
                    </div>
                    <div className="col-md-2">
                      <small style={{ color: 'var(--text-light)' }}>Date</small>
                      <div style={{ fontSize: '0.9rem' }}>{new Date(order.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="col-md-2">
                      <small style={{ color: 'var(--text-light)' }}>Items</small>
                      <div style={{ fontSize: '0.9rem' }}>{order.items?.length || 0}</div>
                    </div>
                    <div className="col-md-2">
                      <span className="badge" style={{ backgroundColor: getStatusColor(order.status), color: '#fff', padding: '0.4rem 0.7rem', textTransform: 'capitalize' }}>
                        {order.status}
                      </span>
                      <br />
                      <span className="badge mt-1" style={{ backgroundColor: payBadge.bg, color: '#fff', padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}>
                        {payBadge.text}
                      </span>
                    </div>
                    <div className="col-md-2">
                      <small style={{ color: 'var(--text-light)' }}>Total</small>
                      <div style={{ fontWeight: '700', color: 'var(--spiritual-gold)', fontSize: '1.1rem' }}>
                        ₹{parseFloat(order.total || 0).toFixed(0)}
                      </div>
                    </div>
                    <div className="col-md-1 text-end">
                      {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="card-body" style={{ borderTop: '1px solid var(--accent-lavender)' }}>
                    {/* Shipping */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <h6 style={{ fontWeight: '600', color: 'var(--spiritual-purple)' }}>Shipping Address</h6>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.2rem' }}>
                          {order.shipping_full_name}
                        </p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.2rem' }}>
                          {order.shipping_address_line1}
                          {order.shipping_address_line2 && `, ${order.shipping_address_line2}`}
                        </p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: 0 }}>
                          {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h6 style={{ fontWeight: '600', color: 'var(--spiritual-purple)' }}>Summary</h6>
                        <div style={{ fontSize: '0.9rem' }}>
                          <div className="d-flex justify-content-between"><span>Subtotal:</span><span>₹{parseFloat(order.subtotal || 0).toFixed(0)}</span></div>
                          <div className="d-flex justify-content-between"><span>Shipping:</span><span>₹{parseFloat(order.shipping_charge || 0).toFixed(0)}</span></div>
                          {parseFloat(order.discount || 0) > 0 && (
                            <div className="d-flex justify-content-between text-success"><span>Discount:</span><span>-₹{parseFloat(order.discount).toFixed(0)}</span></div>
                          )}
                          <hr className="my-1" />
                          <div className="d-flex justify-content-between" style={{ fontWeight: '700' }}>
                            <span>Total:</span><span>₹{parseFloat(order.total || 0).toFixed(0)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <h6 style={{ fontWeight: '600', color: 'var(--spiritual-purple)', marginBottom: '0.5rem' }}>Items</h6>
                    <div className="table-responsive">
                      <table className="table table-sm" style={{ fontSize: '0.9rem' }}>
                        <thead>
                          <tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th></tr>
                        </thead>
                        <tbody>
                          {(order.items || []).map(item => (
                            <tr key={item.id}>
                              <td>{item.product_name}</td>
                              <td>₹{parseFloat(item.product_price || 0).toFixed(0)}</td>
                              <td>{item.quantity}</td>
                              <td>₹{parseFloat(item.subtotal || 0).toFixed(0)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Tracking & Status History */}
                    {order.tracking_number && (
                      <p style={{ fontSize: '0.9rem' }}>
                        <strong>Tracking:</strong> {order.tracking_number}
                      </p>
                    )}
                    {order.status_history?.length > 0 && (
                      <div className="mt-2">
                        <h6 style={{ fontWeight: '600', color: 'var(--spiritual-purple)' }}>Status Timeline</h6>
                        <div className="d-flex flex-column gap-1">
                          {order.status_history.map((sh, idx) => (
                            <small key={idx} style={{ color: 'var(--text-light)' }}>
                              <span className="badge me-1" style={{ backgroundColor: getStatusColor(sh.status), color: '#fff', textTransform: 'capitalize' }}>{sh.status}</span>
                              {sh.note && <span className="me-2">{sh.note}</span>}
                              <span>{new Date(sh.created_at).toLocaleString()}</span>
                            </small>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-3 d-flex gap-2 flex-wrap align-items-center">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        style={{ borderRadius: 'var(--radius-md)' }}
                        onClick={() => handleDownloadInvoice(order.order_id)}
                      >
                        <FiDownload className="me-1" /> Download Invoice
                      </button>

                      {canCancelOrder(order) && (
                        <button
                          className="btn btn-sm"
                          style={{
                            borderRadius: 'var(--radius-md)',
                            background: '#c44536',
                            color: '#fff',
                            border: 'none',
                          }}
                          onClick={() => setShowCancelModal(order.order_id)}
                        >
                          <FiXCircle className="me-1" /> Cancel Order
                        </button>
                      )}

                      {canCancelOrder(order) && (
                        <small style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>
                          Cancel window: {getTimeRemaining(order)} remaining
                        </small>
                      )}
                    </div>

                    {/* Cancel Modal */}
                    {showCancelModal === order.order_id && (
                      <div className="mt-3 p-3" style={{ background: 'var(--primary-soft-rose)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--danger)' }}>
                        <h6 style={{ color: 'var(--danger)', fontWeight: '600', marginBottom: '0.75rem' }}>
                          <FiXCircle className="me-1" /> Cancel This Order?
                        </h6>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-medium)', marginBottom: '0.75rem' }}>
                          This action cannot be undone. The admin will process your refund after cancellation.
                        </p>
                        <textarea
                          className="form-control mb-2"
                          rows="2"
                          placeholder="Reason for cancellation (optional)"
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          style={{ fontSize: '0.9rem' }}
                        />
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm"
                            style={{ background: '#c44536', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)' }}
                            disabled={cancellingOrder === order.order_id}
                            onClick={() => handleCancelOrder(order.order_id)}
                          >
                            {cancellingOrder === order.order_id ? 'Cancelling...' : 'Confirm Cancellation'}
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            style={{ borderRadius: 'var(--radius-md)' }}
                            onClick={() => { setShowCancelModal(null); setCancelReason(''); }}
                          >
                            Keep Order
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
