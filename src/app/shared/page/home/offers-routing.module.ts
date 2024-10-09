import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageOffersComponent } from './page-offers/page-offers.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: PageOffersComponent },

      { path: '**', redirectTo: 'home' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OffersRoutingModule {}
