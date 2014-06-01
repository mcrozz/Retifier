function notifyUser(streamerName, titleOfStream, type, streamer) {
	if (window.location.pathname !== '/background.html') return false;
	function delNotify(id, types) {
		var idToDel = id, times = 1000;
		switch (types) {
			case 'Online': times *= 120; break;
			case 'Changed': times *= 60; break;
			default: times *= 60; break;
		}
		setTimeout(function(){chrome.notifications.clear(idToDel, function(){});}, times);
	}

	function sendNotify(tle, msg, strm, upd) {
		log(tle+' - '+msg);
		var NotifyConf = {type:"basic", title:tle, message:msg, iconUrl:"/img/icon.png"};
		if (upd !== 'ScriptUpdate') NotifyConf['buttons']=[{title:"Watch now!"}];
		chrome.notifications.create('n'+strm, NotifyConf, function(){});
		delNotify('n'+strm, upd);
		if (local.Config.Notifications.sound_status) {
			var Audio = document.createElement('audio');
			Audio.src = '/Music/'+local.Config.Notifications.sound+'.mp3';
			Audio.autoplay = 'autoplay';
		}
	}

	if (local.Config.Notifications.status) {
		if (type === 'Online' && local.Config.Notifications.online) {
			sendNotify(streamerName, titleOfStream, ncnt, type);
			ncnt++; NameBuffer.push(streamer);
		} else if (type === 'Changed' && local.Config.Notifications.update) {
			sendNotify(streamerName, titleOfStream, ncnt, type);
			ncnt++; NameBuffer.push(streamer);
		} else if (type === 'ScriptUpdate' && !sessionStorage.Disable_Update_Notifies) {
			sendNotify(streamerName, titleOfStream, ncnt, type);
			ncnt++; NameBuffer.push(' ');
		} else { log(streamerName+' '+titleOfStream+' :: [Was not displayed]'); }
	}
}