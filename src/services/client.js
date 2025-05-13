// src/services/api/client.js - Base API client setup
import axios from 'axios';

export const apiAddress = import.meta.env.VITE_API_URL;

// Create a base axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from storage
    const token = localStorage.getItem('auth_token');
    
    // Add authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;
        case 500:
          // Server error
          console.error('Server error');
          break;
        default:
          break;
      }
    } else if (error.request) {
      // Network error
      console.error('Network error');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;