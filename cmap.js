
d3.json("output.geojson").then(function(themap){
    d3.csv("PEdited_confirmed_cases.csv").then(function(dataset){
    
      
        console.log(themap)
        console.log(dataset)
       
        var svg=d3.select("svg")
        .style("width",2000)
        .style("height",400)
       //colorScale = d3.scaleThreshold() 
         //           .domain([0,0.1*d3.max(Object.values(popPerCountry)),d3.max(Object.values(popPerCountry))])
           //        .domain([5000, 10000, 20000, 50000, 100000, 250000, 500000, 750000, 1000000, 1500000])
            //      .range(["#4e79a7" , "#f28e2c", "#e15759", "#76b7b2", "#59a14f", "#edc949", "#af7aa1", "#ff9da7", "#9c755f", "#bab0ab"])
        var projection=d3.geoEqualEarth() //geoMercator geoEqualEarth
                        .fitWidth(800,{type:"Sphere"})
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
        dataset.forEach(d=>
            popPerCountry[d["Country Code"]]=d["Total_cases"]
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
        var legend = svg.selectAll(".legend")
                        .data(headers.slice().reverse())
                        .enter().append("g")
                        .attr("class", "legend")
                        .attr("transform", function(d, i) { return "translate(-20," + i * 20 + ")"; });
                           
            legend.append("rect")
                    .attr("x", 870)
                    .attr("width", 20)
                    .attr("height", 15)
                    .style("fill", colorScale);
                        
            legend.append("text")
                    .attr("x", 850)
                    .attr("y", 15)
                    .style("text-anchor", "end")
                    .text(function(d) { return d;  });
        })
    })
