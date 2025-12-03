import { CategoryControllerApi, ProductControllerApi, OrderControllerApi, AuthControllerApi, Configuration, ProductDTO } from '../../generated-typescript';
import { BASE_PATH } from '../../generated-typescript/base';
import { Category, PaginatedResponse } from '../types/category';
import { Product } from '../types/product';
import { Order } from '../types/order';
import { User } from '../types/auth';

// API Configuration
const createApiConfig = (): Configuration => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  return new Configuration({
    basePath: BASE_PATH,
    accessToken: token || undefined,
    baseOptions: {
      withCredentials: !!token,
    },
  });
};

const createCategoryApi = (): CategoryControllerApi => {
  const config = createApiConfig();
  return new CategoryControllerApi(config);
};

const createProductApi = (): ProductControllerApi => {
  const config = createApiConfig();
  return new ProductControllerApi(config);
};

const createOrderApi = (): OrderControllerApi => {
  const config = createApiConfig();
  return new OrderControllerApi(config);
};

const createAuthApi = (): AuthControllerApi => {
  const config = createApiConfig();
  return new AuthControllerApi(config);
};

// Transform ProductDTO to Product type
const transformProductDTO = (productDTO: ProductDTO): Product => {
  return {
    ...productDTO,
    // Add frontend-specific properties
    title: productDTO.name, // Alias for name
    reviews: 0, // Default value - should come from reviews API
    rating: 0, // Default value - should come from reviews API
    discountedPrice: undefined, // Will be set if product is on sale
    imgs: productDTO.imageUrl ? {
      thumbnails: [productDTO.imageUrl],
      previews: [productDTO.imageUrl],
    } : undefined,
    // Computed properties
    isOnSale: false, // Will be computed based on business logic
    discountPercentage: undefined,
  };
};

// Transform API response to PaginatedResponse<Product>
const transformProductListResponse = (apiResponse: any): PaginatedResponse<Product> => {
  // Spring Page returns shape: { content, totalPages, totalElements, size, number, first, last, numberOfElements, ... }
  const pageData = apiResponse?.data ?? apiResponse;

  const content =
    Array.isArray(pageData?.content) && pageData?.content.length > 0
      ? pageData.content.map(transformProductDTO)
      : Array.isArray(pageData)
      ? pageData.map(transformProductDTO)
      : [];

  return {
    content,
    totalPages: pageData?.totalPages ?? 1,
    totalElements: pageData?.totalElements ?? content.length,
    size: pageData?.size ?? content.length,
    number: pageData?.number ?? 0,
    first: pageData?.first ?? (pageData?.number === 0),
    last:
      pageData?.last ??
      ((pageData?.number ?? 0) === (pageData?.totalPages ?? 1) - 1),
    numberOfElements: pageData?.numberOfElements ?? content.length,
  };
};

// Error handling helper
// utils/handleApiError.ts
export function handleApiError(error: any): Error {
  const data = error?.response?.data;

  let message = "Đã xảy ra lỗi, vui lòng thử lại";

  if (data) {
    if (data.errors && typeof data.errors === "object") {
      message = Object.values<string>(data.errors).join(", ");
    } else if (data.message) {
      message = data.message;
    } else if (data.error) {
      message = data.error;
    }
  } else if (error?.message) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  }

  return new Error(message);
}


// Admin Service
export const adminService = {
  // === Category Management ===

  // Get all categories (including inactive)
  async getAllCategories(page = 0, size = 10): Promise<PaginatedResponse<Category>> {
    try {
      const api = createCategoryApi();
      const response = await api.getAllCategories(page, size);
      return response.data as PaginatedResponse<Category>;
    } catch (error) {
      console.error('Get all categories error:', error);
      throw handleApiError(error);
    }
  },

  // Create new category
  async createCategory(categoryData: any): Promise<Category> {
    try {
      const api = createCategoryApi();
      const response = await api.createCategory(categoryData);
      return response.data as Category;
    } catch (error: any) {
      console.error('Create category error:', error);
      throw handleApiError(error);
    }
  },

  // Update category
  async updateCategory(id: number, categoryData: any): Promise<Category> {
    try {
      const api = createCategoryApi();
      const response = await api.updateCategory(id, categoryData);
      return response.data as Category;
    } catch (error: any) {
      console.error('Update category error:', error);
      throw handleApiError(error);
    }
  },

  // Delete category
  async deleteCategory(id: number): Promise<void> {
    try {
      const api = createCategoryApi();
      await api.deleteCategory(id);
    } catch (error: any) {
      console.error('Delete category error:', error);
      throw handleApiError(error);
    }
  },

  // === Product Management ===

  // Get all products (including inactive)
  async getAllProducts(page = 0, size = 10): Promise<PaginatedResponse<Product>> {
    try {
      const api = createProductApi();
      const response = await api.getAllProducts(page, size);
      return response.data as PaginatedResponse<Product>;
    } catch (error) {
      console.error('Get all products error:', error);
      throw handleApiError(error);
    }
  },
  async getAllProductsForAdmin(page = 0, size = 10): Promise<PaginatedResponse<Product>> {
    try {
      const api = createProductApi();
      const response = await api.getAllProductsForAdmin(page, size);
      return transformProductListResponse(response);
    } catch (error) {
      console.error('Get all products for admin error:', error);
      throw handleApiError(error);
    }
  },
  // Create new product
  async createProduct(productData: any): Promise<Product> {
    try {
      const api = createProductApi();
      const response = await api.createProduct(productData);
      return response.data as Product;
    } catch (error: any) {
      console.error('Create product error:', error);
      throw handleApiError(error);
    }
  },

  // Update product
  async updateProduct(id: number, productData: any): Promise<Product> {
    try {
      const api = createProductApi();
      const response = await api.updateProduct(id, productData);
      return response.data as Product;
    } catch (error: any) {
      console.error('Update product error:', error.message);
      throw handleApiError(error);
    }
  },

  // Delete product
  async deleteProduct(id: number): Promise<void> {
    try {
      const api = createProductApi();
      await api.deleteProduct(id);
    } catch (error: any) {
      console.error('Delete product error:', error);
      throw handleApiError(error);
    }
  },

  // === Order Management ===

  // Get all orders
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

  // Update order status
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

  // === User Management ===

  // Note: User management APIs are not yet implemented in the backend
  // These methods are placeholders for future implementation

  // Get all users - TODO: Implement when backend API is available
  async getAllUsers(page = 0, size = 10): Promise<PaginatedResponse<User>> {
    try {
      const res = await fetch(`${BASE_PATH}/admin/users?page=${page}&size=${size}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(typeof window !== "undefined" && localStorage.getItem("token")
            ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
            : {}),
        },
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg =
          err?.message || err?.error || `Failed to fetch users (${res.status})`;
        throw new Error(msg);
      }

      const data = await res.json();
      // Support Spring Page response or plain array
      if (data?.content) {
        return data as PaginatedResponse<User>;
      }
      if (Array.isArray(data)) {
        return {
          content: data.slice(0, size),
          totalPages: Math.ceil(data.length / size),
          totalElements: data.length,
          size,
          number: page,
          first: page === 0,
          last: page >= Math.ceil(data.length / size) - 1,
          numberOfElements: data.slice(page * size, page * size + size).length,
        } as any;
      }
      return {
        content: [],
        totalPages: 0,
        totalElements: 0,
        size,
        number: page,
        first: true,
        last: true,
        numberOfElements: 0,
      } as any;
    } catch (error: any) {
      console.error('Get all users error:', error);
      throw handleApiError(error);
    }
  },

  // Activate user - TODO: Implement when backend API is available
  async activateUser(id: number): Promise<User> {
    try {
      const res = await fetch(`${BASE_PATH}/admin/users/${id}/activate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(typeof window !== "undefined" && localStorage.getItem("token")
            ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
            : {}),
        },
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg =
          err?.message || err?.error || `Failed to activate user (${res.status})`;
        throw new Error(msg);
      }

      return (await res.json()) as User;
    } catch (error: any) {
      console.error('Activate user error:', error);
      throw handleApiError(error);
    }
  },

  // Deactivate user - TODO: Implement when backend API is available
  async deactivateUser(id: number): Promise<User> {
    try {
      const res = await fetch(`${BASE_PATH}/admin/users/${id}/deactivate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(typeof window !== "undefined" && localStorage.getItem("token")
            ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
            : {}),
        },
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg =
          err?.message || err?.error || `Failed to deactivate user (${res.status})`;
        throw new Error(msg);
      }

      return (await res.json()) as User;
    } catch (error: any) {
      console.error('Deactivate user error:', error);
      throw handleApiError(error);
    }
  },

  // === Dashboard Statistics ===

  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const [categories, products, orders, usersPage] = await Promise.all([
        this.getAllCategories(),
        this.getAllProducts(),
        this.getAllOrders(),
        this.getAllUsers(0, 10)
      ]);

      const activeCategories = categories['content'].filter(c => c.isActive !== false).length;

      const activeProducts = products['content'].filter(p => p.isActive !== false).length;
      const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
      const users = usersPage?.content || [];
      const totalUsers = usersPage?.totalElements ?? users.length;
      const activeUsers = users.filter((u: any) => u.isActive !== false).length;

      return {
        totalCategories: categories.totalElements,
        activeCategories,
        totalProducts: products.totalElements,
        activeProducts,
        totalOrders: orders.length,
        pendingOrders,
        totalUsers,
        activeUsers,
        recentOrders: orders.slice(0, 5),
        recentUsers: users.slice(0, 5)
      };
    } catch (error: any) {
      console.error('Get dashboard stats error:', error);
      throw handleApiError(error);
    }
  }
};

export default adminService;