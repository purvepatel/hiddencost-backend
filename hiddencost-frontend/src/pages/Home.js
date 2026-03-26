import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

// ============================================================
// Home — Landing page (CLO3)
// ============================================================

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-tag">
            <span className="tag-dot" />
            True Cost Calculator
          </div>

          <h1 className="hero-title">
            The price tag<br />
            <span className="hero-accent">lies to you.</span>
          </h1>

          <p className="hero-desc">
            HiddenCost reveals the real long-term cost of ownership—<br />
            subscriptions, maintenance, fuel, insurance. Every hidden dollar.
          </p>

          <div className="hero-actions">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started Free →
                </Link>
                <Link to="/login" className="btn btn-lg">
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Stat bar */}
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-value">3×</span>
              <span className="stat-label">avg hidden cost multiplier</span>
            </div>
            <div className="stat-divider" />
            <div className="hero-stat">
              <span className="stat-value">5yr</span>
              <span className="stat-label">ownership horizon</span>
            </div>
            <div className="stat-divider" />
            <div className="hero-stat">
              <span className="stat-value">∞</span>
              <span className="stat-label">products compared</span>
            </div>
          </div>
        </div>

        {/* Decorative element */}
        <div className="hero-glow" />
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="section-label">— HOW IT WORKS</div>
          <h2 className="section-title">Three steps to clarity</h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-number">01</div>
              <h3>Add Products</h3>
              <p>Enter any product with its base price and brand. Cars, appliances, electronics — anything with ongoing costs.</p>
            </div>
            <div className="feature-card">
              <div className="feature-number">02</div>
              <h3>Track Hidden Costs</h3>
              <p>Add recurring costs: monthly subscriptions, yearly maintenance, one-time fees, insurance, fuel — every expense.</p>
            </div>
            <div className="feature-card">
              <div className="feature-number">03</div>
              <h3>Compare & Decide</h3>
              <p>See the true 5-year cost side-by-side. The cheapest upfront isn't always the cheapest to own.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>Stop buying blindly.</h2>
            <p>Make every purchase with full cost visibility.</p>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-primary btn-lg">
                Start for Free →
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
