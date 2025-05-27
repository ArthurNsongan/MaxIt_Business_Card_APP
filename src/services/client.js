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

export const apiClientV2 = axios.create({
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

// Request interceptor
apiClientV2.interceptors.request.use(
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

apiClientV2.interceptors.response.use(
  (response) => {
    // Success response - wrap in result object
    return {
      success: true,
      data: response.data,
      status: response.status,
      message: response.statusText || 'Request successful',
      error: null
    };
  },
  (error) => {
    let errorMessage = 'An error occurred';
    let errorCode = 'UNKNOWN_ERROR';
    let statusCode = null;

    if (error.response) {
      // Server responded with error status
      statusCode = error.response.status;
      errorMessage = error.response.data?.message || error.response.statusText || errorMessage;
      
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
          errorCode = 'UNAUTHORIZED';
          errorMessage = 'Session expired. Please login again.';
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden');
          errorCode = 'FORBIDDEN';
          errorMessage = 'Access denied';
          break;
        case 404:
          errorCode = 'NOT_FOUND';
          errorMessage = 'Resource not found';
          break;
        case 422:
          errorCode = 'VALIDATION_ERROR';
          errorMessage = 'Validation failed';
          break;
        case 500:
          // Server error
          console.error('Server error');
          errorCode = 'SERVER_ERROR';
          errorMessage = 'Internal server error';
          break;
        default:
          errorCode = `HTTP_${error.response.status}`;
          break;
      }
    } else if (error.request) {
      // Network error
      console.error('Network error');
      errorCode = 'NETWORK_ERROR';
      errorMessage = 'Network connection failed';
    } else if (error.code === 'ECONNABORTED') {
      // Timeout error
      errorCode = 'TIMEOUT_ERROR';
      errorMessage = 'Request timeout';
    }

    // Return consistent error result object
    return {
      success: false,
      data: null,
      status: statusCode,
      message: errorMessage,
      error: {
        code: errorCode,
        message: errorMessage,
        details: error.response?.data || null,
        originalError: error
      }
    };
  }
);


export default apiClient;