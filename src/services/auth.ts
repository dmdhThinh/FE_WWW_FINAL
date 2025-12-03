import { AuthControllerApi, Configuration, LoginRequestDTO } from '../../generated-typescript';
import { BASE_PATH } from '../../generated-typescript/base';

// API Configuration
const createAuthApi = (): AuthControllerApi => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const config = new Configuration({
    basePath: BASE_PATH,
    accessToken: token || undefined,
    baseOptions: {
      withCredentials: true, // 👈 BẮT BUỘC để gửi JSESSIONID
    },
  });

  return new AuthControllerApi(config);
};

// Error handling helper
const handleApiError = (error: any): Error => {
  const msg =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "An unexpected error occurred";
  throw new Error(msg);
};

// Auth Service
export const authService = {
  // Login user
  async login(credentials: LoginRequestDTO) {
    try {
      const api = createAuthApi();
      const response = await api.login(credentials);

      // Extract token from response (assuming the response contains token)
      const data = response.data as any;
      if (data.token) {
        // Store token in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user || data));
        }
      }

      return data;
    } catch (error: any) {
      console.error('Login error:', error);
      throw handleApiError(error);
    }
  },

  // Register user
  async register(userData: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    address: string;
  }) {
    try {
      const api = createAuthApi();
      const response = await api.register(userData);
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw handleApiError(error);
    }
  },

  // Get user profile
  async getProfile() {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        throw new Error('No token found');
      }

      const api = createAuthApi();
      const response = await api.getProfile(`Bearer ${token}`);
      return response.data;
    } catch (error: any) {
      console.error('Get profile error:', error);
      throw handleApiError(error);
    }
  },

  // Verify email
  async verifyEmail(token: string) {
    try {
      const api = createAuthApi();
      const response = await api.verifyEmail(token);
      return response.data;
    } catch (error: any) {
      console.error('Email verification error:', error);
      throw handleApiError(error);
    }
  },

  // Logout user
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  },

  // Get current user
  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get auth token
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }
};

export default authService;