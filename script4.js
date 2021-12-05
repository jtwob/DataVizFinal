/**
 * TODO: Find 
 * top marginal tax rate, 
 * minimum wage, 
 * average wage, 
 * median wage,
 * and union membership rates 
 * 
 * for at least 10 Developed countries and the US,
 * 
 * norway:
 * https://www.skatteetaten.no/en/rates/maximum-effective-marginal-tax-rates/
 * https://frifagbevegelse.no/foreign-workers/norway-does-not-have-a-common-minimum-wage-for-all-workers-here-we-explain-why-6.539.832584.eb1e6e70f1
 * https://www.thelocal.no/20210916/how-much-does-it-cost-to-live-in-norway/#:~:text=According%20to%20Statistics%20Norway%20(SSB,or%20585%2C000%20NOK%20per%20year.
 * https://www.oecdbetterlifeindex.org/countries/norway/#:~:text=Norwegians%20earn%20USD%2051%20212,average%20of%20USD%2043%20241.
 * 
 * finland:
 * https://tradingeconomics.com/finland/personal-income-tax-rate
 * https://www.minimum-wage.org/international/finland
 * https://www.statista.com/statistics/529917/finland-average-monthly-earnings-by-sector/#:~:text=In%202020%2C%20the%20average%20monthly,was%203%2C681%20euros%20per%20month.
 * https://www.statista.com/statistics/526306/finland-household-median-disposable-income/#:~:text=The%20median%20disposable%20income%20of,was%20measured%20at%2037%2C929%20euros.
 *  
 * iceland:
 * https://tradingeconomics.com/iceland/personal-income-tax-rate
 * https://www.minimum-wage.org/international/iceland#:~:text=Because%20Iceland%20does%20not%20have,pay%20for%20workers%20in%20Iceland.
 * https://icelandmag.is/article/how-much-average-wage-iceland
 * 
 * sweden:
 * https://taxfoundation.org/how-scandinavian-countries-pay-their-government-spending/
 * https://www.minimum-wage.org/international/sweden
 * https://www.averagesalarysurvey.com/sweden
 * 
 * denmark:
 * https://taxsummaries.pwc.com/denmark/individual/taxes-on-personal-income
 * https://www.minimum-wage.org/international/denmark
 * https://www.usnews.com/news/best-countries/articles/2016-01-20/why-danes-happily-pay-high-rates-of-taxes#:~:text=The%20average%20annual%20income%20in,45%20percent%20in%20income%20taxes.
 * https://en.wikipedia.org/wiki/Median_income
 * 
 * usa:
 * https://www.dol.gov/general/topic/wages/minimumwage
 * https://www.bls.gov/opub/ted/2021/a-look-at-union-membership-rates-across-industries-in-2020.htm#:~:text=The%20union%20membership%20rate%20(the,from%2010.3%20percent%20in%202019.
 * 
 * 
 * union membership:
 * https://nordics.info/show/artikel/trade-unions-in-the-nordic-region
 * 
 */

/**
 * TODO: implement 
 * a twin bar chart 
 * that represents each variable as a bar 
 * compared to the US
 * make it interactive
 * by implementing a dropdown 
 * of the countries for which there is data
 */

    var margin = 50;
    var width4 = 600 - margin*2;
    var height4 = 400 - margin*2;

    var chartFields = ["Top Marginal Tax Rate","Minimum Wage","Average Income","Median Income","Union Membership"];

    var countryMap = {};
    var data4 = [];

    d3.csv("./data4.csv", function(d) {
            var country = d.country;
            countryMap[country] = [];
            chartFields.forEach(function(field) {
                if(field!=='country'){
                    countryMap[country].push(+d[field]);
                }
            });
        
        if(countryMap.USA){
            countryMap.USA.forEach(function(f, i) {
                Object.keys(countryMap).filter((d) => {return d!=="usa"}).forEach(function(d, j){
                    countryMap[d][i] = (countryMap[d][i]/f)-1
                    
                })
            })
            // console.log(countryMap);
            makeChart(countryMap);
        }
    });

    var makeChart = function(countryMap) {

        var xS = d3.scalePoint()
            .range([0, width4])
            .padding(1)
            .domain(Object.keys(countryMap).filter((d) => {return d!=="USA"}))

        var yS = d3.scaleLinear()
            .domain([-100,700])
            .range([height4,0]);

        var svg4 = d3.select("#svg3")
            .attr("width", width4+margin*3)
            .attr("height", height4+margin*2)
            .append("g")
            .attr("transform",`translate(${margin*1.5},${margin})`);

        svg4.append("g")
            .call(d3.axisLeft(yS).ticks(10).tickFormat((d) => {return d+"%"}))
        
        svg4.append("g")
            .attr("transform", `translate(0, ${height4-37.5})`)
            .call(d3.axisBottom(xS))
            
        var yAxis = d3.axisLeft()
            .ticks(10).tickFormat((d) => {return d+"%"})
            .scale(yS);

        var yAxisHandleForUpdate = svg4.append("g")
            .attr("class", "y axis");

        var updateBars = function(d){
            // yS.domain( d3.extent(d) );
            // yAxisHandleForUpdate.call(yAxis);
            var bars = svg4.selectAll(".bar")
                .data(d);

                bars
                .enter()
                .append("rect")
                    .attr("class","bar")
                    .attr("fill","teal")
                    .attr("x",function(d,i){return xS(Object.keys(countryMap)[i])-10})
                    .attr("width", "20")
                    // .attr("y", function(d) { return height4-37.5 })
                    .attr("y", function(d) {  return d>0?yS(d):height4-37.5; })
                    // .attr("height", function(d) { return 10 });
                    .attr("height", function(d) {console.log(yS(d));return d>0?height4-37.5-yS(d):yS(d)-(height4-37.5); });

                bars
                    .transition().duration(250)
                    .attr("y", function(d) { return d>0?yS(d):height4-37.5; })
                    // .attr("height", function(d) { return 10 });
                    .attr("height", function(d) {return d>0?height4-37.5-yS(d):yS(d)-(height4-37.5); });
                    
                bars.exit().remove();
        };

        var dropdownChange = function() {
            var newStat = d3.select(this).property('value'),
                newData = crossSection(newStat);
                // console.log(newStat);
            updateBars(newData);
        };

        var crossSection = function(value){
            var temp = [];
            Object.keys(countryMap).filter((d) => {return d!=="USA"}).forEach(function(d){
                // console.log(countryMap[d][value]*100);
                temp.push(countryMap[d][value]*100)
            })
            return temp;
        }
        crossSection(1);
        var dropdown = d3.select("#drop")
            .insert("select","svg")
            .on("change",dropdownChange);
        
        dropdown.selectAll("option")
            .data(chartFields)
            .enter()
            .append("option")
            .attr("value", function(d,i){return i;})
            .text(function(d){
                return d;
            })
        var initialData = crossSection(2);
        updateBars(initialData);

    }