import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../service/loader-service.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private readonly loaderService: LoaderService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loaderService.showLoader(); //activa el spinner

    return next.handle(req).pipe(
      finalize(() => {
        setTimeout(() => {
          this.loaderService.hideLoader(); //desactiva el spinner
        }, 1000);
      })
    );
  }
}
