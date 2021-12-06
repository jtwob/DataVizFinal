var margin = 50;
var width = 700 - margin*2;
var height = 700 - margin*2;

var data = []

var svg = d3.select("#svg1")
    .attr("width", width+margin*3)
    .attr("height", height+margin*2)
    .append("g")
    .attr("transform",`translate(${margin*1.5},${margin})`)

d3.csv("data1.csv", function(d) {
    data.push({
        year: +d.year,
        pop1: +d.pop1,
        comp1: +d.comp1,
        pop50: +d.pop50,
        comp50: +d.comp50,
        orient: d.orient
    })
    // console.log(data);
}).then(() => {
    var xScale = d3.scaleLinear()
                    .domain([d3.min(data, function(d) {return d.comp50;})-1000000000, d3.max(data, function(d) {return d.comp50;})])
                    .range([0,width]);
    var yScale = d3.scaleLinear()
                    .domain([d3.min(data, function(d) {return d.comp1;})-1000000000, d3.max(data, function(d) {return d.comp1;})])
                    .range([height, 0]);
    
    xAccessor = d => d.comp50;
    yAccessor = d => d.comp1;
    
    line = d3
        .line()
        .curve(d3.curveCatmullRom)
        .x(d => xScale(xAccessor(d)))
        .y(d => yScale(yAccessor(d)));
    
    function length(path) {
        return d3
            .create("svg:path")
            .attr("d", path)
            .node()
            .getTotalLength();
    }
    
    const l = length(line(data));

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).ticks(10).tickFormat(x => `${x/1000000000}`));
    svg.append("text")
        .attr("x", width/2 - 150)
        .attr("y", height+40)
        .text("Bottom 50% Aggregate Compensation (Billions of $)");
    
    svg.append("g")
        .call(d3.axisLeft(yScale).ticks(9).tickFormat(x => `${x/1000000000}`));
    svg.append("text")
        .attr("transform","rotate(-90)")
        .attr("x", -height/2-100)
        .attr("y", -60)
        .text("Top 1% Aggregate Compensation (Billions of $)");

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", `0,${l}`)
        .attr("d", line)
        .transition()
        .duration(7500)
        .ease(d3.easeLinear)
        .attr("stroke-dasharray", `${l},${l}`);

    svg.append("g")
        .selectAll("bubble")
        .data(data)
        .enter()
        .append("circle")
            .attr("cx", function (d) { return xScale(d.comp50); } )
            .attr("cy", function (d) { return yScale(d.comp1); } )
            .attr("r", 3 )
            .style("fill", "teal");

    svg.append("text")
        .attr("class", "title")
        .attr("style","font-size: 20")
        .attr("x", width/2-70)
        .attr("y", 0)
        .text("US Income Data 1991-2020");

    const label = svg
        .append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", d => `translate(${xScale(d.comp50)},${yScale(d.comp1)})`)
        .attr("opacity", 0);
    
      label
        .append("text")
        .text(d => d.year)
        .each(function(d) {
          const t = d3.select(this);
          switch (d.orient) {
            case "top":
              t.attr("text-anchor", "middle").attr("dy", "-0.7em");
              break;
            case "right":
              t.attr("dx", "0.5em")
                .attr("dy", "0.32em")
                .attr("text-anchor", "start");
              break;
            case "bottom":
              t.attr("text-anchor", "middle").attr("dy", "1.4em");
              break;
            case "left":
              t.attr("dx", "-0.5em")
                .attr("dy", "0.32em")
                .attr("text-anchor", "end");
              break;
          }
        });
    
      label
        .transition(7500)
        .delay((d, i) => (length(line(data.slice(0, i + 1))) / l) * (7500 - 50))
        .attr("opacity", 1);
})