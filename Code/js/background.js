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

	return this;
};

var checker = {
	online: [/* new streamer() */],
	following: new storage('following'),
	intervals: {
		followers: -1,
		status: -1
	}
};

checker.getFollowingList: function() {
	if (!settings.user.isSet()) return false;

	$.getJSON('https://api.twitch.tv/kraken/users/'+settings.user.id+'/follows/channels?limit=100&offset=0')
	.fail(function(e) {
		browser.error({
			message:"Cannot obtain following list",
			stack: e});
	})
	.done(function(d) {
		if (this.following.get().length == 0) {
			// Fill up the following array
			for (var s in d.follows) {
				this.following.data.push(
					new streamer(d.follows[s].channel.name,
						d.follows[s].channel.display_name,
						d.follows[s].created_at)
				);
			}
			this.online = [];
		} else {
			// Check if user stoped following someone
			var del = [];
			for (var s in d.follows) {
				if (!this.following.get().findBy('id', d.follows[s].channel.name))
					del.push(d.follows[s].channel.name);
			}
			if (del.length !== 0) {
				var _t = [];
				for (var i in this.following.get()) {
					if (del.indexOf(this.following.get(i).id) == -1)
						_t.push(this.following[i]);
				}
				this.following = _t;
			}
		}
	}.bind(this));

	this.intervals.followers = setTimeout(arguments.callee.bind(this), 300000);
};

checker.getStatus: function(str) {

	this.intervals.status = setTimeout(arguments.callee.bind(this), 60000*settings.checkInterval)
};

checker.start: function() {
	if (this.intervals.followers !== -1
		|| this.intervals.status !== -1) return false;

	this.intervals.followers = setTimeout(this.getFollowingList.bind(this), 0);
	this.intervals.status = setTimeout(this.getStatus.bind(this), 10);

	return true;
};

checker.restart: function() {
	if (this.intervals.followers == -1
		|| this.intervals.status == -1) return false;

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