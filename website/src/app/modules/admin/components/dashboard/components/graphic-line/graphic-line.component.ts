import { Component, Input } from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(...registerables, ChartDataLabels);
@Component({
  selector: 'app-graphic-line',
  templateUrl: './graphic-line.component.html',
  styleUrls: ['./graphic-line.component.css'],
})
export class GraphicLineComponent {
  @Input() dataValue: any = {};
  public lineChart: Chart | undefined;

  constructor() {}
  ngOnInit(): void {
    this.lineChart = new Chart('chartLine', {
      type: this.dataValue.tipo as ChartType,
      data: this.dataValue.data,
      options: {
        plugins: {
          datalabels: {
            color: '#ff5733',
            align: 'end',
            anchor: 'end',
            offset: 10,
          },
          legend: {
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
