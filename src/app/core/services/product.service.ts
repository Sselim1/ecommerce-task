import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError, retry, mergeMap, delay } from 'rxjs/operators';
import { 
  Product, 
  ProductsResponse, 
  ProductSearchParams, 
  CreateProductRequest, 
  UpdateProductRequest 
} from '../../shared/models/product.model';
import { environment } from '../../../environment';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/products`;
  constructor(private http: HttpClient) {}

 
  getProducts(params: Partial<ProductSearchParams> = {}): Observable<ProductsResponse> {
    // Always get all products first, then apply filters client-side
    return this.http.get<Product[]>(this.apiUrl).pipe(
      delay(800), // Add delay to show loading state
      map(allProducts => {
        // Ensure all product IDs are numbers or keep as strings if they're alphanumeric
        let products: Product[] = allProducts.map(product => ({
          ...product,
          id: this.normalizeId(product.id)
        }));
        
        const page = params.page || 1;
        const limit = params.limit || 10;
        
        // 1. Apply search filter first
        if (params.search?.trim()) {
          const searchTerm = params.search.trim().toLowerCase();
          products = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            (product.description && product.description.toLowerCase().includes(searchTerm))
          );
        }
        
        // 2. Apply status filter
        if (params.status && params.status !== 'all') {
          products = products.filter(product => product.status === params.status);
        }
        
        // 3. Apply sorting
        if (params.sortField) {
          products.sort((a, b) => {
            let aValue: any = a[params.sortField as keyof Product];
            let bValue: any = b[params.sortField as keyof Product];
            
            // Handle string values
            if (typeof aValue === 'string') {
              aValue = aValue.toLowerCase();
              bValue = bValue.toLowerCase();
            }
            
            // Handle null/undefined values
            if (aValue == null) aValue = '';
            if (bValue == null) bValue = '';
            
            if (params.sortOrder === 'desc') {
              return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            } else {
              return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            }
          });
        }
        
        // 4. Calculate total before pagination
        const total = products.length;
        const totalPages = Math.ceil(total / limit);
        
        // 5. Apply pagination
        if (params.page && params.limit) {
          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + limit;
          products = products.slice(startIndex, endIndex);
        }
        
        const response: ProductsResponse = {
          products,
          total,
          page,
          totalPages
        };
        
        return response;
      }),
      retry(2),
      catchError(this.handleError)
    );
  }

  getProduct(id: number | string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      delay(500), // Add delay to show loading state
      map(product => ({
        ...product,
        id: this.normalizeId(product.id)
      })),
      retry(2),
      catchError(this.handleError)
    );
  }

 
  createProduct(product: CreateProductRequest): Observable<Product> {
    const productData = {
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return this.http.post<Product>(this.apiUrl, productData).pipe(
      delay(300), // Add delay to show loading state
      map(createdProduct => ({
        ...createdProduct,
        id: this.normalizeId(createdProduct.id)
      })),
      catchError(this.handleError)
    );
  }


  updateProduct(product: UpdateProductRequest): Observable<Product> {
    const productData = {
      ...product,
      updatedAt: new Date().toISOString()
    };

    return this.http.put<Product>(`${this.apiUrl}/${product.id}`, productData).pipe(
      delay(300), // Add delay to show loading state
      map(updatedProduct => ({
        ...updatedProduct,
        id: this.normalizeId(updatedProduct.id)
      })),
      catchError(this.handleError)
    );
  }

  deleteProduct(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      delay(300), // Add delay to show loading state
      catchError(this.handleError)
    );
  }


  uploadImage(file: File): Observable<string> {

    return new Observable(observer => {
      const reader = new FileReader();
      reader.onload = () => {
        observer.next(reader.result as string);
        observer.complete();
      };
      reader.onerror = () => {
        observer.error(new Error('Failed to read image file'));
      };
      reader.readAsDataURL(file);
    });
  }

  validateImageFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Please select a valid image file (JPEG, PNG, or WebP)'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Image file size must be less than 5MB'
      };
    }

    return { valid: true };
  }

 
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 404:
          errorMessage = 'Product not found';
          break;
        case 400:
          errorMessage = 'Invalid product data';
          break;
        case 409:
          errorMessage = 'Product with this name already exists';
          break;
        case 500:
          errorMessage = 'Internal server error';
          break;
        default:
          errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
      }
    }

    console.error('ProductService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Helper method to normalize IDs
  private normalizeId(id: any): number | string {
    if (typeof id === 'string') {
      // If it's a numeric string, convert to number
      if (/^\d+$/.test(id)) {
        return parseInt(id, 10);
      }
      // If it's alphanumeric, keep as string
      return id;
    }
    return id;
  }
}