import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import adminAPI from '../../services/adminApi';

export default function AdminAddresses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);

  // Sync state to URL params
  useEffect(() => {
    const params = {};
    if (page > 1) params.page = page;
    if (search) params.search = search;
    setSearchParams(params, { replace: true });
  }, [page, search, setSearchParams]);

  const fetch = useCallback(() => {
    setLoading(true);
    adminAPI.getAddresses({ page, search, page_size: 20 })
      .then(res => {
        setAddresses(res.data.results || res.data);
        setTotalPages(Math.ceil((res.data.count || res.data.length) / 20));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { fetch(); }, [fetch]);

  return (
    <div>
      <div className="admin-toolbar">
        <div className="admin-search-box">
          <FiSearch size={16} />
          <input placeholder="Search addresses..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          {loading ? <div className="admin-loading">Loading...</div> : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Pincode</th>
                  <th>Default</th>
                </tr>
              </thead>
              <tbody>
                {addresses.map(a => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.user_email}</td>
                    <td>{a.full_name}</td>
                    <td><span className="admin-badge">{a.address_type}</span></td>
                    <td>{a.city}</td>
                    <td>{a.state}</td>
                    <td>{a.pincode}</td>
                    <td>{a.is_default ? '✓' : '—'}</td>
                  </tr>
                ))}
                {addresses.length === 0 && <tr><td colSpan={8} className="admin-empty">No addresses found</td></tr>}
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
