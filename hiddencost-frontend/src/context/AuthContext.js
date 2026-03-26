import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("hc_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Called from Login.js with { token, user }
  const login = (data) => {
    localStorage.setItem("hc_token", data.token);
    localStorage.setItem("hc_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("hc_token");
    localStorage.removeItem("hc_user");
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}