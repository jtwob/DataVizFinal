/**
 * Acquired data from https://companiesmarketcap.com/
*/

var margin = 50;
var width3 = 800 - margin*2;
var height3 = 900 - margin*2;

var axes = {}
var data3 = []

// Access svg slot 4 (svg4 because the visuals were reordered)
var svg3 = d3.select("#svg4")
    .attr("width", width3+margin*3)
    .attr("height", height3+margin*2)
    .append("g")
    .attr("transform",`translate(0,${margin})`)

// pull and save data for global public issues
d3.csv("data3_2.csv",function(d){
    data3.push({
        issue: d.issue,
        cost: +d.cost/1000000000,
        costyr: +d.costyr
    })
})

// pull and save data for market caps
d3.csv("data3.csv", function(d, i) {
    // create an individual scale for each axis
    axes[d.name] = d3.scaleLinear()
        .domain([0, +d.marketcap/1000000000])
        .range([height3, 0])
    
    var x3 = d3.scalePoint();
    if(Object.keys(axes).length === 10){
        x3
            .range([0, width3])
            .padding(1)
            .domain(Object.keys(axes))

        // append cost of issues to axes
        svg3.selectAll("paths")
            .data(data3)
            .enter()
            .append("path")
            .attr("d", function(d){
                let path = []
                for(t in axes){
                    path.push([x3(t), axes[t](d.cost)])
                }
                return d3.line()(path);
            })
            .style("fill", "none")
            .style("stroke", "red")
            .style("opacity", 2)
        
        // append axes
        svg3.selectAll("axes")
            .data(Object.keys(axes))
            .enter()
            .append("g")
            .attr("transform", function(d) { return "translate(" + x3(d) + ")"; })
            .each(function(d) { d3.select(this).call(d3.axisRight().scale(axes[d]).ticks(20)); })
            .append("text")
                .style("text-anchor", "middle")
                .attr("y", -9)
                .text(function(d) { return d; })
                .style("fill", "white")
        
        // title
        svg3.append("text")
            .attr("x",width3/2-220)
            .attr("y",-30)
            .attr("style","font-size: 20")
            .style("fill", "white")
            .text("Top 10 Companies by Market Cap VS Global Challenges")
        
        // issue labels
        svg3.append("text")
            .attr("x",15)
            .attr("y",height3-58)
            .attr("style","font-size: 10")
            .style("fill","white")
            .text("Water")
        svg3.append("text")
            .attr("x",15)
            .attr("y",height3-50)
            .attr("style","font-size: 10")
            .style("fill","white")
            .text("Poverty")
        svg3.append("text")
            .attr("x",15)
            .attr("y",height3-28)
            .attr("style","font-size: 10")
            .style("fill","white")
            .text("Climate")
        svg3.append("text")
            .attr("x",15)
            .attr("y",height3-10)
            .attr("style","font-size: 10")
            .style("fill","white")
            .text("Education")
        svg3.append("text")
            .attr("x",5)
            .attr("y",height3)
            .attr("style","font-size: 10")
            .style("fill","white")
            .text("Homlessness")
        svg3.append("text")
            .attr("x",15)
            .attr("y",height3+10)
            .attr("style","font-size: 10")
            .style("fill","white")
            .text("Hunger")
    }
})