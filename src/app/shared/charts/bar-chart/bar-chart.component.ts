import {Component, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {LayoutService} from "../../../layout/service/app.layout.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnChanges, OnDestroy {

  @Input() labels: string[];
  @Input() data: string[];
  @Input() title: string;
  @Input() subtitle: string;
  @Input() iconClass: string;
  @Input() colorName: string = "primary";

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
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.barData = {
      labels: this.labels,
      datasets: [
        {
          label: 'Total horas',
          backgroundColor: documentStyle.getPropertyValue('--primary-500'),
          borderColor: documentStyle.getPropertyValue('--primary-500'),
          data: this.data,
          tension: 0,
        },
      ],
    };

    this.barOptions = {
      plugins: {
        legend: {
          labels: {
            fontColor: textColor,
          }
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1,
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
          beginAtZero: true,
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

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
