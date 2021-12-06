
d3.json("output.geojson").then(function(themap){
    d3.csv("CRD_cases.csv").then(function(dataset){
    
      
        console.log(themap)
        console.log(dataset)
       
        var svg=d3.select("svg")
        .style("width",800)
        .style("height",500)
		
        var projection=d3.geoEqualEarth() //geoMercator geoEqualEarth
                        .fitWidth(700,{type:"Sphere"})
        var pathGenerator=d3.geoPath(projection)       
        var sea=svg.append("path")
                    .attr("d",pathGenerator({type:"Sphere"}))
                    .attr("fill","lightblue")

        var headers = ["0", "1000", "100000", "500000", "2500000", "30000000"];
        var popPerCountry={
    
        }
        var countryname={}
        var recovPerCountry = {}
        var deathspercountry = {}

        dataset.forEach(d=> {
            countryname[d["Country Code"]] = d["Country/Region"]
            popPerCountry[d["Country Code"]]=d["Total_cases"]
            recovPerCountry[d["Country Code"]]=d["Total_recovered"]
            deathspercountry[d["Country Code"]]=d["Total_deaths"]
        }
            )
            console.log(popPerCountry)
    
        var colorScale=d3.scaleLinear()
                        .domain([0,0.1*d3.max(Object.values(popPerCountry)),d3.max(Object.values(popPerCountry))])
                        .domain([0, 1000, 100000, 500000, 2500000, 30000000 ])
                        .range(d3.schemeReds[8])
                        let mouseOver = function(d) {
                            d3.selectAll(".Country")
                              .transition()
                              .duration(200)
                              .style("opacity", .5)
                            d3.select(this)
                              .transition()
                              .duration(200)
                              .style("opacity", 1)
                              .style("stroke", "black")
                          }
                        
                          let mouseLeave = function(d) {
                            d3.selectAll(".Country")
                              .transition()
                              .duration(200)
                              .style("opacity", .8)
                            d3.select(this)
                              .transition()
                              .duration(200)
                              .style("stroke", "transparent")
                          }
                          
                        
    
    
        var countries=svg.append("g")
                            .selectAll("path")
                            .data(themap.features)
                            .enter()
                            .append("path")
                            .attr("d",d=>{return pathGenerator(d)})
                            .style("fill",d=>{
                                console.log(popPerCountry[d.properties.ADM0_A3])
                                return colorScale(popPerCountry[d.properties.ADM0_A3])
    
                            })
                            //.style("stroke","white")
                            .style("stroke", "transparent")
                            .attr("class", function(d){ return "Country" } )
                            .style("opacity", .8)
                            .on("mouseover", mouseOver )
                            .on("mouseleave", mouseLeave )
                            .on("click", function(d, i){
                                var con = popPerCountry[i.properties.ADM0_A3]
                                var rec = recovPerCountry[i.properties.ADM0_A3]
                                var dea = deathspercountry[i.properties.ADM0_A3]
                                
                                if (document.getElementById("id1") != null  ){
                                    
                                    document.getElementById("id1").remove()
                                    document.getElementById("id1").remove()
                                    document.getElementById("id1").remove()
                                    document.getElementById("id3").remove()
									document.getElementById("id5").remove()
									document.getElementById("idtext").remove()
									
                                }
                                
                                var data = [
                                    {Cases:'Confirmed', count: con},
                                    {Cases:'Recovered', count: rec },
                                    {Cases:'Deaths', count: dea}
                                ];
								

                                var dimensions = {
                                    width: 500,
                                    height: 550,
                                    margin: {
                                        top: 80,
                                        bottom: 220,
                                        right: 10,
                                        left: 100
                                    }
                                }
                                var svg = d3.select("#forces")
                                            .style("width", dimensions.width)
                                            .style("height", dimensions.height)
                                                
                                var labels=data.map(d=>d.Cases)
                                        console.log(labels)
                                                            
                                                            
                                                            
                                var frequency = data.map(d=>d.count)
                                            console.log(frequency)
                                                            
                                                            
                                                            
                                var xScale=d3.scaleBand()
                                            .domain(labels)
                                            .range([dimensions.margin.left,dimensions.width - dimensions.margin.right])
                                            .padding(0.7)
                                var yScale = d3.scaleLinear()
                                                .domain([0, d3.max(data, d=>+d.count)])   //d3.max(data, d=>+d.count)
                                                .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top])
								var colours = d3.scaleOrdinal()
											.range(["#E74C3C", "#196F3D","#DC7633"]);
                                                
                                var dots = svg.selectAll("rect")
                                                .data(data)
                                                .enter()
                                                .append("rect")
                                                .attr("id","id1")
                                                .attr('x', d =>xScale(d.Cases))
                                                .attr('y', d => yScale(d.count))
                                                .attr('width', xScale.bandwidth())
                                                .attr('height', d => dimensions.height - dimensions.margin.bottom - yScale(d.count))
                                                .attr('fill',colours)
                                               
                                var xAxisgen = d3.axisBottom().scale(xScale)
                                var yAxisgen = d3.axisLeft().scale(yScale)
								let yVal1 = d => d.Cases;
								let scaleY1 = d3.scaleLinear()
												.domain([0, d3.max(data, yVal1)]).nice()
												.range([innerHeight, 0])

								let yAxis1 = d3.axisLeft(scaleY1)
									.tickSize(-innerWidth);

								let gt = svg.append("g")
									.attr("transform", `translate(${dimensions.margin.left}, $dimensions.margin.top})`);

								let yG1 = gt.append("g")
									
									.attr("font-size", 10);

								yG1.append("text")
									.attr("font-size", 14)
									.attr("fill", "black")
									.text("Number of cases")
									.attr("dx", "-20em")
									.attr("dy", "2.5em")
									.attr("transform", "rotate(-90)");	
								gt.append("text")
									.attr("font-family", "sans-serif")
									.text(countryname[i.properties.ADM0_A3] + " COVID Cases Comparison")
									.attr("font-size", 16)
									.attr("y", 12)
									.attr("id","idtext")
									.attr("x", innerWidth /12);
                                var xAxis = svg.append("g")
                                                .call(xAxisgen)
                                                .style("transform", `translateY(${dimensions.height - dimensions.margin.bottom}px)`)
                                                .selectAll("text")
                                                .style("text-anchor", "end");
                                var yAxis = svg.append("g")
                                                .call(yAxisgen)
                                                .attr("id","id3")
                                                .style("transform", `translateX(${dimensions.margin.left}px)`)
console.log( i.properties.ADM0_A3)
console.log(popPerCountry[i.properties.ADM0_A3])
document.getElementById("details").innerHTML="Country: "+countryname[i.properties.ADM0_A3]+","+" Confirmed Cases: "+popPerCountry[i.properties.ADM0_A3] +" , "
                                                                         + "Recovered: "+ recovPerCountry[i.properties.ADM0_A3]+", "+"Deaths: "+deathspercountry[i.properties.ADM0_A3]
var svg = d3.select("body").append("svg")
.attr("width", 1150)
.attr("height", 500)
.attr("id","id5")


let width = +svg.attr("width");
let height = +svg.attr("height");


function render(data) {

let xVal = d => d.date;
let yVal = d => d.cases;

let margin = {
	top: 40,
	right: 150,
	bottom: 200,
	left: 325
};


let innerWidth = width - margin.left - margin.right;
let innerHeight = height - margin.top - margin.bottom;

let scaleX = d3.scaleTime()
	.domain([d3.min(data, xVal), d3.max(data, xVal)]).nice()
	.range([0, innerWidth]);

let xAxis = d3.axisBottom(scaleX)
	.tickSize(-innerHeight)
	.tickPadding(10)
	.ticks(12)
	.tickFormat(d3.timeFormat("%b-%Y"));
	

let scaleY = d3.scaleLinear()
	.domain([0, d3.max(data, yVal)]).nice()
	.range([innerHeight, 0])

let yAxis = d3.axisLeft(scaleY)
	.tickSize(-innerWidth);

let g = svg.append("g")
	.attr("transform", `translate(${margin.left}, ${margin.top})`);

let yG = g.append("g")
	.call(yAxis)
	.attr("font-size", 16);

yG.append("text")
	.attr("font-size", 18)
	.attr("fill", "black")
	.text("New Cases Per Day")
	.attr("dx", "-4em")
    .attr("dy", "-4em")
    .attr("transform", "rotate(-90)");

let xG = g.append("g")
	.call(xAxis)
	.attr("transform", `translate(0, ${innerHeight})`)
	.attr("font-size", 16);

xG.append("text")
	.attr("font-size", 18)
	.attr("fill", "black")
	.text("Month - Year")
	.attr("y", 70)
	.attr("x", innerWidth / 2);

g.append("text")
	.attr("font-family", "sans-serif")
	.text(desiredCountry + " COVID-19 New Cases Per Day")
	.attr("font-size", 22)
	.attr("y", -20)
	.attr("x", innerWidth / 4);

let line = d3.line()
	.x(d => scaleX(xVal(d)))
	.y(d => scaleY(yVal(d)));

g.append("path")
	.datum(data)
	.attr("fill", "none")
	.attr("stroke", "#E74C3C")
	.attr("stroke-width", 1.5)
	
	.attr("d", line);
	

}


let desiredCountry = countryname[i.properties.ADM0_A3];
d3.csv("coviddailycases.csv", function(d) {
if (d["Country"] == desiredCountry ) {
	console.log(d["New_cases"])
	return {
		date: d3.timeParse("%Y-%m-%d")(d["Date.Year"] + "-" + d["Date.Month"] + "-" + d["Date.Day"]),
		cases: +d["New_cases"]
	};
}
}).then(function(data) {
render(data);
});  
                            })                             


        var legend = svg.selectAll(".legend")
                        .data(headers.slice().reverse())
                        .enter().append("g")
                        .attr("class", "legend")
                        .attr("transform", function(d, i) { return "translate(-20," + i * 20 + ")"; });
                           
            legend.append("rect")
                    .attr("x", 760)
                    .attr("width", 25)
                    .attr("height", 25)
                    .style("fill", colorScale);
                        
            legend.append("text")
                    .attr("x", 750)
                    .attr("y", 18)
                    .style("text-anchor", "end")
                    .text(function(d) { return d;  });


      
                                    
        })
    })
	
