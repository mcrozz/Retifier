{{LICENSE_HEADER}}
var TimersetToUpdate = [];
var refresh = false,
		t, g;
texts = { d:new Date() };

function offSet(t,w) {
	function snum() {
		var g = {
			// [t]itle or [g]ame: { [W]idth, [F]ontSize }
			'Grid' : {t:{w: .4535, f: 79}, g:{w: .4535, f: 79}},
			'Full' : {t:{w: .4710, f: 85}, g:{w: .4710, f: 85}},
			'Light': {t:{w: .7100, f: 87}, g:{w: .2840, f: 87}}
		};
		// returns: { w:int, f:int }
		return g[local.Config.Format];
	}

	// [t]ext, [w]hat(game or title)
	var f = snum()[w];
	var d = $('#textWidth').css('fontSize', f.f+'%').html(t);
	return (d.width()>(window.WIDTH*f.w));
}

function stream(ob) {
	var name = ob.Name.toLowerCase();
	var divs = {
		  origin : $('#'+name),
		   title : $('#'+name+'>.inf>.title>a'),
		    name : $('#'+name+'>.inf>.streamer>a'),
		 viewers : $('#'+name+'>.inf>.viewers>a'),
		    game : $('#'+name+'>.inf>.game>a'),
		      ST : $('#'+name+'>.tum>.ST'),
		     GT1 : $('#'+name+'>.tum>.GT1'),
		     GT2 : $('#'+name+'>.tum>.GT2'),
		duration : $('#'+name+'>.inf>.adds>.duration>a')
	};
	var _this = this;
	$.each(divs, function(i,v) {
		_this[i] = {
			set: function(n) {
				// set value
				v.html(n);
			},
			get: function() {
				// return innerHTML
				return v.html();
			},
			el: function() {
				// return element
				return v;
			}
		};
	});
}

function str_cell(a, to) {
	/*
	* a : {
	*  str : streamer name for urls
	*  dsn : display streamer name
	*  ttl : title
	*  gme : game
	*  viw : viewers count
	*  pos : id
	*  isG : is game tumb available
	*  txw : is title big
	*  gmw : is game big
	*  tme : stream duration
	* },
	* to : selector, where to insert
	* if "to" is undefined, then return Node object
	*/

	var np = (a.gme === 'Not playing');
	function preview() {
		var tum = c('div', {className: 'tum'});

		// Loading icon
		var load = c('div', {className: 'loading'});
		load.appendChild(c('div'));
		load.appendChild(c('div'));
		load.appendChild(c('div'));
		load.appendChild(c('div'));
		tum.appendChild(load);

		// 'Launch Stream' on hover
		var launch = c('a', {
			href: 'http://www.twitch.tv/'+a.str,
			target: '_blank',
			innerHTML: 'Launch Stream'});
		tum.appendChild(launch);

		// Stream preview
		var ST = c('img', {className: 'ST'});
		ST.style.background = 'url(http://static-cdn.jtvnw.net/previews-ttv/live_user_'+a.str+'-320x200.jpg)';
		ST.style.backgroundSize = 'contain';
		ST.style.cursor = 'pointer';
		tum.appendChild(ST);

		// Game poster
		var GT1 = c('img', {className: 'GT1'});
		GT1.style.background = 'url("http://static-cdn.jtvnw.net/ttv-boxart/'+a.gme+'-272x380.jpg")'
		GT1.style.backgroundSize = 'contain';
		GT1.style.cursor = 'pointer';
		if (!np) {
			GT1.onclick = function() {
				window.open('http://www.twitch.tv/directory/game/'+a.gme);
			};
		}
		tum.appendChild(GT1);

		// In case game poster is not available
		var GT2 = c('img', {className: 'GT2'});
		GT2.style.background = 'url("./img/playing.png")';
		GT2.style.backgroundSize = 'contain';
		GT2.style.cursor = 'pointer';
		tum.appendChild(GT2);

		// Zoomed stream preview
		var zoom = c('div', {className: 'zoom'});
		zoom.onclick = function(e) {
			var n = e.target.parentElement.parentElement.id.toLowerCase();
			$('#zoomIMG').css({
				background: 'url(http://static-cdn.jtvnw.net/previews-ttv/live_user_'+n+'-640x400.jpg) no-repeat',
				backgroundSize: 'contain'
			});
			Popup.init('#zoomIMG');
		};
		tum.appendChild(zoom);

		return tum;
	}
	function information() {
		var inf = c('div', {className: 'inf'});

		// Title of stream
		var title = c('div', {className: 'title'});
		var aTitle = c('a', {innerHTML: a.ttl});
		aTitle.setAttribute('show', a.txw);
		title.appendChild(aTitle);
		inf.appendChild(title);

		// Streamer name
		var streamer = c('div', {className: 'streamer'});
		var aStream = c('a', {
			href: 'http://www.twitch.tv/'+a.str+'/profile',
			target: '_blank',
			innerHTML: a.dsn});
		streamer.appendChild(aStream);
		inf.appendChild(streamer);

		// Viewers count
		var viewers = c('div', {className: 'viewers'});
		var aView = c('a', {innerHTML: a.viw+' viewers'});
		viewers.appendChild(aView);
		inf.appendChild(viewers);

		// Game name
		var game = c('div', {className: 'game'});
		var aGame = c('a', {
			href: !np?'http://www.twitch.tv/directory/game/'+a.gme:null,
			target: !np?'_blank':null,
			innerHTML: a.gme});
		aGame.setAttribute('show', a.gmw);
		game.appendChild(aGame);
		inf.appendChild(game);

		// Additionals (duration and visit channel)
		var adds = c('div', {className: 'adds'});
		var page = c('div', {className: 'page'});
		var aPag = c('a', {
			href: 'http://www.twitch.tv/'+a.str+'/profile',
			target: '_blank'});
		var abPag = c('button', {
			type: 'button',
			className: 'button',
			innerHTML: 'Channel page'});
		aPag.appendChild(abPag);
		page.appendChild(aPag);
		adds.appendChild(page);
		var dur = c('div', {className: 'duration'});
		dur.appendChild(c('a', {innerHTML: a.tme}));
		adds.appendChild(dur);
		inf.appendChild(adds);

		return inf;
	}

	var holder = c('div', {
		className: 'content',
		id: a.pos});
	holder.appendChild(preview());
	holder.appendChild(information());
	holder.style.animation = "zoomIn 0.15s";
	if (typeof to === "undefined")
		return holder;
	$(to).append(holder);
}

var online = [];

window.insert = function(obj) {
	// invalid input
	if (!obj) return;

	var   StreamTitle = obj.Stream.Title,
		 StreamerName = obj.Name.toLowerCase(),
		ShortStrmName = obj.Name,
		   StreamGame = obj.Stream.Game,
		  isGameThumb = local.Game.list.indexOf(StreamGame)!=-1,
		StreamVievers = obj.Stream.Viewers,
		   TitleWidth = false,
		    GameWidth = false,
		            b = '#'+StreamerName+'>',
		dc, TitleWidth, GameWidth;

	var str = new stream(obj);

	if (obj.Stream) {
		if (typeof texts[StreamTitle] === 'undefined')
			texts[StreamTitle] = offSet(StreamTitle, 't');
		TitleWidth = texts[StreamTitle]

		if (typeof texts[StreamGame] === 'undefined')
			texts[StreamGame] = offSet(StreamGame, 'g');
		GameWidth = texts[StreamGame]
	}

	if ($('#content>.online').html() === '<div class="NOO"><a>No one online right now :(</a></div>')
		$('#content>.online').html('');

	// If not in array and is online
	if ($.inArray(obj.Name.toLowerCase(), online) === -1) {
		if (!obj.Stream)
			return;

		str_cell({
			str: StreamerName,
			dsn: ShortStrmName,
			ttl: StreamTitle,
			gme: StreamGame,
			viw: StreamVievers,
			pos: StreamerName,
			isG: isGameThumb,
			txw: TitleWidth,
			gmw: GameWidth,
			tme: time(obj.Stream.Time)
		}, '#content>.online');
		online.push(StreamerName);
	} else {
		// This name is in list
		if (!obj.Stream) {
			// Streamer went offline so delete
			str.origin.el().remove();
			online = online.filter(function(e) { return e!=obj.Name.toLowerCase(); });

			if (local.Status.online == 0 && local.Status.update == 0)
				$('#content>.online').html('<div class="NOO"><a>No one online right now :(</a></div>');
			return;
		}

		str.title.set(StreamTitle);

		str.title.el().attr('show', TitleWidth);
		str.game.el().attr('show', GameWidth);

		str.game.set(StreamGame);
		str.viewers.set(StreamVievers+" viewers");

		str.ST.el().css({
			'background': 'url(http://static-cdn.jtvnw.net/previews-ttv/live_user_'+StreamerName+'-320x200.jpg)',
			'background-size': 'contain',
			'cursor': 'pointer'
		});

		var jl = str.GT1.el().css('background').split('/');
		if (isGameThumb)
			if (jl[jl.length-1] != encodeURI(StreamGame)+'-272x380.jpg')
				str.GT1.el().css({
					'background':'url("http://static-cdn.jtvnw.net/ttv-boxart/'+encodeURI(StreamGame)+'-272x380.jpg")',
					'background-size':'contain',
					'cursor':'pointer'
				});
			else
				str.GT1.el().css({
					'background-size':'contain',
					'cursor':'pointer'
				});
		str.GT2.el().css({
			'background':'url("./img/playing.png")',
			'background-size': 'contain',
			'cursor':'pointer'
		});
		if (StreamGame == 'Not playing') {
			str.GT1.el().hide();
			str.GT2.el().hide();
		}
	}
}

window.updateStatus = function() {
	/*
			Status.update
		0 :: Not updating, finished
		1 :: Timer ended, start update
		2 :: Update list of followed channels
		3 :: List of followed channels updated
		4 :: Checking online channel
		5 :: Error
		6 :: Name doesn't set up!
		7 :: First start
	*/
	if (localStorage.FirstLaunch === 'true')
		return false;
	var j = _$('FollowedChannelsOnline'),
			Upd = local.Status.update,
			Onlv = local.Status.online;
	if (!Onlv)
		Onlv = 0;
	switch (Upd) {
		case 0: j.innerHTML = 'Now online: '+Onlv+'/'+localStorage.Following; break;
		case 1: j.innerHTML = 'Behold! Update!'; break;
		case 2: j.innerHTML = 'Updating list of followed channels...'; break;
		case 3: j.innerHTML = 'List of followed channels updated.'; break;
		case 4: j.innerHTML = 'Checking, online '+Onlv+'/'+localStorage.Following; break;
		case 5: j.innerHTML = 'App have a problem with update'; break;
		case 6: j.innerHTML = "Name doesn't set up yet!"; break;
	}
};

// Duration of stream
setInterval(function() {
	$.each(online, function(i,v) {
		if ($('#'+v).length === 0)
			return online = online.filter(function(e) { return e!=v; });
		try {
			var s = local.following.get(v);
			if (!s) return;

			var j = new stream(s);

			var title = j.title.get();
			if (typeof texts[title] === 'undefined')
				texts[title] = offSet(title, 't');
			j.title.el().attr('show', texts[title]);

			var game = j.game.get();
			if (typeof texts[game] === 'undefined')
				texts[game] = offSet(game, 'g');
			j.game.el().attr('show', texts[game]);

			j.duration.set(time(s.Stream.Time));
		} catch(e) { err(e); }
	});
}, 500);