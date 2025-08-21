import { createReducer, on } from '@ngrx/store';
import { 
  Product, 
  ProductSearchParams, 
  ProductStatus 
} from '../../../../shared/models/product.model';
import { ProductActions } from '../actions/product.actions';

export interface ProductState {
  // Data
  products: Product[];
  selectedProduct: Product | null;
  total: number;
  currentPage: number;
  totalPages: number;
  
  // Filters and search
  filters: Partial<ProductSearchParams>;
  
  // UI state
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  
  // Cache
  cached: boolean;
  cacheExpiry: string | null;
}

export const initialProductState: ProductState = {
  products: [],
  selectedProduct: null,
  total: 0,
  currentPage: 1,
  totalPages: 0,
  filters: {
    search: '',
    status: 'all',
    sortField: 'name',
    sortOrder: 'asc',
    page: 1,
    limit: 10
  },
  loading: false,
  error: null,
  lastUpdated: null,
  cached: false,
  cacheExpiry: null
};

export const productReducer = createReducer(
  initialProductState,
  
  // Load products
  on(ProductActions.loadProducts, (state, { params }) => ({
    ...state,
    loading: true,
    error: null,
    filters: {
      ...state.filters,
      ...params
    }
  })),

  on(ProductActions.loadProductsSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    products: response.products,
    total: response.total,
    currentPage: response.page,
    totalPages: response.totalPages,
    lastUpdated: new Date().toISOString(),
    cached: true,
    cacheExpiry: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
    error: null
  })),

  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    products: [],
    total: 0,
    totalPages: 0
  })),

  // Load single product
  on(ProductActions.loadProduct, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ProductActions.loadProductSuccess, (state, { product }) => ({
    ...state,
    loading: false,
    selectedProduct: product,
    error: null
  })),

  on(ProductActions.loadProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    selectedProduct: null
  })),

  // Create product
  on(ProductActions.createProduct, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ProductActions.createProductSuccess, (state, { product }) => ({
    ...state,
    loading: false,
    products: [product, ...state.products],
    total: state.total + 1,
    error: null,
    cached: false // Invalidate cache
  })),

  on(ProductActions.createProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update product
  on(ProductActions.updateProduct, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ProductActions.updateProductSuccess, (state, { product }) => ({
    ...state,
    loading: false,
    products: state.products.map(p => p.id === product.id ? product : p),
    selectedProduct: state.selectedProduct?.id === product.id ? product : state.selectedProduct,
    error: null,
    cached: false
  })),

  on(ProductActions.updateProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete product
  on(ProductActions.deleteProduct, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ProductActions.deleteProductSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    products: state.products.filter(p => p.id !== id),
    total: state.total - 1,
    selectedProduct: state.selectedProduct?.id === id ? null : state.selectedProduct,
    error: null,
    cached: false
  })),

  on(ProductActions.deleteProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Filters
  on(ProductActions.setSearchFilter, (state, { search }) => ({
    ...state,
    filters: {
      ...state.filters,
      search,
      page: 1 // Reset to first page when searching
    },
    cached: false
  })),

  on(ProductActions.setStatusFilter, (state, { status }) => ({
    ...state,
    filters: {
      ...state.filters,
      status: status as any,
      page: 1
    },
    cached: false
  })),

  on(ProductActions.setSortOptions, (state, { sortField, sortOrder }) => ({
    ...state,
    filters: {
      ...state.filters,
      sortField: sortField as any,
      sortOrder: sortOrder as any,
      page: 1
    },
    cached: false
  })),

  on(ProductActions.setPagination, (state, { page, limit }) => ({
    ...state,
    filters: {
      ...state.filters,
      page,
      limit
    },
    cached: false
  })),

  on(ProductActions.clearFilters, (state) => ({
    ...state,
    filters: {
      ...initialProductState.filters
    },
    cached: false
  })),

  // UI state
  on(ProductActions.setLoading, (state, { loading }) => ({
    ...state,
    loading
  })),

  on(ProductActions.clearError, (state) => ({
    ...state,
    error: null
  })),

  on(ProductActions.selectProduct, (state, { product }) => ({
    ...state,
    selectedProduct: product
  })),

  // Optimistic updates
  on(ProductActions.toggleProductStatus, (state, { id }) => ({
    ...state,
    products: state.products.map(p => 
      p.id === id 
        ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' as ProductStatus }
        : p
    ),
    cached: false
  })),

  on(ProductActions.bulkDeleteProducts, (state, { ids }) => ({
    ...state,
    products: state.products.filter(p => !ids.includes(p.id as any)),
    total: state.total - ids.length,
    cached: false
  })),

  // Cache management
  on(ProductActions.refreshProducts, (state) => ({
    ...state,
    cached: false,
    cacheExpiry: null
  })),

  on(ProductActions.clearCache, (state) => ({
    ...state,
    products: [],
    total: 0,
    cached: false,
    cacheExpiry: null,
    lastUpdated: null
  }))
);