import { ProductDTO } from '../../generated-typescript';
import { PaginatedResponse } from './category';

// Extend the generated ProductDTO with frontend-specific properties
export interface Product extends ProductDTO {
  // Frontend specific properties
  title?: string; // Alias for name, for UI compatibility
  reviews?: number; // Number of reviews
  discountedPrice?: number; // For sales/discounts
  rating?: number; // Average rating
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
  // Computed properties
  isOnSale?: boolean; // Computed from price vs discountedPrice
  discountPercentage?: number; // Computed discount percentage
}

// Product filters for search and listing
export interface ProductFilters {
  categoryId?: number; // For backward compatibility
  categoryIds?: number[]; // Support multiple categories
  minPrice?: number;
  maxPrice?: number;
  name?: string;
  sortBy?: 'price' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

// Product search parameters
export interface ProductSearchParams {
  name: string;
  page?: number;
  size?: number;
}

// Product price range parameters
export interface PriceRangeParams {
  min: number;
  max: number;
  page?: number;
  size?: number;
}

// Product state for Redux
export interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  featuredProducts: Product[];
  newArrivals: Product[];
  bestSellers: Product[];
  isLoading: boolean;
  error: string | null;
}

// Product component props
export interface ProductCardProps {
  product: Product;
  showQuickView?: boolean;
  showWishlist?: boolean;
  className?: string;
}

export interface ProductListProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  onProductClick?: (product: Product) => void;
}

export interface ProductFilterProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  categories?: Array<{ id: number; name: string }>;
  loading?: boolean;
}
