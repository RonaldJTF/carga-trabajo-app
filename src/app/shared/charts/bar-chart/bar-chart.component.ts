import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnChanges {

  @Input() labels: string[];
  @Input() dataOne: number[];
  @Input() dataTwo: number[];
  @Input() title: string;
  @Input() iconClass: string;
  @Input() colorName: string = "primary";

  barData: any;
  barOptions: any;

  ngOnChanges(changes: SimpleChanges): void {
    this.initChart();
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.barData = {
      labels: this.labels,
      datasets: [
        {
          label: 'Total horas',
          backgroundColor: documentStyle.getPropertyValue('--primary-500'),
          borderColor: documentStyle.getPropertyValue('--primary-500'),
          data: this.dataOne,
        },
       /*{
          label: 'Personas Requeridas',
          backgroundColor: documentStyle.getPropertyValue('--primary-200'),
          borderColor: documentStyle.getPropertyValue('--primary-200'),
          data: this.dataTwo,
        },*/
      ],
    };

    this.barOptions = {
      plugins: {
        legend: {
          labels: {
            fontColor: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
          title: {
            display: true,
            text: 'Horas'
          },
        },
      },
    };
  }

}
