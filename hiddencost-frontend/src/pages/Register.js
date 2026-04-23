import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setServerError('');
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.username.trim()) nextErrors.username = 'Username is required';
    else if (formData.username.trim().length < 3) nextErrors.username = 'Username must be at least 3 characters';

    if (!formData.email.trim()) nextErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) nextErrors.email = 'Email format is invalid';

    if (!formData.password) nextErrors.password = 'Password is required';
    else if (formData.password.length < 6) nextErrors.password = 'Password must be at least 6 characters';

    if (!formData.confirmPassword) nextErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match';

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = formData;
      await register(payload);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box auth-box-lg">
        <div className="auth-header">
          <div className="auth-icon">*</div>
          <h1>Create Account</h1>
          <p>Register to start managing products and hidden costs.</p>
        </div>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="first_name">First Name</label>
              <input
                id="first_name"
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="form-input"
                placeholder="Jane"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="last_name">Last Name</label>
              <input
                id="last_name"
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="form-input"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`form-input ${errors.username ? 'input-error' : ''}`}
              placeholder="janedoe"
              autoComplete="username"
            />
            {errors.username && <span className="form-error">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="jane@example.com"
              autoComplete="email"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'input-error' : ''}`}
                placeholder="Minimum 6 characters"
                autoComplete="new-password"
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                placeholder="Repeat password"
                autoComplete="new-password"
              />
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
