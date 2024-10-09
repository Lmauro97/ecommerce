import { Component } from '@angular/core';
import { PerfilUserServiceService } from '../../service/perfil-user-service.service';
import { purchaseUser } from '../../interface/interface-user_perfil';
@Component({
  selector: 'app-deliveries-user',
  templateUrl: './deliveries-user.component.html',
  styleUrls: ['./deliveries-user.component.css'],
})
export class DeliveriesUserComponent {
  public purchaseList: purchaseUser[] = [];

  constructor(private perfilUserServiceService: PerfilUserServiceService) {}

  ngOnInit(): void {
    // Suscribirse al Subject para recibir el listado de compras
    this.perfilUserServiceService.listPurchaseUser.subscribe((res) => {
      let data: any = res.filter(
        (element) => element.estado_entrega === 'Pedido entregado'
      );

      this.purchaseList = data;
    });
  }
}
