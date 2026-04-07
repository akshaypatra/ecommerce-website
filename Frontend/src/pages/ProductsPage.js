import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { FiLoader, FiFilter } from 'react-icons/fi';

function ProductsPage({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 1000]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockProducts = [
        { id: 1, name: 'Amethyst Crystal Cluster', price: 45.99, description: 'Natural energy healing crystal', image: null },
        { id: 2, name: 'Yoga Mat - Organic Cotton', price: 62.50, description: 'Eco-friendly non-slip mat', image: null },
        { id: 3, name: 'Meditation Cushion', price: 38.00, description: 'Premium buckwheat meditation pillow', image: null },
        { id: 4, name: 'Chakra Balancing Oil', price: 24.99, description: 'Essential oils blend for chakra alignment', image: null },
        { id: 5, name: 'Healing Sound Bowl', price: 89.99, description: 'Handcrafted singing bowl for meditation', image: null },
        { id: 6, name: 'Sage Bundle', price: 12.50, description: 'White sage for spiritual cleansing', image: null },
      ];
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterAndSortProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, sortBy, priceRange, products]);

  const filterAndSortProducts = () => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesPrice;
    });

    // Sort products
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(filtered);
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--primary-light-lavender) 0%, var(--primary-soft-mint) 100%)',
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2rem',
          textAlign: 'center',
        }}
      >
        <h1 style={{ color: 'var(--spiritual-purple)', marginBottom: '0.5rem' }}>
          Our Spiritual Products
        </h1>
        <p style={{ color: 'var(--text-light)', margin: 0 }}>
          Discover items to enhance your wellness journey
        </p>
      </div>

      <div className="row">
        {/* Sidebar Filters */}
        <div className="col-lg-3 mb-4">
          <div
            className="card"
            style={{
              background: 'linear-gradient(135deg, var(--primary-cream) 0%, var(--primary-light-lavender) 100%)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
            }}
          >
            <h6 style={{ color: 'var(--spiritual-purple)', marginBottom: '1rem', fontWeight: '600' }}>
              <FiFilter className="me-2" />
              Filters
            </h6>

            {/* Search */}
            <div className="mb-4">
              <label className="form-label" style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                Search Products
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ borderRadius: 'var(--radius-md)' }}
              />
            </div>

            {/* Sort By */}
            <div className="mb-4">
              <label className="form-label" style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                Sort By
              </label>
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="form-label" style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <input
                type="range"
                className="form-range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="col-lg-9">
          {loading ? (
            <div className="text-center py-5">
              <FiLoader className="spinner" style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }} />
              <p className="mt-3">Loading products...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <>
              <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                Showing {filteredProducts.length} products
              </p>
              <div className="row g-4">
                {filteredProducts.map(product => (
                  <div key={product.id} className="col-md-6 col-lg-4">
                    <ProductCard product={product} onAddToCart={addToCart} />
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="alert alert-info text-center">
                  <p>No products found matching your filters</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default ProductsPage;
