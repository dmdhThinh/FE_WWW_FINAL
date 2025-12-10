import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { Category, CategoryState, CategoryFilters } from '@/types/category';
import { categoryService } from '@/services/category';

// Initial state
const initialState: CategoryState = {
  categories: [],
  currentCategory: null,
  isLoading: false,
  error: null,
  totalCount: 0,
};

// Async thunks
export const fetchAllCategories = createAsyncThunk(
  'categories/fetchAll',
  async (params: { page?: number; size?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await categoryService.getAllCategories(
        params.page || 0,
        params.size || 20
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch categories');
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  'categories/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const category = await categoryService.getCategoryById(id);
      return category;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch category');
    }
  }
);

export const searchCategories = createAsyncThunk(
  'categories/search',
  async (params: { name: string; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await categoryService.searchCategories(
        params.name,
        params.page || 0,
        params.size || 20
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to search categories');
    }
  }
);

// Slice
const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
      state.totalCount = action.payload.length;
    },
    filterCategories: (state, action: PayloadAction<CategoryFilters>) => {
      const filtered = categoryService.filterCategories(state.categories, action.payload);
      state.categories = filtered;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch all categories
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.categories;
        state.totalCount = action.payload.totalCount;
        state.error = null;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch category by ID
    builder
      .addCase(fetchCategoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCategory = action.payload;
        state.error = null;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Search categories
    builder
      .addCase(searchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.categories;
        state.totalCount = action.payload.totalCount;
        state.error = null;
      })
      .addCase(searchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const {
  clearError,
  clearCurrentCategory,
  setCategories,
  filterCategories,
  resetState,
} = categorySlice.actions;

// Selectors
export const selectCategories = (state: { categories: CategoryState }) =>
  state.categories.categories;

export const selectCurrentCategory = (state: { categories: CategoryState }) =>
  state.categories.currentCategory;

export const selectCategoriesLoading = (state: { categories: CategoryState }) =>
  state.categories.isLoading;

export const selectCategoriesError = (state: { categories: CategoryState }) =>
  state.categories.error;

export const selectTotalCategories = (state: { categories: CategoryState }) =>
  state.categories.totalCount;

// Memoized selector to prevent unnecessary rerenders
const baseSelectCategories = (state: { categories: CategoryState }) => 
  state.categories?.categories || [];

export const selectCategoriesForDropdown = createSelector(
  [baseSelectCategories],
  (categories) => {
    if (!Array.isArray(categories) || categories.length === 0) {
      return [{ label: "Tất cả danh mục", value: "0" }];
    }
    
    const categoryOptions = categories.map((category) => ({
      label: category?.name || category?.title || 'Unknown',
      value: category?.id?.toString() || '0',
    }));
    
    return [
      { label: "Tất cả danh mục", value: "0" },
      ...categoryOptions,
    ];
  }
);

// Reducer
export default categorySlice.reducer;