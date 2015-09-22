/**
 * FCEMap.js: Javascript to draw the FCE Map
 */

function createFCEMap() {

	d3.csv("../data/FCE-data.csv", function(data) {

		//Create SVG element
		var svg1 = d3.select("#FCEMap")
			.append("svg")
			.attr("class", "svg-loading")
			.attr("width", w + margin.left + margin.right)
			.attr("height", h + margin.top + margin.bottom)
			.append("g")
	    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


		var color = d3.scale.threshold()
			color.domain([0,1,7,10,13]);	
			color.range(["#fff","#ef4136","#f7941e","#f4d790","#73cfc9","#3b6a8f"]);		

		//Load in GeoJSON data
		d3.json("../data/world-countries.json", function(json) {

					for (var i = 0; i < data.length; i++) {
							
						//Grab country code
						var eduCountry = data[i].Code;

						//Grab data on Duration_compulsory_education, and convert from string to float
						if ((data[i].Duration_compulsory_education != 'a' || data[i].Duration_compulsory_education != 'm') && !isNaN(data[i].Duration_compulsory_education) ) {
							var Duration_compulsory_education = parseFloat(data[i].Duration_compulsory_education);
						} else {
							var Duration_compulsory_education = -99;
						}

						//Grab data on Duration free education, and convert from string to float
						if ((data[i].Duration_free_education != 'a' || data[i].Duration_free_education != 'm') && !isNaN(data[i].Duration_free_education) ) {
							var Duration_free_education = parseFloat(data[i].Duration_free_education);
						} else {
							var Duration_free_education = -99;
						}

						//Find the corresponding country inside the GeoJSON
						for (var j = 0; j < json.features.length; j++) {
							
							var mapCountry = json.features[j].properties.adm0_a3;
					
							if (eduCountry == mapCountry) {
							
								//Copy the data values into the JSON
								json.features[j].properties.Duration_compulsory_education = Duration_compulsory_education;
								json.features[j].properties.Duration_free_education = Duration_free_education;
									
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
					var value = d.properties.Duration_compulsory_education;	
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
		  						return "2px";
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

					if (d3.event.pageX >= w/2) {
						var div = divTooltipRight;
						var left = -150;
					} else {
						var div = divTooltipLeft;
						var left = 25;
					}

					div.transition()
					  .duration(250)
					  .style("opacity", 1);

					// conditional statements for text
					if (typeof d.properties.Duration_compulsory_education !== "undefined" && d.properties.Duration_compulsory_education != -99) {
						var DCE_text = "Years of compulsory education: " + d.properties.Duration_compulsory_education;
					} else {
						var DCE_text = "No duration data on compulsory education.";
					}

					if (typeof d.properties.Duration_free_education !== "undefined" && d.properties.Duration_free_education != -99) {
						var DFE_text = "Years of free education: " + d.properties.Duration_free_education;
					} else {
						var DFE_text = "No duration data on free education.";
					}
					  
					div.html(
					  '<p class="tooltip-title">' + d.properties.name + '</p>' +
					  '<p class="tooltip-text">' + DCE_text + '</p>' 
					  )  
					  .style("left", (d3.event.pageX + left) + "px")     //play around with these to get spacing better
					  .style("top", (d3.event.pageY - 55) + "px");
				})

				.on("mousemove", function(d) {
					if (d3.event.pageX >= w/2) {
						var div = divTooltipRight;
						var left = -150;
					} else {
						var div = divTooltipLeft;
						var left = 25;
					}

					div.style("left", (d3.event.pageX + left) + "px")
					   .style("top", (d3.event.pageY - 55) + "px");
					  
				})
				
				.on("mouseout", function() {
					paths.selectAll('path')
		  				.transition()
					  	.duration(250)
						.style("stroke-width", "1px")
						.style("fill-opacity", 1);

					divTooltipLeft.transition()
				     .duration(250)
				     .style("opacity", 1e-6);
					divTooltipRight.transition()
				     .duration(250)
				     .style("opacity", 1e-6);
				});

		   		//End to mouseover code
	 
		}); //End of D3.json geojson function + data bind
	}); //End to D3.json Rates function



}

