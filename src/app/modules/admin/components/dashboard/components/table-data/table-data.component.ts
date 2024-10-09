import { Component, Input } from '@angular/core';

interface DataValue {
  labels: any[];
  data: any[];
}

@Component({
  selector: 'app-table-data',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.css'],
})
export class TableDataComponent {
  objectKeys = Object.keys;

  @Input() dataValue: DataValue[] = [
    {
      labels: [],
      data: [],
    },
  ];

  ngAfterViewInit(): void {
    console.log(this.dataValue);
  }
}
