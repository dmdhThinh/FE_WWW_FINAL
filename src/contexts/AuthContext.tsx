"use client";
import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { authService } from "../services/auth";
import { User } from "../types/auth";
import {
  setUser,
  clearUser,
  setLoading as setUserLoading,
  setError as setUserError,
  selectIsAuthenticated,
  selectUser,
  selectIsLoading,
  clearError as clearUserError,
} from "../redux/features/user-slice";
import { clearCart, resetCart, setCartInitialized } from "@/redux/features/cart-slice";

// Auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // Return backend auth response so callers can react (e.g. redirect by role)
  login: (email: string, password: string) => Promise<any>;
  register: (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    address: string
  ) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector((state: any) => state.userReducer?.error || null);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize auth state on app load
  React.useEffect(() => {
    const initializeAuth = async () => {
      const token = authService.getToken();

      if (token) {
        try {
          dispatch(setUserLoading(true));
          const userData = await authService.getProfile();
          dispatch(setUser(userData as User));
        } catch (error) {
          console.error("Failed to refresh user session:", error);
          // Invalid token, clear auth state completely
          authService.logout();
          dispatch(clearUser());
          // Only redirect if they're on a protected page (not homepage or public pages)
          // Use a small delay to ensure pathname is set
          setTimeout(() => {
            const currentPath = pathname || (typeof window !== 'undefined' ? window.location.pathname : '');
            const publicPaths = ['/', '/signin', '/signup', '/shop', '/shop-with-sidebar', '/shop-without-sidebar', '/contact', '/blogs'];
            const isPublicPath = publicPaths.includes(currentPath) || 
                                 currentPath.startsWith('/shop') || 
                                 currentPath.startsWith('/blogs') ||
                                 currentPath.startsWith('/product');
            
            if (!isPublicPath && (currentPath.startsWith('/my-account') || currentPath.startsWith('/admin'))) {
              router.push('/signin');
            }
          }, 100);
        } finally {
          dispatch(setUserLoading(false));
        }
      } else {
        // No token, ensure user is cleared but don't redirect from homepage
        dispatch(clearUser());
      }
    };

    initializeAuth();
  }, [dispatch, router, pathname]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      dispatch(setUserLoading(true));

      const response = await authService.login({ email, password });

      if (response.token && response.user) {
        // Ensure user object always has a role field
        const userWithRole: User = {
          ...(response.user as User),
          role:
            (response as any).role ||
            (response.user.isAdmin ? "ADMIN" : "USER"),
        };

        dispatch(setUser(userWithRole));
        dispatch(setCartInitialized(false));
        return { ...response, user: userWithRole };
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";
      dispatch(setUserError(errorMessage));
      throw error;
    }
  };

  // Register function
  const register = async (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    address: string
  ) => {
    try {
      dispatch(setUserLoading(true));

      await authService.register({ email, password, fullName, phone, address });

      // Registration successful but user needs to verify email
      // Don't set authenticated state yet
      dispatch(setUserLoading(false));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";
      dispatch(setUserError(errorMessage));
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    dispatch(clearUser());
    dispatch(resetCart());
    // Always send user back to homepage after sign out
    router.push("/");
  };

  // Clear error function
  const clearError = () => {
    dispatch(clearUserError());
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      dispatch(setUserLoading(true));
      const userData = await authService.getProfile();
      dispatch(setUser(userData as User));
    } catch (error) {
      console.error("Failed to refresh user:", error);
      // If refresh fails, token might be expired
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Higher-order component to protect routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const WithAuthComponent = (props: P) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push(
          "/auth?redirect=" + encodeURIComponent(window.location.pathname)
        );
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };

  WithAuthComponent.displayName = `withAuth(${Component.displayName || Component.name})`;

  return WithAuthComponent;
};

export default AuthContext;
