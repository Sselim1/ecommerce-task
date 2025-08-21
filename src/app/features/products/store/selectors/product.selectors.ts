import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from '../reducers/product.reducer';
import { Product, ProductStatus } from '../../../../shared/models/product.model';

// Feature selector
export const selectProductState = createFeatureSelector<ProductState>('products');

// Basic selectors
export const selectAllProducts = createSelector(
  selectProductState,
  (state: ProductState) => state.products
);

export const selectSelectedProduct = createSelector(
  selectProductState,
  (state: ProductState) => state.selectedProduct
);

export const selectProductsLoading = createSelector(
  selectProductState,
  (state: ProductState) => state.loading
);

export const selectProductsError = createSelector(
  selectProductState,
  (state: ProductState) => state.error
);

export const selectProductFilters = createSelector(
  selectProductState,
  (state: ProductState) => state.filters
);

// Pagination selectors
export const selectPaginationInfo = createSelector(
  selectProductState,
  (state: ProductState) => ({
    currentPage: state.currentPage,
    totalPages: state.totalPages,
    total: state.total,
    limit: state.filters.limit || 10
  })
);

export const selectCurrentPage = createSelector(
  selectProductState,
  (state: ProductState) => state.currentPage
);

export const selectTotalPages = createSelector(
  selectProductState,
  (state: ProductState) => state.totalPages
);

export const selectTotalProducts = createSelector(
  selectProductState,
  (state: ProductState) => state.total
);

// Cache selectors
export const selectCacheStatus = createSelector(
  selectProductState,
  (state: ProductState) => ({
    cached: state.cached,
    cacheExpiry: state.cacheExpiry,
    lastUpdated: state.lastUpdated
  })
);

// Filtered and computed selectors
export const selectActiveProducts = createSelector(
  selectAllProducts,
  (products: Product[]) => products.filter(p => p.status === 'active')
);

export const selectInactiveProducts = createSelector(
  selectAllProducts,
  (products: Product[]) => products.filter(p => p.status === 'inactive')
);

export const selectLowStockProducts = createSelector(
  selectAllProducts,
  (products: Product[]) => products.filter(p => p.stock < 10)
);

export const selectOutOfStockProducts = createSelector(
  selectAllProducts,
  (products: Product[]) => products.filter(p => p.stock === 0)
);

// Statistics selectors
export const selectProductStats = createSelector(
  selectAllProducts,
  (products: Product[]) => {
    const total = products.length;
    const active = products.filter(p => p.status === 'active').length;
    const inactive = products.filter(p => p.status === 'inactive').length;
    const lowStock = products.filter(p => p.stock < 10).length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    return {
      total,
      active,
      inactive,
      lowStock,
      outOfStock,
      totalValue
    };
  }
);

// Search and filter selectors
export const selectSearchTerm = createSelector(
  selectProductFilters,
  (filters) => filters.search || ''
);

export const selectStatusFilter = createSelector(
  selectProductFilters,
  (filters) => filters.status || 'all'
);

export const selectSortOptions = createSelector(
  selectProductFilters,
  (filters) => ({
    sortField: filters.sortField || 'name',
    sortOrder: filters.sortOrder || 'asc'
  })
);

// Product lookup selector (memoized)
export const selectProductById = createSelector(
  selectAllProducts,
  (products: Product[], props: { id: number }) => 
    products.find(product => product.id === props.id) || null
);

// UI state selectors
export const selectHasProducts = createSelector(
  selectAllProducts,
  (products: Product[]) => products.length > 0
);

export const selectIsEmpty = createSelector(
  selectAllProducts,
  selectProductsLoading,
  (products: Product[], loading: boolean) => products.length === 0 && !loading
);

export const selectHasError = createSelector(
  selectProductsError,
  (error: string | null) => !!error
);

export const selectIsFirstLoad = createSelector(
  selectProductState,
  (state: ProductState) => !state.lastUpdated && !state.loading
);

// Advanced filtering selector
export const selectFilteredProducts = createSelector(
  selectAllProducts,
  selectProductFilters,
  (products: Product[], filters) => {
    let filtered = [...products];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        (product.description && product.description.toLowerCase().includes(searchTerm))
      );
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(product => product.status === filters.status);
    }

    return filtered;
  }
);

// Export namespace for easier imports
export const ProductSelectors = {
  selectProductState,
  selectAllProducts,
  selectSelectedProduct,
  selectProductsLoading,
  selectProductsError,
  selectProductFilters,
  selectPaginationInfo,
  selectCurrentPage,
  selectTotalPages,
  selectTotalProducts,
  selectCacheStatus,
  selectActiveProducts,
  selectInactiveProducts,
  selectLowStockProducts,
  selectOutOfStockProducts,
  selectProductStats,
  selectSearchTerm,
  selectStatusFilter,
  selectSortOptions,
  selectProductById,
  selectHasProducts,
  selectIsEmpty,
  selectHasError,
  selectIsFirstLoad,
  selectFilteredProducts
};