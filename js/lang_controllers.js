/**
 * lang_controllers.js: language switcher
 */

// global variable lang
var lang;

$( document ).ready(function() {

	// get language var from url if one exists
	var langURL = getUrlVars()["lang"];
	var langCookie = Cookies.get('lang');

	if (langURL) {
		lang = langURL;
	} else if (langCookie) {
		lang = langCookie;
	} else {
		lang = 'en';
	}

	langSwitch(lang);

	// listen for language button clicks
	$(".english").click(function() {
		lang = 'en';
		langSwitch(lang);
	});

	$(".french").click(function() {
		lang = 'fr';
		langSwitch(lang);
	});

	$(".spanish").click(function() {
		lang = 'es';
		langSwitch(lang);
	});

	// function to get variable from url if one exists
	function getUrlVars() {
		var vars = {};
		var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
		});
		return vars;
	}

	function langSwitch (lang) {
		// ensure flow map is not showing any text

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

});
