import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit2, FiTrash2 } from 'react-icons/fi';
import adminAPI from '../../services/adminApi';

export default function AdminProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  const fetchProduct = useCallback(() => {
    setLoading(true);
    adminAPI.getProduct(id)
      .then(res => { setProduct(res.data); setForm(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { fetchProduct(); }, [fetchProduct]);
  useEffect(() => {
    adminAPI.getCategories({ page_size: 100 }).then(res => setCategories(res.data.results || res.data)).catch(() => {});
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { name, description, category, price, discount_price, stock, sku, is_active, is_featured } = form;
      await adminAPI.updateProduct(id, {
        name, description, category: category || null,
        price, discount_price: discount_price || null,
        stock, sku, is_active, is_featured,
      });
      setEditing(false);
      fetchProduct();
    } catch (err) {
      alert(JSON.stringify(err.response?.data || 'Error'));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this product permanently?')) return;
    await adminAPI.deleteProduct(id);
    navigate('/admin/products');
  };

  if (loading) return <div className="admin-loading">Loading...</div>;
  if (!product) return <div className="admin-error">Product not found</div>;

  return (
    <div>
      <div className="admin-detail-header">
        <Link to="/admin/products" className="admin-back"><FiArrowLeft size={16} /> Back to Products</Link>
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
              <label>Name<input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
              <label>SKU<input value={form.sku || ''} onChange={e => setForm({ ...form, sku: e.target.value })} /></label>
              <label>Price<input type="number" step="0.01" value={form.price || ''} onChange={e => setForm({ ...form, price: e.target.value })} /></label>
              <label>Discount Price<input type="number" step="0.01" value={form.discount_price || ''} onChange={e => setForm({ ...form, discount_price: e.target.value })} /></label>
              <label>Stock<input type="number" value={form.stock || 0} onChange={e => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} /></label>
              <label>Category
                <select value={form.category || ''} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="">None</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
            </div>
            <label>Description<textarea rows={4} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
            <div className="admin-form-checks">
              <label className="admin-check"><input type="checkbox" checked={form.is_active || false} onChange={e => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
              <label className="admin-check"><input type="checkbox" checked={form.is_featured || false} onChange={e => setForm({ ...form, is_featured: e.target.checked })} /> Featured</label>
            </div>
            <div className="admin-form-actions">
              <button type="button" className="admin-btn" onClick={() => setEditing(false)}>Cancel</button>
              <button type="submit" className="admin-btn admin-btn-primary">Save Changes</button>
            </div>
          </form>
        ) : (
          <>
            <div className="admin-detail-grid">
              <div className="admin-detail-item"><span className="admin-detail-label">ID</span><span>{product.id}</span></div>
              <div className="admin-detail-item"><span className="admin-detail-label">Name</span><span>{product.name}</span></div>
              <div className="admin-detail-item"><span className="admin-detail-label">SKU</span><span>{product.sku || '—'}</span></div>
              <div className="admin-detail-item"><span className="admin-detail-label">Category</span><span>{product.category_name || '—'}</span></div>
              <div className="admin-detail-item"><span className="admin-detail-label">Price</span><span>₹{Number(product.price).toLocaleString('en-IN')}</span></div>
              <div className="admin-detail-item"><span className="admin-detail-label">Discount Price</span><span>{product.discount_price ? `₹${Number(product.discount_price).toLocaleString('en-IN')}` : '—'}</span></div>
              <div className="admin-detail-item"><span className="admin-detail-label">Effective Price</span><span>₹{Number(product.effective_price).toLocaleString('en-IN')}</span></div>
              <div className="admin-detail-item"><span className="admin-detail-label">Stock</span><span>{product.stock}</span></div>
              <div className="admin-detail-item"><span className="admin-detail-label">Rating</span><span>{product.average_rating} ({product.reviews_count} reviews)</span></div>
              <div className="admin-detail-item"><span className="admin-detail-label">Active</span><span>{product.is_active ? 'Yes' : 'No'}</span></div>
              <div className="admin-detail-item"><span className="admin-detail-label">Featured</span><span>{product.is_featured ? 'Yes' : 'No'}</span></div>
              <div className="admin-detail-item"><span className="admin-detail-label">Created</span><span>{new Date(product.created_at).toLocaleString()}</span></div>
            </div>
            <div className="admin-detail-desc">
              <h4>Description</h4>
              <p>{product.description}</p>
            </div>
            {product.images && product.images.length > 0 && (
              <div className="admin-detail-images">
                <h4>Images</h4>
                <div className="admin-image-grid">
                  {product.images.map(img => (
                    <div key={img.id} className="admin-image-thumb">
                      <img src={img.image} alt={img.alt_text || product.name} />
                      {img.is_primary && <span className="admin-badge admin-badge-active">Primary</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
