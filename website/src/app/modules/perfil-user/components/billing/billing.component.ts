import { Component } from '@angular/core';
import { listFactura } from 'src/app/modules/perfil-user/interface/interface-user_perfil';
import { PerfilUserServiceService } from '../../service/perfil-user-service.service';
import { catchError } from 'rxjs';
@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css'],
})
export class BillingComponent {
  listFactura: listFactura[] = [];

  constructor(private perfilUserServiceService: PerfilUserServiceService) {}

  ngOnInit(): void {
    // Suscribirse al Subject para recibir el listado de compras
    this.perfilUserServiceService
      .getListFacturasUser()
      .pipe(
        catchError((err) => {
          console.error('Error al traer las facturas');
          return err;
        })
      )
      .subscribe((res) => {
        this.listFactura = res;
        for (let i = 0; i < this.listFactura.length; i++) {
          //redondear numero de factura a 10 digitos
          this.listFactura[i].number_bill = this.listFactura[i].number_bill
            .toString()
            .padStart(10, '0');

          this.listFactura[i].estado_pago =
            this.listFactura[i].estado_pago === 'approved'
              ? 'Aprobado'
              : this.listFactura[i].estado_pago === 'pending'
              ? 'Pendiente'
              : 'Rechazado';

          this.listFactura[i].totalIva = this.listFactura[i].productos?.reduce(
            (acc, item) => acc + item.iva,
            0
          );
          this.listFactura[i].subtotal = this.listFactura[i].productos?.reduce(
            (acc, item) => acc + item.precio,
            0
          );

          this.listFactura[i].precios_total =
            this.listFactura[i].subtotal! + this.listFactura[i].totalIva!;
        }
      });
  }
}
