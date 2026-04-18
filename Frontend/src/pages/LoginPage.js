import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    password2: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const res = await authAPI.login(formData.email, formData.password);
        const { user, tokens } = res.data;
        onLogin(user, tokens);
        navigate('/');
      } else {
        if (formData.password !== formData.password2) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        const res = await authAPI.register({
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          password: formData.password,
          password2: formData.password2,
        });
        const { user, tokens } = res.data;
        onLogin(user, tokens);
        navigate('/');
      }
    } catch (err) {
      const data = err.response?.data;
      if (typeof data === 'object') {
        const messages = Object.entries(data)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
          .join('\n');
        setError(messages || 'Authentication failed. Please try again.');
      } else {
        setError('Unable to connect to server. Please ensure the backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="auth-card">
        <h1 className="auth-title">🙏 Divine Gems</h1>
        <p className="auth-subtitle">
          {isLogin ? 'Welcome back to your spiritual journey' : 'Begin your divine journey with us'}
        </p>

        {error && (
          <div className="alert alert-danger" style={{ borderRadius: 'var(--radius-md)', fontSize: '0.9rem', whiteSpace: 'pre-line' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: '600' }}>Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              required
              style={{ borderRadius: 'var(--radius-md)' }}
            />
          </div>

          {!isLogin && (
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label" style={{ fontWeight: '600' }}>First Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  style={{ borderRadius: 'var(--radius-md)' }}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label" style={{ fontWeight: '600' }}>Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  style={{ borderRadius: 'var(--radius-md)' }}
                />
              </div>
            </div>
          )}

          {!isLogin && (
            <div className="mb-3">
              <label className="form-label" style={{ fontWeight: '600' }}>Phone</label>
              <input
                type="tel"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 XXXXX XXXXX"
                style={{ borderRadius: 'var(--radius-md)' }}
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: '600' }}>Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={8}
              style={{ borderRadius: 'var(--radius-md)' }}
            />
          </div>

          {!isLogin && (
            <div className="mb-3">
              <label className="form-label" style={{ fontWeight: '600' }}>Confirm Password</label>
              <input
                type="password"
                className="form-control"
                name="password2"
                value={formData.password2}
                onChange={handleInputChange}
                required={!isLogin}
                minLength={8}
                style={{ borderRadius: 'var(--radius-md)' }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100 mb-3"
            style={{ borderRadius: 'var(--radius-md)', padding: '0.75rem', fontWeight: '600' }}
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-light)', marginBottom: 0, fontSize: '0.9rem' }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ email: '', first_name: '', last_name: '', phone: '', password: '', password2: '' });
              }}
              className="btn-link-spiritual"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <Link to="/" className="btn-link-spiritual d-block text-center" style={{ fontSize: '0.9rem' }}>
            ← Continue as Guest
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
