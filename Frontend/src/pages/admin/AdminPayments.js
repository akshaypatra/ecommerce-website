import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import adminAPI from '../../services/adminApi';

export default function AdminPayments() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [gateway, setGateway] = useState(searchParams.get('gateway') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');

  // Sync state to URL params
  useEffect(() => {
    const params = {};
    if (page > 1) params.page = page;
    if (search) params.search = search;
    if (gateway) params.gateway = gateway;
    if (status) params.status = status;
    setSearchParams(params, { replace: true });
  }, [page, search, gateway, status, setSearchParams]);

  const fetchPayments = useCallback(() => {
    setLoading(true);
    const params = { page, search, page_size: 20 };
    if (gateway) params.gateway = gateway;
    if (status) params.status = status;
    adminAPI.getPayments(params)
      .then(res => {
        setPayments(res.data.results || res.data);
        setTotalPages(Math.ceil((res.data.count || res.data.length) / 20));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, search, gateway, status]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  return (
    <div>
      <div className="admin-toolbar">
        <div className="admin-search-box">
          <FiSearch size={16} />
          <input placeholder="Search payments..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div className="admin-toolbar-actions">
          <select value={gateway} onChange={e => { setGateway(e.target.value); setPage(1); }} className="admin-select">
            <option value="">All Gateways</option>
            <option value="razorpay">Razorpay</option>
            <option value="stripe">Stripe</option>
            <option value="cod">COD</option>
          </select>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="admin-select">
            <option value="">All Statuses</option>
            <option value="created">Created</option>
            <option value="pending">Pending</option>
            <option value="captured">Captured</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          {loading ? <div className="admin-loading">Loading...</div> : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Gateway</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Gateway Order ID</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td className="admin-link">{p.order_id_display?.slice(0, 8)}...</td>
                    <td>{p.user_email}</td>
                    <td><span className="admin-badge">{p.gateway}</span></td>
                    <td><span className={`admin-badge admin-badge-${p.status}`}>{p.status}</span></td>
                    <td>₹{Number(p.amount).toLocaleString('en-IN')}</td>
                    <td>{p.currency}</td>
                    <td className="admin-text-muted">{p.gateway_order_id || '—'}</td>
                    <td>{new Date(p.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {payments.length === 0 && <tr><td colSpan={9} className="admin-empty">No payments found</td></tr>}
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
