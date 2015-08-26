
// var rofstCP; //Global Variable for data
// var mapD; //Global Variable for data


//Width and height
var w = 1000;
var h = 1000;

// for mouseover later on
var div = d3.select("body").append("div")
	.attr("class", "tooltip")
	.style("opacity", 1e-6);

console.log(div);

d3.json("ROFST_1_CP.json", function(rate) {
	// rofst = rate;
	// console.log(rate);	

	//Define default path generator
	var projection = d3.geo.mercator()
	    .scale((w + 1) / 2 / Math.PI)
	    .translate([w / 2, h / 2])
	    .precision(.1);

	//Define projection
	var path = d3.geo.path()
	    .projection(projection);

	//Create SVG element
	var svg = d3.select("body")
		.append("svg")
		.attr("width", w)
		.attr("height", h);


	var color = d3.scale.quantize()
		.range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"]);

	//Set input domain for color scale
	color.domain([
		d3.min(rate.Indicators, function(d,i) { return d.Value; }), 
		d3.max(rate.Indicators, function(d,i) { return d.Value; })
	]);


			//Load in GeoJSON data
	d3.json("world-countries.json", function(json) {
		// mapD = json;
		// console.log(mapD);
				for (var i = 0; i < rate.Indicators.length; i++) {
						
					//Grab country code
					var rateCountry = rate.Indicators[i].Country;
						
					//Grab data value, and convert from string to float
					var rateValue = parseFloat(rate.Indicators[i].Value);
				
					//Find the corresponding country inside the GeoJSON
					for (var j = 0; j < json.features.length; j++) {
						
						var mapCountry = json.features[j].id;

						// console.log(rateCountry)
						// console.log(mapCountry);
				
						if (rateCountry == mapCountry) {
						
							//Copy the data value into the JSON
							json.features[j].properties.value = rateValue;
								
							//Stop looking through the JSON
							break;
								
						}
					}
	
				}





				
		//Bind data and create one path per GeoJSON feature
		 svg.selectAll("path")
			.data(json.features)
			.enter()
			.append("path")
			.attr("d", path)
			.style("fill", function(d) {
				//Get data value
				// console.log(d)
				var value = d.properties.value;					   		
				if (value) {
					//If value exists…
					return color(value);
				} else {
				 //If value is undefined…
					return "#ccc";
				}
			})

			// set up on mouseover events
			.on("mouseover", function(d) {
				console.log(d);

				div.transition()
				  .duration(250)
				  .style("opacity", 1);
				  
				div.html(
				  '<h4 class="text-left">' + d.properties.name + '</h4>' +
				  '<p class="text-left">' + d.properties.value +'</p>'
				  )  
				  .style("left", (d3.event.pageX + 18) + "px")     //play around with these to get spacing better
				  .style("top", (d3.event.pageY - 60) + "px");
			})

			.on("mousemove", function(d) {
				div.style("left", (d3.event.pageX + 18) + "px")
				   .style("top", (d3.event.pageY - 60) + "px");
				  
			})

			.on("mouseout", function() {
				div.transition()
			     .duration(250)
			     .style("opacity", 1e-6);
			});


	   		//End to Rollover Code
 
	});
});
