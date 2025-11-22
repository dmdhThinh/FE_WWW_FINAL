import { OrderDTO, OrderItemDTO } from '../../generated-typescript';

// Extended order types for frontend use
export interface Order extends OrderDTO {
  // Additional frontend-specific fields can be added here
  formattedTotal?: string;
  formattedCreatedAt?: string;
  statusColor?: string;
  canCancel?: boolean;
  canTrack?: boolean;
}

export interface OrderItem extends OrderItemDTO {
  // Additional frontend-specific fields can be added here
  imageUrl?: string;
  formattedPrice?: string;
  formattedSubTotal?: string;
}

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
}

export interface CreateOrderRequest {
  userId: number;
  paymentMethod: string;
  shippingAddress: string;
  note?: string;
  items?: OrderItemDTO[];
}

export interface OrderResponse {
  status: number;
  order?: Order;
  message?: string;
  payment_url?: string;
}

export interface OrderFilters {
  status?: string;
  paymentStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'finalAmount' | 'status';
  sortOrder?: 'asc' | 'desc';
}

// Order status constants
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
} as const;

export const PAYMENT_METHOD = {
  VNPAY: 'VNPAY',
  CASH_ON_DELIVERY: 'CASH_ON_DELIVERY'
} as const;

// Type helpers
export type OrderStatusType = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];
export type PaymentStatusType = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];
export type PaymentMethodType = typeof PAYMENT_METHOD[keyof typeof PAYMENT_METHOD];