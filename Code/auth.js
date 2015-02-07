function init() {
	function show(f) {
		if (f.type == 'error') {
			err({message: f.msg, stack: f.e});
			// TODO: handle error
		} else {
			// TODO: show success (YES)
		}
	}

	var loc = document.location;
	if (loc.search !== '') {
		var err = document.location.search.slice(1).split('&')[0].split('=')[1];
		return show({type: 'error', error: err, stack: ''});
	}

	if (loc.hash === '') {
		return show({type: 'error', error: 'No hash tag', stack: ''});
	}
	var tkn = loc.hash.split('&')[0].split('=')[1];

	localJSON('Config.token', tkn);
	$.ajax({
		url:'https://api.twitch.tv/kraken/user?oauth_token='+tkn,
		dataType:'JSONP',
		complete: function(e){
			log('Got user');
			if (e.responseJSON.name !== undefined) {
				localJSON('Config.User_Name', e.responseJSON.name);
	        	localStorage.FirstLaunch = false;
				localJSON('Status.StopInterval', true);
			} else {
				show({type: 'error', msg:'Cannot get user name from response',stack:e});
			}
		},
		error: function(e){
			show({type: 'error', msg:'Cannot get username',stack:e});
		}
	});
}

$(init);