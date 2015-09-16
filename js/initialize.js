/**
 * initialize.js: pulls API data and runs initila functions
 */

// initialize by running functions in order
getApiData();

// function to get API data
function getApiData() {
	$.getJSON("http://www.uis.unesco.org/das/api/countries/?code=ALL&category=EDULIT_DS&indicators=ROFST_1_CP,ROFST_2_CP,OFST_1_F_CP,OFST_1_M_CP,OFST_2_F_CP,OFST_2_M_CP&fromyear=2009&toyear=2020&mostrecent=true&fullprecision=false&callback=?", function (rate) {
		apidata = rate;
		// run FCEMap
		createFCEMap();
		// run OOSCRatesMap
		createOOSCRatesMap();
		// run EducationAidFlowMap
		createEducationAidFlowMap();

	});
}
