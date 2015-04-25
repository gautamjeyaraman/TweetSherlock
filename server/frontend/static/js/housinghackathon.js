$('#search_button').live('click',function(e){
	e.preventDefault();
	var seacrch_key = $('#search_key').val();
	console.log(seacrch_key)
	var url = '/api/latest/tweets';
	var params = {'search_key':seacrch_key}
	$.get(url, params).then(function(res){
			if(res.data){
				window.data = res.data
				$('#search_key').val("");
				} 
	});
		                             
});
