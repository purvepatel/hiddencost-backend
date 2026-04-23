import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-tag">
            <span className="tag-dot" />
            True Cost Calculator
          </div>

          <h1 className="hero-title">
            The price tag
            <br />
            <span className="hero-accent">never tells the whole story.</span>
          </h1>

          <p className="hero-desc">
            HiddenCost helps you track the full cost of ownership, including subscriptions,
            maintenance, insurance, and one-time surprises.
          </p>

          <div className="hero-actions">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-lg">
                  Sign In
                </Link>
              </>
            )}
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-value">5yr</span>
              <span className="stat-label">ownership horizon</span>
            </div>
            <div className="stat-divider" />
            <div className="hero-stat">
              <span className="stat-value">CRUD</span>
              <span className="stat-label">full product workflow</span>
            </div>
            <div className="stat-divider" />
            <div className="hero-stat">
              <span className="stat-value">JWT</span>
              <span className="stat-label">secured API access</span>
            </div>
          </div>
        </div>

        <div className="hero-glow" />
      </section>

      <section className="features">
        <div className="container">
          <div className="section-label">HOW IT WORKS</div>
          <h2 className="section-title">Three steps to cost clarity</h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-number">01</div>
              <h3>Create Products</h3>
              <p>Save products with brand, type, base price, and descriptive notes.</p>
            </div>
            <div className="feature-card">
              <div className="feature-number">02</div>
              <h3>Add Hidden Costs</h3>
              <p>Track monthly, yearly, and one-time expenses connected to each product.</p>
            </div>
            <div className="feature-card">
              <div className="feature-number">03</div>
              <h3>Compare Totals</h3>
              <p>Review 1, 3, 5, or 10-year ownership totals before making a decision.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>Build smarter purchase decisions.</h2>
            <p>Connect your backend API to a polished SPA and reveal the real total cost.</p>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-primary btn-lg">
                Start for Free
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
