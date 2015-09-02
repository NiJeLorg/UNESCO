/**
 * controller.js: listeners and controllers
 */


$( document ).ready(function() {

	// toggle map layer listeners
	$( "input[name='OOSClayers']" ).change(function() {
		activeLayer = $("input[name='OOSClayers']:checked").val();
		drawOOSCMap();
	});

});
