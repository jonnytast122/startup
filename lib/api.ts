// src/api/axiosClient.js

import axios from 'axios';

const api = axios.create({
  // no baseURL, so you must use full or relative URLs in requests
  withCredentials: true, // always send cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Global request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here, logging, etc.
    // Example: console.log('Request:', config);
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor
api.interceptors.response.use(
  (response) => {
    // Optionally handle global responses (e.g., logging)
    return response;
  },
  (error) => {
    // Handle global errors (e.g., logout on 401)
    // Example:
    // if (error.response?.status === 401) {
    //   // logout logic here
    // }
    return Promise.reject(error);
  }
);

export default api;
