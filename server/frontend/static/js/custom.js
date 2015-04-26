var data = data || {};



function initiateWidgetEvents(){
    $('#search_button').click(function(e){
	    e.preventDefault();
	    $(".loading").css("display", "block");
	    var q = $('#search_key').val();
	    var url = '/api/latest/tweets';
	    var params = {'q': q}
	    $.get(url, params).then(function(res){
        	    $(".loading").hide();
			    if(res.data){
				    data = res.data
                    $('html, body').animate({
                        scrollTop: 1000
                    }, 700);
				    $('#search_key').val("");
                    renderAllViews();
			    } 
	    });
		                                 
    });
    
    $('#search_key').keydown(function(event){ 
        var keyCode = (event.keyCode ? event.keyCode : event.which);   
        if (keyCode == 13) {
            $('#search_button').trigger('click');
        }
    });
}

function renderView1(){
    $("#viewDiv7-top").html("");

    var viewTmpl7 = _.template($("#viewItem7").html());
    var viewDiv7 = $("#viewDiv7-top");
    viewDiv7.html("");
    data = _.sortBy(data, function(item){ return -item.sentiment;});
    for(var i=0; i<5; i++){
        data[i].className = (i%2 != 0)?"alt":"";
        data[i].type = "positive";
        viewDiv7.append(viewTmpl7(data[i]));
    }

    $("#viewDiv7-bottom").html("");
    var viewTmpl7 = _.template($("#viewItem7").html());
    var viewDiv7 = $("#viewDiv7-bottom");
    viewDiv7.html("");
    data = _.sortBy(data, function(item){ return item.sentiment;});
    for(var i=0; i<5; i++){
        data[i].className = (i%2 != 0)?"alt":"";
        data[i].type = "negative";
        viewDiv7.append(viewTmpl7(data[i]));
    }
}

function renderView2(){
    $("#donutchart").html("");

    var info = {"Verified": 0,
                "Not Verified": 0};

    for(var i=0; i<data.length; i++){
        if(data[i].user.verified){
            info["Verified"] += 1;
        }
        else{
            info["Not Verified"] += 1;
        }
    }

    var rows = _.pairs(info);
    var renderData = [];
    var totalRevs = 0;
    for(var i=0; i<rows.length; i++){
        renderData.push({'label': rows[i][0],
                         'data': rows[i][1]
                        });
        totalRevs += rows[i][1];
    }
    
    $.plot($("#donutchart"), renderData, {
		series: {
				pie: {
						innerRadius: 0.5,
						show: true
				}
		},
		legend: {
			show: false
		},
		colors: ["#FA5833", "#2FABE9"]
	});
	
	$("#total-revs").html(totalRevs);
}

function renderView5(){
    var viewDiv5 = $("#viewDiv5");
    viewDiv5.html("");
    var hashtagList = {};
    var viewTmpl5 = _.template($("#viewItem5").html());
	for(var i=0; i<data.length; i++){
        for(var j=0; j<data[i].hashtags.length; j++){
            var hashtag = data[i].hashtags[j];
            if(_.has(hashtagList, hashtag)){
                hashtagList[hashtag] = hashtagList[hashtag] + 1;
            }else{
                hashtagList[hashtag] = 1;
            }
        }
    }

    hashtagList = _.pairs(hashtagList)
    var maxOc = 0;
    _.each(hashtagList, function(d){ if (d[1] > maxOc){maxOc = d[1];}});
    hashtagList = _.sortBy(hashtagList, function(d){return -d[1];}).slice(0, 10);
    for(var i=0; i<hashtagList.length; i++){
        datadict = {'occPer': (hashtagList[i][1] / maxOc) * 100,
                    'name': hashtagList[i][0],
                    'count': hashtagList[i][1]
        };
        viewDiv5.append(viewTmpl5(datadict));
    } 
}

function renderView3(username){
    var viewDiv8 = $("#viewDiv8");
    viewDiv8.html("");
    var tweet;
    for(var i=data.length-1; i>=0; i--){
        if(data[i].user.name == username){
            var viewTmpl8 = _.template($("#viewItem8").html());
            viewDiv8.append(viewTmpl8(data[i]));
            return;
        }
    }
}

function renderView4(){
    var impName = renderGraph1("viewDiv9");
    $("a[data-feature]").click(function(){
        renderView3($(this).data("feature"));
    });
    renderView3(impName);
}

function renderView6(){
    $("#sentimentchart").html("");
    
    var sentimentInfo = {"positive":0,
                         "negative":0,
                         "neutral":0}

    for(var i=0;i<data.length;i++){
        if(data[i].sentiment >= 65){
            sentimentInfo["positive"] += 1;
        }
        else if(data[i].sentiment <= 35){
            sentimentInfo["negative"] += 1;
        }
        else if(data[i].sentiment > 35 && data[i].sentiment < 65){
            sentimentInfo["neutral"] += 1;
        }
    }

    var rows = _.pairs(sentimentInfo);
    var renderData = [];
    var totalRevs = 0;
    for(var i=0; i<rows.length; i++){
        renderData.push({'label': rows[i][0],
                         'data': rows[i][1]
                        });
        totalRevs += rows[i][1];
    }
    
    $.plot($("#sentimentchart"), renderData, {
		series: {
				pie: {
						innerRadius: 0.5,
						show: true
				}
		},
		legend: {
			show: false
		},
		colors: ["#1B5E20", "#FF9800", "#F44336"]
	});
	
	$("#total-revs").html(totalRevs);
}

function getMeanByKey(key){
    var sum = data.reduce(function(sum, value){
      return sum + value['count'][key];
    }, 0); 
    var mean = sum / data.length;
    return mean;
}

function getMeanByValue(arr){
    var sum = arr.reduce(function(sum, value){
      return sum + value;
    }, 0); 
    var mean = sum / arr.length;
    return mean;
}

function getSD(key){
    var mean = getMeanByKey(key)
    var diffs = data.map(function(value){
      var diff = value['count'][key] - mean;
      var sqr = diff * diff;
      return sqr;
    });
    
    var avgSquareDiff = getMeanByValue(diffs);
    var stdDev = Math.sqrt(avgSquareDiff);
    return {'sd': stdDev, 'mean': mean};
}

function renderView9(){
    var keys = ['favorite', 'retweet', 'views'];

    for(var i=0; i<data.length; i++){
        data[i].stats = {};
        for(var j=0; j<keys.length; j++){
            data[i].stats[keys[j]] = 0;
        }
    }

    for(var i=0; i<keys.length; i++){
        var stats = getSD(keys[i]);
        for(var j=0; j<data.length; j++){
            if(data[j].count[keys[i]] > stats.mean){
                var val = data[j].count[keys[i]] - stats.mean;
                data[j].stats[keys[i]] = ~~(val / stats.sd);
            }
        }
    }

    for(var i=0; i<data.length; i++){
        data[i].stats.total = 0;
        for(var j=0; j<keys.length; j++){
            data[i].stats.total += data[i].stats[keys[j]];
        }
    }

    var info = _.sortBy(data, function(d){return -d.stats.total;}).slice(0,5);

    var viewDiv0 = $("#viewDiv0");
    viewDiv0.html("");
    var viewTmpl0 = _.template($("#viewItem0").html());
    viewDiv0.append(viewTmpl0({'info': info}));
}

function renderAllViews(){
    renderView1();
    renderView2();
    renderView5();
    renderView4();
    renderView6();
    renderView9();
}

$(document).ready(function() {
    initiateWidgetEvents();
});

function renderGraph1(targetId){
    var returnValue;

    targetDiv = $("#" + targetId);
    targetDiv.html("");

    var width = targetDiv.width(),
        height = targetDiv.height(),
        padding = 1.5,
        maxRadius = 12;

    var nodes = normalize();
    
    // Use the pack layout to initialize node positions.
    d3.layout.pack()
        .sort(null)
        .size([width, height])
        .children(function(d) { return d.values; })
        .value(function(d) { return d.radius * d.radius; })
        .nodes(nodes);

    var force = d3.layout.force()
        .nodes(nodes)
        .size([width, height])
        .gravity(.02)
        .charge(0)
        .on("tick", tick)
        .start();

    var svg = d3.select("#" + targetId).append("svg")
        .attr("width", width)
        .attr("height", height);

    var node = svg.selectAll("a")
        .data(nodes)
      .enter()
        .append("a")
        .attr("data-feature", function(d){ return d.name;})
        .call(force.drag);
    
    var circleG = node.append("g")
                       .attr("class", "negG");

    circleG.append("circle")
        .attr("r", function(d){ return d.radius; })
        .style("fill", function(d) { if(d.verified){return "#a0f271";}else{return "#eee";} })
        .style("stroke", "#AAA")
        .style("stroke-width", "1.5px");

    var textNode = node.append("g")
                       .attr("class", "textNodes");
    
    textNode.append("text")
        .text(function(d) { return d.name; })
        .attr("dy", "0.3em")
        .attr("class", "labelName")
        .style("text-anchor", "middle")
        .style("font-size", function(d){ return d.fontSize.toString() + "px"; });
    
    var minFont = 18;
    
    textNode.append("text")
        .text(function(d) { return d.followers; })
        .attr("dy", function(d){ var dp = (d.radius/2); return dp > minFont?dp.toString()+"px": minFont.toString() + "px"; })
        .attr("class", "labelVal")
        .style("text-anchor", "middle");

    node.transition()
        .duration(750)
        .delay(function(d, i) { return i * 5; });

    function tick(e) {
      node.selectAll("circle")
          .each(collide(.5));
      
      node.attr("transform", function(d) { 
            d.x = Math.max(d.radius, Math.min(width - d.radius, d.x));
            d.y = Math.max(d.radius, Math.min(height - d.radius, d.y));
            return "translate(" + d.x + "," + d.y + ")";
      });
    }

    // Resolves collisions between d and all other circles.
    function collide(alpha) {
      var quadtree = d3.geom.quadtree(nodes);
      return function(d) {
        var r = d.radius + maxRadius + padding,
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
        quadtree.visit(function(quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== d)) {
            var x = d.x - quad.point.x,
                y = d.y - quad.point.y,
                l = Math.sqrt(x * x + y * y),
                r = d.radius + quad.point.radius + padding;
            if (l < r) {
              l = (l - r) / l * alpha;
              d.x -= x *= l;
              d.y -= y *= l;
              quad.point.x += x;
              quad.point.y += y;
            }
          }
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
      };
    }
    
    //Method to normalize the data
    function normalize(){
        var range = [25, 75];
        var fontRange = [14, 40];

        var info = {};
        for(var i=0; i<data.length; i++){
            info[data[i].user.name] = data[i].user;
        }
        var users = _.sortBy(_.values(info), function(d){return -d.followers;}).slice(0, 30).reverse();
        returnValue = users[users.length-1].name;

        var minR = _.min(users, function(d){return d.followers});
        minR = minR.followers;
        
        var maxR = _.max(users, function(d){return d.followers});
        maxR = maxR.followers;
        
        users = users.map(function(d){
            d.radius = (d.followers - minR) / maxR;
            d.fontSize = (d.radius * (fontRange[1] - fontRange[0])) + fontRange[0];
            d.radius = (d.radius * (range[1] - range[0])) + range[0];
            return d;
        });
        
        return users;
    }

    return returnValue;
}
