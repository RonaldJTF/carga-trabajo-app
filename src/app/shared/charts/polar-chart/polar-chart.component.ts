import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {a} from "@fullcalendar/core/internal-common";

@Component({
  selector: 'app-polar-chart',
  templateUrl: './polar-chart.component.html',
  styleUrls: ['./polar-chart.component.scss']
})
export class PolarChartComponent implements OnChanges {

  @Input() labels: string[];
  @Input() data: number[];
  @Input() title: string;
  @Input() subtitle: string;

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

  handleHover(evt, item, legend) {
    legend.chart.data.datasets[0].backgroundColor.forEach((color, index, colors) => {
      colors[index] = index === item.index || color.length === 9 ? color : color + '4D';
    });
    legend.chart.update();
  }

  handleLeave(evt, item, legend) {
    legend.chart.data.datasets[0].backgroundColor.forEach((color, index, colors) => {
      colors[index] = color.length === 9 ? color.slice(0, -2) : color;
    });
    legend.chart.update();
  }

}
