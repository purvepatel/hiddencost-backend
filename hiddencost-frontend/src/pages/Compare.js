import React, { useState, useEffect } from 'react';
import { productsAPI, costFactorsAPI, formatCurrency, calculateTotalCost } from '../utils/api';
import './Compare.css';

// ============================================================
// Compare — Side-by-side product cost comparison (CLO3, CLO4)
// ============================================================

function Compare() {
  const [products, setProducts] = useState([]);
  const [costFactors, setCostFactors] = useState([]);
  const [selected, setSelected] = useState([null, null]);
  const [years, setYears] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, cfRes] = await Promise.all([
          productsAPI.getAll(),
          costFactorsAPI.getAll(),
        ]);
        setProducts(productRes.data?.data || []);
        setCostFactors(cfRes.data?.data || []);
      } catch (err) {
        console.error('Compare fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getProductCostFactors = (productId) =>
    costFactors.filter((cf) => cf.product_id === parseInt(productId));

  const getSelectedProduct = (idx) =>
    products.find((p) => p.id === parseInt(selected[idx]));

  const getTotalCost = (idx) => {
    const p = getSelectedProduct(idx);
    if (!p) return 0;
    return calculateTotalCost(p, getProductCostFactors(p.id), years);
  };

  const handleSelect = (idx, value) => {
    const newSelected = [...selected];
    newSelected[idx] = value;
    setSelected(newSelected);
  };

  const addSlot = () => {
    if (selected.length < 4) setSelected([...selected, null]);
  };

  const removeSlot = (idx) => {
    if (selected.length <= 2) return;
    setSelected(selected.filter((_, i) => i !== idx));
  };

  // Find winner (lowest total cost)
  const costs = selected.map((_, idx) => {
    const p = getSelectedProduct(idx);
    return p ? getTotalCost(idx) : Infinity;
  });
  const minCost = Math.min(...costs.filter((c) => c !== Infinity));

  if (loading) return <div className="loading-center"><div className="spinner" /><span>Loading...</span></div>;

  return (
    <div className="compare-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>Compare Products</h1>
            <p>See the true cost side-by-side — beyond the sticker price</p>
          </div>
        </div>

        {/* Controls */}
        <div className="compare-controls card">
          <div className="controls-left">
            <span className="control-label">Time Horizon:</span>
            <div className="year-selector">
              {[1, 3, 5, 10].map((y) => (
                <button
                  key={y}
                  className={`btn btn-sm year-btn ${years === y ? 'active' : ''}`}
                  onClick={() => setYears(y)}
                >
                  {y} Year{y > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>
          {selected.length < 4 && (
            <button className="btn btn-sm" onClick={addSlot}>+ Add Column</button>
          )}
        </div>

        {/* Comparison Grid */}
        <div className={`compare-grid cols-${selected.length}`}>
          {selected.map((selectedId, idx) => {
            const product = getSelectedProduct(idx);
            const productCfs = product ? getProductCostFactors(product.id) : [];
            const total = product ? getTotalCost(idx) : 0;
            const isWinner = product && total === minCost && costs.filter((c) => c !== Infinity).length > 1;
            const hiddenCost = product ? total - parseFloat(product.base_price) : 0;

            return (
              <div key={idx} className={`compare-col ${isWinner ? 'compare-winner' : ''}`}>
                {/* Column Header */}
                <div className="compare-col-header">
                  {isWinner && (
                    <div className="winner-badge">⚡ Best Value</div>
                  )}
                  <select
                    className="form-select compare-select"
                    value={selectedId || ''}
                    onChange={(e) => handleSelect(idx, e.target.value)}
                  >
                    <option value="">— Select Product —</option>
                    {products.map((p) => (
                      <option
                        key={p.id}
                        value={p.id}
                        disabled={selected.includes(String(p.id)) && String(p.id) !== String(selectedId)}
                      >
                        {p.name}
                      </option>
                    ))}
                  </select>
                  {selected.length > 2 && (
                    <button className="remove-col" onClick={() => removeSlot(idx)} title="Remove column">✕</button>
                  )}
                </div>

                {product ? (
                  <div className="compare-col-body">
                    {/* Product Info */}
                    <div className="compare-product-name">{product.name}</div>
                    {product.brand_name && (
                      <span className="badge badge-info">{product.brand_name}</span>
                    )}

                    {/* Base Price */}
                    <div className="compare-section">
                      <div className="compare-section-label">Base Price</div>
                      <div className="compare-base-price">{formatCurrency(product.base_price)}</div>
                    </div>

                    {/* Cost Factors */}
                    <div className="compare-section">
                      <div className="compare-section-label">Hidden Costs ({years}yr)</div>
                      {productCfs.length === 0 ? (
                        <div className="compare-no-cf">No costs tracked</div>
                      ) : (
                        <div className="compare-cf-list">
                          {productCfs.map((cf) => {
                            let cfTotal;
                            if (cf.frequency === 'monthly') cfTotal = parseFloat(cf.amount) * 12 * years;
                            else if (cf.frequency === 'yearly') cfTotal = parseFloat(cf.amount) * years;
                            else cfTotal = parseFloat(cf.amount);
                            return (
                              <div key={cf.id} className="compare-cf-row">
                                <span className="compare-cf-name">{cf.name}</span>
                                <span className="compare-cf-amount">+{formatCurrency(cfTotal)}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Totals */}
                    <div className="compare-totals">
                      <div className="compare-hidden-total">
                        <span>Hidden Costs</span>
                        <span style={{ color: 'var(--danger)' }}>+{formatCurrency(hiddenCost)}</span>
                      </div>
                      <div className="compare-grand-total">
                        <span>{years}-Year Total</span>
                        <span className={isWinner ? 'winner-price' : ''}>{formatCurrency(total)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="compare-empty-col">
                    <div>Select a product<br />to compare</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Savings insight */}
        {costs.filter((c) => c !== Infinity).length >= 2 && (
          <div className="compare-insight card">
            <div className="insight-icon">💡</div>
            <div>
              <strong>Insight:</strong>{' '}
              {(() => {
                const validCosts = costs.filter((c) => c !== Infinity);
                const maxCost = Math.max(...validCosts);
                const savings = maxCost - minCost;
                return `Over ${years} years, the cheapest option saves you ${formatCurrency(savings)} compared to the most expensive — that's ${formatCurrency(savings / years)}/year.`;
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Compare;
