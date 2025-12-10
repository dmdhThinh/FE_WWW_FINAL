import { CategoryDTO } from '../../generated-typescript';

// Extended category types for frontend use
export interface Category extends CategoryDTO {
  // Additional frontend-specific fields
  title?: string; // For backward compatibility with existing components
  img?: string; // For backward compatibility with existing components
  imageUrl?: string;
  productCount?: number;
  isActive?: boolean;
  slug?: string;
  displayOrder?: number;
}

export interface CategoryState {
  categories: Category[];
  currentCategory: Category | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest {
  name: string;
  description?: string;
}

export interface CategoryResponse {
  status: number;
  category?: Category;
  categories?: Category[];
  message?: string;
}

export interface CategoryFilters {
  name?: string;
  page?: number;
  size?: number;
  sortBy?: 'name' | 'id';
  sortOrder?: 'asc' | 'desc';
}

// Category validation helpers
export interface CategoryValidationError {
  field: string;
  message: string;
}

export type CategoryValidationResult = {
  isValid: boolean;
  errors: CategoryValidationError[];
};

// Generic paginated response interface
export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // current page
  first: boolean;
  last: boolean;
  numberOfElements: number;
}
