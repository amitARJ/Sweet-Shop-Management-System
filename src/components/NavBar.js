import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const NavBar = ({ user, onLogout, cartItemCount }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar-ss">
      <div className="navbar-logo-area">
        <span className="navbar-logo" role="img" aria-label="logo">🍭</span>
        <span className="navbar-title">Sweet Shop</span>
      </div>
      <div className="navbar-links">
        <Link
          to="/"
          className="navbar-link"
          style={{
            color: location.pathname === '/' ? '#11c9db' : '#bababa',}}>
          Dashboard
        </Link>
        {user && (
          <>
            <Link
              to="/profile"
              className="navbar-link"
              style={{
                color: location.pathname === '/profile' ? '#11c9db' : '#bababa'
              }}
            >
              Profile
            </Link>
            {user.isAdmin && (
              <Link
                to="/admin"
                className="navbar-link"
                style={{
                  color: location.pathname === '/admin' ? '#11c9db' : '#bababa'
                }}
              >
                Admin
              </Link>
            )}
            <span className="navbar-cart" onClick={() => navigate('/cart')} style={{ cursor: 'pointer' }}>
              <img src="/cart.png" alt="Cart" width="24" height="24" />
              {cartItemCount > 0 && (
                <span className="navbar-cart-badge">{cartItemCount}</span>
              )}
            </span>
            <span className="navbar-user-label">{user.username} ({user.isAdmin ? "Admin" : "User"})</span>
            <button className="navbar-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
        {!user && (
          <>
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/register" className="navbar-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
