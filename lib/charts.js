// //////////////////////////////////////////////////////////////////////////
// d3 chart definitions for xovis
// //////////////////////////////////////////////////////////////////////////

// //////////////////////////////////////////////////////////////////////////
// create top menu
var draw_top_menu = function(data, element, link_url) {
    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = 780 - margin.left - margin.right;
    var height = 100 - margin.top - margin.bottom;
    var menu = d3.select(element[0]).append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    menu.append("text")
        .text('Projects:')
        .attr('class', 'projectmenulabel')
        .attr("transform", "translate(0, 7)");

    var menu_item_container = menu.append('g')
        .attr('class', 'projectmenu')
        .attr("transform", "translate(80,0)");

    var x = d3.scaleBand()
        .domain(data.values.map(function(d) {
            return d.key[0];
        }))
        .rangeRound([0, width])
        .paddingInner(0.1);

    var menu_items = menu_item_container.selectAll(".projectmenu")
        .data(data.values)
      .enter().append("g");

    menu_items.append("a")
        .attr('href', function(d) { return link_url + '?project=' + d.key[0]; })
        .append("text")
            .attr("x", function(d) { return x(d.key[0]) + 3; })
            .attr("dy", ".35em")
            .attr("class", "menuitem")
            .text(function(d) { return d.key[0] + ': ' + d.value; })
            .on('click', function(d) { window.location.assign(link_url + 
                '?project=' + d.key[0]); });
};

// //////////////////////////////////////////////////////////////////////////
// plotting functions
var draw_bar_chart = function(data, element, title) {

    var margin = {top: 20, right: 100, bottom: 120, left: 100},
        width = 780 - margin.left - margin.right;

    var height = 400 - margin.top - margin.bottom;

    var max_value = d3.max(data.values.map(function(d) {
            return +(d.value);
    }));

    var min_label_value = .1 * max_value;
    height = 25 * data.values.length + 100 - margin.top - margin.bottom;

    var show_top_axis = data.values.length > 10;

    var chart = d3.select(element[0]).append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var title_g = chart.append('g')
        .attr("transform", "translate(0, 20)");

    title_g.append('text')
        .text(title)
        .attr('class', 'charttitle');

    var plot = chart.append('g')
        .attr("transform", "translate(0,50)");


    var y = d3.scaleBand()
        .domain(data.values.map(function(d) {
            return d.key[1];
        }))
        .rangeRound([0, height])
        .paddingInner(0.1);

    var x = d3.scaleLinear()
        .domain([0, max_value])
        .rangeRound([0, width]);

    var xAxis = d3.axisBottom(x);

    var xAxisTop = null;
    if (show_top_axis) {
        xAxisTop = d3.axisTop(x);
    }

    var yAxis = d3.axisLeft(y);

    var bar = plot.selectAll("g")
        .data(data.values)
      .enter().append("g")
        .attr("transform", function(d) { 
            return "translate(0," + y(d.key[1]) + ")"; 
        });

    var ind_bar = bar.append("rect")
        .attr("width", function(d) { return x(+d.value); })
        .attr("height", y.bandwidth())
        .attr("class", "bar");
    
	ind_bar.on("click", function (elem) {
        d3.event.stopPropagation();
        d3.select(element[0]).selectAll('svg').remove().exit().data(data);
		data.values = data.values.filter(function(item) { return item !== elem; });
        draw_bar_chart(data, element, title);
    });

    bar.append("text")
        .attr("x", function(d) { return x(+d.value) + 3; })
        .attr("y", y.bandwidth() / 2)
        .attr("dy", ".35em")
        .attr("class", "barlabel")
        .text(function(d) { return +d.value > min_label_value ? d.key[1] : ''; });

    plot.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    plot.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    if (show_top_axis) {
        plot.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, 0)")
            .call(xAxisTop);
    }
};

// //////////////////////////////////////////////////////////////////////////
// line chart
var draw_line_plot = function(data, element, title, ordinal) {

    var margin = {top: 20, right: 100, bottom: 120, left: 100},
        width = 780 - margin.left - margin.right;

    var height = 400 - margin.top - margin.bottom;

    var x_values = data.map(function(d) {
            return d.values.map(function(e) { return e.x; });
    });

    var y_values = data.map(function(d) {
            return d.values.map(function(e) { return e.y; });
    });

    var min_x_value = d3.min(x_values.map(function(d) { return d3.min(d); }));
    var max_x_value = d3.max(x_values.map(function(d) { return d3.max(d); }));
    var min_y_value = d3.min(y_values.map(function(d) { return d3.min(d); }));
    var max_y_value = d3.max(y_values.map(function(d) { return d3.max(d); }));

    var chart = d3.select(element[0]).append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var title_g = chart.append('g')
        .attr("transform", "translate(0, 20)");

    title_g.append('text')
        .text(title)
        .attr('class', 'charttitle');

    var plot = chart.append('g')
        .attr("transform", "translate(0,50)");

    var x;
    if (!ordinal) {
        x = d3.scaleLinear()
            .domain([min_x_value, max_x_value])
            .range([0, width]);
    } else {
        x = d3.scalePoint()
            .domain(x_values[0])
            .range([0, width]);
    }

    var y = d3.scaleLinear()
        .domain([min_y_value, max_y_value])
        .range([height, 0]);

    var xAxis = d3.axisBottom(x);

    var yAxis = d3.axisLeft(y);
    
    var line = d3.line()
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); });

    var col = d3.scaleOrdinal(d3.schemeCategory10);

    // add lines
    var index = 0;
    data.forEach(function(row) {
        plot.append("path")
            .datum(row.values)
            .attr("class", "line")
            .attr("d", line)
            .attr("stroke", function(d) { return col(index); })
            .append("svg:title")
                .text(function(d) { return d.key; });
        index++;
    });

    // add points
    index = 0;
    data.forEach(function(row) {
        var g = plot.append('g');
        g.selectAll("circle")
            .data(row.values)
            .enter()
            .append("circle")
            .attr("class", "dot") 
            .attr("cx", function(d) {
                return x(d.x);
            })
            .attr("cy", function(d) {
                return y(d.y);
            })
            .attr("r", 5)
            .attr("fill", function(d, i) { return col(index); })
            .append("svg:title")
                .text(function(d) { return d.key + ', ' + d.y; });
        index++;
    });

    plot.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
            .attr("transform", function(d) { return ordinal ? "rotate(90)" : "rotate(0)"; })
            .attr("dy", function(d) { return ordinal ? "-0.35em": ".7em"; })
            .attr("dx", function(d) { return ordinal ? "1em": "0em"; })
            .style("text-anchor", function(d) { return ordinal ? "start" : "middle"; });

    plot.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // add legend
    var legend_width = 100;

    index = 0;
    data.forEach(function(row) {
        var legend = plot.append("g")
            .attr("transform", "translate(" + (width - legend_width) + "," + (index * 20) + ")");
        legend.append("circle")
            .datum(row)
            .attr("class", "dot") 
            .attr("cx", function(d) {
                return 0;
            })
            .attr("cy", function(d) {
                return 0;
            })
            .attr("r", 5)
            .attr("fill", function(d, i) { return col(index); })
            .append("svg:title")
                .text(function(d) { return d.key; });

        legend.append("text")
            .datum(row)
            .text(function(d) { return d.key; })
            .attr("transform", "translate(12, 5)");
        index++;
    });
}
