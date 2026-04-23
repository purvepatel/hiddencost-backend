import React, { useEffect, useState } from 'react';
import { brandsAPI } from '../utils/api';
import './Brands.css';

function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: '', description: '' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchBrands = async () => {
    try {
      const response = await brandsAPI.getAll();
      setBrands(response.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load brands.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const openCreate = () => {
    setEditingBrand(null);
    setFormData({ name: '', category: '', description: '' });
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name || '',
      category: brand.category || '',
      description: brand.description || '',
    });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBrand(null);
    setFormData({ name: '', category: '', description: '' });
    setFormError('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setFormError('');
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Brand name is required.');
      return;
    }

    setSaving(true);
    try {
      if (editingBrand) {
        await brandsAPI.update(editingBrand.id, formData);
      } else {
        await brandsAPI.create(formData);
      }
      await fetchBrands();
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save brand.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this brand? Products linked to it may also be affected.')) return;

    setDeletingId(id);
    try {
      await brandsAPI.delete(id);
      setBrands((current) => current.filter((brand) => brand.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete brand.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="brands-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>Brands</h1>
            <p>Manage the manufacturers available when you create products.</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            Add Brand
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-center">
            <div className="spinner" />
            <span>Loading brands...</span>
          </div>
        ) : brands.length === 0 ? (
          <div className="empty-state card">
            <h3>No brands yet</h3>
            <p>Create your first brand so products can be categorized correctly.</p>
            <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={openCreate}>
              Add Brand
            </button>
          </div>
        ) : (
          <div className="brands-grid">
            {brands.map((brand) => (
              <div key={brand.id} className="brand-card card">
                <div className="brand-card-header">
                  <div className="brand-avatar">{brand.name.charAt(0).toUpperCase()}</div>
                  <div className="brand-info">
                    <h3 className="brand-name">{brand.name}</h3>
                    {brand.category && <span className="badge badge-info">{brand.category}</span>}
                  </div>
                </div>

                {brand.description && <p className="brand-desc">{brand.description}</p>}

                <div className="brand-meta">
                  <span className="brand-products">{brand.category || 'General'}</span>
                  <span className="brand-date">
                    {brand.created_at ? new Date(brand.created_at).toLocaleDateString('en-CA') : 'New'}
                  </span>
                </div>

                <div className="brand-actions">
                  <button className="btn btn-sm" onClick={() => openEdit(brand)}>Edit</button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(brand.id)}
                    disabled={deletingId === brand.id}
                  >
                    {deletingId === brand.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingBrand ? 'Edit Brand' : 'Add Brand'}</h2>
              <button className="modal-close" onClick={closeModal}>x</button>
            </div>

            {formError && <div className="alert alert-error">{formError}</div>}

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Brand Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Example: Toyota"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Example: Automotive"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  rows={3}
                  placeholder="Add a short description of the brand..."
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editingBrand ? 'Update Brand' : 'Create Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Brands;
