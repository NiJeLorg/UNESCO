/**
 * controller.js: listeners and controllers
 */


$( document ).ready(function() {

	// roll over menu items
	$(".explore-swatch").mouseenter(function() {
		$(this).find(".explore-swatch-element").removeClass("hidden");

	});
	$(".explore-swatch").mouseleave(function() {
		$(this).find(".swatch2").addClass("hidden");
		$(this).find(".swatchText").addClass("hidden");
	});

	// swap out the header image when carosel is changed
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
	});

	// toggle map layer listeners
	$(".toggle").click(function() {
		console.log($("#OOSCRatesMapToggleImage").attr("src"));
		if ($("#OOSCRatesMapToggleImage").attr("src") == 'css/images/OOScToggle_Primary.png') {
			$("#OOSCRatesMapToggleImage").attr("src", 'css/images/OOScToggle_LowerSecondary.png');
			$("#leftToggleText").css("color", "#d1d2d3");
			$("#rightToggleText").css("color", "#333");
			activeLayer = 'ROFST_2_CP';
			drawOOSCMap();
		} else {
			$("#OOSCRatesMapToggleImage").attr("src", 'css/images/OOScToggle_Primary.png');
			$("#rightToggleText").css("color", "#d1d2d3");
			$("#leftToggleText").css("color", "#333");
			activeLayer = 'ROFST_1_CP';
			drawOOSCMap();
		}

	});

});
