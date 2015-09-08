/**
 * FCEMap.js: Javascript to draw the FCE Map
 */

function createFCEMap() {

	d3.csv("../data/FCE-data.csv", function(data) {

		//Create SVG element
		var svg1 = d3.select("#FCEMap")
			.append("svg")
			.attr("width", w + margin.left + margin.right)
			.attr("height", h + margin.top + margin.bottom)
			.append("g")
	    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


		var color = d3.scale.threshold()
			color.domain([0,6,9,12,13,100]);	
			color.range(["#fff","#f7941e","#fcd7aa","#a6e0dd","#39bbb3","#6aa07c"]);		

		//Load in GeoJSON data
		d3.json("../data/world-countries.json", function(json) {
			// mapD = json;
			// console.log(mapD);
					for (var i = 0; i < data.length; i++) {
							
						//Grab country code
						var eduCountry = data[i].Code;
							
						//Grab data value, and convert from string to float
						if ((data[i].Duration_compulsory_education != 'a' || data[i].Duration_compulsory_education != 'm') && !isNaN(data[i].Duration_compulsory_education) ) {
							var eduValue = parseFloat(data[i].Duration_compulsory_education);
						} else {
							var eduValue = -99;
						}
						
						//Find the corresponding country inside the GeoJSON
						for (var j = 0; j < json.features.length; j++) {
							
							var mapCountry = json.features[j].id;

							 // console.log(eduCountry)
							 // console.log(mapCountry);
					
							if (eduCountry == mapCountry) {
							
								//Copy the data value into the JSON
								json.features[j].properties.value = eduValue;
									
								//Stop looking through the JSON
								break;
									
							}
						}
		
					}

					
			//Bind data and create one path per GeoJSON feature
			// initial selection
			var paths = svg1.selectAll('.countryPaths')
				.data(json.features);
				
			// entering new stuff
			var pathEnter = paths.enter().append("g")
				.attr("class", "countryPaths");

			// append paths and set things that will always be the same
			pathEnter.append('path')
				.attr("d", path)
				.style("stroke", "#4d4d4d")
				.style("stroke-width", "1px")
				.style("fill", function(d) {
					//Get data value
					var value = d.properties.value;	
					if (typeof value !== "undefined") {
						//If value exists…
						return color(value);
					} else {
					 //If value is undefined…
						return "#fff";
					}
				}) //Important, allows addition of .on to work

				// set up on mouseover events
				.on("mouseover", function(d) {

					// background all that aren't selected
		  			paths.selectAll('path')
		  				.transition()
					  	.duration(250)
		  				.style("stroke-width", function(j) {
		  					if (j == d) {
		  						return "3px";
		  					} else {
		  						return "0px";
		  					}
						})
						.style("fill-opacity", function(j) {
		  					if (j == d) {
		  						return "1";
		  					} else {
		  						return "0.5";
		  					}
						});

					div.transition()
					  .duration(250)
					  .style("opacity", 1);

					// conditional statements for text
					if (typeof d.properties.value !== "undefined" && d.properties.value != -99) {
						var text = "Years of compulsory education: " + d.properties.value;
					} else {
						var text = "No data for this country.";
					}
					  
					div.html(
					  '<h4 class="text-left">' + d.properties.name + '</h4>' +
					  '<p class="text-left">' + text + '</p>'
					  )  
					  .style("left", (d3.event.pageX + 25) + "px")     //play around with these to get spacing better
					  .style("top", (d3.event.pageY - 55) + "px");
				})

				.on("mousemove", function(d) {
					div.style("left", (d3.event.pageX + 25) + "px")
					   .style("top", (d3.event.pageY - 55) + "px");
					  
				})
				
				.on("mouseout", function() {
					paths.selectAll('path')
		  				.transition()
					  	.duration(250)
						.style("stroke-width", "1px")
						.style("fill-opacity", 1);

					div.transition()
				     .duration(250)
				     .style("opacity", 1e-6);
				});

		   		//End to mouseover code
	 
		}); //End of D3.json geojson function + data bind
	}); //End to D3.json Rates function



}

