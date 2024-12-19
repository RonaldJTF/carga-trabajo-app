import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
import {Subscription} from "rxjs";
import {LayoutService} from "@services";
import { ChartEvent } from 'chart.js/dist/core/core.plugins';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnChanges, OnDestroy {
  @Input() labels: string[];
  @Input() datasets: any[];
  @Input() title: string;
  @Input() subtitle: string;
  @Input() xAxisTitle: string;
  @Input() yAxisTitle: string;
  @Input() stacked: boolean = false;
  @Input() indexAxis: 'x' | 'y' = 'x'
  @Output() onClickOnBar: EventEmitter<{originalEvent: Event, datasetIndex: number, dataIndex: number}> = new EventEmitter<{originalEvent: Event, datasetIndex: number, dataIndex: number}>();
  @Output() onClickOnLegend: EventEmitter<{originalEvent: Event, datasetIndex: number, hidden: boolean}> = new EventEmitter<{originalEvent: Event, datasetIndex: number, hidden: boolean}>();

  barData: any;
  barOptions: any;

  subscription!: Subscription;

  constructor(private layoutService: LayoutService) {
    this.subscription = this.layoutService.configUpdate$.subscribe(() => {
      this.initChart();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initChart();
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const surfaceColor = documentStyle.getPropertyValue('--surface-500');
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.barData = {
      labels: this.labels,
      datasets: this.datasets
    };

    this.barOptions = {
      indexAxis: this.indexAxis,
      plugins: {
        legend: {
          labels: {
            fontColor: textColor,
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
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1,
      scales: {
        x: {
          stacked: this.stacked,
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            }
          },
          grid: {
            display: false,
            drawBorder: false,
          },
          title: {
            display: true,
            text: this.xAxisTitle
          },
        },
        y: {
          stacked: this.stacked,
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
            callback: function(value, index, ticks) {
              const label = this.getLabelForValue(value);
              const maxLength = 50; 
              return label.length > maxLength ? label.substring(0, maxLength) + '...' : label;
            },
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
          title: {
            display: true,
            text: this.yAxisTitle
          },
        },
      },
      onClick:(event, elements, chart) => this.handleClick(event, elements, chart),
    };
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  handleHover(evt: any, item: any, legend: any) {
    legend.chart.data.datasets.forEach((e, index) => {
      const color = e.backgroundColor;
      e.backgroundColor = index === item.datasetIndex || color.length === 9 ? color : color + '4D';
    });
    legend.chart.update();
  }

  handleLeave(evt: any, item: any, legend: any) {
    legend.chart.data.datasets.forEach((e, index) => {
      const color = e.backgroundColor;
      e.backgroundColor = color.length === 9 ? color.slice(0, -2) : color;
    });
    legend.chart.update();
  }

  handleClick(event: ChartEvent, elements: any[], chart: any): void {
    if (elements.length > 0) {
      const element = elements[0];
      const datasetIndex = element.datasetIndex;
      const dataIndex = element.index;
      this.onClickOnBar.emit({originalEvent: event.native, datasetIndex: datasetIndex, dataIndex: dataIndex});
    } 
  }

  handleClickOnLegend(event: ChartEvent, legendItem: any, legend: any){
    const chart = legend.chart;
    const datasetIndex = legendItem.datasetIndex;
    const meta = chart.getDatasetMeta(datasetIndex);
    meta.hidden = meta.hidden === null ? !chart.data.datasets[datasetIndex].hidden : null;
    chart.update();
    this.onClickOnLegend.emit({originalEvent: event.native, datasetIndex: datasetIndex, hidden: !legendItem.hidden});
  }
}
