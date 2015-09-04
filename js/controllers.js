/**
 * controller.js: listeners and controllers
 */


$( document ).ready(function() {

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
