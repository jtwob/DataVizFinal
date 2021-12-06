//Parallel Coordinates Chart

/**TODO: 
 * Acquire data from https://companiesmarketcap.com/
*/
/**TODO:
 * Acquire 
 * climate change reversal estimate, 
 * global food shortage estimate, 
 * housing estimate,
 * poverty reduction estimate,
 * education estimate,
 * clean water estimate
 * 
 * from where ever these are available
 */

/**TODO:
 * Implement a parallel coordinates chart with the data,
 * company market caps are the axes,
 * global solution costs are the variables
 */

var margin = 50;
var width3 = 800 - margin*2;
var height3 = 900 - margin*2;

var axes = {}
var data3 = []

var svg3 = d3.select("#svg4")
    .attr("width", width3+margin*3)
    .attr("height", height3+margin*2)
    .append("g")
    .attr("transform",`translate(0,${margin})`)

d3.csv("data3_2.csv",function(d){
    data3.push({
        issue: d.issue,
        cost: +d.cost/1000000000,
        costyr: +d.costyr
    })
})

d3.csv("data3.csv", function(d, i) {
    axes[d.name] = d3.scaleLinear()
        .domain([0, +d.marketcap/1000000000])
        .range([height3, 0])
    
    // console.log(d.name, axes[d.name](data3[1].cost));
    
    var x3 = d3.scalePoint();
    if(Object.keys(axes).length === 10){
        x3
            .range([0, width3])
            .padding(1)
            .domain(Object.keys(axes))

        svg3.selectAll("paths")
            .data(data3)
            .enter()
            .append("path")
            .attr("d", function(d){
                // console.log(axes);
                let path = []
                // console.log(axes["Apple"](d.cost));
                for(t in axes){
                    path.push([x3(t), axes[t](d.cost)])
                }
                // for (let i = 0; i < axisTitles.length; i++){
                //     path.push([x3(), axes[t](d.cost)]) 
                // }
                // console.log(path);
                return d3.line()(path);
            })
            .style("fill", "none")
            .style("stroke", "red")
            .style("opacity", 2)
        
        svg3.selectAll("axes")
            .data(Object.keys(axes))
            .enter()
            .append("g")
            // I translate this element to its right position on the x axis
            .attr("transform", function(d) { return "translate(" + x3(d) + ")"; })
            // And I build the axis with the call function
            .each(function(d) { d3.select(this).call(d3.axisRight().scale(axes[d]).ticks(20)); })
            // Add axis title
            .append("text")
                .style("text-anchor", "middle")
                .attr("y", -9)
                .text(function(d) { return d; })
                .style("fill", "white")
        
        svg3.append("text")
            .attr("x",width3/2-220)
            .attr("y",-30)
            .attr("style","font-size: 20")
            .style("fill", "white")
            .text("Top 10 Companies by Market Cap VS Global Challenges")
    }

    // function path(d){
    //     return d3.line()(data3.map(function(p) {return [x(p.cost), axes[p](d[p])];}))
    // }
    
    // console.log(x3(Object.keys(axes)[1]));

})