"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Restore auth state from localStorage + cookie
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login and store tokens + user
  const login = ({ tokens, user }) => {
    localStorage.setItem("token", tokens.access.token);
    localStorage.setItem("refreshToken", tokens.refresh.token);
    localStorage.setItem("user", JSON.stringify(user));

    // 👇 set cookie for middleware
    Cookies.set("token", tokens.access.token, {
      expires: 1, // 1 day
      sameSite: "lax",
    });

    setToken(tokens.access.token);
    setUser(user);
  };

  // Logout and cleanup
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    Cookies.remove("token"); // 👈 remove cookie too

    setUser(null);
    setToken(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
