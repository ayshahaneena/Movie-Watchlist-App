import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData);
      if (result.success) {
        navigate('/search');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem 0', maxWidth: '400px', margin: '0 auto' }}>
      <div className="card">
        <div className="card-header text-center">
          <h2 style={{ margin: 0, color: '#667eea' }}>
            <FaSignInAlt style={{ marginRight: '10px' }} />
            Login
          </h2>
        </div>
        
        <div className="card-body">
          {error && (
            <div style={{
              background: '#f8d7da',
              color: '#721c24',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '20px',
              border: '1px solid #f5c6cb'
            }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6c757d'
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px' }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p style={{ margin: 0, color: '#6c757d' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#667eea', textDecoration: 'none' }}>
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

