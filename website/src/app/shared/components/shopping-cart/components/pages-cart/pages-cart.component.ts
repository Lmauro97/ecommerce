import { Component, ElementRef, ViewChild } from '@angular/core';
import { ModalService } from '../../service/modal.service';
import { Subscriber, Subscription, catchError, of } from 'rxjs';
import { ServiceAllProductService } from 'src/app/modules/all-product/services/service-all-product.service';
import { SharedService } from 'src/app/shared/service/shared.service';
@Component({
  selector: 'app-pages-cart',
  templateUrl: './pages-cart.component.html',
  styleUrls: ['./pages-cart.component.css'],
})
export class ModalCartComponent {
  @ViewChild('myModalButton') myModalButton!: ElementRef;
  @ViewChild('checkoutLink') checkoutLink!: ElementRef;
  @ViewChild('cant') cant!: ElementRef;

  listaProductos: any = [];
  msmAddProduct: string = '';

  addSuscribe: Subscription | undefined;
  constructor(
    private ModalService: ModalService,
    private serviceAllProductService: ServiceAllProductService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.ModalService.modalObservable.subscribe((show) => {
      // Ejecuta el evento de clic en el botón del modal
    });

    // *************Esta pendiente de nuevos productos en el carrito********
    this.addSuscribe = this.serviceAllProductService
      .getnotifyNewProduct()
      .subscribe(() => {
        console.log('Received message in component:');
        this.getlistaProductoUser();
      });

    this.getlistaProductoUser();
  }
  onDestroy() {
    this.addSuscribe?.unsubscribe();
  }
  closeAndNavigate() {
    // Cierra el modal
    this.checkoutLink.nativeElement.click();
  }
  // *********lista de prodcutos por usuario*********
  getlistaProductoUser() {
    this.ModalService.getListProductUser()
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
        for (let i = 0; i < this.listaProductos.length; i++) {
          if (
            this.listaProductos[i].on_promocion == 1 &&
            this.listaProductos[i].promotion_price > 0
          ) {
            this.listaProductos[i].precioTotal =
              this.listaProductos[i].promotion_price *
              this.listaProductos[i].amount;
          } else {
            this.listaProductos[i].precioTotal =
              this.listaProductos[i].sale_price * this.listaProductos[i].amount;
          }

          //si la cantidad es mayor al stock le pone el stock
          if (this.listaProductos[i].stock < this.listaProductos[i].amount) {
            this.listaProductos[i].amount = this.listaProductos[i].stock;
          }
        }
      });
  }
  // ******eliminar producto del carrito*********
  elininarProduct(productId: any) {
    const body = {
      idproduct: productId,
    };
    this.ModalService.deleteProduct(body)
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
        this.sharedService.notifyNewNavb(); //notifica al componente navbar que se agrego un producto

        console.log(res);
        this.msmAddProduct = res.message;
        setTimeout(() => {
          this.msmAddProduct = '';
        }, 2500);
      });
  }

  // ******actualizar cantidad del producto*********
  updateCantidadProduct(productId: any, cantidad: any) {
    if (cantidad == 0) {
      return;
    }
    const stock = this.listaProductos.find(
      (x: any) => x.id_product == productId
    ).stock;
    if (cantidad > stock) {
      this.msmAddProduct = 'No hay suficiente stock';
      // this.cant.nativeElement.value = stock;

      this.updateCantidadProduct(productId, stock);

      setTimeout(() => {
        this.msmAddProduct = '';
      }, 2500);
      return;
    }
    const body = {
      idproduct: productId,
      amount: cantidad,
    };
    this.ModalService.updateProduct(body)
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
        this.sharedService.notifyNewNavb(); //notifica al componente navbar que se agrego un producto

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
