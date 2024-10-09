import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesCategoryComponent } from './page/pages-category/pages-category.component';
import { ProductCategoryRoutingModule } from './product-category.routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BannerCategoryComponent } from './components/banner-category/banner-category.component';
import { ListProductCategoryComponent } from './components/list-product-category/list-product-category.component';

@NgModule({
  declarations: [
    PagesCategoryComponent,
    BannerCategoryComponent,
    ListProductCategoryComponent,
  ],
  imports: [CommonModule, ProductCategoryRoutingModule, SharedModule],
  exports: [PagesCategoryComponent],
})
export class ProductCategoryModule {}
