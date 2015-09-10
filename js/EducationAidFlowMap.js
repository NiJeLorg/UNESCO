/**
 * EducationAidFlowMap.js: Javascript to draw the aid flows map
 */

function createEducationAidFlowMap() {

  var highlighted;

  var svg3 = d3.select("#EducationAidFlowMap")
      .append("svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var color_donor = d3.scale.threshold()
      color_donor.domain([9.9,19.9,29.9,100]); 
      color_donor.range(["#bdc9e1","#67a9cf","#1c9099","#016c59"]);
      //color_donor.range(["#a4c8e4","#77acd7","#4991c9","#1c75bc"]);

  var color_recipient = d3.scale.threshold()
      color_recipient.domain([9.9,19.9,29.9,100]); 
      color_recipient.range(["#fee5d9","#fcae91","#fb6a4a","#de2d26"]);
      //color_recipient.range(["#f9bda9","#f79c7f","#f47b54","#ef4136"]);

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
        .attr("fill", "#111")
        .attr("fill-opacity", 0.75)
        .attr("stroke-opacity", 0.75)
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
      var magnitudeFormat = d3.format(",.3s");

      var arcWidth = d3.scale.linear().domain([1, maxMagnitude]).range([1, 20]);

      // function to parse raw node lat lons to array
      function nodeCoords(node) { 
        var lon = parseFloat(node.Lon), lat = parseFloat(node.Lat);
        if (isNaN(lon) || isNaN(lat)) return null;
        return [lon, lat]; 
      }

      data.nodes.forEach(function(node) {
        //parse multilateral number
        if (!node.Multilateral || node.Multilateral == 'a') {
          node.Multilateral = -99;
        } else {
          node.Multilateral = Math.round(parseFloat(node.Multilateral) * 1000000);
        }
        //construct lon,lat array for each node and pass to nodeDataByCode
        node.coords = nodeCoords(node);
        node.projection = node.coords ? projection(node.coords) : undefined;
        node.TotalContributedToCountries = 0;
        node.TotalReceivedFromCountries = 0;
        // total the amounts from flows for each node
        for (var i = 0; i < data.flows.length; i++) {
          if (node.Donor_or_Recipient == 'Donor') {
            if (node.OECD_Country_Code == data.flows[i].ISO_Source_Code) {
              var total = data.flows[i].Total.replace(/,/g , '');
              total = parseFloat(total);
              if (!isNaN(total)) {
                node.TotalContributedToCountries = node.TotalContributedToCountries + total; 
              } 
            }
          } else {
            if (node.OECD_Country_Code == data.flows[i].ISO_Target_Code) {
              var total = data.flows[i].Total.replace(/,/g , '');
              total = parseFloat(total);
              if (!isNaN(total)) {
                node.TotalReceivedFromCountries = node.TotalReceivedFromCountries + total; 
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

      // add donor and recipient tag and multilateral number to data.countries.features.properties
      data.countries.features.forEach(function(feature){
        // append "Donor" or "Recipient" to data.countries.features.properties
        for (var i = 0; i < data.nodes.length; i++) {
          //compare node and features -- add to properties if the same country    
          if (feature.properties.adm0_a3 == data.nodes[i].OECD_Country_Code) {
            //Copy the data value into the JSON
            feature.properties.Donor_or_Recipient = data.nodes[i].Donor_or_Recipient; 
            feature.properties.multilateral = data.nodes[i].Multilateral;
            //Stop looking through the JSON
            break;      
          }
        } 

        feature.properties.Donates_To = [];
        feature.properties.Receives_From = [];
        // loop to create arrays of donor and recipient countries   
        for (var i = 0; i < data.flows.length; i++) {
          if (feature.properties.Donor_or_Recipient == 'Donor') {
            if (feature.properties.adm0_a3 == data.flows[i].ISO_Source_Code) {
              // push Receipients into Donates_To
              feature.properties.Donates_To.push(data.flows[i].ISO_Target_Code)
            }
          } else {
            if (feature.properties.adm0_a3 == data.flows[i].ISO_Target_Code) {
              // push Donors into Receives_From
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
          var mapCountry = feature.properties.adm0_a3;
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
          // set clicked for later
          highlighted = d;
          // show circle of selected
          centroids.selectAll('circle')
            .transition()
            .duration(250)
            .attr("display", function(j) {
                if (j.OECD_Country_Code == d.properties.adm0_a3) {
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
                if (j.OECD_Country_Code == d.properties.adm0_a3) {
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
                if (j.OECD_Country_Code == d.properties.adm0_a3) {
                  return "block";
                } else {
                  return "none";
                }
            });

          // show arcs of countries that are in source or target
          arcs.selectAll("path")
            .transition()
            .duration(0)
            .attr("fill-opacity", 0.75)
            .attr("stroke-opacity", 0.75)
            .attr("fill", function(j) {
                if (d.properties.Donor_or_Recipient == 'Donor') {
                  if (j.origin.OECD_Country_Code == d.properties.adm0_a3) {
                    return "#44509d";
                  } else {
                    return "#111";
                  }
                } else {
                  if (j.dest.OECD_Country_Code == d.properties.adm0_a3) {
                    return "#f36d42";
                  } else {
                    return "#111";
                  }                
                }
            })
            .attr("stroke", function(j) {
                if (d.properties.Donor_or_Recipient == 'Donor') {
                  if (j.origin.OECD_Country_Code == d.properties.adm0_a3) {
                    return "#44509d";
                  } else {
                    return "#111";
                  }
                } else {
                  if (j.dest.OECD_Country_Code == d.properties.adm0_a3) {
                    return "#f36d42";
                  } else {
                    return "#111";
                  }                
                }
            })
            .attr("display", function(j) {
                if (d.properties.Donor_or_Recipient == 'Donor') {
                  if (j.origin.OECD_Country_Code == d.properties.adm0_a3) {
                    return "block";
                  } else {
                    return "none";
                  }
                } else {
                  if (j.dest.OECD_Country_Code == d.properties.adm0_a3) {
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
                  } else if ($.inArray( j.properties.adm0_a3, d.properties.Donates_To ) != -1) {
                    return "2px";
                  } else {
                    return "0px";
                  }
                } else {
                  if (d.properties.Receives_From.length == 0) {
                    return "1px";
                  } else if ($.inArray( j.properties.adm0_a3, d.properties.Receives_From ) != -1) {
                    return "2px";
                  } else {
                    return "0px";
                  }                    
                }
              })
              .style("fill-opacity", function(j) {
                if (d.properties.Donor_or_Recipient == 'Donor') {
                  if (d.properties.Donates_To.length == 0) {
                    return "1";
                  } else if ($.inArray( j.properties.adm0_a3, d.properties.Donates_To ) != -1) {
                    return "1";
                  } else {
                    return "0.5";
                  }
                } else {
                  if (d.properties.Receives_From.length == 0) {
                    return "1";
                  } else if ($.inArray( j.properties.adm0_a3, d.properties.Receives_From ) != -1) {
                    return "1";
                  } else {
                    return "0.5";
                  }                    
                }
              });



        });

      // draw flows between countries
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

      // alternative flow drawing tool from -- http://www.uis.unesco.org/Documents/Student%20flow%20map%20viz/uis.flowmapC.js
      function elliptarrow(d,inflow, width) {
        var src = projection(d.source);
        var trg = projection(d.target);
        var mag = width;//Math.min(7,2+ width/10);
                //Math.min(15,2+ width/100); //d.magnitude/2/100);
        arrowOffset = mag;// mag //offset of arrow base

        if (inflow){
          var src = projection(d.target);
          var trg = projection(d.source);
          arrowOffset = -arrowOffset
        }

        dx = trg[0] - src[0]; //distance between src and trg
        dy = trg[1] - src[1];
        cx = (src[0]+trg[0])/2; //center of the line
        cy = (src[1]+trg[1])/2;

        ra = Math.sqrt(dx * dx + dy * dy);
        er = ra / (Math.abs(dx / h))*1.3; //ellipse radius
            
        var arcSide = (dx < 0) ? " 0 0,0 " : " 1 0,1 ";
        var arcSideb = (dx < 0) ? " 1 0,1 " : " 0 0,0 ";
          
        var main = "M " + src[0] + "," + src[1] + " A " + er + "," + er + arcSide + trg[0] + "," + trg[1];

        cx = (src[0]+trg[0])/2; //center of the line
        cy = (src[1]+trg[1])/2;

        //calculating control point according to er
        lineangle = Math.atan(dy/dx); //angle of the line between src and trg
        erangle = Math.asin((ra/2)/er); // angle of the arc
        rc = Math.tan(erangle)*(ra/2); // distance between direct line and control point

        cpx = Math.cos(lineangle-(Math.PI/2))*rc; // absolute coordinates of the ctrl point
        cpy = Math.sin(lineangle-(Math.PI/2))*rc;
        
        ctrx = cpx+cx; //coords of ctrl point relative to direct line
        ctry = cpy+cy;          

        trgangle = Math.atan((ctrx-trg[0])/(ctry-trg[1]));

        angle= Math.PI/2; // set the angle so its always bending upwards
        if(trg[0]-src[0] < 0){
          angle = -Math.PI/2;
          if(trgangle < 0){arrowOffset = -arrowOffset;}
        }
        if(trg[0]-src[0] > 0){
          if(trgangle > 0){arrowOffset = -arrowOffset;}
        }
        
        dTrgX = trg[0]+Math.sin(trgangle)*arrowOffset;
        dTrgY = trg[1]+Math.cos(trgangle)*arrowOffset;
        
        TinX = dTrgX+(Math.sin(trgangle+angle)*mag);
        TinY = dTrgY+(Math.cos(trgangle+angle)*mag);
        ToutX = dTrgX+(Math.sin(trgangle-angle)*mag);
        ToutY = dTrgY+(Math.cos(trgangle-angle)*mag);
        
        curveOut= 'M'+ TinX + "," +TinY+' Q'+ctrx+','+ctry+' '+src[0] + "," + src[1];
        curveIn = ' Q'+ctrx+','+ctry+' '+ToutX + "," + ToutY;
        arrowHead= ' L' +trg[0] + "," + trg[1]+ ' '+ TinX + "," +TinY;
        
        finalArrow = curveOut + curveIn + arrowHead;

        return finalArrow;
      }
      

      var arcNodes = arcs.selectAll("path")
        .data(links)
      .enter().append("path")
        .attr("display", "none") // set display none until country clicked
        .attr("fill-opacity", 0.75)
        .attr("stroke-opacity", 0.75)
        .attr("stroke", '#111')
        .attr("stroke-width", '2px')
        .attr("fill", '#111')
        .attr("d", function(d) {
             var width = arcWidth(d.magnitude);
             var inflow = false;
             return elliptarrow(d, inflow, width);
        })
        .sort(function(a, b) {
          var a = a.magnitude, b = b.magnitude;
          if (isNaN(a)) if (isNaN(b)) return 0; else return -1; if (isNaN(b)) return 1;
          return d3.ascending(a, b); 
        });
        
      arcNodes.on("mouseover", function(d) { 
        arcs.selectAll("path")
          .transition()
          .duration(250)
          .attr("fill-opacity", function(j) {
              if (j == d) {
                return 1;
              } else {
                return 0.1;
              }
          })
          .attr("stroke-opacity", function(j) {
              if (j == d) {
                return 1;
              } else {
                return 0.1;
              }
          })
          .attr("fill", function(j) {
              if (j == d) {
                if (highlighted.properties.Donor_or_Recipient == 'Donor') {
                  return "#44509d";
                } else {
                  return "#f36d42";
                }
              } else {
                return "#ccc";
              }
          })
          .attr("stroke", function(j) {
              if (j == d) {
                if (highlighted.properties.Donor_or_Recipient == 'Donor') {
                  return "#44509d";
                } else {
                  return "#f36d42";
                }
              } else {
                return "#ccc";
              }
          });

        div.transition()
          .duration(250)
          .style("opacity", 1);

        var text = "Receives $" + magnitudeFormat(d.magnitude) + " from " + d.origin.Name_of_Country + " and $" + magnitudeFormat(d.dest.Multilateral) + " in multilateral aid."
          
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
        arcs.selectAll("path")
          .transition()
          .duration(250)
          .attr("fill-opacity", 0.75)
          .attr("stroke-opacity", 0.75)
          .attr("fill", function() {
              if (highlighted.properties.Donor_or_Recipient == 'Donor') {
                return "#44509d";
              } else {
                return "#f36d42";
              }
          })
          .attr("stroke", function() {
              if (highlighted.properties.Donor_or_Recipient == 'Donor') {
                return "#44509d";
              } else {
                return "#f36d42";
              }
          });

          div.transition()
             .duration(250)
             .style("opacity", 1e-6);

      });
      

      centroids.selectAll("circle")
        .data(data.nodes.filter(function(node) { return node.projection ? true : false }))
        .enter().append("circle")
        .attr("cx", function(d) { return d.projection[0] } )
        .attr("cy", function(d) { return d.projection[1] } )
        .attr("r", 60)
        .attr("fill", "#fff")
        .attr("stroke", "#4d4d4d")
        .attr("stroke-width", 3)
        .attr("display", "none");

      var countryNames = centroids.selectAll(".countryName")
        .data(data.nodes.filter(function(node) { return node.projection ? true : false }))
        .enter().append("text")
        .attr("class", "countryName")
        .attr("font-size", "12px")
        .attr("font-weight", 600)
        .attr("text-anchor", "middle")
        .attr("display", "none");

      countryNames.append('tspan')
        .attr("x", function(d) { return d.projection[0] } )
        .attr("y", function(d) { 
          if (d.Name_of_Country.length > 17) {
            return d.projection[1] - 22;
          } else {
            return d.projection[1] - 10;
          }
          
        } )
        .text(function(d) {
          if (d.Name_of_Country.length > 17) {
            var splitString = d.Name_of_Country.split(' ', 1);
            return splitString[0];
          } else {
            return d.Name_of_Country
          }
        });

      countryNames.append('tspan')
        .attr("x", function(d) { return d.projection[0] } )
        .attr("y", function(d) { 
          if (d.Name_of_Country.length > 17) {
            return d.projection[1] - 8;
          } else {
            return d.projection[1];
          }
          
        } )
        .text(function(d) {
          if (d.Name_of_Country.length > 17) {
            var splitString = d.Name_of_Country.split(' ');
            // remove first word from array
            splitString.splice(0, 1);
            return splitString.join(' ');
          } else {
            return '';
          }
        });        

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
            return "Aid to Education:";
          } else {
            return "Country Aid: $" + magnitudeFormat(d.TotalReceivedFromCountries);
          }
        });

      bubbleText.append('tspan')
        .attr("x", function(d) { return d.projection[0] } )
        .attr("y", function(d) { return d.projection[1] + 16 } )
        .text(function(d) {
          if (d.Donor_or_Recipient == 'Donor') {
            return "$" + magnitudeFormat(d.TotalContributedToCountries);
          }
        });

      bubbleText.append('tspan')
        .attr("x", function(d) { return d.projection[0] } )
        .attr("y", function(d) { return d.projection[1] + 16 } )
        .text(function(d) {
          if (d.Donor_or_Recipient == 'Recipient') {
            return "Multilateral Aid:";
          }
        });

      bubbleText.append('tspan')
        .attr("x", function(d) { return d.projection[0] } )
        .attr("y", function(d) { return d.projection[1] + 28 } )
        .text(function(d) {
          if (d.Donor_or_Recipient == 'Recipient') {
            return "$" + magnitudeFormat(d.Multilateral);
          }
        });

    });


}
