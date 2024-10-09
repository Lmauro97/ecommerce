import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/shared/page/home/main-home/home.component';
import { PagesCheckoutComponent } from './pages/pages-checkout/pages-checkout.component';
import { ResultPayComponent } from './pages/result-pay/result-pay.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: '', // Agrega el segmento de ruta para el id
    component: PagesCheckoutComponent,
  },
  {
    path: 'payment',
    component: ResultPayComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckoutRoutingModule {}
