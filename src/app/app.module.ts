import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptor } from './shared/interceptors/spinners-intersector';
import { LoaderService } from './shared/service/loader-service.service';
import { SpinnersComponent } from './shared/components/spinners/spinners.component';
import { CookieService } from 'ngx-cookie-service';
import { AddTokenInterceptor } from './shared/interceptors/add-token.interceptor';
import { AlertComponent } from './shared/components/alert/alert.component';

@NgModule({
  declarations: [AppComponent, SpinnersComponent, AlertComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [
    LoaderService,
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AddTokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
