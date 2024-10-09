import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { catchError, of } from 'rxjs';
@Component({
  selector: 'app-best-sellers',
  templateUrl: './best-sellers.component.html',
  styleUrls: ['./best-sellers.component.css'],
})
export class BestSellersComponent implements OnInit {
  productTop: any = [];
  productTop3: any = [];
  productTop2: any = [];

  constructor(private SharedService: SharedService) {}

  ngOnInit(): void {
    this.getTopProduct();
  }

  // ********lista los productos mas vendidos********
  getTopProduct() {
    this.SharedService.getListTopProduct()
      .pipe(
        catchError((error) => {
          // Puedes manejar el error de acuerdo a tus necesidades, por ejemplo, mostrar un mensaje de error.
          console.log(`${error}, Error al cargar los registros`, 'OK');
          return of(null);
        })
      )
      .subscribe((resp) => {
        if (window.innerWidth <= 600) {
          // ***********carrusel para movil***********
          this.productTop = resp;
        } else {
          // ***********carrusel para desktop***********
          this.productTop = resp.slice(0, 4);
          this.productTop2 = resp.slice(4, 8);
          this.productTop3 = resp.slice(8, 13);
        }
      });
  }
}
