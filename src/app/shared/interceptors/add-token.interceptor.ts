import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { SharedService } from '../service/shared.service';
import { LoginService } from 'src/app/auth/services/login.service';
import { LoaderService } from '../service/loader-service.service';

@Injectable()
export class AddTokenInterceptor implements HttpInterceptor {
  private cookieService = inject(CookieService);
  private sharedService = inject(SharedService);
  private loginService = inject(LoginService);
  private readonly loaderService = inject(LoaderService);

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let cloneRequest = request;
    const token = this.cookieService.get('cookieT_258791**');
    if (token) {
      cloneRequest = request.clone({
        setHeaders: {
          authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(cloneRequest).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          if (
            event.body &&
            event.body ===
              'Token modificado o vencido, debes iniciar sesión nuevamente'
          ) {
            const alert = {
              tipo: 'Error',
              message: event.body,
            };
            this.sharedService.executeMethod.emit(alert);
            this.cookieService.delete('cookieT_258791**');

            setTimeout(() => {
              this.loginService.modalEmiter.emit(true);
            }, 2000);
            this.loaderService.hideLoader(); // desactiva el spinner
          }
        }
      }),
      catchError((error) => {
        // Manejo de errores si es necesario
        return throwError(error);
      })
    );
  }
}
