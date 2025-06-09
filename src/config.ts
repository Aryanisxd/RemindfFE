import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if it exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific status codes
      switch (error.response.status) {
        case 403:
          toast.error('User already exists or there is another issue');
          break;
        case 401:
          toast.error('Unauthorized access');
          break;
        case 409:
          toast.error('User already exists');
          break;
        default:
          toast.error(error.response.data?.message || 'An error occurred');
      }
    } else {
      toast.error('Network error. Please try again.');
    }
    return Promise.reject(error);
  }
);

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

export const api = {
  auth: {
    signin: async (email: string, password: string): Promise<ApiResponse> => {
      try {
        const response = await axiosInstance.post('/signin', { email, password });
        if (response.data?.token) {
          localStorage.setItem('token', response.data.token);
        }
        return { data: response.data };
      } catch (error: any) {
        return { error: error.response?.data?.message || 'Sign in failed' };
      }
    },

    signup: async (name: string, email: string, password: string): Promise<ApiResponse> => {
      try {
        const response = await axiosInstance.post('/signup', { name, email, password });
        if (response.data?.token) {
          localStorage.setItem('token', response.data.token);
        }
        return { data: response.data };
      } catch (error: any) {
        return { error: error.response?.data?.message || 'Sign up failed' };
      }
    },

    signout: async (): Promise<ApiResponse> => {
      try {
        await axiosInstance.post('/signout');
        localStorage.removeItem('token');
        return { data: { message: 'Signed out successfully' } };
      } catch (error: any) {
        return { error: error.response?.data?.message || 'Sign out failed' };
      }
    },

    checkAuth: async (): Promise<ApiResponse> => {
      try {
        const response = await axiosInstance.get('/check-auth');
        return { data: response.data };
      } catch (error: any) {
        return { error: error.response?.data?.message || 'Authentication check failed' };
      }
    }
  }
};
