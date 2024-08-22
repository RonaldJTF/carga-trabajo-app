import * as d3 from 'd3';
import * as crossfilter from 'crossfilter';
import * as dc from 'dc';

dc.constants.DEFAULT_DURATION = 1000;

export class ValueInRangeChart extends dc.ColorMixin(dc.BaseMixin) {
    constructor(parent, group) {
        super();
        this._lineTrackCssClass = "percent";
        this._g = undefined;
        this.colorAccessor(d => this.keyAccessor(d));
        this.title(d => `${this.keyAccessor(d)} : ${this.valueAccessor(d)}`);
        this.anchor(parent, group);

        this.itemWidth;
        this.itemHeight = 25;
        this.itemStrokeWidth = 0;
        this.itemRadiusBorder = 5;
        this.fontSize = 12;
        this.labelWidth = 50;
        this.labelPosition = 'right';
    }

    _calculateChartParams (data){
        var chart = this
        var ha = chart._height;
        var wa = chart._width;
        this.itemWidth = wa  - chart.labelWidth;

        data.forEach(
            function (d,i){
                let dataset = chart._valueAccessor(d);
                d.x = chart.labelWidth/2;
                d.y = (i) * (ha/data.length) + chart.itemStrokeWidth;

                d.x_scaleName = wa / 2;
                d.y_scaleName = d.y + chart.itemHeight;

                d.maxValueLabel = dataset.maximumValueLabel;
                d.minValueLabel = dataset.minimumValueLabel;
                d.middleValueLabel = dataset.middleValueLabel;

                d.maxValue = dataset.maximumValue;
                d.minValue = dataset.minimumValue;
                d.middleValue = dataset.middleValue;
                d.x_lastMiddleValue = dataset.x_lastMiddleValue ?? d.x;

                d.x_minValue = d.x;
                d.y_minValue = d.y + chart.itemHeight;

                d.x_maxValue = d.x + chart.itemWidth;
                d.y_maxValue = d.y + chart.itemHeight;

                d.y_middleValue = d.y;

                if (d.maxValue <= d.minValue || d.middleValue>d.maxValue  || d.middleValue<d.minValue){
                    d.x_middleValue = d.x + (0.5) * (d.x_maxValue - d.x_minValue);
                }else{
                    d.x_middleValue = d.x + ((d.middleValue - d.minValue) / (d.maxValue - d.minValue)) * (d.x_maxValue - d.x_minValue);
                }

                if (d.maxValue < d.minValue || d.middleValue>d.maxValue  || d.middleValue<d.minValue ){
                    d.valueErrorClass = "value-in-range-error";
                }

            }
        );
        return data;
    }

    _drawChart() {
        var chart = this;
        let da = chart._calculateChartParams(chart.group().top(Infinity))
        chart._g.selectAll("." + chart._lineTrackCssClass)
            .data(chart.data())
            .join(
                enter => {
                    var g = enter.append("g")
                        .attr("class", d => `${chart._lineTrackCssClass} ${d.valueErrorClass ?? ''}`)
                        .on("click", function (e, d) {
                            //custom-chart.onClick(d);
                        })
                        //.style("cursor", "pointer");

                    g.append("rect")
                        .attr("x", d => d.x)
                        .attr("y", d => d.y)
                        .attr("width", chart.itemWidth)
                        .attr("height", chart.itemHeight)
                        .attr("stroke", "#ccc")
                        .attr('stroke-width', chart.itemStrokeWidth)
                        .attr("fill",  "#eee")
                        .attr("rx",  chart.itemRadiusBorder)
                        .attr('ry',  chart.itemRadiusBorder)

                    /***************SCALE NAME******************/
                    let scaleName = g.append("g")
                        .attr('transform', d => {
                            var x = d.x_scaleName;
                            var y = d.y_scaleName;
                            d.x = x;
                            d.y = y;
                            return `translate(${x},${y})`;
                        });
                    scaleName
                        .append("text")
                        .attr("class", "scale-name")
                        .style("font-size", chart.fontSize)
                        .text( chart.scaleName)
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "text-before-edge")


                },
                update => {},
                exit => {
                    exit.remove()
                }
            );
        this.selectAll("." + this._lineTrackCssClass)
            .classed("selected", d => this.hasFilter() ? this._isSelectedSlice(d) : false)
            .classed("deselected", d => this.hasFilter() ? !this._isSelectedSlice(d) : false);
    }

    _doRender() {
        this.resetSvg();
        this._g = this.svg().append("g");
        this._drawChart();
    }

    _doRedraw() {
        this._drawChart();
    }

    _isSelectedSlice(d) {
        return this.hasFilter(this._keyAccessor(d));
    }
};

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="1165e881-3605-5574-b671-85ec06a56303")}catch(e){}}();
//# debugId=1165e881-3605-5574-b671-85ec06a56303
