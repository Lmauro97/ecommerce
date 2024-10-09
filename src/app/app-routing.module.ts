import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: 'home',
    loadChildren: () =>
      import('src/app/shared/page/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'categoria/:id',
    loadChildren: () =>
      import('src/app/modules/product-category/product-category.module').then(
        (m) => m.ProductCategoryModule
      ),
  },
  {
    path: 'detalle/:id',
    loadChildren: () =>
      import('src/app/modules/detail/detail.module').then(
        (m) => m.DetailModule
      ),
  },
  {
    path: 'checkout',
    loadChildren: () =>
      import('src/app/modules/checkout/checkout.module').then(
        (m) => m.CheckoutModule
      ),
  },
  {
    path: 'cuenta-usuario',
    loadChildren: () =>
      import('src/app/modules/perfil-user/perfil-user.module').then(
        (m) => m.PerfilUserModule
      ),
  },
  {
    path: 'productos',
    loadChildren: () =>
      import('src/app/modules/add-product/add-product.module').then(
        (m) => m.AddProductModule
      ),
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./shared/page/pages-error/error.module').then(
        (m) => m.ErrorModule
      ),
  },
  {
    path: 'ofertas',
    loadChildren: () =>
      import('src/app/shared/page/home/offers-routing.module').then(
        (m) => m.OffersRoutingModule
      ),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('src/app/modules/admin/admin.module').then((m) => m.AdminModule),
  },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
