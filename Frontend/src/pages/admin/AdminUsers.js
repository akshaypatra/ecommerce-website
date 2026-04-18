import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiCheck, FiX } from 'react-icons/fi';
import adminAPI from '../../services/adminApi';

export default function AdminUsers() {
  const [searchParams, setSearchParams] = useSearchParams();
  // eslint-disable-next-line 
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ email: '', first_name: '', last_name: '', phone: '', password: '', is_staff: false, is_active: true });

  // Sync state to URL params
  useEffect(() => {
    const params = {};
    if (page > 1) params.page = page;
    if (search) params.search = search;
    setSearchParams(params, { replace: true });
  }, [page, search, setSearchParams]);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    adminAPI.getUsers({ page, search, page_size: 20, ...filters })
      .then(res => {
        setUsers(res.data.results || res.data);
        setTotalPages(Math.ceil((res.data.count || res.data.length) / 20));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, search, filters]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    await adminAPI.deleteUser(id);
    fetchUsers();
  };

  const handleToggleActive = async (id) => {
    await adminAPI.toggleUserActive(id);
    fetchUsers();
  };

  const handleToggleStaff = async (id) => {
    await adminAPI.toggleUserStaff(id);
    fetchUsers();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editUser) {
        const { password, ...data } = form;
        await adminAPI.updateUser(editUser.id, data);
      } else {
        await adminAPI.createUser(form);
      }
      setShowCreate(false);
      setEditUser(null);
      setForm({ email: '', first_name: '', last_name: '', phone: '', password: '', is_staff: false, is_active: true });
      fetchUsers();
    } catch (err) {
      alert(JSON.stringify(err.response?.data || 'Error'));
    }
  };

  const openEdit = (user) => {
    setEditUser(user);
    setForm({ email: user.email, first_name: user.first_name, last_name: user.last_name, phone: user.phone || '', is_staff: user.is_staff, is_active: user.is_active });
    setShowCreate(true);
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-search-box">
          <FiSearch size={16} />
          <input
            placeholder="Search users..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="admin-toolbar-actions">
          <select onChange={e => { setFilters(e.target.value ? { is_staff: e.target.value } : {}); setPage(1); }} className="admin-select">
            <option value="">All Users</option>
            <option value="true">Staff Only</option>
            <option value="false">Non-Staff</option>
          </select>
          <button className="admin-btn admin-btn-primary" onClick={() => { setEditUser(null); setForm({ email: '', first_name: '', last_name: '', phone: '', password: '', is_staff: false, is_active: true }); setShowCreate(true); }}>
            <FiPlus size={16} /> Add User
          </button>
        </div>
      </div>

      {/* Modal */}
      {showCreate && (
        <div className="admin-modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>{editUser ? 'Edit User' : 'Create User'}</h3>
            <form onSubmit={handleSubmit} className="admin-form">
              <label>Email *<input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
              {!editUser && <label>Password *<input type="password" required minLength={8} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></label>}
              <label>First Name<input value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} /></label>
              <label>Last Name<input value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} /></label>
              <label>Phone<input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></label>
              <div className="admin-form-checks">
                <label className="admin-check"><input type="checkbox" checked={form.is_staff} onChange={e => setForm({ ...form, is_staff: e.target.checked })} /> Staff</label>
                <label className="admin-check"><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
              </div>
              <div className="admin-form-actions">
                <button type="button" className="admin-btn" onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">{editUser ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="admin-card">
        <div className="admin-table-wrap">
          {loading ? <div className="admin-loading">Loading...</div> : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Staff</th>
                  <th>Active</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td><Link to={`/admin/users/${u.id}`} className="admin-link">{u.email}</Link></td>
                    <td>{u.full_name || '—'}</td>
                    <td>{u.phone || '—'}</td>
                    <td>
                      <button className={`admin-toggle ${u.is_staff ? 'on' : ''}`} onClick={() => handleToggleStaff(u.id)} title="Toggle staff">
                        {u.is_staff ? <FiCheck size={14} /> : <FiX size={14} />}
                      </button>
                    </td>
                    <td>
                      <button className={`admin-toggle ${u.is_active ? 'on' : ''}`} onClick={() => handleToggleActive(u.id)} title="Toggle active">
                        {u.is_active ? <FiCheck size={14} /> : <FiX size={14} />}
                      </button>
                    </td>
                    <td>{new Date(u.date_joined).toLocaleDateString()}</td>
                    <td>
                      <div className="admin-action-btns">
                        <button className="admin-icon-btn" title="Edit" onClick={() => openEdit(u)}><FiEdit2 size={14} /></button>
                        <button className="admin-icon-btn danger" title="Delete" onClick={() => handleDelete(u.id)}><FiTrash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && <tr><td colSpan={8} className="admin-empty">No users found</td></tr>}
              </tbody>
            </table>
          )}
        </div>
        {/* Pagination */}
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
