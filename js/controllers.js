/**
 * controller.js: listeners and controllers
 */


$( document ).ready(function() {

	// functions for roll over menu items
	function highlight(sel) {
		$(sel).find(".explore-swatch-element").removeClass("hidden");
		$(sel).find(".swatchText").css("left", "70px");
	}

	function removeHighlight(sel) {
		$(sel).find(".swatch2").addClass("hidden");
		$(sel).find(".swatchText").css("left", "50px");		
	}

	// roll over menu items
	$(".explore-swatch").mouseenter(function() {
		highlight(this);
	});
	$(".explore-swatch").mouseleave(function() {
		if (!$(this).hasClass("highlighted")) {
			removeHighlight(this);
		}
	});
	$(".explore-swatch").click(function() {
		// remove all highlighted classes, and add back to the one clicked
		$(".explore-swatch").removeClass("highlighted");
		$(this).addClass("highlighted");

		// remove all menu highlights
		removeHighlight(".explore-swatch");

		// add highlight to this one clicked
		highlight(this);

		// set session cookie for next page
		if ($(this).attr('id') == "GlobalEducationGoals") {
			$('#carousel').carousel(0);
		} else if ($(this).attr('id') == "OutofSchoolChildren") {
			$('#carousel').carousel(1);
		} else if ($(this).attr('id') == "FlowofEducationAid") {
			$('#carousel').carousel(2);	
		} else if ($(this).attr('id') == "TakeAction") {
			$('#carousel').carousel(3);		
		}
	});

	// rotate carousel based on selection
	if ($.cookie('visSelected') == "GlobalEducationGoals") {
		$('#carousel').carousel(0);
		highlight("#GlobalEducationGoals");
		$("#GlobalEducationGoals").addClass("highlighted");
	} else if ($.cookie('visSelected') == "OutofSchoolChildren") {
		$('#carousel').carousel(1);
		highlight("#OutofSchoolChildren");
		$("#OutofSchoolChildren").addClass("highlighted");
	} else if ($.cookie('visSelected') == "FlowofEducationAid") {
		$('#carousel').carousel(2);	
		highlight("#FlowofEducationAid");
		$("#FlowofEducationAid").addClass("highlighted");
	} else if ($.cookie('visSelected') == "TakeAction") {
		$('#carousel').carousel(3);		
		highlight("#TakeAction");
		$("#TakeAction").addClass("highlighted");
	}

	

	// swap out the active menu when the carosel is changed
	$('#carousel').on('slid.bs.carousel', function () {
	/*
	  if ($('div.active').index() == 0) {
	  	$("#header-image").attr("src", 'css/images/Education2030Logo_Small1.png');
	  } else if ($('div.active').index() == 1) {
	  	$("#header-image").attr("src", 'css/images/Education2030Logo_Small2.png');	  	
	  } else if ($('div.active').index() == 2) {
	  	$("#header-image").attr("src", 'css/images/Education2030Logo_Small3.png');	  	
	  } else if ($('div.active').index() == 3) {
	  	$("#header-image").attr("src", 'css/images/Education2030Logo_Small4.png');	  	
	  }
	*/
		// remove all menu highlights
		removeHighlight(".explore-swatch");

		$(".explore-swatch").removeClass("highlighted");

		if ($('div.active').index() == 0) {
			highlight("#GlobalEducationGoals");
			$("#GlobalEducationGoals").addClass("highlighted");
		} else if ($('div.active').index() == 1) {
			highlight("#OutofSchoolChildren");
			$("#OutofSchoolChildren").addClass("highlighted");
		} else if ($('div.active').index() == 2) {
			highlight("#FlowofEducationAid");
			$("#FlowofEducationAid").addClass("highlighted");
		} else if ($('div.active').index() == 3) {
			highlight("#TakeAction");
			$("#TakeAction").addClass("highlighted");
		}

	});

	// toggle map layer listeners
	$(".toggle").click(function() {
		if ($("#OOSCRatesMapToggleImage").attr("src") == 'css/images/OOScToggle_Primary.png') {
			$("#OOSCRatesMapToggleImage").attr("src", 'css/images/OOScToggle_LowerSecondary.png');
			$("#leftToggleText").css("color", "#d1d2d3");
			$("#rightToggleText").css("color", "#333");
			activeLayer = 'ROFST_2_CP';
			drawOOSCMap();
			// swap out legend
			$("#OOSCRatesMapLegend1").addClass("hidden");
			$("#OOSCRatesMapLegend2").removeClass("hidden");
		} else {
			$("#OOSCRatesMapToggleImage").attr("src", 'css/images/OOScToggle_Primary.png');
			$("#rightToggleText").css("color", "#d1d2d3");
			$("#leftToggleText").css("color", "#333");
			activeLayer = 'ROFST_1_CP';
			drawOOSCMap();
			// swap out legend
			$("#OOSCRatesMapLegend2").addClass("hidden");
			$("#OOSCRatesMapLegend1").removeClass("hidden");

		}

	});

    // facebook and twitter link creation and appending nav bar on top
    var app_id = '1519242675033424';
    var fbcaption = 'The world has pledged 12 years of education for all, but with millions of children out of school and aid to education stalling, how far are we from the goal? Explore & share @UNESCOstat\'s interactive maps.';
    var fblink = 'http://www.uis.unesco.org/_LAYOUTS/UNESCO/education-2030/';
    var fbUrl = 'https://www.facebook.com/dialog/feed?app_id=' + app_id + '&display=popup&caption='+ encodeURIComponent(fbcaption) + '&link=' + encodeURIComponent(fblink) + '&redirect_uri=' + encodeURIComponent(fblink);
    $('#shareFacebook').attr("href", fbUrl);

	var twitterlink = 'http://bit.ly/1Mu5jzr';
    var via = 'UNESCOstat';
    var twittercaption = ' Is global aid to #education reaching children who need it most? Explore @UNESCOstat\'s data map:';
    var twitterUrl = 'https://twitter.com/share?url=' + encodeURIComponent(twitterlink) + '&via='+ encodeURIComponent(via) + '&text=http://bit.ly/1JtEmqR' + encodeURIComponent(twittercaption);
    $('#shareTwitter').attr("href", twitterUrl);


    // facebook and twitter link creation for take action page -- first image
    var app_id = '1519242675033424';
    var fbcaption = 'The world has pledged 12 years of education for all, but with millions of children out of school and aid to education stalling, how far are we from the goal? Explore & share @UNESCOstat\'s interactive maps.';
    var fblink = 'http://www.uis.unesco.org/_LAYOUTS/UNESCO/education-2030/';
    var fbUrl = 'https://www.facebook.com/dialog/feed?app_id=' + app_id + '&display=popup&caption='+ encodeURIComponent(fbcaption) + '&link=' + encodeURIComponent(fblink) + '&redirect_uri=' + encodeURIComponent(fblink);
    $('#takeactionFacebook1').attr("href", fbUrl);

	var twitterlink = 'http://bit.ly/1Mu5jzr';
    var via = 'UNESCOstat';
    var twittercaption = ' Is global aid to #education reaching children who need it most? Explore @UNESCOstat\'s data map:';
    var twitterUrl = 'https://twitter.com/share?url=' + encodeURIComponent(twitterlink) + '&via='+ encodeURIComponent(via) + '&text=http://bit.ly/1JtEmqR' + encodeURIComponent(twittercaption);
    $('#takeactionTwitter1').attr("href", twitterUrl);


    // facebook and twitter link creation for take action page -- second image
    var app_id = '1519242675033424';
    var fbcaption = 'The world has pledged 12 years of education for all, but with millions of children out of school and aid to education stalling, how far are we from the goal? Explore & share @UNESCOstat\'s interactive maps.';
    var fblink = 'http://www.uis.unesco.org/_LAYOUTS/UNESCO/education-2030/';
    var fbUrl = 'https://www.facebook.com/dialog/feed?app_id=' + app_id + '&display=popup&caption='+ encodeURIComponent(fbcaption) + '&link=' + encodeURIComponent(fblink) + '&redirect_uri=' + encodeURIComponent(fblink);
    $('#takeactionFacebook2').attr("href", fbUrl);

	var twitterlink = 'http://bit.ly/1Mu5jzr';
    var via = 'UNESCOstat';
    var twittercaption = ' Is global aid to #education reaching children who need it most? Explore @UNESCOstat\'s data map:';
    var twitterUrl = 'https://twitter.com/share?url=' + encodeURIComponent(twitterlink) + '&via='+ encodeURIComponent(via) + '&text=' + encodeURIComponent(twittercaption);
    $('#takeactionTwitter2').attr("href", twitterUrl);


    // facebook and twitter link creation for take action page -- third image
    var app_id = '1519242675033424';
    var fbcaption = 'The world has pledged 12 years of education for all, but with millions of children out of school and aid to education stalling, how far are we from the goal? Explore & share @UNESCOstat\'s interactive maps.';
    var fblink = 'http://www.uis.unesco.org/_LAYOUTS/UNESCO/education-2030/';
    var fbUrl = 'https://www.facebook.com/dialog/feed?app_id=' + app_id + '&display=popup&caption='+ encodeURIComponent(fbcaption) + '&link=' + encodeURIComponent(fblink) + '&redirect_uri=' + encodeURIComponent(fblink);
    $('#takeactionFacebook3').attr("href", fbUrl);

	var twitterlink = 'http://bit.ly/1Mu5jzr';
    var via = 'UNESCOstat';
    var twittercaption = ' Is global aid to #education reaching children who need it most? Explore @UNESCOstat\'s data map:';
    var twitterUrl = 'https://twitter.com/share?url=' + encodeURIComponent(twitterlink) + '&via='+ encodeURIComponent(via) + '&text=' + encodeURIComponent(twittercaption);
    $('#takeactionTwitter3').attr("href", twitterUrl);




});
