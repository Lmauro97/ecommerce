import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesErrorComponent } from './pages-error.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '403', component: PagesErrorComponent },

      { path: '**', redirectTo: 'home' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorsRoutingModule {}
