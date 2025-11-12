"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import apiRoutes from "@/constants/ApiRoutes";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Restore session on reload
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // 🟢 LOGIN HANDLER
  const login = ({ tokens, user }) => {
    // Save tokens & user persistently
    localStorage.setItem("token", tokens.access.token);
    localStorage.setItem("refreshToken", tokens.refresh.token);
    localStorage.setItem("user", JSON.stringify(user));

    // ✅ Cookie lasts 30 days (matches backend refresh token)
    Cookies.set("token", tokens.access.token, {
      expires: 30, // 30 days
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    setToken(tokens.access.token);
    setUser(user);
  };

  // 🟢 REGISTER (auto-login support if backend sends tokens)
  const register = async (formData) => {
    const res = await fetch(apiRoutes.auth.register, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error("Registration failed");
    const data = await res.json();

    // If backend response is { user, tokens, company, message }
    const { user, tokens } = data;

    // Save session immediately (same as login)
    login({ tokens, user });

    return data;
  };

  // 🟢 VERIFY PHONE (for OTP flow)
  const verifyPhone = async ({ id, otp }) => {
    const res = await fetch(apiRoutes.auth.verifyPhone, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, otp }),
    });

    if (!res.ok) throw new Error("Phone verification failed");
    const data = await res.json();

    // Fully login the verified user
    login({ tokens: data.tokens, user: data.user });
    return data;
  };

  // 🟢 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    Cookies.remove("token");

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
        register,
        verifyPhone,
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
