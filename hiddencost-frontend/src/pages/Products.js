import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, productsAPI } from '../utils/api';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      const data = response.data || [];
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

  useEffect(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      setFiltered(products);
      return;
    }

    setFiltered(
      products.filter((product) =>
        [product.name, product.brand_name, product.product_type, product.description]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query))
      )
    );
  }, [products, search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product and all of its cost factors?')) return;

    setDeletingId(id);
    try {
      await productsAPI.delete(id);
      setProducts((current) => current.filter((product) => product.id !== id));
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
            <p>Track base prices, recurring costs, and compare ownership totals.</p>
          </div>
          <Link to="/products/new" className="btn btn-primary">
            Add Product
          </Link>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="products-toolbar">
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search products, brands, and types..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <span className="products-count">
            {filtered.length} product{filtered.length === 1 ? '' : 's'}
          </span>
        </div>

        {loading ? (
          <div className="loading-center">
            <div className="spinner" />
            <span>Loading products...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state card">
            <h3>{search ? 'No matching products' : 'No products yet'}</h3>
            <p>
              {search
                ? `No products match "${search}".`
                : 'Create your first product to start tracking hidden costs.'}
            </p>
            {!search && (
              <Link to="/products/new" className="btn btn-primary" style={{ marginTop: '16px' }}>
                Create First Product
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
                    <th>Type</th>
                    <th>Base Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="product-cell-name">{product.name}</div>
                        {product.description && (
                          <div className="product-cell-model">{product.description}</div>
                        )}
                      </td>
                      <td>{product.brand_name || <span className="text-muted">--</span>}</td>
                      <td>{product.product_type || <span className="text-muted">--</span>}</td>
                      <td className="price-cell">{formatCurrency(product.base_price)}</td>
                      <td>
                        <div className="row-actions">
                          <Link to={`/products/${product.id}`} className="btn btn-sm">
                            View
                          </Link>
                          <Link to={`/products/${product.id}/edit`} className="btn btn-sm">
                            Edit
                          </Link>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(product.id)}
                            disabled={deletingId === product.id}
                          >
                            {deletingId === product.id ? 'Deleting...' : 'Delete'}
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
