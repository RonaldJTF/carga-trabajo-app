import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import { ChartEvent } from 'chart.js/dist/core/core.interaction';

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
  @Input() datasetLabel: string = 'Total';
  @Output() onClickOnLegend: EventEmitter<{originalEvent: Event, index: number, hidden: boolean}> = new EventEmitter<{originalEvent: Event, index: number, hidden: boolean}>();

  polarData: any;
  polarOptions: any;

  ngOnChanges(changes: SimpleChanges): void {
    this.initChart();
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const surfaceColor = documentStyle.getPropertyValue('--surface-500');
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
        label: this.datasetLabel
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
          onClick: (event, item, legend) => this.handleClickOnLegend(event, item, legend),
        },
        title: {
          display: this.title != null && this.title != undefined && this.title.trim(),
          text: this.title
        },
        subtitle: {
          display: this.subtitle != null && this.subtitle != undefined && this.subtitle.trim(),
          text: this.subtitle,
          color: surfaceColor,
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

  handleClickOnLegend(event: ChartEvent, legendItem: any, legend: any){
    const chart = legend.chart;
    const index = legendItem.index;
    chart.toggleDataVisibility(index);
    chart.update();
    this.onClickOnLegend.emit({originalEvent: event.native, index: index, hidden: !legendItem.hidden});
  }
}
