import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductFilters } from '@/types/product';
import { productService } from '@/services/product';

// Product state interface
interface ProductState {
  // Single product details
  currentProduct: Product | null;

  // Product lists
  products: Product[];
  featuredProducts: Product[];
  newArrivals: Product[];
  bestSellers: Product[];

  // Loading states
  isLoading: boolean;
  isLoadingCurrent: boolean;

  // Error states
  error: string | null;

  // Pagination
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  } | null;
}

// Initial state
const initialState: ProductState = {
  currentProduct: null,
  products: [],
  featuredProducts: [],
  newArrivals: [],
  bestSellers: [],
  isLoading: false,
  isLoadingCurrent: false,
  error: null,
  pagination: null,
};

// Async thunks
export const fetchProductById = createAsyncThunk(
  'product/fetchById',
  async (productId: number, { rejectWithValue }) => {
    try {
      const product = await productService.getProductById(productId);
      return product;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  'product/fetchAll',
  async ({ page = 0, size = 20 }: { page?: number; size?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await productService.getAllProducts(page, size);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchActiveProducts = createAsyncThunk(
  'product/fetchActive',
  async ({ page = 0, size = 20 }: { page?: number; size?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await productService.getActiveProducts(page, size);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active products');
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'product/fetchByCategory',
  async ({ categoryId, page = 0, size = 20 }: { categoryId: number; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await productService.getProductsByCategory(categoryId, page, size);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products by category');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'product/search',
  async (params: { name: string; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await productService.searchProducts(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search products');
    }
  }
);

// Advanced product filtering with combined filters
export const fetchFilteredProducts = createAsyncThunk(
  'product/fetchFiltered',
  async (filters: ProductFilters, { rejectWithValue }) => {
    try {
      const response = await productService.getFilteredProducts(filters);
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch filtered products');
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'product/fetchFeatured',
  async (limit: number = 8, { rejectWithValue }) => {
    try {
      const products = await productService.getFeaturedProducts(limit);
      return products;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured products');
    }
  }
);

export const fetchNewArrivals = createAsyncThunk(
  'product/fetchNewArrivals',
  async (limit: number = 8, { rejectWithValue }) => {
    try {
      const products = await productService.getNewArrivals(limit);
      return products;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch new arrivals');
    }
  }
);

export const fetchBestSellers = createAsyncThunk(
  'product/fetchBestSellers',
  async (limit: number = 8, { rejectWithValue }) => {
    try {
      const products = await productService.getBestSellers(limit);
      return products;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch best sellers');
    }
  }
);

// Create slice
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // Set current product (for immediate UI updates)
    setCurrentProduct: (state, action: PayloadAction<Product>) => {
      state.currentProduct = action.payload;
    },

    // Clear current product
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Update product in state (useful for optimistic updates)
    updateProductInList: (state, action: PayloadAction<Product>) => {
      const updatedProduct = action.payload;
      const index = state.products.findIndex(p => p.id === updatedProduct.id);
      if (index !== -1) {
        state.products[index] = updatedProduct;
      }
    },

    // Add product to wishlist (or toggle)
    toggleProductWishlist: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      const product = state.products.find(p => p.id === productId);
      if (product) {
        // This would need a proper wishlist field in Product interface
        // For now, we'll just mark it
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch product by ID
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.isLoadingCurrent = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoadingCurrent = false;
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoadingCurrent = false;
        state.error = action.payload as string;
      });

    // Fetch all products
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.content;
        state.pagination = {
          currentPage: action.payload.number,
          totalPages: action.payload.totalPages,
          totalCount: action.payload.totalElements,
          pageSize: action.payload.size,
        };
        state.error = null;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch active products
    builder
      .addCase(fetchActiveProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.content;
        state.pagination = {
          currentPage: action.payload.number,
          totalPages: action.payload.totalPages,
          totalCount: action.payload.totalElements,
          pageSize: action.payload.size,
        };
        state.error = null;
      })
      .addCase(fetchActiveProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch products by category
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.content;
        state.pagination = {
          currentPage: action.payload.number,
          totalPages: action.payload.totalPages,
          totalCount: action.payload.totalElements,
          pageSize: action.payload.size,
        };
        state.error = null;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Search products
    builder
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.content;
        state.pagination = {
          currentPage: action.payload.number,
          totalPages: action.payload.totalPages,
          totalCount: action.payload.totalElements,
          pageSize: action.payload.size,
        };
        state.error = null;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch filtered products
    builder
      .addCase(fetchFilteredProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.content;
        state.pagination = {
          currentPage: action.payload.number,
          totalPages: action.payload.totalPages,
          totalCount: action.payload.totalElements,
          pageSize: action.payload.size,
        };
        state.error = null;
      })
      .addCase(fetchFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch featured products
    builder
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload;
      });

    // Fetch new arrivals
    builder
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.newArrivals = action.payload;
      });

    // Fetch best sellers
    builder
      .addCase(fetchBestSellers.fulfilled, (state, action) => {
        state.bestSellers = action.payload;
      });
  },
});

// Export actions
export const {
  setCurrentProduct,
  clearCurrentProduct,
  clearError,
  updateProductInList,
  toggleProductWishlist,
} = productSlice.actions;

// Legacy export for backward compatibility
export const updateproductDetails = setCurrentProduct;

// Selectors
export const selectCurrentProduct = (state: { product: ProductState }) => state.product.currentProduct;
export const selectProducts = (state: { product: ProductState }) => state.product.products;
export const selectFeaturedProducts = (state: { product: ProductState }) => state.product.featuredProducts;
export const selectNewArrivals = (state: { product: ProductState }) => state.product.newArrivals;
export const selectBestSellers = (state: { product: ProductState }) => state.product.bestSellers;
export const selectProductLoading = (state: { product: ProductState }) => state.product.isLoading;
export const selectCurrentProductLoading = (state: { product: ProductState }) => state.product.isLoadingCurrent;
export const selectProductError = (state: { product: ProductState }) => state.product.error;
export const selectProductPagination = (state: { product: ProductState }) => state.product.pagination;

// Re-export ProductFilters for convenience
export type { ProductFilters } from '@/types/product';

// Reducer
export default productSlice.reducer;
