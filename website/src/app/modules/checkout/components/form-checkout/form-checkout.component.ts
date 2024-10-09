import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckoutService } from '../../service/checkout.service';
import { Subscription, catchError, finalize, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-checkout',
  templateUrl: './form-checkout.component.html',
  styleUrls: ['./form-checkout.component.css'],
})
export class FormCheckoutComponent implements OnInit {
  formCheckout: FormGroup;
  listaProductos: any = [];
  mensajePagoContra: string = '';
  @ViewChild('btnPagar') btnPagar: ElementRef | undefined;
  typeIdentyti: any;
  listDepartament: any;
  listCity: any;
  filterCity: any;
  msmAlertas: string = '';
  addSuscribe: Subscription | undefined;
  totalEnvio: any = 0;
  alertProductoNoStock: string = '';
  btnPagar_status: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private checkoutService: CheckoutService,
    private router: Router
  ) {
    this.formCheckout = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      numDocumento: ['', Validators.required],
      TipDocumento: ['', Validators.required],
      departamento: ['', Validators.required],
      ciudad: ['', Validators.required],
      direccion: ['', Validators.required],
      refencia: '',
      mercadoPago: true,
      contraentrega: '',
    });

    //suscribe para obtener el total de envio
    this.addSuscribe = this.checkoutService
      .getnotifyTotalEnvio()
      .subscribe((resp: any) => {
        this.totalEnvio = resp;
        this.getListProductUser();
      });
  }

  ngOnInit(): void {
    this.checkoutService.updateCytiEnvio('');
    this.getTypeIdentity();
    this.getDepartament();
    this.getListCity();
    this.getListProductUser();
  }

  ngOnDestroy() {
    this.addSuscribe?.unsubscribe();
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
    this.formCheckout.get('ciudad')!.setValue('');

    const listCityOrigin = this.listCity; ///lista de ciudades original

    this.filterCity = listCityOrigin.filter((item: any) => {
      return item.id_department == idDepartamento;
    });
  }

  // **********selecciona la ciudad para calcular el precio de envio**********
  selectCyti() {
    const idCity = this.listCity.find(
      (item: any) => item.id == this.formCheckout.get('ciudad')!.value
    );
    this.checkoutService.updateCytiEnvio(idCity.name_city);
  }

  //lista de productos del usuario
  getListProductUser() {
    this.checkoutService
      .getListProductUser()
      .pipe(
        catchError((err) => {
          console.log(`${err}, Error al cargar los productos`, 'OK');
          return of(null);
        })
      )
      .subscribe((res) => {
        this.listaProductos = res;
        if (this.listaProductos.length == 0) {
          this.router.navigate(['/home']);
          this.alertProductoNoStock = 'No hay productos en el carrito';
        }

        for (let i = 0; i < this.listaProductos.length; i++) {
          if (this.listaProductos[i].stock < 1) {
            this.alertProductoNoStock =
              'No hay stock disponible para el producto: ' +
              this.listaProductos[i].product_name +
              ', por favor elimine el producto del carrito';
            break;
          } else {
            this.alertProductoNoStock = '';
          }
        }
      });
  }

  // ********** METODO DE PAGO **********
  metodoPago(value: string) {
    if (value === 'contraentrega') {
      this.formCheckout.get('mercadoPago')!.setValue(false);
      this.formCheckout.get('contraentrega')!.setValue(true);
    } else if (value === 'mercadoPago') {
      this.formCheckout.get('mercadoPago')!.setValue(true);
      this.formCheckout.get('contraentrega')!.setValue(false);
    }
  }

  // ********** envia datos de compra y pago **********
  pagar() {
    const city = this.formCheckout.value.ciudad || null;

    if (city != 1 && this.formCheckout.value.contraentrega === true) {
      this.msmAlertas =
        'El pago contra entrega solo esta disponible para Bogota, Funza y mosquera';
      this.formCheckout.get('mercadoPago')!.setValue(false);
      this.formCheckout.get('contraentrega')!.setValue(false);
      this.formCheckout.markAllAsTouched();
      setTimeout(() => {
        this.msmAlertas = '';
      }, 3000);

      return;
    }

    if (
      (this.formCheckout.get('mercadoPago')!.value === true &&
        this.formCheckout.get('contraentrega')!.value === true) ||
      ((this.formCheckout.get('mercadoPago')!.value === false ||
        this.formCheckout.get('mercadoPago')!.value === '') &&
        (this.formCheckout.get('contraentrega')!.value === false ||
          this.formCheckout.get('contraentrega')!.value === ''))
    ) {
      this.formCheckout.invalid;
      console.log('error');
      return;
    }
    if (this.formCheckout.invalid) {
      this.formCheckout.markAllAsTouched();
      return;
    }
    // *********metodo de pago*********
    const metodoPago = this.formCheckout.get('mercadoPago')!.value
      ? 'mercadoPago'
      : 'contraentrega';

    // *********Datos de facturacion del usuario*********
    const body = {
      datosFacturacion: {
        nombre: this.formCheckout.get('nombre')!.value,
        apellido: this.formCheckout.get('apellido')!.value,
        email: this.formCheckout.get('email')!.value,
        telefono: this.formCheckout.get('telefono')!.value,
        numDocumento: this.formCheckout.get('numDocumento')!.value,
        TipDocumento: this.formCheckout.get('TipDocumento')!.value,
        departamento: this.formCheckout.get('departamento')!.value,
        ciudad: this.formCheckout.get('ciudad')!.value,
        direccion: this.formCheckout.get('direccion')!.value,
        refencia: this.formCheckout.get('refencia')!.value,
        metodoPago: metodoPago,
        totalEnvio: this.totalEnvio,
      },
    };
    this.btnPagar_status = false;

    // *********envia los datos de facturacion*********
    this.checkoutService
      .sendPago(body)
      .pipe(
        catchError((err) => {
          console.log(err);
          return of(err);
        }),
        finalize(() => {
          this.btnPagar_status = true;
        })
      )
      .subscribe((res) => {
        if (res.url) {
          window.location.href = res.url;
          return;
        } else if (res == 'No hay productos en el carrito') {
          this.msmAlertas = res;
          setTimeout(() => {
            this.msmAlertas = '';
          }, 3000);
          return;
        } else if (res == 'No se puede comprar productos con cantidad 0') {
          this.msmAlertas = res;
          setTimeout(() => {
            this.msmAlertas = '';
          }, 3000);
        } else if (res.includes('Lamentamos informarle que el producto:')) {
          this.msmAlertas = res;
          setTimeout(() => {
            this.msmAlertas = '';
          }, 20000);
        } else {
          // *********desabilita el boton de pagar*********
          this.btnPagar?.nativeElement.setAttribute('disabled', 'true');
          this.btnPagar?.nativeElement.classList.add('disabled');

          this.mensajePagoContra = res.sms;

          // *********redirige a home*********
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 3000);
        }
      });
  }

  validateNumber(formControlName: string) {
    const value = this.formCheckout.get(formControlName)?.value;
    if (isNaN(value) || value < 1) {
      //marcvar como invalido
      this.formCheckout.get(formControlName)?.setErrors({ invalid: true });
      //marcar como tocado
      this.formCheckout.get(formControlName)?.markAsTouched();

      this.formCheckout.get(formControlName)?.setValue('');
    }
  }
}
