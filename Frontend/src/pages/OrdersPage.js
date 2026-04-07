import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLoader } from 'react-icons/fi';

function OrdersPage({ isLoggedIn }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Simulate fetching orders
    setTimeout(() => {
      const mockOrders = [
        {
          id: 'ORD-001',
          date: '2026-03-20',
          total: 95.97,
          status: 'Delivered',
          items: 3,
        },
        {
          id: 'ORD-002',
          date: '2026-03-15',
          total: 45.99,
          status: 'In Transit',
          items: 1,
        },
      ];
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, [isLoggedIn, navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'var(--accent-sage)';
      case 'In Transit':
        return 'var(--accent-sky-blue)';
      case 'Processing':
        return 'var(--accent-warm-sand)';
      default:
        return 'var(--text-light)';
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div style={{ textAlign: 'center' }}>
          <FiLoader className="spinner" style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }} />
          <p className="mt-3">Loading your orders...</p>
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

  return (
    <div className="container py-4">
      <h1 style={{ color: 'var(--spiritual-purple)', marginBottom: '2rem' }}>
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem',
            background: 'linear-gradient(135deg, var(--primary-light-lavender) 0%, var(--primary-soft-mint) 100%)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <h3 style={{ color: 'var(--spiritual-purple)', marginBottom: '1rem' }}>
            No Orders Yet
          </h3>
          <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
            Start your wellness journey by exploring our collection.
          </p>
          <Link to="/products" className="btn btn-primary">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {orders.map(order => (
            <div key={order.id} className="col-md-6 col-lg-4">
              <div
                className="card"
                style={{
                  background: 'linear-gradient(135deg, var(--primary-cream) 0%, var(--primary-light-lavender) 100%)',
                  borderRadius: 'var(--radius-lg)',
                  height: '100%',
                }}
              >
                <div className="card-body">
                  <h5 style={{ color: 'var(--spiritual-purple)', marginBottom: '0.5rem', fontWeight: '600' }}>
                    {order.id}
                  </h5>

                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ color: 'var(--text-light)', marginBottom: '0.3rem', fontSize: '0.9rem' }}>
                      <strong>Date:</strong> {new Date(order.date).toLocaleDateString()}
                    </p>
                    <p style={{ color: 'var(--text-light)', marginBottom: '0.3rem', fontSize: '0.9rem' }}>
                      <strong>Items:</strong> {order.items}
                    </p>
                    <p style={{ marginBottom: 0, fontSize: '0.9rem' }}>
                      <strong>Status:</strong>{' '}
                      <span
                        className="badge"
                        style={{
                          backgroundColor: getStatusColor(order.status),
                          color: 'white',
                          padding: '0.3rem 0.6rem',
                        }}
                      >
                        {order.status}
                      </span>
                    </p>
                  </div>

                  <hr />

                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ color: 'var(--text-light)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      <strong>Total:</strong>
                    </p>
                    <p className="price" style={{ margin: 0 }}>
                      ${order.total.toFixed(2)}
                    </p>
                  </div>

                  <button
                    className="btn btn-outline-primary w-100"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
