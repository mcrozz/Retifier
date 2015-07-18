/*chrome.notifications.onButtonClicked.addListener(function(id){
	// If user clicked button 'Install' in notification
	if (id === 'new_update')
		return chrome.runtime.reload();

	// Clicked 'Watch now'
	window.open('http://www.twitch.tv/'+window.notify.timeMeOut.getName(id));
	window.notify.timeMeOut.dismiss(id);
});
chrome.notifications.onClicked.addListener(function(id) {
	window.notify.timeMeOut.dismiss(id);
});*/
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

if (!localStorage.timeOut)
	localStorage.timeOut = '{}';
if (localStorage.timeOut[0] === '[')
	localStorage.timeOut = '{}';

setTimeout(function() {
	window.notify.timeMeOut.online.init();
	setInterval(window.notify.timeMeOut.tickme, 30000);
}, 0);

window.notify = {
	count: 0,
	timeMeOut: {
		add: function(name, typ, id) {
			var time = 60000;
			var times = {
				online : 10,
				offline: 10,
				changed:  1,
				follow :  1
			};
			time *= (times[typ]) ? times[typ] : 5;
			
			this.list[name] = [date()+time, id, date()+600000];
			// Add it to timeOut list, so user won't be 'attacked' on startup
			this.online.add(name);
		},
		del: function(name) {
			var tmp = {};
			$.each(this.list, function(i,v) {
				if (i != name)
					tmp[i] = v;
			});
			this.list = tmp;
		},
		list: {/* who's timeout and when expire */},
		online: {
			list: {/* list of online streamers and who gone offline in 10 min */},
			add: function(name) {
				this.list[name] = date();
				this.update();
			},
			is: function(name) {
				var isThere = false;
				$.each(this.list, function(i,v) {
					if (i === name) {
						isThere = true;
						return true;
					}
				});
				return isThere;
			},
			del: function(name) {
				var tmpObj = {};
				
				$.each (this.list, function(i,v) {
					if (i !== name)
						tmpObj[i] = v;
				});
				
				this.list = tmpObj;
				this.update();
			},
			update: function() {
				try {
					localStorage.timeOut = JSON.stringify(this.list);
				} catch (e) { err(e); }
			},
			init: function() {
				try {
					this.list = JSON.parse(localStorage.timeOut);
				} catch (e) { err(e); }
			}
		},
		dismiss: function(name) {
			// Dismiss notification
			if (name[0] === "=") {
				chrome.notifications.clear(name, function(){});
				// Remove from list
				this.del(this.getName(name));
			} else {
				chrome.notifications.getAll(function(v) {
					$.each(v, function(i,v) {
						if (name == i && v) {
							chrome.notifications.clear(i, function(){});
							return true;
						}
					});
				});
				// Remove from list
				this.del(name);
			}
			
		},
		tickme: function() {
			// Checking every notification for timeOut
			var curTime = date();
			$.each(window.notify.timeMeOut.online.list, function(i,v) {
				// Streamer went offline more than 10 minutes ago
				if (date() - v >= 60000)
					window.notify.timeMeOut.online.del(i);
			});
			
			$.each(window.notify.timeMeOut.list, function(i,v) {
				if (curTime >= date(v[0]))
					window.notify.timeMeOut.dismiss(i);
			});
		},
		getName: function(id) {
			var returns = null;
			$.each(this.list, function(i,v) {
				if (v[1] == id) {
					returns = i;
					return;
				}
			});
			return returns;
		}
	},
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
	send: function(d) {
		this.list.push(d);
		setTimeout(function() {
			if (window.location.pathname !== '/background.html')
				return false;

			var d = notify.last();
			
			if (window.notify.timeMeOut.online.is(d.name))
				return false;
			
			// You don't know when and how it'll happen
			if (window.notify.count>9999)
				window.notify.count = 0;
			var id = '='+(++window.notify.count);
			
			/*if (d.type === 'sys' || d.type === 'update')
				if (!d.name) {
					d.name = 'd'+Math.floor(Math.random(100)*100);
				}*/

			// Just in case of undefined
			$.each(['type', 'name', 'context', 'button'], function(i,v) {
				d[v] = (typeof d[v] === 'undefined') ? '' : d[v];
			});

			if (!d.msg || !d.title)
				return Error("Invalid input");

			deb(d);

			function sendNotify(d) {
				var config = {
					type           : "basic",
					title          : d.title,
					message        : d.msg,
					contextMessage : d.context,
					iconUrl        : "img/Notification_512.png"
				};

				/*if (typeof d.button === 'boolean' && d.button)
					config.buttons = [{ title:"Watch now!" }];
				else if (typeof d.button === 'string')
					config.buttons = [{ title:d.button }];*/

				chrome.notifications.create(id, config, function() {
					// Add to timeOut queue
					if (d.type != 'sys') {
						window.notify.timeMeOut.add(d.name, d.type, id);
						if (d.type == 'offline')
							window.notify.timeMeOut.online.del(d.name);
					}
					// Play sound
					if (local.Config.Notifications.sound_status)
						new Audio('DinDon.ogg').play();
				});
			}

			if (local.Config.Notifications.status) {
				// If system update
				if (d.type === 'sys')
					return sendNotify(d);

				var j = local.Config.Notifications;

				// If notification disabled
				if (!j[d.type])
					return false;

				sendNotify(d);
			}
		}, Math.floor(Math.random()*500+500));
	},
	list: [/* notify queue goes here */],
	last: function() {
		var t = this.list[0];
		this.list.shift();
		return t;
	}
};
