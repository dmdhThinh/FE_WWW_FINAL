import {
  ProductControllerApi,
  Configuration,
  ProductDTO
} from '../../generated-typescript';
import { BASE_PATH } from '../../generated-typescript/base';
import {
  Product,
  ProductFilters,
  ProductSearchParams,
  PriceRangeParams
} from '../types/product';
import { PaginatedResponse } from '../types/category';

// API Configuration
const createProductApi = (): ProductControllerApi => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const config = new Configuration({
    basePath: BASE_PATH,
    accessToken: token || undefined,
  });

  return new ProductControllerApi(config);
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
  // Handle different response formats from the backend
  const products = Array.isArray(apiResponse.data)
    ? apiResponse.data.map(transformProductDTO)
    : apiResponse.data?.content?.map(transformProductDTO) || [];
  // Extract pagination info if available
  const pagination = apiResponse.data || apiResponse.page;

  return {
    content: products,
    totalPages: pagination?.totalPages || 1,
    totalElements: pagination?.totalElements || products.length,
    size: pagination?.size || products.length,
    number: pagination?.number || 0,
    first: pagination?.first || (pagination?.number === 0),
    last: pagination?.last || ((pagination?.number || 0) === (pagination?.totalPages || 1) - 1),
    numberOfElements: products.length,
  };
};

// Error handling helper
const handleApiError = (error: any): Error => {
  if (error.response && error.response.data) {
    const msg = error.response.data.message;
    return new Error(msg);
  }
  if (error.message) {
    return new Error(error.message);
  }
  return new Error('An unexpected error occurred');
};

// Product Service
export const productService = {
  // Get all products (public)
  async getAllProducts(page = 0, size = 20): Promise<PaginatedResponse<Product>> {
    try {
      const api = createProductApi();
      const response = await api.getAllProducts(page, size);
      return transformProductListResponse(response);
    } catch (error: any) {
      console.error('Get all products error:', error);
      throw handleApiError(error);
    }
  },

  // Get all active products (for public display)
  async getActiveProducts(page = 0, size = 20): Promise<PaginatedResponse<Product>> {
    try {
      const api = createProductApi();
      const response = await api.getAllProducts(page, size);
      return transformProductListResponse(response);
    } catch (error: any) {
      console.error('Get active products error:', error);
      throw handleApiError(error);
    }
  },

  // Get product by ID
  async getProductById(id: number): Promise<Product> {
    try {
      const api = createProductApi();
      const response = await api.getProductById(id);
      return transformProductDTO(response.data as ProductDTO);
    } catch (error: any) {
      console.error('Get product by ID error:', error);
      throw handleApiError(error);
    }
  },

  // Get products by category
  async getProductsByCategory(categoryId: number, page = 0, size = 20): Promise<PaginatedResponse<Product>> {
    try {
      const api = createProductApi();
      const response = await api.getProductsByCategory(categoryId, page, size);
      return transformProductListResponse(response);
    } catch (error: any) {
      console.error('Get products by category error:', error);
      throw handleApiError(error);
    }
  },

  // Search products by name
  async searchProducts(params: ProductSearchParams): Promise<PaginatedResponse<Product>> {
    try {
      const api = createProductApi();
      const response = await api.searchProductsByName(
        params.name,
        params.page || 0,
        params.size || 20
      );
      return transformProductListResponse(response);
    } catch (error: any) {
      console.error('Search products error:', error);
      throw handleApiError(error);
    }
  },

  // Find products by price range
  async findByPriceRange(params: PriceRangeParams): Promise<PaginatedResponse<Product>> {
    try {
      const api = createProductApi();
      const response = await api.findByPriceRange(
        params.min,
        params.max,
        params.page || 0,
        params.size || 20
      );
      return transformProductListResponse(response);
    } catch (error: any) {
      console.error('Find by price range error:', error);
      throw handleApiError(error);
    }
  },

  // Advanced product filtering (combines multiple filters)
  async getFilteredProducts(filters: ProductFilters): Promise<PaginatedResponse<Product>> {
    try {
      let allProducts: Product[] = [];
      let totalCount = 0;

      // Handle multiple category filtering
      if (filters.categoryIds && filters.categoryIds.length > 0) {
        // Fetch products for each category and combine them
        const categoryPromises = filters.categoryIds.map(categoryId =>
          this.getProductsByCategory(categoryId, 0, 1000) // Fetch all products from each category
        );
        
        const categoryResults = await Promise.all(categoryPromises);
        
        // Combine products from all categories, removing duplicates
        const productMap = new Map<number, Product>();
        categoryResults.forEach(result => {
          result.content.forEach(product => {
            if (product.id) {
              productMap.set(product.id, product);
            }
          });
        });
        
        allProducts = Array.from(productMap.values());
        totalCount = allProducts.length;
      } 
      // Handle single category filter (backward compatibility)
      else if (filters.categoryId) {
        const result = await this.getProductsByCategory(
          filters.categoryId,
          0,
          1000 // Fetch all products to filter client-side
        );
        allProducts = result.content;
        totalCount = result.totalElements;
      }
      // If name search is present, use search endpoint
      else if (filters.name && filters.name.trim()) {
        const result = await this.searchProducts({
          name: filters.name,
          page: 0,
          size: 1000 // Fetch all matching products to filter client-side
        });
        allProducts = result.content;
        totalCount = result.totalElements;
      }
      // If price range is present, use price range endpoint
      else if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
        const result = await this.findByPriceRange({
          min: filters.minPrice,
          max: filters.maxPrice,
          page: 0,
          size: 1000 // Fetch all matching products to filter client-side
        });
        allProducts = result.content;
        totalCount = result.totalElements;
      }
      // Default: get all active products
      else {
        const result = await this.getAllProducts(0, 1000); // Fetch all products to filter client-side
        allProducts = result.content;
        totalCount = result.totalElements;
      }

      // Apply client-side filters
      let filteredProducts = allProducts;

      // Apply name filter client-side if we fetched by category (search endpoint wasn't used)
      // or if we have other filters that require client-side filtering
      const usedSearchEndpoint = filters.name && filters.name.trim() && !filters.categoryIds && !filters.categoryId;
      if (filters.name && filters.name.trim() && !usedSearchEndpoint) {
        const searchTerm = filters.name.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
          product.name?.toLowerCase().includes(searchTerm)
        );
      }

      // Apply price range filter client-side if we didn't use the price range endpoint alone
      // (i.e., if we have categories or name filter, we need to filter client-side)
      const usedPriceRangeEndpoint = filters.minPrice !== undefined && filters.maxPrice !== undefined 
        && !filters.categoryIds && !filters.categoryId && !filters.name;
      if ((filters.minPrice !== undefined || filters.maxPrice !== undefined) && !usedPriceRangeEndpoint) {
        filteredProducts = filteredProducts.filter(product => {
          const price = product.price || 0;
          if (filters.minPrice !== undefined && price < filters.minPrice) return false;
          if (filters.maxPrice !== undefined && price > filters.maxPrice) return false;
          return true;
        });
      }

      // Apply sorting
      if (filters.sortBy) {
        filteredProducts.sort((a, b) => {
          let aValue: any;
          let bValue: any;

          switch (filters.sortBy) {
            case 'price':
              aValue = a.price || 0;
              bValue = b.price || 0;
              break;
            case 'name':
              aValue = a.name || '';
              bValue = b.name || '';
              break;
            case 'createdAt':
              aValue = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              bValue = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              break;
            default:
              return 0;
          }

          if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
          if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }

      // Apply pagination
      const page = filters.page || 0;
      const size = filters.size || 20;
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
      const totalPages = Math.ceil(filteredProducts.length / size);

      return {
        content: paginatedProducts,
        totalPages,
        totalElements: filteredProducts.length,
        size,
        number: page,
        first: page === 0,
        last: page >= totalPages - 1,
        numberOfElements: paginatedProducts.length,
      };

    } catch (error: any) {
      console.error('Get filtered products error:', error);
      throw handleApiError(error);
    }
  },

  // Get featured products (alias for active products, can be enhanced later)
  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    try {
      const response = await this.getActiveProducts(0, limit);
      return response.content;
    } catch (error: any) {
      console.error('Get featured products error:', error);
      throw handleApiError(error);
    }
  },

  // Get new arrivals (can be enhanced with sorting by creation date)
  async getNewArrivals(limit = 8): Promise<Product[]> {
    try {
      const response = await this.getActiveProducts(0, limit);
      return response.content;
    } catch (error: any) {
      console.error('Get new arrivals error:', error);
      throw handleApiError(error);
    }
  },

  // Get best sellers (can be enhanced with actual sales data)
  async getBestSellers(limit = 8): Promise<Product[]> {
    try {
      const response = await this.getActiveProducts(0, limit);
      return response.content;
    } catch (error: any) {
      console.error('Get best sellers error:', error);
      throw handleApiError(error);
    }
  },

  // Admin functions (require authentication)
  async createProduct(productData: ProductDTO): Promise<Product> {
    try {
      const api = createProductApi();
      const response = await api.createProduct(productData);
      return transformProductDTO(response.data as ProductDTO);
    } catch (error: any) {
      console.error('Create product error:', error);
      throw handleApiError(error);
    }
  },

  async updateProduct(id: number, productData: ProductDTO): Promise<Product> {
    try {
      const api = createProductApi();
      const response = await api.updateProduct(id, productData);
      return transformProductDTO(response.data as ProductDTO);
    } catch (error: any) {
      console.error('Update product error:', error);
      throw handleApiError(error);
    }
  },

  async deleteProduct(id: number): Promise<void> {
    try {
      const api = createProductApi();
      await api.deleteProduct(id);
    } catch (error: any) {
      console.error('Delete product error:', error);
      throw handleApiError(error);
    }
  },

  async updateStock(id: number, quantity: number): Promise<Product> {
    try {
      const api = createProductApi();
      const response = await api.updateStock(id, quantity);
      return transformProductDTO(response.data as ProductDTO);
    } catch (error: any) {
      console.error('Update stock error:', error);
      throw handleApiError(error);
    }
  },

  // Admin get all products (including inactive)
  async getAllProductsForAdmin(page = 0, size = 20): Promise<PaginatedResponse<Product>> {
    try {
      const api = createProductApi();
      const response = await api.getAllProductsForAdmin(page, size);
      return transformProductListResponse(response);
    } catch (error: any) {
      console.error('Get all products for admin error:', error);
      throw handleApiError(error);
    }
  },
};

export default productService;