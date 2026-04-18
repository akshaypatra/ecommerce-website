import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit2, FiTrash2 } from 'react-icons/fi';
import adminAPI from '../../services/adminApi';

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  const fetchUser = useCallback(() => {
    setLoading(true);
    adminAPI.getUser(id)
      .then(res => { setUser(res.data); setForm(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { email, first_name, last_name, phone, is_active, is_staff } = form;
      await adminAPI.updateUser(id, { email, first_name, last_name, phone, is_active, is_staff });
      setEditing(false);
      fetchUser();
    } catch (err) {
      alert(JSON.stringify(err.response?.data || 'Error'));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this user permanently?')) return;
    await adminAPI.deleteUser(id);
    navigate('/admin/users');
  };

  if (loading) return <div className="admin-loading">Loading...</div>;
  if (!user) return <div className="admin-error">User not found</div>;

  return (
    <div>
      <div className="admin-detail-header">
        <Link to="/admin/users" className="admin-back"><FiArrowLeft size={16} /> Back to Users</Link>
        <div className="admin-detail-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => setEditing(!editing)}>
            <FiEdit2 size={14} /> {editing ? 'Cancel' : 'Edit'}
          </button>
          <button className="admin-btn admin-btn-danger" onClick={handleDelete}>
            <FiTrash2 size={14} /> Delete
          </button>
        </div>
      </div>

      <div className="admin-card">
        {editing ? (
          <form onSubmit={handleUpdate} className="admin-form">
            <div className="admin-form-grid">
              <label>Email<input type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
              <label>First Name<input value={form.first_name || ''} onChange={e => setForm({ ...form, first_name: e.target.value })} /></label>
              <label>Last Name<input value={form.last_name || ''} onChange={e => setForm({ ...form, last_name: e.target.value })} /></label>
              <label>Phone<input value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} /></label>
            </div>
            <div className="admin-form-checks">
              <label className="admin-check"><input type="checkbox" checked={form.is_staff || false} onChange={e => setForm({ ...form, is_staff: e.target.checked })} /> Staff</label>
              <label className="admin-check"><input type="checkbox" checked={form.is_active || false} onChange={e => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
            </div>
            <div className="admin-form-actions">
              <button type="button" className="admin-btn" onClick={() => setEditing(false)}>Cancel</button>
              <button type="submit" className="admin-btn admin-btn-primary">Save Changes</button>
            </div>
          </form>
        ) : (
          <div className="admin-detail-grid">
            <div className="admin-detail-item"><span className="admin-detail-label">ID</span><span>{user.id}</span></div>
            <div className="admin-detail-item"><span className="admin-detail-label">Email</span><span>{user.email}</span></div>
            <div className="admin-detail-item"><span className="admin-detail-label">Name</span><span>{user.full_name || '—'}</span></div>
            <div className="admin-detail-item"><span className="admin-detail-label">Phone</span><span>{user.phone || '—'}</span></div>
            <div className="admin-detail-item"><span className="admin-detail-label">Staff</span><span>{user.is_staff ? 'Yes' : 'No'}</span></div>
            <div className="admin-detail-item"><span className="admin-detail-label">Active</span><span>{user.is_active ? 'Yes' : 'No'}</span></div>
            <div className="admin-detail-item"><span className="admin-detail-label">Superuser</span><span>{user.is_superuser ? 'Yes' : 'No'}</span></div>
            <div className="admin-detail-item"><span className="admin-detail-label">Joined</span><span>{new Date(user.date_joined).toLocaleString()}</span></div>
            <div className="admin-detail-item"><span className="admin-detail-label">Orders</span><span>{user.orders_count}</span></div>
          </div>
        )}
      </div>
    </div>
  );
}
