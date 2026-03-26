import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { brandsAPI } from '../utils/api';
import './Brands.css';

// ============================================================
// Brands — Full CRUD with modal form (CLO3, CLO4)
// ============================================================

function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({ name: '', country: '', description: '' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch all brands
  const fetchBrands = async () => {
    try {
      const res = await brandsAPI.getAll();
      setBrands(res.data?.data || []);
    } catch (err) {
      setError('Failed to load brands. Make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Open modal for create
  const openCreate = () => {
    setEditingBrand(null);
    setFormData({ name: '', country: '', description: '' });
    setFormError('');
    setShowModal(true);
  };

  // Open modal for edit
  const openEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({ name: brand.name, country: brand.country || '', description: brand.description || '' });
    setFormError('');
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingBrand(null);
    setFormData({ name: '', country: '', description: '' });
    setFormError('');
  };

  // Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  // Save (create or update)
  const handleSave = async (e) => {
    e.preventDefault();
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

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this brand? Products linked to it may also be affected.')) return;
    setDeletingId(id);
    try {
      await brandsAPI.delete(id);
      setBrands(brands.filter((b) => b.id !== id));
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
            <p>Manage manufacturers and brands for your products</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            + Add Brand
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
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏷️</div>
            <h3>No brands yet</h3>
            <p>Add your first brand to get started</p>
            <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={openCreate}>
              + Add Brand
            </button>
          </div>
        ) : (
          <div className="brands-grid">
            {brands.map((brand) => (
              <div key={brand.id} className="brand-card card">
                <div className="brand-card-header">
                  <div className="brand-avatar">
                    {brand.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="brand-info">
                    <h3 className="brand-name">{brand.name}</h3>
                    {brand.country && (
                      <span className="badge badge-info">{brand.country}</span>
                    )}
                  </div>
                </div>

                {brand.description && (
                  <p className="brand-desc">{brand.description}</p>
                )}

                <div className="brand-meta">
                  <span className="brand-products">
                    {brand.product_count || 0} product{brand.product_count !== 1 ? 's' : ''}
                  </span>
                  <span className="brand-date">
                    {new Date(brand.created_at).toLocaleDateString('en-CA')}
                  </span>
                </div>

                <div className="brand-actions">
                  <button className="btn btn-sm" onClick={() => openEdit(brand)}>
                    Edit
                  </button>
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

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingBrand ? 'Edit Brand' : 'Add Brand'}</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
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
                  placeholder="e.g. Toyota"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Country of Origin</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Japan"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Brief description of the brand..."
                  rows={3}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><div className="spinner" /> Saving...</> : (editingBrand ? 'Update Brand' : 'Create Brand')}
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
