import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (isLogin) {
        // Mock login
        const userData = {
          username: formData.username,
          email: 'user@example.com',
        };
        const token = 'mock-auth-token-' + Date.now();
        onLogin(userData, token);
        navigate('/');
      } else {
        // Mock register
        if (formData.password !== formData.confirmPassword) {
          alert('Passwords do not match');
          setLoading(false);
          return;
        }
        const userData = {
          username: formData.username,
          email: formData.email,
        };
        const token = 'mock-auth-token-' + Date.now();
        onLogin(userData, token);
        navigate('/');
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div
        style={{
          maxWidth: '500px',
          margin: '0 auto',
          background: 'linear-gradient(135deg, var(--primary-light-lavender) 0%, var(--primary-soft-mint) 100%)',
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            color: 'var(--spiritual-purple)',
            marginBottom: '0.5rem',
            fontSize: '1.8rem',
          }}
        >
          ✨ Spiritual Harmony
        </h1>

        <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '2rem' }}>
          {isLogin ? 'Welcome back to your wellness journey' : 'Begin your spiritual journey with us'}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-3">
              <label className="form-label" style={{ fontWeight: '600' }}>
                Email
              </label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required={!isLogin}
                style={{ borderRadius: 'var(--radius-md)' }}
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: '600' }}>
              {isLogin ? 'Username or Email' : 'Username'}
            </label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              style={{ borderRadius: 'var(--radius-md)' }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: '600' }}>
              Password
            </label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              style={{ borderRadius: 'var(--radius-md)' }}
            />
          </div>

          {!isLogin && (
            <div className="mb-3">
              <label className="form-label" style={{ fontWeight: '600' }}>
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required={!isLogin}
                style={{ borderRadius: 'var(--radius-md)' }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100 mb-3"
            style={{
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem',
              fontWeight: '600',
            }}
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
                setFormData({ username: '', email: '', password: '', confirmPassword: '' });
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--spiritual-teal)',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontWeight: '600',
              }}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>

        {isLogin && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <a
              href="#forgot"
              style={{
                color: 'var(--spiritual-teal)',
                textDecoration: 'none',
                fontSize: '0.9rem',
              }}
            >
              Forgot your password?
            </a>
          </div>
        )}

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Demo credentials: Use any username/password combination
          </p>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <Link
            to="/"
            style={{
              color: 'var(--spiritual-teal)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              display: 'block',
              textAlign: 'center',
            }}
          >
            ← Continue as Guest
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
