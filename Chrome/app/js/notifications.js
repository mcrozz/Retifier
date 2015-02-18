function clear(i) {
	chrome.notifications.clear(i,function() {
		$.each(NotifyNames, function(k,v) {
			if (v[1]===i)
				NotifyNames[k][0] = true;
		});
	});
}
chrome.notifications.onButtonClicked.addListener(function(id){$.each(NotifyNames, function(i,v){if(v[1]===id){window.open('http://www.twitch.tv/'+i);return true;}}); clear(id);});
chrome.notifications.onClosed.addListener(function(id,u){if(u)clear(id)});
chrome.notifications.onClicked.addListener(function(id){clear(id)});

var ncnt = 0,
	NotifyNames = {};

function Notify(d) {
	if (window.location.pathname !== '/background.html') return false;
	if (d.type === 'sys' || d.type === 'update')
		d.name = 'd'+Math.floor(Math.random(100)*100);
	$.each(['type', 'name', 'msg', 'title', 'context', 'button'], function(i,v) {
		d[v] = typeof d[v] === 'undefined' ? '' : d[v];
	});
	if (!d.msg || !d.title)
		return Error("Invalid input");
	deb(d);
	function delNotify(i,t) {
		var idToDel = i, times = 60000;
		switch (t) {
			case 'Online':
				times *= 30; break;
			case 'Changed':
				times *= 10; break;
			default:
				times *= 5; break;
		}
		setTimeout(function(){chrome.notifications.clear(idToDel, function(){})}, times);
	}

	function sendNotify(d) {
		var k = d.name,
			config = {
			type           : "basic",
			title          : d.title,
			message        : d.msg,
			contextMessage : d.context,
			iconUrl        : "/img/notification_icon.png"}
		if (d.button)
			config['buttons'] = [{
				title:"Watch now!"
			}];
		chrome.notifications.create('n'+ncnt, config, function(){
			NotifyNames[d.name] = [false, 'n'+ncnt];
			delNotify('n'+ncnt, d.type);
			ncnt+=1;
		});
		if (local.Config.Notifications.sound_status)
			new Audio('DinDon.ogg').play();
	}

	if (local.Config.Notifications.status) {
		var j = local.Config.Notifications;
		
		if (!j[d.type])
			return false;

		sendNotify(d);
	}
}