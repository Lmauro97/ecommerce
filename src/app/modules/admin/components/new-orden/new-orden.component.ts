import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { catchError, finalize, of, Subscription } from 'rxjs';
import { listUsers } from '../../interface/admin-interface';
import { SharedService } from 'src/app/shared/service/shared.service';
@Component({
  selector: 'app-new-orden',
  templateUrl: './new-orden.component.html',
  styleUrls: ['./new-orden.component.css'],
})
export class NewOrdenComponent {
  @Input() dataEdit: any = false;
  @ViewChild('modalInfoEdit') modalInfoEdit: ElementRef | undefined;
  @ViewChild('productInput') productInput: ElementRef | undefined;
  @ViewChild('productQuantity') productQuantity: ElementRef | undefined;
  @ViewChild('stock') stock: ElementRef | undefined;
  @ViewChild('salePrice') salePrice: ElementRef | undefined;

  ifEdit: boolean = false;

  subscription: Subscription;

  formCheckout: FormGroup;
  typeIdentyti: any;
  listCity: any;
  listDepartament: any;
  filterCity: any;
  userList: listUsers[] = [];
  listProductos: any = [];
  @ViewChild('envio') envio: ElementRef | undefined;
  @ViewChild('selectUserValue') selectUserValue: ElementRef | undefined;

  @ViewChild('cancelBtn') cancelBtn: ElementRef | undefined;
  selectedProducts: any = [
    {
      product_id: '',
      product_name: '',
      quantity: 0,
      sale_price: '',
      stock: '',
    },
  ];
  total: any;
  constructor(
    private formBuilder: FormBuilder,
    private AdminService: AdminService,
    private SharedService: SharedService
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
      mercadoPago: '',
      contraentrega: true,
    });

    this.subscription = this.AdminService.executeMethodOpenEdit.subscribe(
      (data: any) => {
        if (data) {
          this.modalInfoEdit!.nativeElement.click();
          this.editOrder(data);
        }
      }
    );
  }

  ngOnInit(): void {
    this.getTypeIdentity();
    this.getDepartament();
    this.getListCity();
    this.getUser();
    this.getListAllProduct();
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
  // ********lista de los departamentos********
  getDepartament() {
    this.AdminService.getListDepartament()
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
    this.AdminService.getListCity()
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
  // ********lista de los tipos de identidad********
  getTypeIdentity() {
    this.AdminService.getListTypeIdentity()
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
    // this.AdminService.updateCytiEnvio(idCity.name_city);
  }

  getUser() {
    this.AdminService.getListUser()
      .pipe(
        catchError((err) => {
          console.log(`${err}, Error al cargar los usuarios`, 'OK');
          return of(null);
        })
      )
      .subscribe((res) => {
        this.userList = res;
      });
  }

  selectUser(id: any) {
    const user = this.userList.find((item) => item.id == id);
    if (user) {
      const idTypeIdentity = this.typeIdentyti.find(
        (item: any) => item.names_card == user.tipo_identificacion
      ).id;
      const idDepartament = this.listDepartament.find(
        (item: any) => item.names_department == user.names_department
      ).id;
      const idCity = this.listCity.find(
        (item: any) => item.name_city == user.name_city
      ).id;
      this.filterCitys(idDepartament);

      this.formCheckout.patchValue({
        nombre: user.names,
        apellido: user.last_name,
        email: user.mail,
        telefono: user.phone,
        numDocumento: user.identification_card,
        TipDocumento: idTypeIdentity,
        departamento: idDepartament,
        ciudad: idCity,
        direccion: user.address,
      });
    }
  }

  // ********lista de todos los productos********
  getListAllProduct() {
    this.AdminService.getListAllProduct()
      .pipe(
        catchError((error) => {
          console.log(
            `${error}, Error al cargar el listado de todos los productos`,
            'OK'
          );
          return of(null);
        })
      )
      .subscribe((res) => {
        this.listProductos = res.filter((producto: any) => producto.stock > 0);
        for (let i = 0; i < this.listProductos.length; i++) {
          if (this.listProductos[i].on_promocion == 1) {
            this.listProductos[i].sale_price =
              this.listProductos[i].promotion_price;
          }
        }
      });
  }

  addProduct() {
    this.selectedProducts.push({
      product_name: '',
      quantity: 1,
      sale_price: '',
    });
  }

  removeProduct(index: number) {
    this.selectedProducts.splice(index, 1);
  }

  selectProduct(event: any, index: number) {
    const product = this.listProductos.find(
      (p: any) => p.product_name === event.value
    );

    if (product) {
      this.selectedProducts[index].sale_price = product.sale_price;
      this.selectedProducts[index].product_id = product.id;
      this.selectedProducts[index].product_name = product.product_name;
      this.selectedProducts[index].quantity = parseInt(
        this.productQuantity!.nativeElement.value
      );
      this.selectedProducts[index].stock = product.stock;
    }
    this.total = this.selectedProducts.reduce(
      (acc: number, item: any) => acc + item.sale_price,
      0
    );
    this.total = this.total + parseInt(this.envio!.nativeElement.value);
  }

  updatePrice(productQuantity: any, index: number, product_name: any) {
    const product = this.listProductos.find(
      (p: any) => p.product_name === product_name
    );
    const newCantidad = parseInt(productQuantity.value);
    const precio = product.sale_price * newCantidad;

    // Actualiza el precio de venta del producto en la lista
    const productItem = this.selectedProducts[index];
    productItem.sale_price = precio;
    productItem.quantity = newCantidad;
    this.total = this.selectedProducts.reduce(
      (acc: number, item: any) => acc + item.sale_price,
      0
    );
    this.total = this.total + parseInt(this.envio!.nativeElement.value);
  }

  updateTotal() {
    this.total = this.selectedProducts.reduce(
      (acc: number, item: any) => acc + item.sale_price,
      0
    );
    this.total = this.total + parseInt(this.envio!.nativeElement.value);
  }

  createOrden() {
    if (this.total == 0 || this.total == undefined) {
      alert('No se ha seleccionado ningun producto');
      return;
    }

    if (
      this.selectUserValue!.nativeElement.value == '' ||
      this.selectUserValue!.nativeElement.value == undefined
    ) {
      alert('No se ha seleccionado ningun usuario');
      return;
    }
    if (this.formCheckout.invalid) {
      this.formCheckout.markAsTouched();
      return;
    }
    const body = {
      id_user: this.selectUserValue!.nativeElement.value,
      Nombres: this.formCheckout.get('nombre')!.value,
      Apellidos: this.formCheckout.get('apellido')!.value,
      Email: this.formCheckout.get('email')!.value,
      Telefono: this.formCheckout.get('telefono')!.value,
      TipDocumento: this.formCheckout.get('TipDocumento')!.value,
      NumDocumento: this.formCheckout.get('numDocumento')!.value,
      Departamento: this.formCheckout.get('departamento')!.value,
      Ciudad: this.formCheckout.get('ciudad')!.value,
      Direccion: this.formCheckout.get('direccion')!.value,
      Referencia: this.formCheckout.get('refencia')!.value,
      type_pay: 'contraentrega',
      valorEnvio: this.envio!.nativeElement.value,
      productos: this.selectedProducts,
    };

    this.AdminService.createOrder(body)

      .pipe(
        catchError((err) => {
          console.log(err);
          return of(err);
        })
      )

      .subscribe((res: any) => {
        if (res == 'Orden creada correctamente') {
          alert('Orden creada correctamente');
          this.formCheckout.reset();
          this.selectedProducts = [
            { product_id: '', product_name: '', quantity: 0, sale_price: '' },
          ];
          this.total = 0;
          this.selectUserValue!.nativeElement.value = '';
          // click al boton cancelar
          this.cancelBtn!.nativeElement.click();
          window.location.reload();
        }
      });
  }

  // abre modal de registro
  crearUser() {
    this.SharedService.openModalRegister();
  }

  async editOrder(dataEdit: any) {
    console.log(dataEdit);
    this.ifEdit = true;
    this.dataEdit = dataEdit;

    await this.filterCitys(this.dataEdit.id_depart);

    let list_productos = dataEdit.list_productos;
    list_productos = list_productos.replace(/\\/g, '');

    // Convertir la cadena JSON a un array
    const productsArray = JSON.parse(list_productos);

    this.formCheckout.patchValue({
      nombre: this.dataEdit.nombre,
      apellido: this.dataEdit.nombre,
      email: this.dataEdit.mail_buyer,
      telefono: this.dataEdit.phone_buyer,
      numDocumento: this.dataEdit.card_buyer,
      TipDocumento: this.dataEdit.type_identity,
      departamento: this.dataEdit.id_depart,
      ciudad: this.dataEdit.id_city,
      direccion: this.dataEdit.address_delivery,
      refencia: this.dataEdit.delivery_reference,
    });

    this.envio!.nativeElement.value = this.dataEdit.shipments;
    this.selectUserValue!.nativeElement.value = this.dataEdit.id_user;
    //validar cuando productos vienen en esta compra

    if (productsArray.length == 1) {
      const productInput = this.productInput!.nativeElement;
      this.productQuantity!.nativeElement.value = productsArray[0].cantidad;
      this.stock!.nativeElement.value = productsArray[0].stock;
      this.salePrice!.nativeElement.value = productsArray[0].precio;

      productInput.value = productsArray[0].nombre_producto.trim();
      this.selectProduct(productInput, 1);
    } else if (productsArray.length > 1) {
      this.selectedProducts = [];

      for (let i = 0; i < productsArray.length; i++) {
        this.selectedProducts.push({
          product_id: '',
          product_name: productsArray[i].nombre_producto,
          quantity: productsArray[i].cantidad,
          sale_price: productsArray[i].precio,
          stock: productsArray[i].stock,
        });
      }
    }
  }
}
