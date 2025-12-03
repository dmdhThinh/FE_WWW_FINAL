import { createSelector, createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { CartItem, CartState, AddToCartRequest, UpdateCartRequest, RemoveFromCartRequest, CheckoutRequest, CheckoutResponse } from "../../types/cart";
import cartService from "../../services/cart";
import { toast } from 'react-hot-toast';

const initialState: CartState = {
  items: [],
  itemCount: 0,
  total: 0,
  isLoading: false,
  error: null,
  isEmpty: true,
  initialized: false, // Add flag to track if cart has been loaded once
};

// Async thunks for API calls
export const fetchCartItems = createAsyncThunk(
  'cart/fetchItems',
  async (_, { rejectWithValue, getState }) => {
    try {
      const currentState = getState() as RootState;

      // If cart is already initialized, don't fetch again
      if (currentState.cartReducer.initialized) {
        return currentState.cartReducer;
      }

      const cartState = await cartService.getFullCartState();
      return { ...cartState, initialized: true };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch cart items');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addItem',
  async (request: AddToCartRequest, { rejectWithValue, getState }) => {
    try {
      const response = await cartService.addToCart(request);

      // Calculate new cart state locally instead of fetching
      const currentState = getState() as RootState;
      const existingItems = currentState.cartReducer.items;

      // Check if item already exists
      const existingItemIndex = existingItems.findIndex(item => item.productId === request.productId);

      let newItems: CartItem[];
      if (existingItemIndex !== -1) {
        // Update existing item
        newItems = [...existingItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + request.quantity,
          subtotal: (newItems[existingItemIndex].price || 0) * (newItems[existingItemIndex].quantity + request.quantity)
        };
      } else {
        // Add new item - create from API response if available, otherwise from request
        const newItem: CartItem = {
          id: Date.now(), // Temporary ID, will be updated when fetching
          productId: request.productId,
          productName: response?.productName || `Product ${request.productId}`,
          price: response?.price || 0,
          quantity: request.quantity,
          subtotal: (response?.price || 0) * request.quantity,
        };
        newItems = [...existingItems, newItem];
      }

      const totals = cartService.calculateTotals(newItems);

      return {
        items: newItems,
        itemCount: totals.itemCount,
        total: totals.total,
        isEmpty: totals.itemCount === 0,
        isLoading: false,
        error: null,
        initialized: true
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add item to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async (request: UpdateCartRequest, { rejectWithValue, getState }) => {
    try {
      await cartService.updateCartItem(request);

      // Calculate new cart state locally
      const currentState = getState() as RootState;
      const existingItems = currentState.cartReducer.items;

      const newItems = existingItems.map(item => {
        if (item.productId === request.productId) {
          return {
            ...item,
            quantity: request.quantity,
            subtotal: (item.price || 0) * request.quantity
          };
        }
        return item;
      });

      const totals = cartService.calculateTotals(newItems);

      return {
        items: newItems,
        itemCount: totals.itemCount,
        total: totals.total,
        isEmpty: totals.itemCount === 0,
        isLoading: false,
        error: null,
        initialized: true
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update cart item');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeItem',
  async (request: RemoveFromCartRequest, { rejectWithValue, getState }) => {
    try {
      await cartService.removeFromCart(request);

      // Calculate new cart state locally
      const currentState = getState() as RootState;
      const existingItems = currentState.cartReducer.items;

      const newItems = existingItems.filter(item => item.id !== request.productId);
      const totals = cartService.calculateTotals(newItems);

      return {
        items: newItems,
        itemCount: totals.itemCount,
        total: totals.total,
        isEmpty: totals.itemCount === 0,
        isLoading: false,
        error: null,
        initialized: false
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove item from cart');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clear',
  async (_, { rejectWithValue }) => {
    try {
      await cartService.clearCart();
      return {
        items: [],
        itemCount: 0,
        total: 0,
        isEmpty: true,
        isLoading: false,
        error: null,
        initialized: true
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to clear cart');
    }
  }
);

// Force refresh cart from server (use sparingly - only when needed)
export const refreshCart = createAsyncThunk(
  'cart/refresh',
  async (_, { rejectWithValue }) => {
    try {
      const cartState = await cartService.getFullCartState();
      return { ...cartState, initialized: true };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to refresh cart');
    }
  }
);

// Checkout cart
export const checkoutCart = createAsyncThunk(
  'cart/checkout',
  async (request: CheckoutRequest, { rejectWithValue, dispatch }) => {
    try {
      const response = await cartService.checkout(request);

      // Only clear cart if payment is completed successfully
      // For VNPAY: don't clear cart yet, wait for payment confirmation callback
      // For COD: clear cart only if checkout is successful and no payment_url (payment completed)
      if (response.status === 200 && !response.payment_url) {
        // COD payment completed successfully, clear cart
        dispatch(clearCart());
      }
      // For VNPAY: payment_url exists, don't clear cart yet
      // Cart will be cleared only after successful payment confirmation

      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Local state updates for immediate UI feedback
    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCartError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearCartError: (state) => {
      state.error = null;
    },
    setCartInitialized: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    },
    resetCart: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.total = 0;
      state.isEmpty = true;
      state.isLoading = false;
      state.error = null;
      state.initialized = false;
    },

    // Local updates (optimistic)
    optimisticUpdateQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.productId === productId);
      if (item) {
        item.quantity = quantity;
        // Recalculate subtotal
        item.subtotal = (item.price || 0) * quantity;
      }
      // Recalculate totals
      const itemCount = state.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      const total = state.items.reduce((sum, item) => sum + (item.subtotal || (item.price || 0) * (item.quantity || 0)), 0);
      state.itemCount = itemCount;
      state.total = total;
      state.isEmpty = itemCount === 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart items
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.itemCount = action.payload.itemCount;
        state.total = action.payload.total;
        state.isEmpty = action.payload.isEmpty;
        state.error = null;
        state.initialized = action.payload.initialized;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.itemCount = action.payload.itemCount;
        state.total = action.payload.total;
        state.isEmpty = action.payload.isEmpty;
        state.error = null;
        state.initialized = action.payload.initialized;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Backward compatible add to cart
      .addCase(addItemToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.itemCount = action.payload.itemCount;
        state.total = action.payload.total;
        state.isEmpty = action.payload.isEmpty;
        state.error = null;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.itemCount = action.payload.itemCount;
        state.total = action.payload.total;
        state.isEmpty = action.payload.isEmpty;
        state.error = null;
        state.initialized = action.payload.initialized;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.itemCount = action.payload.itemCount;
        state.total = action.payload.total;
        state.isEmpty = action.payload.isEmpty;
        state.error = null;
        state.initialized = action.payload.initialized;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        state.items = [];
        state.itemCount = 0;
        state.total = 0;
        state.isEmpty = true;
        state.error = null;
        state.initialized = true;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Refresh cart
      .addCase(refreshCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.itemCount = action.payload.itemCount;
        state.total = action.payload.total;
        state.isEmpty = action.payload.isEmpty;
        state.error = null;
        state.initialized = action.payload.initialized;
      })
      .addCase(refreshCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Checkout cart
      .addCase(checkoutCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkoutCart.fulfilled, (state) => {
        state.isLoading = false;
        // Cart will be cleared by clearCart action dispatched in the thunk
        state.error = null;
      })
      .addCase(checkoutCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as CheckoutResponse)?.message || 'Checkout failed';
      });
  }
});

export const {
  setCartLoading,
  setCartError,
  clearCartError,
  optimisticUpdateQuantity,
  setCartInitialized,
  resetCart,
} = cart.actions;

// Backward compatibility - export addItemToCart for existing components
export const addItemToCart = createAsyncThunk(
  'cart/addItemBackwardCompatible',
  async (product: any, { rejectWithValue, getState }) => {
    try {
      const request: AddToCartRequest = {
        productId: product.id || product.productId,
        quantity: product.quantity || 1,
      };

      const response = await cartService.addToCart(request);

      const currentState = getState() as RootState;
      const existingItems = currentState.cartReducer.items;

      const existingItemIndex = existingItems.findIndex(
        item => item.productId === request.productId
      );

      let newItems: CartItem[];
      if (existingItemIndex !== -1) {
        newItems = [...existingItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + request.quantity,
          subtotal:
            (newItems[existingItemIndex].price || 0) *
            (newItems[existingItemIndex].quantity + request.quantity),
        };

        // 🔔 Toast update quantity
        toast.success('Đã cập nhật số lượng sản phẩm trong giỏ hàng');
      } else {
        const newItem: CartItem = {
          id: Date.now(),
          productId: request.productId,
          productName:
            product.title || product.name || `Product ${request.productId}`,
          price: product.price || product.discountedPrice || 0,
          quantity: request.quantity,
          subtotal:
            (product.price || product.discountedPrice || 0) * request.quantity,
          imageUrl: product.imgs?.thumbnails?.[0] || product.imageUrl,
        };
        newItems = [...existingItems, newItem];

        // 🔔 Toast add new
        toast.success('Đã thêm sản phẩm vào giỏ hàng');
      }

      const totals = cartService.calculateTotals(newItems);

      return {
        items: newItems,
        itemCount: totals.itemCount,
        total: totals.total,
        isEmpty: totals.itemCount === 0,
        isLoading: false,
        error: null,
        initialized: true,
      };
    } catch (error: any) {
      // 🔔 Toast error
      toast.error(error.message || 'Thêm sản phẩm vào giỏ hàng thất bại');
      return rejectWithValue(error.message || 'Failed to add item to cart');
    }
  }
);


// Selectors
export const selectCartItems = (state: RootState) => state.cartReducer.items;
export const selectCartItemCount = (state: RootState) => state.cartReducer.itemCount;
export const selectCartTotal = (state: RootState) => state.cartReducer.total;
export const selectCartLoading = (state: RootState) => state.cartReducer.isLoading;
export const selectCartError = (state: RootState) => state.cartReducer.error;
export const selectCartIsEmpty = (state: RootState) => state.cartReducer.isEmpty;
export const selectCartInitialized = (state: RootState) => state.cartReducer.initialized;

// Memoized selectors
export const selectCartTotals = createSelector(
  [selectCartItems, selectCartTotal],
  (items, total) => ({
    itemCount: items.reduce((sum, item) => sum + (item.quantity || 0), 0),
    subtotal: items.reduce((sum, item) => sum + (item.subtotal || (item.price || 0) * (item.quantity || 0)), 0),
    total
  })
);

export default cart.reducer;
