import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-polar-chart',
  templateUrl: './polar-chart.component.html',
  styleUrls: ['./polar-chart.component.scss']
})
export class PolarChartComponent implements OnChanges {

  @Input() labels: string[];
  @Input() data: number[];
  @Input() title: string;

  polarData: any;
  polarOptions: any;


  ngOnChanges(changes: SimpleChanges): void {
    this.initChart();
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.polarData = {
      datasets: [{
        data: this.data,
        backgroundColor: [
          documentStyle.getPropertyValue('--indigo-500'),
          documentStyle.getPropertyValue('--purple-500'),
          documentStyle.getPropertyValue('--teal-500'),
          documentStyle.getPropertyValue('--orange-500'),
          documentStyle.getPropertyValue('--pink-500'),
        ],
        label: 'Personas'
      }],
      labels: this.labels
    };

    this.polarOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        r: {
          grid: {
            color: surfaceBorder
          }
        }
      }
    };
  }
}
