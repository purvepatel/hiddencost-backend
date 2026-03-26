import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productsAPI, formatCurrency } from '../utils/api';
import './Products.css';

// ============================================================
// Products — List page with search and delete (CLO3, CLO4)
// ============================================================

function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await productsAPI.getAll();
      const data = res.data?.data || [];
      setProducts(data);
      setFiltered(data);
    } catch (err) {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Search filter
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(products);
    } else {
      const q = search.toLowerCase();
      setFiltered(products.filter(
        (p) => p.name?.toLowerCase().includes(q) || p.brand_name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)
      ));
    }
  }, [search, products]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product and all its cost factors?')) return;
    setDeletingId(id);
    try {
      await productsAPI.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="products-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>Products</h1>
            <p>Track and compare products with their hidden costs</p>
          </div>
          <Link to="/products/new" className="btn btn-primary">
            + Add Product
          </Link>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Search */}
        <div className="products-toolbar">
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search products, brands, categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="products-count">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="loading-center">
            <div className="spinner" />
            <span>Loading products...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state card">
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <h3>{search ? 'No results found' : 'No products yet'}</h3>
            <p>{search ? `No products match "${search}"` : 'Add your first product to start tracking costs'}</p>
            {!search && (
              <Link to="/products/new" className="btn btn-primary" style={{ marginTop: '16px' }}>
                + Add First Product
              </Link>
            )}
          </div>
        ) : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Base Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="product-cell-name">{product.name}</div>
                        {product.model_number && (
                          <div className="product-cell-model">#{product.model_number}</div>
                        )}
                      </td>
                      <td>{product.brand_name || <span className="text-muted">—</span>}</td>
                      <td>
                        {product.category ? (
                          <span className="badge badge-info">{product.category}</span>
                        ) : '—'}
                      </td>
                      <td className="price-cell">{formatCurrency(product.base_price)}</td>
                      <td>
                        <span className={`badge ${product.is_active ? 'badge-success' : 'badge-danger'}`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <Link to={`/products/${product.id}`} className="btn btn-sm">View</Link>
                          <Link to={`/products/${product.id}/edit`} className="btn btn-sm">Edit</Link>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(product.id)}
                            disabled={deletingId === product.id}
                          >
                            {deletingId === product.id ? '...' : 'Del'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
