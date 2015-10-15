/**
 * lang_controllers.js: language switcher
 */


$( document ).ready(function() {

	// get language var from url if one exists
	var langCookie = Cookies.get('lang');
	var langURL = getUrlVars()["lang"];

	if (langCookie) {
		lang = langCookie;
	} else if (langURL) {
		lang = langURL;
	} else {
		lang = 'en';
	}

	langSwitchIni(lang);

	// listen for language button clicks
	$(".english").click(function() {
		lang = 'en';
		langSwitchClick(lang);
	});

	$(".french").click(function() {
		lang = 'fr';
		langSwitchClick(lang);
	});

	$(".spanish").click(function() {
		lang = 'es';
		langSwitchClick(lang);
	});

	// function to get variable from url if one exists
	function getUrlVars() {
		var vars = {};
		var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
		});
		return vars;
	}

	function langSwitchIni (lang) {
		// hide all 
		$( '*:lang("en")' ).addClass('hidden');
		$( '*:lang("fr")' ).addClass('hidden');
		$( '*:lang("es")' ).addClass('hidden');

		// show the one we want
		$( '*:lang(' + lang +')' ).removeClass('hidden');

		// hide text we want hidden
		$( '.swatchText' ).addClass('hidden');

		// show the text that's active
		if ($('div.active').index() == 0) {
			$("#GlobalEducationGoals").find(".swatchText:lang(" + lang +")").removeClass("hidden");
		} else if ($('div.active').index() == 1) {
			$("#OutofSchoolChildren").find(".swatchText:lang(" + lang +")").removeClass("hidden");
		} else if ($('div.active').index() == 2) {
			$("#FlowofEducationAid").find(".swatchText:lang(" + lang +")").removeClass("hidden");
		} else if ($('div.active').index() == 3) {
			$("#TakeAction").find(".swatchText:lang(" + lang +")").removeClass("hidden");
		}

		// set a cookie
		Cookies.set('lang', lang);


	}

	function langSwitchClick (lang) {

		langSwitchIni(lang);

		// reset the aid flow map
		  clicked = false;
		  console.log(centroids);
		  // show circle of selected
		  centroids.selectAll('circle')
		    .transition()
		    .duration(50)
		    .attr("display", "none");

		  // show country name of selected
		  centroids.selectAll(".countryName")
		    .transition()
		    .duration(50)
		    .attr("display", "none");

		  // show bubble text of selected
		  centroids.selectAll(".bubbleTextEn")
		    .transition()
		    .duration(50)
		    .attr("display", "none");

		  centroids.selectAll(".bubbleTextFr")
		    .transition()
		    .duration(50)
		    .attr("display", "none");

		  centroids.selectAll(".bubbleTextEs")
		    .transition()
		    .duration(50)
		    .attr("display", "none");

		  // show arcs of countries that are in source or target
		  arcs.selectAll("path")
		    .transition()
		    .duration(0)
		    .attr("fill", "#111")
		    .attr("fill-opacity", 0.75)
		    .attr("stroke-opacity", 0.75)
		    .attr("stroke", "#111")
		    .attr("display", "none");

		  //highlight the countries that are donors or recipients
		  countries.selectAll("path")
		    .transition()
		    .duration(50)
		    .style("stroke-width", "1px")
		    .style("fill-opacity", 1);

	}


});
