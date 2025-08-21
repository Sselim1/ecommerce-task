import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, EMPTY } from 'rxjs';
import { 
  map, 
  mergeMap, 
  catchError, 
  withLatestFrom, 
  debounceTime, 
  distinctUntilChanged,
  tap
} from 'rxjs/operators';

import { ProductService } from '../../../../core/services/product.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ProductActions } from '../actions/product.actions';
import { ProductSelectors } from '../selectors/product.selectors';
import { AppState } from '../../../../store/app.state';

@Injectable()
export class ProductEffects {

  private actions$ = inject(Actions);
  private store = inject<Store<AppState>>(Store as any);
  private productService = inject(ProductService);
  private toastService = inject(ToastService);

  // Load products with caching
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      withLatestFrom(
        this.store.select(ProductSelectors.selectProductFilters),
        this.store.select(ProductSelectors.selectCacheStatus)
      ),
      mergeMap(([action, currentFilters, cacheStatus]) => {
        const params = { ...currentFilters, ...action.params };
        
        if (cacheStatus.cached && !this.isCacheExpired(cacheStatus.cacheExpiry)) {
          return EMPTY; 
        }

        return this.productService.getProducts(params).pipe(
          map(response => ProductActions.loadProductsSuccess({ response })),
          catchError(error => {
            this.toastService.showError('Failed to load products');
            return of(ProductActions.loadProductsFailure({ error: error.message }));
          })
        );
      })
    )
  );

  // Load single product
  loadProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProduct),
      mergeMap(action =>
        this.productService.getProduct(action.id).pipe(
          map(product => ProductActions.loadProductSuccess({ product })),
          catchError(error => {
            this.toastService.showError('Failed to load product');
            return of(ProductActions.loadProductFailure({ error: error.message }));
          })
        )
      )
    )
  );

  // Create product
  createProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.createProduct),
      mergeMap(action =>
        this.productService.createProduct(action.product).pipe(
          map(product => {
            this.toastService.showSuccess('Product created successfully');
            return ProductActions.createProductSuccess({ product });
          }),
          catchError(error => {
            this.toastService.showError('Failed to create product');
            return of(ProductActions.createProductFailure({ error: error.message }));
          })
        )
      )
    )
  );

  // Update product
  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.updateProduct),
      mergeMap(action =>
        this.productService.updateProduct(action.product).pipe(
          map(product => {
            this.toastService.showSuccess('Product updated successfully');
            return ProductActions.updateProductSuccess({ product });
          }),
          catchError(error => {
            this.toastService.showError('Failed to update product');
            return of(ProductActions.updateProductFailure({ error: error.message }));
          })
        )
      )
    )
  );

  // Delete product
  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.deleteProduct),
      mergeMap(action =>
        this.productService.deleteProduct(action.id).pipe(
          map(() => {
            this.toastService.showSuccess('Product deleted successfully');
            return ProductActions.deleteProductSuccess({ id: action.id });
          }),
          catchError(error => {
            this.toastService.showError('Failed to delete product');
            return of(ProductActions.deleteProductFailure({ error: error.message }));
          })
        )
      )
    )
  );

  // Search products with debouncing
  searchProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.setSearchFilter),
      debounceTime(300),
      withLatestFrom(this.store.select(ProductSelectors.selectProductFilters)),
      map(([action, filters]) => {
        const updatedFilters = { ...filters, search: action.search, page: 1 };
        return ProductActions.loadProducts({ params: updatedFilters });
      })
    )
  );

  // Auto-reload after successful mutations
  reloadAfterMutation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ProductActions.createProductSuccess,
        ProductActions.updateProductSuccess,
        ProductActions.deleteProductSuccess
      ),
      withLatestFrom(this.store.select(ProductSelectors.selectProductFilters)),
      map(([action, filters]) => ProductActions.loadProducts({ params: filters }))
    )
  );

  // Handle filter changes
  filterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ProductActions.setStatusFilter,
        ProductActions.setSortOptions,
        ProductActions.setPagination
      ),
      withLatestFrom(this.store.select(ProductSelectors.selectProductFilters)),
      map(([action, filters]) => {
        let updatedFilters = { ...filters };
        
        if (action.type === '[Product] Set Status Filter') {
          updatedFilters = { ...filters, status: action.status as any, page: 1 };
        } else if (action.type === '[Product] Set Sort Options') {
          updatedFilters = { ...filters, sortField: action.sortField as any, sortOrder: action.sortOrder as any, page: 1 };
        } else if (action.type === '[Product] Set Pagination') {
          updatedFilters = { ...filters, page: action.page, limit: action.limit };
        }
        
        return ProductActions.loadProducts({ params: updatedFilters });
      })
    )
  );

  // Clear filters effect
  clearFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.clearFilters),
      map(() => ProductActions.loadProducts({ params: {} }))
    )
  );

  // Refresh products effect
  refreshProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.refreshProducts),
      withLatestFrom(this.store.select(ProductSelectors.selectProductFilters)),
      map(([action, filters]) => ProductActions.loadProducts({ params: filters }))
    )
  );

  // Bulk operations
  bulkDeleteProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.bulkDeleteProducts),
      mergeMap(action => {
        const deleteObservables = action.ids.map(id => 
          this.productService.deleteProduct(id)
        );
        
        // Execute all deletes in parallel
        return Promise.all(deleteObservables.map(obs => obs.toPromise())).then(
          () => {
            this.toastService.showSuccess(`${action.ids.length} products deleted successfully`);
            return ProductActions.refreshProducts();
          },
          error => {
            this.toastService.showError('Failed to delete some products');
            return ProductActions.loadProductsFailure({ error: error.message });
          }
        );
      })
    )
  );

  // Toggle product status
  toggleProductStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.toggleProductStatus),
      withLatestFrom(this.store.select(ProductSelectors.selectAllProducts)),
      mergeMap(([action, products]) => {
        const product = products.find(p => p.id === action.id);
        if (!product) {
          return of(ProductActions.loadProductsFailure({ 
            error: 'Product not found' 
          }));
        }

        const newStatus = product.status === 'active' ? 'inactive' : 'active';

        return this.productService.updateProduct({ ...product, status: newStatus }).pipe(
          map(updated => {
            this.toastService.showSuccess(
              `Product ${updated.status === 'active' ? 'activated' : 'deactivated'}`
            );
            return ProductActions.updateProductSuccess({ product: updated });
          }),
          catchError(error => {
            // Revert optimistic update
            this.toastService.showError('Failed to update product status');
            return of(ProductActions.toggleProductStatus({ id: action.id }));
          })
        );
      })
    )
  );

  private isCacheExpired(cacheExpiry: string | null): boolean {
    if (!cacheExpiry) return true;
    return new Date() > new Date(cacheExpiry);
  }
}