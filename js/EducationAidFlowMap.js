/**
 * EducationAidFlowMap.js: Javascript to draw the aid flows map
 */

function createEducationAidFlowMap() {

  var useGreatCircles = true;
  var arc = d3.geo.greatArc().precision(3);

  var svg3 = d3.select("#EducationAidFlowMap")
      .append("svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var color_donor = d3.scale.threshold()
      color_donor.domain([9.9,19.9,29.9,100]); 
      color_donor.range(["#a4c8e4","#77acd7","#4991c9", "#1c75bc"]);

  var color_recipient = d3.scale.threshold()
      color_recipient.domain([9.9,19.9,29.9,100]); 
      color_recipient.range(["#f9bda9","#f79c7f","#f47b54","#ef4136"]);


  // draw a rectagle the size of the svg container under everything that resets the style
  var rect = svg3.append('rect')
    .attr('width', w + margin.left + margin.right)
    .attr('height', h + margin.top + margin.bottom)
    .attr('x', 0)
    .attr('y', 0)
    .style('fill', '#fff')
    .style('stroke', '#fff')
    .style('stroke-width', 0)
    .on("click", function() {
      // show circle of selected
      centroids.selectAll('circle')
        .transition()
        .duration(250)
        .attr("display", "none");

      // show country name of selected
      centroids.selectAll(".countryName")
        .transition()
        .duration(250)
        .attr("display", "none");

      // show bubble text of selected
      centroids.selectAll(".bubbleText")
        .transition()
        .duration(250)
        .attr("display", "none");

      // show arcs of countries that are in source or target
      arcs.selectAll("path")
        .transition()
        .duration(0)
        .attr("stroke", "#111")
        .attr("display", "none");

        //highlight the countries that are donors or recipients
        countries.selectAll("path")
          .transition()
          .duration(250)
          .style("stroke-width", "1px")
          .style("fill-opacity", 1);
    });

  var countries = svg3.append("g").attr("id", "countries");
  var arcs = svg3.append("g").attr("id", "arcs");
  var centroids = svg3.append("g").attr("id", "centroids");


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

      var arcWidth = d3.scale.linear().domain([1, maxMagnitude]).range([1, 100]);
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
        feature.properties.Donates_To = [];
        feature.properties.Receives_From = [];
        // append total from flows   
        for (var i = 0; i < data.flows.length; i++) {
          if (feature.properties.Donor_or_Recipient == 'Donor') {
            if (feature.id == data.flows[i].ISO_Source_Code) {
              var total = data.flows[i].Total.replace(/,/g , '');
              total = parseFloat(total);
              if (!isNaN(total)) {
                feature.properties.Total = feature.properties.Total + total; 
              } 
              // push Receipients into Donates_To
              feature.properties.Donates_To.push(data.flows[i].ISO_Target_Code)
            }
          } else {
            if (feature.id == data.flows[i].ISO_Target_Code) {
              var total = data.flows[i].Total.replace(/,/g , '');
              total = parseFloat(total);
              if (!isNaN(total)) {
                feature.properties.Total = feature.properties.Total + total; 
              } 
              // push Receipients into Donates_To
              feature.properties.Receives_From.push(data.flows[i].ISO_Source_Code)
            }
          }
        }

        // add ROFST_1_CP to geojson
        for (var i = 0; i < apidata.Indicators.length; i++) {
          //Grab country code
          var apidataCountry = apidata.Indicators[i].Country; 
          //Grab data value, and convert from string to float
          var value = parseFloat(apidata.Indicators[i].Value);
          //Find the corresponding country inside the GeoJSON
          var mapCountry = feature.id;
          if (apidataCountry == mapCountry) {
            // drop the indicator into the proper spot in the geojson
            if (apidata.Indicators[i].Indicator == 'ROFST_1_CP') {
              feature.properties.rate_ROFST_1_CP_Value = value;
              feature.properties.rate_ROFST_1_CP_Year = apidata.Indicators[i].Year;
            } else if (apidata.Indicators[i].Indicator == 'ROFST_2_CP') {
              feature.properties.rate_ROFST_2_CP_Value = value;
              feature.properties.rate_ROFST_2_CP_Year = apidata.Indicators[i].Year;
            } else if (apidata.Indicators[i].Indicator == 'OFST_1_F_CP') {
              feature.properties.OFST_1_F_CP_Value = value;
            } else if (apidata.Indicators[i].Indicator == 'OFST_1_M_CP')  {
              feature.properties.OFST_1_M_CP_Value = value;
            } else if (apidata.Indicators[i].Indicator == 'OFST_2_F_CP') {
              feature.properties.OFST_2_F_CP_Value = value;
            } else {
              feature.properties.OFST_2_M_CP_Value = value;
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
            var value = d.properties.rate_ROFST_1_CP_Value;
            if (value) {
              return color_donor(value);
            } else {
              return "#f7f7f7";
            }
          } else {
            var value = d.properties.rate_ROFST_1_CP_Value;
            if (value) {
              return color_recipient(value);
            } else {
              return "#f7f7f7";
            }
          }
        })
        .on("click", function(d) {
          console.log(d);
          // show circle of selected
          centroids.selectAll('circle')
            .transition()
            .duration(250)
            .attr("display", function(j) {
                if (j.OECD_Country_Code == d.id) {
                  return "block";
                } else {
                  return "none";
                }
            });

          // show country name of selected
          centroids.selectAll(".countryName")
            .transition()
            .duration(250)
            .attr("display", function(j) {
                if (j.OECD_Country_Code == d.id) {
                  return "block";
                } else {
                  return "none";
                }
            });

          // show bubble text of selected
          centroids.selectAll(".bubbleText")
            .transition()
            .duration(250)
            .attr("display", function(j) {
                if (j.OECD_Country_Code == d.id) {
                  return "block";
                } else {
                  return "none";
                }
            });

          // show arcs of countries that are in source or target
          arcs.selectAll("path")
            .transition()
            .duration(0)
            .attr("stroke", function(j) {
                if (d.properties.Donor_or_Recipient == 'Donor') {
                  if (j.origin.OECD_Country_Code == d.id) {
                    return "#44509d";
                  } else {
                    return "#111";
                  }
                } else {
                  if (j.dest.OECD_Country_Code == d.id) {
                    return "#f36d42";
                  } else {
                    return "#111";
                  }                
                }
            })
            .attr("display", function(j) {
                if (d.properties.Donor_or_Recipient == 'Donor') {
                  if (j.origin.OECD_Country_Code == d.id) {
                    return "block";
                  } else {
                    return "none";
                  }
                } else {
                  if (j.dest.OECD_Country_Code == d.id) {
                    return "block";
                  } else {
                    return "none";
                  }                
                }
            });

            //highlight the countries that are donors or recipients
            countries.selectAll("path")
              .transition()
              .duration(250)
              .style("stroke-width", function(j) {
                // loop through links to highlight countries in the source or target list
                if (d.properties.Donor_or_Recipient == 'Donor') {
                  if (d.properties.Donates_To.length == 0) {
                    return "1px";
                  } else if ($.inArray( j.id, d.properties.Donates_To ) != -1) {
                    return "3px";
                  } else {
                    return "0px";
                  }
                } else {
                  if (d.properties.Receives_From.length == 0) {
                    return "1px";
                  } else if ($.inArray( j.id, d.properties.Receives_From ) != -1) {
                    return "3px";
                  } else {
                    return "0px";
                  }                    
                }
              })
              .style("fill-opacity", function(j) {
                if (d.properties.Donor_or_Recipient == 'Donor') {
                  if (d.properties.Donates_To.length == 0) {
                    return "1";
                  } else if ($.inArray( j.id, d.properties.Donates_To ) != -1) {
                    return "1";
                  } else {
                    return "0.5";
                  }
                } else {
                  if (d.properties.Receives_From.length == 0) {
                    return "1";
                  } else if ($.inArray( j.id, d.properties.Receives_From ) != -1) {
                    return "1";
                  } else {
                    return "0.5";
                  }                    
                }
              });



        });

      // draw flows between countries
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
        .attr("markerUnits", "userSpaceOnUse")
        .attr("markerWidth", 4*2)
        .attr("markerHeight", 3*2)
      .append("polyline")
        .attr("points", "0,0 10,5 0,10 1,5")
        .attr("fill", maxColor);



      var arcNodes = arcs.selectAll("path")
        .data(links)
      .enter().append("path")
        .attr("display", "none") // set display none until country clicked
        .attr("stroke", '#111')
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
        d3.select(this)
          .attr("marker-end", "url(#arrowHead)");

        div.transition()
          .duration(250)
          .style("opacity", 1);

        var text = "Receives $" + magnitudeFormat(d.magnitude) + " from " + d.origin.Name_of_Country + " and $" + magnitudeFormat(d.dest.Total) + " in multilateral aid."
          
        div.html(
          '<h4 class="text-left">' + d.dest.Name_of_Country + '</h4>' +
          '<p class="text-left">' + text + '</p>'
          )  
          .style("left", (d3.event.pageX + 25) + "px")     //play around with these to get spacing better
          .style("top", (d3.event.pageY - 55) + "px");

      });
      arcNodes.on("mousemove", function(d) {
          div.style("left", (d3.event.pageX + 25) + "px")
             .style("top", (d3.event.pageY - 55) + "px");
            
      });
      arcNodes.on("mouseout", function(d) {
          d3.select(this)
            .attr("marker-end", "none");

          div.transition()
             .duration(250)
             .style("opacity", 1e-6);

      });
      

      centroids.selectAll("circle")
        .data(data.nodes.filter(function(node) { return node.projection ? true : false }))
        .enter().append("circle")
        .attr("cx", function(d) { return d.projection[0] } )
        .attr("cy", function(d) { return d.projection[1] } )
        .attr("r", 50)
        .attr("fill", "#fff")
        .attr("stroke", "#4d4d4d")
        .attr("stroke-width", 3)
        .attr("display", "none");

      centroids.selectAll(".countryName")
        .data(data.nodes.filter(function(node) { return node.projection ? true : false }))
        .enter().append("text")
        .attr("class", "countryName")
        .attr("font-size", "12px")
        .attr("font-weight", 600)
        .attr("dx", function(d) { return d.projection[0] } )
        .attr("dy", function(d) { return d.projection[1] - 10} )
        .attr("text-anchor", "middle")
        .text(function(d) {
          return d.Name_of_Country;
        })
        .attr("display", "none");

      var bubbleText = centroids.selectAll(".bubbleText")
        .data(data.nodes.filter(function(node) { return node.projection ? true : false }))
        .enter().append("text")
        .attr("class", "bubbleText")
        .attr("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("display", "none");

      bubbleText.append('tspan')
        .attr("x", function(d) { return d.projection[0] } )
        .attr("y", function(d) { return d.projection[1] + 4 } )
        .text(function(d) {
          if (d.Donor_or_Recipient == 'Donor') {
            return "Contributed total of:";
          } else {
            return "Received total of:";
          }
        });

      bubbleText.append('tspan')
        .attr("x", function(d) { return d.projection[0] } )
        .attr("y", function(d) { return d.projection[1] + 16 } )
        .text(function(d) {
          return "$" + magnitudeFormat(d.Total);
        });

    });


}
