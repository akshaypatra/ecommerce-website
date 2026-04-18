import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers, FiPackage, FiGrid, FiShoppingCart,
  FiCreditCard, FiStar, FiTrendingUp, FiDollarSign,
} from 'react-icons/fi';
import adminAPI from '../../services/adminApi';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard()
      .then(res => setStats(res.data))
      .catch(err => console.error('Dashboard error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="admin-loading">Loading dashboard...</div>;
  if (!stats) return <div className="admin-error">Failed to load dashboard</div>;

  const statCards = [
    { label: 'Users', value: stats.total_users, icon: <FiUsers />, color: '#7c3aed', to: '/admin/users' },
    { label: 'Products', value: stats.total_products, icon: <FiPackage />, color: '#14b8a6', to: '/admin/products' },
    { label: 'Orders', value: stats.total_orders, icon: <FiShoppingCart />, color: '#f59e0b', to: '/admin/orders' },
    { label: 'Revenue', value: `₹${Number(stats.total_revenue).toLocaleString('en-IN')}`, icon: <FiDollarSign />, color: '#22c55e', to: '/admin/orders' },
    { label: 'Categories', value: stats.total_categories, icon: <FiGrid />, color: '#3b82f6', to: '/admin/categories' },
    { label: 'Reviews', value: stats.total_reviews, icon: <FiStar />, color: '#f43f5e', to: '/admin/reviews' },
    { label: 'Payments', value: stats.total_payments, icon: <FiCreditCard />, color: '#8b5cf6', to: '/admin/payments' },
    { label: 'Active Carts', value: stats.active_carts, icon: <FiTrendingUp />, color: '#ec4899', to: '/admin' },
  ];

  return (
    <div>
      {/* Stat Cards */}
      <div className="admin-stats-grid">
        {statCards.map(card => (
          <Link key={card.label} to={card.to} className="admin-stat-card" style={{ borderTopColor: card.color }}>
            <div className="admin-stat-icon" style={{ color: card.color, background: card.color + '15' }}>
              {card.icon}
            </div>
            <div className="admin-stat-value">{card.value}</div>
            <div className="admin-stat-label">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Order Status Breakdown */}
      <div className="admin-grid-2">
        <div className="admin-card">
          <h3 className="admin-card-title">Orders by Status</h3>
          <div className="admin-status-list">
            {Object.entries(stats.orders_by_status || {}).map(([status, count]) => (
              <div key={status} className="admin-status-item">
                <span className={`admin-badge admin-badge-${status}`}>{status}</span>
                <span className="admin-status-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <h3 className="admin-card-title">Payments by Status</h3>
          <div className="admin-status-list">
            {Object.entries(stats.payments_by_status || {}).map(([status, count]) => (
              <div key={status} className="admin-status-item">
                <span className={`admin-badge admin-badge-${status}`}>{status}</span>
                <span className="admin-status-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <div className="admin-card-header">
          <h3 className="admin-card-title">Recent Orders</h3>
          <Link to="/admin/orders" className="admin-link">View All →</Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {(stats.recent_orders || []).map(order => (
                <tr key={order.id}>
                  <td>
                    <Link to={`/admin/orders/${order.id}`} className="admin-link">
                      {order.order_id?.slice(0, 8)}...
                    </Link>
                  </td>
                  <td>{order.user_email}</td>
                  <td><span className={`admin-badge admin-badge-${order.status}`}>{order.status}</span></td>
                  <td><span className={`admin-badge admin-badge-${order.payment_status}`}>{order.payment_status}</span></td>
                  <td>₹{Number(order.total).toLocaleString('en-IN')}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Users */}
      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <div className="admin-card-header">
          <h3 className="admin-card-title">Recent Users</h3>
          <Link to="/admin/users" className="admin-link">View All →</Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Staff</th>
                <th>Active</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {(stats.recent_users || []).map(user => (
                <tr key={user.id}>
                  <td>
                    <Link to={`/admin/users/${user.id}`} className="admin-link">
                      {user.email}
                    </Link>
                  </td>
                  <td>{user.full_name || '—'}</td>
                  <td>{user.is_staff ? '✓' : '—'}</td>
                  <td>{user.is_active ? '✓' : '✗'}</td>
                  <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
