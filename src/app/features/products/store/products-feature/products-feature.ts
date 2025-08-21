import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { productReducer } from '../reducers/product.reducer';
import { ProductEffects } from '../effects/product.effects';

export const provideProductsFeature = () => [
  provideState({ name: 'products', reducer: productReducer }),
  provideEffects(ProductEffects)
];

