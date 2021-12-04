
d3.json("output.geojson").then(function(themap){
    d3.csv("CRD_cases.csv").then(function(dataset){
    
      
        console.log(themap)
        console.log(dataset)
       
        var svg=d3.select("svg")
        .style("width",2000)
        .style("height",300)
		
       //colorScale = d3.scaleThreshold() 
         //           .domain([0,0.1*d3.max(Object.values(popPerCountry)),d3.max(Object.values(popPerCountry))])
           //        .domain([5000, 10000, 20000, 50000, 100000, 250000, 500000, 750000, 1000000, 1500000])
            //      .range(["#4e79a7" , "#f28e2c", "#e15759", "#76b7b2", "#59a14f", "#edc949", "#af7aa1", "#ff9da7", "#9c755f", "#bab0ab"])
        var projection=d3.geoEqualEarth() //geoMercator geoEqualEarth
                        .fitWidth(600,{type:"Sphere"})
        var pathGenerator=d3.geoPath(projection)       
        var sea=svg.append("path")
                    .attr("d",pathGenerator({type:"Sphere"}))
                    .attr("fill","lightblue")

        var headers = ["0", "1000", "100000", "500000", "2500000", "30000000"];
        // var legendText = ['0', '1000', '100000', '500000', '2500000', '30000000'];
        // var legendColors = d3.range(d3.schemeReds[8])
        
    
        // var graticule=svg.append("path")
        //                 .attr("d",pathGenerator(d3.geoGraticule10()))
        //                 .style("fill","none")
        //                 .style("stroke","grey")
        
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
                        
                                

                                // var confirmed = popPerCountry[i.properties.ADM0_A3]
                                // var recovered = recovPerCountry[i.properties.ADM0_A3]
                                // var deaths = deathspercountry[i.properties.ADM0_A3]
                                // var data = [
                                //     {Cases:'confirm', count: popPerCountry[i.properties.ADM0_A3]},
                                //     {Cases:'recover', count: recovPerCountry[i.properties.ADM0_A3]},
                                //     {Cases:'death', count: deathspercountry[i.properties.ADM0_A3]}
                                // ];
                                
                                if (document.getElementById("id1") != null  ){
                                    
                                    document.getElementById("id1").remove()
                                    document.getElementById("id1").remove()
                                    document.getElementById("id1").remove()
                                    document.getElementById("id3").remove()
									document.getElementById("id5").remove()
									
                                }
                                
                                var data = [
                                    {Cases:'Confirmed', count: con},
                                    {Cases:'Recovered', count: rec },
                                    {Cases:'Deaths', count: dea}
                                ];
								

                                var dimensions = {
                                    width: 300,
                                    height: 400,
                                    margin: {
                                        top: 100,
                                        bottom: 150,
                                        right: 10,
                                        left: 60
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
                                                            
                                                            
                                                            
                                                        //console.log(d3.max(labels,d=>d.year))
                                                                                                                        
                                                            
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
                                                // .attr("id","id1")
                                var xAxisgen = d3.axisBottom().scale(xScale)
                                var yAxisgen = d3.axisLeft().scale(yScale)
                                var xAxis = svg.append("g")
                                                .call(xAxisgen)
                                                .style("transform", `translateY(${dimensions.height - dimensions.margin.bottom}px)`)
                                                .selectAll("text")
                                                //.attr("id","id2")
                                                                //.attr("transform", "translate(-10,0)rotate(-60)")
                                                .style("text-anchor", "end");
                                var yAxis = svg.append("g")
                                                .call(yAxisgen)
                                                .attr("id","id3")
                                                .style("transform", `translateX(${dimensions.margin.left}px)`)

let svg1 = d3.select("body").append("svg")
.attr("width", 720)
.attr("height", 400)
.attr("id","id5")


let width = +svg1.attr("width");
let height = +svg1.attr("height");


function render(data) {

let xVal = d => d.date;
let yVal = d => d.cases;

let margin = {
	top: 35,
	right: 150,
	bottom: 160,
	left:100
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

let g = svg1.append("g")
	.attr("transform", `translate(${margin.left}, ${margin.top})`);

let yG = g.append("g")
	.call(yAxis)
	.attr("font-size", 10);

yG.append("text")
	.attr("font-size", 14)
	.attr("fill", "black")
	.text("New Cases Per Day")
	.attr("dx", "-1em")
    .attr("dy", "-3em")
    .attr("transform", "rotate(-90)");

let xG = g.append("g")
	.call(xAxis)
	.attr("transform", `translate(0, ${innerHeight})`)
	.attr("font-size", 12);

xG.append("text")
	.attr("font-size", 14)
	.attr("fill", "black")
	.text("Month - Day")
	.attr("y", 40)
	.attr("x", innerWidth / 2);

g.append("text")
	.attr("font-family", "sans-serif")
	.text(desiredCountry + " COVID-19 New Cases Per Day")
	.attr("font-size", 20)
	.attr("y", -20)
	.attr("x", innerWidth / 6);

let line = d3.line()
	.x(d => scaleX(xVal(d)))
	.y(d => scaleY(yVal(d)));

g.append("path")
	.datum(data)
	.attr("fill", "none")
	.attr("stroke", "#E74C3C")
	.attr("stroke-width", 1.5)
	.attr("stroke-linejoin", "round")
	.attr("stroke-linecap", "round")
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
                              console.log( i.properties.ADM0_A3)
                              console.log(popPerCountry[i.properties.ADM0_A3])
                              document.getElementById("details").innerHTML="Country: "+countryname[i.properties.ADM0_A3]+" Confirmed Cases: "+popPerCountry[i.properties.ADM0_A3] +" , "
                                                                          + "Recovered: "+ recovPerCountry[i.properties.ADM0_A3]+", "+"Deaths: "+deathspercountry[i.properties.ADM0_A3]
                              
                            })


        var legend = svg.selectAll(".legend")
                        .data(headers.slice().reverse())
                        .enter().append("g")
                        .attr("class", "legend")
                        .attr("transform", function(d, i) { return "translate(-20," + i * 20 + ")"; });
                           
            legend.append("rect")
                    .attr("x", 720)
                    .attr("width", 25)
                    .attr("height", 17)
                    .style("fill", colorScale);
                        
            legend.append("text")
                    .attr("x", 710)
                    .attr("y", 15)
                    .style("text-anchor", "end")
                    .text(function(d) { return d;  });


        // var data = [
        //     {Cases:'confirm', count: 'confirmed'},
        //     {Cases:'recover', count: 'recovered'},
        //     {Cases:'death', count:'deaths'}
        // ];
        // var dimensions = {
        //     width: 450,
        //     height: 200,
        //     margin: {
        //         top: 10,
        //         bottom: 30,
        //         right: 10,
        //         left: 50
        //     }
        // }
        // var svg1 = d3.select("#forces")
        //             .style("width", dimensions.width)
        //             .style("height", dimensions.height)
                        
        // var labels=data.map(d=>d.Cases)
        //         console.log(labels)
                                    
                                    
                                    
        // var frequency = data.map(d=>d.count)
        //             console.log(frequency)
                                    
                                    
                                    
        // var xScale=d3.scaleBand()
        //             .domain(labels)
        //             .range([dimensions.margin.left,dimensions.width - dimensions.margin.right])
        //             .padding(0.5)
                                    
                                    
                                    
        //                         //console.log(d3.max(labels,d=>d.year))
                                    
                                    
                                    
        // var yScale = d3.scaleLinear()
        //                 .domain([0,50000])   //d3.max(data, d=>+d.count)
        //                 .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top])
                    
        // var dots = svg1.selectAll("rect")
        //                 .data(data)
        //                 .enter()
        //                 .append("rect")
        //                 .attr('x', d =>xScale(d.Cases))
        //                 .attr('y', d => yScale(d.count))
        //                 .attr('width', xScale.bandwidth())
        //                 .attr('height', d => dimensions.height - dimensions.margin.bottom - yScale(d.count))
        //                 .attr('fill','#E5542A')
        // var xAxisgen = d3.axisBottom().scale(xScale)
        // var yAxisgen = d3.axisLeft().scale(yScale)
        // var xAxis = svg1.append("g")
        //                 .call(xAxisgen)
        //                 .style("transform", `translateY(${dimensions.height - dimensions.margin.bottom}px)`)
        //                 .selectAll("text")
        //                                 //.attr("transform", "translate(-10,0)rotate(-60)")
        //                 .style("text-anchor", "end");
        // var yAxis = svg1.append("g")
        //                 .call(yAxisgen)
        //                 .style("transform", `translateX(${dimensions.margin.left}px)`)
                       
                                    
                                    
                                    
                                    // console.log(d3.max(frequency,d=>d[name]))
                                    
        })
    })
