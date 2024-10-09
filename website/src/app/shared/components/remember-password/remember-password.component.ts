import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../service/shared.service';
import { Subscription, catchError, finalize } from 'rxjs';
@Component({
  selector: 'app-remember-password',
  templateUrl: './remember-password.component.html',
  styleUrls: ['./remember-password.component.css'],
})
export class RememberPasswordComponent {
  formSendData: FormGroup;
  addSuscribe: Subscription | undefined;
  @ViewChild('modalRememberPassword') modalRememberPassword:
    | ElementRef
    | undefined;
  mensaje: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private SharedService: SharedService
  ) {
    this.formSendData = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });

    // Ejecuta el evento de clic en el botón del modal register
    this.addSuscribe = this.SharedService.modalRememberSubject.subscribe(
      (show) => {
        if (show) {
          this.modalRememberPassword!.nativeElement.click();
        }
      }
    );
  }

  onDestroy() {
    this.addSuscribe?.unsubscribe();
  }

  onSubmit() {
    if (this.formSendData.invalid) {
      this.formSendData.markAllAsTouched();
      return;
    }
    const email = this.formSendData.value.email;
    const body = {
      email: email,
    };
    this.SharedService.rememberPassword(body)
      .pipe(
        catchError((err) => {
          return err;
        }),
        finalize(() => {
          this.formSendData.reset();
        })
      )
      .subscribe((res) => {
        this.mensaje = res;
      });
  }
}
