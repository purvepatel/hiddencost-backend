import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsAPI, brandsAPI } from '../utils/api';
import './Products.css';

// ============================================================
// ProductForm — Create & Edit product form (CLO3, CLO4)
// ============================================================

const CATEGORIES = ['Electronics', 'Appliances', 'Automotive', 'Software', 'Clothing', 'Tools', 'Furniture', 'Other'];

function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', brand_id: '', category: '', model_number: '',
    base_price: '', description: '', is_active: true,
  });
  const [brands, setBrands] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  // Load brands + existing product if editing
  useEffect(() => {
    const load = async () => {
      try {
        const brandsRes = await brandsAPI.getAll();
        setBrands(brandsRes.data?.data || []);

        if (isEdit) {
          const productRes = await productsAPI.getById(id);
          const p = productRes.data?.data;
          if (p) {
            setFormData({
              name: p.name || '',
              brand_id: p.brand_id || '',
              category: p.category || '',
              model_number: p.model_number || '',
              base_price: p.base_price || '',
              description: p.description || '',
              is_active: p.is_active !== false,
            });
          }
        }
      } catch (err) {
        setServerError('Failed to load data.');
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    setErrors({ ...errors, [name]: '' });
    setServerError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.base_price) newErrors.base_price = 'Base price is required';
    else if (isNaN(formData.base_price) || parseFloat(formData.base_price) < 0)
      newErrors.base_price = 'Must be a valid non-negative number';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        base_price: parseFloat(formData.base_price),
        brand_id: formData.brand_id || null,
      };

      if (isEdit) {
        await productsAPI.update(id, payload);
        navigate(`/products/${id}`);
      } else {
        const res = await productsAPI.create(payload);
        navigate(`/products/${res.data?.data?.id || ''}`);
      }
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="loading-center">
        <div className="spinner" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="product-form-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>{isEdit ? 'Edit Product' : 'Add Product'}</h1>
            <p>{isEdit ? 'Update product details' : 'Add a new product to track its costs'}</p>
          </div>
          <button className="btn" onClick={() => navigate(-1)}>← Back</button>
        </div>

        <div className="form-card card">
          {serverError && <div className="alert alert-error">{serverError}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3 className="form-section-title">Basic Information</h3>

              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? 'input-error' : ''}`}
                  placeholder="e.g. Toyota Camry 2024"
                  autoFocus
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <select name="brand_id" value={formData.brand_id} onChange={handleChange} className="form-select">
                    <option value="">— No Brand —</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="form-select">
                    <option value="">— Select Category —</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Model Number</label>
                  <input
                    type="text"
                    name="model_number"
                    value={formData.model_number}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. CAM-2024-XSE"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Pricing</h3>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Base Price (CAD) *</label>
                  <div className="input-prefix-wrap">
                    <span className="input-prefix">$</span>
                    <input
                      type="number"
                      name="base_price"
                      value={formData.base_price}
                      onChange={handleChange}
                      className={`form-input input-prefixed ${errors.base_price ? 'input-error' : ''}`}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  {errors.base_price && <span className="form-error">{errors.base_price}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">Active product</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Description</h3>
              <div className="form-group">
                <label className="form-label">Notes / Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Additional details about this product..."
                  rows={4}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn" onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <><div className="spinner" /> Saving...</>
                ) : (
                  isEdit ? 'Update Product' : 'Create Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductForm;
