import { Component } from '@angular/core';
import { Subscription, catchError, finalize, merge, of, tap } from 'rxjs';
import { CheckoutService } from '../../service/checkout.service';
import { ServiceAllProductService } from 'src/app/modules/all-product/services/service-all-product.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-product-cart',
  templateUrl: './list-product-cart.component.html',
  styleUrls: ['./list-product-cart.component.css'],
})
export class ListProductCartComponent {
  listaProductos: any;
  msmAddProduct: string = '';
  addSuscribe: Subscription | undefined;

  subTotal: number = 0;
  precioTotal: number = 0;
  idProducto: any;
  listTarifaEnvio: any;
  cytiEnvio: string = '';
  totalEnvio: any = 0;
  constructor(
    private CheckoutService: CheckoutService,
    private ServiceAllProductService: ServiceAllProductService,
    private sharedService: SharedService,
    private router: Router
  ) {
    // *************Esta pendiente de nuevos productos en el carrito********
    const newProduct$ = this.ServiceAllProductService.getnotifyNewProduct();
    const cytiEnvio$ = this.CheckoutService.getnotifycytiEnvio().pipe(
      tap((resp: any) => {
        this.cytiEnvio = resp;
      })
    );

    this.addSuscribe = merge(newProduct$, cytiEnvio$).subscribe(() => {
      this.getlistaProductoUser();
    });
  }

  ngOnInit() {
    // this.getlistaProductoUser();
    this.getTarifasEnvio();
  }

  // *********tarifa de envio********
  getTarifasEnvio() {
    this.CheckoutService.getListTarifaEnvio()
      .pipe(
        catchError((error) => {
          console.log(`${error}, Error al cargar las tarifas de envio`, 'OK');
          return of(null);
        }),
        finalize(() => {
          // console.log(this.listTarifaEnvio);
        })
      )
      .subscribe((res) => {
        this.listTarifaEnvio = res;
      });
  }

  // *********lista de prodcutos por usuario*********
  getlistaProductoUser() {
    this.CheckoutService.getListProductUser()
      .pipe(
        catchError((error) => {
          // Puedes manejar el error de acuerdo a tus necesidades, por ejemplo, mostrar un mensaje de error.
          console.log(
            `${error}, Error al cargar los productos del usuario`,
            'OK'
          );
          return of(null);
        })
      )
      .subscribe((res) => {
        this.listaProductos = res;
        if (this.listaProductos.length == 0) {
          this.subTotal = 0;
          this.precioTotal = 0;
          this.totalEnvio = 0;
          setInterval(() => {
            this.router.navigate(['/home']);
          }, 2000);
          return;
        }
        for (let i = 0; i < this.listaProductos.length; i++) {
          if (
            this.listaProductos[i].on_promocion == 1 &&
            this.listaProductos[i].promotion_price > 0
          ) {
            this.listaProductos[i].precioTotal =
              this.listaProductos[i].promotion_price *
              this.listaProductos[i].amount;
          } else if (this.listaProductos[i].stock < 1) {
            //si no hay stock le pone 0 al precio total
            this.listaProductos[i].precioTotal = 0;
          } else {
            this.listaProductos[i].precioTotal =
              this.listaProductos[i].sale_price * this.listaProductos[i].amount;
          }

          //si la cantidad es mayor al stock le pone el stock
          if (this.listaProductos[i].stock < this.listaProductos[i].amount) {
            this.listaProductos[i].amount = this.listaProductos[i].stock;
          }

          //si la ciudad es igual a bogota y el peso es menor a 3kg
          if (
            (this.cytiEnvio == 'Bogotá' || this.cytiEnvio == 'soacha') &&
            this.listaProductos[i].peso_total <= 3
          ) {
            this.listaProductos[i].tarifaEnvio = this.listTarifaEnvio[0].local;
          } else if (
            //envio bogota o soacha  si el peso es mayor a 3kg
            (this.cytiEnvio == 'Bogotá' || this.cytiEnvio == 'soacha') &&
            this.listaProductos[i].peso_total > 3
          ) {
            let kiloInicial = this.listTarifaEnvio[0].local;
            for (let j = 3; j < this.listaProductos[i].peso_total; j++) {
              kiloInicial = kiloInicial + this.listTarifaEnvio[0].kilo_adicinal;
            }
            this.listaProductos[i].tarifaEnvio = kiloInicial;
          } else if (
            //envio nacional si el peso es igual a 1kg
            this.cytiEnvio != 'Bogotá' &&
            this.cytiEnvio != 'soacha' &&
            this.listaProductos[i].peso_total == 1 &&
            this.cytiEnvio != ''
          ) {
            this.listaProductos[i].tarifaEnvio =
              this.listTarifaEnvio[0].nacional;
          } else if (
            //envio nacional si el peso es mayor a 1kg
            this.cytiEnvio != 'Bogotá' &&
            this.cytiEnvio != 'soacha' &&
            this.listaProductos[i].peso_total > 1 &&
            this.cytiEnvio != ''
          ) {
            let kiloInicial = this.listTarifaEnvio[0].nacional;
            for (let j = 1; j < this.listaProductos[i].peso_total; j++) {
              kiloInicial = kiloInicial + this.listTarifaEnvio[0].kilo_adicinal;
            }
            this.listaProductos[i].tarifaEnvio = kiloInicial;
          } else {
            this.listaProductos[i].tarifaEnvio = 'Selecciona una ciudad';
          }
        }

        ///*********suma de los precios de los productos*********
        this.subTotal = this.listaProductos.reduce(
          (a: any, b: any) => a + b.precioTotal,
          0
        );

        ///*********suma el precio total mas envio*********
        // Obtenemos el id_owner del primer producto
        let idOwner = this.listaProductos[0].id_owner;

        // Verificamos si todos los productos son del mismo propietario
        let mismoPropietario = this.listaProductos.every(
          (producto: any) => producto.id_owner === idOwner
        );
        // Si todos los productos son del mismo propietario, obtenemos el costo de envío más alto
        if (mismoPropietario && this.listaProductos.length < 3) {
          this.totalEnvio = Math.max(
            ...this.listaProductos.map((producto: any) => producto.tarifaEnvio)
          );
        } else if (mismoPropietario && this.listaProductos.length > 2) {
          // Si todos los productos son del mismo propietario y hay más de 3 productos,
          // se suma 1000 al costo de envío
          this.totalEnvio = Math.max(
            ...this.listaProductos.map((producto: any) => producto.tarifaEnvio)
          );
          this.totalEnvio = this.totalEnvio + 10000;
        } else {
          interface Product {
            id: number;
            id_product: number;
            id_user: number;
            amount: number;
            date_register: string;
            product_name: string;
            main_photo: string;
            sale_price: number;
            code: string;
            promotion_price: number;
            on_promocion: number;
            stock: number;
            peso_total: number;
            id_owner: number;
            precioTotal: number;
            tarifaEnvio: number;
          }
          let groupedProducts: { [key: number]: Product } = {};

          this.listaProductos.forEach((product: Product) => {
            if (
              !groupedProducts[product.id_owner] ||
              product.tarifaEnvio >
                groupedProducts[product.id_owner].tarifaEnvio
            ) {
              groupedProducts[product.id_owner] = product;
            }
          });

          let totalTarifaEnvio: number = 0;
          for (let product of Object.values(groupedProducts)) {
            totalTarifaEnvio += product.tarifaEnvio;
          }

          if (this.cytiEnvio != '') {
            this.totalEnvio = totalTarifaEnvio;
          }
        }

        // Sumamos los precios de los productos
        this.subTotal = this.listaProductos.reduce(
          (a: any, b: any) => a + b.precioTotal,
          0
        );

        // Sumamos el costo de envío al precio total
        this.precioTotal = this.subTotal + this.totalEnvio;
        if (this.cytiEnvio != '') {
          this.precioTotal = this.subTotal + this.totalEnvio;
        } else {
          this.precioTotal = this.subTotal;
        }
        this.CheckoutService.updateTotalEnvio(this.totalEnvio);
      });
  }

  // ******eliminar producto del carrito*********
  elininarProduct(productId: any) {
    const body = {
      // idUser: 1,
      idproduct: productId,
    };
    this.CheckoutService.deleteProduct(body)
      .pipe(
        catchError((error) => {
          // Puedes manejar el error de acuerdo a tus necesidades, por ejemplo, mostrar un mensaje de error.
          console.log(
            `${error}, Error al eliminar el producto del usuario`,
            'OK'
          );
          return of(null);
        })
      )
      .subscribe((res) => {
        this.getlistaProductoUser();
        this.ServiceAllProductService.notifyNewProduct(); //notifica al carrito (MODAL) que se agrego un producto
        this.sharedService.notifyNewNavb(); //notifica al componente navbar que se agrego un producto
        this.msmAddProduct = res.message;
        setTimeout(() => {
          this.msmAddProduct = '';
        }, 2500);
      });
  }

  // ******actualizar cantidad del producto*********
  updateCantidadProduct(
    productId: any,
    cantidad: any,
    doblepeticion?: boolean
  ) {
    const esDoblePeticion = doblepeticion;

    this.idProducto = productId;
    const stock = this.listaProductos.find(
      (x: any) => x.id_product == productId
    ).stock;

    if (cantidad > stock) {
      this.msmAddProduct =
        'No hay suficiente stock para la cantidad solicitada. solo puedes comprar ' +
        stock +
        ' unidades.';

      setTimeout(() => {
        this.msmAddProduct = '';
        this.updateCantidadProduct(productId, stock, true);
      }, 4500);

      return;
    }

    const body = {
      idproduct: productId,
      amount: cantidad,
    };
    this.CheckoutService.updateProduct(body)
      .pipe(
        catchError((error) => {
          // Puedes manejar el error de acuerdo a tus necesidades, por ejemplo, mostrar un mensaje de error.
          console.log(
            `${error}, Error al actualizar el producto del usuario`,
            'OK'
          );
          return of(null);
        })
      )
      .subscribe((res) => {
        this.getlistaProductoUser(); //actualiza la lista de productos

        this.ServiceAllProductService.notifyNewProduct(); //notifica al carrito (MODAL) que se agrego un producto
        this.sharedService.notifyNewNavb(); //notifica al componente navbar que se agrego un producto
        if (esDoblePeticion) {
          return;
        }
        this.msmAddProduct = res.message;
        setTimeout(() => {
          this.msmAddProduct = '';
        }, 2500);
      });
  }

  getStockArray(stock: number): number[] {
    return Array.from({ length: stock }, (_, i) => i + 1);
  }
}
