import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { catchError, of, pipe } from 'rxjs';
import { ServiceAllProductService } from 'src/app/modules/all-product/services/service-all-product.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  listProductos: any;
  alertProductNotFound: string = '';
  activateOptionPqrs: boolean = false;

  constructor(
    private ServiceAllProductService: ServiceAllProductService,
    private router: Router,
    private cookieService: CookieService
  ) {
    /////si esta logeado activa la opcion "Tu Cuenta en el NAV"
    const token = this.cookieService.get('cookieT_258791**');
    this.activateOptionPqrs = token ? true : false;

    this.ServiceAllProductService.getListAllProduct()
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
        this.listProductos = res;
      });
  }
  // metodo para verificar si el producto existe
  verifyProduct(nameProduct: string) {
    const product = this.listProductos.find(
      (product: any) => product.product_name === nameProduct
    );

    if (!product) {
      this.alertProductNotFound = 'Producto no encontrado';
      setInterval(() => {
        this.alertProductNotFound = '';
      }, 3000);
      return;
    } else {
      this.alertProductNotFound = '';
    }
  }

  // metodo para buscar el producto
  searchProduct(nameProduct: string) {
    this.verifyProduct(nameProduct);

    const product = this.listProductos.find(
      (product: any) => product.product_name === nameProduct
    );
    console.log(product);

    if (product) {
      const params = `/detalle/${product.product_name.replaceAll(' ', '-')}-${
        product.id
      }`;

      console.log(params);
      this.router.navigate([params]);
    }
  }
}
