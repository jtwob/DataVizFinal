var margin = 50;
var width2 = 600 - margin*2;
var height2 = 400 - margin*2;

var data2 = []

// Access svg slot 2
var svg2 = d3.select("#svg2")
    .attr("width", width2+margin*3)
    .attr("height", height2+margin*3)
    .append("g")
    .attr("transform",`translate(${margin*1.5},${margin})`)

// pull and save data
d3.csv("data2.csv",function(d){
    data2.push({
        year: d3.timeParse("%Y")(+d.year),
        average: +d.averageamount,
        avgChange:  +d.averagechange,
        cAvgChange: +d.cmltvaveragechange,
        median: +d.medianamount,
        medChange: +d.medianChange,
        cMedChange: +d.cmltvmedianchange,
        ratio: +d.ratiomedtoavg
    })
}).then(() => {
    // scale definitions
    var x = d3.scaleTime()
        .domain([d3.timeParse("%Y")(1990), d3.timeParse("%Y")(2021)])
        .range([0,width2]);
    var yMoney = d3.scaleLinear()
        .domain([0, 60000])
        .range([height2, 0]);
    var yRatio = d3.scaleLinear()
        .domain([64, 73])
        .range([height2, 0]);

    // x axis
    svg2.append("g")
        .attr("transform", `translate(0, ${height2})`)
        .call(d3.axisBottom(x));
    // left y axis
    svg2.append("g").call(d3.axisLeft(yMoney).ticks(6));
    // right y axis
    svg2.append("g").call(d3.axisRight(yRatio).tickFormat(function(d) {return d+"%"}))
        .attr("transform", `translate(${width2}, 0)`);

    // average line
    svg2.append("path")
        .datum(data2)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3)
        .attr("d", d3.line()
            .x(function(d) { 
                return x(d.year) ;
            })
            .y(function(d) { 
                return yMoney(d.average) 
            })
        )

    // median line
    svg2.append("path")
        .datum(data2)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 3)
        .attr("d", d3.line()
            .x(function(d) { 
                return x(d.year) ;
            })
            .y(function(d) { 
                return yMoney(d.median) 
            })
        )

    // ratio points
    svg2.append("g")
        .selectAll("dot")
        .data(data2)
        .enter()
        .append("circle")
            .attr("cx", function (d) { return x(d.year); } )
            .attr("cy", function (d) { return yRatio(d.ratio); } )
            .attr("r", 3 )
            .style("fill", "teal");
    
    // title
    svg2.append("text")
        .attr("class", "title")
        .attr("style","font-size: 20")
        .attr("x", width2/2-100)
        .attr("y", 0)
        .style("fill", "white")
        .text("Average and Median Wages");

    // x axis label
    svg2.append("text")
        .attr("style","font-size: 18")
        .attr("x", width2/2-20)
        .attr("y", height2+40)
        .style("fill", "white")
        .text("Year");
    
    // left y axis label
    svg2.append("text")
        .attr("style","font-size: 18")
        .attr("transform","rotate(-90)")
        .attr("x", -height2/2-40)
        .attr("y", -60)
        .style("fill", "white")
        .text("Earnings ($)");

    // right y axis label
    svg2.append("text")
        .attr("style","font-size: 18")
        .attr("transform","rotate(-90)")
        .attr("x", -height2/2-100)
        .attr("y", width2+margin)
        .style("fill", "white")
        .text("Ratio of Median to Average");
    

    // legend
    svg2.append("circle").attr("cx",37.5).attr("cy",height2+85).attr("r",3).style("fill", "teal");
    svg2.append("line")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 3)
        .attr("x1",25)
        .attr("x2",50)
        .attr("y1",height2+60)
        .attr("y2",height2+60)
    svg2.append("line")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3)
        .attr("x1",25)
        .attr("x2",50)
        .attr("y1",height2+35)
        .attr("y2",height2+35)
    svg2.append("text")
        .attr("x", 60)
        .attr("y",height2+40)
        .attr("style","font-size: 14")
        .style("fill", "white")
        .text("Average Income")
    svg2.append("text")
        .attr("x", 60)
        .attr("y",height2+65)
        .attr("style","font-size: 14")
        .text("Median Income")
        .style("fill", "white")
    svg2.append("text")
        .attr("x", 60)
        .attr("y",height2+90)
        .attr("style","font-size: 14")
        .style("fill", "white")
        .text("Ratio of Median to Average")

})