import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './main-home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { BannerHomeComponent } from '../../components/banner-home/banner-home.component';
import { SharedModule } from '../../shared.module';
import { AllProductModule } from 'src/app/modules/all-product/all-product.module';
import { PageOffersComponent } from './page-offers/page-offers.component';
import { OffersRoutingModule } from './offers-routing.module';

@NgModule({
  declarations: [HomeComponent, BannerHomeComponent, PageOffersComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    AllProductModule,
    OffersRoutingModule,
  ],
  exports: [HomeComponent],
})
export class HomeModule {}
