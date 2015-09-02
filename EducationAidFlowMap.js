/**
 * EducationAidFlowMap.js: Javascript to draw the aid flows map
 */

// set up variables
var w = 1000;
var h = 600;

var useGreatCircles = true;

var projection = d3.geo.equirectangular()
    .scale((w + 1) / 2 / Math.PI)
    .translate([w / 2, h / 2])
    .precision(.1);


var path = d3.geo.path()
    .projection(projection);

var arc = d3.geo.greatArc().precision(3);

var svg2 = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h);

var countries = svg2.append("g").attr("id", "countries");
var centroids = svg2.append("g").attr("id", "centroids");
var arcs = svg2.append("g").attr("id", "arcs");

var color_donor = d3.scale.threshold()
    color_donor.domain([10000,100000,1000000,1000000000]); 
    color_donor.range(["#33B874","#ABE2C6","#959CC7","#5561A6"]);

var color_recipient = d3.scale.threshold()
    color_recipient.domain([10000,100000,1000000,1000000000]); 
    color_recipient.range(["#33B874","#ABE2C6","#959CC7","#5561A6"]);



d3.loadData = function() {
    var loadedCallback = null;
    var toload = {};
    var data = {};
    var loaded = function(name, d) {
      delete toload[name];
      data[name] = d;
      return notifyIfAll();
    };
    var notifyIfAll = function() {
      if ((loadedCallback != null) && d3.keys(toload).length === 0) {
        loadedCallback(data);
      }
    };
    var loader = {
      json: function(name, url) {
        toload[name] = url;
        d3.json(url, function(d) {
          return loaded(name, d);
        });
        return loader;
      },
      csv: function(name, url) {
        toload[name] = url;
        d3.csv(url, function(d) {
          return loaded(name, d);
        });
        return loader;
      },
      onload: function(callback) {
        loadedCallback = callback;
        notifyIfAll();
      }
    };
    return loader;
};


d3.loadData()
  .json('countries', 'world-countries.json')
  .csv('nodes', 'OECD_Nodes.csv')
  .csv('flows', 'OECD_Edges.csv')
  .onload(function(data) {

    //variable set up
    var nodeDataByCode = {}, links = [];
    var maxMagnitude =
      d3.max(data.flows, function(d) { 
      	d.Total = d.Total.replace(/,/g , '');
      	return parseFloat(d.Total);
      });
    var magnitudeFormat = d3.format(",.0f");

    var arcWidth = d3.scale.linear().domain([1, maxMagnitude]).range([.1, 7]);
    var minColor = '#f0f0f0', maxColor = 'rgb(8, 48, 107)';
    var arcColor = d3.scale.log().domain([1, maxMagnitude]).range([minColor, maxColor]);
    var arcOpacity = d3.scale.log().domain([1, maxMagnitude]).range([0.3, 1]);

    // function to parse raw node lat lons to array
    function nodeCoords(node) { 
      var lon = parseFloat(node.Lon), lat = parseFloat(node.Lat);
      if (isNaN(lon) || isNaN(lat)) return null;
      return [lon, lat]; 
    }

    data.nodes.forEach(function(node) {
      //construct lon,lat array for each node and pass to nodeDataByCode
      node.coords = nodeCoords(node);
      node.projection = node.coords ? projection(node.coords) : undefined;
      nodeDataByCode[node.Country_Code] = node;

    });

    //create link array from flows
    data.flows.forEach(function(flow) {
      var o = nodeDataByCode[flow.UIS_Source_Code], co = o.coords, po = o.projection;
      var d = nodeDataByCode[flow.UIS_Target_Code], cd = d.coords, pd = d.projection;
      flow.Total = flow.Total.replace(/,/g , '');
      var magnitude = parseFloat(flow.Total);
      if (co  &&  cd  &&  !isNaN(magnitude)) {
        links.push({
          source: co, target: cd,
          magnitude: magnitude,
          origin:o, dest:d,
          originp: po, destp:pd 
        });
      }
    });

    // add donor and recipient tag and magnitude to data.countries.features.properties
    data.countries.features.forEach(function(feature){
      // append "Donor" or "Recipient" to data.countries.features.properties
      for (var i = 0; i < data.nodes.length; i++) {
        //compare node and features -- add to properties if the same country    
        if (feature.id == data.nodes[i].OECD_Country_Code) {
          //Copy the data value into the JSON
          feature.properties.Donor_or_Recipient = data.nodes[i].Donor_or_Recipient;  
          //Stop looking through the JSON
          break;      
        }
      } 

      // set Total for each conuntry = 0 before summing
      feature.properties.Total = 0;
      // append total from flows   
      for (var i = 0; i < data.flows.length; i++) {
        if (feature.properties.Donor_or_Recipient == 'Donor') {
          if (feature.id == data.flows[i].ISO_Source_Code) {
            var total = data.flows[i].Total.replace(/,/g , '');
            total = parseFloat(total);
            if (!isNaN(total)) {
              feature.properties.Total = feature.properties.Total + total; 
            } 
          }
        } else {
          if (feature.id == data.flows[i].ISO_Target_Code) {
            var total = data.flows[i].Total.replace(/,/g , '');
            total = parseFloat(total);
            if (!isNaN(total)) {
              feature.properties.Total = feature.properties.Total + total; 
            } 
          }
        }
      } 

    });

    //draw map and color based on donor/recipient
    countries.selectAll("path")
      .data(data.countries.features)
      .enter().append("path")
      .attr("d", path)
      .style("stroke", "#4d4d4d")
      .style("stroke-width", "1px")
      .style("fill", function(d) { 
        if (d.properties.Donor_or_Recipient == 'Donor') {
          return color_donor(d.properties.Total);
        } else {
          return color_recipient(d.properties.Total);
        }
      });



    centroids.selectAll("circle")
      .data(data.nodes.filter(function(node) { return node.projection ? true : false }))
      .enter().append("circle")
      .attr("cx", function(d) { return d.projection[0] } )
      .attr("cy", function(d) { return d.projection[1] } )
      .attr("r", 1)
      .attr("fill", "#000")
      .attr("opacity", 0.5)
      ;

    var strokeFun = function(d) { return arcColor(d.magnitude); };

    function splitPath(path) {
      var avgd = 0, i, d;
      var c, pc, dx, dy;
      var points = path.split("L");
      if (points.length < 2) return path;
      var newpath = [ points[0] ];
      var coords = points.map(function(d, i) {
        return d.substr(i > 0 ? 0 : 1).split(","); // remove M and split
      });

      // calc avg dist between points
      for (i = 1; i < coords.length; i++) {
        pc = coords[i-1]; c = coords[i];
        dx = c[0] - pc[0]; dy = c[1] - pc[1];
        d = Math.sqrt(dx*dx + dy*dy);
        c.push(d);  // push dist as last elem of c
        avgd += d;
      }
      avgd /= coords.length - 1;

      // for points with long dist from prev use M instead of L
      for (i = 1; i < coords.length; i++) {
        c = coords[i];
        newpath.push((c[2] > 5 * avgd ? "M" : "L") + points[i]);
      }
      return newpath.join("");
    }
    
    var gradientNameFun = function(d) { return "grd"+d.origin.Country_Code+d.dest.Country_Code; };
    var gradientRefNameFun = function(d) { return "url(#"+gradientNameFun(d)+")"; };

    var defs = svg2.append("svg:defs");

    // see http://apike.ca/prog_svg_patterns.html
    defs.append("marker")
      .attr("id", "arrowHead")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 10)
      .attr("refY", 5)
      .attr("orient", "auto")
      //.attr("markerUnits", "strokeWidth")
      .attr("markerUnits", "userSpaceOnUse")
      .attr("markerWidth", 4*2)
      .attr("markerHeight", 3*2)
    .append("polyline")
      .attr("points", "0,0 10,5 0,10 1,5")
      .attr("fill", maxColor)
      //.attr("opacity", 0.5)
      ;


    var gradient = defs.selectAll("linearGradient")
      .data(links)
    .enter()
      .append("svg:linearGradient")
        .attr("id", gradientNameFun)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", function(d) { return d.originp[0]; })
        .attr("y1", function(d) { return d.originp[1]; })
        .attr("x2", function(d) { return d.destp[0]; })
        .attr("y2", function(d) { return d.destp[1]; })
        ;

    gradient.append("svg:stop")
        .attr("offset", "0%")
        .attr("stop-color", minColor)
        .attr("stop-opacity", .0);
    gradient.append("svg:stop")
        .attr("offset", "80%")
        .attr("stop-color", strokeFun)
        .attr("stop-opacity", 1.0);
    gradient.append("svg:stop")
        .attr("offset", "100%")
        .attr("stop-color", strokeFun)
        .attr("stop-opacity", 1.0);



    var arcNodes = arcs.selectAll("path")
      .data(links)
    .enter().append("path")
      //.attr("visibility", function(d) { return d.magnitude > 500 ? "visible" : "hidden"})
      .attr("stroke", gradientRefNameFun)
      //.attr("stroke", "red")
      //.attr("opacity", function(d) { return arcOpacity(d.magnitude); })
      //.attr("stroke", strokeFun)
      .attr("stroke-linecap", "round")
      .attr("stroke-width", function(d) { return arcWidth(d.magnitude); })
      .attr("d", function(d) { 
        if (useGreatCircles)
          return splitPath(path(arc(d)));
        else 
          return path({
            type: "LineString",
            coordinates: [d.source, d.target]
          });
      })
      .sort(function(a, b) {
        var a = a.magnitude, b = b.magnitude;
        if (isNaN(a)) if (isNaN(b)) return 0; else return -1; if (isNaN(b)) return 1;
        return d3.ascending(a, b); 
      });
    arcNodes.on("mouseover", function(d) { 
      d3.select(this)
        .attr("stroke", "red")
        .attr("marker-end", "url(#arrowHead)");
    })
    arcNodes.on("mouseout", function(d) {
        d3.select(this)
          .attr("marker-end", "none")
          .attr("stroke", gradientRefNameFun); })
    ;


    arcNodes.append("svg:title")
      .text(function(d) {
        return d.origin.Name+" -> "+d.dest.Name+"\n"+
               "Refugees in: " +magnitudeFormat(d.magnitude); 
    })
    ;

  });