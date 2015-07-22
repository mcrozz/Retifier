/*
Copyright 2013-2015 Ivan 'MacRozz' Zarudny

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
function tm(j) {
	function g(s) {
		return s<10 ? '0'+s : s;
	}
	var d = new Date();
	return '['+g(d.getHours())+':'+g(d.getMinutes())+':'+g(d.getSeconds())+']'+j;
}
function err(msg) {
	console.error(tm(': ')+msg.message ? msg.message : msg);
	if (msg.stack)
		console.debug(msg.stack);
}
function log(msg) {
	console.log(tm(': ')+msg);
}
function deb(msg) {
	if(!msg) return;
	console.debug(msg);
}
function TimeNdate(d,m) {
	var j = [31,28,31,30,31,30,31,31,30,31,30,31];
	return (new Date()).getTime()+(Math.abs(d)*86400000)+(Math.abs(m)*86400000*j[(new Date()).getMonth()]);
}
function _$(id){
		// Do not try element selector e.g. button.No
		if ($.inArray(id[0], ['.', '#']) != -1) return $(id)[0];
		return $('#'+id)[0];
}
function date(_date) {
	if (typeof _date == "undefined")
		return (new Date()).getTime();
	return (new Date(_date)).getTime();
}
function c(n, par) {
	var el = document.createElement(n);
	if (par) {
		$.each(par, function(i,v) {
			el[i] = v;
		});
	}
	return el;
}

window.local = new modelLocal();

function badge(count) {
	chrome.browserAction.setBadgeText({ text: String(count) });
	if (count !== 0) {
		chrome.browserAction.setBadgeBackgroundColor({color:"#593a94"});
		chrome.browserAction.setIcon({path:"/img/icon_1.png"}, function(){});
	} else {
		chrome.browserAction.setBadgeBackgroundColor({color:"#c9c9c9"});
		chrome.browserAction.setIcon({path:"/img/icon_0.png"}, function(){});
	}
}
function send(msg, callback) {
	$.each(chrome.extension.getViews(), function(i,v) {
		if (v.location.pathname === location.pathname)
			return;

		if (typeof v.parseMessage === 'function')
			v.parseMessage(msg, null, (typeof callback === 'function')?callback:null);
	});
}
jQuery.fn.extend({
	anim: function(name, dur, hide) {
		var _this = this;

		if (this.css('display') === 'none' || !this.css('display'))
			this.show();

		this.css('-webkit-animation', name+' both '+dur+'s');
		setTimeout(function() {
			if (hide)
				_this.hide();
		}, dur);
	}
});

(function() {
	if (window.location.pathname === '/background.html') {
		$.ajaxSetup({cache:false,crossDomain:true});
		postMessage("Need assistance");
	}
	local.init();
})();

function modelLocal() {
	this.tried = 0;
	this.init = function(w) {
		if (typeof w !== 'undefined') {
			if (typeof this[w] !== 'undefined' && w !== -1) {
				try {
					this[w] = JSON.parse(localStorage[w]);
				} catch(e) { return err(e); }
				return true;
			}
		}
		this.tried++;
		try {
			this.Config = JSON.parse(localStorage.Config);
			this.Status = JSON.parse(localStorage.Status);
			this.FollowingList = JSON.parse(localStorage.FollowingList);
			this.Following = JSON.parse(localStorage.Following);
			this.Game.list = JSON.parse(localStorage.Games);
			this.following.hash();
			this.tried = 0;
		} catch(e) {
			err(e);
			if (this.tried < 25)
				local.init();
		}
		return true;
	};
	this.set = function(pth, val) {
		if (!pth || typeof val==='undefined')
			return err("Invalid input @ function local.set()");
		try {
			function pr(v) {
				switch(val[0]) {
					case '+':
						return parseFloat(v)+parseFloat(val.slice(1));
					case '-':
						return parseFloat(v)-parseFloat(val.slice(1));
					default:
						return val;
				}
			}
			var pth = pth.split('.');
			switch (pth.length) {
				case 1:
					this[pth[0]] = pr(this[pth[0]]); break;
				case 2:
					this[pth[0]][pth[1]] = pr(this[pth[0]][pth[1]]); break;
				case 3:
					this[pth[0]][pth[1]][pth[2]] = pr(this[pth[0]][pth[1]][pth[2]]); break;
				default:
					return err("Path is too long @ function localJSON()");
			}
			localStorage[pth[0]] = JSON.stringify(this[pth[0]]);
			send({type:'update', data:pth[0]});
		} catch(e) { return err(e); }
	}
	this.default = {
		Name: 'invalid',
		Stream: false,
		Notify: true
	}
	this.following = {
		get: function(n) {
			// Returns streamer obj
			var itm = isNaN(n) ?
				local.FollowingList[local.following.map[n.toLowerCase()]] :
				local.FollowingList[n];

			return (typeof itm === 'undefined') ? null : itm;
		},
		set: function(id, dt) {
			try {
				if (isNaN(id))
					id = local.following.map[id.toLowerCase()];

				var tm = local.FollowingList[id];
				if (typeof tm !== 'undefined')
					$.each(['Name', 'Stream', 'Notify'], function(i,v) {
						if (typeof tm[v] === 'undefined')
							dt[v] = local.default[v];
						else if (typeof dt[v] === 'undefined')
							dt[v] = tm[v];
						});

				local.FollowingList[id] = dt;
				localStorage.FollowingList = JSON.stringify(local.FollowingList);
				// if something changed inform popup window
				if (tm !== dt)
					send({type: 'update', data: 'FollowingList'});
				return true;
			} catch (e) { return err(e); }
		},
		del: function(name) {
			var newObj = {};
			$.each(local.FollowingList, function(i,v) {
				if (v.Name.toLowerCase() !== name.toLowerCase())
					newObj[i] = v;
			});

			local.set('FollowingList', newObj);
		},
		map: { /* String : Int ..*/ },
		hash: function() {
			// Hash positions
			local.following.map = {};
			$.each(local.FollowingList, function(i,v) {
				local.following.map[v.Name.toLowerCase()] = i;
			});
		}
	}
	this.Game =  {
		check : function(name) {
			setTimeout(function() {
				if (local.Game.list.length > 50)
					local.set('Games', []);

				if (local.Game.list.indexOf(name) !== -1)
					return;

				var dname = encodeURI(name);
				$.getJSON('https://api.twitch.tv/kraken/search/games?q='+dname+'&type=suggest')
				.done(function(e) {
					var isThere = false;
					if (e.games.length === 0)
						isThere = false;
					else
						$.each(e.games, function(i,v) {
							if (v.name === name) {
								isThere = true;
							}
						});
					// preventing from error on local.set side
					if (isThere)
						local.Game.add(name);
				});
			}, 0);
		},
		list: [/* thumbnail is available */],
		add: function(name) {
			this.list.push(name);
			local.set('Games', this.list);
		}
	}
};

/*
* msg : object {
*  type : String [ update,  ],
*  data : String or object
* }
*/

// Dismiss all notifications when user opens extension's window
if (location.pathname === '/popup.html') {
	chrome.notifications.getAll(function(n) {
		$.each(n, function(i,v) {
			if (i == 'new_update' || i == 'sys')
				return;
			chrome.notifications.clear(i, function(){});
		});
	});
}

window.parseMessage = function(msg, s, resp) {
	if (typeof msg === 'string')
		msg = {type: msg};

	if (location.pathname.search('background') !== -1) {
		// If something is wrong or new update
		// This object will be indicate what's
		// went wrong:
		// * 777 - token is invalid
		// * 123 - extension updated
		if (!window.toShow)
			window.toShow = -1;

		switch(msg.type) {
			case "refresh": bck.init(); break;
			case "getOnline": bck.getList(); break;
			case "flush": bck.flush(); break;
			case "update": local.init(msg.data); break;
			case "getInf": resp({type:"inf", data:toShow}); toShow=-1; break;
			case "reload": chrome.runtime.reload(); break;
		}
	} else {
		switch(msg.type) {
			case "update": local.init(msg.data); break;
			case "following": insert(msg.data); break;
		}
		if (msg.type === 'update' && msg.data === 'Status')
			updateStatus();
	}
};

chrome.notifications.onButtonClicked.addListener(function(id){
	// If user clicked button 'Install' in notification
	if (id === 'new_update')
		return chrome.runtime.reload();

	// Clicked 'Watch now'
	window.open('http://www.twitch.tv/'+window.notify.timeMeOut.getName(id));
	window.notify.timeMeOut.dismiss(id);
});
chrome.notifications.onClicked.addListener(function(id) {
	window.notify.timeMeOut.dismiss(id);
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
					iconUrl        : "/img/Notification_512.png"
				};

				if (typeof d.button === 'boolean' && d.button)
					config.buttons = [{ title:"Watch now!" }];
				else if (typeof d.button === 'string')
					config.buttons = [{ title:d.button }];

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
		}, Math.floor(Math.random()*1000));
	},
	list: [/* notify queue goes here */],
	last: function() {
		var t = this.list[0];
		this.list.shift();
		return t;
	}
};

function time(t) {
	function h(b,j) {
			if (b === 0) { return '00'+j; }
			else if (b < 10) { return '0'+b+j; }
			else { return b.toString()+j; }
	}
	var SubtractTimes, Days, Hours, Minutes, Seconds, Time

	if (isNaN((new Date(t)).getTime())) return '';
	SubtractTimes = (((new Date()).getTime() - (new Date(t)).getTime()) / 1000);

	Days = Math.floor(SubtractTimes/86400);
	SubtractTimes -= Days*86400;
	if (Days == 0) { Days = ''; } else { Days = (Days < 10) ? '0'+Days+'d:' : Days+'d:'; }

	Hours = Math.floor(SubtractTimes/3600);
	SubtractTimes -= Hours*3600;
	Hours = h(Hours, 'h:');

	Minutes = Math.floor(SubtractTimes/60);
	SubtractTimes -= Minutes*60;
	Minutes = h(Minutes, 'm:')

	Seconds = Math.floor(SubtractTimes);
	Seconds = h(Seconds, 's');

	Time = Days + '' + Hours + '' + Minutes + '' + Seconds;
	return Time;
}

// https://www.google-analytics.com
if (navigator.onLine) {
	(function(i,s,o,g,r,a,m){
		i['GoogleAnalyticsObject']=r;
		i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},
		i[r].l=1*date();
		a=s.createElement(o), m=s.getElementsByTagName(o)[0];
		a.async=true; a.src=g;
		m.parentNode.insertBefore(a,m);
	})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
	ga('create', 'UA-25472862-3', {cookieDomain: 'none'});
	ga('set', 'checkProtocolTask', function(){});
	ga('set', 'anonymizeIp', true);
	ga('require', 'displayfeatures');
	ga('send', 'pageview', {
		'page': location.pathname,
		'title': location.pathname});

	// https://www.parsecdn.com
	if (location.href.split('/').pop(1) === 'background.html') {
		(function(){
			var p=document.createElement('script'),
				s=document.getElementsByTagName('script')[0];
			p.async=true; p.src='./js/parse-1.4.2.min.js';
			p.onload = function(){
				parse=true; Parse.initialize("PfjlSJhaRrf9GzabqVMATUd3Rn8poXpXjiNAT2uE","h4148nbRRIWRv5uxHQFbADDSItRLO631UR6denWm");
				var sdo = new Parse.Query(Parse.Object.extend('Donators')), f;
				sdo.each(function(e) {
					if (e.attributes.User===local.Config.User_Name) {
						local.set('Config.Timeout', 1337);
						f = 1;
					}
				}).done(function() {
					if (f!==1 && local.Config.Timeout===1337)
						local.set('Config.Timeout',0);
				});
				var sad = new Parse.Query(Parse.Object.extend('Ads')), t=[];
				sad.each(function(e) {
					t.push(e.attributes.TwitchName);
				}).done(function() {
					localStorage.Ads=JSON.stringify(t);
				});
			}
			s.parentNode.insertBefore(p,s);
		})();

		setInterval(function(){
			if (parse) {
				// Getting usernames from table 'Ads' on parse.com and inserting 'em in the localStorage
				var sad = new Parse.Query(Parse.Object.extend('Ads')), t=[];
				sad.each(function(e) {
					t.push(e.attributes.TwitchName);
				}).done(function() {
					localStorage.Ads=JSON.stringify(t);
				});
				// Getting usernames from table 'Donators'
				var sdo = new Parse.Query(Parse.Object.extend('Donators')), f;
				sdo.each(function(e) {
					if (e.attributes.User===local.Config.User_Name) {
						local.set('Config.Timeout',1337);
						f=1;
					}
				}).done(function() {
					if (f!==1 && local.Config.Timeout===1337)
						local.set('Config.Timeout',0)
				});
			}
		}, 600000);
	}
}