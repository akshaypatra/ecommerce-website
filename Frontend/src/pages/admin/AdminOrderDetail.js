import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import adminAPI from '../../services/adminApi';

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [reverting, setReverting] = useState(false);

  const fetchOrder = useCallback(() => {
    setLoading(true);
    adminAPI.getOrder(id)
      .then(res => { setOrder(res.data); setNewStatus(res.data.status); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === order.status) return;
    setUpdating(true);
    try {
      await adminAPI.updateOrderStatus(id, newStatus, statusNote);
      setStatusNote('');
      fetchOrder();
    } catch (err) {
      alert(JSON.stringify(err.response?.data || 'Error'));
    } finally {
      setUpdating(false);
    }
  };

  const handleRevertPayment = async () => {
    if (!window.confirm(`Revert payment of ₹${Number(order.total).toLocaleString('en-IN')} for this cancelled order?`)) return;
    setReverting(true);
    try {
      await adminAPI.revertPayment(order.order_id);
      fetchOrder();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to revert payment.');
    } finally {
      setReverting(false);
    }
  };

  const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'];

  if (loading) return <div className="admin-loading">Loading...</div>;
  if (!order) return <div className="admin-error">Order not found</div>;

  return (
    <div>
      <div className="admin-detail-header">
        <Link to="/admin/orders" className="admin-back"><FiArrowLeft size={16} /> Back to Orders</Link>
      </div>

      {/* Order Info */}
      <div className="admin-card">
        <h3 className="admin-card-title">Order #{order.order_id}</h3>
        <div className="admin-detail-grid">
          <div className="admin-detail-item"><span className="admin-detail-label">Customer</span><span>{order.user_email}</span></div>
          <div className="admin-detail-item"><span className="admin-detail-label">Status</span><span className={`admin-badge admin-badge-${order.status}`}>{order.status.replace(/_/g, ' ')}</span></div>
          <div className="admin-detail-item"><span className="admin-detail-label">Payment Status</span><span className={`admin-badge admin-badge-${order.payment_status}`}>{order.payment_status}</span></div>
          <div className="admin-detail-item"><span className="admin-detail-label">Payment Method</span><span>{order.payment_method || '—'}</span></div>
          <div className="admin-detail-item"><span className="admin-detail-label">Subtotal</span><span>₹{Number(order.subtotal).toLocaleString('en-IN')}</span></div>
          <div className="admin-detail-item"><span className="admin-detail-label">Discount</span><span>₹{Number(order.discount).toLocaleString('en-IN')}</span></div>
          <div className="admin-detail-item"><span className="admin-detail-label">Shipping</span><span>₹{Number(order.shipping_charge).toLocaleString('en-IN')}</span></div>
          <div className="admin-detail-item"><span className="admin-detail-label">Total</span><span style={{ fontWeight: 700, fontSize: '1.1rem' }}>₹{Number(order.total).toLocaleString('en-IN')}</span></div>
          <div className="admin-detail-item"><span className="admin-detail-label">Tracking</span><span>{order.tracking_number || '—'}</span></div>
          <div className="admin-detail-item"><span className="admin-detail-label">Created</span><span>{new Date(order.created_at).toLocaleString()}</span></div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="admin-card" style={{ marginTop: '1rem' }}>
        <h3 className="admin-card-title">Shipping Address</h3>
        <div className="admin-detail-grid">
          <div className="admin-detail-item"><span className="admin-detail-label">Name</span><span>{order.shipping_full_name}</span></div>
          <div className="admin-detail-item"><span className="admin-detail-label">Phone</span><span>{order.shipping_phone}</span></div>
          <div className="admin-detail-item"><span className="admin-detail-label">Address</span><span>{order.shipping_address_line1}{order.shipping_address_line2 && `, ${order.shipping_address_line2}`}</span></div>
          <div className="admin-detail-item"><span className="admin-detail-label">City</span><span>{order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}</span></div>
          <div className="admin-detail-item"><span className="admin-detail-label">Country</span><span>{order.shipping_country}</span></div>
        </div>
      </div>

      {/* Update Status */}
      <div className="admin-card" style={{ marginTop: '1rem' }}>
        <h3 className="admin-card-title">Update Status</h3>
        <div className="admin-status-update">
          <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="admin-select">
            {statusOptions.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
          <input
            placeholder="Note (optional)"
            value={statusNote}
            onChange={e => setStatusNote(e.target.value)}
            className="admin-input"
          />
          <button
            className="admin-btn admin-btn-primary"
            onClick={handleStatusUpdate}
            disabled={updating || newStatus === order.status}
          >
            {updating ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </div>

      {/* Revert Payment — Only for cancelled orders with non-refunded payment */}
      {order.status === 'cancelled' && order.payment_status !== 'refunded' && (
        <div className="admin-card" style={{ marginTop: '1rem', border: '1px solid #c44536' }}>
          <h3 className="admin-card-title" style={{ color: '#c44536' }}>Revert Payment</h3>
          <p style={{ fontSize: '0.9rem', color: '#5c4033', marginBottom: '0.75rem' }}>
            This order was cancelled by the customer. Revert the payment of <strong>₹{Number(order.total).toLocaleString('en-IN')}</strong> to mark it as refunded.
          </p>
          <button
            className="admin-btn"
            style={{ background: '#c44536', color: '#fff', border: 'none' }}
            onClick={handleRevertPayment}
            disabled={reverting}
          >
            {reverting ? 'Processing Refund...' : 'Revert Payment / Mark Refunded'}
          </button>
        </div>
      )}

      {order.payment_status === 'refunded' && (
        <div className="admin-card" style={{ marginTop: '1rem', border: '1px solid #5a8a3c', background: 'rgba(90,138,60,0.05)' }}>
          <p style={{ color: '#5a8a3c', fontWeight: '600', margin: 0 }}>
            Payment has been refunded for this order.
          </p>
        </div>
      )}

      {/* Order Items */}
      <div className="admin-card" style={{ marginTop: '1rem' }}>
        <h3 className="admin-card-title">Order Items</h3>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map(item => (
                <tr key={item.id}>
                  <td>{item.product_name}</td>
                  <td>₹{Number(item.product_price).toLocaleString('en-IN')}</td>
                  <td>{item.quantity}</td>
                  <td>₹{Number(item.subtotal).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status History */}
      {order.status_history && order.status_history.length > 0 && (
        <div className="admin-card" style={{ marginTop: '1rem' }}>
          <h3 className="admin-card-title">Status History</h3>
          <div className="admin-timeline">
            {order.status_history.map((h, i) => (
              <div key={i} className="admin-timeline-item">
                <div className="admin-timeline-dot" />
                <div className="admin-timeline-content">
                  <span className={`admin-badge admin-badge-${h.status}`}>{h.status.replace(/_/g, ' ')}</span>
                  {h.note && <p className="admin-timeline-note">{h.note}</p>}
                  <small className="admin-text-muted">
                    {new Date(h.created_at).toLocaleString()}
                    {h.changed_by_email && ` by ${h.changed_by_email}`}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {order.notes && (
        <div className="admin-card" style={{ marginTop: '1rem' }}>
          <h3 className="admin-card-title">Customer Notes</h3>
          <p>{order.notes}</p>
        </div>
      )}
    </div>
  );
}
