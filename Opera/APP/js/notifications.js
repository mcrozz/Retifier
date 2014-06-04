function notifyUser(streamerName, titleOfStream, type, streamer) {
	if (window.location.pathname !== '/background.html') return false;
	function sendNotify(tle, msg, strm, upd) {
		log(tle+' - '+msg);
		if (local.Config.Notifications.sound_status) {
			var Audio = document.createElement('audio');
			Audio.src = '/Music/'+local.Config.Notifications.sound+'.{{AUDIO_FORMAT}}';
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