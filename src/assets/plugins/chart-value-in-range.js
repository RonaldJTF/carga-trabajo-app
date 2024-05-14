import * as d3 from 'd3';
import * as crossfilter from 'crossfilter';
import * as dc from 'dc';

dc.constants.DEFAULT_DURATION = 1000;

export class ValueInRangeChart extends dc.ColorMixin(dc.BaseMixin) {
    constructor(parent, group) {
        super();
        this._lineTrackCssClass = "value-in-range";
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

        this.scaleName = "Tiempo en horas";

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
                d.y = (i) * (ha/data.length) + chart.itemStrokeWidth + chart.itemHeight + chart.fontSize;

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
        console.log(chart._g.selectAll("." + chart._lineTrackCssClass))
        chart._g.selectAll("." + chart._lineTrackCssClass)
            .data(chart.data())
            .join(
                enter => {
                    var g = enter.append("g")
                        .attr("class", d => `${chart._lineTrackCssClass} ${d.valueErrorClass ?? ''}`)
                        .on("click", function (e, d) {
                            //chart.onClick(d);
                        })
                        .style("cursor", "pointer");
                    
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

                    /**************MAXIMUM VALUE****************/
                    let maximumValue = g.append("g")
                        .attr('transform', d => {
                            var x = d.x_maxValue;
                            var y = d.y_maxValue;
                            d.x = x;
                            d.y = y;
                            return `translate(${x},${y})`;
                        });
                    maximumValue
                        .append("text")
                        .attr("transform", "translate(0, 10)")
                        .style("font-size", chart.fontSize)
                        .text(d => d.maxValue)
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "text-before-edge")
                    maximumValue
                        .append("text")
                        .attr("transform", `translate(0, ${chart.fontSize*1.75})`)
                        .attr("class", "value-label")
                        .style("font-size", chart.fontSize)
                        .text(d => d.maxValueLabel)
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "text-before-edge")
                    maximumValue
                        .append("polygon")
                        .attr("transform", "translate(0, 5)")
                        .attr("class", "middle-value-icon")
                        .attr("points", "0,-5 5, 5 -5, 5")
                        .attr('fill', "#ccc")    

                    /**************MINIMUM VALUE****************/
                    let minimumValue = g.append("g")
                        .attr('transform', d => {
                            var x = d.x_minValue;
                            var y = d.y_minValue;
                            d.x = x;
                            d.y = y;
                            return `translate(${x},${y})`;
                        });
                    minimumValue
                        .append("text")
                        .attr("transform", "translate(0, 10)")
                        .style("font-size", chart.fontSize)
                        .text(d => d.minValue)
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "text-before-edge")
                    minimumValue
                        .append("text")
                        .attr("transform", `translate(0, ${chart.fontSize*1.75})`)
                        .attr("class", "value-label")
                        .style("font-size", chart.fontSize)
                        .text(d => d.minValueLabel)
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "text-before-edge")
                    minimumValue
                        .append("polygon")
                        .attr("transform", "translate(0, 5)")
                        .attr("class", "middle-value-icon")
                        .attr("points", "0,-5 5, 5 -5, 5")
                        .attr('fill', "#ccc")

                    /**************MIDDLE VALUE****************/
                    //Value
                    let middleValue = g.append("g")
                        .attr("class", "middle-value")
                        .attr("x_lastMiddleValue", d => d.x_middleValue)
                        .attr('transform', d => {
                            var x = d.x_lastMiddleValue;
                            var y = d.y_middleValue;
                            d.x = x;
                            d.y = y;
                            return `translate(${x},${y})`;
                        });
                    middleValue
                        .append("text")
                        .attr("transform", `translate(0, ${-1.75*chart.fontSize})`)
                        .attr("class", "value-label")
                        .style("font-size", chart.fontSize)
                        .text(d => d.middleValueLabel)
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "text-after-edge")
                    middleValue
                        .append("text")
                        .attr("transform", "translate(0, -10)")
                        .style("font-size", chart.fontSize)
                        .text(d => d.middleValue)
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "text-after-edge")                    
                    //Line    
                    middleValue.append("line")
                        .attr("class", "middle-value-line")
                        .attr("y1", 0)
                        .attr("y2", chart.itemHeight)
                        .attr('stroke', "#aaa")
                        .attr('stroke-width', 5)
                    //Position icon
                    middleValue
                        .append("polygon")
                        .attr("transform", "translate(0, -5)")
                        .attr("class", "middle-value-icon")
                        .attr("points", "0,5 5, -5 -5, -5")
                        .attr('fill', "#ccc")
                    //Transition
                    middleValue.transition()
                        .duration(1000)
                        .delay( 100 )
                        .attr('transform', d => {
                            var x = d.x_middleValue;
                            var y = d.y_middleValue;
                            d.x = x;
                            d.y = y;
                            return `translate(${x},${y})`;
                        });
                    /*g.append("title")
                        .text(d => `${chart._keyAccessor(d)} : ${chart._valueAccessor(d)}`);*/
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

