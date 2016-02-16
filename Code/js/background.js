browser.badge.set('...');

// Streamer object
var streamer = function(id, name, follows) {
	if (!(this instanceof arguments.callee))
		throw new Error('Cannot be used as function!');

	this.id = id;
	this.name = name;
	this.data = {
		title: null,
		game: null,
		started: -1,
		viewers: -1,
		previews: {
			// Cached previews for faster start up
			stream: null,
			game: null,
			logo: null,
			profile: null
		}
	};
	this.online = false;
	this.lastUpdate = -1;
	this.followingFrom = follows;
	this.update = function() {
		this.lastUpdate = 0;
	};

	return this;
};

// Image holder object
var imageHolder = function(url) {
	var url = url;
	var base64 = null;
	var lastUpdate = -1;

	this.getImage = function() {
		return base64;
	};
	this.update = function() {
		'use strict'
		if (date() - lastUpdate < 600000)
			return false;

		var _t = new Image();
		_t.onload = function(i) {
			'use strict'
			var _c = document.createElement('canvas');
			var _x = _c.getContext('2d');

			_c.width = i.width;
			_c.height = i.height;

			_x.drawImage(i, 0, 0);
			
			base64 = _c.toDateURL();
			lastUpdate = date();
			_c = null;
		}.bind(this);
		_t.src = url;
	};

	setTimeout(function() {
		this.update();
	}.bind(this), (1000*Math.round(Math.random()*100))+1000);

	return this;
};

var twitch = {
	getFollowing: function(user) {
		if (!user) throw Error('Invalid input');
		return $.getJSON('https://api.twitch.tv/kraken/users/'+user+'/follows/channels?limit=100&offset=0');
	},
	getStatus: function(name) {
		if (!name) throw Error('Invalid input');
		return $.getJSON('https://api.twitch.tv/kraken/streams/'+name);
	},
	getOnline: function(token) {
		if (!token) throw Error('Invalid input');
		return $.getJSON('https://api.twitch.tv/kraken/streams/followed?limit=100&offset=0&oauth_token='+token);
	},
	gamePreview: function(game) {
		return 'http://static-cdn.jtvnw.net/ttv-boxart/'+encodeURI(game)+'-272x380.jpg';
	}
};

var checker = {
	online: {
		data: [/* new streamer() */],
		add: function(str) {
			if (this.data.indexOf(str) === -1) {
				browser.send.async('wentOnline', str);
				return this.data.push(str);
			}
			return false;
		},
		del: function(id) {
			if (!id) return false;

			browser.send.async('wentOffline', (isNaN(id)?id:this.data[id]));
			this.data = this.data.filter(function(i,v) {
				return (isNaN(id))?v!=id:i!=id;
			});
			return true;
		},
		get: function(id) {
			return id?this.data[id]:this.data;
		}
	},
	following: new storage('following', []),
	interval: function() {
		var run = {
			following: {
				lastRun: 0,
				interval: 300000,
				call: checker.getFollowing,
				bind: checker
			},
			status: {
				lastRun: 0,
				interval: 2000,
				call: checker.getStatus,
				bind: checker
			},
			cache: {
				lastRun: 0,
				interval: 10000,
				call: checker.updatePreviews,
				bind: checker
			}
		};
		var intervalVal = -1;

		this.start = function() {
			setTimeout(call.bind(this), 0);
			return true;
		};
		this.stop = function() {
			clearTimeout(intervalVal);
			return true;
		};
		this.restart = function() {
			this.stop();
			this.start();
			return true;
		};

		var call = function() {
			'use strict'
			var t = date();
			for (var i in run) {
				if (t - run[i].lastRun >= run[i].interval) {
					run[i].lastRun = t;
					setTimeout(run[i].call.bind(run[i].bind), 0);
				}
			}

			intervalVal = setTimeout(arguments.callee.bind(this), 2000);
		};

		return this;
	}(),
	lastUpdate: -1
};

checker.following.customSave = function() {
	var rtn = [];
	for (var s in this.data)
		rtn.push(this.data[s].id);
	return rtn;
};

checker.updatePreviews = function() {
	if (!browser.isOnline) return false;

	if (!settings.user.isSet()) return false;

	var par = ['stream', 'game', 'logo', 'profile'];

	for (var s in checker.online.get()) {
		if (!checker.online.get(s).online)
			continue;

		// Update image cache every 10 min
		for (var p in par)
			checker.online.get(s).data.previews[par[p]].update();
	}
};

checker.getFollowingList = function() {
	if (!browser.isOnline) return false;

	if (!settings.user.isSet()) return false;

	twitch.getFollowing(settings.user.id)
	.fail(function(e) {
		browser.error({
			message:'Cannot obtain following list',
			stack: e});
	})
	.done(function(d) {
		if (this.following.length() === 0) {
			// Fill up the following array
			for (var s in d.follows) {
				this.following.push(
					new streamer(d.follows[s].channel.name,
						d.follows[s].channel.display_name,
						d.follows[s].created_at)
				);
			}
			this.online.data = [];
		} else {
			// Check if user stoped following someone
			var del = [];
			var add = [];
			for (var i in this.following.get()) {
				// @TODO
			}
			for (var k in d.follows) {
				if (!this.following.findBy('id', d.follows[k].channel.name))
					add.push(d.follows[k].channel.name);
			}
			if (del.length !== 0) {
				var _t = [];
				for (var l in this.following.get()) {
					if (del.indexOf(this.following.get(l).id) == -1)
						_t.push(this.following.get(l));
				}
				// Swap data and save it
				this.following.data = _t;
				setTimeout(this.following.save.bind(this), 0);
			}
		}
	}.bind(this));
};

checker.getStatus = function() {
	function checkForChanges(d) {
		'use strict'
		/* Output scheme
		 * stream: {
		 *   <If offline then null>
		 *   channel: {
		 *     status: String
		 *     display_name: String
		 *     name: String
		 *     profile_banner: String
		 *     logo: String
		 *   created_at: String
		 *   game: String
		 *   viewers: int
		 *   is_playlist: boolean
		 *   delay: int
		 *   preview
		 *     large: String
		 * }
		*/

		this.lastUpdate = date();

		var _t = this.following.findBy('id', str.id);
		if (_t === null) return browser.error('Cannot find such streamer: '+str.name);
		var i = _t.i;
		_t = _t.element;
		this.following.set(i, 'lastUpdate', date());

		if (d.stream === null) {
			// @FUTURE: check if Twitch's API failed
			//or streamer actually went offline
			if (_t.online)
				_t.online = false;
			_t.data = {};
			this.following.set(i, _t);

			// Remove streamer from online list
			this.online.del(this.checking);

			return;
		}

		var str = {
			id: d.stream.channel.name,
			name: d.stream.channel.display_name,
			title: d.stream.channel.status,
			game: d.stream.game,
			viewers: d.stream.viewers,
			started: d.stream.created_at
		};

		if (!_t.online) {
			// Streamer went online
			this.online.add(str.id);
			
			this.following.data[i].data = {
				title: str.title,
				game: str.game,
				started: str.started,
				viewers: str.viewers,
				previews: {
					stream: new imageHolder(d.stream.preview.large),
					game: new imageHolder(Twitch.gamePreview(str.game)),
					logo: new imageHolder(d.stream.channel.logo),
					profile: new imageHolder(d.stream.channel.profile_banner),
					lastUpdate: 0
				}
			};
			this.following.data[i].online = true;
			// @? notification here

			return;
		}

		// Update information
		var par = ['title', 'game', 'started', 'viewers'];
		for (var o in par) {
			if (_t.data[par[o]] === null)
				_t.data[par[o]] = str[par[o]];
			else if (typeof str[par[o]] != 'undefined' && str[par[o]] !== null) {
				if (str[par[o]] != _t.data[par[o]])
					_t.data[par[o]] = str[par[o]];
			}
		}

		this.following.data[i] = _t;
		// @? inform popup window
	}

	if (!browser.isOnline) return false;

	if (!settings.user.isSet()) return false;

	if (settings.user.token !== null && date() - this.lastUpdate >= settings.checkInterval) {
		twitch.getOnline(settings.user.token)
		.fail(function(e) {
			browser.error({message: 'Cannot obtain online list with token', stack: e});
		})
		.done(checkForChanges.bind(this));
	} else // If user sign up just with Twitch user name
		for (var i in this.following.get()) {
			var _t = this.following.get(i);
			
			if (date() - _t.lastUpdate >= settings.checkInterval) {
				this.following.set(i, 'lastUpdate', date()+20000); // settings.checkInterval +20s timeout
				
				twitch.getStatus(_t.id)
				.fail(function(e) {
					browser.error({message: 'Cannot obtain streamer', stack: e});
					this.following.set(this.checking, 'lastUpdate', date());
				}.bind(this, {checking: i}))
				.done(checkForChanges.bind(this, {checking: _t.id}));
			}

			// @? Move to another structure
			if (date() - _t.previews.lastUpdate >= 330000) {
				// Update previews every 5.5 mins
				// @TODO
			}
		}
};

setTimeout(function() {
	checker.interval.start();
}, 0);