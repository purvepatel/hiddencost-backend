import React, { useEffect, useState } from 'react';
import { calculateTotalCost, costFactorsAPI, formatCurrency, productsAPI } from '../utils/api';
import './Compare.css';

function Compare() {
  const [products, setProducts] = useState([]);
  const [costFactors, setCostFactors] = useState([]);
  const [selected, setSelected] = useState([null, null]);
  const [years, setYears] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, costFactorsResponse] = await Promise.all([
          productsAPI.getAll(),
          costFactorsAPI.getAll(),
        ]);
        setProducts(productsResponse.data || []);
        setCostFactors(costFactorsResponse.data || []);
      } catch (err) {
        setError('Failed to load products for comparison.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProductCostFactors = (productId) =>
    costFactors.filter((costFactor) => costFactor.product_id === parseInt(productId, 10));

  const getSelectedProduct = (index) =>
    products.find((product) => product.id === parseInt(selected[index], 10));

  const getTotalCost = (index) => {
    const product = getSelectedProduct(index);
    if (!product) return 0;
    return calculateTotalCost(product, getProductCostFactors(product.id), years);
  };

  const handleSelect = (index, value) => {
    setSelected((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  };

  const addSlot = () => {
    if (selected.length < 4) {
      setSelected((current) => [...current, null]);
    }
  };

  const removeSlot = (index) => {
    if (selected.length <= 2) return;
    setSelected((current) => current.filter((_, currentIndex) => currentIndex !== index));
  };

  const costs = selected.map((_, index) => {
    const product = getSelectedProduct(index);
    return product ? getTotalCost(index) : Infinity;
  });
  const validCosts = costs.filter((cost) => cost !== Infinity);
  const minCost = validCosts.length > 0 ? Math.min(...validCosts) : Infinity;

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner" />
        <span>Loading comparison data...</span>
      </div>
    );
  }

  return (
    <div className="compare-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>Compare Products</h1>
            <p>See ownership totals side by side before you decide.</p>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="compare-controls card">
          <div className="controls-left">
            <span className="control-label">Time Horizon</span>
            <div className="year-selector">
              {[1, 3, 5, 10].map((value) => (
                <button
                  key={value}
                  className={`btn btn-sm year-btn ${years === value ? 'active' : ''}`}
                  onClick={() => setYears(value)}
                >
                  {value} Year{value > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>
          {selected.length < 4 && (
            <button className="btn btn-sm" onClick={addSlot}>Add Column</button>
          )}
        </div>

        <div className={`compare-grid cols-${selected.length}`}>
          {selected.map((selectedId, index) => {
            const product = getSelectedProduct(index);
            const productCostFactors = product ? getProductCostFactors(product.id) : [];
            const total = product ? getTotalCost(index) : 0;
            const hiddenCost = product ? total - parseFloat(product.base_price) : 0;
            const isWinner = product && total === minCost && validCosts.length > 1;

            return (
              <div key={index} className={`compare-col ${isWinner ? 'compare-winner' : ''}`}>
                <div className="compare-col-header">
                  {isWinner && <div className="winner-badge">Best Value</div>}
                  <select
                    className="form-select compare-select"
                    value={selectedId || ''}
                    onChange={(event) => handleSelect(index, event.target.value)}
                  >
                    <option value="">Select Product</option>
                    {products.map((productOption) => (
                      <option
                        key={productOption.id}
                        value={productOption.id}
                        disabled={
                          selected.includes(String(productOption.id)) &&
                          String(productOption.id) !== String(selectedId)
                        }
                      >
                        {productOption.name}
                      </option>
                    ))}
                  </select>
                  {selected.length > 2 && (
                    <button className="remove-col" onClick={() => removeSlot(index)} title="Remove column">
                      x
                    </button>
                  )}
                </div>

                {product ? (
                  <div className="compare-col-body">
                    <div className="compare-product-name">{product.name}</div>
                    <div className="detail-meta">
                      {product.brand_name && <span className="badge badge-info">{product.brand_name}</span>}
                      {product.product_type && <span className="badge badge-accent">{product.product_type}</span>}
                    </div>

                    <div className="compare-section">
                      <div className="compare-section-label">Base Price</div>
                      <div className="compare-base-price">{formatCurrency(product.base_price)}</div>
                    </div>

                    <div className="compare-section">
                      <div className="compare-section-label">Hidden Costs ({years}yr)</div>
                      {productCostFactors.length === 0 ? (
                        <div className="compare-no-cf">No tracked costs</div>
                      ) : (
                        <div className="compare-cf-list">
                          {productCostFactors.map((costFactor) => {
                            let factorTotal = parseFloat(costFactor.cost_amount);
                            if (costFactor.frequency === 'monthly') factorTotal *= 12 * years;
                            else if (costFactor.frequency === 'yearly') factorTotal *= years;

                            return (
                              <div key={costFactor.id} className="compare-cf-row">
                                <span className="compare-cf-name">{costFactor.cost_name}</span>
                                <span className="compare-cf-amount">+{formatCurrency(factorTotal)}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

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
                    <div>Select a product to compare</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {validCosts.length >= 2 && (
          <div className="compare-insight card">
            <div className="insight-icon">Insight</div>
            <div>
              <strong>Cost difference:</strong>{' '}
              {formatCurrency(Math.max(...validCosts) - minCost)} separates the cheapest option from the most expensive one over {years} years.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Compare;
