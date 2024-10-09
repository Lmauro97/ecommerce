import { Component, ElementRef, ViewChild } from '@angular/core';
import { AddProductService } from '../../services/add-product.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css'],
})
export class ListProductComponent {
  listProductos: any;
  msmAddProduct: string = '';
  idProducto: string = '';
  filterListProductos: any;
  @ViewChild('inputBuscar', { static: false }) inputBuscar!: ElementRef;

  constructor(private AddProductService: AddProductService) {
    this.getListAllProduct();
  }

  // ********lista de todos los productos********
  getListAllProduct() {
    this.AddProductService.getListAllProduct()
      .pipe(
        catchError((error) => {
          // Puedes manejar el error de acuerdo a tus necesidades, por ejemplo, mostrar un mensaje de error.
          console.log(`${error}, Error al cargar los productos`, 'OK');
          return of(null);
        })
      )

      .subscribe((res) => {
        this.listProductos = res;
        this.filterListProductos = res;

        for (let i = 0; i < this.listProductos.length; i++) {
          // Formatear el precio como moneda colombiana sin decimales si los centavos son cero
          const formattedPrice = this.listProductos[
            i
          ].promotion_price.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits:
              this.listProductos[i].promotion_price % 1 === 0 ? 0 : 2,
            maximumFractionDigits:
              this.listProductos[i].promotion_price % 1 === 0 ? 0 : 2,
          });

          this.listProductos[i].promotion_price = formattedPrice;
        }
      });
  }
  // *****buscador de productos por nombre**********
  BuscarProducto(event: any) {
    const searchText = event.target.value.toLowerCase();
    this.filterListProductos = this.listProductos.filter(
      (element: any) =>
        element.product_name &&
        this.normalizeText(element.product_name.toLowerCase()).includes(
          searchText
        )
    );
  }
  ////quita los acentos
  normalizeText(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  // ******limpia el campo**********
  limpiar() {
    if (this.inputBuscar) {
      this.inputBuscar.nativeElement.value = '';
      this.filterListProductos = this.listProductos;
    }
  }
}
