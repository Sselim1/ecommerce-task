
import { Routes } from '@angular/router';
import { provideProductsFeature } from './features/products/store/products-feature/products-feature';

export const routes: Routes = [
  {
    path: '',
    providers: [provideProductsFeature()],
    loadComponent: () => import('./features/products/components/products-page/products-page').then(m => m.ProductsPage)
  },
  {
    path: 'products/new',
    providers: [provideProductsFeature()],
    loadComponent: () => import('./features/products/components/product-form-page/product-form-page').then(m => m.ProductFormPage)
  },
  {
    path: 'products/:id',
    providers: [provideProductsFeature()],
    loadComponent: () => import('./features/products/components/product-form-page/product-form-page').then(m => m.ProductFormPage)
  },
  { path: '**', redirectTo: '' }
];
