import { Component, ElementRef, ViewChild } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { orderList } from '../../interface/admin-interface';
import { catchError } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
})
export class OrderListComponent {
  listOrders: orderList[] = [];
  listOrdersOrigin: orderList[] = [];
  @ViewChild('searchInput') searchInput: ElementRef | undefined;
  @ViewChild('searchDateInput') searchDateInput: ElementRef | undefined;

  grupPaginate: any = [];
  activeIndex = 0; // Índice de la página activa
  listStatusPayment: any = {
    approved: 'rgb(174 245 191 / 92%)',
    pending: 'rgb(252 253 154 / 92%)',
    refused: '#dc3545',
    contraentrega: 'rgb(142 220 235 / 92%)',
  };
  selectedOrder: any;

  listStatusDelivery: any = {
    'Procesando Compra': '#ffc107',
    'Compra aprobada': 'rgb(142 220 235 / 92%)',
    'En bodega del repartidor': 'rgb(142 220 235 / 92%)',
    'En camino al destino': 'rgb(142 220 235 / 92%)',
    'Pedido entregado': 'rgb(174 245 191 / 92%)',
    'Pedido Devuelto': 'rgb(252 253 154 / 92%)',
    'En proceso de validación': 'rgb(252 253 154 / 92%)',
    'Compra rechazada': '#dc3545',
  };

  constructor(
    private AdminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getListOrdes();
  }

  getListOrdes() {
    this.AdminService.getListOrdes()
      .pipe(
        catchError((error) => {
          return error;
        })
      )
      .subscribe((data) => {
        let paginate = 0;
        for (let i = 0; i < data.length; i++) {
          if (i % 9 === 0) {
            this.grupPaginate.push([]);
            paginate++;
          }
          this.grupPaginate[paginate - 1].push(data[i]);
        }
        this.listOrders = this.grupPaginate[0];
        this.listOrdersOrigin = data;
        const newOrders = data.filter(
          (order: any) =>
            order.delivery === 'En bodega del repartidor' ||
            order.delivery === 'En camino al destino' ||
            order.delivery === 'Procesando Compra' ||
            order.delivery === 'Compra aprobada' ||
            order.delivery === 'En proceso de validación' ||
            order.delivery === 'contraentrega'
        );
        this.AdminService.totalOrderNew.emit(newOrders.length);

        this.cdr.detectChanges(); // Forzar la detección de cambios
      });
  }

  searchOrder(value: any) {
    const normalizeString = (str: string) => {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
    };
    const normalizedValue = normalizeString(value);
    this.listOrders = this.listOrdersOrigin.filter((order: any) => {
      return Object.keys(order).some((key: any) => {
        const orderValue = order[key];
        if (orderValue !== null && orderValue !== undefined) {
          const normalizedOrderValue = normalizeString(orderValue.toString());
          return normalizedOrderValue.includes(normalizedValue);
        }
        return false;
      });
    });
  }

  clearSearch() {
    this.searchInput!.nativeElement.value = '';
    this.searchDateInput!.nativeElement.value = '';

    let paginate = 0;
    this.grupPaginate = [];
    for (let i = 0; i < this.listOrdersOrigin.length; i++) {
      if (i % 10 === 0) {
        this.grupPaginate.push([]);
        paginate++;
      }
      this.grupPaginate[paginate - 1].push(this.listOrdersOrigin[i]);
    }
    this.listOrders = [...this.grupPaginate[0]];
    this.cdr.detectChanges(); // Forzar la detección de cambios
  }
  searchDate(date: any) {
    console.log(date);
    console.log(this.listOrdersOrigin);
    this.listOrders = this.listOrdersOrigin.filter((order: any) => {
      return order.date_register.includes(date);
    });
  }
  paginate(index: any, paginate: any) {
    this.activeIndex = paginate;
    this.listOrders = index;
  }
  nextPaginator() {
    if (this.activeIndex < this.grupPaginate.length - 1) {
      this.activeIndex++;
      this.listOrders = this.grupPaginate[this.activeIndex];
    }
  }
  prevPaginator() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
      this.listOrders = this.grupPaginate[this.activeIndex];
    }
  }

  entregarOrder(orderId: any) {
    const body = {
      idOrden: orderId,
    };

    const userConfirmed = confirm('¿Está seguro de entregar la orden?');

    if (userConfirmed) {
      this.AdminService.entregarOrder(body)
        .pipe(
          catchError((error) => {
            console.log(error);
            return error;
          })
        )
        .subscribe((data) => {
          if (data === 'Orden Actualizada') {
            window.location.reload();
          }
        });
    }
  }

  // Método para abrir el modal vista detalle orden y pasar la data
  openModal(order: any) {
    this.selectedOrder = order;
    this.AdminService.executeMethod.emit(this.selectedOrder);
  }
  // Método para abrir el modal de editar orden
  openModalEdit(orden: any) {
    this.AdminService.executeMethodOpenEdit.emit(orden);
  }
}
