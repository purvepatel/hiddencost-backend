import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { calculateTotalCost, costFactorsAPI, formatCurrency, productsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

function Dashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [costFactors, setCostFactors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [productsResponse, costFactorsResponse] = await Promise.all([
          productsAPI.getAll(),
          costFactorsAPI.getAll(),
        ]);
        setProducts(productsResponse.data || []);
        setCostFactors(costFactorsResponse.data || []);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const metrics = useMemo(() => {
    const totalProjectedCost = products.reduce((sum, product) => {
      const productFactors = costFactors.filter((costFactor) => costFactor.product_id === product.id);
      return sum + calculateTotalCost(product, productFactors, 5);
    }, 0);

    const hiddenCostTotal = costFactors.reduce((sum, costFactor) => {
      const amount = parseFloat(costFactor.cost_amount || 0);
      if (costFactor.frequency === 'monthly') return sum + amount * 12 * 5;
      if (costFactor.frequency === 'yearly') return sum + amount * 5;
      return sum + amount;
    }, 0);

    return {
      totalProducts: products.length,
      totalBrands: new Set(products.map((product) => product.brand_name).filter(Boolean)).size,
      totalCostFactors: costFactors.length,
      totalProjectedCost,
      hiddenCostTotal,
    };
  }, [costFactors, products]);

  const recentProducts = [...products]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 5);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            Welcome back, {user?.first_name || user?.username || 'User'}
          </h1>
          <p className="dashboard-subtitle">Your HiddenCost workspace is ready for Phase 2 tracking.</p>
        </div>
        <span className={`role-badge role-${user?.role || 'user'}`}>
          {user?.role || 'user'}
        </span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-center">
          <div className="spinner" />
          <span>Loading dashboard...</span>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value">{metrics.totalProducts}</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{metrics.totalBrands}</span>
              <span className="stat-label">Brands Used</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{metrics.totalCostFactors}</span>
              <span className="stat-label">Cost Factors</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{formatCurrency(metrics.hiddenCostTotal)}</span>
              <span className="stat-label">5-Year Hidden Costs</span>
            </div>
          </div>

          <div className="dashboard-panels">
            <section className="card dashboard-panel">
              <div className="panel-header">
                <h2>Quick Actions</h2>
              </div>
              <div className="actions-grid">
                <Link className="action-card" to="/products/new">Add Product</Link>
                <Link className="action-card" to="/brands">Manage Brands</Link>
                <Link className="action-card" to="/compare">Compare Costs</Link>
                <Link className="action-card" to="/products">Browse Products</Link>
              </div>
            </section>

            <section className="card dashboard-panel">
              <div className="panel-header">
                <h2>Portfolio Snapshot</h2>
              </div>
              <div className="summary-row">
                <span>Projected 5-Year Ownership Total</span>
                <strong>{formatCurrency(metrics.totalProjectedCost)}</strong>
              </div>
              <div className="summary-row">
                <span>Tracked Hidden Costs</span>
                <strong>{formatCurrency(metrics.hiddenCostTotal)}</strong>
              </div>
              <div className="summary-row">
                <span>Average Hidden Cost Per Product</span>
                <strong>
                  {formatCurrency(metrics.totalProducts ? metrics.hiddenCostTotal / metrics.totalProducts : 0)}
                </strong>
              </div>
            </section>
          </div>

          <section className="card dashboard-panel">
            <div className="panel-header">
              <h2>Recent Products</h2>
              <Link to="/products" className="view-all-link">View all</Link>
            </div>

            {recentProducts.length === 0 ? (
              <div className="empty-state">
                <h3>No products yet</h3>
                <p>Create a product to start tracking long-term ownership costs.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Brand</th>
                      <th>Type</th>
                      <th>Base Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.brand_name || '--'}</td>
                        <td>{product.product_type || '--'}</td>
                        <td>{formatCurrency(product.base_price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default Dashboard;
