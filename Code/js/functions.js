{{LICENSE_HEADER}}
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

{{BADGE_ONLINE_COUNT}}
{{SEND_MSG}}
jQuery.fn.extend({
	anim: function(name, dur, hide) {
		var _this = this;

		if (this.css('display') === 'none' || !this.css('display'))
			this.show();

		this.css('-{{PLATFORM_}}-animation', name+' both '+dur+'s');
		setTimeout(function() {
			if (hide)
				_this.hide();
		}, dur);
	}
});

{{FUNCTIONS_FIRST_START}}

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
					$.each(['Name', 'Stream', 'Notify', 'Followed'], function(i,v) {
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

{{INTERVAL_STORAGE_CHANGE}}

{{NOTIFY_USER_FUNCTION}}

function time(t, raw) {
	function h(b,j) {
		if (b === 0) { return '00'+j; }
		else if (b < 10) { return '0'+b+j; }
		else { return b.toString()+j; }
	}
	var SubtractTimes, D, H, M, S;

	if (isNaN((new Date(t)).getTime())) return '';
	SubtractTimes = (((new Date()).getTime() - (new Date(t)).getTime()) / 1000);

	D = Math.floor(SubtractTimes/86400);
	SubtractTimes -= D*86400;
	H = Math.floor(SubtractTimes/3600);
	SubtractTimes -= H*3600;
	M = Math.floor(SubtractTimes/60);
	SubtractTimes -= M*60;
	S = Math.floor(SubtractTimes);

	if (raw)
		return {d:D, h:H, m:M, s:S};

	var Time = h(H, 'h:')+''+h(M, 'm:')+''+h(S, 's');
	return (D === 0) ? Time : h(D, 'd:')+Time;
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
			p.async=true; p.src='{{PARSE_COM_SRC}}';
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