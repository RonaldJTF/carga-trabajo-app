import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-percent',
  templateUrl: './percent.component.html',
  styleUrls: ['./percent.component.scss']
})
export class PercentComponent {
  @ViewChild('svgContainer') svgContainer: ElementRef;

  @Input() labelPosition: 'left' | 'center' | 'right' = 'right';
  @Input() shape: 'linear' | 'circle' = 'circle';
  @Input() size: number = 30;
  @Input() value: number;
  @Input() fontSize: number = 10;
  @Input() styleClass: string = 'justify-content-center';

  private _initialized: boolean = false;
  private colorScale = d3.scaleLinear().domain([0,50,100]).range([d3.hsl("#EF4444CC"),d3.hsl("#FAC600CC"),d3.hsl("#22C55ECC")]).clamp(true)
  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(): void {
    this._initialized = true;
    this.generate();
  }

  ngOnInit(){}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      if (this._initialized){
        this.generate();
      }
    }
  }

  generate(){
    d3.select(this.svgContainer.nativeElement).select('svg').remove();
    if (this.shape == 'linear'){
      this.renderLinearChart();
    }else{
      this.renderCircleChart();
    }
  }

	renderCircleChart() {
    const width = this.size;
    const height = this.size;
    const rExternal = this.size/2;
    const rInternal = this.labelPosition == 'center' ? rExternal*.7 : rExternal*0.6;

    let labelXPosition = width/2;
    let labelYPosition = height/2;
    let arcXPosition = width/2;
    let arcYPosition = height/2;

    var svg = d3.select(this.svgContainer.nativeElement).append('svg')
        .attr('width', width)
        .attr('height', height);

    var g = svg.append("g")
      .attr("class", "percent")

    g.append("g")
      .append("path")
      .attr('class', 'circle-background')
      .attr("d", (d, i) => {
        var arc =  d3.arc().innerRadius(rInternal).outerRadius(rExternal).startAngle(0).endAngle(2 * Math.PI)
        return arc()
      })
      .attr("fill", "#ccc")
      .attr('transform', 'translate('+ arcXPosition +',' + arcYPosition +')')

    g.append("g")
      .append("path")
      .attr("class", 'arc')
      .attr("fill", this.colorScale(this.value))
      .attr('transform', 'translate('+ arcXPosition +',' + arcYPosition +')')
      .transition()
      .duration(1000)
      .delay( 100 )
      .attrTween('d', (d) => {
         let arc_ar = d3.arc().outerRadius(rExternal).innerRadius(rInternal);
         let start = {startAngle: 0, endAngle: 0};
         let interpolate = d3.interpolate(start, {startAngle: 0, endAngle: 2* ((this.value > 100 ? 100 : this.value) / 100) * Math.PI} );
        return function (t) {
          return arc_ar(interpolate(t));
        };
      })

    if (this.labelPosition == 'center'){
      g.append("text")
        .attr('class', 'label-circle')
        .attr('transform', 'translate('+ labelXPosition +',' + labelYPosition +')')
        .text(Math.round(this.value*10)/10 + "%")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", `${this.fontSize ?? '12'}pt`)
		}
  }

  renderLinearChart(){
    const fontHeight = this.fontSize*1.3;
    const width = this.size;
    const height = this.labelPosition == 'center' ? fontHeight + 5 : 8;

    let labelXPosition = width/2;
    let labelYPosition = height/2;

    var svg = d3.select(this.svgContainer.nativeElement).append('svg')
        .attr('width', width)
        .attr('height', height);

    var g = svg.append("g")
      .attr("class", "percent")

    g.append("rect")
      .attr('class', 'line-background')
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height)
      .attr("fill",  "#ccc")
      .attr("rx",  height/2)
      .attr('ry',  height/2)

    g.append("rect")
      .attr("x", 0)
      .attr("width", 0)
      .attr("height", height)
      .attr("fill", this.colorScale(this.value))
      .attr("rx",  height/2)
      .attr('ry',  height/2)
      .transition()
      .duration(1000)
      .delay( 100 )
      .attr("width",((this.value > 100 ? 100  : this.value) / 100) *width)
      .attrTween("height", () =>{
        return (t) => {
          var currentWidth = t * (this.value / 100) * width;
          if (currentWidth < height / 2) {
            return `${currentWidth * 2}`;
          } else {
            return `${height}`;
          }
        };
      })
      .attrTween("y", () => {
        return (t) => {
          var currentWidth = t * (this.value / 100) * width;
          if (currentWidth < height / 2) {
            return `${height / 2 - currentWidth}`;
          } else {
            return `0`;
          }
        };
      });

    if (this.labelPosition == 'center'){
      g.append("text")
        .attr('class', 'label-linear')
        .attr('transform', 'translate('+ labelXPosition +',' + labelYPosition +')')
        .text(this.value + "%")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", `${this.fontSize}pt`)
    }
  }

}
