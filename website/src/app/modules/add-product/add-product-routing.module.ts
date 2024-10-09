import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/shared/page/home/main-home/home.component';
import { PageAddProductComponent } from './pages/page-add-product/page-add-product.component';
import { PagesListProductComponent } from './pages/pages-list-product/pages-list-product.component';
import { PageEditProductComponent } from './pages/page-edit-product/page-edit-product.component';
import { AddProductsGuard } from './guards/add-products.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: '',
    children: [
      {
        path: 'nuevo',
        component: PageAddProductComponent,
        canActivate: [AddProductsGuard],
        canMatch: [AddProductsGuard],
      },
      {
        path: 'lista',
        component: PagesListProductComponent,
        canActivate: [AddProductsGuard],
        canMatch: [AddProductsGuard],
      },
      {
        path: 'editar/:id',
        component: PageEditProductComponent,
        canActivate: [AddProductsGuard],
        canMatch: [AddProductsGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddProductRoutingModule {}
