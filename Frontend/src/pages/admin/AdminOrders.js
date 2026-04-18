import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import adminAPI from '../../services/adminApi';

export default function AdminOrders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [paymentFilter, setPaymentFilter] = useState(searchParams.get('payment_status') || '');

  // Sync state to URL params
  useEffect(() => {
    const params = {};
    if (page > 1) params.page = page;
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    if (paymentFilter) params.payment_status = paymentFilter;
    setSearchParams(params, { replace: true });
  }, [page, search, statusFilter, paymentFilter, setSearchParams]);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    const params = { page, search, page_size: 20 };
    if (statusFilter) params.status = statusFilter;
    if (paymentFilter) params.payment_status = paymentFilter;
    adminAPI.getOrders(params)
      .then(res => {
        setOrders(res.data.results || res.data);
        setTotalPages(Math.ceil((res.data.count || res.data.length) / 20));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, search, statusFilter, paymentFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'];
  const paymentOptions = ['pending', 'paid', 'failed', 'refunded'];

  return (
    <div>
      <div className="admin-toolbar">
        <div className="admin-search-box">
          <FiSearch size={16} />
          <input placeholder="Search orders..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div className="admin-toolbar-actions">
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="admin-select">
            <option value="">All Statuses</option>
            {statusOptions.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
          <select value={paymentFilter} onChange={e => { setPaymentFilter(e.target.value); setPage(1); }} className="admin-select">
            <option value="">All Payments</option>
            {paymentOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          {loading ? <div className="admin-loading">Loading...</div> : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Method</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>City</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td><Link to={`/admin/orders/${o.id}`} className="admin-link">{o.order_id?.slice(0, 8)}...</Link></td>
                    <td>{o.user_email}</td>
                    <td><span className={`admin-badge admin-badge-${o.status}`}>{o.status.replace(/_/g, ' ')}</span></td>
                    <td><span className={`admin-badge admin-badge-${o.payment_status}`}>{o.payment_status}</span></td>
                    <td>{o.payment_method || '—'}</td>
                    <td>{o.items_count}</td>
                    <td>₹{Number(o.total).toLocaleString('en-IN')}</td>
                    <td>{o.shipping_city}</td>
                    <td>{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td colSpan={9} className="admin-empty">No orders found</td></tr>}
              </tbody>
            </table>
          )}
        </div>
        {totalPages > 1 && (
          <div className="admin-pagination">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="admin-btn">Previous</button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="admin-btn">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
