function clear(i) {
	chrome.notifications.clear(i, function() {
		var j = {};
		$.each(StrNames, function(k,v) {
			if (k!==i)
				j[k] = v;
		});
		StrNames = j;
	});
}
chrome.notifications.onButtonClicked.addListener(function(id){
	// If user clicked button 'Install' in notification
	if (id === 'new_update')
		return chrome.runtime.reload();

	// Clicked 'Watch now'
	window.open('http://www.twitch.tv/'+StrNames[id]);
	clear(id);
	return true;
});
chrome.notifications.onClosed.addListener(function(id,u){
	if(u)
		clear(id);
});
chrome.notifications.onClicked.addListener(function(id) {
	clear(id);
});
chrome.runtime.onUpdateAvailable.addListener(function(m) {
	// Update available, informate user
	notify.send({
		type: 'sys',
		msg: 'Install update right now?',
		title: 'New update available!',
		button: 'Reload extension',
		name: 'update'
	});
});

var ncnt = 0;
var StrNames = {};

if (!localStorage.timeOut)
	localStorage.timeOut = '{}';
var timeOut = {
	init: function() {
		try {
			this.names = JSON.parse(localStorage.timeOut);
			timeOut.check();
		} catch(e) { return err(e); }
	},
	set: function(name) {
		this.names[name] = (new Date()).toJSON();
		this.save();
	},
	save: function() {
		try {
			localStorage.timeOut = JSON.stringify(this.names);
		} catch(e) {return err(e); }
	},
	find: function(n) {
		// return true if more than 15 second
		if (typeof this.names[n] === 'undefined')
			return true;

		var dif = ((new Date())-(new Date(this.names[n])))/1000;
		return dif>=15;
	},
	chck: -1,
	check: function() {
		if (this.chck !== -1)
			return true;

		this.chck = setTimeout(function() {
			var n = {}, ad = 0;
			for (var i in timeOut.names) {
				var c = timeOut.names[i];
				var dif = ((new Date())-(new Date(c)))/1000;
				if (dif<15) {
					n[i] = c;
					ad++;
				}
			}
			timeOut.names = ad===0 ? {} : n;
			timeOut.save();
			timeOut.chck = -1;
		}, 0);
	}
};
timeOut.init();

/*
* Input: d {
*  type: system, update, change etc
*  name: name for storage
*  msg
*  title
*  context
*  button: Boolean or String
* }
*/
window.notify = {
	send: function(d) {
		this.list.push(d);
		setTimeout(function() {
			var d = notify.last();
			if (window.location.pathname !== '/background.html')
				return false;

			if (d.type === 'sys' || d.type === 'update')
				if (!d.name) {
					d.name = 'd'+Math.floor(Math.random(100)*100);
				}

			$.each(['type', 'name', 'context', 'button'], function(i,v) {
				d[v] = (typeof d[v] === 'undefined') ? '' : d[v];
			});

			if (!d.msg || !d.title)
				return Error("Invalid input");

			deb(d);
			function delNotify(i,t) {
				var idToDel = i, times = 60000;
				switch (t) {
					case 'online':
						times *= 30; break;
					case 'offline':
						times *= 30; break;
					case 'changed':
						times *= 10; break;
					case 'follow':
						times *= 3; break;
					default:
						times *= 5; break;
				}
				setTimeout(function(){
					chrome.notifications.clear(idToDel, function(){});}, times);
			}

			function sendNotify(d) {
				var k = d.name,
					config = {
						type           : "basic",
						title          : d.title,
						message        : d.msg,
						contextMessage : d.context,
						iconUrl        : "/img/notification_icon.png"
					};

				if (typeof d.button === 'boolean' && d.button)
					config.buttons = [{ title:"Watch now!" }];
				else if (typeof d.button === 'string')
					config.buttons = [{ title:d.button }];

				chrome.notifications.create('n'+ncnt, config, function(){
					StrNames['n'+ncnt] = d.name;
					if (d.type != 'sys')
						timeOut.set(d.name);
					delNotify('n'+ncnt, d.type);
					ncnt++;
					if (local.Config.Notifications.sound_status)
						new Audio('DinDon.ogg').play();
				});
			}

			if (local.Config.Notifications.status) {
				// If system update
				if (d.type === 'sys')
					return sendNotify(d);

				// If user in timoue
				if (!timeOut.find(d.name))
					return false;

				var j = local.Config.Notifications;

				// If notification disabled
				if (!j[d.type])
					return false;

				sendNotify(d);
			}
		}, Math.floor(Math.random()*1000));
	},
	list: [/* notify queue goes here */],
	last: function() {
		var t = this.list[0];
		this.list.shift();
		return t;
	}
};
