/**
 * OOSCRatesMap.js: Javascript to draw the OOSC map
 */

//Create SVG element
var svg2 = d3.select("#OOSCRatesMap")
	.append("svg")
	.attr("class", "svg-loading")
	.attr("width", w + margin.left + margin.right)
	.attr("height", h + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var color_ROFST_1_CP = d3.scale.threshold()
	color_ROFST_1_CP.domain([9.9,19.9,29.9,100]);	
	color_ROFST_1_CP.range(["#d0d8f7","#a2ce5b","#00a651","#262262"]);

var color_ROFST_2_CP = d3.scale.threshold()
	color_ROFST_2_CP.domain([9.9,19.9,29.9,100]);	
	color_ROFST_2_CP.range(["#d0d8f7","#a2ce5b","#00a651","#262262"]);

// global variables for holding data
var geojson;
var paths;
var activeLayer;


function createOOSCRatesMap() {

	//Load in GeoJSON data
	d3.json("./data/world-countries.json", function(json) {
		geojson = json;
		// add ROFST_1_CP to geojson
		for (var i = 0; i < apidata.Indicators.length; i++) {
			//Grab country code
			var apidataCountry = apidata.Indicators[i].Country;	
			//Grab data value, and convert from string to float
			var value = parseFloat(apidata.Indicators[i].Value);
			//Find the corresponding country inside the GeoJSON
			for (var j = 0; j < geojson.features.length; j++) {	
				var mapCountry = geojson.features[j].properties.adm0_a3;
				if (apidataCountry == mapCountry) {
					// drop the indicator into the proper spot in the geojson
					if (apidata.Indicators[i].Indicator == 'ROFST_1_CP') {
						geojson.features[j].properties.rate_ROFST_1_CP_Value = value;
						geojson.features[j].properties.rate_ROFST_1_CP_Year = apidata.Indicators[i].Year;
					} else if (apidata.Indicators[i].Indicator == 'ROFST_2_CP') {
						geojson.features[j].properties.rate_ROFST_2_CP_Value = value;
						geojson.features[j].properties.rate_ROFST_2_CP_Year = apidata.Indicators[i].Year;
					} else if (apidata.Indicators[i].Indicator == 'OFST_1_CP') {
						geojson.features[j].properties.OFST_1_CP_Value = value;
					} else if (apidata.Indicators[i].Indicator == 'OFST_1_F_CP') {
						geojson.features[j].properties.OFST_1_F_CP_Value = value;
					} else if (apidata.Indicators[i].Indicator == 'OFST_1_M_CP')  {
						geojson.features[j].properties.OFST_1_M_CP_Value = value;
					} else if (apidata.Indicators[i].Indicator == 'OFST_2_CP') {
						geojson.features[j].properties.OFST_2_CP_Value = value;
					} else if (apidata.Indicators[i].Indicator == 'OFST_2_F_CP') {
						geojson.features[j].properties.OFST_2_F_CP_Value = value;
					} else {
						geojson.features[j].properties.OFST_2_M_CP_Value = value;
					}
					// Stop looking through the JSON
					break;
				}
			}
		}

		// run update function to draw initial map
		activeLayer = 'ROFST_1_CP';
		drawOOSCMap(); 		

	});

}


function drawOOSCMap() {
	// initial selection
	paths = svg2.selectAll('.countryPaths')
		.data(geojson.features);
		
	// entering new stuff
	var pathEnter = paths.enter().append("g")
		.attr("class", "countryPaths");

	// append paths and set things that will always be the same
	pathEnter.append('path')
		.attr("d", path)
		.style("stroke", "#4d4d4d")
		.style("stroke-width", "1px")
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

	// call update function that will change things depending on the layer selected
	pathEnter.call(updateOOSCMap);

	// exiting old stuff
	paths.exit().remove();

}

// function to update map based on chosen layer
function updateOOSCMap() {
	//Bind data and create one path per GeoJSON feature
	paths.select('path')
		.style("fill", function(d) {
			//Get data value
			// console.log(d)
			if (activeLayer == 'ROFST_1_CP') {
				var value = d.properties.rate_ROFST_1_CP_Value;
				if (value) {
					return color_ROFST_1_CP(value);
				} else {
					return "#ffffff";
				}
			} else {
				var value = d.properties.rate_ROFST_2_CP_Value;
				if (value) {
					return color_ROFST_2_CP(value);
				} else {
					return "#ffffff";
				}
			}
		})

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

			if (activeLayer == 'ROFST_1_CP') {
				if (d.properties.rate_ROFST_1_CP_Value) {
					if (d.properties.OFST_1_F_CP_Value && d.properties.OFST_1_M_CP_Value) {
						var girlsPrefix = d3.formatPrefix(d.properties.OFST_1_F_CP_Value);
						var girlsCount = girlsPrefix.scale(d.properties.OFST_1_F_CP_Value).toFixed(1);
						if (girlsPrefix.symbol == 'k') {
							var girlsSymbol = " thousand";
						} else if (girlsPrefix.symbol == 'M') {
							var girlsSymbol = " million";
						} else {
							var girlsSymbol = "";							
						}
						var girls = "Female: " + girlsCount + girlsSymbol;

						var boysPrefix = d3.formatPrefix(d.properties.OFST_1_M_CP_Value);
						var boysCount = boysPrefix.scale(d.properties.OFST_1_M_CP_Value).toFixed(1);
						if (boysPrefix.symbol == 'k') {
							var boysSymbol = " thousand";
						} else if (boysPrefix.symbol == 'M') {
							var boysSymbol = " million";
						} else {
							var boysSymbol = "";							
						}
						var boys = "Male: " + boysCount + boysSymbol;

						var year = " (" + d.properties.rate_ROFST_1_CP_Year + ")";
					} else {
						var girls = "Data showing gender differences not available.";
						var boys = '';
						var year = '';
					}

					if (d.properties.OFST_1_CP_Value) {
						var prefix = d3.formatPrefix(d.properties.OFST_1_CP_Value);
						var count = prefix.scale(d.properties.OFST_1_CP_Value).toFixed(1);
						if (prefix.symbol == 'k') {
							var symbol = " thousand";
						} else if (prefix.symbol == 'M') {
							var symbol = " million";
						} else {
							var symbol = "";							
						}
						var total = "Total: " + count + symbol;
					}

				} else {
						var girls = "No data.";
						var boys = '';
						var year = '';
						var total = '';
				}
			} else {
				if (d.properties.rate_ROFST_2_CP_Value) {
					if (d.properties.OFST_2_F_CP_Value && d.properties.OFST_2_M_CP_Value) {
						var girlsPrefix = d3.formatPrefix(d.properties.OFST_2_F_CP_Value);
						var girlsCount = girlsPrefix.scale(d.properties.OFST_2_F_CP_Value).toFixed(1);
						if (girlsPrefix.symbol == 'k') {
							var girlsSymbol = " thousand";
						} else if (girlsPrefix.symbol == 'M') {
							var girlsSymbol = " million";
						} else {
							var girlsSymbol = "";							
						}
						var girls = "Female: " + girlsCount + girlsSymbol;

						var boysPrefix = d3.formatPrefix(d.properties.OFST_2_M_CP_Value);
						var boysCount = boysPrefix.scale(d.properties.OFST_2_M_CP_Value).toFixed(1);
						if (boysPrefix.symbol == 'k') {
							var boysSymbol = " thousand";
						} else if (boysPrefix.symbol == 'M') {
							var boysSymbol = " million";
						} else {
							var boysSymbol = "";							
						}
						var boys = "Male: " + boysCount + boysSymbol;
						var year = " (" + d.properties.rate_ROFST_2_CP_Year + ")";
					} else {
						var girls = "Data showing gender differences not available.";
						var boys = '';
						var year = '';
					}

					if (d.properties.OFST_2_CP_Value) {
						var prefix = d3.formatPrefix(d.properties.OFST_2_CP_Value);
						var count = prefix.scale(d.properties.OFST_2_CP_Value).toFixed(1);
						if (prefix.symbol == 'k') {
							var symbol = " thousand";
						} else if (prefix.symbol == 'M') {
							var symbol = " million";
						} else {
							var symbol = "";							
						}
						var total = "Total: " + count + symbol;
					}

				} else {
					var girls = "No data for this country.";
					var boys = '';
					var year = '';
					var total = '';
				}
				
			}
			  
			div.html(
			  '<p class="tooltip-title">' + d.properties.name + year +'</p>' +
			  '<p class="tooltip-text">' + girls + '</p>' +
			  '<p class="tooltip-text">' + boys + '</p>' +
			  '<p class="tooltip-text">' + total + '</p>'
			  )  
			  .style("left", (d3.event.pageX + left) + "px")     //play around with these to get spacing better
			  .style("top", (d3.event.pageY - 55) + "px");

			
		});

}


