export interface Product {
  id: number | string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  status: ProductStatus;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ProductStatus = 'active' | 'inactive';

export interface ProductFilters {
  search?: string;
  status?: ProductStatus | 'all';
  sortField?: ProductSortField;
  sortOrder?: SortOrder;
}

export type ProductSortField = 'name' | 'price' | 'stock' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  stock: number;
  status: ProductStatus;
  image?: string;
}

export interface UpdateProductRequest extends CreateProductRequest {
  id: number | string;
}

export interface ProductSearchParams extends ProductFilters, PaginationParams {}

export interface ProductFormErrors {
  name?: string[];
  price?: string[];
  stock?: string[];
  image?: string[];
}

export interface ProductValidationRules {
  name: {
    required: true;
    minLength: number;
    maxLength: number;
  };
  price: {
    required: true;
    min: number;
  };
  stock: {
    required: true;
    min: number;
  };
  description: {
    maxLength: number;
  };
}

export const PRODUCT_VALIDATION_RULES: ProductValidationRules = {
  name: {
    required: true,
    minLength: 3,
    maxLength: 100
  },
  price: {
    required: true,
    min: 0.01
  },
  stock: {
    required: true,
    min: 0
  },
  description: {
    maxLength: 500
  }
};

export const PRODUCT_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
] as const;

export const PRODUCT_SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'price', label: 'Price' },
  { value: 'stock', label: 'Stock' },
  { value: 'createdAt', label: 'Date Created' }
] as const;