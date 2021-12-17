var margin = 50;
var width = 700 - margin*2;
var height = 700 - margin*2;

var data = []

//Access svg slot 1
var svg = d3.select("#svg1")
    .attr("width", width+margin*3)
    .attr("height", height+margin*2)
    .append("g")
    .attr("transform",`translate(${margin*1.5},${margin})`)

// pull and save data
d3.csv("data1.csv", function(d) {
    data.push({
        year: +d.year,
        pop1: +d.pop1,
        comp1: +d.comp1,
        pop50: +d.pop50,
        comp50: +d.comp50,
        orient: d.orient
    })
}).then(() => {
  // scale definitions
    var xScale = d3.scaleLinear()
                    .domain([d3.min(data, function(d) {return d.comp50;})-1000000000, d3.max(data, function(d) {return d.comp50;})])
                    .range([0,width]);
    var yScale = d3.scaleLinear()
                    .domain([d3.min(data, function(d) {return d.comp1;})-1000000000, d3.max(data, function(d) {return d.comp1;})])
                    .range([height, 0]);
    
    xAccessor = d => d.comp50;
    yAccessor = d => d.comp1;
    
    // nested d3 functions for animating the line connecting the scatter plot
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

    // x axis
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).ticks(10).tickFormat(x => `${x/1000000000}`));
    svg.append("text")
        .attr("x", width/2 - 150)
        .attr("y", height+40)
        .style("fill", "white")
        .text("Bottom 50% Aggregate Compensation (Billions of $)");
    
    // y axis
    svg.append("g")
        .call(d3.axisLeft(yScale).ticks(9).tickFormat(x => `${x/1000000000}`));
    svg.append("text")
        .attr("transform","rotate(-90)")
        .attr("x", -height/2-100)
        .attr("y", -60)
        .style("fill", "white")
        .text("Top 1% Aggregate Compensation (Billions of $)");

    // appending the connector animated line
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", `0,${l}`)
        .attr("d", line)
        .transition()
        .duration(7500)
        .ease(d3.easeLinear)
        .attr("stroke-dasharray", `${l},${l}`);

    // adding the points
    svg.append("g")
        .selectAll("bubble")
        .data(data)
        .enter()
        .append("circle")
            .attr("cx", function (d) { return xScale(d.comp50); } )
            .attr("cy", function (d) { return yScale(d.comp1); } )
            .attr("r", 3 )
            .style("fill", "teal");

    // title
    svg.append("text")
        .attr("class", "title")
        .attr("style","font-size: 20")
        .attr("x", width/2-70)
        .attr("y", 0)
        .style("fill", "white")
        .text("US Income Data 1991-2020");

    // added an orientation feature to ensure all point year labels were not covered.
    const label = svg
        .append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .style("fill", "white")
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

      // adding annotation
      const annotations = [{
        note: {
          title: "2008 Housing Crisis", 
          label: "Here is the time period following the 2008 housing crisis, that crashed the global economy.",
          wrap: 190
        },
        type: d3.annotationCalloutCircle,
        x: 322,
        y: 260,
        dy: 100,
        dx: 60,
        subject: {
          radius: 70
        },
        connector: {
          end: "arrow"
        },
      }].map(function(d){ d.color = "teal"; return d})

      const makeAnnotations = d3.annotation()
          .type(d3.annotationLabel)
          .annotations(annotations)

      svg
        .append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations)
})