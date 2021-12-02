
d3.csv("line.csv").then(function (data){

    var nameSelected = "daily_cases"
  
    var size = d3.min([window.innerWidth*0.9, window.innerHeight*0.9])

    var dimensions = ({
            width: 1150, 
            height: 900/3,
            margin: {
            top: 10,
            right: 10,
            bottom: 65,
            left: 50
        }
    })

    var svg = d3.select("#barchart")
                .style("width", dimensions.width)
                .style("height", dimensions.height)

    dimensions.boundedWidth = dimensions.width - dimensions.margin.right - dimensions.margin.left
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

    var xScale = d3.scaleBand()
            .domain(data.map(function(d){return d.date;}))
            .range([0,dimensions.boundedWidth]).padding(0.2)

    var yScale = d3.scaleLinear()
    .domain([0, d3.max(data.map(function(d){return d["daily_cases"]}), s => +s)])
    .range([dimensions.boundedHeight,0]);

    console.log(data.map(function(d){return d["daily_deaths"]}))

    var bounds = svg.append("g")
        .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

    var text = svg
                .append('text')
                .attr("id", 'topbartext')
                .attr("x", 250)
                .attr("y", 20)
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("font-family", "sans-serif")
                .text("Count per day: 0")
        
             
    var bars = bounds
                .selectAll("bar")
                .data(data) 
                .enter()
                .append('rect')
                .attr('x', function(d) { return xScale(d.date); })
                .attr('width', xScale.bandwidth)
                .attr('y', function(d) { return yScale(d["daily_cases"]); })
                .attr('height', function(d){return dimensions.boundedHeight - yScale(d["daily_cases"])})
                .attr("fill", "steelblue")  
                .on('mouseover', function(d,i){
                    d3.select(this)
                        .attr("stroke-width",0.5)
                        .attr("stroke","black")
                text.text("Count per day: " + i[nameSelected] +"\n, Date: "+i.date)
                })
                .on('mouseout', function(){
                    d3.select(this)
                        .attr("stroke-width", 0)
                    
                        text.text("Count per day: None, Date: None "  )
                })


    var xAxis = d3.axisBottom(xScale)
            .tickValues(xScale.domain().filter(function(d,i){ return !(i%4)})).tickSizeOuter(0)

    svg.append("g")
        .attr("transform", "translate("+ dimensions.margin.left + "," + (dimensions.boundedHeight+dimensions.margin.bottom/4) + ")")
        .call(xAxis)
        .selectAll("text")	
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    var yAxis = d3.axisLeft(yScale)

    var changing_axis = svg.append("g")
        .attr("transform", "translate("+dimensions.margin.left+","+ dimensions.margin.top +")")
        .call(yAxis)


    d3.select("#daily_cases").on('click', function(){
        nameSelected = "daily_cases"

        yScale.domain([0, d3.max(data.map(function(d){return d[nameSelected]}), s => +s)])

        bars.transition() 
            .attr('x', function(d) { return xScale(d.date); })
            .attr('width', xScale.bandwidth)
            .attr('y', function(d) { return yScale(d[nameSelected]); })
            .attr('height', function(d){return dimensions.boundedHeight - yScale(d[nameSelected])})
            .style("fill", "steelblue")

        changing_axis.transition()
                     .call(yAxis)

        
    })

    d3.select("#daily_deaths").on('click', function(){
        nameSelected = "daily_deaths"

        yScale.domain([0, d3.max(data.map(function(d){return d[nameSelected]}), s => +s)])

    
        bars.transition() 
        .attr('x', function(d) { return xScale(d.date); })
        .attr('width', xScale.bandwidth)
        .attr('y', function(d) { return yScale(d[nameSelected]); })
        .attr('height', function(d){return dimensions.boundedHeight - yScale(d[nameSelected])})
        .style("fill", "red")
        

        changing_axis.transition()
                    .call(yAxis)
        
    })

})
