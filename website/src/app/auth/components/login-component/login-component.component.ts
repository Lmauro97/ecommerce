import { Component, ElementRef, ViewChild } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Subscription, catchError, finalize, of } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/service/shared.service';
@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css'],
})
export class LoginComponentComponent {
  formLogin: FormGroup;
  mensajeError: string = '';
  addSuscribe: Subscription | undefined;

  @ViewChild('modalFormLogin') modalFormLogin: ElementRef | undefined;
  @ViewChild('modalLogin') modalLogin: ElementRef | undefined;

  constructor(
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private SharedService: SharedService,
    private cookieService: CookieService,

    private router: Router
  ) {
    this.formLogin = formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required]],
    });

    this.loginService.modalEmiter.subscribe((data: any) => {
      console.log('executeMethod');
      this.modalLogin!.nativeElement.click();
    });
    // Ejecuta el evento de clic en el botón del modal login
    this.addSuscribe = this.loginService.modalSubject.subscribe((show) => {
      if (show) {
        this.modalLogin!.nativeElement.click();
      }
    });
  }
  onDestroy() {
    this.addSuscribe?.unsubscribe();
  }
  /////mantiene el correo en minusculas
  correoMinusculas(value: any) {
    const text = value.target.value.toLowerCase();
    this.formLogin.get('correo')!.setValue(text);
    // Ahora el valor del campo 'correoUser' en el formulario se establece en minúsculas
  }

  // ***********login************
  sendDataLogin() {
    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      return;
    }
    const body = {
      correo: this.formLogin.value.correo,
      pass: this.formLogin.value.pass,
    };

    this.loginService
      .loginUser(body)
      .pipe(
        catchError((error) => {
          console.log(`${error}, Error en el servicio del login`, 'OK');
          return of(null);
        }),
        finalize(() => {})
      )
      .subscribe((resp) => {
        this.cookieService.deleteAll();

        if (resp.success && resp.success == 'Login Exitoso!') {
          this.mensajeError = resp.success;
          this.cookieService.set('cookieT_258791**', resp.token);
          setTimeout(() => {
            this.modalFormLogin!.nativeElement.click();
            // Recargar la página actual en lugar de navegar a '/home'
            window.location.reload();
          }, 1000);
        } else {
          this.mensajeError = resp;
          setTimeout(() => {
            this.mensajeError = '';
          }, 7000);
        }
      });
  }

  /////cierra el modal del ligin y abre el del registro
  openModalRegister() {
    this.modalFormLogin!.nativeElement.click();
    this.SharedService.openModalRegister();
  }

  openModalRemember() {
    this.modalFormLogin!.nativeElement.click();
    this.SharedService.openModalRemember();
  }
}
