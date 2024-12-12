import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-polar-chart',
  templateUrl: './polar-chart.component.html',
  styleUrls: ['./polar-chart.component.scss']
})
export class PolarChartComponent implements OnChanges {
  @Input() labels: string[];
  @Input() data: number[];

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
        backgroundColor:
          [
            documentStyle.getPropertyValue('--indigo-500'),
            documentStyle.getPropertyValue('--purple-500'),
            documentStyle.getPropertyValue('--teal-500'),
            documentStyle.getPropertyValue('--orange-500'),
            documentStyle.getPropertyValue('--pink-500'),
            documentStyle.getPropertyValue('--cyan-500'),
            documentStyle.getPropertyValue('--red-500'),
            documentStyle.getPropertyValue('--green-500'),
            documentStyle.getPropertyValue('--blue-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--gray-500'),
            documentStyle.getPropertyValue('--bluegray-500'),
          ]
        ,
        label: 'Personas'
      }],
      labels: this.labels
    };

    this.polarOptions = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1,
      plugins: {
        legend: {
          labels: {
            color: textColor
          },
          onHover: this.handleHover,
          onLeave: this.handleLeave,
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

  handleHover(evt: any, item: any, legend: any) {
    legend.chart.data.datasets[0].backgroundColor.forEach((color: any, index: any, colors: any) => {
      colors[index] = index === item.index || color.length === 9 ? color : color + '4D';
    });
    legend.chart.update();
  }

  handleLeave(evt: any, item: any, legend: any) {
    legend.chart.data.datasets[0].backgroundColor.forEach((color: any, index: any, colors: any) => {
      colors[index] = color.length === 9 ? color.slice(0, -2) : color;
    });
    legend.chart.update();
  }
}
