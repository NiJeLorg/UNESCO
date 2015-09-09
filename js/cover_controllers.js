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
	$(".explore-swatch").click(function() {
		// set session cookie for next page
		$.cookie('visSelected', $(this).attr('id'));
		window.location = "edu.html";
	});

});
