import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Log error in development
    if (import.meta.env.DEV) {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }

    // Handle different error types
    let message = 'Something went wrong';
    
    if (error.response) {
      // Server responded with error
      message = error.response.data?.error || error.response.data?.message || `Server error: ${error.response.status}`;
    } else if (error.request) {
      // Request made but no response
      message = 'Unable to connect to server. Please check your internet connection.';
    } else {
      // Error in request setup
      message = error.message || 'An unexpected error occurred';
    }
    
    return Promise.reject(new Error(message));
  }
);

export default api;
