import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './components/navbar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { BestSellersComponent } from './components/best-sellers/best-sellers.component';
import { RouterModule } from '@angular/router';
import { FeaturedDescriptionComponent } from './components/featured-description/featured-description.component';
import { ModalCartComponent } from './components/shopping-cart/components/pages-cart/pages-cart.component';
import { FormatNumberPipe } from './pipes/formatin.pipe';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from '../auth/auth.module';
import { PqrsComponent } from './components/pqrs/pqrs.component';
import { PagesErrorComponent } from './page/pages-error/pages-error.component';
import { ModalPorqueComprarAquiComponent } from './components/modal-porque-comprar-aqui/modal-porque-comprar-aqui.component';
import { ModalTerminosCondicionesComponent } from './components/modal-terminos-condiciones/modal-terminos-condiciones.component';
import { RememberPasswordComponent } from './components/remember-password/remember-password.component';
@NgModule({
  declarations: [
    NavBarComponent,
    FooterComponent,
    BestSellersComponent,
    BestSellersComponent,
    FeaturedDescriptionComponent,
    ModalCartComponent,
    FormatNumberPipe,
    RegisterUserComponent,
    PqrsComponent,
    PagesErrorComponent,
    ModalPorqueComprarAquiComponent,
    ModalTerminosCondicionesComponent,
    RememberPasswordComponent,
  ],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, AuthModule],
  exports: [
    NavBarComponent,
    FooterComponent,
    BestSellersComponent,
    FeaturedDescriptionComponent,
    ModalCartComponent,
    FormatNumberPipe,
    RegisterUserComponent,
  ],
})
export class SharedModule {}
