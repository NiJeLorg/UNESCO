var originColor = "#ab1d1d";
var destinationColor = "#ab1d1d"; //"#315441";

var noDataCountryColor = "#757575";
var hoverOverCountryColor = "#ff7f0e";
var unselectedCountryColor = "#f5f5f5";
var hoverOverArrow = "#ff6a00";
var countryToEmcIdMap = [];
var emcidToCountryMap = [];
var countryDefinitionMap = [];
var allCountries = [];



var dtYear = 0;
var dtStrtYear = 0;

//Legend colors, Hardcoded, not very pretty, but, done for Patrick, so he can change the color scheme if needed
var legendWidth = 240;
var legendHeight = 45;
var legendBoundaryValues = new Array(0, 100, 1000, 5000, 10000, 50000);

var legendDestinationColors = new Array("#94fff4",
                                        "#21e0cd",
                                        "#0ec4b2",
                                        "#0fa393",
                                        "#147369",
                                        "#14544e");

    //"#e1ede7", "#a1c8b3", "#71ac8c", "#4d8466", "#3a644d", destinationColor);

var legendOriginColors = new Array("#94fff4",
                                   "#21e0cd",
                                   "#0ec4b2",
                                   "#0fa393",
                                   "#147369",
                                   "#14544e");

    //new Array("#eadce2", "#dbc4ce", "#be94a7", "#ab748d", "#a16480", originColor);

var maxArrowWidth = 20;
var minArrowWidth = 0.3;
var w = wdt, h = hdt;

///FANCY BOX - fullscreen functionality
$(document).ready(function () {
    /*
    *  Simple image gallery. Uses default settings
    */

    $('.fancybox').fancybox();

    /*
    *  Different effects
    */

    // Change title type, overlay closing speed
    $(".fancybox-effects-a").fancybox({
        helpers: {
            title: {
                type: 'outside'
            },
            overlay: {
                speedOut: 0
            }
        }
    });

    // Disable opening and closing animations, change title type
    $(".fancybox-effects-b").fancybox({
        openEffect: 'none',
        closeEffect: 'none',

        helpers: {
            title: {
                type: 'over'
            }
        }
    });

    // Set custom style, close if clicked, change title type and overlay color
    $(".fancybox-effects-c").fancybox({
        wrapCSS: 'fancybox-custom',
        closeClick: true,

        openEffect: 'none',

        helpers: {
            title: {
                type: 'inside'
            },
            overlay: {
                css: {
                    'background': 'rgba(238,238,238,0.85)'
                }
            }
        }
    });

    // Remove padding, set opening and closing animations, close if clicked and disable overlay
    $(".fancybox-effects-d").fancybox({
        padding: 0,

        openEffect: 'elastic',
        openSpeed: 150,

        closeEffect: 'elastic',
        closeSpeed: 150,

        closeClick: true,

        helpers: {
            overlay: null
        }
    });

    /*
    *  Button helper. Disable animations, hide close button, change title type and content
    */

    $('.fancybox-buttons').fancybox({
        openEffect: 'none',
        closeEffect: 'none',

        prevEffect: 'none',
        nextEffect: 'none',

        closeBtn: false,

        helpers: {
            title: {
                type: 'inside'
            },
            buttons: {}
        },

        afterLoad: function () {
            this.title = 'Image ' + (this.index + 1) + ' of ' + this.group.length + (this.title ? ' - ' + this.title : '');
        }
    });


    /*
    *  Thumbnail helper. Disable animations, hide close button, arrows and slide to next gallery item if clicked
    */

    $('.fancybox-thumbs').fancybox({
        prevEffect: 'none',
        nextEffect: 'none',

        closeBtn: false,
        arrows: false,
        nextClick: true,

        helpers: {
            thumbs: {
                width: 50,
                height: 50
            }
        }
    });

    /*
    *  Media helper. Group items, disable animations, hide arrows, enable media and button helpers.
    */
    $('.fancybox-media')
				.attr('rel', 'media-gallery')
				.fancybox({
				    openEffect: 'none',
				    closeEffect: 'none',
				    prevEffect: 'none',
				    nextEffect: 'none',

				    arrows: false,
				    helpers: {
				        media: {},
				        buttons: {}
				    }
				});

    /* Andrey Changes
    *
    */
    $(".fancybox")
                .attr('rel', 'gallery')
                .fancybox({
                    type: 'iframe',
                    autoSize: false,
                    width: 800,
                    height: 900,
                    autoScale: false,
                    autoDimensions: false, 
                });

    /*
    *  Open manually
    */

    $("#fancybox-manual-a").click(function () {
        $.fancybox.open('1_b.jpg');
    });

    $("#fancybox-manual-b").click(function () {
        $.fancybox.open({
            href: 'iframe.html',
            type: 'iframe',
            padding: 5
        });
    });

    $("#fancybox-manual-c").click(function () {
        $.fancybox.open([
					{
					    href: '1_b.jpg',
					    title: 'My title'
					}, {
					    href: '2_b.jpg',
					    title: '2nd title'
					}, {
					    href: '3_b.jpg'
					}
				], {
				    helpers: {
				        thumbs: {
				            width: 75,
				            height: 50
				        }
				    }
				});
    });



});

///////////////////////
//modernizer - older browser support
if (!Modernizr.svg) {
    $('#chart').append(
            $('<div>').addClass('svgError')
            .html("This demo requires SVG support. " +
            "Click <a href='http://caniuse.com/#cats=SVG'>here</a> " +
            "to see which browsers support SVG."));
    throw 'SVG not supported';
}


d3.loadData = function () {
    var loadedCallback = null;
    var toload = {};
    var data = {};
    var loaded = function (name, d) {
        delete toload[name];
        data[name] = d;
        return notifyIfAll();
    };
    var notifyIfAll = function () {
        if ((loadedCallback != null) && d3.keys(toload).length === 0) {
            loadedCallback(data);
        }
    };
    var loader = {
        json: function (name, url) {
            toload[name] = url;
            d3.json(url, function (d) {
                return loaded(name, d);
            });
            return loader;
        },
        csv: function (name, url) {
            toload[name] = url;
            d3.csv(url, function (d) {
                return loaded(name, d);
            });
            return loader;
        },
        onload: function (callback) {
            loadedCallback = callback;
            notifyIfAll();
        }
    };
    return loader;
};

d3.geo.regular = function () {
    var scale = 1, translate = [0, -50];
    function regular(coordinates) {
        var x = coordinates[0] / 360, y = -coordinates[1] / 360;
        return [scale * x + translate[0], scale * Math.max(-.5, Math.min(.5, y)) + translate[1]];
    }
    regular.invert = function (coordinates) {
        var x = (coordinates[0] - translate[0]) / scale, y = (coordinates[1] - translate[1]) / scale;
        return [360 * x, 2 * Math.atan(Math.exp(-360 * y * d3_geo_radians)) / d3_geo_radians - 90];
    };
    regular.scale = function (x) {
        if (!arguments.length) return scale;
        scale = +x;
        return regular;
    };
    regular.translate = function (x) {
        if (!arguments.length) return translate;
        translate = [+x[0], +x[1]];
        return regular;
    };
    return regular;
};

var projection = d3.geo.regular()
        .translate([centerX, centerY])
        .scale(wdt);

var zoom = null; 			   //the d3.js zoom object
var zoomWidgetObj = null; 		//the zoom widget draghandeler object
var zoomWidgetObjDoZoom = true;
var centerzoom;
var stringLangMap = d3.map();
var scaleWidgetObj = null;


jQuery("#scaleWidget").mouseenter(function () {
    // console.log('whhyyy'); 
    zoomWidgetObjDoZoom = true;
});

jQuery("#zoomWidget").mouseenter(function () {
    //console.log('whhyyy'); 
    zoomWidgetObjDoZoom = true;
});

zoom = d3.behavior.zoom()
			.translate([0, 0])
			.scale(1)
			.scaleExtent([0.25, 6])
			.on("zoom", redraw);


//static strings
function setStaticStrings() {
    $('#countryInfo').html(getStringFromDict('SELECT_COUNTRY'));
    $('#orgCountryHeading').html(getStringFromDict('COUNTRY_ORG'));
    $('#destCountryHeading').html(getStringFromDict('DEST_COUNTRY'));
    $('#keyIndicHeading').html(getStringFromDict('KEY_INDIC'));
    $('#arrwsReszText').html(getStringFromDict('ARROWS_RESIZED'));
    $('#fullscrButton').attr('alt', getStringFromDict('FULLSCR')).attr('title', getStringFromDict('FULLSCR'));
}

function compareCountry(a, b) {

    var aname = (language == 'FR' ? a.FrnLabel : a.EngLabel);
    var bname = (language == 'FR' ? b.FrnLabel : b.EngLabel);

    return aname.localeCompare(bname);
}

function getParameter(paramName) {
    var searchString = window.location.search.substring(1),
            i, val, params = searchString.split("&");

    for (i = 0; i < params.length; i++) {
        val = params[i].split("=");
        if (val[0] == paramName) {
            return unescape(val[1]);
        }
    }
    return null;
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

function createStringMaps(strings) {

    //create a map from indicator list - will be easier to match indicator when we need to!!!
    if (strings != null) {
        for (var i = 0; i < strings.length; i++) {
            stringLangMap.set(strings[i].STR_NAME, {
                ENG_NAME: strings[i].ENG_NAME,
                FRN_NAME: strings[i].FRN_NAME,
            });
        }
    }
}

function getStringFromDict(str) {

    var res_str = stringLangMap.get(str);

    if (!(typeof res_str === "undefined")) {

        if (language == "FR") {
            res_str = res_str.FRN_NAME;
        }
        else {
            res_str = res_str.ENG_NAME;
        }
    }

    return res_str;
}

function getLanguage() {

    var lang = getParameter('SPSLanguage');

    if (lang != null) {
        lang = lang.toUpperCase();
    }

    if (lang === 'EN' || lang === 'FR') //two supported languages
    {
        return lang;
    }

    lang = getCookie('SharePointTranslator');

    if (lang != null) {
        lang = lang.toUpperCase();
    }

    return lang === 'FR' ? 'FR' : 'EN';
}


//zoom/pan function called by mouse event, don't perform zoom, but do a click
function redraw(useScale) {

    //store the last event data
    trans = d3.event.translate;
    scale = d3.event.scale;
    var browserName = navigator.appName;

    //fix for IE bug, in IE zooming overwrites click
    //if (browserName == "Microsoft Internet Explorer") 
    {
        if (!(typeof d3.event.sourceEvent.target === "undefined") &&
            d3.event.sourceEvent.target.type != "click") {
            var event = document.createEvent("HTMLEvents");
            event.initEvent("click", true, false);
            d3.event.sourceEvent.target.dispatchEvent(event);
        }
    }
    //        else 
    //        {
    //            //transform the vis
    //            svg.attr("transform", "translate(" + trans + ")" + " scale(" + scale + ")");

    //            //we need to update the zoom slider, set the boolean to false so the slider change does not trigger a zoom change in the vis (from the slider callback function)  
    //            zoomWidgetObjDoZoom = false;
    //            zoomWidgetObj.setValue(0, (scale / 4));
    //        }

}

scaleWidgetObj = new Dragdealer('scaleWidget',
	{
	    horizontal: true,
	    vertical: false,
	    y: 0.255555555,
	    x: 0.1,
	    animationCallback: function (x, y) {
	        var val = Math.round(x * 100);

	        if (!(typeof svg === "undefined")) {

                !(typeof arcNodes === "undefined")
                    val = Math.round(x * arcNodes[0].length);

	            var arrowScale = document.getElementById("arrowScale");
	            arrowScale.textContent = val;

                var inflow = false;
                  if (document.selectionFlow.InflowButton.checked == true)
                      inflow = true;

                arcNodes.attr("d", function (d) 
                          {
                                if (d.order < val) 
                                {
                                  var width = (d.magnitude / currMaxMag ) * maxArrowWidth;
                                  if (width < minArrowWidth)
                                      width = minArrowWidth;

                                  return elliptarrow(d,inflow, width );
                                }
                                else
                                {
                                   return elliptarrow(d,inflow, minArrowWidth );
                                }
                          });

//	            arcNodes.style("stroke-width", function (d) {
//	                if (d.order < val) {

//	                    var width = (d.magnitude / currMaxMag) * maxArrowWidth;

//	                    if (width > maxArrowWidth)
//	                        width = maxArrowWidth;
//	                    else if (width < minArrowWidth)
//                            width = minArrowWidth;

//	                    return width;
//	                }
//	                else {
//	                    return minArrowWidth;
//	                }
//	            });



	        }
	    }
	});

zoomWidgetObj = new Dragdealer('zoomWidget',
	{
	    horizontal: false,
	    vertical: true,
	    y: 0.255555555,
	    animationCallback: function (x, y) {
	        //if the value is the same as the intial value exit, to prevent a zoom even being called onload
	        if (y == 0.255555555) { return false; }
	        //prevent too muuch zooooom
	        if (y < 0.05) { return false; }


	        //are we  zooming based on a call from interaction with the slider, or is this callback being triggerd by the mouse event updating the slider position.
	        if (zoomWidgetObjDoZoom == true) {
	            y = y * 4;


	            //this is how it works now until i figure out how to handle this better.
	            //translate to the middle of the visualization or country(if selected) and apply the zoom level

	            if (!(typeof centerzoom === "undefined") && (centerzoom[0] > 0 && centerzoom[1] > 0)) {
	                svg.attr("transform", "translate(" + [centerzoom[0] - centerzoom[0] * y, centerzoom[1] - centerzoom[1] * y] + ")" + " scale(" + y + ")");

	                //store the new data into the zoom object so it is ready for mouse events
	                zoom.translate([centerzoom[0] - centerzoom[0] * y, centerzoom[1] - centerzoom[1] * y]).scale(y);
	            }
	            else {
	                svg.attr("transform", "translate(" + [(w / 2) - (w * y / 2), (h / 2) - (h * y / 2)] + ")" + " scale(" + y + ")");

	                //store the new data into the zoom object so it is ready for mouse events
	                zoom.translate([(w / 2) - (w * y / 2), (h / 2) - (h * y / 2)]).scale(y);
	            }
	        }
	    }
	});          


var path = d3.geo.path().projection(projection);
var arc = d3.geo.greatArc().precision(3);
language = getLanguage();

//SVG main image
var svg = d3.select("body").append("svg")
                    .attr("width", w)
                    .attr("height", h)
                    //.style("border", "1px solid #605F5D")
                    .append('svg:g')
                    .call(zoom);

//SVG legend
var svgLegend = d3.select("#legend").append("svg")
                  .attr("width",  legendWidth)
                  .attr("height", legendHeight);




var countries = svg.append("g").attr("id", "countries");
var centroids = svg.append("g").attr("id", "centroids");
var arcNodes = 0;
var arcWidth = 0;
var currMaxMag = 1;

svg.append("text")
           .attr("id", "loading")
           .attr("x", 5)
           .attr("y", 17)
           .attr("font-size", "9pt")
           .attr("font-family", "arial")
           .append("rect")
	       .attr("width", "100%")
	       .attr("height", "100%")
           .text("Loading...");

d3.loadData()
         .json('countries', 'world-countries.json')
         .csv('nodes',     'nodes.csv')
         .csv('emcids',    'flows.csv')
         .csv('indics',    'indic.csv')
         .csv('strings',   'stringDict.csv')
         .json('config',   'http://www.uis.unesco.org/das/api/general/?keys=EDU_CP_END_YR')
         .json('cntryDef', 'http://www.uis.unesco.org/das/api/countries/?region=ALLCOUNTRIES')
         .onload(function (data) {

             //create an emcid substring
             var emcidstr = "";
             var indicstr = "";

             createStringMaps(data.strings);
             dtYear = parseInt(data.config.EDU_CP_END_YR);
             dtStrtYear = dtYear - 3;

             //set static strings based on the stringmap
             setStaticStrings();

             for(var i = 0; i < data.emcids.length; i++) {
                 emcidstr += "," + data.emcids[i].emcid;
             }
             emcidstr = emcidstr.substring(1);

             for (var i = 0; i < data.indics.length; i++) {
                 indicstr += "," + data.indics[i].emcid;
             }
             indicstr = indicstr.substring(1);

             //create country definition map
             allCountries = data.cntryDef.CountriesDefinition;
             for (var i = 0; i < allCountries.length; i++) {
                 countryDefinitionMap[allCountries[i].Abbr] = allCountries[i];
             }
             //sort
             allCountries.sort(compareCountry);

             data.flows = [];
             indicatorsMap = [];
            

             d3.loadData()
               .json('emcid',      "http://www.uis.unesco.org/das/api/general/?keys=" + emcidstr)
               .json('worldTotal', "http://www.uis.unesco.org/das/api/countries/?code=40510&category=EDULIT_DS&indicators=OE_56_40510&fromyear=" + dtStrtYear + "&toyear=" + dtYear + "&mostrecent=true")
               .json('indic', "http://www.uis.unesco.org/das/api/countries/?code=ALLCOUNTRIES&category=EDULIT_DS&indicators=" + indicstr + "&fromyear=" + dtStrtYear + "&toyear=" + dtYear + "&mostrecent=true")
               .json('emciddata', "http://www.uis.unesco.org/das/api/countries/?code=ALLCOUNTRIES&category=EDULIT_DS&indicators=" + emcidstr + "&fromyear=" + dtStrtYear + "&toyear=" + dtYear + "&mostrecent=true")
               .onload(function (dtStat) {

                   //process emcid
                   $.each(dtStat.emcid, function (k, v) {
                       countryToEmcIdMap[v] = k;
                       emcidToCountryMap[String(k)] = v;
                   });

                   $.each(dtStat.indic.Indicators, function (k, v) {

                       var coabr = String(v.Country);

                       if (typeof indicatorsMap[coabr] == "undefined")
                       {
                           indicatorsMap[coabr] = {};
                       }

                       var nobj = indicatorsMap[coabr];
                       nobj["CO_ABR"]    = coabr;
                       nobj["_"+v.Indicator] = v.Value;
                   });

                   for (var i = 0; i < dtStat.emciddata.Indicators.length; i++) {
                       var nobj = {
                           Dest: dtStat.emciddata.Indicators[i].Country,
                           Origin: emcidToCountryMap[dtStat.emciddata.Indicators[i].Indicator],
                           RefYear: dtStat.emciddata.Indicators[i].Year
                       };
                       nobj[dtYear] = dtStat.emciddata.Indicators[i].Value;
                       data.flows.push(nobj);
                   }


                   //set the world total value
                   if (typeof dtStat.worldTotal != "undefined" &&
                        typeof dtStat.worldTotal.Indicators[0] != "undefined") {

                       var obj = dtStat.worldTotal.Indicators[0];

                       var coabr = String(obj.Country);
                       indicatorsMap[coabr] = {};

                       var nobj = indicatorsMap[coabr];
                       nobj["CO_ABR"] = coabr;
                       nobj["_" + obj.Indicator] = obj.Value;
                   }

             $('#loadingDiv').hide();

             var nodeDataByCode = {}, links = [];
             var nodeNoDataAvailableByCode = {};

             var totalIntStudents = 0;
             var totalOE5640510 = 0; var totalE56FOREIGN = 0;

              
             var maxMagnitude = d3.max(data.flows, function (d) { return parseFloat(d[dtYear]) });
             var magnitudeFormat = d3.format(",.0f");
             arcWidth = d3.scale.sqrt().domain([1, maxMagnitude]).range([.5, 7]);

             var minColor = '#f0f0f0'; // '#0c459a'; //'#f0f0f0', 
             var maxColor = 'rgb(79, 79, 79)'; //'rgb(8, 48, 107)';
             var arcColor = d3.scale.log().domain([1, maxMagnitude]).range([minColor, maxColor]);
             var arcOpacity = d3.scale.log().domain([1, maxMagnitude]).range([0.7, 1]);
             var countryTitles;


             var pane = d3.selectAll(".RFPane").data(allCountries);
             pane.append("select").on("change", change).selectAll("option")
                .data(allCountries)
                .enter()
                .append("option")
                .attr("value", function (d) {
                    return d.Abbr;
                })
                .text(function (d) {
                    if (language == "FR")
                        return d.FrnLabel;
                    else
                        return d.EngLabel;
                });

             for (i = 0; i < data.flows.length; i++) {
                 nodeNoDataAvailableByCode[data.flows[i].Origin] = 1;
                 nodeNoDataAvailableByCode[data.flows[i].Dest] = 1;
             };

			 if(typeof indicatorsMap["40510"] !== "undefined")
			 {
				totalOE5640510  = indicatorsMap["40510"]._OE_56_40510;
				totalE56FOREIGN = indicatorsMap["40510"]._OE_56_40510;
			 }

             var c1 = countries.selectAll("path")
                 .data(data.countries.features)
                 .enter().append("path")
                 .attr("d", path)
                 .on("click", click);

             var countryTitles = c1.append("svg:title").text(function (d) {
                  var additionalData = "";
                  if (typeof nodeNoDataAvailableByCode[d.id] === "undefined")
                      additionalData = " - "+getStringFromDict('NO_DATA');
                 return d.properties.name + additionalData;
             });



             data.nodes.forEach(function (node) {
                 node.coords = nodeCoords(node);
                 node.projection = node.coords ? projection(node.coords) : undefined;
                 nodeDataByCode[node.Code] = node;
             });

             var strokeFun = function (d) { return arcColor(d.magnitude); };

             //country center circles
             centroids.selectAll("circle")
                     .data(data.nodes.filter(function (node) { return node.projection ? true : false }))
                     .enter().append("circle")
                     .attr("cx", function (d) { return d.projection[0] })
                     .attr("cy", function (d) { return d.projection[1] })
                     .attr("r", 1)
                     .attr("fill", "#000")
                     .attr("opacity", 0.0);

             var gradientNameFun    = function (d) { return "grd" + d.origin.Code + d.dest.Code; };
             var gradientRefNameFun = function (d) { return "url(#" + gradientNameFun(d) + ")"; };

             //inflow button
             var flowButtonContainer = $("#flowButtons");

             //Fill the scaleButtonContainer with a set of radio buttons that control the size distribution of leaves in the ontology.

             var scaleOptions = [{ name: "Inflow",  id: "#InflowButton",  text: getStringFromDict('WHERE_FROM') },
                                 { name: "Outflow", id: "#OutflowButton", text: getStringFromDict('WHERE_TO') }];

             $.each(scaleOptions, function (index, button) {
                 var name = button.name;
                 var text = button.text;
                 flowButtonContainer.append($(document.createElement('input'))
                  .attr('type', 'radio')
                  .attr('id', name + 'Button')
                  .attr('name', 'scaleRadio')
                  .attr('value', name)
                  .attr('checked', name == 'Outflow'))
                  //.attr('style', "vertical-align:top")
                  .on("click", function () { change(); });

                 flowButtonContainer.append($(document.createElement('label'))
                 .attr('for', name + 'Button')
                 .html(text));

                 flowButtonContainer.append($(document.createElement('br')));
             });

             //select Canada by default
             for (i = 0; i < data.countries.features.length; i++) {
                 if ('CAN' == data.countries.features[i].id) {
                     click(data.countries.features[i]);
                     break;
                 }
             }

             flowButtonContainer.buttonset();

             function change(d) {

                 var dropdown = d3.selectAll(".RFPane").selectAll("select");

                 var source = dropdown.node().options[dropdown.node().selectedIndex].__data__;

                 for (i = 0; i < data.countries.features.length; i++) {
                     if (source.Abbr == data.countries.features[i].id) {
                         click(data.countries.features[i]);
                         break;
                     }
                 }
             }

             function switchFlow() {
                 var event = document.createEvent("HTMLEvents");
                 event.initEvent("click", true, false);
                 d3.event.sourceEvent.target.dispatchEvent(event);
             }

             function setDropDown(d) {

                 var dropdown = d3.selectAll(".RFPane").selectAll("select");

                 for (i = 0; i < dropdown.node().options.length; i++) {
                     var source = dropdown.node().options[i].__data__;
                     if (source.Abbr == d.id) {
                         dropdown.node().selectedIndex = i;
                         break;
                     }
                 }
             }

             //click function
             function click(d) {

                 var topTenDest = [], topTenOrg = [];
                 var totalIn = 0, totalOut = 0;
                 var totalStudents = { inCountry: 0, outCountry: 0 };

                 centerzoom = nodeDataByCode[d.id].projection;

                 //topTenDest.push(0); topTenOrg.push(0);

                 //inflow set checked
                 var inflow = false;
                 if (document.selectionFlow.InflowButton.checked == true)
                     inflow = true;

                 //Set color accordingly to the inflow value
                 var clickedCountryColor     = inflow ? destinationColor : originColor;
                 var topOrdDestCountries     = inflow ? topTenOrg : topTenDest;
                 var legendColor             = inflow ? legendOriginColors : legendDestinationColors;

                 //reset data for previous country
                 cleanStructures(d);
                 setDropDown(d);

                 //get the topTen Origin and Destination and sort them
                 getTopOriginDestinationCountries(d.id, inflow, topTenOrg, topTenDest, totalStudents);
           
                 //draw legend in the lower right color
                 drawLegend(legendColor);

                 //color origin and destination countries accordingly to the flow
                 colorOriginDestCountries(topOrdDestCountries, clickedCountryColor, d.id, legendColor, inflow);
                  
                 //display of the table containing the countries
                 populateOrgDestCountries(topTenDest, "#dstCountriesList", inflow);
                 populateOrgDestCountries(topTenOrg,  "#orgCountriesList", inflow);

                 //display the indicator data
                 var totalPercIn  = Math.round( (totalStudents.inCountry * 100 / totalIntStudents) * 10)/10;
                 var totalPercOut = Math.round( (totalStudents.outCountry * 100 / totalIntStudents) * 10)/10;

                 var dataset = [ [{ val: getStringFromDict('STUD_ABR'), cell: 0, title: "" }, 
                                  { val: "", cell: 1}]];


                 if (typeof indicatorsMap[d.id] !== "undefined")
                 {
                     dataset.push([{ val: getStringFromDict('STUD_MOBIL'), cell: 0, title: getStringFromDict('TOT_NUMB_ST_ABR_LONG') },
                                     {
                                         val: ((typeof indicatorsMap[d.id]._OE_56_40510 === "undefined") ||
                                                indicatorsMap[d.id]._OE_56_40510 == '0'      ||
                                                indicatorsMap[d.id]._OE_56_40510 == '0.0') ? "..." :
                                                CommaFormatted(Math.round(indicatorsMap[d.id]._OE_56_40510)), cell: 1
                                     }]);

                     // { val: totalStudents.outCountry == '0' ? "..." : CommaFormatted("" + totalStudents.outCountry), cell: 1}] );

                     dataset.push([{ val: getStringFromDict('STUD_GLOB_MOBIL'), cell: 0, title: getStringFromDict('STUD_GLOB_MOBIL_LONG') },
                                   {
                                       val: ((typeof indicatorsMap[d.id]._OE_56_40510 === "undefined") ||
                                              indicatorsMap[d.id]._OE_56_40510 == '0'      ||
											  totalOE5640510 == 0 ||
                                              indicatorsMap[d.id]._OE_56_40510 == '0.0') ? "..." :
                                              ((indicatorsMap[d.id]._OE_56_40510 * 100)/totalOE5640510).toFixed(1), cell: 1
                                   }]);
                     // { val: totalPercOut == '0' ? "..." : totalPercOut, cell: 1}]);

                     dataset.push([{ val: getStringFromDict('OUT_MOBIL_RT'), cell: 0, title: getStringFromDict('OUTB_MOBIL_RT_LONG') },
                                   {
                                       val: ((typeof indicatorsMap[d.id]._MOR_56_40510 === "undefined") ||
                                             indicatorsMap[d.id]._MOR_56_40510 == '0' ||
                                             indicatorsMap[d.id]._MOR_56_40510 == '0.0') ? "..." :
                                             indicatorsMap[d.id]._MOR_56_40510.toFixed(1), cell: 1
                                   }]);
                     dataset.push([{ val: getStringFromDict('GROSS_OUT_ENR_RT'), cell: 0, title: getStringFromDict('GROSS_OUT_ENR_RT_LONG') },
                                   {
                                       val: ((typeof indicatorsMap[d.id]._MOGER_56_40510 === "undefined") ||
                                             indicatorsMap[d.id]._MOGER_56_40510 == '0' ||
                                             indicatorsMap[d.id]._MOGER_56_40510 == '0.0') ? "..." :
                                             indicatorsMap[d.id]._MOGER_56_40510.toFixed(1), cell: 1
                                   }]);
                 }

                 dataset.push([{ val: " ", cell: 0, title: "" }, 
                                  { val: "", cell: 1}]);
                 dataset.push([{ val: getStringFromDict('STUD_HOST'), cell: 0, title: "" }, 
                                  { val: "", cell: 1}]);
                  
                  
                 if (typeof indicatorsMap[d.id] !== "undefined")
                 {
                     dataset.push([{ val: getStringFromDict('TOT_NUMB_MOBIL_ST'), cell: 0, title: getStringFromDict('TOT_NUMB_ST_HST_LONG') },
                                   { val: ((typeof indicatorsMap[d.id]._26637 === "undefined") ||
                                           indicatorsMap[d.id]._26637 == '0' || 
                                           indicatorsMap[d.id]._26637 == '0.0') ? "..." :
                                           CommaFormatted(Math.round(indicatorsMap[d.id]._26637)), cell: 1
                                   }]);
                

                     dataset.push([{ val: getStringFromDict('STUD_GLOB_MOBIL'), cell: 0, title: getStringFromDict('STUD_GLOB_MOBIL_LONG') },
                                   {
                                       val: ((typeof indicatorsMap[d.id]._26637 === "undefined") ||
                                          indicatorsMap[d.id]._26637 == '0' ||
										  totalE56FOREIGN == 0 ||
                                          indicatorsMap[d.id]._26637 == '0.0') ? "..." :
                                          ((indicatorsMap[d.id]._26637 * 100)/totalE56FOREIGN).toFixed(1), cell: 1
                                   }]);

                     dataset.push([{ val: getStringFromDict('INB_MOBIL_RT'), cell: 0, title: getStringFromDict('INB_MOBIL_RT_LONG') },
                                   { val: ((typeof indicatorsMap[d.id]._MSEP_56 === "undefined") || 
                                            indicatorsMap[d.id]._MSEP_56 == '0' || 
                                            indicatorsMap[d.id]._MSEP_56 == '0.0') ? "..." :
                                            indicatorsMap[d.id]._MSEP_56.toFixed(1), cell: 1
                                   }]);
                 }
                  


                 d3.select("#mainIndicators")
                       .append("table")
                       .style("width", "100%")
                       .selectAll("tr")
                       .data(dataset)
                       .enter().append("tr")
                       .selectAll("td")
                       .data(function (d) { return d; })
                       .enter().append("td")
                       .style("text-align", function (d) {
                           if (d.cell == 0)
                               return "left";
                           else
                               return "right";
                       })
                       .text(function (d) { return d.val })
                       .style("cursor",  "pointer")
                       .attr("title", function (d) { 
                           if (d.cell == 0)
                               return d.title;})
                       .style("font-size", figSize);


                 buildLinksAddArcsToSVG(inflow, d);

                 //we need to rest the zoom/pan
                 zoom.translate([0, 0]).scale(1);
                 svg.attr("transform", "translate(" + [0, 0] + ")" + " scale(" + 1 + ")");

                 zoomWidgetObjDoZoom = false;
                 zoomWidgetObj.setValue(0, 0.255555555);


                 if (inflow) {
                     d3.select("#overlayDest").style("visibility", "visible");
                     d3.select("#overlayOrg").style("visibility", "hidden");
                 }
                 else {
                     d3.select("#overlayOrg").style("visibility", "visible");
                     d3.select("#overlayDest").style("visibility", "hidden");
                 }

             } /* end click function */

             function buildLinksAddArcsToSVG(inflow, d) {
                 var links1 = [];
                 //Build the links array
                 for (i = 0; i < data.flows.length; i++) {
                     if (inflow ? data.flows[i].Dest == d.id : data.flows[i].Origin == d.id) {

                         var org = nodeDataByCode[data.flows[i].Origin];
                         if (org != null) {
                             co = org.coords;
                             po = org.projection;
                             var dest = nodeDataByCode[data.flows[i].Dest];

                             if (dest != null) {
                                 cd = dest.coords;
                                 pd = dest.projection;
                                 var magnitude = parseFloat(data.flows[i][dtYear]);
                                 var refYr = data.flows[i].RefYear;

                                 //need to associate links with country
                                 if (co && cd && !isNaN(magnitude) && org.Code != dest.Code) {
                                     links1.push({
                                         source: co, target: cd,
                                         magnitude: magnitude,
                                         refyr : refYr,
                                         origin: org, dest: dest,
                                         originp: po, destp: pd,
                                         order: 0
                                     });
                                 }
                             }
                         }
                     }
                 }

                 links1.sort(function sortfunction(a, b) {
                     return b.magnitude - a.magnitude;
                 });

                 for (i = 0; i < links1.length; i++) {
                     links1[i].order = i;
                 }



                 var defs = svg.append("svg:defs");
                 // see http://apike.ca/prog_svg_patterns.html
                 defs.append("marker")
                 .attr("id", "arrowHead")
                 .attr("viewBox", "0 0 10 10")
                 .attr("refX", 5)
                 .attr("refY", 5)
                 .attr("orient", "auto")
                 //.attr("markerUnits", "strokeWidth")
                 .attr("markerUnits", "userSpaceOnUse")
                 .attr("markerWidth", 4 * 2)
                 .attr("markerHeight", 3 * 2)
                 .attr("stroke", "none")
                 .append("polyline")
                 .attr("points", "0,0 10,5 0,10 1,5")
                 .attr("fill", maxColor)
                 //.attr("opacity", 0.5)
                 ;

                 //create linear gradient
                 var gradient = defs.selectAll("linearGradient")
                             .data(links1)
                             .enter()
                             .append("svg:linearGradient")
                             .attr("id", gradientNameFun)
                             .attr("gradientUnits", "userSpaceOnUse")
                             .attr("x1", function (d) {
                                 return d.originp[0];
                             })
                             .attr("y1", function (d) { return d.originp[1]; })
                             .attr("x2", function (d) { return d.destp[0]; })
                             .attr("y2", function (d) { return d.destp[1]; });

                 gradient.append("svg:stop")
                   .attr("offset", "0%")
                   .attr("stop-color", minColor)
                   .attr("stop-opacity", 0.0);
                 gradient.append("svg:stop")
                   .attr("offset", "80%")
                   .attr("stop-color", strokeFun)
                   .attr("stop-opacity", 1.0);
                 gradient.append("svg:stop")
                   .attr("offset", "100%")
                   .attr("stop-color", strokeFun)
                   .attr("stop-opacity", 1.0);


                 //set new arcpath
                 var arcs = svg.append("g").attr("id", "arcs");
                 var arrHgl = parseInt(arrowScale.textContent);

                 arcNodes = arcs.selectAll("path")
                         .data(links1)
                         .enter().append("path")
                         .attr("visibility", function (d) { return d.magnitude > 0 ? "visible" : "hidden" })
                         .attr("fill", gradientRefNameFun)
                        // .attr("stroke-linecap", "round")
//                          .attr("stroke-width", function (d) {
//                              if (d.order < arrHgl) {

//                                  var width = (d.magnitude / currMaxMag ) * maxArrowWidth;
//                                  if (width > maxArrowWidth)
//                                      width = maxArrowWidth;
//                                  else if (width < minArrowWidth)
//                                      width = minArrowWidth;

//                                  return width;
//                              }
//                              else {
//                                  return minArrowWidth;
//                              }
//                          })
                         .attr("d", function (d) 
                         {
                             if (d.order < arrHgl) 
                             {
                                 var width = (d.magnitude / currMaxMag ) * maxArrowWidth;
                                 if (width < minArrowWidth)
                                     width = minArrowWidth;

                                 return elliptarrow(d,inflow, width );
                             }
                             else
                             {
                                 return elliptarrow(d,inflow, minArrowWidth );
                             }
                         })
                         .sort(function (a, b) {
                             var a = a.magnitude, b = b.magnitude;
                             if (isNaN(a)) if (isNaN(b)) return 0; else return -1; if (isNaN(b)) return 1;
                             return d3.ascending(a, b);
                         });


                 arcNodes.on("mouseover", function (d) {
                     d3.select(this).attr("fill", hoverOverArrow);
                 })
                 arcNodes.on("mouseout", function (d) {
                     d3.select(this).attr("fill", gradientRefNameFun);
                 });

                 arcNodes.append("svg:title")
                                     .text(function (d) {
                                         var orgDef = countryDefinitionMap[d.origin.Code];
                                         var destDef = countryDefinitionMap[d.dest.Code];

                                         if (!(typeof orgDef === "undefined") && !(typeof destDef === "undefined"))
                                             return magnitudeFormat(d.magnitude) + " " + getStringFromDict("STUD_FROM") + " " +
                                                 (language == "FR" ? orgDef.FrnLabel : orgDef.EngLabel) + " " + getStringFromDict("STUD_IN") + " " +
                                                 (language == "FR" ? destDef.FrnLabel : destDef.EngLabel) + " (" + d.refyr + ")";
                                     });

                 

                 countries.selectAll("path").select("title").text(function (d) {
                     var additionalData = "";
                     if (typeof nodeNoDataAvailableByCode[d.id] === "undefined")
                         additionalData = " - " + getStringFromDict("NO_DATA");
                     else {

                         for (i = 0; i < arcNodes[0].length; i++) {
                             var name = inflow ? arcNodes[0][i].__data__.origin.Code : arcNodes[0][i].__data__.dest.Code;

                             if (d.id == name) {

                                 var cntry = countryDefinitionMap[name];

                                 if (!(typeof cntry === "undefined")) {
                                     var cntryName = (language == "FR" ? cntry.FrnLabel : cntry.EngLabel);

                                     var dObj = arcNodes[0][i].__data__;

                                     if (inflow){
                                         var cntryDest = countryDefinitionMap[arcNodes[0][i].__data__.dest.Code];
                                         var cntryDestName = (language == "FR" ? cntryDest.FrnLabel : cntryDest.EngLabel);

                                         return magnitudeFormat(dObj.magnitude) + " " + getStringFromDict("STUD_FROM") + " " + cntryName + " " +
                                             getStringFromDict("STUD_IN") + " " + cntryDestName + " (" + dObj.refyr + ")";
                                     }
                                     else {
                                         var cntryOrig = countryDefinitionMap[arcNodes[0][i].__data__.origin.Code];
                                         var cntryOrigName = (language == "FR" ? cntryOrig.FrnLabel : cntryOrig.EngLabel);

                                         return magnitudeFormat(dObj.magnitude) + " " + getStringFromDict("STUD_FROM") + " " + cntryOrigName + " " +
                                             getStringFromDict("STUD_IN") + " " + cntryName + " (" + dObj.refyr + ")";
                                     }
                                 }
                             }
                         }
                     }
                     return d.properties.name + additionalData;
                 });
             }


             function getTopOriginDestinationCountries(mainId, inflow, topTenOrg, topTenDest, totalStudents)
             {
                 for (i = 0; i < data.flows.length; i++) {
                     if (data.flows[i].Dest == mainId) {
                         var magnitude = parseFloat(data.flows[i][dtYear]);
                         totalStudents.inCountry += magnitude;

                         if (typeof data.flows[i].Origin !== "undefined") {
                             topTenOrg.push({
                                 magnitude: magnitude,
                                 name: data.flows[i].Origin
                             });
                         }
                     }
                     else if (data.flows[i].Origin == mainId) {
                         var magnitude = parseFloat(data.flows[i][dtYear]);
                         totalStudents.outCountry += magnitude;

                         if (typeof data.flows[i].Dest !== "undefined") {
                             topTenDest.push({
                                 magnitude: magnitude,
                                 name: data.flows[i].Dest
                             });
                         }
                     }
                 }
                 topTenOrg.sort(function sortfunction(a, b) {
                     return b.magnitude - a.magnitude;
                 });
                 topTenDest.sort(function sortfunction(a, b) {
                     return b.magnitude - a.magnitude;
                 });

                 if (inflow) {
                     if (topTenOrg.length > 2)
                         currMaxMag = topTenOrg[0].magnitude;
                     else
                         currMaxMag = 1;
                 }
                 else {
                     if (topTenDest.length > 2)
                         currMaxMag = topTenDest[0].magnitude;
                     else
                         currMaxMag = 1;
                 }
             }

             function drawLegend(legendColor) {

                 var cellSize = 1;
                 if(legendBoundaryValues.length > 0)
                     cellSize = legendWidth/legendBoundaryValues.length;

                 //Draw legend
                 var legendData = svgLegend.append("g").attr("id", "legendData");
                 legendData.append("svg:text")
                             .text( getStringFromDict('STUD_INT') )
                             .attr("x", 0)
                             .attr("y", 10)
                             .style("font-size", "8pt")
                             .style("fill", "black"); 

                 for(i = 0; i < legendBoundaryValues.length; i++)
                 {
                     legendData.append("svg:rect")
                              .attr("x",i*cellSize)
                              .attr("y",12)
                              .attr("width", cellSize)
                              .attr("height",15)
                              .style("fill", legendColor[i] );


                     legendData.append("svg:text")
                         .text( CommaFormatted("" + legendBoundaryValues[i] + "") )
                         .attr("x", i*cellSize)
                         .attr("y", 38)
                         .style("font-size", "8pt")
                         .style("fill", "black"); 
                 }

             }

             function colorOriginDestCountries(topOrdDestCountries, clickedCountryColor, mainId, legendColor, inflow)
             {
                 //Color the countries according to the legend 
                 countries.selectAll("path").style("fill", function (d) {
                     if (d.id == mainId) {
                         return clickedCountryColor;
                     }
                     else
                     {
                         for (i = 0; i < topOrdDestCountries.length; i++) 
                         {
                             if (topOrdDestCountries[i].name == d.id) 
                             {
                                 for(j = 1; j < legendBoundaryValues.length; j++)
                                 {
                                     if( topOrdDestCountries[i].magnitude < legendBoundaryValues[j] )
                                         return legendColor[j-1];
                                 }

                                 return legendColor[ legendColor.length-1 ];
                             }
                         }
                     }
                      
                     return unselectedCountryColor;
                 })
                  .on("mouseover", function () {
                      d3.select(this).style("fill", function (d) {

                          for (i = 0; i < arcNodes[0].length; i++) {
                              var name = inflow ? arcNodes[0][i].__data__.origin.Code : arcNodes[0][i].__data__.dest.Code;

                              if (d.id == name) {
                                  d3.select(arcNodes[0][i])
                                         .attr("fill", hoverOverArrow);
                                  // .attr("marker-end", "url(#arrowHead)");
                                  break;
                              }
                          }

                          if (typeof nodeNoDataAvailableByCode[d.id] === "undefined") {
                              return noDataCountryColor;
                          }
                          if (d.id == mainId) {
                              return clickedCountryColor;
                          }
                          else {
                              return hoverOverCountryColor;
                          }

                      });
                  })
                  .on("mouseout", function () {
                      d3.select(this).style("fill", function (d) {

                          for (i = 0; i < arcNodes[0].length; i++) {
                              var name = inflow ? arcNodes[0][i].__data__.origin.Code : arcNodes[0][i].__data__.dest.Code;
                              if (d.id == name) {
                                  d3.select(arcNodes[0][i])
                                      // .attr("marker-end", "none")
                                       .attr("fill", gradientRefNameFun);
                                  break;
                              }
                          }

                          if (d.id == mainId) {
                              return clickedCountryColor;
                          }
                          else {
                              for (i = 0; i < topOrdDestCountries.length; i++) 
                              {
                                  if (topOrdDestCountries[i].name == d.id) 
                                  {
                                      for(j = 0; j < legendBoundaryValues.length; j++)
                                      {
                                          if( topOrdDestCountries[i].magnitude < legendBoundaryValues[j] )
                                              return legendColor[j];
    
                                      }
                                      return legendColor[ legendColor.length-1 ];
                                  }
                              }
                          }
                           
                          return unselectedCountryColor;
                      });
                  });
             }

             function populateOrgDestCountries(topTenOrgDest, orgDestCountriesList, inflow) {

                 var interactionEnabled = ((orgDestCountriesList == "#dstCountriesList") && !inflow) ||
                                          ((orgDestCountriesList == "#orgCountriesList") && inflow);


                 var dataset = [];
                 for (i = 0; i < topTenOrgDest.length; i++) {
                     var tmpDataset = [];
                     var dt = countryDefinitionMap[topTenOrgDest[i].name];
                     if (dt != null) {
                         var cntryName = language == "FR" ? dt.FrnLabel : dt.EngLabel;

                         tmpDataset.push({ val: cntryName, cell: 0, code: topTenOrgDest[i].name });
                         tmpDataset.push({ val: CommaFormatted(topTenOrgDest[i].magnitude.toFixed(0)), cell: 1 });
                     }
                     dataset.push(tmpDataset);
                 }
                 if (topTenOrgDest.length <= 1) {

                     d3.select(orgDestCountriesList)
                       .append("label")
                       .style("position", "absolute")
                       .style("top", "75px")
                       .style("left", "75px")
                       .style("text-align", "center")
                       .text(getStringFromDict('NO_DATA'))
                       .style("font-size", figSize);

                 }
                 else {
                     d3.select(orgDestCountriesList)
                       .append("table")
                       .style("width", "100%")
                       .style("border-width", "0px")
                       .style("border-spacing", "0px")
                       .style("border-style", "none")
                       .selectAll("tr")
                       .data(dataset)
                       .enter().append("tr")
                       .on("mouseover", function (d) {
                           if (interactionEnabled) {
                               d3.select(this).style("background-color", "aliceblue");
                               d3.select(this).style("border-style", "solid");

                               for (i = 0; i < arcNodes[0].length; i++) {
                                   var name = inflow ? arcNodes[0][i].__data__.origin.Code : arcNodes[0][i].__data__.dest.Code;
                                   if (d[0].code == name) {
                                       d3.select(arcNodes[0][i])
                                         .attr("fill", hoverOverArrow);
                                       //.attr("marker-end", "url(#arrowHead)");
                                       break;
                                   }
                               }
                           }

                       })
                       .on("mouseout", function (d) {
                           if (interactionEnabled) {
                               d3.select(this).style("background-color", "white");
                               d3.select(this).style("border-style", "none");

                               for (i = 0; i < arcNodes[0].length; i++) {
                                   var name = inflow ? arcNodes[0][i].__data__.origin.Code : arcNodes[0][i].__data__.dest.Code;
                                   if (d[0].code == name) {
                                       d3.select(arcNodes[0][i])
                                      // .attr("marker-end", "none")
                                       .attr("fill", gradientRefNameFun);
                                       break;
                                   }
                               }
                           }

                       })
                       .selectAll("td")
                       .data(function (d) { return d; })
                       .enter().append("td")
                       .style("cursor", function (d) { if (interactionEnabled) return "pointer"; })
                       .style("text-align", function (d) {
                           if (d.cell == 0)
                               return "left";
                           else
                               return "right";
                       })
                       .text(function (d) {
                           if (d.cell == 1 && d.val < 5)
                           {
                               return "< 5";
                           }
                           return d.val; })
                       .style("font-size", figSize);

                 }
             }

             function cleanStructures(d) {

                 //countryInfo dst, org Country info reset
                 var countryInfo    = document.getElementById("countryInfo");
                 var dstCountryList = document.getElementById("dstCountriesList");
                 var orgCountryList = document.getElementById("orgCountriesList");
                 var mainIndicatorsList = document.getElementById("mainIndicators");

                 if (countryInfo != null)
                     countryInfo.textContent = language == "FR" ? countryDefinitionMap[d.id].FrnLabel : countryDefinitionMap[d.id].EngLabel;

                 if (dstCountryList != null)
                     dstCountryList.textContent = "";

                 if (orgCountryList != null)
                     orgCountryList.textContent = "";

                 if (mainIndicatorsList != null)
                     mainIndicatorsList.textContent = "";


                 //reset he arcpath
                 var oldarcs = document.getElementById("arcs");
                 if (oldarcs != null) {
                     var parent = oldarcs.parentNode;
                     if (parent != null) {
                         parent.removeChild(oldarcs);
                     }
                 }
                 var oldefs = document.getElementById("svg:defs");
                 if (oldefs != null) {
                     var parent = oldefs.parentNode;
                     if (parent != null) {
                         parent.removeChild(oldefs);
                     }
                 }

                 var oldlegendData = document.getElementById("legendData");
                 if (oldlegendData != null) {
                     var parent = oldlegendData.parentNode;
                     if (parent != null) {
                         parent.removeChild(oldlegendData);
                     }
                 }
             }

             function nodeCoords(node) {
                 var lon = parseFloat(node.Lon), lat = parseFloat(node.Lat);
                 if (isNaN(lon) || isNaN(lat)) return null;
                 return [lon, lat];
             }



             function ellipticalArc(d) {
                 var src = projection(d.source);
                 var trg = projection(d.target);

                 var dx = trg[0] - src[0],
                     dy = trg[1] - src[1],
                     dr = Math.sqrt(dx * dx + dy * dy) * 1 / (Math.abs(dx / h));

                 var arcSide = (dx < 0) ? " 0 0,0 " : " 1 0,1 ";

                 return "M " + src[0] + "," + src[1] + " A " + dr + "," + dr + arcSide + trg[0] + "," + trg[1];
             }
            }); //end call to the config values
          }); //end main loadData()


function elliptarrow(d,inflow, width)
{
				var src = projection(d.source);
				var trg = projection(d.target);
				var mag = width;//Math.min(7,2+ width/10);
                //Math.min(15,2+ width/100); //d.magnitude/2/100);
				arrowOffset = mag;// mag //offset of arrow base

				if (inflow){
					var src = projection(d.target);
					var trg = projection(d.source);
					arrowOffset = -arrowOffset
				}

				dx = trg[0] - src[0]; //distance between src and trg
                dy = trg[1] - src[1];
				cx = (src[0]+trg[0])/2; //center of the line
				cy = (src[1]+trg[1])/2;

                ra = Math.sqrt(dx * dx + dy * dy);
				er = ra / (Math.abs(dx / hdt))*1.3; //ellipse radius
						
                var arcSide = (dx < 0) ? " 0 0,0 " : " 1 0,1 ";
				var arcSideb = (dx < 0) ? " 1 0,1 " : " 0 0,0 ";
					
				var main = "M " + src[0] + "," + src[1] + " A " + er + "," + er + arcSide + trg[0] + "," + trg[1];

				cx = (src[0]+trg[0])/2; //center of the line
				cy = (src[1]+trg[1])/2;

				//calculating control point according to er
				lineangle = Math.atan(dy/dx); //angle of the line between src and trg
				erangle = Math.asin((ra/2)/er); // angle of the arc
				rc = Math.tan(erangle)*(ra/2); // distance between direct line and control point

				cpx = Math.cos(lineangle-(Math.PI/2))*rc; // absolute coordinates of the ctrl point
				cpy = Math.sin(lineangle-(Math.PI/2))*rc;
				
				ctrx = cpx+cx; //coords of ctrl point relative to direct line
				ctry = cpy+cy;					

				trgangle = Math.atan((ctrx-trg[0])/(ctry-trg[1]));

				angle= Math.PI/2;	// set the angle so its always bending upwards
				if(trg[0]-src[0] < 0){
					angle = -Math.PI/2;
					if(trgangle < 0){arrowOffset = -arrowOffset;}
				}
				if(trg[0]-src[0] > 0){
					if(trgangle > 0){arrowOffset = -arrowOffset;}
				}


								
				dTrgX = trg[0]+Math.sin(trgangle)*arrowOffset;
				dTrgY = trg[1]+Math.cos(trgangle)*arrowOffset;
				
				TinX = dTrgX+(Math.sin(trgangle+angle)*mag);
				TinY = dTrgY+(Math.cos(trgangle+angle)*mag);
				ToutX = dTrgX+(Math.sin(trgangle-angle)*mag);
				ToutY = dTrgY+(Math.cos(trgangle-angle)*mag);
				
				curveOut= 'M'+ TinX + "," +TinY+' Q'+ctrx+','+ctry+' '+src[0] + "," + src[1];
				curveIn = ' Q'+ctrx+','+ctry+' '+ToutX + "," + ToutY;
				arrowHead= ' L' +trg[0] + "," + trg[1]+ ' '+ TinX + "," +TinY;
				
				finalArrow = curveOut + curveIn + arrowHead;
                
				//test drawings
				//var arcs = d3.select("#arcs");
				//arcs.append("path").attr("d",banzai).attr("stroke-width",1);

                return finalArrow ;
			  }

function CommaFormatted(nStr1) {
    nStr = nStr1 + '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}