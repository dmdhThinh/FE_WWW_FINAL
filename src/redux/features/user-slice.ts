import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// User interface (matching the backend response)
export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  emailVerified?: boolean;
  createdAt: string;
  updatedAt?: string;
}

// User state interface
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Create user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    // Set user and authentication state
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Clear user and authentication state
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },

    // Set error state
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Clear error state
    clearError: (state) => {
      state.error = null;
    },

    // Update user profile
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

// Export actions
export const {
  setLoading,
  setUser,
  clearUser,
  setError,
  clearError,
  updateUser,
} = userSlice.actions;

// Selectors
export const selectUser = (state: { userReducer: UserState }) => state.userReducer.user;
export const selectIsAuthenticated = (state: { userReducer: UserState }) => state.userReducer.isAuthenticated;
export const selectIsLoading = (state: { userReducer: UserState }) => state.userReducer.isLoading;
export const selectError = (state: { userReducer: UserState }) => state.userReducer.error;

// Reducer
export default userSlice.reducer;