d3.csv("refugeedata_converted.csv", function(err, data) {
  var config = {"data0":"Country (or dependent territory)","data1":"Number of Refugees","data2":"Population","data3":"Countries of Origin", "data4":"Percent Pop Refugees","label0":"label 0","label1":"label 1","color0":"#c2ae99","color1":"#997b5c","width":800,"height":400}
  console.log(config.data4);
  var width = 960,
      height = 960;
 
  var COLOR_COUNTS = 4;

  function Interpolate(start, end, steps, count) {
      var s = start,
          e = end,
          final = s + (((e - s) / steps) * count);
      return Math.floor(final);
  }

  function Color(_r, _g, _b) {
      var r, g, b;
      var setColors = function(_r, _g, _b) {
          r = _r;
          g = _g;
          b = _b;
      };
  
      setColors(_r, _g, _b);
      this.getColors = function() {
          var colors = {
              r: r,
              g: g,
              b: b
          };
          return colors;
      };
  }

  function hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
      } : null;
  }

  function valueFormat(d) {
    if (d > 1000000000) {
      return Math.round(d / 1000000000 * 10) / 10 + "B";
    } else if (d > 1000000) {
      return Math.round(d / 1000000 * 10) / 10 + "M";
    } else if (d > 1000) {
      return Math.round(d / 1000 * 10) / 10 + "K";
    } else {
      return d;
    }
  }

  var COLOR_FIRST = config.color0, COLOR_LAST = config.color1;
  
  var rgb = hexToRgb(COLOR_FIRST);
  
  var COLOR_START = new Color(rgb.r, rgb.g, rgb.b);
  
  rgb = hexToRgb(COLOR_LAST);
  var COLOR_END = new Color(rgb.r, rgb.g, rgb.b);
  
  var startColors = COLOR_START.getColors(),
      endColors = COLOR_END.getColors();
  
  var colors = [];
  
  for (var i = 0; i < COLOR_COUNTS; i++) {
    var r = Interpolate(startColors.r, endColors.r, COLOR_COUNTS, i);
    var g = Interpolate(startColors.g, endColors.g, COLOR_COUNTS, i);
    var b = Interpolate(startColors.b, endColors.b, COLOR_COUNTS, i);
    colors.push(new Color(r, g, b));
  }

  var MAP_KEY = config.data0;
  var MAP_VALUE = config.data1;
  var POPULATE = config.data2;
  var ORIGIN_DATA = config.data3;
  var PER_DATA = config.data4;
  
  var projection = d3.geo.mercator()
      .scale((width + 1) / 2 / Math.PI)
      .translate([width / 2, height / 2])
      .precision(.1);

  var path = d3.geo.path()
      .projection(projection);

  var graticule = d3.geo.graticule();

  var svg = d3.select("#canvas-svg").append("svg")
      .attr("width", width)
      .attr("height", height);

  svg.append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", path);

  var valueHash = {};
  var popHash = {};
  var originHash = {};
  var perHash = {};

  function log10(val) {
    return Math.log(val);
  }

  data.forEach(function(d) {
    valueHash[d[MAP_KEY]] = +d[MAP_VALUE];
    popHash[d[MAP_KEY]] = +d[POPULATE];
    perHash[d[MAP_KEY]] = d[PER_DATA];
    originHash[d[MAP_KEY]] = d[ORIGIN_DATA];
  });

  console.log(perHash);
  var quantize = d3.scale.quantize()
      .domain([0, 1.0])
      .range(d3.range(COLOR_COUNTS).map(function(i) { return i }));
  
  quantize.domain([d3.min(data, function(d){
      return (+d[MAP_VALUE]) }),
    d3.max(data, function(d){
      return (+d[MAP_VALUE]) })]);
  
  d3.json("world-topo.json", function(error, world) {
    var countries = topojson.feature(world, world.objects.countries).features;

    svg.append("path")
       .datum(graticule)
       .attr("class", "choropleth")
       .attr("d", path);

    var g = svg.append("g");
 
    var dadaab = svg.append("circle")
                          .attr("cx", 585)
                          .attr("cy", 480)
                          .attr("r", 4)
                          .attr("class", "circle");
    
    var dab_open = false;

    dadaab.on("click", function() {
      var html = "";
      html += "<div class=\"tooltip_kv\">";
      html += "<a href= 'https://twitter.com/KenyaRedCross/status/578933857594032128'><img src='/photos/dadaab.png'></a>";
      html += "Refugee children with Red Cross Nutrition Officer."
      html += "</span>";
      html += "</div>";

      if (dab_open == false) {
          $("#tooltip-container").html(html);
          $(this).attr("fill-opacity", "0.8");
          $("#tooltip-container").show();
         dab_open = true;
       } else {
          $(this).attr("fill-opacity", "1.0");
          $("#tooltip-container").hide();
          dab_open = false;
       }

    });
    
    var iraq = svg.append("circle")
                            .attr("cx", 600)
                            .attr("cy", 380)
                           .attr("r", 4)
                           .attr("class", "circle");

    var iraq_open = false;

     iraq.on("click", function() {
      var html = "";
      html += "<div class=\"tooltip_kv\">";
      html += "<a href='https://twitter.com/RaviSinghKA/status/562100329454391296'><img src='/photos/erbil.png'></a>";
      html += "Founder of Khalsa Aid with refugee baby."
      html += "</span>";
      html += "</div>";

      if (iraq_open == false) {
          $("#tooltip-container").html(html);
          $(this).attr("fill-opacity", "0.8");
          $("#tooltip-container").show();
         iraq_open = true;
       } else {
          $(this).attr("fill-opacity", "1.0");
          $("#tooltip-container").hide();
          iraq_open = false;
       }
    });

    var kakuma = svg.append("circle")
                          .attr("cx", 578)
                          .attr("cy", 470)
                          .attr("r", 4)
                          .attr("class", "circle");

    var kakuma_open = false;

     kakuma.on("click", function() {
      var html = "";
      html += "<div class=\"tooltip_kv\">";
      html += "<a href='https://www.instagram.com/p/6Jy0cwQu5P/'><img src='/photos/kakuma.png'></a>";
      html += "Local and Somalia Refugee bond over rap music."
      html += "</span>";
      html += "</div>";

      if (kakuma_open == false) {
          $("#tooltip-container").html(html);
          $(this).attr("fill-opacity", "0.8");
          $("#tooltip-container").show();
         kakuma_open = true;
       } else {
          $(this).attr("fill-opacity", "1.0");
          $("#tooltip-container").hide();
          kakuma_open = false;
       }
    });

     var ssudan_open = false;

    var ssudan = svg.append("circle")
                          .attr("cx", 560)
                          .attr("cy", 460)
                          .attr("r", 4)
                          .attr("class", "circle");
    ssudan.on("click", function() {
      var html = "";
      html += "<div class=\"tooltip_kv\">";
      html += "<a href='https://twitter.com/MicMacSuibh/status/482098967229267968'><img src='/photos/southsudan.png'></a>";
      html += "UK News Cameraman poses with Children."
      html += "</span>";
      html += "</div>";

      if (ssudan_open == false) {
          $("#tooltip-container").html(html);
          $(this).attr("fill-opacity", "0.8");
          $("#tooltip-container").show();
         ssudan_open = true;
       } else {
          $(this).attr("fill-opacity", "1.0");
          $("#tooltip-container").hide();
          ssudan_open = false;
       }
    });

    var lesbos_open = false;

    var lesbos = svg.append("circle")
                          .attr("cx", 555)
                          .attr("cy", 376)
                          .attr("r", 4)
                          .attr("class", "circle");
    lesbos.on("click", function() {
      var html = "";
      html += "<div class=\"tooltip_kv\">";
      html += "<a href='https://twitter.com/trsleman/status/652312135695998976'><img src='/photos/lesbos.png'></a>";
      html += "Refugees take photos after arriving safely."
      html += "</span>";
      html += "</div>";

      if (lesbos_open == false) {
          $("#tooltip-container").html(html);
          $(this).attr("fill-opacity", "0.8");
          $("#tooltip-container").show();
         lesbos_open = true;
       } else {
          $(this).attr("fill-opacity", "1.0");
          $("#tooltip-container").hide();
          lesbos_open = false;
       }
    });


    var hungary = svg.append("circle")
                          .attr("cx", 530)
                          .attr("cy", 330)
                          .attr("r", 4)
                          .attr("class", "circle");

    var hungary_open = false;

    hungary.on("click", function() {
          var html = "";
          html += "<div class=\"tooltip_kv\">";
          html += "<a href='https://twitter.com/janhusar/status/641706231850213376'><img src='/photos/foodworkers.png'></a>";
          html += "Group runs mobile food stand in northern Hungary."
          html += "</span>";
          html += "</div>";

      if (hungary_open == false) {
          $("#tooltip-container").html(html);
          $(this).attr("fill-opacity", "0.8");
          $("#tooltip-container").show();
         hungary_open = true;
       } else {
          $(this).attr("fill-opacity", "1.0");
          $("#tooltip-container").hide();
          hungary_open = false;
       }
    });

    var lebanon = svg.append("circle")
                            .attr("cx", 580)
                            .attr("cy", 378)
                           .attr("r", 4)
                           .attr("class", "circle");

    var lebanon_open = false;

    lebanon.on("click", function() {
          var html = "";
          html += "<div class=\"tooltip_kv\">";
          html += "<a href='https://twitter.com/RaviSinghKA/status/632698222352441344'><img src='/photos/lebanon.png'></a>";
          html += "Ravinder Singh, refugee advocate, poses with a Syrian child"
          html += "</span>";
          html += "</div>";

      if (lebanon_open == false) {
          $("#tooltip-container").html(html);
          $(this).attr("fill-opacity", "0.8");
          $("#tooltip-container").show();
            lebanon_open = true;
       } else {
          $(this).attr("fill-opacity", "1.0");
          $("#tooltip-container").hide();
          lebanon_open = false;
       }
    });

    var mace = svg.append("circle")
                            .attr("cx", 540)
                            .attr("cy", 365)
                           .attr("r", 4)
                           .attr("class", "circle");

      var mace_open = false;

      mace.on("click", function() {
        var html = "";
        html += "<div class=\"tooltip_kv\">";
        html += "<a href='https://twitter.com/mseedat0/status/644626943493672960'><img src='/photos/mace.png'></a>";
        html += "Refugee selfie at Greece-Macedonian Border."
        html += "</span>";
        html += "</div>";

        if (mace_open == false) {
          $("#tooltip-container").html(html);
          $(this).attr("fill-opacity", "0.8");
          $("#tooltip-container").show();
            mace_open = true;
       } else {
          $(this).attr("fill-opacity", "1.0");
          $("#tooltip-container").hide();
          mace_open = false;
       }
      });
    
    var suruc = svg.append("circle")
                            .attr("cx", 585)
                            .attr("cy", 370)
                           .attr("r", 4)
                           .attr("class", "circle");

    var suruc_open = false;              

     suruc.on("click", function() {
        var html = "";
        html += "<div class=\"tooltip_kv\">";
        html += "<a href='https://twitter.com/corinnelgray/status/615438814631202818'><img src='/photos/suruc.png'></a>";
        html += "Young refugees sharing their story"
        html += "</span>";
        html += "</div>";

        if (suruc_open == false) {
          $("#tooltip-container").html(html);
          $(this).attr("fill-opacity", "0.8");
          $("#tooltip-container").show();
            suruc_open = true;
       } else {
          $(this).attr("fill-opacity", "1.0");
          $("#tooltip-container").hide();
          suruc_open = false;
       }
      });

    var gazia = svg.append("circle")
                            .attr("cx", 583)
                            .attr("cy", 368)
                           .attr("r", 4)
                           .attr("class", "circle");
      var gazia_open = false; 

      gazia.on("click", function() {
      var html = "";
      html += "<div class=\"tooltip_kv\">";
      html += "<a href='https://twitter.com/KindaHibrawi/status/480454514781466624'><img src='/photos/gazia.png'></a>";
      html += "Duaa, a young girl part of the Zeitouna program."
      html += "</span>";
      html += "</div>";

      if (gazia_open == false) {
          $("#tooltip-container").html(html);
          $(this).attr("fill-opacity", "0.8");
          $("#tooltip-container").show();
            gazia_open = true;
       } else {
          $(this).attr("fill-opacity", "1.0");
          $("#tooltip-container").hide();
          gazia_open = false;
       }
    });

    var jordan = svg.append("circle")
                            .attr("cx", 578)
                            .attr("cy", 387)
                           .attr("r", 4)
                           .attr("class", "circle");

    var jordan_open = false;

    jordan.on("click", function() {
      var html = "";
      html += "<div class=\"tooltip_kv\">";
      html += "<a href='https://twitter.com/NasserTouaibia/status/715992768192126976'><img src='/photos/zaatari.png'></a>";
      html += "Syrian refugee Hamza celebrates his 8th birthday at the Zaatari Refugee Camp"
      html += "</span>";
      html += "</div>";

      if (jordan_open == false) {
          $("#tooltip-container").html(html);
          $(this).attr("fill-opacity", "0.8");
          $("#tooltip-container").show();
            jordan_open = true;
       } else {
          $(this).attr("fill-opacity", "1.0");
          $("#tooltip-container").hide();
          jordan_open = false;
       }
    });

    var kos = svg.append("circle")
                          .attr("cx", 553)
                          .attr("cy", 373)
                          .attr("r", 4)
                          .attr("class", "circle");

    var kos_open = false;

    kos.on("click", function() {
      var html = "";
      html += "<div class=\"tooltip_kv\">";
      html += "<a href='https://www.instagram.com/p/6K42HIDtg3/?taken-by=zaher_arour'><img src='/photos/kos.png'></a>";
      html += "Refugees camping on Kos beach"
      html += "</span>";
      html += "</div>";

      if (kos_open == false) {
          $("#tooltip-container").html(html);
          $(this).attr("fill-opacity", "0.8");
          $("#tooltip-container").show();
            kos_open = true;
       } else {
          $(this).attr("fill-opacity", "1.0");
          $("#tooltip-container").hide();
          kos_open = false;
       }
    });

    var toronto = svg.append("circle")
                          .attr("cx", 270)
                          .attr("cy", 345)
                          .attr("r", 4)
                          .attr("class", "circle");

    var toronto_open = false;

    toronto.on("click", function() {
      var html = "";
      html += "<div class=\"tooltip_kv\">";
      html += "<a href='https://twitter.com/RyeSU/status/675172603569569792/photo/1?ref_src=twsrc%5Etfw'><img src='/photos/canada.png'></a>";
      html += "Refugees arriving to a warm welcome in Toronto, Canada."
      html += "</span>";
      html += "</div>";

      if (toronto_open == false) {
          $("#tooltip-container").html(html);
          $(this).attr("fill-opacity", "0.8");
          $("#tooltip-container").show();
          toronto_open = true;
       } else {
          $(this).attr("fill-opacity", "1.0");
          $("#tooltip-container").hide();
          toronto_open = false;
       }
      });

    var wsahara = svg.append("circle")
                          .attr("cx", 465)
                          .attr("cy", 400)
                          .attr("r", 4)
                          .attr("class", "circle");

    var wsahara_open = false;

    wsahara.on("click", function() {
      var html = "";
      html += "<div class=\"tooltip_kv\">";
      html += "<a href='https://twitter.com/seniaba/status/691311937901170688'><img src='/photos/wsahara.png'></a>";
      html += "Refugee shares a photo of her family at Saharawi Refugee Camp."
      html += "</span>";
      html += "</div>";

      if (wsahara_open == false) {
          $("#tooltip-container").html(html);
          $(this).attr("fill-opacity", "0.8");
          $("#tooltip-container").show();
          wsahara_open = true;
       } else {
          $(this).attr("fill-opacity", "1.0");
          $("#tooltip-container").hide();
          wsahara_open = false;
       }
      });

    g.append("path")
     .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
     .attr("class", "equator")
     .attr("d", path);

    var country = g.selectAll(".country").data(countries);

    country.enter().insert("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("id", function(d,i) { return d.id; })
        .attr("title", function(d) { return d.properties.name; })
        .style("fill", function(d) {
          if (valueHash[d.properties.name]) {
            var c = quantize((valueHash[d.properties.name]));
            var color = colors[c].getColors();
            return "rgb(" + color.r + "," + color.g +
                "," + color.b + ")";
          } else {
            return "#d0d0d0";
          }
        })
        .on("mousemove", function(d) {
            var html = "";

            html += "<div class=\"tooltip_kv\">";
            html += "<div>";
            html += "<div style = 'text-align:left;'>";
            html += "<span class=\"tooltip_key\" style = 'font-size: 18px; text-align:left;'>";
            html += d.properties.name;
            html += "</span>";
            html += "<span class=\"tooltip_value\" style = 'font-size: 18px;'>";
            html += (valueHash[d.properties.name] ? valueFormat(popHash[d.properties.name]) : "");
            html += "";
            html += "</span>";
            html += "</div>";
            html += "<div style = 'text-align:left;'>";
            html += "<span style = 'font-weight: bold;'>Refugee Country of Origin: </span>"
            html += (valueHash[d.properties.name] ? originHash[d.properties.name] : "");
            html += "";
            html += "</div>";
            html += "<div style = 'text-align:left;'>";
            html += "<span style = 'font-weight: bold;'>Total Number of Refugees: </span>"
            html += (valueHash[d.properties.name] ? valueFormat(valueHash[d.properties.name]) : "");
            html += "";
            html += "</div>";
            html += "<div style = 'text-align:left;'>";
            html += "<span style = 'font-weight: bold;'>Percentage of refugees to total population: </span>"
            html += (valueHash[d.properties.name] ? perHash[d.properties.name] : "");
            html += "";
            html += "</div>";
            html += "</div>";
            html += "</div>";

            $("#tooltip-container").html(html);
            $(this).attr("fill-opacity", "0.8");
            $("#tooltip-container").show();

            var coordinates = d3.mouse(this);

            var map_width = $('.choropleth')[0].getBoundingClientRect().width;

            if (d3.event.pageX < map_width / 2) {
              d3.select("#tooltip-container")
                .style("top", (d3.event.layerY + 15) + "px")
                .style("left", (d3.event.layerX + 15) + "px");
            } else {
              var tooltip_width = $("#tooltip-container").width();
              d3.select("#tooltip-container")
                .style("top", (d3.event.layerY + 15) + "px")
                .style("left", (d3.event.layerX - tooltip_width - 30) + "px");
            }
        })
        .on("mouseout", function() {
                $(this).attr("fill-opacity", "1.0");
                $("#tooltip-container").hide();
            });

    g.append("path")
        .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
        .attr("class", "boundary")
        .attr("d", path);
  });

  d3.select(self.frameElement).style("height", height + "px");

});