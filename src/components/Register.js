import React, { useState } from 'react';
import { registerUser } from '../services/auth';

const Register = ({ onRegister }) => {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const user = await registerUser(form);
      onRegister(user);
    } catch(err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="login-bg">
      <div className="login-box">
        <div className="login-header">
          <h2>Sweet Shop</h2>
          <div className="login-subtitle">Create your account</div>
        </div>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter your username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        <div className="login-bottom">
          <div>
            Already have an account? <a href="/login">Sign In</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
