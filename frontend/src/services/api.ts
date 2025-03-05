import axios from 'axios';

// This file will be updated with the actual API endpoints once provided
const api = axios.create({
  // baseURL: process.env.REACT_APP_API_URL, // This will be updated with the actual API URL
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;