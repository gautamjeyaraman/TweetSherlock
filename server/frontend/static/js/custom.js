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

function renderView6(){
    $("#sentimentchart").html("");
    
    var sentimentInfo = {"positive":0,
                         "negative":0,
                         "nautral":0}

    for(var i=0;i<data.length;i++){
        if(data[i].sentiment > 65){
            sentimentInfo["positive"] += 1;
        }
        else if(data[i].sentiment < 35){
            sentimentInfo["negative"] += 1;
        }
        else if(data[i].sentiment > 35 && data[i].sentiment < 65){
            sentimentInfo["nautral"] += 1;
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

function renderAllViews(){
    renderView1();
    renderView2();
    renderView6();
}

$(document).ready(function() {
    initiateWidgetEvents();
});
