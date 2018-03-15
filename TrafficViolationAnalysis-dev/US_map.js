function map() {
	
	var category;
	
	if (document.getElementById('Category0').checked) 
		category= document.getElementById('Category0').value;
	if (document.getElementById('Category1').checked) 
		category= document.getElementById('Category1').value;
	if (document.getElementById('Category2').checked) 
		category= document.getElementById('Category2').value;
	if (document.getElementById('Category3').checked) 
		category= document.getElementById('Category3').value;
	if (document.getElementById('Category4').checked) 
		category= document.getElementById('Category4').value;
	if (document.getElementById('Category5').checked) 
		category= document.getElementById('Category5').value;
	if (document.getElementById('Category6').checked) 
		category= document.getElementById('Category6').value;
	console.log(category);
	
	var width = 1000, height = 600;
	var margin = {top: 20, right: 20, bottom: 30, left: 40};
	var w = width - margin.right - margin.left,
		h = height - margin.top - margin.bottom;

	d3.select("#map").select("svg").remove();
	var s1 = d3.select("#map")
				.append("svg")
				.attr("width", width )
				.attr("height", height)
				.append("g");

	var projection = d3.geoAlbersUsa()
                       .translate([w/2, h/2]);
	
	var path = d3.geoPath()
				  .projection(projection);
	
	var div = d3.select("#map").append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);
	
	d3.csv("Result/State_Condition.csv", function(data) {
		
	var min = d3.min(data, function(d) { 
					if(category == "Overall")
						return d.Overall;
					else if(category == "Alcohol")
						return d.Alcohol;
					else if(category == "Belts")
						return d.Belts;
					else if(category == "Commercial_License")
						return d.Commercial_License;
					else if(category == "Personal_Injury")
						return d.Personal_Injury;
					else if(category == "Property_Damage")
						return d.Property_Damage;
					else if(category == "Fatal")
						return d.Fatal;
					
				});
		
	var max = d3.max(data, function(d) { 
					if(category == "Overall") 
						return d.Overall;
					if(category == "Alcohol")
						return d.Alcohol;
					else if(category == "Belts")
						return d.Belts;
					else if(category == "Commercial_License")
						return d.Commercial_License;
					else if(category == "Personal_Injury")
						return d.Personal_Injury;
					else if(category == "Property_Damage")
						return d.Property_Damage;
					else if(category == "Fatal")
						return d.Fatal;
				});
		
	var color1 = d3.scaleLinear()
   	.range([ "#b3ffb3", "#4d6600"])
				.domain([ min, 10000]);
	
	var color2 = d3.scaleLinear()
   	.range(["#ff9999", "#cc0000"])
				.domain([10001, 1000000]);
		
	var color = d3.scaleLinear()
   	.range([  "#b3ffb3", "#cc0000"])
				.domain([ min, max]);
		
	d3.json("us-states.json", function(json) {

		for (var i = 0; i < data.length; i++) {

            //Grab state name
            var dataState = data[i].State;

            //Grab data value, and convert from string to float
            		if(category == "Overall")
						var dataValue = +(data[i].Overall);
					else if(category == "Alcohol")
						var dataValue = +(data[i].Alcohol);
					else if(category == "Belts")
						var dataValue = +(data[i].Belts);
					else if(category == "Commercial_License")
						var dataValue = +(data[i].Commercial_License);
					else if(category == "Personal_Injury")
						var dataValue = +(data[i].Personal_Injury);
					else if(category == "Property_Damage")
						var dataValue = +(data[i].Property_Damage);
					else if(category == "Fatal")
						var dataValue = +(data[i].Fatal);
			

            for (var j = 0; j < json.features.length; j++) {

            var jsonState = json.features[j].properties.NAME;
			//console.log(jsonState + " " + dataState + " " + dataValue);
            if (dataState == jsonState) {

                
                json.features[j].properties.value = dataValue;
				console.log(json.features[j].properties.value + " " + jsonState);
                //Stop looking through the JSON
                break;
			}
        }
    }
		
        s1.selectAll("path")
           .data(json.features)
           .enter()
           .append("path")
           .attr("d", path)
			.style("fill", function(d) {
                                //Get data value
                                var value = d.properties.value;
							if(value <=10000 && category == "Overall")
									return color1(value);
						else if(value >10001 && category == "Overall")
								return color2(value);
						else if(value != 0 && category != "Overall")
									return color(value);
								else {
                                        //If value is undefined…
                                        return "#ccc";
                                }
		})
		
		.on('mouseover', function(d) {
			div.transition()
				.duration(200)
				.style("opacity", .9)
			div.html(d.properties.NAME +"<br>"+ 
					 "Category : " + category + "<br>" +
					 "Count : " + d.properties.value + "<br/>")
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY) - 40 + "px");;
		})
		
		.on('mouseout', function(d) {
				d3.select(this)
				div.transition()
					.duration(500)
					.style("opacity", 0);
		  });

	}); //json
		
		s1.append("text")                               
          .attr("x", 300)     
          .attr("y", 25)
		  .text("Total Count of tickets issued by state for violation:  " + category)
          .attr("fill", "blue")
		  .attr("font-size",20);
	}); //csv
} //map