import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit2, FiTrash2, FiUpload, FiX, FiStar } from 'react-icons/fi';
import adminAPI from '../../services/adminApi';

export default function AdminProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);

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

  // ─── Image Management ───────────────────────────────────
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setNewImageFiles(prev => [...prev, ...files]);
    const previews = files.map(f => URL.createObjectURL(f));
    setNewImagePreviews(prev => [...prev, ...previews]);
  };

  const removeNewImage = (index) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadNewImages = async () => {
    if (newImageFiles.length === 0) return;
    setImageUploading(true);
    try {
      for (let i = 0; i < newImageFiles.length; i++) {
        const formData = new FormData();
        formData.append('product', id);
        formData.append('image', newImageFiles[i]);
        formData.append('is_primary', false);
        formData.append('order', (product.images?.length || 0) + i);
        await adminAPI.createProductImage(formData);
      }
      setNewImageFiles([]);
      setNewImagePreviews(prev => { prev.forEach(u => URL.revokeObjectURL(u)); return []; });
      fetchProduct();
    } catch (err) {
      alert('Failed to upload images: ' + JSON.stringify(err.response?.data || 'Error'));
    } finally {
      setImageUploading(false);
    }
  };

  const deleteImage = async (imageId) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await adminAPI.deleteProductImage(imageId);
      fetchProduct();
    } catch (err) {
      alert('Failed to delete image');
    }
  };

  const setPrimary = async (imageId) => {
    try {
      await adminAPI.setProductImagePrimary(imageId);
      fetchProduct();
    } catch (err) {
      alert('Failed to set primary image');
    }
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

      {/* Product Details Card */}
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
          </>
        )}
      </div>

      {/* Image Management Card */}
      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <div className="admin-card-header">
          <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Product Images ({product.images?.length || 0})</h4>
        </div>

        {/* Existing Images */}
        {product.images && product.images.length > 0 ? (
          <div className="admin-product-images-grid">
            {product.images.map(img => (
              <div key={img.id} className={`admin-product-image-card ${img.is_primary ? 'primary' : ''}`}>
                <div className="admin-product-image-wrapper">
                  <img src={img.image} alt={img.alt_text || product.name} />
                  {img.is_primary && (
                    <span className="admin-primary-badge"><FiStar size={10} /> Primary</span>
                  )}
                </div>
                <div className="admin-product-image-actions">
                  {!img.is_primary && (
                    <button
                      className="admin-btn admin-btn-sm admin-btn-outline"
                      onClick={() => setPrimary(img.id)}
                      title="Set as Primary"
                    >
                      <FiStar size={12} /> Primary
                    </button>
                  )}
                  <button
                    className="admin-btn admin-btn-sm admin-btn-danger"
                    onClick={() => deleteImage(img.id)}
                    title="Delete Image"
                  >
                    <FiTrash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#8e8ea0', padding: '1rem 0', margin: 0 }}>No images uploaded yet.</p>
        )}

        {/* Upload New Images */}
        <div className="admin-image-upload-section">
          <h5 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem' }}>Add New Images</h5>
          <div className="admin-file-upload">
            <label className="admin-file-btn">
              <FiUpload size={14} /> Choose Images
              <input type="file" accept="image/*" multiple onChange={handleImageSelect} style={{ display: 'none' }} />
            </label>
            <span className="admin-text-muted" style={{ fontSize: '0.8rem' }}>
              {newImageFiles.length} file(s) selected
            </span>
          </div>
          {newImagePreviews.length > 0 && (
            <>
              <div className="admin-image-preview-grid" style={{ marginTop: '0.75rem' }}>
                {newImagePreviews.map((src, i) => (
                  <div key={i} className="admin-image-preview">
                    <img src={src} alt={`New ${i + 1}`} />
                    <button type="button" className="admin-image-remove" onClick={() => removeNewImage(i)}>
                      <FiX size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="admin-btn admin-btn-primary"
                style={{ marginTop: '0.75rem' }}
                onClick={uploadNewImages}
                disabled={imageUploading}
              >
                {imageUploading ? 'Uploading...' : `Upload ${newImageFiles.length} Image(s)`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
