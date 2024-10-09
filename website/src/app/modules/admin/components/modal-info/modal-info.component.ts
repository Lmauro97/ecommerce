import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.css'],
})
export class ModalInfoComponent {
  @Input() data: any;
  @ViewChild('modalInfo') modalInfo: ElementRef | undefined;
  numberfactura: any;
  subscription: Subscription;

  constructor(private AdminService: AdminService) {
    this.subscription = this.AdminService.executeMethod.subscribe(
      (data: any) => {
        this.data = data;
        if (this.data) {
          this.modalInfo!.nativeElement.click();
          this.numberfactura = this.data.number_bill
            .toString()
            .padStart(10, '0');

          let list_productos = this.data.list_productos;
          list_productos = list_productos.replace(/\\/g, '');

          // Convertir la cadena JSON a un array
          const productsArray = JSON.parse(list_productos);
          let products = '';
          for (let i = 0; i < productsArray.length; i++) {
            if (i > 0) {
              products += ', ';
            }
            products += productsArray[i].nombre_producto;
          }
          this.data.products = products;
        }
      }
    );
  }
}
