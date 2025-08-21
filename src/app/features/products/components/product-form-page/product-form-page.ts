import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ProductService } from '../../../../core/services/product.service';
import { PRODUCT_VALIDATION_RULES, ProductStatus, Product } from '../../../../shared/models/product.model';
import { AppState } from '../../../../store/app.state';
import { ProductActions } from '../../store/actions/product.actions';


@Component({
  selector: 'app-product-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './product-form-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFormPage {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(Store<AppState>);
  private readonly productService = inject(ProductService);

  rules = PRODUCT_VALIDATION_RULES;
  isEdit = false;
  saving = false;
  imagePreview: string | null = null;
  imageError: string | null = null;
  productId: number | string | null = null;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(this.rules.name.minLength), Validators.maxLength(this.rules.name.maxLength)]],
    description: ['', [Validators.maxLength(this.rules.description.maxLength)]],
    price: [null as any, [Validators.required, Validators.min(this.rules.price.min)]],
    stock: [0, [Validators.required, Validators.min(this.rules.stock.min)]],
    status: ['active' as ProductStatus]
  });

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.productId = idParam.toString();
      this.productService.getProduct(this.productId).subscribe(p => {
        this.form.patchValue({
          name: p.name,
          description: p.description || '',
          price: p.price,
          stock: p.stock,
          status: p.status,
        });
        this.imagePreview = p.image || null;
      });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const validation = this.productService.validateImageFile(file);
    if (!validation.valid) {
      this.imageError = validation.error || 'Invalid image';
      return;
    }
    this.imageError = null;
    this.productService.uploadImage(file).subscribe(url => this.imagePreview = url);
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.saving = true;
    const data = { ...this.form.value, image: this.imagePreview } as any as Product;
    if (this.isEdit && this.productId) {
      const update = { ...data, id: this.productId } as Product;
      this.store.dispatch(ProductActions.updateProduct({ product: update }));
    } else {
      this.store.dispatch(ProductActions.createProduct({ product: data as any }));
    }
    this.router.navigateByUrl('/');
  }

  cancel() {
    this.router.navigateByUrl('/');
  }
}

