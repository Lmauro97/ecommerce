import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesPerfilUserComponent } from './pages/pages-perfil-user/pages-perfil-user.component';
import { PerfilUserRoutingModule } from './perfil-user-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PerfilComponent } from './components/perfil/perfil.component';
import { FormEditPerfilComponent } from './components/form-edit-perfil/form-edit-perfil.component';
import { PurchaseTrackingComponent } from './components/purchase-tracking/purchase-tracking.component';
import { BillingComponent } from './components/billing/billing.component';
import { PqrsUserComponent } from './components/pqrs-user/pqrs-user.component';
import { DeliveriesUserComponent } from './components/deliveries-user/deliveries-user.component';
import { ReturnsUserComponent } from './components/returns-user/returns-user.component';
import { ModalDevolucionComponent } from './components/modal-devolucion/modal-devolucion.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PagesPerfilUserComponent,
    PerfilComponent,
    FormEditPerfilComponent,
    PurchaseTrackingComponent,
    BillingComponent,
    PqrsUserComponent,
    DeliveriesUserComponent,
    ReturnsUserComponent,
    ModalDevolucionComponent,
  ],
  imports: [CommonModule, PerfilUserRoutingModule, SharedModule, ReactiveFormsModule],
})
export class PerfilUserModule {}
