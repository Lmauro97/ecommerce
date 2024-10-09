import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPagesComponent } from './pages/admin-pages/admin-pages.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SidebarMenuComponent } from './components/sidebar-menu/sidebar-menu.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { PqrsListComponent } from './components/pqrs-list/pqrs-list.component';
import { NewOrdenComponent } from './components/new-orden/new-orden.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ModalInfoComponent } from './components/modal-info/modal-info.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GraphicPieComponent } from './components/dashboard/components/graphic-pie/graphic-pie.component';
import { GraphicBarComponent } from './components/dashboard/components/graphic-bar/graphic-bar.component';
import { GraphicLineComponent } from './components/dashboard/components/graphic-line/graphic-line.component';
import { TableDataComponent } from './components/dashboard/components/table-data/table-data.component';
@NgModule({
  declarations: [
    AdminPagesComponent,
    SidebarMenuComponent,
    DashboardComponent,
    OrderListComponent,
    UserListComponent,
    PqrsListComponent,
    NewOrdenComponent,
    ModalInfoComponent,
    GraphicPieComponent,
    GraphicBarComponent,
    GraphicLineComponent,
    TableDataComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
  ],
})
export class AdminModule {}
