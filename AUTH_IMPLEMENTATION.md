# Authentication Implementation Guide

This guide explains the complete authentication system implemented for the Next.js frontend using the generated TypeScript types from the Spring Boot backend.

## Overview

The authentication system includes:

1. **Auth Service** (`src/services/auth.ts`) - API service layer using generated TypeScript clients
2. **Auth Context** (`src/contexts/AuthContext.tsx`) - Global auth state management
3. **Auth Components** (`src/components/Auth/`) - Login/Register forms and auth pages
4. **Auth Types** (`src/types/auth.ts`) - TypeScript interfaces for auth-related data
5. **Auth Pages** (`src/app/(site)/auth/` and `src/app/(site)/account/`) - Next.js app router pages

## Generated TypeScript Integration

The implementation uses the auto-generated TypeScript client from the backend:

### Key Generated Files Used:
- `generated-typescript/apis/auth-controller-api.ts` - Auth API endpoints
- `generated-typescript/models/login-request-dto.ts` - Login request type
- `generated-typescript/models/register-request.ts` - Register request type
- `generated-typescript/configuration.ts` - API configuration
- `generated-typescript/base.ts` - Base API client

### API Endpoints:
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/user/profile` - Get user profile (requires auth)
- `GET /auth/verify` - Email verification

## Usage Examples

### 1. Basic Authentication Flow

```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { login, register, logout, isAuthenticated, user, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password123');
      // User is now logged in and redirected to account page
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRegister = async () => {
    try {
      await register('user@example.com', 'password123', 'John Doe', '123-456-7890');
      // Registration successful, redirect to login
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleLogout = () => {
    logout();
    // User is now logged out
  };
}
```

### 2. Using Auth Components

```typescript
// Login form only
import LoginForm from '../components/Auth/LoginForm';

function LoginPage() {
  return (
    <LoginForm
      onSuccess={(user) => console.log('Logged in:', user)}
      onError={(error) => console.error('Login error:', error)}
    />
  );
}

// Register form only
import RegisterForm from '../components/Auth/RegisterForm';

function RegisterPage() {
  return (
    <RegisterForm
      onSuccess={(user) => console.log('Registered:', user)}
      onError={(error) => console.error('Registration error:', error)}
    />
  );
}

// Combined auth page with mode switching
import AuthPage from '../components/Auth/AuthPage';

function AuthPageExample() {
  return (
    <AuthPage
      initialMode="login"
      redirectTo="/dashboard"
    />
  );
}
```

### 3. Protected Routes

```typescript
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    router.push('/auth?redirect=' + encodeURIComponent(window.location.pathname));
    return null;
  }

  return <div>Protected content</div>;
}

// Or use the withAuth HOC
import { withAuth } from '../contexts/AuthContext';

function ProtectedComponent() {
  return <div>Protected content</div>;
}

export default withAuth(ProtectedComponent);
```

### 4. Direct API Service Usage

```typescript
import { authService } from '../services/auth';

// Manual login
const handleManualLogin = async () => {
  try {
    const response = await authService.login({
      email: 'user@example.com',
      password: 'password123'
    });

    console.log('Login response:', response);
    // Token automatically stored in localStorage
  } catch (error) {
    console.error('Login error:', error);
  }
};

// Manual registration
const handleManualRegister = async () => {
  try {
    const response = await authService.register({
      email: 'user@example.com',
      password: 'password123',
      fullName: 'John Doe',
      phone: '123-456-7890'
    });

    console.log('Registration response:', response);
  } catch (error) {
    console.error('Registration error:', error);
  }
};

// Get user profile
const getUserProfile = async () => {
  try {
    const user = await authService.getProfile();
    console.log('User profile:', user);
  } catch (error) {
    console.error('Profile error:', error);
  }
};
```

### 5. Form Validation

The auth forms include comprehensive validation:

```typescript
// Login validation
- Email format checking
- Required field validation
- Minimum password length (6 characters)

// Register validation
- Email format checking
- Password strength (uppercase, lowercase, number)
- Password confirmation matching
- Phone number format validation
- Terms and conditions agreement
- Full name validation
```

## Available Routes

1. **Authentication Pages:**
   - `/auth` - Combined login/register page
   - `/auth?mode=register` - Register mode
   - `/auth?redirect=/protected` - Redirect after auth

2. **Protected Pages:**
   - `/account` - User account dashboard
   - Any page wrapped with `withAuth()` HOC

3. **API Endpoints:**
   - `POST http://localhost:8080/api/auth/login`
   - `POST http://localhost:8080/api/auth/register`
   - `GET http://localhost:8080/api/auth/user/profile`
   - `GET http://localhost:8080/api/auth/verify`

## Authentication State

The AuthContext provides global auth state:

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

## Security Features

1. **JWT Token Storage** - Tokens stored in localStorage
2. **Automatic Token Refresh** - User session refreshed on app load
3. **Protected Route Handling** - Automatic redirect to auth for protected pages
4. **Type Safety** - Full TypeScript integration with generated types
5. **Error Handling** - Comprehensive error handling and user feedback
6. **Form Validation** - Client-side validation with server-side verification

## Integration with Backend

The frontend is fully integrated with the Spring Boot backend:

1. **Auto-generated TypeScript types** from OpenAPI specification
2. **Consistent API client** with proper authentication headers
3. **Automatic token injection** in API requests
4. **Error response handling** from backend validation
5. **Email verification flow** support

## Customization

The auth system can be easily customized:

1. **Theme/Branding** - Modify Tailwind CSS classes in form components
2. **Validation Rules** - Update validation logic in form components
3. **API Configuration** - Modify base URL and settings in auth service
4. **Redirect Logic** - Update redirect paths in auth context
5. **State Management** - Extend auth context for additional state

This implementation provides a complete, production-ready authentication system that seamlessly integrates with the generated TypeScript types from the Spring Boot backend.