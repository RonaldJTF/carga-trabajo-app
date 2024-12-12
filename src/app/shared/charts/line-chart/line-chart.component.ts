import {Component, ContentChild, Input, OnChanges, OnDestroy, TemplateRef} from '@angular/core';
import {Subscription} from "rxjs";
import {LayoutService} from "@services";

export class Dataset{
  label: string;
  values: string[];
  borderDash: number[];
}
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnChanges, OnDestroy {

  @Input() labels: string[];
  @Input() dataset: Dataset[];
  @Input() tension: number = 0;
  @Input() xAxisTitle: string;
  @Input() yAxisTitle: string;

  @ContentChild('headerTemplate', {static: true}) headerTemplate: TemplateRef<any>;

  COLORS: string[] = ['primary', 'cyan']
  chartData: any;
  chartOptions: any;

  subscription!: Subscription;
  documentStyle: any;

  constructor(private layoutService: LayoutService) {
    this.subscription = this.layoutService.configUpdate$.subscribe(() => {
      this.initCustomChart();

    });
  }

  ngOnChanges(): void {
    this.initCustomChart();
  }

  initCustomChart() {
    this.documentStyle = getComputedStyle(document.documentElement);
    const textColor = this.documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = this.documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = this.documentStyle.getPropertyValue('--surface-border');

    const totalDuration = 1000;
    const delayBetweenPoints = this.dataset?.length && this.dataset[0].values?.length   ?  totalDuration / this.dataset[0].values.length : 0;
    const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1]?.getProps(['y'], true).y;
    const animation = {
      x: {
        type: 'number',
        easing: 'linear',
        duration: delayBetweenPoints,
        from: NaN, // the point is initially skipped
        delay(ctx) {
          if (ctx.type !== 'data' || ctx.xStarted) {
            return 0;
          }
          ctx.xStarted = true;
          return ctx.index * delayBetweenPoints;
        }
      },
      y: {
        type: 'number',
        easing: 'linear',
        duration: delayBetweenPoints,
        from: previousY,
        delay(ctx) {
          if (ctx.type !== 'data' || ctx.yStarted) {
            return 0;
          }
          ctx.yStarted = true;
          return ctx.index * delayBetweenPoints;
        }
      }
    };

    this.chartData = {
      labels: this.labels,
      datasets: this.getDataset(),
    };

    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            fontColor: textColor,
          }
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
          title: {
            display: true,
            text: this.xAxisTitle,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
          title: {
            display: true,
            text: this.yAxisTitle,
          },
        },
      },
      animation,
    };
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private getDataset(){
    if (this.dataset){
      return this.dataset.map( (e, index) => {
        return  {
          backgroundColor: this.documentStyle.getPropertyValue(`--${this.COLORS[index]}-500`),
          borderColor: this.documentStyle.getPropertyValue(`--${this.COLORS[index]}-500`),
          data: e.values,
          tension: this.tension,
          label: e.label,
          borderWidth: 2,
          radius: e.values?.length > 12 ? 0 : 3,
          borderDash: e.borderDash,
        }
      })
    }
    return [];
  }

}
