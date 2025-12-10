import { CategoryControllerApi, Configuration } from '../../generated-typescript';
import { BASE_PATH } from '../../generated-typescript/base';
import {
  Category,
  CategoryState,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryResponse,
  CategoryFilters,
  CategoryValidationResult,
  CategoryValidationError
} from '../types/category';

// API Configuration
const createCategoryApi = (): CategoryControllerApi => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const config = new Configuration({
    basePath: BASE_PATH,
    accessToken: token || undefined,
    baseOptions: {
      withCredentials: !!token,
    },
  });

  return new CategoryControllerApi(config);
};

// Category Service
// Error handling helper
const handleApiError = (error: any): Error => {
  if (error.response && error.response.data) {
    const msg = error.response.data.message;
    throw new Error(msg);
  }
  throw handleApiError(error);
};

export const categoryService = {
  // Get all categories
  async getAllCategories(page: number = 0, size: number = 0): Promise<CategoryState> {
    try {
      const api = createCategoryApi();
      const response = await api.getAllCategories(page, size);
      
      const categories = response.data["content"] as Category[];

      return {
        categories: categories.map(category => this.enrichCategoryWithFormattedFields(category)),
        currentCategory: null,
        isLoading: false,
        error: null,
        totalCount: categories.length
      };
    } catch (error: any) {
      console.error('Get all categories error:', error);
      return {
        categories: [],
        currentCategory: null,
        isLoading: false,
        error: error.message || 'Failed to fetch categories',
        totalCount: 0
      };
    }
  },

  // Get category by ID
  async getCategoryById(id: number): Promise<Category> {
    try {
      const api = createCategoryApi();
      const response = await api.getCategoryById(id);
      const category = response.data as Category;
      return this.enrichCategoryWithFormattedFields(category);
    } catch (error: any) {
      console.error('Get category by ID error:', error);
      throw handleApiError(error);
    }
  },

  // Search categories by name
  async searchCategories(name: string, page: number = 0, size: number = 20): Promise<CategoryState> {
    try {
      const api = createCategoryApi();
      const response = await api.searchByName(name, page, size);
      const categories = response.data as Category[];

      return {
        categories: categories.map(category => this.enrichCategoryWithFormattedFields(category)),
        currentCategory: null,
        isLoading: false,
        error: null,
        totalCount: categories.length
      };
    } catch (error: any) {
      console.error('Search categories error:', error);
      return {
        categories: [],
        currentCategory: null,
        isLoading: false,
        error: error.message || 'Failed to search categories',
        totalCount: 0
      };
    }
  },

  // Create new category (admin only)
  async createCategory(request: CreateCategoryRequest): Promise<CategoryResponse> {
    try {
      const validation = this.validateCreateCategoryRequest(request);
      if (!validation.isValid) {
        throw {
          status: 400,
          message: 'Validation failed',
          errors: validation.errors
        };
      }

      const api = createCategoryApi();
      const response = await api.createCategory({
        name: request.name,
        description: request.description
      });

      const category = response.data as Category;
      return {
        status: 201,
        category: this.enrichCategoryWithFormattedFields(category),
        message: 'Category created successfully'
      };
    } catch (error: any) {
      console.error('Create category error:', error);
      const errorData = error.response?.data as CategoryResponse || {
        status: 400,
        message: 'Failed to create category: ' + (error.message || 'Unknown error')
      };
      throw handleApiError(error);
    }
  },

  // Update category (admin only)
  async updateCategory(id: number, request: UpdateCategoryRequest): Promise<CategoryResponse> {
    try {
      const validation = this.validateUpdateCategoryRequest(request);
      if (!validation.isValid) {
        throw {
          status: 400,
          message: 'Validation failed',
          errors: validation.errors
        };
      }

      const api = createCategoryApi();
      const response = await api.updateCategory(id, {
        name: request.name,
        description: request.description
      });

      const category = response.data as Category;
      return {
        status: 200,
        category: this.enrichCategoryWithFormattedFields(category),
        message: 'Category updated successfully'
      };
    } catch (error: any) {
      console.error('Update category error:', error);
      const errorData = error.response?.data as CategoryResponse || {
        status: 400,
        message: 'Failed to update category: ' + (error.message || 'Unknown error')
      };
      throw handleApiError(error);
    }
  },

  // Delete category (admin only)
  async deleteCategory(id: number): Promise<any> {
    try {
      const api = createCategoryApi();
      const response = await api.deleteCategory(id);
      return response.data;
    } catch (error: any) {
      console.error('Delete category error:', error);
      throw handleApiError(error);
    }
  },

  // Format category with additional fields
  enrichCategoryWithFormattedFields(category: Category): Category {
    return {
      ...category,
      // For backward compatibility, map name to title if title doesn't exist
      title: category.title || category.name,
      // Generate slug from name if slug doesn't exist
      slug: category.slug || this.generateSlug(category.name),
      // Generate image URL if needed
      imageUrl: category.imageUrl || category.img || this.getDefaultCategoryImage(category.name),
      // Default to active if not specified
      isActive: category.isActive !== undefined ? category.isActive : true,
      // Default display order
      displayOrder: category.displayOrder || 0
    };
  },

  // Generate URL-friendly slug from name
  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  },

  // Get default image for category based on name
  getDefaultCategoryImage(name: string): string {
    const categoryImages: { [key: string]: string } = {
      'laptop': '/images/categories/laptop.jpg',
      'desktop': '/images/categories/desktop.jpg',
      'monitor': '/images/categories/monitor.jpg',
      'keyboard': '/images/categories/keyboard.jpg',
      'mouse': '/images/categories/mouse.jpg',
      'headphone': '/images/categories/headphone.jpg',
      'speaker': '/images/categories/speaker.jpg',
      'graphics card': '/images/categories/graphics-card.jpg',
      'processor': '/images/categories/processor.jpg',
      'motherboard': '/images/categories/motherboard.jpg',
      'memory': '/images/categories/memory.jpg',
      'storage': '/images/categories/storage.jpg'
    };

    const normalizedName = name.toLowerCase();

    // Check for exact matches first
    if (categoryImages[normalizedName]) {
      return categoryImages[normalizedName];
    }

    // Check for partial matches
    for (const [key, image] of Object.entries(categoryImages)) {
      if (normalizedName.includes(key)) {
        return image;
      }
    }

    // Return default image if no match
    return '/images/categories/default.jpg';
  },

  // Validate create category request
  validateCreateCategoryRequest(request: CreateCategoryRequest): CategoryValidationResult {
    const errors: CategoryValidationError[] = [];

    if (!request.name || request.name.trim().length < 2) {
      errors.push({
        field: 'name',
        message: 'Category name must be at least 2 characters long'
      });
    }

    if (request.name && request.name.length > 100) {
      errors.push({
        field: 'name',
        message: 'Category name must not exceed 100 characters'
      });
    }

    if (request.description && request.description.length > 500) {
      errors.push({
        field: 'description',
        message: 'Description must not exceed 500 characters'
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Validate update category request
  validateUpdateCategoryRequest(request: UpdateCategoryRequest): CategoryValidationResult {
    const errors: CategoryValidationError[] = [];

    if (!request.name || request.name.trim().length < 2) {
      errors.push({
        field: 'name',
        message: 'Category name must be at least 2 characters long'
      });
    }

    if (request.name && request.name.length > 100) {
      errors.push({
        field: 'name',
        message: 'Category name must not exceed 100 characters'
      });
    }

    if (request.description && request.description.length > 500) {
      errors.push({
        field: 'description',
        message: 'Description must not exceed 500 characters'
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Filter and sort categories
  filterCategories(categories: Category[], filters: CategoryFilters): Category[] {
    let filteredCategories = [...categories];

    // Filter by name
    if (filters.name) {
      const searchTerm = filters.name.toLowerCase();
      filteredCategories = filteredCategories.filter(category =>
        category.name.toLowerCase().includes(searchTerm) ||
        category.description?.toLowerCase().includes(searchTerm)
      );
    }

    // Sort
    if (filters.sortBy) {
      filteredCategories.sort((a, b) => {
        let aValue: any = a[filters.sortBy!];
        let bValue: any = b[filters.sortBy!];

        // Handle null/undefined values
        if (aValue === null || aValue === undefined) aValue = '';
        if (bValue === null || bValue === undefined) bValue = '';

        // Compare strings
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (filters.sortOrder === 'desc') {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        } else {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        }
      });
    }

    return filteredCategories;
  },

  // Get category by slug
  getCategoryBySlug(categories: Category[], slug: string): Category | null {
    return categories.find(category => category.slug === slug) || null;
  },

  // Get popular categories (for now, returns first few categories)
  getPopularCategories(categories: Category[], limit: number = 6): Category[] {
    return categories.slice(0, limit);
  }
};

export default categoryService;