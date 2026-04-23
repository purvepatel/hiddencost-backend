import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { calculateTotalCost, costFactorsAPI, formatCurrency, productsAPI } from '../utils/api';
import './Products.css';

const FREQUENCY_OPTIONS = ['monthly', 'yearly', 'one-time'];

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [costFactors, setCostFactors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [years, setYears] = useState(5);
  const [showCfForm, setShowCfForm] = useState(false);
  const [editingCf, setEditingCf] = useState(null);
  const [cfForm, setCfForm] = useState({ name: '', amount: '', frequency: 'monthly', description: '' });
  const [cfError, setCfError] = useState('');
  const [cfSaving, setCfSaving] = useState(false);
  const [deletingCfId, setDeletingCfId] = useState(null);

  const fetchProduct = useCallback(async () => {
    try {
      const [productResponse, costFactorResponse] = await Promise.all([
        productsAPI.getById(id),
        costFactorsAPI.getByProduct(id),
      ]);

      setProduct(productResponse.data);
      setCostFactors(costFactorResponse.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load product details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const basePrice = parseFloat(product?.base_price || 0);
  const totalCost = calculateTotalCost(product, costFactors, years);
  const hiddenCost = totalCost - basePrice;

  const openCreateForm = () => {
    setEditingCf(null);
    setCfForm({ name: '', amount: '', frequency: 'monthly', description: '' });
    setCfError('');
    setShowCfForm(true);
  };

  const openEditForm = (costFactor) => {
    setEditingCf(costFactor);
    setCfForm({
      name: costFactor.cost_name,
      amount: costFactor.cost_amount,
      frequency: costFactor.frequency,
      description: costFactor.cost_type || '',
    });
    setCfError('');
    setShowCfForm(true);
  };

  const handleCfChange = (event) => {
    const { name, value } = event.target;
    setCfForm((current) => ({ ...current, [name]: value }));
    setCfError('');
  };

  const closeCostForm = () => {
    setShowCfForm(false);
    setEditingCf(null);
    setCfError('');
  };

  const handleCfSave = async (event) => {
    event.preventDefault();

    if (!cfForm.name.trim()) {
      setCfError('Cost name is required.');
      return;
    }

    if (!cfForm.amount || Number.isNaN(Number(cfForm.amount))) {
      setCfError('A valid amount is required.');
      return;
    }

    setCfSaving(true);
    try {
      const payload = {
        name: cfForm.name.trim(),
        amount: parseFloat(cfForm.amount),
        frequency: cfForm.frequency,
        description: cfForm.description.trim(),
      };

      if (editingCf) {
        await costFactorsAPI.update(editingCf.id, payload);
      } else {
        await costFactorsAPI.create({ ...payload, product_id: parseInt(id, 10) });
      }

      await fetchProduct();
      closeCostForm();
    } catch (err) {
      setCfError(err.response?.data?.message || 'Failed to save cost factor.');
    } finally {
      setCfSaving(false);
    }
  };

  const handleCfDelete = async (costFactorId) => {
    if (!window.confirm('Remove this cost factor?')) return;

    setDeletingCfId(costFactorId);
    try {
      await costFactorsAPI.delete(costFactorId);
      setCostFactors((current) => current.filter((costFactor) => costFactor.id !== costFactorId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete cost factor.');
    } finally {
      setDeletingCfId(null);
    }
  };

  const handleDeleteProduct = async () => {
    if (!window.confirm('Delete this product and all of its cost factors?')) return;

    try {
      await productsAPI.delete(id);
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner" />
        <span>Loading product...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <div className="alert alert-error">Product not found.</div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        {error && <div className="alert alert-error">{error}</div>}

        <div className="product-detail-grid">
          <div>
            <div className="card" style={{ marginBottom: '20px' }}>
              <div className="detail-hero">
                <div>
                  <div className="detail-meta" style={{ marginBottom: '8px' }}>
                    {product.brand_name && <span className="badge badge-info">{product.brand_name}</span>}
                    {product.product_type && <span className="badge badge-accent">{product.product_type}</span>}
                  </div>
                  <h1 className="detail-title">{product.name}</h1>
                </div>
                <div className="detail-actions">
                  <Link to={`/products/${id}/edit`} className="btn">Edit</Link>
                  <button className="btn btn-danger" onClick={handleDeleteProduct}>Delete</button>
                </div>
              </div>

              <div className="detail-price-section">
                <div className="price-label">Base Price</div>
                <div className="price-value">{formatCurrency(product.base_price)}</div>
              </div>

              {product.description && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '12px' }}>
                  {product.description}
                </p>
              )}
            </div>

            <div className="card">
              <div className="cf-header">
                <h3>Cost Factors ({costFactors.length})</h3>
                <button className="btn btn-primary btn-sm" onClick={openCreateForm}>
                  Add Cost
                </button>
              </div>

              {showCfForm && (
                <div className="cf-form">
                  <form onSubmit={handleCfSave}>
                    {cfError && <div className="alert alert-error">{cfError}</div>}

                    <div className="form-group">
                      <label className="form-label">Cost Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={cfForm.name}
                        onChange={handleCfChange}
                        className="form-input"
                        placeholder="Example: Insurance"
                      />
                    </div>

                    <div className="cf-form-row">
                      <div className="form-group">
                        <label className="form-label">Amount *</label>
                        <input
                          type="number"
                          name="amount"
                          value={cfForm.amount}
                          onChange={handleCfChange}
                          className="form-input"
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Frequency *</label>
                        <select
                          name="frequency"
                          value={cfForm.frequency}
                          onChange={handleCfChange}
                          className="form-select"
                        >
                          {FREQUENCY_OPTIONS.map((frequency) => (
                            <option key={frequency} value={frequency}>
                              {frequency}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Notes</label>
                      <input
                        type="text"
                        name="description"
                        value={cfForm.description}
                        onChange={handleCfChange}
                        className="form-input"
                        placeholder="Optional note"
                      />
                    </div>

                    <div className="cf-form-actions">
                      <button type="button" className="btn btn-sm" onClick={closeCostForm}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary btn-sm" disabled={cfSaving}>
                        {cfSaving ? 'Saving...' : editingCf ? 'Update Cost' : 'Add Cost'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {costFactors.length === 0 && !showCfForm ? (
                <div className="empty-state" style={{ padding: '32px 0' }}>
                  <h3>No cost factors yet</h3>
                  <p>Add monthly, yearly, or one-time costs to reveal the real ownership total.</p>
                </div>
              ) : (
                <div className="cf-list" style={{ marginTop: showCfForm ? '16px' : '0' }}>
                  {costFactors.map((costFactor) => (
                    <div key={costFactor.id} className="cf-item">
                      <div className="cf-item-left">
                        <div className="cf-name">{costFactor.cost_name}</div>
                        <div className="cf-frequency">{costFactor.frequency}</div>
                        {costFactor.cost_type && (
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {costFactor.cost_type}
                          </div>
                        )}
                      </div>
                      <div className="cf-amount">{formatCurrency(costFactor.cost_amount)}</div>
                      <div className="cf-actions">
                        <button className="btn btn-sm" onClick={() => openEditForm(costFactor)}>Edit</button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleCfDelete(costFactor.id)}
                          disabled={deletingCfId === costFactor.id}
                        >
                          {deletingCfId === costFactor.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="card cost-summary-card">
              <h3>Total Cost of Ownership</h3>

              <div className="year-selector">
                {[1, 3, 5, 10].map((value) => (
                  <button
                    key={value}
                    className={`btn btn-sm year-btn ${years === value ? 'active' : ''}`}
                    onClick={() => setYears(value)}
                  >
                    {value}yr
                  </button>
                ))}
              </div>

              <div className="cost-row">
                <span className="cost-row-label">Base Price</span>
                <span className="cost-row-value">{formatCurrency(basePrice)}</span>
              </div>

              {costFactors.map((costFactor) => {
                let total = parseFloat(costFactor.cost_amount);
                if (costFactor.frequency === 'monthly') total *= 12 * years;
                else if (costFactor.frequency === 'yearly') total *= years;

                return (
                  <div className="cost-row" key={costFactor.id}>
                    <span className="cost-row-label">{costFactor.cost_name}</span>
                    <span className="cost-row-value" style={{ color: 'var(--danger)' }}>
                      +{formatCurrency(total)}
                    </span>
                  </div>
                );
              })}

              <div className="cost-row" style={{ marginTop: '8px' }}>
                <span className="cost-row-label">Hidden Costs</span>
                <span className="cost-row-value" style={{ color: 'var(--danger)' }}>
                  +{formatCurrency(hiddenCost)}
                </span>
              </div>

              <div className="cost-total">
                <div className="cost-row">
                  <span className="cost-row-label">{years}-Year Total</span>
                  <span className="cost-row-value">{formatCurrency(totalCost)}</span>
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <Link to="/compare" className="btn" style={{ width: '100%', justifyContent: 'center' }}>
                  Compare Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
