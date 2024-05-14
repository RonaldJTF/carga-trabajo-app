import { AfterViewInit, Component, ElementRef, Input, OnInit, SimpleChanges } from '@angular/core';
import * as crossfilter from 'crossfilter';
import * as chartValueInRange from 'src/assets/plugins/chart-value-in-range.js'

@Component({
  selector: 'app-time-range',
  templateUrl: './time-range.component.html',
  styleUrls: ['./time-range.component.scss']
})
export class TimeRangeComponent implements OnInit, AfterViewInit {
  @Input() maxValue: number;
  @Input() minValue: number;
  @Input() usualValue: number;

  private x_lastMiddleValue;
  private _initialized: boolean = false;

  bubbleChart: any;

  constructor(private elementRef: ElementRef) { }
  
  ngAfterViewInit(): void {
    this._initialized = true;
    this.generate();
  }

  ngOnInit(){}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['maxValue'] || changes['minValue'] || changes['usualValue']) {
      const middleValueElement = this.elementRef.nativeElement.querySelector('g.middle-value');
      this.x_lastMiddleValue = middleValueElement?.getAttribute('x_lastMiddleValue');
      if (this._initialized){
        this.generate();
      }
    }
  }

  generate(){
      var dim ={};
			var grp = {};
			var data = [
        {
          label: "Tiempo 1", 
          time: {
            middleValue: this.usualValue ?? 0, 
            maximumValue: this.maxValue  ?? 0, 
            minimumValue: this.minValue  ?? 0, 
            middleValueLabel: "Tusual", 
            maximumValueLabel: "Tmáx", 
            minimumValueLabel: "Tmín",
            x_lastMiddleValue: this.x_lastMiddleValue }
        }
      ]
			var filter = crossfilter(data)
			dim['timeRange'] = filter.dimension(d => d.label);
			grp['timeRange'] = dim['timeRange'].group().reduce(reduceAdd, reduceRemove, reduceInitial);
	
			function reduceAdd(p, v) {
				p = v.time;
				return p;
			}
			function reduceRemove(p, v) {
				p = v.time;
				return p;
			}
			function reduceInitial() {
				return "";
			}

      this.bubbleChart = new chartValueInRange.ValueInRangeChart("#time-range-chart");
			this.bubbleChart
				.dimension(dim['timeRange'])
				.group(grp['timeRange'])
				.valueAccessor(function(d) {return d.value})
				.height(115)
        .useViewBoxResizing(true)
				.render()
    }
}
