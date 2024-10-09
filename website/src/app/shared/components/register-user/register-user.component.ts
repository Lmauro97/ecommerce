import { Component, ElementRef, ViewChild } from '@angular/core';
import { Subscription, catchError, of } from 'rxjs';
import { CheckoutService } from 'src/app/modules/checkout/service/checkout.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../service/shared.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css'],
})
export class RegisterUserComponent {
  @ViewChild('checkoutLink') checkoutLink: ElementRef | undefined;
  @ViewChild('modalRegistroUser') modalRegistroUser: ElementRef | undefined;

  typeIdentyti: any;
  listDepartament: any;
  filterCity: any;
  listCity: any;
  formRegistro: FormGroup;
  archivos: any = [];
  mensajeError: string = '';
  mensajeRegister: string = '';
  mensajeNoterminos: string = '';
  mensajeRegisterCorreo: string = '';
  addSuscribe: Subscription | undefined;
  foto: any = null;

  constructor(
    private checkoutService: CheckoutService,
    private formBuilder: FormBuilder,
    private SharedService: SharedService,
    private router: Router
  ) {
    this.formRegistro = this.formBuilder.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      numDocumento: ['', Validators.required],
      tipoDoc: ['', Validators.required],
      direccion: ['', Validators.required],
      departamento: ['', Validators.required],
      ciudad: ['', Validators.required],
      foto: '',
      terminos: false,
    });
    this.getTypeIdentity();
    this.getDepartament();
    this.getListCity();

    // Ejecuta el evento de clic en el botón del modal register
    this.addSuscribe = this.SharedService.modalRegisterSubject.subscribe(
      (show) => {
        console.log('show', show);
        if (show) {
          this.modalRegistroUser!.nativeElement.click();
        }
      }
    );
  }

  // ********lista de los tipos de identidad********
  getTypeIdentity() {
    this.checkoutService
      .getListTypeIdentity()
      .pipe(
        catchError((err) => {
          console.log(`${err}, Error al cargar los tipos de identidad`, 'OK');
          return of(null);
        })
      )
      .subscribe((res) => {
        this.typeIdentyti = res;
      });
  }
  // ********lista de los departamentos********
  getDepartament() {
    this.checkoutService
      .getListDepartament()
      .pipe(
        catchError((err) => {
          console.log(`${err}, Error al cargar los departamentos`, 'OK');
          return of(null);
        })
      )
      .subscribe((res) => {
        this.listDepartament = res;
      });
  }

  //********lista de ciudades********* */
  getListCity() {
    this.checkoutService
      .getListCity()
      .pipe(
        catchError((err) => {
          console.log(`${err}, Error al cargar las ciudades`, 'OK');
          return of(null);
        })
      )
      .subscribe((res) => {
        this.listCity = res;
      });
  }
  // **********filtrar ciudades por departamento**********
  filterCitys(idDepartamento: string) {
    // this.formCheckout.get('ciudad')!.setValue('');

    const listCityOrigin = this.listCity; ///lista de ciudades original

    this.filterCity = listCityOrigin.filter((item: any) => {
      return item.id_department == idDepartamento;
    });
  }
  // metodo para subir las imagenes
  onFileChange(event: any): void {
    // Obtiene la lista de archivos seleccionados
    const selectedFile = event.target.files[0];

    // Verifica si se seleccionó un archivo
    if (selectedFile) {
      // Verifica la extensión del archivo
      if (!selectedFile.name.toLowerCase().endsWith('.png')) {
        this.mensajeError = 'Solo se permiten archivos PNG';
        this.foto = null;
        setTimeout(() => {
          this.mensajeError = '';
        }, 3000);
        return;
      }
      // Lee el contenido del archivo como base64
      const reader = new FileReader();
      reader.onloadend = () => {
        // Crea un objeto de imagen con la URL de la imagen, el base64 y el nombre del archivo
        this.foto = URL.createObjectURL(selectedFile);
      };
      reader.readAsDataURL(selectedFile);
      // Si la validación de extensión es exitosa, agrega el archivo a la lista
      this.archivos.push(selectedFile);
    }
  }
  ////////envia el formulario de registro
  sendRegistro() {
    this.mensajeNoterminos = '';
    if (!this.formRegistro.value.terminos) {
      this.mensajeNoterminos =
        'Entiendo que aún no has aceptado los términos y condiciones. puedes registrarte en otra ocasión 😊.';
      console.log('ok');
      setTimeout(() => {
        this.mensajeNoterminos = '';
      }, 7000);
      return;
    }
    if (this.formRegistro.invalid) {
      this.mensajeError = 'Formulario No Valido';
      setTimeout(() => {
        this.mensajeError = '';
      }, 3000);
      return;
    }
    const bodyfordata = new FormData();

    if (this.archivos.length === 0) {
      const imgDafault = new File(
        [''],
        'web/site/src/assets/img/imgDefaulRegiter.png',
        { type: 'image/png' }
      );
      bodyfordata.append('listImg', imgDafault);
    } else {
      this.archivos.forEach((archivo: File) => {
        bodyfordata.append('listImg', archivo);
      });
    }
    bodyfordata.append('names', this.formRegistro.value.nombres);

    bodyfordata.append('last_name', this.formRegistro.value.apellidos),
      bodyfordata.append('mail', this.formRegistro.value.correo),
      bodyfordata.append('phone', this.formRegistro.value.telefono),
      bodyfordata.append(
        'identification_card',
        this.formRegistro.value.numDocumento
      ),
      bodyfordata.append('id_type_card', this.formRegistro.value.tipoDoc),
      bodyfordata.append('id_department', this.formRegistro.value.departamento),
      bodyfordata.append('address', this.formRegistro.value.direccion),
      bodyfordata.append('id_city', this.formRegistro.value.ciudad),
      bodyfordata.append(
        'terminos_condicion',
        this.formRegistro.value.terminos
      ),
      this.SharedService.registerUser(bodyfordata)
        .pipe(
          catchError((err) => {
            console.log(
              `${err}, Error en el servicio de registro de usuarios`,
              'OK'
            );
            return of(null);
          })
        )
        .subscribe((resp) => {
          this.mensajeRegister = resp;
          if (resp === 'Usuario Registrado') {
            this.mensajeRegisterCorreo = `Tu contraseña fue enviada al correo  ${this.formRegistro.value.correo}`;
            // Cierra el modal utilizando la referencia del botón
            setTimeout(() => {
              this.mensajeRegister = '';
              this.mensajeRegisterCorreo = '';
              this.formRegistro.reset();
              this.router.navigate(['/checkout']);
              this.checkoutLink!.nativeElement.click();
            }, 15000);
          }
          setTimeout(() => {
            this.mensajeRegister = '';
          }, 7000);
        });
  }

  onDestroy() {
    this.addSuscribe?.unsubscribe();
  }

  validateNumber(formControlName: string) {
    const value = this.formRegistro.get(formControlName)?.value;
    if (isNaN(value) || value < 1) {
      //marcvar como invalido
      this.formRegistro.get(formControlName)?.setErrors({ invalid: true });
      //marcar como tocado
      this.formRegistro.get(formControlName)?.markAsTouched();

      this.formRegistro.get(formControlName)?.setValue('');
    }
  }
}
