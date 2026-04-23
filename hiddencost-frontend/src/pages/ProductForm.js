import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { brandsAPI, productsAPI } from '../utils/api';
import './Products.css';

const PRODUCT_TYPES = ['Electronics', 'Automotive', 'Software', 'Appliance', 'Insurance', 'Service', 'Subscription', 'Other'];

function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    brand_id: '',
    product_type: '',
    base_price: '',
    description: '',
  });
  const [brands, setBrands] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    const load = async () => {
      try {
        const brandsResponse = await brandsAPI.getAll();
        setBrands(brandsResponse.data || []);

        if (isEdit) {
          const productResponse = await productsAPI.getById(id);
          const product = productResponse.data;
          setFormData({
            name: product.name || '',
            brand_id: String(product.brand_id || ''),
            product_type: product.product_type || '',
            base_price: product.base_price || '',
            description: product.description || '',
          });
        }
      } catch (err) {
        setServerError('Failed to load form data.');
      } finally {
        setFetching(false);
      }
    };

    load();
  }, [id, isEdit]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setServerError('');
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.name.trim()) nextErrors.name = 'Product name is required';
    if (!formData.brand_id) nextErrors.brand_id = 'Brand is required';
    if (!formData.product_type.trim()) nextErrors.product_type = 'Product type is required';
    if (!formData.base_price) nextErrors.base_price = 'Base price is required';
    else if (Number.isNaN(Number(formData.base_price)) || Number(formData.base_price) < 0) {
      nextErrors.base_price = 'Base price must be a valid non-negative number';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        brand_id: parseInt(formData.brand_id, 10),
        product_type: formData.product_type.trim(),
        base_price: parseFloat(formData.base_price),
        description: formData.description.trim(),
      };

      if (isEdit) {
        await productsAPI.update(id, payload);
        navigate(`/products/${id}`);
      } else {
        const response = await productsAPI.create(payload);
        navigate(`/products/${response.data?.id}`);
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
        <span>Loading form...</span>
      </div>
    );
  }

  return (
    <div className="product-form-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>{isEdit ? 'Edit Product' : 'Add Product'}</h1>
            <p>{isEdit ? 'Update product details and pricing' : 'Create a product record to start cost tracking'}</p>
          </div>
          <button className="btn" onClick={() => navigate(-1)}>Back</button>
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
                  placeholder="Example: Toyota Camry 2024"
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Brand *</label>
                  <select
                    name="brand_id"
                    value={formData.brand_id}
                    onChange={handleChange}
                    className={`form-select ${errors.brand_id ? 'input-error' : ''}`}
                  >
                    <option value="">Select a brand</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                  {errors.brand_id && <span className="form-error">{errors.brand_id}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Product Type *</label>
                  <select
                    name="product_type"
                    value={formData.product_type}
                    onChange={handleChange}
                    className={`form-select ${errors.product_type ? 'input-error' : ''}`}
                  >
                    <option value="">Select a type</option>
                    {PRODUCT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.product_type && <span className="form-error">{errors.product_type}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Pricing</h3>
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
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Description</h3>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Add useful context about the product..."
                  rows={4}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductForm;
