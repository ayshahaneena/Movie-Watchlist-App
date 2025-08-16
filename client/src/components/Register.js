import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const { username, email, password } = formData;
      const result = await register({ username, email, password });
      
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
            <FaUserPlus style={{ marginRight: '10px' }} />
            Register
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
              <label htmlFor="username" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your username"
                minLength="3"
                maxLength="30"
                pattern="[a-zA-Z0-9_]+"
                title="Username can only contain letters, numbers, and underscores"
              />
            </div>
            
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
                  minLength="6"
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
            
            <div className="form-group">
              <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-control"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px' }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p style={{ margin: 0, color: '#6c757d' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#667eea', textDecoration: 'none' }}>
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

