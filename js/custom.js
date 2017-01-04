d3.queue()
    .defer(d3.csv,'data/processed/northern_hemisphere.csv')
    .defer(d3.csv,'data/processed/southern_hemisphere.csv')
  //  .defer(d3.csv,'data/processed/world.csv')
    .await(function(error, northern, southern, world) {
        var margins = {top: 25, right: 50, bottom: 50, left: 40},
            bar_width = 72,
            month_width = 280,
            height = 1000,
            parse_date = d3.timeParse("%m/%Y"),
            parse_month = d3.timeParse("%m"),
            num_format = d3.format(".2f");

        var month_names = ["January", "February", "March",
            "April", "May", "June",
            "July", "August", "September",
            "October", "November", "December"];

        var colors = ['#f7fbff','#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#08519c','#08306b'];

        northern.forEach(function(d) {
            d.string_month = d.month;
            d.date = parse_date(d.string_month + "/" + d.year);
            d.month = parse_month(d.month);
            d.anomaly = +d.anomaly;
        });

        southern.forEach(function(d) {
            d.string_month = d.month;
            d.date = parse_date(d.string_month + "/" + d.year);
            d.month = parse_month(d.month);
            d.anomaly = +d.anomaly;
        });

     /*   world.forEach(function(d) {
            d.string_month = d.month;
            d.month = parse_month(d.month);
            d.anomaly = +d.anomaly;
        }); */

        var northern_grouped_avg = groupedAvg('string_month', northern);
        var southern_grouped_avg = groupedAvg('string_month', southern);
     //   var world_grouped_avg = groupedAvg('string_month', world);

        var northernScale = scales(northern);
        var southernScale = scales(southern);
     //   var worldScale = scales(world);

        var northern_grouped = grouped('year', northern);
        var southern_grouped = grouped('year', southern);
    //    var world_grouped = grouped('year', world);

        drawLegend("#north-legend", northern);
        drawLegend("#south-legend", southern);
    //    drawLegend("#world-legend", world);

        draw(northern_grouped, "northern-ice", tipping(), northernScale);
        draw(southern_grouped, "southern-ice", tipping(), southernScale);
   //     draw(world_grouped, "world-ice", tipping(), worldScale);

        var  north_1979 =  [
            {
                "xVal": "03",
                "yVal": 0,
                "path": "M67,99L53,75",
                "text": "Greatest extent on record",
                "textOffset": [10, 108]
            }
        ];

        var  north_2012 =  [
            {
                "xVal": "09",
                "yVal": 0,
                "path": "M67,99L86,74",
                "text": "Lowest extent on record",
                "textOffset": [17, 108]
            }
        ];

        var  south_1997 =  [
            {
                "xVal": "02",
                "yVal": 0,
                "path": "M77,98L47,72",
                "text": "Lowest extent on record",
                "textOffset": [17, 108]
            }
        ];

        var  south_2014 =  [
            {
                "xVal": "09",
                "yVal": 0,
                "path": "M67,99L86,74",
                "text": "Greatest extent on record",
                "textOffset": [10, 108]
            }
        ];

        annotate("#northern-ice-graphed0", north_1979);
        annotate("#northern-ice-graphed33", north_2012);

        annotate("#southern-ice-graphed18", south_1997);
        annotate("#southern-ice-graphed35", south_2014);

        months("northern-month-ice", northern);
        months("southern-month-ice", southern);

        var annotations_north_jan = [
            {
                "xVal": "12",
                "yVal": 0,
                "path": "M208,97L271,75",
                "text": "Lowest January level on record",
                "textOffset": [133,113]
            }
        ];

        var annotations_north_mar = [
            {
                "xVal": "12",
                "yVal": 0,
                "path": "M208,97L263,76",
                "text": "Lowest March level on record",
                "textOffset": [133,113]
            }
        ];

        var annotations_north_may = [
            {
                "xVal": "12",
                "yVal": 0,
                "path": "M208,97L271,75",
                "text": "Lowest May level on record",
                "textOffset": [133,113]
            }
        ];

        var annotations_north_june = [
            {
                "xVal": "12",
                "yVal": 0,
                "path": "M208,97L271,75",
                "text": "Lowest June level on record",
                "textOffset": [133,113]
            }
        ];

        var annotations_north_oct = [
            {
                "xVal": "12",
                "yVal": 0,
                "path": "M208,97L271,75",
                "text": "Lowest October level on record",
                "textOffset": [133,113]
            }
        ];

        var annotations_north_nov = [
            {
                "xVal": "12",
                "yVal": 0,
                "path": "M208,97L271,75",
                "text": "Lowest November level on record",
                "textOffset": [133,113]
            }
        ];

        annotate("#northern-month-ice-graphed0", annotations_north_jan);
        annotate("#northern-month-ice-graphed2", annotations_north_mar);
        annotate("#northern-month-ice-graphed4", annotations_north_may);
        annotate("#northern-month-ice-graphed5", annotations_north_june);
        annotate("#northern-month-ice-graphed9", annotations_north_oct);
        annotate("#northern-month-ice-graphed10", annotations_north_nov);
        annotate("#southern-month-ice-graphed10", annotations_north_nov);

        function months(selector, datas) {
            month_names.forEach(function(e, i) {
                var month = i + 1;
                var month_num = (month < 10) ? '0' + month : month + '';

                var data = datas.filter(function(d) {
                    return d.string_month === month_num;
                });

                var monthScale = scales(data, true);
                d3.select("#" + selector).append("div")
                    .attr("class", "graph")
                    .attr("id", selector + "-graphed" + i);

                d3.select("#" + selector + "-graphed" + i)
                    .append("h4")
                    .attr("class", "text-center text-top")
                    .text(month_names[i]);

                drawLegend("#" + selector + "-graphed" + i, data);
                drawStrip("#" + selector + "-graphed" + i, tipping(), data, monthScale);
            });
        }

        function tipping() {
            return d3.tip().attr('class', 'd3-tip').html(function(d) {
                return '<h4 class="text-center">' + stringDate(d.string_month) + ' (' + d.year + ')</h4>' +
                    '<ul class="list-unstyled">' +
                    '<li class="text-center"><h4>Sea Ice Extent</h4></li>' +
                    '<li>Hist Avg: ' + num_format((d.value - d.anomaly)) + ' M square km</li>' +
                    '<li>Actual Avg: ' + num_format(d.value) + ' M square km</li>' +
                    '<li>Dept from Avg: ' + num_format(d.anomaly) + ' M square km</li>' +
                    '</ul>';
            });
        }

        function draw(data, selector, tip, scale) {
            data.forEach(function(d, i) {
                d3.select("#" + selector).append("div")
                    .attr("class", "graph")
                    .attr("id", selector + "-graphed" + i);

                d3.select("#" + selector + "-graphed" + i)
                    .append("h4")
                    .attr("class", "text-center text-top")
                    .text(d.key);

                drawStrip("#" + selector + "-graphed" + i, tip, d.values, scale);
            });
        }

        function scales(data, years) {
            var type, bars_width;
            if(years !== undefined) {
                type = 'date';
                bars_width = month_width;
            } else {
                type = 'month';
                bars_width = bar_width;
            }

            var scale = d3.scaleTime()
                .range([0, bars_width]);
            scale.domain(d3.extent(data, d3.f(type)));

            return scale;
        }

        function grouped(field, data) {
            return d3.nest()
                .key(function(d) { return d[field]; })
                .entries(data);
        }

        function groupedAvg(field, data) {
            return d3.nest()
                .key(function(d) { return d[field]; })
                .rollup(function(values) { return d3.mean(values, d3.f('value'))})
                .entries(data);
        }

        function annotate(selector, annotations) {
            var swoopy = d3.swoopyDrag()
                .x(function(d){ return d.xVal; })
                .y(function(d){ return d.yVal; })
                .draggable(0);

            swoopy.annotations(annotations);

            d3.select(selector + " .svg").append("g.annotations").call(swoopy);
        }

        /**
         * Draw strip chart
         * @param selector
         * @param tip
         * @param data
         * @returns {string|CanvasPixelArray|function({data: (String|Blob|ArrayBuffer)})|Object[]|string}
         */
        function drawStrip(selector, tip, data, scale) {
            var type, bars_width, graph_height, translation;
            if((/month/.test(selector))) {
                type = 'date';
                bars_width = month_width;
                graph_height = 170;
                translation = 0;
            } else {
                type = 'month';
                bars_width = bar_width;
                graph_height = 110;
                translation = margins.left;
            }
            var height = 80;
            var extended_height = 100;
            var base_height = graph_height;
            var strip_color = coloring(data);
            var field = 'anomaly';
            var strip = d3.select(selector).append("svg")
                .attr("width", bars_width + margins.left + margins.right)
                .attr("height", base_height)
                .attr("class", "svg")
                .call(tip);

            var add = strip.selectAll("bar")
                .data(data);

            add.enter()
                .append("rect")
                .merge(add)
                .attr("x", function(d) { return scale(d[type]); })
                .attr("width", _.floor((bars_width / data.length), 3))
                .attr("y", 0)
                .attr("height", height)
                .translate([translation, 0])
                .style("fill", function(d) { return strip_color(d[field]); })
                .on('mouseover touchstart', function(d) {
                    d3.select(this).attr("height", extended_height)
                        .style("fill", "lightgray");
                    tip.show.call(this, d);
                })
                .on('mouseout touchend', function(d) {
                    d3.select(this).attr("height", height)
                        .style("fill", function(d) { return strip_color(d[field]); });
                    tip.hide.call(this, d);
                });

            add.exit().remove();

            return add;
        }

        function coloring(data) {
            return d3.scaleQuantize()
                .domain(d3.extent(data, d3.f('anomaly')))
                .range(colors);
        }

        function drawLegend(selector, data) {
            var width = window.innerWidth;
            var strip_colors = coloring(data);
            var month_graph = /month/.test(selector);
            var size, orientation;

            if(width < 750 || month_graph) {
                size = 40;
                orientation = 'vertical';
            } else {
                size = 70;
                orientation = 'horizontal';
            }

            var legend_height = (orientation === 'vertical') ? 230 : 75;
            var legend_width = (width < 750 || month_graph) ? 130 : width - 10;
            var class_name = selector.substr(1);
            var svg = d3.select(selector).append("svg")
                .classed("legend", true)
                .attr("width", legend_width)
                .attr("height", legend_height);

            svg.append("g")
                .attr("class", "legend-" + class_name)
                .attr("width", legend_width)
                .translate([0, 20]);

            var legend = d3.legendColor()
                .shapeWidth(size)
                .orient(orientation)
                .labelFormat(d3.format(".02f"))
                .scale(strip_colors);

            svg.select(".legend-" + class_name)
                .call(legend);

            return svg;
        }

        /**
         * Get month as word
         * @param month
         * @returns {*}
         */
        function stringDate(month) {
            var month_num = parseInt(month, 10) - 1;

            return month_names[month_num];
        }

        var rows = d3.selectAll('.row');
        rows.classed('opaque', false);
        rows.classed('hide', false);
        d3.selectAll('#load').classed('hide', true);
});