// Streamer object
var streamer = function(id, name, follows) {
	this.id = id;
	this.name = name;
	this.data = {
		title: null,
		game: null,
		started: -1,
		viewers: -1
	};
	this.online = false;
	this.lastUpdate = -1;
	this.followingFrom = follows;
	this.update = function() {
		this.lastUpdate = 0;
	};
	this.previews = {
		// Cached previews for faster start up
		//of popup window
		big: null,
		small: null,
		lastUpdate: -1
	};

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
	}
};

var checker = {
	online: [/* new streamer() */],
	following: new storage('following'),
	intervals: {
		followers: -1,
		status: -1
	},
	lastUpdate: -1
};

checker.following.customSave = function() {
	var rtn = [];
	for (var s in this.data)
		rtn.push(this.data[s].id);
	return rtn;
};

checker.getFollowingList = function() {
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
			this.online = [];
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

	this.intervals.followers = setTimeout(arguments.callee.bind(this), 300000);
};

checker.getStatus = function() {
	function checkForChanges(d) {
		/* Output scheme
		 * stream: {
		 *   <If offline then null>
		 *   channel: {
		 *     status: String
		 *     display_name: String
		 *     name: String
		 *   created_at: String
		 *   game: String
		 *   viewers: int
		 *   is_playlist: boolean
		 *   delay: int
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
			this.online = this.online.filter(function(i,v) {
				return v != this.checking;
			});

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
			this.online.push(str.id);
			
			this.following.data[i].data = {
				title: str.title,
				game: str.game,
				started: str.started,
				viewers: str.viewers
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

	this.intervals.status = setTimeout(arguments.callee.bind(this), 2000);
};

checker.start = function() {
	if (this.intervals.followers !== -1 ||
		this.intervals.status !== -1) return false;

	this.intervals.followers = setTimeout(this.getFollowingList.bind(this), 0);
	this.intervals.status = setTimeout(this.getStatus.bind(this), 10);

	return true;
};

checker.restart = function() {
	if (this.intervals.followers == -1 ||
		this.intervals.status == -1) return false;

	clearTimeout(this.intervals.followers);
	this.intervals.followers = -1;
	clearTimeout(this.intervals.status);
	this.intervals.status = -1;

	return this.start.bind(this);
};

setTimeout(function() {
	var flw = null;
	try{ flw = JSON.parse(localStorage.following); }
	catch(e) { browser.error(e); }
	if (flw === null) return false;

	checker.following = flw;

	checker.start();
}, 0);