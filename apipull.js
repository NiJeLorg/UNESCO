
var country = "ALL";
var indicators = "OFST_1_CP";
var start_yr = 2005;
var end_yr = 2015;


$.getJSON("http://www.uis.unesco.org/das/api/countries/?code=" + country 
	+ "&category=EDULIT_DS&indicators=" +  indicators 
	+ "&fromyear=" + start_yr 
	+ "&toyear=" + end_yr 
	+ "&mostrecent=false&fullprecision=false", 
	function (jsondata) {
		console.log(jsondata); 
	});

$.getJSON("http://www.uis.unesco.org/das/api/countries/?code=ALL&category=EDULIT_DS&indicators=OFST_1_CP&fromyear=2005&toyear=2015&mostrecent=false&fullprecision=false", function (jsondata) {
        console.log(jsondata);  // remember that getJSON is an asynchronous call if you try logging the variable to the console outside of the callback function, you’ll get an empty variable or undefined.
});

// var $indicators = [];
//     $indicators.push("OFST_1_CP");
//     $indicators.push("GER0T");
//     $indicators.push("GERFT");
//     $indicators.push("GERST");
//     $indicators.push("GERUT");

// var $countries = [];
//     $countries.push("ALB");
//     $countries.push("AUS");

// var $years = [];
//     $years.push("2000");
//     $years.push("2011");

// var queryInfo = {
//     countries: $ countries,
//     category: "EDULIT_DS",
//     indicators: $indicators,
//     years: $years,
//     getallcountries: false,
//     };

// $.ajax({  url: "http://www.uis.unesco.org/das/api/countries/",
//     type: 'POST',
//     dataType: 'json',
//     contentType: 'application/json',
//     data: JSON.stringify(queryInfo),
//     success: function (data, textStatus, jqXHR) {
//  	//process data here…
//     }});
