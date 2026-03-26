import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

// ============================================================
// Navbar — Main navigation component (CLO3)
// ============================================================

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-bracket">[</span>
          HIDDEN
          <span className="logo-accent">COST</span>
          <span className="logo-bracket">]</span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Dashboard
              </NavLink>
              <NavLink to="/brands" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Brands
              </NavLink>
              <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Products
              </NavLink>
              <NavLink to="/compare" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Compare
              </NavLink>
            </>
          ) : (
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Home
            </NavLink>
          )}
        </div>

        {/* Auth Controls */}
        <div className="navbar-auth">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-name">
                <span className="user-dot" />
                {user?.username || user?.email}
              </span>
              <button className="btn btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-sm">Login</Link>
              <Link to="/register" className="btn btn-sm btn-primary">Register</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} className="mobile-link">Dashboard</NavLink>
              <NavLink to="/brands" onClick={() => setMenuOpen(false)} className="mobile-link">Brands</NavLink>
              <NavLink to="/products" onClick={() => setMenuOpen(false)} className="mobile-link">Products</NavLink>
              <NavLink to="/compare" onClick={() => setMenuOpen(false)} className="mobile-link">Compare</NavLink>
              <button className="mobile-link mobile-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setMenuOpen(false)} className="mobile-link">Login</NavLink>
              <NavLink to="/register" onClick={() => setMenuOpen(false)} className="mobile-link">Register</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
