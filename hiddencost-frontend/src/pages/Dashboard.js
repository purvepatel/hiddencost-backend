import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

// ── Hardcoded demo data ───────────────────────────────────────────────────────
const STATS = [
  { label: "Total Products",   value: 12,   icon: "📦" },
  { label: "Brands Tracked",   value: 5,    icon: "🏷️" },
  { label: "Comparisons Done", value: 8,    icon: "⚖️" },
  { label: "Avg TCO Savings",  value: "$340", icon: "💰" },
];

const RECENT_PRODUCTS = [
  { id: 1, name: "Dell XPS 15",       brand: "Dell",   tco: "$1,850", date: "Mar 24, 2026" },
  { id: 2, name: "MacBook Pro 14\"",  brand: "Apple",  tco: "$2,400", date: "Mar 22, 2026" },
  { id: 3, name: "HP EliteBook 840",  brand: "HP",     tco: "$1,620", date: "Mar 20, 2026" },
  { id: 4, name: "Lenovo ThinkPad X1",brand: "Lenovo", tco: "$1,780", date: "Mar 18, 2026" },
];

const QUICK_ACTIONS = [
  { label: "Add Product",    to: "/products/new",  icon: "➕" },
  { label: "Compare",        to: "/compare",        icon: "⚖️" },
  { label: "View Brands",    to: "/brands",         icon: "🏷️" },
  { label: "All Products",   to: "/products",       icon: "📦" },
];
// ─────────────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            Welcome back, {user?.name || "User"} 👋
          </h1>
          <p className="dashboard-subtitle">
            Here's a snapshot of your HiddenCost tracker.
          </p>
        </div>
        <span className={`role-badge role-${user?.role}`}>
          {user?.role === "admin" ? "👑 Admin" : "👤 User"}
        </span>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {STATS.map((s) => (
          <div className="stat-card" key={s.label}>
            <span className="stat-icon">{s.icon}</span>
            <div>
              <p className="stat-value">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <section className="section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-grid">
          {QUICK_ACTIONS.map((a) => (
            <Link className="action-card" to={a.to} key={a.label}>
              <span className="action-icon">{a.icon}</span>
              <span>{a.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Products */}
      <section className="section">
        <h2 className="section-title">Recent Products</h2>
        <div className="table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Brand</th>
                <th>Est. TCO</th>
                <th>Added</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_PRODUCTS.map((p, i) => (
                <tr key={p.id}>
                  <td>{i + 1}</td>
                  <td><strong>{p.name}</strong></td>
                  <td>{p.brand}</td>
                  <td className="tco">{p.tco}</td>
                  <td className="muted">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link to="/products" className="view-all-link">View all products →</Link>
      </section>
    </div>
  );
}