import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiUpload, FiX } from 'react-icons/fi';
import adminAPI from '../../services/adminApi';

export default function AdminCategories() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', is_active: true, parent: '' });

  // Sync state to URL params
  useEffect(() => {
    const params = {};
    if (page > 1) params.page = page;
    if (search) params.search = search;
    setSearchParams(params, { replace: true });
  }, [page, search, setSearchParams]);

  const fetchData = useCallback(() => {
    setLoading(true);
    adminAPI.getCategories({ page, search, page_size: 20 })
      .then(res => {
        setCategories(res.data.results || res.data);
        setTotalPages(Math.ceil((res.data.count || res.data.length) / 20));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      if (form.description) formData.append('description', form.description);
      formData.append('is_active', form.is_active);
      if (form.parent) formData.append('parent', form.parent);
      if (imageFile) formData.append('image', imageFile);

      if (editItem) {
        await adminAPI.updateCategory(editItem.id, formData);
      } else {
        await adminAPI.createCategory(formData);
      }
      setShowModal(false);
      setEditItem(null);
      setImageFile(null);
      setImagePreview(null);
      fetchData();
    } catch (err) {
      alert(JSON.stringify(err.response?.data || 'Error'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await adminAPI.deleteCategory(id);
    fetchData();
  };

  const openEdit = (cat) => {
    setEditItem(cat);
    setForm({ name: cat.name, description: cat.description || '', is_active: cat.is_active, parent: cat.parent || '' });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: '', description: '', is_active: true, parent: '' });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <div className="admin-toolbar">
        <div className="admin-search-box">
          <FiSearch size={16} />
          <input placeholder="Search categories..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <button className="admin-btn admin-btn-primary" onClick={openCreate}>
          <FiPlus size={16} /> Add Category
        </button>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>{editItem ? 'Edit Category' : 'Create Category'}</h3>
            <form onSubmit={handleSubmit} className="admin-form">
              <label>Name *<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
              <label>Description<textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
              <label>Parent Category
                <select value={form.parent} onChange={e => setForm({ ...form, parent: e.target.value })}>
                  <option value="">None (Top Level)</option>
                  {categories.filter(c => !editItem || c.id !== editItem.id).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </label>
              <label>Category Image
                <div className="admin-file-upload">
                  <label className="admin-file-btn">
                    <FiUpload size={14} /> Choose Image
                    <input type="file" accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} />
                  </label>
                  <span className="admin-text-muted" style={{ fontSize: '0.8rem' }}>{imageFile ? imageFile.name : 'No file chosen'}</span>
                </div>
              </label>
              {(imagePreview || (editItem && editItem.image)) && (
                <div className="admin-image-preview-grid" style={{ marginBottom: '0.75rem' }}>
                  {imagePreview && (
                    <div className="admin-image-preview">
                      <img src={imagePreview} alt="New" />
                      <button type="button" className="admin-image-remove" onClick={() => { setImageFile(null); setImagePreview(null); }}><FiX size={12} /></button>
                    </div>
                  )}
                  {!imagePreview && editItem && editItem.image && (
                    <div className="admin-image-preview">
                      <img src={editItem.image} alt="Current" />
                      <span style={{ fontSize: '0.65rem', color: '#8e8ea0', textAlign: 'center', display: 'block' }}>Current</span>
                    </div>
                  )}
                </div>
              )}
              <div className="admin-form-checks">
                <label className="admin-check"><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
              </div>
              <div className="admin-form-actions">
                <button type="button" className="admin-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">{editItem ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-table-wrap">
          {loading ? <div className="admin-loading">Loading...</div> : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Parent</th>
                  <th>Products</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td><strong>{c.name}</strong></td>
                    <td className="admin-text-muted">{c.slug}</td>
                    <td>{c.parent_name || '—'}</td>
                    <td>{c.products_count}</td>
                    <td><span className={`admin-badge admin-badge-${c.is_active ? 'active' : 'inactive'}`}>{c.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div className="admin-action-btns">
                        <button className="admin-icon-btn" title="Edit" onClick={() => openEdit(c)}><FiEdit2 size={14} /></button>
                        <button className="admin-icon-btn danger" title="Delete" onClick={() => handleDelete(c.id)}><FiTrash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && <tr><td colSpan={7} className="admin-empty">No categories found</td></tr>}
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
