import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';
import { FiLoader, FiFilter, FiSearch, FiX } from 'react-icons/fi';
import siteConfig from '../config/siteConfig.json';

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('ordering') || '-created_at');
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    productAPI.getCategories()
      .then(res => {
        const cats = Array.isArray(res.data) ? res.data : [];
        setCategories(cats);
      })
      .catch(() => setCategories([]));
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = { page: currentPage, ordering: sortBy };
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory) params.category_slug = selectedCategory;
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;
      if (inStockOnly) params.in_stock = true;

      const res = await productAPI.getAll(params);
      const data = res.data;
      
      // Handle paginated or plain array response
      if (data.results) {
        setProducts(data.results);
        setTotalCount(data.count || data.results.length);
      } else if (Array.isArray(data)) {
        setProducts(data);
        setTotalCount(data.length);
      } else {
        setProducts([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Unable to load products. Please check if the backend server is running.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortBy, searchQuery, selectedCategory, minPrice, maxPrice, inStockOnly]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (selectedCategory) params.category = selectedCategory;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSortBy('-created_at');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setCurrentPage(1);
    setSearchParams({});
  };

  const totalPages = Math.ceil(totalCount / 20);

  return (
    <div className="container py-4 decorated-gemstones">
      {/* Header */}
      <div className="page-header">
        <h1>{siteConfig.productsPage.title}</h1>
        <p>{siteConfig.productsPage.subtitle}</p>
      </div>

      <div className="row">
        {/* Sidebar Filters */}
        <div className="col-lg-3 mb-4">
          {/* Mobile filter toggle */}
          <div className="d-lg-none mb-3">
            <button 
              className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <FiFilter size={16} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          <div className={`filter-card filter-collapsible ${showFilters ? 'filter-open' : 'filter-closed'}`}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 style={{ color: 'var(--spiritual-purple)', fontWeight: '600', margin: 0 }}>
                <FiFilter className="me-2" />
                Filters
              </h6>
              <button className="btn btn-sm btn-link" onClick={clearFilters} style={{ color: 'var(--spiritual-teal)' }}>
                <FiX className="me-1" /> Clear
              </button>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="mb-3">
              <label className="form-label small fw-bold">Search</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rudraksha, Neelam..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-primary" type="submit">
                  <FiSearch size={16} />
                </button>
              </div>
            </form>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="mb-3">
                <label className="form-label small fw-bold">Category</label>
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort */}
            <div className="mb-3">
              <label className="form-label small fw-bold">Sort By</label>
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              >
                <option value="-created_at">Newest First</option>
                <option value="created_at">Oldest First</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-3">
              <label className="form-label small fw-bold">Price Range (₹)</label>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  min="0"
                />
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            {/* In Stock */}
            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="inStock"
                checked={inStockOnly}
                onChange={(e) => { setInStockOnly(e.target.checked); setCurrentPage(1); }}
              />
              <label className="form-check-label small" htmlFor="inStock">In Stock Only</label>
            </div>

            <button onClick={fetchProducts} className="btn btn-primary w-100" style={{ borderRadius: 'var(--radius-md)' }}>
              Apply Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="col-lg-9">

          {loading ? (
            <div className="text-center py-5">
              <FiLoader className="spinner" style={{ fontSize: '2rem' }} />
              <p className="mt-3" style={{ color: 'var(--text-light)' }}>Loading sacred products...</p>
            </div>
          ) : error ? (
            <div className="alert alert-info text-center">
              <p className="mb-2">{error}</p>
              <button className="btn btn-primary btn-sm" onClick={fetchProducts}>
                Retry
              </button>
            </div>
          ) : (
            <>
              <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
                Showing {products.length} of {totalCount} products
              </p>
              <div className="row g-4">
                {products.map(product => (
                  <div key={product.id} className="col-md-6 col-lg-4">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {products.length === 0 && !loading && (
                <div className="text-center py-5">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                  <h5 style={{ color: 'var(--spiritual-purple)' }}>No Products Found</h5>
                  <p style={{ color: 'var(--text-light)' }}>Try adjusting your filters or search terms</p>
                  <button className="btn btn-primary" onClick={clearFilters}>Clear All Filters</button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="mt-4">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
                        Previous
                      </button>
                    </li>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                      if (page > totalPages || page < 1) return null;
                      return (
                        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => setCurrentPage(page)}>
                            {page}
                          </button>
                        </li>
                      );
                    })}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
