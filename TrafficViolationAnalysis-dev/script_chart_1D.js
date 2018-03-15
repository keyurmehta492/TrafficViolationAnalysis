function chart_1D() {
	
	
	var chart_type = document.getElementById('chart_type').value;
		console.log(chart_type);
	
	if(chart_type == "Time_wise"){
        daily_time();
	}

	else if(chart_type == "Gender_wise"){
        gender_violation();
	}

	else if(chart_type == "Top_Reason"){
        Top_Reason();
	}

	
	
} //chart_1D

function daily_time() {

	
	var width = 1000, height = 500;
		var margin = {top: 20, right: 20, bottom: 30, left: 40};
		var w = width - margin.right - margin.left,
			h = height - margin.top - margin.bottom;
	d3.select("#chart").select("svg").remove();
	var s1 = d3.select("#chart").append("svg")
				.attr("width", width )
				.attr("height", height)
				.append("g");
	
	var pTime = d3.timeParse("%H:%M");
	var HTime = d3.timeFormat("%H:%M");
	
	d3.csv("Result/Daily_Time.csv",function(error, data) {
		
		data.forEach(function(d)  {
				d.Time1 = pTime(d.Time);
				d.Count =+d.Count;
				return d;
			});
		
		console.log(data);
		
	var x1Scale = d3.scaleTime()
					.domain(d3.extent(data, function(d) { return d.Time1; }))
					.range([0,(w - margin.right) ]);
					
		
	var y1Scale = d3.scaleLinear()
					.domain(d3.extent(data, function(d) { return d.Count; }))
					.rangeRound([h,(0 + margin.bottom)]);
	
	var xaxis = d3.axisBottom()	  
					  .scale(x1Scale)
					  .tickFormat(function(d) {return HTime(d);}); 
					 
	var y1axis = d3.axisLeft()	  
					 .scale(y1Scale)
					 .tickFormat(function (d) { return d;});
	
	var line = d3.line()
				.x(function(d) { return x1Scale(d.Time1); })
				.y(function(d) { return y1Scale(d.Count); });
	
	s1.append("g")
			.append("path")
			.data([data])
			.attr("class", "line")
			.attr("stroke", "steelblue")
			.attr("d", line)
			.attr("transform","translate(" + margin.left + ", " + margin.top + ")")
			.attr("fill","none");
		
	s1.append("g")
		   .attr("transform","translate(" + margin.left + ", " + margin.top + ")")
		   .call(y1axis)
		   .attr("class", "y1Axis");
	
	s1.append("g")
		   .attr("transform","translate(" + margin.left + " , " + (h + margin.top) +")")
		   .call(xaxis);
	
	s1.append("text")                               
          .attr("x", 400)     
          .attr("y", 25)
		  .text("Count of tickets issued by time ")
          .attr("fill", "blue")
		  .attr("font-size",20);
		
	s1.append("text")       
          .attr("transform",
            "translate(" + (width/2 + 10) + " ," + 
                           (h + 50) + ")")
		.style("text-anchor", "middle")
		.text("Time (24 Hrs)")
     	  .attr("fill","blue"); 
		  
		s1.append("text")       
          .attr("transform", "rotate(-90)")
			.attr("y", margin.left)
			.attr("x",(height / 2))
			.attr("dy", "1em")
			.style("text-anchor", "middle")
			.text("Count")
			.attr("fill","blue");      
		
	}); //csv
		 
}//daily_time

function gender_violation() {
	var condition;
	
	if (document.getElementById('Condition1').checked) 
		condition= document.getElementById('Condition1').value;
	if (document.getElementById('Condition2').checked) 
		condition= document.getElementById('Condition2').value;
	if (document.getElementById('Condition3').checked) 
		condition= document.getElementById('Condition3').value;
	if (document.getElementById('Condition4').checked) 
		condition= document.getElementById('Condition4').value;
	console.log(condition);
	
	var width = 1000, height = 500;
		var margin = {top: 20, right: 20, bottom: 30, left: 40};
		var w = width - margin.right - margin.left,
			h = height - margin.top - margin.bottom;
	
	d3.select("#chart").select("svg").remove();
	
	var s1 = d3.select("#chart").append("svg")
				.attr("width", width )
				.attr("height", height)
				.append("g");
	
	d3.csv("Result/Gender_condition.csv" ,
	function(d)  {
				d.Category = d.Category;
				d.F = +d.F;
				d.M = +d.M;
				d.U = +d.U;
				return d;
			},	   function(error, data) {
	
	console.log(data);
		
	
	var color = d3.scaleOrdinal(d3.schemeCategory20);
	
	var r = 300;
		var p = Math.PI * 2;
		
		var arc = d3.arc()
				.innerRadius(0)
				.outerRadius(r-150)
			
		var pie = d3.pie()
					.value( function (d) { 
						if (condition == "HAZMAT")
							return d.HAZMAT; 
						if (condition == "Belt")
							return d.Belt; 
						if (condition == "Commercial License")
							return d.Commercial_License; 
						if (condition == "Alcohol")
							return d.Alcohol; 
					})
					.sort(null);					
					
		var arcs = s1.selectAll("g.arc")
					.data(pie(data))
					.enter()
					.append("g")
					.attr("transform","translate(500,250)");
		
		  var tooltip = d3.select("#chart").append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);
				
		arcs.append("path")
		  .attr("d", arc)
		  .attr("fill", function(d, i) {
					if(i==1)
						return "#3366ff";
					if(i==0)
						return "#ff33cc";
					if(i==2)
						return "#999966";
			    	//return color(i);
		});	
		
		console.log(condition)
				
		arcs.append("text")
			.attr("transform", function(d) { 
					var c = arc.centroid(d),
					x = c[0],
					y = c[1],
            		root = Math.sqrt(x*x + y*y);
			var x_cor = (x/root * 200), y_cor = (y/root * 200);
			console.log(x + " "+y+ " "+ root + " " + x_cor + ""+y_cor);
				return "translate(" + x_cor +  ',' + y_cor  +  ")"; 
		     })
			.attr("text-anchor", "middle") 
			.style("fill", "Red")
			.style("font", "bold 12px Arial")
			.text(function(d,i) { if (condition == "HAZMAT") {
							return data[i].HAZMAT;}
						if (condition == "Belt")
							return data[i].Belt; 
						if (condition == "Commercial License")
							return data[i].Commercial_License; 
						if (condition == "Alcohol")
							return data[i].Alcohol;  });
		
		s1.append("text")                               
          .attr("x", 400)     
          .attr("y", 40)
		  .text("Ticket count by Gender in " + condition )
          .attr("fill", "blue")
		  .attr("font-size",20);
		
		s1.append("circle")                               
          .attr("cx", 780)     
          .attr("cy", 70)
		  .attr("r",5)
          .attr("fill", "#3366ff");
         
        s1.append("text")       
          .attr("x", 790)       
          .attr("y", 75)        
          .text("Male")
		  .attr("fill","#3366ff");      
		  
		s1.append("circle")                               
          .attr("cx", 780)     
          .attr("cy", 90)
		  .attr("r",5)
          .attr("fill", "#ff33cc");
         
        s1.append("text")       
          .attr("x", 790)       
          .attr("y", 95)        
          .text("Female")
		  .attr("fill","#ff33cc");
		  
		s1.append("circle")                               
          .attr("cx", 780)     
          .attr("cy", 110)
		  .attr("r",5)
          .attr("fill", "#999966");
         
        s1.append("text")       
          .attr("x", 790)       
          .attr("y", 115)        
          .text("Undefined")
		  .attr("fill","#999966");
		
});

} //Gender_violation

function Top_Reason() {
	var width = 1000, height = 500;
		var margin = {top: 20, right: 20, bottom: 30, left: 40};
		var w = width - margin.right - margin.left,
			h = height - margin.top - margin.bottom;
	
	d3.select("#chart").select("svg").remove();
	
	var s1 = d3.select("#chart").append("svg")
				.attr("width", width )
				.attr("height", height)
				.append("g")
				.attr("transform","translate(" + w/2 + "," + h/2 + ")");
	
	d3.csv("Result/Top_Reason.csv" ,
	function(d)  {
			d.reason = d.reason;
			d.count = +d.count;
		return d;
		},	
	function(error, data) {
		
		console.log(data);
		
		var min = d3.min(data, function(d) {return d.Count});
		var max = d3.max(data, function(d) {return d.Count});
		console.log(min +","+ max);
		
		var color = d3.scaleLinear()
					.domain([min,max])
					.range(["#66ff66","#0066cc"]);
		
		var radiusscale = d3.scaleSqrt()
							.domain([min,max])
							.range([20, 80]);
							
		var force = d3.forceSimulation()
					  .force("x",d3.forceX(0).strength(0.1))
					  .force("y",d3.forceY(0).strength(0.1))
					  .force("colision",d3.forceCollide(function(d) 
					  {return radiusscale(d.Count)+3}
					  ));
		var tooltip = d3.select("#chart").append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);
		
		var circles = s1.selectAll("circles")
						.data(data)
						.enter()
						.append("circle")
						.attr("r",function(d) {return radiusscale(d.Count)})
						.attr("fill", function(d) {return color(d.Count)})
						.on('mouseover', function(d) {
							
							tooltip.transition()
								.duration(200)
								.style("opacity", .9);
							tooltip.html("Reason: " + "<br/>" + d.Reason)
								.style("left", (d3.event.pageX) + "px")
								.style("top", (d3.event.pageY) - 40 + "px");
						})
						.on('mouseout', function(d) {
							
							tooltip.transition()
								.duration(500)
								.style("opacity", 0);
		  });
			
		var labels = s1.selectAll("label")
						.data(data)
						.enter()
						.append("text")
						.attr("text-anchor", "middle")
						.attr("fill", "black")
						.attr("font-size", "12px")
						.text(function(d) {
							return d.Count;
						});
				
		force.nodes(data)
			 .on("tick",position);
						
		function position() {
			circles.attr("cx",function(d) {return d.x})
				   .attr("cy",function(d) {return d.y});
				   
			labels.attr("x", function(d) {return d.x;})
				  .attr("y", function(d) {return d.y;});
		}
		
		s1.append("text")                               
          .attr("x", 250)     
          .attr("y", 25)
		  .text("Ticket count by Top Reason" )
          .attr("fill", "blue")
		  .attr("font-size",20);
	});
	
} // Top_Reason
