# HiddenCost Frontend — React SPA

A React single-page application for tracking and comparing the **true long-term cost of ownership** for any product.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env → set REACT_APP_API_URL to your backend URL

# 3. Start development server
npm start

# App runs at: http://localhost:3000
```

## 📁 Project Structure

```
src/
├── context/
│   └── AuthContext.js        # Global auth state + JWT management (CLO5)
├── components/
│   ├── Navbar.js             # Navigation with auth state (CLO3)
│   └── ProtectedRoute.js     # Route guard for auth (CLO5)
├── pages/
│   ├── Home.js               # Landing page
│   ├── Login.js              # Login form with state (CLO3)
│   ├── Register.js           # Register form with validation (CLO3)
│   ├── Dashboard.js          # Stats overview (CLO4)
│   ├── Brands.js             # Brands CRUD with modal (CLO3, CLO4)
│   ├── Products.js           # Products list + search (CLO3, CLO4)
│   ├── ProductForm.js        # Create/Edit product form (CLO3, CLO4)
│   ├── ProductDetail.js      # Product + cost factors (CLO3, CLO4)
│   ├── Compare.js            # Side-by-side comparison (CLO3, CLO4)
│   └── NotFound.js           # 404 page
├── utils/
│   └── api.js                # Axios API service layer (CLO4)
├── App.js                    # Router + routes (CLO3)
└── index.js                  # Entry point
```

## 🎯 Course Learning Outcomes

| CLO | Description | Implementation |
|-----|-------------|----------------|
| CLO3 | Component-based SPA with React | All pages as functional components with hooks |
| CLO4 | Frontend-Backend API integration | `axios` calls via `utils/api.js` |
| CLO5 | Authentication & Authorization | JWT stored in localStorage, `AuthContext`, `ProtectedRoute` |

## 🛠️ Tech Stack

- **React 18** — Functional components + hooks
- **React Router v6** — Client-side routing
- **Axios** — HTTP client for API calls
- **Context API** — Global auth state management

## 🔐 Authentication Flow

1. User registers/logs in → JWT returned from API
2. Token saved to `localStorage` + set in `axios` default headers
3. `AuthContext` exposes `user`, `isAuthenticated`, `login`, `logout`
4. `ProtectedRoute` wraps private routes — redirects to `/login` if not authenticated

## 📄 Environment Variables

```
REACT_APP_API_URL=http://localhost:5000/api
```

For production (Netlify/Vercel), set:
```
REACT_APP_API_URL=https://hiddencost-api.onrender.com/api
```

## 🌐 Deployment (Netlify)

```bash
# Build production bundle
npm run build

# Deploy build/ folder to Netlify
# Set environment variable REACT_APP_API_URL in Netlify dashboard
```

Add `public/_redirects`:
```
/* /index.html 200
```

## 🧪 Pages Overview

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page |
| `/login` | Public | Sign in |
| `/register` | Public | Create account |
| `/dashboard` | 🔒 Auth | Stats + overview |
| `/brands` | 🔒 Auth | Brands CRUD |
| `/products` | 🔒 Auth | Products list |
| `/products/new` | 🔒 Auth | Add product |
| `/products/:id` | 🔒 Auth | Product detail + cost factors |
| `/products/:id/edit` | 🔒 Auth | Edit product |
| `/compare` | 🔒 Auth | Side-by-side comparison |

---

**Student:** Purve Mahesh Patel (90484003)  
**Course:** PROG2500 — Open Source Full Stack Development  
**Sprint:** 2 (Frontend)
