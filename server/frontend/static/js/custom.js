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
			    } 
	    });
		                                 
    });
}

function renderView1(){

}

function renderView2(){

}

function renderAllViews(){
    renderView1();
    renderView2();
}

$(document).ready(function() {
    renderAllViews();
    initiateWidgetEvents();
});
