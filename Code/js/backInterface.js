// @TODO: make constructor for Hosting, Following, Online lists

window.view = new function() {
	var popup = null; // should be NodeDOM object
	var bindPopup = null;
	var getView = null;

	this.browserGetView = function(callback) {
		if (typeof callback !== 'function')
			return browser.error(new Error('Invalid input @ browserGetView'));
		
		getView = callback;
		delete this.browserGetView;
	};

	var bindPopup = function() {
		if (!popup) {
			if (getView === null)
				return browser.error(new Error('Cannot obtain DOM objects of views'));
			
			var windows = getView();
			for (var view in windows) {
				if (windows[view].location.pathname === location.pathname)
					return;

				popup = windows[view];
				return true; break;
			}
			delete windows; // lol'd
		} else
			return true;

		return false;
	};

	function c(type, data) {
		var _t = document.createElement(type);
		if (!data)
			return _t;

		for (var i in data)
			_t[i] = data[i];
		return _t;
	};

	// Updates popup window if opened
	function updatePopup(dest, node) {
		if (!bindPopup()) return;

		// @PROD check if it's fast enough!
		var time = performance.now();
		popup.$(dest).html(node);
		browser.debug('Updated ['+dest+'] in '+(performance.now()-time)+'ms');
	};

	var shadowHtmlConstructor = function() {
		if (!(this instanceof arguments.callee))
			throw new Error('Cannot be used as function!');
		
		this.node = document.createElement('div');
		this.find = function(sel) {
			return this.node.querySelector(sel);
		};
		this.findAll = function(sel) {
			return this.node.querySelectorAll(sel);
		};
		this.insert = function(nd) {
			if (typeof nd !== 'object')
				return browser.error(new Error('invalid argument!'));
			if (typeof nd.nodeType === 'undefined')
				return browser.error(new Error('not a Node!'));
			return this.node.appendChild(nd);
		};
		this.remove = function(id) {
			return this.find('#'+id).remove();
		};
		return this;
	};

	this.online = function() {
		var shadowHtml = new shadowHtmlConstructor();
		var update = function() {
			updatePopup('#content>.online', shadowHtml.node);
		};

		var typeUpdate = {
			'-1': function(d) {
				// Deleting streamer
				shadowHtml.remove(d.id);
			},
			 '0': function(d) {
			 	// Updating streamer info
			 	var strm = new streamerNode(d.id);
			 	if (d.data.title !== strm.title.get()) {
			 		// New notification, title has changed
			 		strm.title.set(d.data.title);
			 	}

			 	if (d.data.game !== strm.game.get()) {
			 		// New notification, game title has changed
			 		strm.game.set(d.data.game);
			 	}

			 	if (d.data.viewers !== strm.viewers.get()) {
			 		// New notification, viewers has changed
			 		strm.viewers.set(d.data.viewers);
			 	}

			 	delete strm;
			 },
			 '1': function(d) {
			 	// Inserting new streamer
			 	var strm = new streamerNode(d.id, d);
			 	browser.debug(strm);
			 	shadowHtml.insert(strm);
			 }
		};
		
		// @input: d as object {
		//   Streamer object (from background.js)
		//   +type : { -1,0,1 }
		// }
		this.updateFollowers = function(d) {
			if (typeof d === 'undefined')
				return browesr.error(new Error('Invalid argument'));

			if (typeof typeUpdate[d.type] == 'function') {
				typeUpdate[d.type](d);
				return update();
			}	else
				return browser.error(new Error('Invalid type'));
		};
		
		function streamerNode(id, d) {
			if (typeof d === 'undefined') {
				return new (function(id) {
					var id = id;
					var cell = shadowHtml.find('#'+id) || null;

					if (typeof cell === 'undefined' || !cell)
						return browser.error(new Error('Could not find cell with id: '+id));
					if (typeof cell.nodeType === 'undefined')
						return browser.error(new Error('Invalid type'));

					var findNode = function(sel) {
						return cell.querySelector(sel);
					};

					this.title = {
						set: function(inner) {
							return findNode('.title>a').innerHTML = inner;
						},
						get: function() {
							return findNode('.title>a');
						}
					};

					this.game = {
						set: function(inner) {
							return findNode('.game>a').innerHTML = inner;
						},
						get: function() {
							return findNode('.game>a');
						}
					};

					this.viewers = {
						set: function(inner) {
							return findNode('.views>a').innerHTML = inner;
						},
						get: function() {
							return findNode('.views>a');
						}
					};

					this.preview = {
						set: function(inner) {
							return findNode('.previews>.stream').innerHTML = inner;
						},
						get: function() {
							return findNode('.previews>.stream');
						}
					};

					this.gamePreview = {
						set: function(inner) {
							return findNode('.previews>.game').innerHTML = inner;
						},
						get: function() {
							return findNode('.previews>.game');
						}
					};

					return this;
				})(id);
			}

			var cell = new c('div', {id:d.id});
			
			var top = new c('div', {className:'top'});
			var previews = new c('div', {className:'previews'});
			
			var sStream = new c('span', {
				className: 'stream ripple',
				color: 'rgb(29, 16, 108)'});
			var sGame = new c('span', {
				className: 'game ripple',
				color: 'rgb(29, 16, 108)'});
			previews.appendChild(sStream);
			previews.appendChild(sGame);

			top.appendChild(previews);
			cell.appendChild(top);
			
			var bar = new c('div', {className:'bar'});
			var zoom = new c('div', {className:'zoom'});
			var zImg = new c('img');
			zoom.appendChild(zImg);
			var time = new c('div', {className:'time'});
			var tTime = new c('a', {time: d.started});
			time.appendChild(tTime);

			bar.appendChild(zoom);
			bar.appendChild(time);

			previews.appendChild(bar);
			
			var data = new c('div', {className:'data'});
			var title = new c('div', {className:'title'});
			var tA = new c('a', {
				innerHTML: d.data.title
			});
			title.appendChild(tA);
			data.appendChild(title);
			var streamer = new c('div', {className:'streamer'});
			var sA = new c('a', {
				innerHTML: d.name
			});
			streamer.appendChild(sA);
			data.appendChild(streamer);
			var views = new c('div', {className:'views'});
			var vA = new c('a', {
				innerHTML: d.data.viewers
			});
			views.appendChild(vA);
			data.appendChild(views);
			var game = new c('div', {className:'game'});
			var vG = new c('a', {
				innerHTML: d.data.game
			});
			game.appendChild(vG);
			data.appendChild(game);

			cell.appendChild(data);

			return cell;
		};

		return this;
	}();

	this.following = function() {
		var shadowHtml = new shadowHtmlConstructor();
		var update = function() {
			updatePopup('#content>.following', shadowHtml.node);
		};

		this.updateInf = function(id, d) {};
		this.unfollow = function(id) {};

		function cell(id, d) {
			if (typeof d === 'undefined') {
				// Return constructor for quick look up and modification

				return new (function(id){
					var id = id;
					var cell = shadowHtml.find('#'+id) || null;

					if (typeof cell === 'undefined' || !cell)
						return browser.error(new Error('Could not find cell with id: '+id));
					if (typeof cell.nodeType === 'undefined')
						return browser.error(new Error('Invalid type'));

					var findNode = function(sel) {
						return cell.querySelector(sel);
					};

					// @TODO
				})(id);
			}

			// Otherwise create new element
			/*
				.holder
					span.avatar
					div.info
						a.name
						a.since
						a.followers
					div.buttons
						span.detailed
						span.unfollow
			*/

			var holder = c('div');

			var avatar = c('span');
			holder.appendChild(avatar);

			var info = c('div');

			var aName = c('a', {className: 'name'});
			info.appendChild(aName);
			var aSince = c('a', {className: 'since'});
			info.appendChild(aSince);
			var aFollowers = c('a', {className: 'followers'});
			info.appendChild(aFollowers);

			holder.appendChild(info);

			var buttons = c('div');

			var detailed = c('span', {className: 'detailed'});
			buttons.appendChild(detailed);
			var unfollow = c('span', {className: 'unfollow'});
			buttons.appendChild(unfollow);

			holder.appendChild(buttons);

			return holder;
		};
	}();

	this.hosting = function() {
		var shadowHtml = new shadowHtmlConstructor();
		var update = function() {
			updatePopup('#content>.hosting', shadowHtml.node);
		};

		this.insert = function(id, d) {};
		this.remove = function(id) {};

		function cell(id, d) {};
	}();

	return this;
}();