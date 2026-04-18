import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiTrash2, FiStar } from 'react-icons/fi';
import adminAPI from '../../services/adminApi';

export default function AdminReviews() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [ratingFilter, setRatingFilter] = useState(searchParams.get('rating') || '');

  // Sync state to URL params
  useEffect(() => {
    const params = {};
    if (page > 1) params.page = page;
    if (search) params.search = search;
    if (ratingFilter) params.rating = ratingFilter;
    setSearchParams(params, { replace: true });
  }, [page, search, ratingFilter, setSearchParams]);

  const fetchReviews = useCallback(() => {
    setLoading(true);
    const params = { page, search, page_size: 20 };
    if (ratingFilter) params.rating = ratingFilter;
    adminAPI.getReviews(params)
      .then(res => {
        setReviews(res.data.results || res.data);
        setTotalPages(Math.ceil((res.data.count || res.data.length) / 20));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, search, ratingFilter]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    await adminAPI.deleteReview(id);
    fetchReviews();
  };

  const renderStars = (rating) => (
    <span className="admin-stars">
      {[1, 2, 3, 4, 5].map(i => (
        <FiStar key={i} size={14} className={i <= rating ? 'filled' : ''} />
      ))}
    </span>
  );

  return (
    <div>
      <div className="admin-toolbar">
        <div className="admin-search-box">
          <FiSearch size={16} />
          <input placeholder="Search reviews..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select value={ratingFilter} onChange={e => { setRatingFilter(e.target.value); setPage(1); }} className="admin-select">
          <option value="">All Ratings</option>
          {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
        </select>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          {loading ? <div className="admin-loading">Loading...</div> : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>User</th>
                  <th>Rating</th>
                  <th>Title</th>
                  <th>Comment</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(r => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.product_name}</td>
                    <td>{r.user_email}</td>
                    <td>{renderStars(r.rating)}</td>
                    <td>{r.title || '—'}</td>
                    <td className="admin-text-truncate">{r.comment || '—'}</td>
                    <td>{new Date(r.created_at).toLocaleDateString()}</td>
                    <td>
                      <button className="admin-icon-btn danger" title="Delete" onClick={() => handleDelete(r.id)}>
                        <FiTrash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {reviews.length === 0 && <tr><td colSpan={8} className="admin-empty">No reviews found</td></tr>}
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
