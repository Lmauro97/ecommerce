import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { catchError, finalize, of } from 'rxjs';
import { PerfilUserServiceService } from 'src/app/modules/perfil-user/service/perfil-user-service.service';

export const AddProductsGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cookieService = inject(CookieService);
  const perfilUserService = inject(PerfilUserServiceService);

  const token = cookieService.get('cookieT_258791**');
  let activateOptionAdmin = false;

  if (!token) {
    router.navigate(['error/403']);
    return false;
  }

  let role: any = [];

  perfilUserService
    .getDataUserPerfil()
    .pipe(
      catchError((error) => {
        console.log(
          `${error}, Error al cargar los datos del perfil del usuario`,
          'OK'
        );
        return of(null);
      }),
      finalize(() => {
        for (let i = 0; i < role.length; i++) {
          role[i] = role[i].trim();
          activateOptionAdmin =
            role[i] === 'Administrador de tienda' ||
            role[i] === 'Super Administrador'
              ? true
              : false;
        }
        if (token && activateOptionAdmin) {
          return true;
        } else {
          router.navigate(['error/403']);
          return false;
        }
      })
    )
    .subscribe((resp) => {
      role = resp[0].roles.split(',');
    });
  return true;
};
