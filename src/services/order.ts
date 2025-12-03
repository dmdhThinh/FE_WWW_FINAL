import { OrderControllerApi, Configuration } from '../../generated-typescript';
import { BASE_PATH } from '../../generated-typescript/base';
import {
  Order,
  OrderItem,
  OrderState,
  CreateOrderRequest,
  OrderResponse,
  OrderFilters,
  OrderStatusType,
  PaymentStatusType,
  PaymentMethodType
} from '../types/order';

// API Configuration
const createOrderApi = (): OrderControllerApi => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const config = new Configuration({
    basePath: BASE_PATH,
    accessToken: token || undefined,
    baseOptions: {
      withCredentials: !!token,
    },
  });

  return new OrderControllerApi(config);
};

// Order Service
// Error handling helper
const handleApiError = (error: any): Error => {
  if (error.response && error.response.data) {
    const msg = error.response.data.message;
    throw new Error(msg);
  }
  throw handleApiError(error);
};

export const orderService = {
  // Create a new order
  async createOrder(request: CreateOrderRequest): Promise<OrderResponse> {
    try {
      const api = createOrderApi();
      const response = await api.createOrder(request);
      const data = response.data as OrderResponse;

      // Handle VNPAY redirect if present
      if (data.payment_url) {
        if (typeof window !== 'undefined') {
          window.location.href = data.payment_url;
        }
      }

      return data;
    } catch (error: any) {
      console.error('Create order error:', error);
      const errorData = error.response?.data as OrderResponse || {
        status: 400,
        message: 'Failed to create order: ' + (error.message || 'Unknown error')
      };

      // Redirect to order failed page with error details
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams({
          message: errorData.message || 'Order creation failed',
          code: errorData.status?.toString() || 'UNKNOWN_ERROR'
        });
        window.location.href = `/order-failed?${params.toString()}`;
      }

      throw handleApiError(error);
    }
  },

  // Get order by ID
  async getOrderById(id: number): Promise<Order> {
    try {
      const api = createOrderApi();
      const response = await api.getOrderById(id);
      return response.data as Order;
    } catch (error: any) {
      console.error('Get order by ID error:', error);
      throw handleApiError(error);
    }
  },

  // Get all orders (admin)
  async getAllOrders(): Promise<Order[]> {
    try {
      const api = createOrderApi();
      const response = await api.getAllOrders();
      return response.data as Order[];
    } catch (error: any) {
      console.error('Get all orders error:', error);
      throw handleApiError(error);
    }
  },

  // Get orders by user ID
  async getOrdersByUser(userId: number): Promise<Order[]> {
    try {
      const api = createOrderApi();
      const response = await api.getOrdersByUser(userId);
      return response.data as Order[];
    } catch (error: any) {
      console.error('Get orders by user error:', error);
      throw handleApiError(error);
    }
  },

  // Update order status (admin)
  async updateOrderStatus(id: number, status: string): Promise<Order> {
    try {
      const api = createOrderApi();
      const response = await api.updateStatus(id, status);
      return response.data as Order;
    } catch (error: any) {
      console.error('Update order status error:', error);
      throw handleApiError(error);
    }
  },

  // Delete order (admin)
  async deleteOrder(id: number): Promise<any> {
    try {
      const api = createOrderApi();
      const response = await api.deleteOrder(id);
      return response.data;
    } catch (error: any) {
      console.error('Delete order error:', error);
      throw handleApiError(error);
    }
  },

  // Get complete order state for user
  async getUserOrderState(userId: number): Promise<OrderState> {
    try {
      const orders = await this.getOrdersByUser(userId);
      return {
        orders: orders.map(order => this.enrichOrderWithFormattedFields(order)),
        currentOrder: null,
        isLoading: false,
        error: null,
        totalCount: orders.length
      };
    } catch (error: any) {
      console.error('Get user order state error:', error);
      return {
        orders: [],
        currentOrder: null,
        isLoading: false,
        error: error.message || 'Failed to fetch orders',
        totalCount: 0
      };
    }
  },

  // Get complete order state for admin
  async getAllOrderState(): Promise<OrderState> {
    try {
      const orders = await this.getAllOrders();
      return {
        orders: orders.map(order => this.enrichOrderWithFormattedFields(order)),
        currentOrder: null,
        isLoading: false,
        error: null,
        totalCount: orders.length
      };
    } catch (error: any) {
      console.error('Get all order state error:', error);
      return {
        orders: [],
        currentOrder: null,
        isLoading: false,
        error: error.message || 'Failed to fetch orders',
        totalCount: 0
      };
    }
  },

  // Format order with additional fields
  enrichOrderWithFormattedFields(order: Order): Order {
    return {
      ...order,
      formattedTotal: this.formatCurrency(order.finalAmount || 0),
      formattedCreatedAt: this.formatDate(order.createdAt),
      statusColor: this.getStatusColor(order.status as OrderStatusType),
      canCancel: this.canCancelOrder(order.status as OrderStatusType),
      canTrack: this.canTrackOrder(order.status as OrderStatusType),
      items: order.items?.map(item => ({
        ...item,
        formattedPrice: this.formatCurrency(item.price || 0),
        formattedSubTotal: this.formatCurrency(item.subTotal || 0)
      }))
    };
  },

  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  },

  // Format date
  formatDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  },

  // Get status color for UI
  getStatusColor(status: OrderStatusType): string {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'CONFIRMED':
        return 'text-blue-600 bg-blue-100';
      case 'PROCESSING':
        return 'text-purple-600 bg-purple-100';
      case 'SHIPPED':
        return 'text-indigo-600 bg-indigo-100';
      case 'DELIVERED':
        return 'text-green-600 bg-green-100';
      case 'CANCELLED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  },

  // Check if order can be cancelled
  canCancelOrder(status: OrderStatusType): boolean {
    return ['PENDING', 'CONFIRMED'].includes(status);
  },

  // Check if order can be tracked
  canTrackOrder(status: OrderStatusType): boolean {
    return ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(status);
  },

  // Validate order creation request
  validateCreateOrderRequest(request: CreateOrderRequest): string[] {
    const errors: string[] = [];

    if (!request.userId) {
      errors.push('User ID is required');
    }

    if (!request.paymentMethod) {
      errors.push('Payment method is required');
    } else if (!Object.values(['VNPAY', 'CASH_ON_DELIVERY']).includes(request.paymentMethod as PaymentMethodType)) {
      errors.push('Invalid payment method');
    }

    if (!request.shippingAddress || request.shippingAddress.trim().length < 10) {
      errors.push('Shipping address is required and must be at least 10 characters');
    }

    return errors;
  },

  // Get status label for display
  getStatusLabel(status: OrderStatusType): string {
    const statusLabels = {
      'PENDING': 'Chờ xác nhận',
      'CONFIRMED': 'Đã xác nhận',
      'PROCESSING': 'Đang xử lý',
      'SHIPPED': 'Đang giao hàng',
      'DELIVERED': 'Đã giao hàng',
      'CANCELLED': 'Đã hủy'
    };
    return statusLabels[status] || status;
  },

  // Get payment method label for display
  getPaymentMethodLabel(method: PaymentMethodType): string {
    const methodLabels = {
      'VNPAY': 'Ví điện tử VNPAY',
      'CASH_ON_DELIVERY': 'Thanh toán khi nhận hàng'
    };
    return methodLabels[method] || method;
  },

  // Get payment status label for display
  getPaymentStatusLabel(status: PaymentStatusType): string {
    const statusLabels = {
      'PENDING': 'Chờ thanh toán',
      'COMPLETED': 'Đã thanh toán',
      'FAILED': 'Thanh toán thất bại',
      'REFUNDED': 'Đã hoàn tiền'
    };
    return statusLabels[status] || status;
  }
};

export default orderService;