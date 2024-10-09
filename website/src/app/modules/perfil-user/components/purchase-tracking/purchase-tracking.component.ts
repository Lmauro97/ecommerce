import { Component } from '@angular/core';
import { PerfilUserServiceService } from '../../service/perfil-user-service.service';
import { catchError, finalize, of } from 'rxjs';
import { purchaseUser } from '../../interface/interface-user_perfil';

@Component({
  selector: 'app-purchase-tracking',
  templateUrl: './purchase-tracking.component.html',
  styleUrls: ['./purchase-tracking.component.css'],
})
export class PurchaseTrackingComponent {
  listPurchaseTracking: purchaseUser[] = [];

  //estados de la compra
  status: any = {
    'Compra rechazada': 101,
    'Compra aprobada': 25,
    'En bodega del repartidor': 50,
    'En camino al destino': 75,
    'Pedido entregado': 100,
  };

  constructor(private PerfilUserServiceService: PerfilUserServiceService) {}

  ngOnInit(): void {
    this.getPurchaseTracking();
  }

  getPurchaseTracking() {
    this.PerfilUserServiceService.getPurchaseTrackingUser()
      .pipe(
        catchError((error) => {
          console.log(
            `${error}, Error al cargar el listado de compras del usuario `,
            'OK'
          );
          return of(null);
        })
      )
      .subscribe((res) => {
        for (let i = 0; i < res.length; i++) {
          if (res[i].estado_entrega === 'Pedido Devuelto') {
            res[i].porcentProccese = 0;
          } else {
            res[i].porcentProccese = this.status[res[i].estado_entrega];
          }

          if (res[i].estado_pago === 'approved') {
            res[i].estado_pago = 'APROBADO';
          } else if (res[i].estado_pago === 'pending') {
            res[i].estado_pago = 'PENDIENTE';
          } else if (res[i].estado_pago === 'refused') {
            res[i].estado_pago = 'RECHAZADO';
          }
        }

        let listAgrupada = res.reduce((acc: any, item: purchaseUser) => {
          const found = acc.find(
            (el: purchaseUser) => el.id_billing === item.id_billing
          );
          if (found) {
            found.fotos_producto.push(item.fotos_producto);
          } else {
            acc.push({
              ...item,
              fotos_producto: [item.fotos_producto],
            });
          }
          return acc;
        }, []);

        this.listPurchaseTracking = listAgrupada;
        this.PerfilUserServiceService.listPurchaseUser.next(res);
      });
  }
}
