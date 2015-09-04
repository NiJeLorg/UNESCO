/**
 * EducationAidFlowMap.js: Javascript to draw the aid flows map
 */

var useGreatCircles = true;
var arc = d3.geo.greatArc().precision(3);

var svg3 = d3.select("#EducationAidFlowMap")
    .append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var countries = svg3.append("g").attr("id", "countries");
var centroids = svg3.append("g").attr("id", "centroids");
var arcs = svg3.append("g").attr("id", "arcs");

var color_donor = d3.scale.threshold()
    color_donor.domain([9.9,19.9,29.9,100]); 
    color_donor.range(["#d2e3f2","#a4c8e4","#77acd7","#4991c9", "#1c75bc"]);

var color_recipient = d3.scale.threshold()
    color_recipient.domain([9.9,19.9,29.9,100]); 
    color_recipient.range(["#fcded4","#f9bda9","#f79c7f","#f47b54","#ef4136"]);


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
  .json('countries', '../data/world-countries.json')
  .csv('nodes', '../data/OECD_Nodes.csv')
  .csv('flows', '../data/OECD_Edges.csv')
  .onload(function(data) {

    //variable set up
    var nodeDataByCode = {}, links = [];
    var maxMagnitude =
      d3.max(data.flows, function(d) { 
      	d.Total = d.Total.replace(/,/g , '');
      	return parseFloat(d.Total);
      });
    var magnitudeFormat = d3.format(",.0f");

    var arcWidth = d3.scale.linear().domain([1, maxMagnitude]).range([0.5, 10]);
    var minColor = '#f0f0f0', maxColor = 'rgb(8, 48, 107)';
    var arcColor = d3.scale.log().domain([1, maxMagnitude]).range([minColor, maxColor]);

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
      node.Total = 0;
      // total the amounts from flows for each node
      for (var i = 0; i < data.flows.length; i++) {
        if (node.Donor_or_Recipient == 'Donor') {
          if (node.OECD_Country_Code == data.flows[i].ISO_Source_Code) {
            var total = data.flows[i].Total.replace(/,/g , '');
            total = parseFloat(total);
            if (!isNaN(total)) {
              node.Total = node.Total + total; 
            } 
          }
        } else {
          if (node.OECD_Country_Code == data.flows[i].ISO_Target_Code) {
            var total = data.flows[i].Total.replace(/,/g , '');
            total = parseFloat(total);
            if (!isNaN(total)) {
              node.Total = node.Total + total; 
            } 
          }
        }
      } 
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

      // here we can attach an on click that highlights the connected countries, brign forward the connections...


    centroids.selectAll("circle")
      .data(data.nodes.filter(function(node) { return node.projection ? true : false }))
      .enter().append("circle")
      .attr("cx", function(d) { return d.projection[0] } )
      .attr("cy", function(d) { return d.projection[1] } )
      .attr("r", 100)
      .attr("fill", "#fff")
      .attr("stroke", "#4d4d4d")
      .attr("stroke-width", 3)
      .attr("opacity", 0);

    centroids.selectAll(".countryName")
      .data(data.nodes.filter(function(node) { return node.projection ? true : false }))
      .enter().append("text")
      .attr("class", "countryName")
      .attr("font-size", "18px")
      .attr("font-weight", 600)
      .attr("font-family", "Helvetica")
      .attr("dx", function(d) { return d.projection[0] } )
      .attr("dy", function(d) { return d.projection[1] - 18} )
      .attr("text-anchor", "middle")
      .text(function(d) {
        return d.Name_of_Country;
      })
      .attr("opacity", 0);

    var bubbleText = centroids.selectAll(".bubbleText")
      .data(data.nodes.filter(function(node) { return node.projection ? true : false }))
      .enter().append("text")
      .attr("class", "bubbleText")
      .attr("text-anchor", "middle")
      .attr("opacity", 0);

    bubbleText.append('tspan')
      .attr("x", function(d) { return d.projection[0] } )
      .attr("y", function(d) { return d.projection[1] } )
      .text(function(d) {
        if (d.Donor_or_Recipient == 'Donor') {
          return "Contributed total of:";
        } else {
          return "Received total of:";
        }
      });

    bubbleText.append('tspan')
      .attr("x", function(d) { return d.projection[0] } )
      .attr("y", function(d) { return d.projection[1] + 15 } )
      .text(function(d) {
        return "$" + magnitudeFormat(d.Total);
      });


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
    

    var defs = svg3.append("svg:defs");

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



    var arcNodes = arcs.selectAll("path")
      .data(links)
    .enter().append("path")
      .attr("stroke", '#111')
      .attr("opacity", 0) //all lines totally trasparent, then change opacity with country click
      .attr("stroke-linecap", "round")
      .attr("stroke-width", function(d) { return arcWidth(d.magnitude); })
      .attr("d", function(d) { 
        if (useGreatCircles) {
          return splitPath(path(arc(d)));
        } else {
          return path({
            type: "LineString",
            coordinates: [d.source, d.target]
          });
        }
      })
      .sort(function(a, b) {
        var a = a.magnitude, b = b.magnitude;
        if (isNaN(a)) if (isNaN(b)) return 0; else return -1; if (isNaN(b)) return 1;
        return d3.ascending(a, b); 
      });
    arcNodes.on("mouseover", function(d) { 
      console.log(d);
      d3.select(this)
        .attr("stroke", "red")
        .attr("marker-end", "url(#arrowHead)");
    })
    arcNodes.on("mouseout", function(d) {
        d3.select(this)
          .attr("marker-end", "none")
          .attr("stroke", '#111'); 
    });



  });