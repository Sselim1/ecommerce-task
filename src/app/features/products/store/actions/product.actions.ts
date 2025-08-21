import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { 
  Product, 
  ProductSearchParams, 
  ProductsResponse, 
  CreateProductRequest, 
  UpdateProductRequest 
} from '../../../../shared/models/product.model';

export const ProductActions = createActionGroup({
  source: 'Product',
  events: {
    // Load products
    'Load Products': props<{ params?: Partial<ProductSearchParams> }>(),
    'Load Products Success': props<{ response: ProductsResponse }>(),
    'Load Products Failure': props<{ error: string }>(),

    // Load single product
    'Load Product': props<{ id: number }>(),
    'Load Product Success': props<{ product: Product }>(),
    'Load Product Failure': props<{ error: string }>(),

    // Create product
    'Create Product': props<{ product: CreateProductRequest }>(),
    'Create Product Success': props<{ product: Product }>(),
    'Create Product Failure': props<{ error: string }>(),

    // Update product
    'Update Product': props<{ product: UpdateProductRequest }>(),
    'Update Product Success': props<{ product: Product }>(),
    'Update Product Failure': props<{ error: string }>(),

    // Delete product
    'Delete Product': props<{ id: number | string }>(),
    'Delete Product Success': props<{ id: number | string }>(),
    'Delete Product Failure': props<{ error: string }>(),

    // Filter and search
    'Set Search Filter': props<{ search: string }>(),
    'Set Status Filter': props<{ status: string }>(),
    'Set Sort Options': props<{ sortField: string; sortOrder: string }>(),
    'Set Pagination': props<{ page: number; limit: number }>(),
    'Clear Filters': emptyProps(),

    // UI state
    'Set Loading': props<{ loading: boolean }>(),
    'Clear Error': emptyProps(),
    'Select Product': props<{ product: Product | null }>(),

    // Optimistic updates
    'Toggle Product Status': props<{ id: number | string }>(),
    'Bulk Delete Products': props<{ ids: (number | string)[] }>(),
    'Bulk Update Products': props<{ updates: Partial<Product>; ids: (number | string)[] }>(),

    // Cache management
    'Refresh Products': emptyProps(),
    'Clear Cache': emptyProps()
  }
});

// Action creators for complex operations
export const ProductComplexActions = {
  searchProducts: (searchTerm: string) => 
    ProductActions.loadProducts({ params: { search: searchTerm, page: 1 } }),
  
  filterByStatus: (status: string) => 
    ProductActions.loadProducts({ params: { status: status as any, page: 1 } }),
  
  sortProducts: (sortField: string, sortOrder: string) =>
    ProductActions.loadProducts({ 
      params: { sortField: sortField as any, sortOrder: sortOrder as any, page: 1 } 
    }),
  
  changePage: (page: number, limit: number = 10) =>
    ProductActions.loadProducts({ params: { page, limit } }),
    
  refreshWithCurrentFilters: () => ProductActions.refreshProducts()
};