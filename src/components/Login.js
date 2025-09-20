import React, { useState } from 'react';
import { loginUser } from '../services/auth';

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      // convert to form-encoded format because backend expects OAuth2 form
      const user = await loginUser(form);
      onLogin(user);
    } catch(err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="login-bg">
      <div className="login-box">
        <div className="login-header">
          <h2>Sweet Shop</h2>
          <div className="login-subtitle">Welcome back! Sign in to your account</div>
        </div>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit} >
          <label htmlFor="email">Email or Username  </label>
          <input id="email" name="email" type="email" placeholder="Email or Username" value={form.email} onChange={handleChange} required />
          <label htmlFor="password">Password  </label>
          <input id="password" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <button type="submit">Sign In</button>
        </form>
        <div className="login-bottom">
          <div>
            Don't have an account? <a href="/register">Sign Up</a>
          </div>
          <div className="demo-accounts">
            <strong>Demo Accounts:</strong>
            <br />
            Admin: <a href="mailto:admin@sweetshop.com">admin@sweetshop.com</a> / admin123
            <br />
            User: <a href="mailto:demo@sweetshop.com">demo@sweetshop.com</a> / demo123
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
