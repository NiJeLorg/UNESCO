
// var rofstCP; //Global Variable for data
// var mapD; //Global Variable for data

// prototype function to fake moving moused over obejcts to the front
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
  	this.parentNode.appendChild(this);
  });
};

//Width and height
var w = 1000;
var h = 600;

// for mouseover later on
//Place this div function here, so that the .on mouseover function can reference it later
var div = d3.select("body").append("div") 
	.attr("class", "tooltip")
	.style("opacity", 1e-6);

$.getJSON("http://www.uis.unesco.org/das/api/countries/?code=ALL&category=EDULIT_DS&indicators=ROFST_1_CP&fromyear=2009&toyear=2015&mostrecent=true&fullprecision=false&callback=?", function (rate) {
	// rofst = rate;
	//console.log(rate);	

	//Define projection
	/*
	var projection = d3.geo.mercator()
	    .scale((w + 1) / 2 / Math.PI)
	    .translate([w / 2, h / 2])
	    .precision(.1);
	*/
	var projection = d3.geo.equirectangular()
		.scale((w + 1) / 2 / Math.PI)
		.translate([w / 2, h / 2])
		.precision(.1);

	//Define path generator
	var path = d3.geo.path()
	    .projection(projection);

	//Create SVG element
	var svg = d3.select("body")
		.append("svg")
		.attr("width", w)
		.attr("height", h);


	var color = d3.scale.threshold()
		color.domain([9.9,19.9,29.9,100]);	
		// .range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"]);
		color.range(["#33B874","#ABE2C6","#959CC7","#5561A6"]);
	//Set input domain for color scale
		
		// ([
		// d3.min(rate.Indicators, function(d,i) { return d.Value; }), 
		// d3.max(rate.Indicators, function(d,i) { return d.Value; })
		// ]);
		

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
			.style("stroke", "#4d4d4d")
			.style("stroke-width", "1px")
			.style("fill", function(d) {
				//Get data value
				// console.log(d)
				var value = d.properties.value;					   		
				if (value) {
					//If value exists…
					return color(value);
				} else {
				 //If value is undefined…
					return "#f7f7f7";
				}
			}) //Important, allows addition of .on to work

			// set up on mouseover events
			.on("mouseover", function(d) {
				// console.log(d);
				var sel = d3.select(this);
      			sel.moveToFront();
      			sel.style("stroke-width", "3px");

				div.transition()
				  .duration(250)
				  .style("opacity", 1);
				  
				div.html(
				  '<h4 class="text-left">' + d.properties.name + '</h4>' +
				  '<p class="text-left">' + "Rate of children out of school: " + d.properties.value + "%" +'</p>'
				  )  
				  .style("left", (d3.event.pageX + 18) + "px")     //play around with these to get spacing better
				  .style("top", (d3.event.pageY - 60) + "px");
			})

			.on("mousemove", function(d) {
				div.style("left", (d3.event.pageX + 18) + "px")
				   .style("top", (d3.event.pageY - 60) + "px");
				  
			})
			
			.on("mouseout", function() {
				d3.select(this)
					.style("stroke-width", function(d) { return "1px"; });

				div.transition()
			     .duration(250)
			     .style("opacity", 1e-6);
			});

	   		//End to mouseover code
 
	}); //End of D3.json geojson function + data bind
}); //End to D3.json Rates function
