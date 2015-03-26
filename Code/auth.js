window.parseMsg = function() {};
function init() {
	deb("Script loaded... "+document.readyState);
	function show(f) {
		if (f.type == 'error') {
			// Something happen
			// err({message: f.msg, stack: f.e});

			var r = $('p>code');

			r[0].innerText = f.msg;
			if (!f.expl) {
				delete r[1]; }
			else
				r[1].innerText = f.expl;

			$('.pending').hide();
			$('.failed').show();
		} else {
			// Succeed
			$('.pending').hide();
			$('.succeed').show();
		}
	}

	var loc = document.location;
	if (loc.search !== '') {
		var err = document.location.search.slice(1).split('&')[0].split('=')[1];
		var huer;
		switch (err) {
			case "": huer=""; break;
		}
		return show({type: 'error', msg: err, expl: huer, stack: ''});
	}

	if (loc.hash === '') {
		return show({type: 'error', msg: 'No hash tag', stack: ''});
	}
	var tkn = loc.hash.split('&')[0].split('=')[1];

	local.set('Config.token', tkn);
	$.ajax({
		url:'https://api.twitch.tv/kraken/?oauth_token='+tkn,
		dataType:'JSONP',
		complete: function(e){
			log('Got user');
			if (e.responseJSON.token.user_name !== undefined && e.responseJSON.token.valid) {
				local.set('Config.User_Name', e.responseJSON.token.user_name);
				localStorage.FirstLaunch = false;
				local.set('Status.StopInterval', true);
				show({type: 'ok'});
				send({type: 'reload'});
			} else {
				show({type: 'error', msg:'Cannot get user name from response',stack:e});
			}
		},
		error: function(e){
			show({type: 'error', msg:'Cannot get username', stack:e});
		}
	});
	$('button').on('click', function(){window.close();});
}
deb("Initializing...");
$(window).load(function(){setTimeout(init, 250);});
