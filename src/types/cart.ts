import { CartItemDTO } from '../../generated-typescript';

// Extended cart types for frontend use
export interface CartItem extends CartItemDTO {
  // Additional frontend-specific fields can be added here
  imageUrl?: string;
  inStock?: boolean;
}

export interface CartState {
  items: CartItem[];
  itemCount: number;
  total: number;
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  initialized: boolean; // Track if cart has been loaded once
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartRequest {
  productId: number;
  quantity: number;
}

export interface RemoveFromCartRequest {
  productId: number;
}

export interface CartTotals {
  subtotal: number;
  total: number;
  itemCount: number;
}

// Checkout related types
export interface CheckoutRequest {
  userId: number;
  paymentMethod: 'VNPAY' | 'CASH_ON_DELIVERY';
  shippingAddress: string;
  note?: string;
}

export interface CheckoutResponse {
  status: number;
  order?: any; // OrderDTO type from generated types
  payment_url?: string; // For VNPAY redirect
  message?: string;
}