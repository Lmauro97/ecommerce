import { AfterViewInit, Component, Input } from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-graphic-bar',
  templateUrl: './graphic-bar.component.html',
  styleUrls: ['./graphic-bar.component.css'],
})
export class GraphicBarComponent implements AfterViewInit {
  @Input() dataValue: any = {};
  public barChart: Chart | undefined;

  constructor() {}

  ngAfterViewInit(): void {
    if (this.dataValue.idchart) {
      this.barChart = new Chart(this.dataValue.idchart, {
        type: this.dataValue.tipo as ChartType,
        data: this.dataValue.data,
        options: {
          indexAxis: this.dataValue.data.indexAxis,
          plugins: {
            datalabels: {
              formatter: (value: any, context: any) => {
                let percentage;
                if (!this.dataValue.percentage) {
                  const total = context.chart.data.datasets[0].data.reduce(
                    (acc: any, val: any) => acc + val,
                    0
                  );
                  percentage = ((value / total) * 100).toFixed(1) + '%';
                }
                return percentage;
              },
              color: '#fff',
              font: {
                weight: 'bold',
                size: this.dataValue.size || 16,
              },
            },
            legend: {
              align: this.dataValue.alignItems,
              labels: {
                color: '#fff', // Cambia el color de las etiquetas (labels)
                font: {
                  size: this.dataValue.size || 16, // Cambia el tamaño de las etiquetas (labels)
                },
              },
            },
          },
        },
      });
    }
  }
}
