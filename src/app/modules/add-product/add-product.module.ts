import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductRoutingModule } from './add-product-routing.module';
import { PageAddProductComponent } from './pages/page-add-product/page-add-product.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NewProductComponent } from './components/new-product/new-product.component';
import { PagesListProductComponent } from './pages/pages-list-product/pages-list-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { ListProductComponent } from './components/list-product/list-product.component';
import { PageEditProductComponent } from './pages/page-edit-product/page-edit-product.component';

@NgModule({
  declarations: [
    PageAddProductComponent,
    NewProductComponent,
    PagesListProductComponent,
    EditProductComponent,
    ListProductComponent,
    PageEditProductComponent,
  ],
  imports: [
    CommonModule,
    AddProductRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class AddProductModule {}
