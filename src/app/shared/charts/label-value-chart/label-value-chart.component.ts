import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-label-value-chart',
  templateUrl: './label-value-chart.component.html',
  styleUrls: ['./label-value-chart.component.scss']
})
export class LabelValueChartComponent {
  @Input() label: string;
  @Input() value: number | string;
  @Input() colorName: string = "primary";
  @Input() iconClass: string;
}
