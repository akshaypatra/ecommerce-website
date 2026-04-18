import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiCheck, FiX, FiUpload } from 'react-icons/fi';
import adminAPI from '../../services/adminApi';

export default function AdminProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterCat, setFilterCat] = useState(searchParams.get('category') || '');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [form, setForm] = useState({
    name: '', description: '', category: '', price: '', discount_price: '',
    stock: 0, sku: '', is_active: true, is_featured: false,
  });

  // Sync state to URL params
  useEffect(() => {
    const params = {};
    if (page > 1) params.page = page;
    if (search) params.search = search;
    if (filterCat) params.category = filterCat;
    setSearchParams(params, { replace: true });
  }, [page, search, filterCat, setSearchParams]);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = { page, search, page_size: 20 };
    if (filterCat) params.category = filterCat;
    adminAPI.getProducts(params)
      .then(res => {
        setProducts(res.data.results || res.data);
        setTotalPages(Math.ceil((res.data.count || res.data.length) / 20));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, search, filterCat]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => {
    adminAPI.getCategories({ page_size: 100 }).then(res => setCategories(res.data.results || res.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      if (form.category) formData.append('category', form.category);
      formData.append('price', form.price);
      if (form.discount_price) formData.append('discount_price', form.discount_price);
      formData.append('stock', form.stock);
      if (form.sku) formData.append('sku', form.sku);
      formData.append('is_active', form.is_active);
      formData.append('is_featured', form.is_featured);
      imageFiles.forEach(file => formData.append('images', file));

      if (editItem) {
        await adminAPI.updateProduct(editItem.id, formData);
      } else {
        await adminAPI.createProduct(formData);
      }
      setShowModal(false);
      setEditItem(null);
      setImageFiles([]);
      setImagePreviews([]);
      fetchProducts();
    } catch (err) {
      alert(JSON.stringify(err.response?.data || 'Error'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await adminAPI.deleteProduct(id);
    fetchProducts();
  };

  const openEdit = (p) => {
    setEditItem(p);
    setForm({
      name: p.name, description: p.description, category: p.category || '',
      price: p.price, discount_price: p.discount_price || '',
      stock: p.stock, sku: p.sku || '', is_active: p.is_active, is_featured: p.is_featured,
    });
    setImageFiles([]);
    setImagePreviews([]);
    setShowModal(true);
  };

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: '', description: '', category: '', price: '', discount_price: '', stock: 0, sku: '', is_active: true, is_featured: false });
    setImageFiles([]);
    setImagePreviews([]);
    setShowModal(true);
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <div>
      <div className="admin-toolbar">
        <div className="admin-search-box">
          <FiSearch size={16} />
          <input placeholder="Search products..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div className="admin-toolbar-actions">
          <select value={filterCat} onChange={e => { setFilterCat(e.target.value); setPage(1); }} className="admin-select">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button className="admin-btn admin-btn-primary" onClick={openCreate}>
            <FiPlus size={16} /> Add Product
          </button>
        </div>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal admin-modal-lg" onClick={e => e.stopPropagation()}>
            <h3>{editItem ? 'Edit Product' : 'Create Product'}</h3>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-grid">
                <label>Name *<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
                <label>SKU<input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} /></label>
                <label>Price *<input type="number" step="0.01" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></label>
                <label>Discount Price<input type="number" step="0.01" value={form.discount_price} onChange={e => setForm({ ...form, discount_price: e.target.value })} /></label>
                <label>Stock<input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} /></label>
                <label>Category
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option value="">None</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </label>
              </div>
              <label>Description *<textarea rows={4} required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
              <label>Product Images
                <div className="admin-file-upload">
                  <label className="admin-file-btn">
                    <FiUpload size={14} /> Choose Images
                    <input type="file" accept="image/*" multiple onChange={handleImageSelect} style={{ display: 'none' }} />
                  </label>
                  <span className="admin-text-muted" style={{ fontSize: '0.8rem' }}>{imageFiles.length} file(s) selected</span>
                </div>
              </label>
              {imagePreviews.length > 0 && (
                <div className="admin-image-preview-grid">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="admin-image-preview">
                      <img src={src} alt={`Preview ${i + 1}`} />
                      <button type="button" className="admin-image-remove" onClick={() => removeImage(i)}><FiX size={12} /></button>
                    </div>
                  ))}
                </div>
              )}
              {editItem && editItem.images && editItem.images.length > 0 && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#8e8ea0' }}>Existing images:</span>
                  <div className="admin-image-preview-grid">
                    {editItem.images.map(img => (
                      <div key={img.id} className="admin-image-preview">
                        <img src={img.image} alt={img.alt_text || 'Product'} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="admin-form-checks">
                <label className="admin-check"><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
                <label className="admin-check"><input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} /> Featured</label>
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
                  <th>Category</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Active</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td><Link to={`/admin/products/${p.id}`} className="admin-link">{p.name}</Link></td>
                    <td>{p.category_name || '—'}</td>
                    <td>₹{Number(p.price).toLocaleString('en-IN')}</td>
                    <td>{p.discount_price ? `₹${Number(p.discount_price).toLocaleString('en-IN')}` : '—'}</td>
                    <td><span className={p.stock <= 5 ? 'admin-text-danger' : ''}>{p.stock}</span></td>
                    <td>{p.average_rating || '—'} ({p.reviews_count})</td>
                    <td>
                      <button className={`admin-toggle ${p.is_active ? 'on' : ''}`} onClick={async () => { await adminAPI.toggleProductActive(p.id); fetchProducts(); }}>
                        {p.is_active ? <FiCheck size={14} /> : <FiX size={14} />}
                      </button>
                    </td>
                    <td>
                      <button className={`admin-toggle ${p.is_featured ? 'on' : ''}`} onClick={async () => { await adminAPI.toggleProductFeatured(p.id); fetchProducts(); }}>
                        {p.is_featured ? <FiCheck size={14} /> : <FiX size={14} />}
                      </button>
                    </td>
                    <td>
                      <div className="admin-action-btns">
                        <button className="admin-icon-btn" title="Edit" onClick={() => openEdit(p)}><FiEdit2 size={14} /></button>
                        <button className="admin-icon-btn danger" title="Delete" onClick={() => handleDelete(p.id)}><FiTrash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && <tr><td colSpan={10} className="admin-empty">No products found</td></tr>}
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
