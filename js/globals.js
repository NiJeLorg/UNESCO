/**
 * globals.js: set global vars for all visuals
 */

//width and height
var rl_margin = $('.carousel-inner').width()*0.05;
var margin = {top: 0, right: rl_margin, bottom: 0, left: rl_margin};

var w = $('.carousel-inner').width() - margin.left - margin.right,
    h = (w*0.5) - margin.top - margin.bottom;

// Place this div function here, so that the .on mouseover function can reference it later
var divTooltipLeft = d3.select("body").append("div") 
	.attr("class", "tooltip")
	.style("opacity", 1e-6);

var divTooltipRight = d3.select("body").append("div") 
	.attr("class", "tooltip-right")
	.style("opacity", 1e-6);


var divOnboarding = d3.select("#aidToEDU").append("div") 
	.attr("class", "tooltip-onboard")
	.style("opacity", 1e-6);


// global map projection
var projection = d3.geo.equirectangular()
	.scale((w + 1) / 2 / Math.PI)
	.translate([w / 2, h / 2])
	.precision(.1);

//global path generator
var path = d3.geo.path()
    .projection(projection);

// variable for storing apidata
var apidata;

// globals for lang switching on button click for the svg
var centroids;
var arcs;
var countries;
var clicked;

