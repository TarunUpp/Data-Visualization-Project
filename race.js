 const url_params = new URLSearchParams(window.location.search);
    const speed = url_params.has("speed") ? url_params.get("speed") : "medium";
    var duration; // Animation speed, default is 250ms
    switch (speed) {
      case "fast": duration = 100; break;
      case "slow": duration = 500; break;
      default: duration = 250; break;
    }
    $("#speed").val(speed);
    $("#speed").change(function() {
      window.location = window.location.origin + window.location.pathname + "?speed=" + this.value;
    });

    const display_n = 15; 
    const bar_padding = 5;
    let day_index = 0;
  
    const margin = ({top: 50, right: 20, bottom: 20, left: 20});
    const width = 1000;
    const height = 600;

    let svg = d3.select("#graph").append("svg")
      .attr("width", width)
      .attr("height", height);
    
    let title = svg.append("text")
      .attr("y", 20)
      .html("Confirmed cases by country:");

    d3.csv("dcountry.csv", function(d) {
      return {
        date: d.date,
        country: d.country,
        cases: parseInt(d.cases),
        color: d3.rgb(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)) // Assign a random color
      };
    }).then(function(data) {
      
      const daily_data = Object.entries(data.reduce(function(result, item) {
        (result[item["date"]] = result[item["date"]] || []).push(item);
        return result;
      }, {}));
      daily_data.forEach(function(item, index) {
        item[1].sort((a, b) => b.cases - a.cases);
        item[1].forEach(function(it, i) {
          it.rank = i;
          if (index === 0) {
            it.cases_new = it.cases;
          } else {
            const last = daily_data[index - 1][1].filter(p => p.country === it.country);
            it.cases_new = last.length? it.cases - last[0].cases : it.cases;
          }
        });
      });
      
      let x = d3.scaleLinear()
        .range([margin.left, width - margin.right - 80]);
      let y = d3.scaleLinear()
        .domain([display_n, 0])
        .range([height - margin.bottom, margin.top + bar_padding]);
      let x_axis = d3.axisTop()
        .scale(x)
        .tickFormat(d => d3.format(",")(d));
      svg.append("g")
        .attr("id", "x_axis")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .call(x_axis);
      
      const bar_data = daily_data[day_index][1].slice(0, display_n);
      svg.append("g")
        .attr("transform", `translate(${margin.left}, ${bar_padding})`)
        .selectAll("rect")
        .enter()
        .append("rect")
        .attr("class", "bar");
      
      let day_text = svg.append("text")
        .attr("x", width - margin.right)
        .attr("y", height - 20)
        .style("text-anchor", "end")
        .html(daily_data[day_index][0]);
      
      let ticker = d3.interval(e => {
        
        const today_data = daily_data[day_index][1].slice(0, display_n);
        
        x.domain([0, d3.max(today_data, d => d.cases)]);
        svg.select("#x_axis")
          .transition()
          .duration(duration)
          .ease(d3.easeLinear)
          .call(x_axis);
        
        let bars = svg.selectAll(".bar").data(today_data, d => d.country);
        bars.enter()
          .append("rect")
          .attr("x", x(0) + margin.left)
          .attr("y", d => y(display_n))
          .attr("width", d => x(d.cases) - x(0))
          .attr("height", y(1) - y(0) - bar_padding)
          .attr("class", d => "bar " + d.country)
          .style("fill", d => d.color)
          .transition()
          .duration(duration)
          .ease(d3.easeLinear)
          .attr("y", d => y(d.rank));
        bars.transition()
          .duration(duration)
          .ease(d3.easeLinear)
          .attr("width", d => x(d.cases) - x(0))
          .attr("y", d => y(d.rank));
        bars.exit()
          .transition()
          .duration(duration)
          .ease(d3.easeLinear)
          .attr("width", d => x(d.cases) - x(0))
          .attr("y", d => y(display_n + 1))
          .remove();
        
        let state_labels = svg.selectAll(".state_label").data(today_data, d => d.country);
        state_labels.enter()
          .append("text")
          .attr("class", "state_label")
          .attr("x", d => x(d.cases) - 10)
          .attr("y", d => y(display_n + 1) + (y(1) - y(0)) / 2 + bar_padding)
          .style("text-anchor", "end")
          .text(d => d.country)
          .transition()
          .duration(duration)
          .ease(d3.easeLinear)
          .attr("y", d => y(d.rank) + (y(1) - y(0)) / 2 + bar_padding);
        state_labels.transition()
          .duration(duration)
          .ease(d3.easeLinear)
          .attr("x", d => x(d.cases) - 10)
          .attr("y", d => y(d.rank) + (y(1) - y(0)) / 2 + bar_padding);
        state_labels.exit()
          .transition()
          .duration(duration)
          .ease(d3.easeLinear)
          .attr("x", d => x(d.cases) - 10)
          .attr("y", d => y(display_n + 1) + (y(1) - y(0)) / 2 + bar_padding)
          .remove();
        
        let cases_labels = svg.selectAll(".cases_label").data(today_data);
        cases_labels.enter()
          .append("text")
          .attr("class", "cases_label")
          .attr("x", d => x(d.cases) + 25)
          .attr("y", d => y(display_n) + (y(1) - y(0)) / 2 + bar_padding)
          .text(d => d3.format(",")(d.cases))
          .transition()
          .duration(duration)
          .ease(d3.easeLinear)
          .attr("y", d => y(d.rank) + (y(1) - y(0)) / 2 + bar_padding);
        cases_labels.transition()
          .duration(duration)
          .ease(d3.easeLinear)
          .attr("x", d => x(d.cases) + 25)
          .attr("y", d => y(d.rank) + (y(1) - y(0)) / 2 + bar_padding)
          .tween("text", function(d) {
            let i = d3.interpolateRound(d.cases - d.cases_new, d.cases);
            return function(t) {
              this.textContent = d3.format(',')(i(t));
            };
          });
        cases_labels.exit()
          .transition()
          .duration(duration)
          .ease(d3.easeLinear)
          .attr("x", d => x(d.cases) + 25)
          .attr("y", d => y(display_n) + (y(1) - y(0)) / 2 + bar_padding)
          .remove();
        
        day_text.html(daily_data[day_index][0]);
        
        day_index++;
        if (day_index === daily_data.length) ticker.stop();
      }, duration);
    });
