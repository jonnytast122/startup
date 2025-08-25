// src/api/axiosClient.js

import axios from 'axios';

const api = axios.create({
  // no baseURL, so you must use full or relative URLs in requests
  withCredentials: true, // always send cookies
  headers: {
    'Content-Type': 'application/json',
    // 'Bearer': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODY2MjQwY2ExMGE2YTIwNmY5NGI4ZmQiLCJpYXQiOjE3NTU0MDYyNDQsImV4cCI6MTc3MzQwNjI0NCwidHlwZSI6ImFjY2VzcyJ9.SGNGFL7rLqMRK4TwsgbfehZn6MBYLpf2MLaNHzgW6QI'
  },
});

// Global request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`config ${config.headers}`);
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
