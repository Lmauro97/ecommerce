import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesCheckoutComponent } from './pages/pages-checkout/pages-checkout.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { FormCheckoutComponent } from './components/form-checkout/form-checkout.component';
import { ListProductCartComponent } from './components/list-product-cart/list-product-cart.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ResultPayComponent } from './pages/result-pay/result-pay.component';

@NgModule({
  declarations: [
    PagesCheckoutComponent,
    FormCheckoutComponent,
    ListProductCartComponent,
    ResultPayComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    CheckoutRoutingModule,
    ReactiveFormsModule,
  ],
  exports: [],
})
export class CheckoutModule {}
