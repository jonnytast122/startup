// src/api/axiosClient.js
import axios from "axios";
import Cookies from "js-cookie";
import apiRoutes from "@/constants/ApiRoutes";

const api = axios.create({
  // baseURL can be set here if you have a common API URL
  // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // send cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach access token automatically
api.interceptors.request.use(
  (config) => {
    // Try to get token from localStorage or cookie
    const token = localStorage.getItem("token") || Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        // Refresh access token
        const res = await axios.post(
          apiRoutes.auth.refreshTokens,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        // ✅ Fix: your API returns the tokens directly, not inside res.data.tokens
        const { access, refresh } = res.data;

        // Save new tokens
        localStorage.setItem("token", access.token);
        localStorage.setItem("refreshToken", refresh.token);

        // Retry the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${access.token}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/signin";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
