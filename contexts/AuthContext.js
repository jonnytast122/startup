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

  // Restore from storage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login helper
  const login = ({ tokens, user }) => {
    localStorage.setItem("token", tokens.access.token);
    localStorage.setItem("refreshToken", tokens.refresh.token);
    localStorage.setItem("user", JSON.stringify(user));

    Cookies.set("token", tokens.access.token, {
      expires: 1,
      sameSite: "lax",
    });

    setToken(tokens.access.token);
    setUser(user);
  };

  // Register (does not log in immediately)
  const register = async (formData) => {
    const res = await fetch(apiRoutes.auth.register, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error("Registration failed");
    const data = await res.json();

    // Save token + user temporarily so we can verify phone
    setToken(data.tokens.access.token);
    setUser(data.user);

    return data; // return so UI can trigger send-verification-phone
  };

  // Verify phone (logs in after OTP is correct)
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

    // Now log user in fully
    login({ tokens: data.tokens, user: data.user });
    return data;
  };

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
