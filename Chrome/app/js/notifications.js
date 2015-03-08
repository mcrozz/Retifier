function clear(i) {
	chrome.notifications.clear(i,function() {
		var j = {};
		$.each(StrNames, function(k,v) {
			if (k!==i)
				j[k] = v;
		});
		StrNames = j;
	});
}
chrome.notifications.onButtonClicked.addListener(function(id){
	window.open('http://www.twitch.tv/'+StrNames[id]);
	clear(id);
	return true; });
chrome.notifications.onClosed.addListener(function(id,u){
	if(u) clear(id); });
chrome.notifications.onClicked.addListener(function(id) {
	clear(id); });

var ncnt = 0;
var StrNames = {};

if (!localStorage.timeOut)
	localStorage.timeOut = '{}';
var timeOut = {
	init: function() {
		try {
			this.names = JSON.parse(localStorage.timeOut);
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
	check: function() {
		var n = {}, ad = 0;
		for (var i in this.names) {
			var c = this.names[i];
			var dif = ((new Date())-(new Date(c)))/1000;
			if (dif<15) {
				n[i] = c;
				ad++;
			}
		}
		this.names = ad===0 ? {} : n;
		this.save();
	}
};
timeOut.init();

function Notify(d) {
	if (window.location.pathname !== '/background.html')
		return false;

	if (d.type === 'sys' || d.type === 'update')
		d.name = 'd'+Math.floor(Math.random(100)*100);

	$.each(['type', 'name', 'msg', 'title', 'context', 'button'], function(i,v) {
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
		if (d.button)
			config.buttons = [{ title:"Watch now!" }];
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
		if (!timeOut.find(d.name))
			return false;

		var j = local.Config.Notifications;

		if (!j[d.type] && d.type !== 'sys')
			return false;

		sendNotify(d);
	}
}
