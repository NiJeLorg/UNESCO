/**
 * controller.js: listeners and controllers
 */


$( document ).ready(function() {

	// roll over menu items
	$(".explore-swatch").mouseenter(function() {
		$(this).find(".swatch2").removeClass("hidden");
		$(this).find(".swatchText:lang(" + lang +")").removeClass("hidden");
	});
	$(".explore-swatch").mouseleave(function() {
		$(this).find(".swatch2").addClass("hidden");
		$(this).find(".swatchText").addClass("hidden");
	});
	$(".explore-swatch").click(function() {
		// set session cookie for next page
		Cookies.set('visSelected', $(this).attr('id'));
		window.location = "edu.html";
	});

});
