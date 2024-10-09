import { Component, ElementRef, ViewChild } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Subscription } from 'rxjs/internal/Subscription';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  @ViewChild('dataMesSelect') dataMesSelect: ElementRef | undefined;
  dataForTable: any = [
    {
      labels: [],
      data: [],
    },
  ];
  dataChartVisitantesWeb: any = {
    idchart: 'chartVisitantesWeb',
    tipo: 'pie',
    alignItems: 'center',
    data: {
      labels: ['Organico', 'Facebook', 'Instagram', 'Google', 'Otro'],
      datasets: [
        {
          label: 'Visitantes',
          data: [70, 250, 100, 50, 68],
          backgroundColor: [
            'rgba(127, 37, 251)',
            '#0866ff',
            'rgba(255, 30, 142, 0.767)',
            '#52be80',
            '	#00FFFF',
          ],
          borderColor: '(0, 0, 0, 0.1)',
          borderAlign: 'inner',
          borderWidth: 1,
          hoverBackgroundColor: '#f7f7f73d',
          hoverBorderColor: '#fff',
          hoverBorderWidth: 2,
          hoverOffset: 1,
        },
      ],
    },
  };

  dataChartBarTypeVisit: any = {
    idchart: 'dataChartBarTypeVisit',
    tipo: 'bar',
    percentage: false,
    data: {
      labels: ['Organico', 'Facebook', 'Instagram', 'Google', 'Otro'],
      indexAxis: 'y',
      datasets: [
        {
          axis: 'y',
          label: 'Tipos de visitantes',
          data: [65, 59, 100, 81, 56, 55, 40],
          fill: false,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
          ],
          borderAlign: 'inner',
          borderWidth: 1,
          hoverBackgroundColor: '#f7f7f73d',
          hoverBorderColor: '#fff',
          hoverBorderWidth: 2,
          hoverOffset: 1,
        },
      ],
    },
  };
  dataChartLineTypeVisit: any = {
    tipo: 'line',
    data: {
      labels: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ],
      datasets: [
        {
          label: 'Año Anterior',
          data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 156],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
        {
          label: 'Año Actual',
          data: [55, 45, 86, 57, 99, 35, 76, 30, 0, 0, 0, 0],
          fill: false,
          borderColor: 'rgb(75, 192, 250)',
          tension: 0.1,
        },
      ],
    },
  };
  dataPieTopProductos: any = {
    idchart: 'dataPieTopProductos',
    tipo: 'doughnut',
    alignItems: 'start',
    data: {
      labels: [
        'Audifonos bluetooth tm20',
        'Auriculares inalámbricos y80',
        'Camara deportiva full hd 1080',
        'Soporte esterilizador dispensador de crema dental',
        'bombillo led inteligente e27',
      ],
      datasets: [
        {
          label: 'Productos',
          data: [20, 15, 5, 35, 19],
          backgroundColor: [
            '#3E46A7',
            '#9868ED',
            '#6D68EF',
            '#146A76',
            '#7CA9D0',
          ],
          borderColor: '(0, 0, 0, 0.1)',
          borderAlign: 'center',
          borderWidth: 1,
          hoverBackgroundColor: '#f7f7f73d',
          hoverBorderColor: '#fff',
          hoverBorderWidth: 2,
          hoverOffset: 1,
        },
      ],
    },
  };

  dataChartBarUserRegister: any = {
    idchart: 'dataChartBarUserRegister',
    tipo: 'bar',
    percentage: true,
    data: {
      labels: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ],
      indexAxis: 'x',
      datasets: [
        {
          axis: 'x',
          label: 'Usuarios Registrados 2023',
          data: [65, 59, 100, 81, 56, 55, 40, 65, 59, 100, 81, 156],
          fill: false,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
          ],
          borderAlign: 'inner',
          borderWidth: 1,
          hoverBackgroundColor: '#f7f7f73d',
          hoverBorderColor: '#fff',
          hoverBorderWidth: 2,
          hoverOffset: 1,
        },
        {
          axis: 'x',
          label: 'Usuarios Registrados 2024',
          data: [45, 69, 170, 75, 21, 75, 40, 25, 0, 0, 0, 0],
          fill: false,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
          ],
          borderAlign: 'inner',
          borderWidth: 1,
          hoverBackgroundColor: '#f7f7f73d',
          hoverBorderColor: '#fff',
          hoverBorderWidth: 2,
          hoverOffset: 1,
        },
      ],
    },
  };
  dataChartBarComprasVentas: any = {
    idchart: 'dataChartBarComprasVentas',
    tipo: 'bar',
    percentage: true,
    alignItems: 'center',
    size: 10,
    data: {
      labels: ['Agosto'],
      indexAxis: 'x',
      datasets: [
        {
          axis: 'x',
          label: 'Ventas',
          data: [2000000],
          fill: false,
          backgroundColor: ['rgba(255, 99, 132, 0.2)'],
          borderColor: ['rgb(255, 99, 132)'],
          borderAlign: 'inner',
          borderWidth: 1,
          hoverBackgroundColor: '#f7f7f73d',
          hoverBorderColor: '#fff',
          hoverBorderWidth: 2,
          hoverOffset: 1,
        },
        {
          axis: 'x',
          label: 'Compras',
          data: [1800000],
          fill: false,
          backgroundColor: ['rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgb(54, 162, 235)'],
          borderAlign: 'inner',
          borderWidth: 1,
          hoverBackgroundColor: '#f7f7f73d',
          hoverBorderColor: '#fff',
          hoverBorderWidth: 2,
          hoverOffset: 1,
        },
        {
          axis: 'x',
          label: 'Gastos',
          data: [100000],
          fill: false,
          backgroundColor: ['rgba(75, 192, 192, 0.2)'],
          borderColor: ['rgba(75, 192, 192, 0.2)'],
          borderAlign: 'inner',
          borderWidth: 1,
          hoverBackgroundColor: '#f7f7f73d',
          hoverBorderColor: '#fff',
          hoverBorderWidth: 2,
          hoverOffset: 1,
        },
        {
          axis: 'x',
          label: 'Saldo en Caja',
          data: [3000000],
          fill: false,
          backgroundColor: ['rgba(255, 159, 64, 0.2)'],
          borderColor: ['rgb(255, 159, 64)'],
          borderAlign: 'inner',
          borderWidth: 1,
          hoverBackgroundColor: '#f7f7f73d',
          hoverBorderColor: '#fff',
          hoverBorderWidth: 2,
          hoverOffset: 1,
        },
      ],
    },
  };

  listMes = [
    { value: 'Enero' },
    { value: 'Febrero' },
    { value: 'Marzo' },
    { value: 'Abril' },
    { value: 'Mayo' },
    { value: 'Junio' },
    { value: 'Julio' },
    { value: 'Agosto' },
    { value: 'Septiembre' },
    { value: 'Octubre' },
    { value: 'Noviembre' },
    { value: 'Diciembre' },
  ];

  activateOption(event: any) {
    const ventas_btn = document.getElementById('ventas-btn');
    if (ventas_btn) {
      ventas_btn.classList.remove('active');
    }

    const element = document.getElementById(event.target.id);
    const quitar = document.getElementsByClassName('active');
    if (quitar.length > 0) {
      quitar[0].classList.remove('active');
    }

    if (element) {
      // adicionar la clase active
      element.classList.toggle('active');
    }
    this.dataForTable = [
      {
        labels: [],
        data: [],
      },
    ];
    const actions: any = {
      'ventas-btn': this.getDataVentas,
      'compras-btn': this.getDataCompras,
      'gastos-btn': this.getDataGastos,
    };

    const action = actions[event.target.id];
    if (action) {
      action.call(this);
    }
  }

  ngAfterViewInit() {
    const mesActualNumero = new Date().getMonth();
    const mesActual = this.listMes[mesActualNumero].value;
    this.dataMesSelect!.nativeElement.value = mesActual;
    const element = document.getElementById('ventas-btn');
    if (element) {
      // adicionar la clase active
      element.classList.toggle('active');
    }
  }

  changeDataMes() {
    const mes = this.dataMesSelect!.nativeElement.value;
    console.log(mes);
  }

  getDataVentas() {
    this.dataForTable = [
      {
        labels: [
          { value: 'Fecha' },
          { value: 'Detalle' },
          { value: 'Estado del pago' },
          { value: 'Estado de entrega' },
          { value: 'Novedad' },
        ],
        data: [
          {
            fecha: '2023-08-05',
            detalle: 'Audifonos bluetooth tm20',
            estadoPago: 'Pagado',
            estadoEntrega: 'Entregado',
            novedad: 'Ninguna',
          },
          {
            fecha: '2023-08-05',
            detalle: 'Auriculares inalámbricos y80',
            estadoPago: 'Pagado',
            estadoEntrega: 'Entregado',
            novedad: 'Ninguna',
          },
          {
            fecha: '2023-08-05',
            detalle: 'Camara deportiva full hd 1080',
            estadoPago: 'Pagado',
            estadoEntrega: 'Entregado',
            novedad: 'Ninguna',
          },
          {
            fecha: '2023-08-05',
            detalle: 'Soporte esterilizador dispensador de crema dental',
            estadoPago: 'Pagado',
            estadoEntrega: 'Entregado',
            novedad: 'Ninguna',
          },
          {
            fecha: '2023-08-05',
            detalle: 'bombillo led inteligente e27',
            estadoPago: 'Pagado',
            estadoEntrega: 'Entregado',
            novedad: 'Ninguna',
          },
        ],
      },
    ];
  }
  getDataCompras() {}
  getDataGastos() {}
}
