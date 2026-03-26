import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

// ── Hardcoded demo users (no backend needed) ──────────────────────────────────
const DEMO_USERS = [
  {
    email: "admin@hiddencost.com",
    password: "Admin@123",
    name: "Admin User",
    role: "admin",
    token: "demo-token-admin-abc123",
  },
  {
    email: "user@hiddencost.com",
    password: "User@123",
    name: "Demo User",
    role: "user",
    token: "demo-token-user-xyz789",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    await new Promise((res) => setTimeout(res, 350));

    const matched = DEMO_USERS.find(
      (u) =>
        u.email.toLowerCase() === formData.email.trim().toLowerCase() &&
        u.password === formData.password
    );

    if (matched) {
      login({
        token: matched.token,
        user: { name: matched.name, email: matched.email, role: matched.role },
      });
      navigate("/dashboard");
    } else {
      setError("Invalid email or password. Use a demo account below.");
    }

    setLoading(false);
  };

  const fillDemo = (index) => {
    setFormData({ email: DEMO_USERS[index].email, password: DEMO_USERS[index].password });
    setError("");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Sign In</h2>
        <p className="auth-subtitle">Welcome back to HiddenCost</p>

        <div className="demo-hint">
          <p>🔑 <strong>Demo accounts — click to fill:</strong></p>
          <div className="demo-buttons">
            <button type="button" className="demo-fill-btn" onClick={() => fillDemo(0)}>
              👑 Admin <span>admin@hiddencost.com</span>
            </button>
            <button type="button" className="demo-fill-btn" onClick={() => fillDemo(1)}>
              👤 User <span>user@hiddencost.com</span>
            </button>
          </div>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}