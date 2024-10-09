import { Component } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { ServiceAllProductService } from 'src/app/modules/all-product/services/service-all-product.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { LoginService } from 'src/app/auth/services/login.service';
import { Router } from '@angular/router';
import { addProductoCar } from 'src/app/modules/all-product/interfaces/interfaces-all-product';

@Component({
  selector: 'app-page-offers',
  templateUrl: './page-offers.component.html',
  styleUrls: ['./page-offers.component.css'],
})
export class PageOffersComponent {
  listProductos: any = [];
  msmAddProduct: string = '';
  idProducto: string = '';
  itemPaginador: any;
  listProductosorigen: any;
  pageActual: number = 1;
  constructor(
    private ServiceAllProductService: ServiceAllProductService,
    private sharedService: SharedService,
    private LoginService: LoginService,
    private router: Router
  ) {
    // *************Esta pendiente para generar el filtro por etiquetas********
    this.sharedService.getnotifyFilterLabel().subscribe((res: any) => {
      res === '' ? this.getListAllProduct() : this.getListAllProduct(res);
    });
  }
  ngOnInit(): void {
    this.getListAllProduct();
  }

  // ********lista de todos los productos********
  getListAllProduct(label?: string) {
    this.ServiceAllProductService.getListAllProduct()
      .pipe(
        catchError((error) => {
          console.log(
            `${error}, Error al cargar el listado de todos los productos`,
            'OK'
          );
          return of(null);
        }),
        finalize(() => {
          // Paginación de productos
          const totalProductos = this.listProductos.length;
          if (totalProductos > 12) {
            let totalPages = Math.ceil(totalProductos / 12);
            this.itemPaginador = Array.from(
              { length: totalPages },
              (_, i) => i + 1
            );
          }
        })
      )
      .subscribe((res) => {
        this.listProductos = res.filter(
          (producto: any) => producto.stock > 0 && producto.on_promocion === 1
        );

        if (label) {
          this.listProductos = this.listProductos.filter((producto: any) =>
            producto.label.toLowerCase().includes(label.toLowerCase())
          );
        }

        for (let i = 0; i < this.listProductos.length; i++) {
          // Formatear el precio como moneda colombiana sin decimales si los centavos son cero
          const formattedPrice = this.listProductos[
            i
          ].sale_price.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits:
              this.listProductos[i].sale_price % 1 === 0 ? 0 : 2,
            maximumFractionDigits:
              this.listProductos[i].sale_price % 1 === 0 ? 0 : 2,
          });

          this.listProductos[i].sale_price = formattedPrice;
          this.listProductosorigen = this.listProductos;
        }
      });
  }

  reloadProductList(page: any) {
    page = page < 1 ? 1 : page;
    page = page > this.itemPaginador.length ? this.itemPaginador.length : page;
    const pageIni = parseInt(page);
    localStorage.setItem('page', pageIni.toString());
    const pageFin = pageIni * 12;
    const page1 = localStorage.getItem('page');
    this.pageActual = parseInt(page1!);
    this.listProductos = this.listProductosorigen;
    if (pageIni === 1) {
      this.listProductos = this.listProductos.slice(0, pageFin);
    } else {
      this.listProductos = this.listProductos.slice(pageFin - 12, pageFin);
    }
  }
  // *************adiciona producto al carrito********
  addProductoCar(idProducto: string) {
    const body: addProductoCar = {
      id_product: idProducto,
      amount: 1,
    };

    this.ServiceAllProductService.addProductoCar(body)
      .pipe(
        catchError((error) => {
          // Puedes manejar el error de acuerdo a tus necesidades, por ejemplo, mostrar un mensaje de error.
          console.log(`${error}, Error al cargar los registros`, 'OK');
          return of(null);
        })
      )
      .subscribe((resp) => {
        //manejo de respuesta
        if (
          resp == 'Cantidad Actualizada' ||
          resp == 'Producto Agregado Con Exito'
        ) {
          this.ServiceAllProductService.notifyNewProduct(); //notifica al carrito (MODAL) que se agrego un producto
          this.sharedService.notifyNewNavb(); //notifica al componente navbar que se agrego un producto
          this.msmAddProduct = resp;
          this.idProducto = idProducto;
          setTimeout(() => {
            this.msmAddProduct = '';
            this.idProducto = '';
          }, 2500);
        } else if (
          resp == 'Debes iniciar sesión nuevamente' ||
          resp == 'Token modificado o vencido, debes iniciar sesión nuevamente'
        ) {
          this.LoginService.openModal();
          this.msmAddProduct = resp;
          this.idProducto = idProducto;
          setTimeout(() => {
            this.msmAddProduct = '';
            this.idProducto = '';
          }, 3500);
        } else {
          this.msmAddProduct = resp;
          this.idProducto = idProducto;
          setTimeout(() => {
            this.msmAddProduct = '';
            this.idProducto = '';
          }, 3500);
        }
      });
  }
  ///*********verifica si hay productos en el carrito*********
  verifificarCar(id_producto: string) {
    const body = {
      id_product: id_producto,
      amount: 1,
    };

    this.ServiceAllProductService.verificarCar(body)
      .pipe(
        catchError((error) => {
          console.log(`${error}, Error al cargar los registros`, 'OK');
          return of(null);
        })
      )
      .subscribe((res) => {
        this.router.navigate(['/checkout']);
      });
  }
}
