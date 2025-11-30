import { LoginRequestDTO, RegisterRequest } from '../../generated-typescript';

// Auth Form Types
export interface LoginForm extends LoginRequestDTO {
  rememberMe?: boolean;
}

export interface RegisterForm extends RegisterRequest {
  confirmPassword: string;
  agreeToTerms: boolean;
}

// Auth Response Types (assuming these match backend response)
export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  role: 'USER' | 'ADMIN';
  emailVerified?: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Auth State Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

}


// Auth Error Types
export interface AuthError {
  message: string;
  status?: number;
  field?: string;
}

// Form Validation Types
export interface FormErrors {
  email?: string;
  password?: string;
  fullName?: string;
  phone?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
  general?: string;
}

// Login/Register Form Props
export interface AuthFormProps {
  onSuccess?: (user: User) => void;
  onError?: (error: AuthError) => void;
  redirectTo?: string;
}


