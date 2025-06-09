import axios from 'axios';
import { toast } from 'sonner';

// Use environment variable for API URL or fallback to default
const API_BASE_URL = 'http://localhost:8080/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 10000, // Increase timeout to 10 seconds
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add CORS headers
    config.headers['Access-Control-Allow-Origin'] = 'http://localhost:3009';
    config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    config.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error:', error);
      toast.error('Unable to connect to the server. Please check your internet connection.');
    } else if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Type for API responses
interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

// API methods
export const apiService = {
  auth: {
    signin: async (email: string, password: string): Promise<ApiResponse> => {
      try {
        const response = await api.post('/signin', { email, password });
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        return { data: response.data };
      } catch (error: any) {
        console.error('Signin API error:', error);
        if (error.code === 'ERR_NETWORK') {
          return { error: 'Unable to connect to the server. Please check your internet connection.' };
        }
        return { error: error.response?.data?.message || 'Failed to sign in' };
      }
    },

    signup: async (name: string, email: string, password: string): Promise<ApiResponse> => {
      try {
        const response = await api.post('/signup', { name, email, password });
        return { data: response.data };
      } catch (error: any) {
        console.error('Signup API error:', error);
        if (error.code === 'ERR_NETWORK') {
          return { error: 'Unable to connect to the server. Please check your internet connection.' };
        }
        if (error.response?.data?.message?.includes('User already exist')) {
          return { error: 'User already exists. Please sign in instead.' };
        }
        return { error: error.response?.data?.message || 'Failed to sign up' };
      }
    },

    signout: async (): Promise<ApiResponse> => {
      try {
        await api.post('/signout');
        localStorage.removeItem('token');
        return { data: { message: 'Signed out successfully' } };
      } catch (error: any) {
        console.error('Signout API error:', error);
        return { error: error.response?.data?.message || 'Failed to sign out' };
      }
    },

    checkAuth: async (): Promise<ApiResponse> => {
      try {
        const response = await api.get('/check-auth');
        return { data: response.data };
      } catch (error: any) {
        console.error('Check auth API error:', error);
        return { error: error.response?.data?.message || 'Failed to check authentication' };
      }
    },
  },
};

export default apiService;
