/**
 * OOSCRatesMap.js: Javascript to draw the OOSC map
 */


//set up variables
var w = 1000;
var h = 600;

//Place this div function here, so that the .on mouseover function can reference it later
var div = d3.select("body").append("div") 
	.attr("class", "tooltip")
	.style("opacity", 1e-6);

//Define projection
var projection = d3.geo.equirectangular()
	.scale((w + 1) / 2 / Math.PI)
	.translate([w / 2, h / 2])
	.precision(.1);

// define comma format
var commaFormat = d3.format(",.0f");

//Define path generator
var path = d3.geo.path()
    .projection(projection);

//Create SVG element
var svg1 = d3.select("body")
	.append("svg")
	.attr("width", w)
	.attr("height", h);

var color_ROFST_1_CP = d3.scale.threshold()
	color_ROFST_1_CP.domain([9.9,19.9,29.9,100]);	
	color_ROFST_1_CP.range(["#33B874","#ABE2C6","#959CC7","#5561A6"]);

var color_ROFST_2_CP = d3.scale.threshold()
	color_ROFST_2_CP.domain([9.9,19.9,29.9,100]);	
	color_ROFST_2_CP.range(["#33B874","#ABE2C6","#959CC7","#5561A6"]);

// global variables for holding data
var apidata;
var geojson;
var paths;
var activeLayer;

// initialize by running functions in order
getApiData();


// function to get API data
function getApiData() {
	$.getJSON("http://www.uis.unesco.org/das/api/countries/?code=ALL&category=EDULIT_DS&indicators=ROFST_1_CP,ROFST_2_CP,OFST_1_F_CP,OFST_1_M_CP,OFST_2_F_CP,OFST_2_M_CP&fromyear=2009&toyear=2020&mostrecent=true&fullprecision=false&callback=?", function (rate) {
		apidata = rate;
		// run attach data to geojson
		attachData();
	});
}

// function to attach datasets to geojson
function attachData() {
	//Load in GeoJSON data
	d3.json("world-countries.json", function(json) {
		geojson = json;
		// add ROFST_1_CP to geojson
		for (var i = 0; i < apidata.Indicators.length; i++) {
			//Grab country code
			var apidataCountry = apidata.Indicators[i].Country;	
			//Grab data value, and convert from string to float
			var value = parseFloat(apidata.Indicators[i].Value);
			//Find the corresponding country inside the GeoJSON
			for (var j = 0; j < geojson.features.length; j++) {	
				var mapCountry = geojson.features[j].id;
				if (apidataCountry == mapCountry) {
					// drop the indicator into the proper spot in the geojson
					if (apidata.Indicators[i].Indicator == 'ROFST_1_CP') {
						geojson.features[j].properties.rate_ROFST_1_CP_Value = value;
						geojson.features[j].properties.rate_ROFST_1_CP_Year = apidata.Indicators[i].Year;
					} else if (apidata.Indicators[i].Indicator == 'ROFST_2_CP') {
						geojson.features[j].properties.rate_ROFST_2_CP_Value = value;
						geojson.features[j].properties.rate_ROFST_2_CP_Year = apidata.Indicators[i].Year;
					} else if (apidata.Indicators[i].Indicator == 'OFST_1_F_CP') {
						geojson.features[j].properties.OFST_1_F_CP_Value = value;
					} else if (apidata.Indicators[i].Indicator == 'OFST_1_M_CP')  {
						geojson.features[j].properties.OFST_1_M_CP_Value = value;
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
	paths = svg1.selectAll('.countryPaths')
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
			div.style("left", (d3.event.pageX + 18) + "px")
			   .style("top", (d3.event.pageY - 60) + "px");
			  
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
					return "#f7f7f7";
				}
			} else {
				var value = d.properties.rate_ROFST_2_CP_Value;
				if (value) {
					return color_ROFST_2_CP(value);
				} else {
					return "#f7f7f7";
				}
			}
		})

		// set up on mouseover events
		.on("mouseover", function(d) {
			// only act on mouseover if data are available
			if ((activeLayer == 'ROFST_1_CP' && d.properties.rate_ROFST_1_CP_Value) || (activeLayer == 'ROFST_2_CP' && d.properties.rate_ROFST_2_CP_Value)) {
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
					})

				div.transition()
				  .duration(250)
				  .style("opacity", 1);

				if (activeLayer == 'ROFST_1_CP') {
					if (d.properties.rate_ROFST_1_CP_Value) {
						var girls = commaFormat(d.properties.OFST_1_F_CP_Value) + " primary school age girls out of school.";
						var boys = commaFormat(d.properties.OFST_1_M_CP_Value) + " primary school age boys out of school.";
						var year = d.properties.rate_ROFST_1_CP_Year;
					} else {
						var girls = "No data for out of school children of primary school age.";
						var boys = '';
						var year = '';
					}	
				} else {
					if (d.properties.rate_ROFST_2_CP_Value) {
						var girls = commaFormat(d.properties.OFST_2_F_CP_Value) + " lower secondary school age girls out of school.";
						var boys = commaFormat(d.properties.OFST_2_M_CP_Value) + " lower secondary school age age boys out of school.";
						var year = d.properties.rate_ROFST_2_CP_Year;
					} else {
						var girls = "No data for out of school adolescents of lower secondary school age.";
						var boys = '';
						var year = '';
					}
					
				}
				  
				div.html(
				  '<h4 class="text-left">' + d.properties.name + '<br />' + year + '</h4>' +
				  '<p class="text-left">' + girls + '</p>' +
				  '<p class="text-left">' + boys + '</p>'
				  )  
				  .style("left", (d3.event.pageX + 18) + "px")     //play around with these to get spacing better
				  .style("top", (d3.event.pageY - 60) + "px");

			}
			
		});

   		//End to mouseover code

}

