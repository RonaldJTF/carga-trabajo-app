import {Component, Input, OnChanges, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs";
import {LayoutService} from "../../../layout/service/app.layout.service";

@Component({
  selector: 'app-custom-chart',
  templateUrl: './custom-chart.component.html',
  styleUrls: ['./custom-chart.component.scss']
})
export class CustomChartComponent implements OnChanges, OnDestroy {

  @Input() labels: string[];
  @Input() data: string[];
  @Input() title: string;
  @Input() subtitle: string;
  @Input() iconClass: string;
  @Input() colorName: string = "primary";
  @Input() chartType: string = "bar";
  @Input() tension: number = 0;

  chartData: any;
  chartOptions: any;

  subscription!: Subscription;

  constructor(private layoutService: LayoutService) {
    this.subscription = this.layoutService.configUpdate$.subscribe(() => {
      this.initCustomChart();
    });
  }

  ngOnChanges(): void {
    this.initCustomChart();
  }

  initCustomChart() {

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.chartData = {
      labels: this.labels,
      datasets: [
        {
          backgroundColor: documentStyle.getPropertyValue('--primary-500'),
          borderColor: documentStyle.getPropertyValue('--primary-500'),
          data: this.data,
          tension: this.tension
        },
      ],
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
            display: true
          },
        },
      },
    };
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
