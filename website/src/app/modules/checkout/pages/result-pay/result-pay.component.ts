import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-result-pay',
  templateUrl: './result-pay.component.html',
  styleUrls: ['./result-pay.component.css'],
})
export class ResultPayComponent {
  paymentStatus: string = '';
  queryParams: any;
  mensaje: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.queryParams = params;
      //this.paymentStatus = 'approved'; //pago aprobado (verde)
      //this.paymentStatus = 'rejected'; //pago rechazado (rojo)
      //this.paymentStatus = 'in_process';//(violeta)
      //this.paymentStatus = 'pending'; //pago por efecty pendiente (amarillo)
      this.paymentStatus = this.queryParams.status;
      let estado = this.queryParams.status;

      const statusMap: any = {
        approved: 'aprobado',
        rejected: 'rechazado',
        in_process: 'en proceso',
        pending: 'pendiente',
      };

      estado = statusMap[this.paymentStatus] || estado;

      if (
        this.queryParams.status === 'null' ||
        this.queryParams.payment_id === 'null'
      ) {
        this.mensaje = `Estimado cliente,<br><br>Ha ocurrido un error al procesar su pago y no se ha confirmado, por favor intente nuevamente.<br><br>Estamos a su disposición para cualquier consulta o asistencia que pueda necesitar <a href="https://wa.link/b7ppfs">WhatsApp</a>.<br><br>¡Gracias por confiar en nosotros!`;
      } else {
        let mensajeAdicional = '';
        if (estado === 'aprobado') {
          mensajeAdicional =
            '<br><br> Su producto será entregado a la mayor brevedad posible.';
        }

        this.mensaje = `Estimado cliente,<br><br>Queremos informarle que el estado de su pago es <strong>${estado}</strong>, el cual fue registrado con el ID de operación: <strong>${this.queryParams.payment_id}</strong>.${mensajeAdicional}<br><br>Agradecemos por su compra, estamos a su disposición para cualquier consulta o asistencia que pueda necesitar <a target="_blank" href="https://wa.link/b7ppfs">WhatsApp</a>.<br><br>¡Gracias por confiar en nosotros!`;
      }
    });
  }
}
