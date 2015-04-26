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



function renderAllViews(){
    renderView1();
    renderView2();
    renderView5();
}

$(document).ready(function() {
    initiateWidgetEvents();
});
