import * as d3 from 'd3';
import * as crossfilter from 'crossfilter';
import * as dc from 'dc';

dc.constants.DEFAULT_DURATION = 1000;

export class BubbleChart extends dc.ColorMixin(dc.BaseMixin) {
    constructor(parent, group) {
        super();
        this._bubbleCssClass = "bubble-chart";
        this._g = undefined;
        this.colorAccessor(d => this.keyAccessor(d));
        this.title(d => `${this.keyAccessor(d)} : ${this.valueAccessor(d)}`);
        this.anchor(parent, group);
        this.translate = 0;
        this.customOrderFunction = undefined;
    }

    _calcBubble (data){
        var chart = this
        //var ha = chart._height;
        //var wa = chart._width
        var cumul = 0;
        var ocupedSpacing = 0;
        var externalRadius = 40;
        var internalRadius = 30;
        var ellipsisRadius = 3;
        var ellipsisSpacing;
        var ellipsisSpacingIncrement = 3 * ellipsisRadius;
        data.forEach(
            function (d,i){
                
                d.external_center_y = externalRadius + 5
                d.external_center_x = cumul + externalRadius;

                d.external_outerRadius = externalRadius;
                d.external_innerRadius = internalRadius - (externalRadius - internalRadius);

                d.index = i;

                if (i%2 == 0){
                    d.startAngle =  (1.5* Math.PI) 
                    d.endAngle =  (0.5* Math.PI) 
                    d.filter = {
                        dx: "1",
                        dy: "-1",
                        stdDeviation: "2"
                    }
                }else{
                    d.startAngle =  (1.5* Math.PI) 
                    d.endAngle =  (2.5* Math.PI) 
                    d.filter = {
                        dx: "1",
                        dy: "1",
                        stdDeviation: "2"
                    }
                }
                
                d.timeout = i*300
                cumul += 2*externalRadius

                d.internal_center_y = d.external_center_y
                d.internal_center_x = cumul - internalRadius;
                d.internal_radius = internalRadius;

                d.ellipsis = [];
                for (let i = 1; i <= 3; i++) {
                    ellipsisSpacing = i * ellipsisSpacingIncrement
                    d.ellipsis.push({
                        radius: ellipsisRadius,
                        center_x: d.internal_center_x,
                        center_y: d.internal_center_y + externalRadius + ellipsisSpacing
                    });
                }

                d.lastPointOfEllipsis = {
                    radius: ellipsisRadius,
                    center_x: d.internal_center_x,
                    center_y:  d.internal_center_y + externalRadius + (ellipsisSpacing + ellipsisSpacingIncrement)
                }

                d.x_label_value = d.internal_center_x
                d.y_label_value = d.internal_center_y

                d.x_label_key = d.internal_center_x
                d.y_label_key = d.internal_center_y + externalRadius + (ellipsisSpacing + ellipsisSpacingIncrement + ellipsisRadius)

                ocupedSpacing += 2 * externalRadius;
            }
        );
        this.svg().attr("width", ocupedSpacing + 20);
        this.translate = (this.svg().attr("width") - ocupedSpacing) / 2; 
    }

    _drawChart() {
        var chart = this;
        var data;
        if (this.customOrderFunction != undefined){
            data = chart.group().top(Infinity).sort(this.customOrderFunction)
        }else{
            data = chart.group().top(Infinity)
        }
        chart._calcBubble(data)
        d3.select(".group-bubble")
            .attr("transform", "translate(" + this.translate + ", 0)");

        chart._g.selectAll("." + chart._bubbleCssClass)
            .data(chart.data())
            .join(
                enter => {
                    var g = enter.append("g")
                        .attr("class", chart._bubbleCssClass)
                        .on("click", function (e, d) {
                            //chart.onClick(d);
                        })
                        .style("cursor", "pointer");

                    g.append("g")
                        .append("path")
                        .attr("class", 'arc-external')
                        .attr("d", (d, i) => {
                            var arc =  d3.arc().innerRadius(d.external_innerRadius).outerRadius(d.external_outerRadius).startAngle(0).endAngle(0)
                            return arc()
                        })
                        .attr("fill", (d,i) => chart.getColor(d,i))
                        .attr('transform', d => {
                            var x = d.external_center_x;
                            var y = d.external_center_y;
                            d.x = x;
                            d.y = y;
                            return `translate(${x},${y})`;
                        })
                        .transition()
                        .duration(dc.constants.DEFAULT_DURATION)
                        .delay( d => d.timeout )
                        .attrTween('d', function(d) {
                            var arc = d3.arc().outerRadius(d.external_outerRadius).innerRadius(d.external_innerRadius);
                            var start = {startAngle: d.startAngle, endAngle: d.startAngle};
                            var interpolate = d3.interpolate(start, {startAngle: d.startAngle, endAngle: d.endAngle} );
                            return function (t) {
                                return arc(interpolate(t));
                            };
                          }).attr("endAngle", d => d.endAngle)
                     
                    var filter = g.append("g")
                        .append("filter")
                        .attr("id", d => "sombra_" + d.index)
                        .append("feDropShadow")
                        .attr("dx", d => d.filter.dx)
                        .attr("dy",d => d.filter.dy)
                        .attr("stdDeviation", d => d.filter.stdDesviation)
                        .attr("flood-color", "#aaa5")

                    
                    var circle = g.append("circle")
						.style('fill', 'white')
                        .attr("filter",  d => "url(#sombra_" + d.index  + ")")
						.attr('r', d => d.internal_radius)
						.style('cursor', 'pointer')
                        .attr('transform', d => {
                            var x = d.internal_center_x;
                            var y = d.internal_center_y;
                            d.x = x;
                            d.y = y;
                            return `translate(${x},${y})`;
                        });

                    g.append("g")
                        .attr('class', 'label_value_bubble')
                        .attr('transform', d => {
                            var x = d.x_label_value;
                            var y = d.y_label_value;
                            d.x = x;
                            d.y = y;
                            return `translate(${x},${y})`;
                        }).append("text")
                            .text(d => chart._valueAccessor(d))
                            .attr("text-anchor", "middle")
                            .attr("dominant-baseline", "middle")
                            .attr("fill", "#aaa")
                            .style("font-size", "16pt")

                    var labelKey = g.append("g")
                        .attr('class', 'label_key_bubble')
                        .attr('transform', d => {
                            var x = d.x_label_key;
                            var y = d.y_label_key;
                            d.x = x;
                            d.y = y;
                            return `translate(${x},${y})`;
                        }).append("text")
                            .attr("text-anchor", "middle")
                            .attr("dominant-baseline", "text-before-edge")
                            .attr("fill", "#aaa")
                            .style("font-size", "10pt")    

                    labelKey.selectAll(".label_key_bubble")
                        .data(function(d) { 
                            const palabras = chart._keyAccessor(d).split(" ");
                            const lineas = [];
                            let lineaActual = "";

                            palabras.forEach(palabra => {
                                if (lineaActual.length + palabra.length <= 15) {
                                    lineaActual += (lineaActual.length > 0 ? " " : "") + palabra;
                                } else {
                                    lineas.push(lineaActual);
                                    lineaActual = palabra;
                                }
                            });

                            if (lineaActual.length > 0) {
                                lineas.push(lineaActual);
                            }

                            return lineas.map((linea, indice) => ({
                                text: linea,
                                dy: indice === 0 ? "0em" : "1em"
                              }));
                        }).enter()
                        .append("tspan")
                        .text( d => d.text)
                        .attr("x", 0)
                        .attr("dy", d => d.dy); 

                    var ellipsis = g.append("g")
                        .selectAll(".ellipsis_bubble")
                        .data(function(d) { return d.ellipsis;}).enter()
                        .append("circle")
                        .attr("cx", function(d) { return d.center_x; })
                        .attr("cy", function(d) { return d.center_y; })
                        .attr("r", function(d) { return d.radius; })
                        .attr("fill", function(d) { return "#ccc"; });

                    g.append("circle")
                    .attr("cx", function(d) { return d.lastPointOfEllipsis.center_x; })
                    .attr("cy", function(d) { return d.lastPointOfEllipsis.center_y; })
                    .attr("r", function(d) { return d.lastPointOfEllipsis.radius; })
                    .attr("fill", function(d) { return "#ccc"; })
                    .style('stroke-width', 2)
                    .style('stroke', (d, i) => chart.getColor(d, i));

                    g.append("title")
                        .text(d => `${chart._keyAccessor(d)} : ${chart._valueAccessor(d)}`);
                }
            );
        //this.selectAll("." + this._bubbleCssClass)
        //    .classed("selected", d => this.hasFilter() ? this._isSelectedSlice(d) : false)
        //    .classed("deselected", d => this.hasFilter() ? !this._isSelectedSlice(d) : false);
    }

    _doRender() {
        this.resetSvg();
        this._g = this.svg().append("g").attr("class", "group-bubble");
        this._drawChart();
    }

    _doRedraw() {
        this._drawChart();
    }

    _isSelectedSlice(d) {
        return this.hasFilter(this._keyAccessor(d));
    }

    order(customOrderFunction) {
        this.customOrderFunction = customOrderFunction;
        return this
    }
};

