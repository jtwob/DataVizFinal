var margin = 50;
var width2 = 600 - margin*2;
var height2 = 400 - margin*2;

var data2 = []

var svg2 = d3.select("#svg2")
    .attr("width", width2+margin*3)
    .attr("height", height2+margin*2)
    .append("g")
    .attr("transform",`translate(${margin*1.5},${margin})`)

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
    // console.log(data2)
    var x = d3.scaleTime()
        .domain([d3.timeParse("%Y")(1990), d3.timeParse("%Y")(2021)])
        .range([0,width2]);
    var yMoney = d3.scaleLinear()
        .domain([0, 60000])
        .range([height2, 0]);
    var yRatio = d3.scaleLinear()
        .domain([64, 73])
        .range([height2, 0]);

    svg2.append("g")
        .attr("transform", `translate(0, ${height2})`)
        .call(d3.axisBottom(x));
    svg2.append("g").call(d3.axisLeft(yMoney).ticks(6));
    svg2.append("g").call(d3.axisRight(yRatio).tickFormat(function(d) {return d+"%"}))
        .attr("transform", `translate(${width2}, 0)`);

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

        svg2.append("g")
            .selectAll("dot")
            .data(data2)
            .enter()
            .append("circle")
                .attr("cx", function (d) { return x(d.year); } )
                .attr("cy", function (d) { return yRatio(d.ratio); } )
                .attr("r", 3 )
                .style("fill", "teal");
        
        svg2.append("text")
            .attr("class", "title")
            .attr("style","font-size: 20")
            .attr("x", width2/2-100)
            .attr("y", 0)
            .text("Average and Median Wages");

        svg2.append("text")
            .attr("style","font-size: 18")
            .attr("x", width2/2-20)
            .attr("y", height2+40)
            .text("Year");

        svg2.append("text")
            .attr("style","font-size: 18")
            .attr("transform","rotate(-90)")
            .attr("x", -height2/2-40)
            .attr("y", -60)
            .text("Earnings ($)");
        svg2.append("text")
            .attr("style","font-size: 18")
            .attr("transform","rotate(-90)")
            .attr("x", -height2/2-100)
            .attr("y", width2+margin)
            .text("Ratio of Median to Average");
})