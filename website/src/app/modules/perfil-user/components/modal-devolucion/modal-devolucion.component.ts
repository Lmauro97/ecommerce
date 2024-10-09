import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal-devolucion',
  templateUrl: './modal-devolucion.component.html',
  styleUrls: ['./modal-devolucion.component.css'],
})
export class ModalDevolucionComponent {
  @Input() data: any;
  // constructor() {
  //   console.log(this.data);
  // }
}
