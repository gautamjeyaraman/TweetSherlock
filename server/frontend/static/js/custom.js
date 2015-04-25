var data = data || {};

function initiateWidgetEvents(){
    $('#search_button').click(function(e){
	    e.preventDefault();
	    var q = $('#search_key').val();
	    var url = '/api/latest/tweets';
	    var params = {'q': q}
	    $.get(url, params).then(function(res){
			    if(res.data){
				    data = res.data
				    $('#search_key').val("");
                    renderAllViews();
			    } 
	    });
		                                 
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

function renderAllViews(){
    renderView1();
    renderView2();
    renderView4();
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
