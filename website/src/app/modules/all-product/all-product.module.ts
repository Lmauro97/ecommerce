import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllProductRoutingModule } from './all-product-routing.module';
import { ListAllProductComponent } from './components/list-all-product/list-all-product.component';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [ListAllProductComponent],
  imports: [CommonModule, AllProductRoutingModule, SharedModule],
  exports: [ListAllProductComponent],
})
export class AllProductModule {}
