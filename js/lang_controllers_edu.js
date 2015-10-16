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
	socialMediaLang(lang);

	// listen for language button clicks
	$(".english").click(function() {
		lang = 'en';
		langSwitchClick(lang);
		socialMediaLang(lang);
	});

	$(".french").click(function() {
		lang = 'fr';
		langSwitchClick(lang);
		socialMediaLang(lang);
	});

	$(".spanish").click(function() {
		lang = 'es';
		langSwitchClick(lang);
		socialMediaLang(lang);
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
		  // show circle of selected
		  centroids.selectAll('circle')
		    .transition()
		    .duration(50)
		    .attr("display", "none");

		  // show country name of selected
		  centroids.selectAll(".countryNameEn")
		    .transition()
		    .duration(50)
		    .attr("display", "none");

		  centroids.selectAll(".countryNameFr")
		    .transition()
		    .duration(50)
		    .attr("display", "none");

		  centroids.selectAll(".countryNameEs")
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

		// update onboarding
		if (lang == 'en') {
          var onboarding = "<p class=\"tooltip-text\">Click any country to see the amount of bilateral and multilateral aid contributed or received. Mouse over an arrow to see the flow of bilateral aid between countries.</p>";
        } else if (lang == 'fr') {
          var onboarding = "<p class=\"tooltip-text\">Cliquez sur un pays pour voir le montant d'aide à l'éducation de base versé ou reçu. Passez la souris sur une flèche pour voir le flux d'aide entre les pays.</p>";
        } else {
          var onboarding = "<p class=\"tooltip-text\">Haga click en cualquier país para visualizar el monto de la ayuda aportada o recibida. Desplace el mouse sobre la flecha para mostrar el flujo de ayuda entre los países.</p>";
        }         

        divOnboarding.html(onboarding)  
          .style("left", "30px") 
          .style("top", "85px");

	}


	function socialMediaLang(lang) {

	   // facebook and twitter link creation for take action page -- first image - Child's Eyes

	    var app_id = '1519242675033424';
	    if (lang == 'en') {
		    var fbcaption = 'The world has pledged 12 years of education for all, but with millions of children out of school and aid to education stalling, how far are we from the goal? Explore & share @UNESCOstat\'s interactive maps.';
	    } else if (lang == 'fr') {
		    var fbcaption = 'Le monde a promis 12 années de scolarité pour tous, mais avec des millions d’enfants non scolarisés et une aide à l’éducation qui stagne, sommes-nous loin de notre objectif? Explorez & partagez les cartes interactives.';
	    } else {
	    	var fbcaption = 'El mundo se ha comprometido a brindar 12 años de educación para todos, pero con millones de niños fuera de la escuela y el estancamiento de la ayuda económica. ¿qué tan lejos estamos de la meta? Explora y comparte los mapas interactivos.';
	    } 
	    var fblink = 'http://www.uis.unesco.org/_LAYOUTS/UNESCO/education-2030/';
	    var fbUrl = 'https://www.facebook.com/dialog/feed?app_id=' + app_id + '&display=popup&caption='+ encodeURIComponent(fbcaption) + '&link=' + encodeURIComponent(fblink) + '&redirect_uri=' + encodeURIComponent(fblink);
	    $('#shareFacebook').attr("href", fbUrl);

		var twitterlink = 'http://bit.ly/1Mu5jzr';
	    var via = 'UNESCOstat';
	    if (lang == 'en') {
			var twittercaption = ' Is aid to #education reaching children who need it most? Explore the data:';
		} else if (lang == 'fr') {
			var twittercaption = ' L\'aide à l\'éducation atteint-elle les enfants qui en ont le plus besoin?';
	    } else {
			var twittercaption = ' ¿Está llegando la ayuda destinada a educación a los niños que más lo necesitan?';
	    }
	         
	    if (lang == 'en') {
			var imgurl = 'pic.twitter.com/eYmY4vLpjD';
		} else if (lang == 'fr') {
			var imgurl = 'pic.twitter.com/S5XL6R2h4T';
	    } else {
			var imgurl = 'pic.twitter.com/nPs1Qe3ejy';
	    }     
	 

	    var twitterUrl = 'https://twitter.com/share?url=' + encodeURIComponent(twitterlink) + '&via='+ encodeURIComponent(via) + '&text=' + imgurl + encodeURIComponent(twittercaption);
	    $('#shareTwitter').attr("href", twitterUrl);


	   // facebook and twitter link creation for take action page -- second image FCEMap
	    var app_id = '1519242675033424';
	    if (lang == 'en') {
		    var fbcaption = 'The world has pledged 12 years of education for all, but with millions of children out of school and aid to education stalling, how far are we from the goal? Explore & share @UNESCOstat\'s interactive maps.';
	    } else if (lang == 'fr') {
		    var fbcaption = 'Le monde a promis 12 années de scolarité pour tous, mais avec des millions d’enfants non scolarisés et une aide à l’éducation qui stagne, sommes-nous loin de notre objectif? Explorez & partagez les cartes interactives.';
	    } else {
	    	var fbcaption = 'El mundo se ha comprometido a brindar 12 años de educación para todos, pero con millones de niños fuera de la escuela y el estancamiento de la ayuda económica. ¿Qué tan lejos estamos de la meta? Explora y comparte los mapas interactivos.';
	    } 
	    var fblink = 'http://www.uis.unesco.org/_LAYOUTS/UNESCO/education-2030/';
	    var fbUrl = 'https://www.facebook.com/dialog/feed?app_id=' + app_id + '&display=popup&caption='+ encodeURIComponent(fbcaption) + '&link=' + encodeURIComponent(fblink) + '&redirect_uri=' + encodeURIComponent(fblink);
	    $('#takeactionFacebook1').attr("href", fbUrl);

		var twitterlink = 'http://bit.ly/1Mu5jzr';
	    var via = 'UNESCOstat';
	    if (lang == 'en') {
			var twittercaption = ' Is aid to #education reaching children who need it most? Explore the data:';
		} else if (lang == 'fr') {
			var twittercaption = ' L\'aide à l\'éducation atteint-elle les enfants qui en ont le plus besoin?';
	    } else {
			var twittercaption = ' ¿Está llegando la ayuda destinada a educación a los niños que más lo necesitan?';
	    } 

	    if (lang == 'en') {
			var imgurl = 'pic.twitter.com/eYmY4vLpjD';
		} else if (lang == 'fr') {
			var imgurl = 'pic.twitter.com/S5XL6R2h4T';
	    } else {
			var imgurl = 'pic.twitter.com/nPs1Qe3ejy';
	    }       

	    var twitterUrl = 'https://twitter.com/share?url=' + encodeURIComponent(twitterlink) + '&via='+ encodeURIComponent(via) + '&text=' + imgurl + encodeURIComponent(twittercaption);
	    $('#takeactionTwitter1').attr("href", twitterUrl);


	    // facebook and twitter link creation for take action page -- third image FLOW Map
	    var app_id = '1519242675033424';
	    if (lang == 'en') {
		    var fbcaption = 'The world has pledged 12 years of education for all, but with millions of children out of school and aid to education stalling, how far are we from the goal? Explore & share @UNESCOstat\'s interactive maps.';
	    } else if (lang == 'fr') {
		    var fbcaption = 'Le monde a promis 12 années de scolarité pour tous, mais avec des millions d’enfants non scolarisés et une aide à l’éducation qui stagne, sommes-nous loin de notre objectif? Explorez & partagez les cartes interactives.';
	    } else {
	    	var fbcaption = 'El mundo se ha comprometido a brindar 12 años de educación para todos, pero con millones de niños fuera de la escuela y el estancamiento de la ayuda económica. ¿Qué tan lejos estamos de la meta? Explora y comparte los mapas interactivos.';
	    } 
	    var fblink = 'http://www.uis.unesco.org/_LAYOUTS/UNESCO/education-2030/';
	    var fbUrl = 'https://www.facebook.com/dialog/feed?app_id=' + app_id + '&display=popup&caption='+ encodeURIComponent(fbcaption) + '&link=' + encodeURIComponent(fblink) + '&redirect_uri=' + encodeURIComponent(fblink);
	    $('#takeactionFacebook2').attr("href", fbUrl);

		var twitterlink = 'http://bit.ly/1Mu5jzr';
	    var via = 'UNESCOstat';
	    if (lang == 'en') {
			var twittercaption = ' Girls are the first to be excluded. #FundEducation Explore the data:';
		} else if (lang == 'fr') {
			var twittercaption = ' L\'aide à l\'éducation atteint-elle les enfants qui en ont le plus besoin?';
	    } else {
			var twittercaption = ' ¿Está llegando la ayuda destinada a educación a los niños que más lo necesitan?';
	    } 

	    if (lang == 'en') {
			var imgurl = 'pic.twitter.com/DwouUX595I';
		} else if (lang == 'fr') {
			var imgurl = 'pic.twitter.com/AEQ2cF3Lzz';
	    } else {
			var imgurl = 'pic.twitter.com/XibasbMLaU';
	    }     


	    var twitterUrl = 'https://twitter.com/share?url=' + encodeURIComponent(twitterlink) + '&via='+ encodeURIComponent(via) + '&text=' + imgurl  + encodeURIComponent(twittercaption);
	    $('#takeactionTwitter2').attr("href", twitterUrl);


	    // facebook and twitter link creation for take action page -- top of page - DEFAULT
	    var app_id = '1519242675033424';
	    if (lang == 'en') {
		    var fbcaption = 'The world has pledged 12 years of education for all, but with millions of children out of school and aid to education stalling, how far are we from the goal? Explore & share @UNESCOstat\'s interactive maps.';
	    } else if (lang == 'fr') {
		    var fbcaption = 'Le monde a promis 12 années de scolarité pour tous, mais avec des millions d’enfants non scolarisés et une aide à l’éducation qui stagne, sommes-nous loin de notre objectif? Explorez & partagez les cartes interactives.';
	    } else {
	    	var fbcaption = 'El mundo se ha comprometido a brindar 12 años de educación para todos, pero con millones de niños fuera de la escuela y el estancamiento de la ayuda económica. ¿Qué tan lejos estamos de la meta? Explora y comparte los mapas interactivos.';
	    } 
	    var fblink = 'http://www.uis.unesco.org/_LAYOUTS/UNESCO/education-2030/';
	    var fbUrl = 'https://www.facebook.com/dialog/feed?app_id=' + app_id + '&display=popup&caption='+ encodeURIComponent(fbcaption) + '&link=' + encodeURIComponent(fblink) + '&redirect_uri=' + encodeURIComponent(fblink);
	    $('#takeactionFacebook3').attr("href", fbUrl);

		var twitterlink = 'http://bit.ly/1Mu5jzr';
	    var via = 'UNESCOstat';
	    if (lang == 'en') {
			var twittercaption = ' Where is aid to #education going today? #FundEducation';
		} else if (lang == 'fr') {
			var twittercaption = ' L\'aide à l\'éducation atteint-elle les enfants qui en ont le plus besoin?';
	    } else {
			var twittercaption = ' ¿Está llegando la ayuda destinada a educación a los niños que más lo necesitan?';
	    }

	    if (lang == 'en') {
			var imgurl = 'pic.twitter.com/eYmY4vLpjD';
		} else if (lang == 'fr') {
			var imgurl = 'pic.twitter.com/S5XL6R2h4T';
	    } else {
			var imgurl = 'pic.twitter.com/nPs1Qe3ejy';
	    }       

	    var twitterUrl = 'https://twitter.com/share?url=' + encodeURIComponent(twitterlink) + '&via='+ encodeURIComponent(via) + '&text=' + imgurl + encodeURIComponent(twittercaption);
	    $('#takeactionTwitter3').attr("href", twitterUrl);

	} // close function socialMediaLang(lang)

});
