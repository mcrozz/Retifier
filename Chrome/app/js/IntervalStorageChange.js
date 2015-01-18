chrome.runtime.onMessage.addListener(function(msg) {
	if (msg.type == "update")
		loc();
	else
		// Background and popup pages will have different parseMsg
		parseMsg(msg);
});
if (window.location.pathname === '/background.html') {
	chrome.runtime.onMessageExternal.addListener(function(msg, d, resp) {
		deb(msg, d, resp);

		if (d.url.match('http://twitchtvnotifier.host-ed.me/auth.php').length === 0)
			return;
		
		if (msg.code == 'token') {
			var f = msg.token;
			localJSON('Config.token', f);
			$.ajax({url:'https://api.twitch.tv/kraken/user?oauth_token='+f,dataType:'JSONP',complete:function(e){
				log('Got user');
				if (e.responseJSON.name !== undefined) {
					localJSON('Config.User_Name', e.responseJSON.name);
			        localStorage.FirstLaunch = false;
					localJSON('Status.StopInterval',true);
				} else { err({message:'Cannot get user name from response',stack:e}) }
			}, error:function(e){err({message:'Tried to get username',stack:e})}});
		} else if (msg.code == 'error') {
			err({message:'Failed to get token', stack:msg});
		}
	});
}