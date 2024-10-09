import { Component } from '@angular/core';
import { PerfilUserServiceService } from '../../service/perfil-user-service.service';
import { purchaseUser } from '../../interface/interface-user_perfil';

@Component({
  selector: 'app-returns-user',
  templateUrl: './returns-user.component.html',
  styleUrls: ['./returns-user.component.css'],
})
export class ReturnsUserComponent {
  public purchaseList: purchaseUser[] = [];

  constructor(private perfilUserServiceService: PerfilUserServiceService) {}

  ngOnInit(): void {
    // Suscribirse al Subject para recibir el listado de compras
    this.perfilUserServiceService.listPurchaseUser.subscribe((res) => {
      // this.purchaseList = res.filter(
      //   (element) => element.estado_entrega === 'Pedido Devuelto'
      // );
      this.purchaseList = res;
    });
  }
}
