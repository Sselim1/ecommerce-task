import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';

import { RouterLink } from '@angular/router';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination/pagination';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton';
import { PRODUCT_SORT_OPTIONS, Product } from '../../../../shared/models/product.model';
import { AppState } from '../../../../store/app.state';
import { ProductActions } from '../../store/actions/product.actions';
import { ProductSelectors } from '../../store/selectors/product.selectors';


@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PaginationComponent, LoadingSkeletonComponent, NgIf],
  templateUrl: './products-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsPage {
  private readonly store = inject(Store<AppState>);

  products$ = this.store.select(ProductSelectors.selectAllProducts);
  loading$ = this.store.select(ProductSelectors.selectProductsLoading);
  error$ = this.store.select(ProductSelectors.selectProductsError);
  isEmpty$ = this.store.select(ProductSelectors.selectIsEmpty);
  pagination$ = this.store.select(ProductSelectors.selectPaginationInfo);

  search = '';
  status: 'all' | 'active' | 'inactive' = 'all';
  sortField: string = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  sortOptions = PRODUCT_SORT_OPTIONS;

  ngOnInit() {
    this.store.dispatch(ProductActions.loadProducts({ params: {} }));
    
    // Initialize form values from store
    this.store.select(ProductSelectors.selectProductFilters).subscribe(filters => {
      this.search = filters.search || '';
      this.status = filters.status || 'all';
      this.sortField = filters.sortField || 'name';
      this.sortOrder = filters.sortOrder || 'asc';
    });
  }

  onSearchChange(value: string) {
    this.search = value;
    this.store.dispatch(ProductActions.setSearchFilter({ search: value }));
  }
  onStatusChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement | null;
    if (selectElement) {
      this.status = selectElement.value as 'all' | 'active' | 'inactive';
      this.store.dispatch(ProductActions.setStatusFilter({ status: this.status }));
    }
  }
  onSortChange() {
    this.store.dispatch(ProductActions.setSortOptions({ 
      sortField: this.sortField, 
      sortOrder: this.sortOrder 
    }));
  }
  onPageChange(page: number, limit: number) {
    this.store.dispatch(ProductActions.setPagination({ page, limit }));
  }
  delete(id: number | string) {
    this.store.dispatch(ProductActions.deleteProduct({ id }));
  }
  trackById(index: number, item: Product) { return item.id; }
}