var ncnt = 0,
	NotifyNames = {};

function Notify(d) {
	if (window.location.pathname !== '/background.html')
		return false;
	if (d.type === 'sys' || d.type === 'update')
		d.name = 'd'+Math.floor(Math.random(100)*100);
	$.each(['type', 'name', 'msg', 'title', 'context', 'button'], function(i,v) {
		d[v] = typeof d[v] === 'undefined' ? '' : d[v];
	});
	if (!d.msg || !d.title)
		return Error("Invalid input");
	deb(d);

	function sendNotify(d) {
		var ntf = new Notification(d.title, {
			body: d.msg,
			icon: "/img/notification_icon.png"
		}),
			j = d.name;
		if (d.button) {
			ntf.onClick = function(){
				window.open('http://www.twitch.tv/'+j);
			}
		}
		if (local.Config.Notifications.sound_status)
			new Audio('DinDon.ogg').play();
	}

	if (local.Config.Notifications.status) {
		var j = local.Config.Notifications;
		switch (d.type) {
			case 'online':
				// Somebody gone online
				if (!j.online) return false; break;
			case 'follow':
				// Somebody changed title or game
				if (!j.follow) return false; break;
			case 'update':
				// Infrorm about any steps
				if (!j.update) return false; break;
			case 'sys':
				break;
			default:
				return false; break;
		}
		sendNotify(d);
	}
}