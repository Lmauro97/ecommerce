import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/shared/page/home/main-home/home.component';
import { AdminPagesComponent } from './pages/admin-pages/admin-pages.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { PqrsListComponent } from './components/pqrs-list/pqrs-list.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPagesComponent,
  },
  {
    path: '',
    component: AdminPagesComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'order-list',
        component: OrderListComponent,
      },
      {
        path: 'user-list',
        component: UserListComponent,
      },
      {
        path: 'pqrs-list',
        component: PqrsListComponent,
      },
    ],
  },
  {
    path: '**',
    component: HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
