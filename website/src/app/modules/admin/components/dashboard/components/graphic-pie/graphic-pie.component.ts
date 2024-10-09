import { AfterViewInit, Component, Input } from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-graphic-pie',
  templateUrl: './graphic-pie.component.html',
  styleUrls: ['./graphic-pie.component.css'],
})
export class GraphicPieComponent implements AfterViewInit {
  @Input() dataValue: any = [];

  public pieChart: Chart | undefined;
  constructor() {}

  ngAfterViewInit(): void {
    if (this.dataValue.idchart) {
      this.pieChart = new Chart(this.dataValue.idchart, {
        type: this.dataValue.tipo as ChartType,
        data: this.dataValue.data,
        options: {
          plugins: {
            datalabels: {
              formatter: (value: any, context: any) => {
                const total = context.chart.data.datasets[0].data.reduce(
                  (acc: any, val: any) => acc + val,
                  0
                );
                const percentage = ((value / total) * 100).toFixed(1) + '%';
                return percentage;
              },
              color: '#fff',
              font: {
                weight: 'bold',
                size: 16,
              },
            },
            legend: {
              align: this.dataValue.alignItems, // Alinea los ítems
              labels: {
                color: '#fff', // Cambia el color de las etiquetas (labels)
                font: {
                  size: 14, // Cambia el tamaño de las etiquetas (labels)
                },
              },
            },
          },
        },
      });
    }
  }
}
