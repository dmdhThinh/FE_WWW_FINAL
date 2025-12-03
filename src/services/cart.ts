import { CartControllerApi, Configuration } from '../../generated-typescript';
import { BASE_PATH } from '../../generated-typescript/base';
import {
  CartItem,
  CartState,
  AddToCartRequest,
  UpdateCartRequest,
  RemoveFromCartRequest,
  CartTotals,
  CheckoutRequest,
  CheckoutResponse
} from '../types/cart';

// API Configuration
const createCartApi = (): CartControllerApi => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const config = new Configuration({
    basePath: BASE_PATH,
    accessToken: token || undefined,
    baseOptions: {
      withCredentials: !!token, // 👈 BẮT BUỘC để gửi JSESSIONID
    },
  });

  return new CartControllerApi(config);
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

// Cart Service
export const cartService = {
  // Get all cart items
  async getCartItems(): Promise<CartItem[]> {
    try {
      const api = createCartApi();
      const response = await api.getCartItems();
      return response.data as CartItem[];
    } catch (error: any) {
      console.error('Get cart items error:', error);
      throw handleApiError(error);
    }
  },

  // Get cart item count
  async getCartItemCount(): Promise<number> {
    try {
      const api = createCartApi();
      const response = await api.getCartItemCount();
      const data = response.data as { [key: string]: number };
      return data.count || 0;
    } catch (error: any) {
      console.error('Get cart item count error:', error);
      throw handleApiError(error);
    }
  },

  // Get cart total
  async getCartTotal(): Promise<number> {
    try {
      const api = createCartApi();
      const response = await api.getCartTotal();
      const data = response.data as { [key: string]: number };
      return data.total || 0;
    } catch (error: any) {
      console.error('Get cart total error:', error);
      throw handleApiError(error);
    }
  },

  // Check if cart is empty
  async isCartEmpty(): Promise<boolean> {
    try {
      const api = createCartApi();
      const response = await api.isCartEmpty();
      const data = response.data as { [key: string]: boolean };
      return data.empty || true;
    } catch (error: any) {
      console.error('Check cart empty error:', error);
      throw handleApiError(error);
    }
  },

  // Add item to cart
  async addToCart(request: AddToCartRequest): Promise<any> {
    try {
      const api = createCartApi();
      const response = await api.addToCart(request);
      return response.data;
    } catch (error: any) {
      // 👉 Lấy message trả về từ BE
      if (error.response && error.response.data) {
        const msg = error.response.data.message;
        throw new Error(msg);
      }

    }
  },


  // Update cart item quantity
  async updateCartItem(request: UpdateCartRequest): Promise<any> {
    try {
      const api = createCartApi();
      const response = await api.updateCartItem(request);
      return response.data;
    } catch (error: any) {
      console.error('Update cart item error:', error);
      throw handleApiError(error);
    }
  },

  // Remove item from cart
  async removeFromCart(request: RemoveFromCartRequest): Promise<any> {
    try {
      const api = createCartApi();
      const response = await api.removeFromCart(request);
      return response.data;
    } catch (error: any) {
      console.error('Remove from cart error:', error);
      throw handleApiError(error);
    }
  },

  // Clear entire cart
  async clearCart(): Promise<any> {
    try {
      const api = createCartApi();
      const response = await api.clearCart();
      return response.data;
    } catch (error: any) {
      console.error('Clear cart error:', error);
      throw handleApiError(error);
    }
  },

  // Get complete cart state (optimized - single API call)
  async getFullCartState(): Promise<CartState> {
    try {
      // Only fetch items - everything else can be calculated locally
      const items = await this.getCartItems();
      const totals = this.calculateTotals(items);
      return {
        items,
        itemCount: totals.itemCount,
        total: totals.total,
        isEmpty: totals.itemCount === 0,
        isLoading: false,
        error: null,
        initialized: true
      };
    } catch (error: any) {
      console.error('Get full cart state error:', error);
      return {
        items: [],
        itemCount: 0,
        total: 0,
        isEmpty: true,
        isLoading: false,
        error: error.message || 'Failed to fetch cart',
        initialized: true
      };
    }
  },

  // Get basic cart info (only when needed - avoid unnecessary calls)
  async getCartInfo(): Promise<{ itemCount: number; total: number; isEmpty: boolean }> {
    try {
      // Use the main items API and calculate locally
      const items = await this.getCartItems();
      const totals = this.calculateTotals(items);

      return {
        itemCount: totals.itemCount,
        total: totals.total,
        isEmpty: totals.itemCount === 0
      };
    } catch (error: any) {
      console.error('Get cart info error:', error);
      return {
        itemCount: 0,
        total: 0,
        isEmpty: true
      };
    }
  },

  // Checkout cart
  async checkout(request: CheckoutRequest): Promise<CheckoutResponse> {
    try {
      const api = createCartApi();
      const response = await api.checkout(request);
      const data = response.data as CheckoutResponse;

      // Handle VNPAY redirect
      if (data.payment_url) {
        // Redirect to VNPAY payment page
        if (typeof window !== 'undefined') {
          window.location.href = data.payment_url;
        }
      }

      return data;
    } catch (error: any) {
      console.error('Checkout error:', error);
      const errorData = error.response?.data as CheckoutResponse || {
        status: 400,
        message: 'Checkout failed: ' + (error.message || 'Unknown error')
      };

      // Redirect to order failed page with error details
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams({
          message: errorData.message || 'Checkout failed',
          code: errorData.status?.toString() || 'CHECKOUT_ERROR'
        });
        window.location.href = `/order-failed?${params.toString()}`;
      }

      throw handleApiError(error);
    }
  },

  // Calculate cart totals locally (for performance)
  calculateTotals(items: CartItem[]): CartTotals {
    const itemCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const subtotal = items.reduce((sum, item) => sum + (item.subtotal || (item.price || 0) * (item.quantity || 0)), 0);

    return {
      subtotal,
      total: subtotal, // Can be modified later for taxes, shipping, etc.
      itemCount
    };
  }
};

export default cartService;