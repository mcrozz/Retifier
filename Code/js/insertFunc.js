{{LICENSE_HEADER}}
var FirstLoadInsertFunc = 1;
TimersetToUpdate = [];
var refresh = false,
		t, g;
texts = { d:new Date() };

function snum(){
	switch (local.Config.Format) {
		// [T]itle = { [W]idth, [F]ontSize }
		case 'Grid': t = {w: 46.2, f: 79}; g = {w: 46.2, f: 79}; break;
		case 'Full': t = {w: 48.2, f: 85}; g = {w: 48.2, f: 85}; break;
		case 'Mini': t = {w: 73.2, f: 87}; g = {w: 29.201, f: 87}; break;
	}
};
snum();

function InsertOnlineList() {
	if (localStorage.FirstLaunch === 'true')
		return false;
	/*
	* s - font size
	* n - text
	* w - width
	*/
	function offSet(s,n,w,wp) {
		var d = $('#textWidth').css({fontSize: s+'%', width: w+'%'}).html(n);
		return (d.width()>(window.WIDTH*w));
	}
	/*
	* a : {
	*  str : streamer for urls
	*  dsn : display streamer name
	*  ttl : title
	*  gme : game
	*  viw : viewers count
	*  pos : id
	* }
	*/
	function insert(a) {
		var t = '', n = (a.gme !== 'Not Playing');
		t += '<div class="content" id="'+a.pos+'">'
			+'<div class="tum"><div class="loading" style="-webkit-transform:scale(0.35)"><div></div><div></div><div></div><div></div></div>'
			+'<a href="http://www.twitch.tv/'+a.str
			+'" target="_blank">Launch Stream</a><img class="ST" />'
			+'<img class="GT1" /><img class="GT2" />'
			+'<div class="zoom" id="zoom_'+a.pos+'"></div></div>'
			+'<div class="inf"><div class="title"><a>'+a.ttl+'</a></div>'
			+'<div class="streamer"><a '
			+ (n?'target="_blank" href="http://www.twitch.tv/'+a.str+'/profile"':'')
			+'>'+a.dsn+'</a></div>'
			+'<div class="viewers"><a>'+a.viw+' viewers</a></div>'
			+'<div class="game"><a '
			+(n?'href="http://www.twitch.tv/directory/game/'+a.gme+'" target="_blank"':'')
			+'>'+a.gme+'</a></div><div class="adds"><div class="page">'
			+'<a href="http://www.twitch.tv/'+a.str+'/profile" target="_blank">'
			+'<button type="button" class="button">Channel page</button></a></div>'
			+'<div class="duration"><a></a></div></div>';
		_$('insertContentHere').innerHTML += t;
	}

	$('#insertContentHere').css('overflow', (local.Status.online <= 2)?'hidden':'auto');

	if (TimersetToUpdate.length >= 1 && $('#'+TimersetToUpdate[0]).length == 0)
		TimersetToUpdate = [];

	$.each(local.FollowingList, function(i,v) {
		var StreamTitle   = v.Stream.Title,
				StreamerName  = v.Name,
				ShortStrmName = v.d_name,
				StreamGame    = v.Stream.Game,
				eStreamGame   = encodeURI(StreamGame),
				isGameThumb   = local.Games[eStreamGame],
				StreamVievers = v.Stream.Viewers,
				TitleWidth    = false,
				GameWidth     = false,
				b             = '#'+i+'>',
				dc;

		if (v.Stream) {
			if (typeof texts[StreamTitle] === 'undefined') {
				texts[StreamTitle] = offSet(t.f, StreamTitle, t.w);
			} else { TitleWidth = texts[StreamTitle] }

			if (typeof texts[StreamGame] === 'undefined') {
				texts[StreamGame] = offSet(g.f, StreamGame, g.w);
			} else { GameWidth = texts[StreamGame] }
		}

		if (TimersetToUpdate.indexOf(i) === -1) {
		    if (v.Stream) {
		        if ($('#insertContentHere').html() === '<div class="NOO"><a>No one online right now :(</a></div>')
		        	$('#insertContentHere').html('');

				insert({
					str: StreamerName,
					dsn: ShortStrmName,
					ttl: StreamTitle,
					gme: StreamGame,
					viw: StreamVievers,
					pos: i
				});

				TimersetToUpdate.push(i);

				$(b+'.tum>.ST').css({
					'background':'url(http://static-cdn.jtvnw.net/previews-ttv/live_user_'+StreamerName+'-320x200.jpg)',
					'background-size':'contain',
					'cursor':'pointer'
				});
				if (isGameThumb)
					$(b+'.tum>.GT1').css({
						'background':'url("http://static-cdn.jtvnw.net/ttv-boxart/'+eStreamGame+'-272x380.jpg")',
						'background-size': 'contain',
						'cursor':'pointer'
					});
				$(b+'.tum>.GT2').css({
					'background':'url("./img/playing.png")',
					'background-size': 'contain',
					'cursor':'pointer'
				});
			}
		} if (TimersetToUpdate.indexOf(i) !== -1) {
		    if (!v.Stream && _$(i) !== null) {
		    	_$(i).remove();
		    	TimersetToUpdate.splice(TimersetToUpdate.indexOf(i), 1);
		    } else {
					$(b+'.inf>.title>a').html(StreamTitle);

					$(b+'.inf>.title>a').attr('show', TitleWidth);
					$(b+'.inf>.game>a').attr('show', GameWidth);

					$(b+'.inf>.game>a').html(StreamGame);
					$(b+'.inf>.viewers>a').html(StreamVievers+" viewers");

					if (local.Config.Duration_of_stream && $(b+'.inf>.adds>.duration>a') != null)
						$(b+'.inf>.adds>.duration>a').html(time(v.Stream.Time))
	        else if (!local.Config.Duration_of_stream && $(b+'.inf>.adds>.duration>a').html() !== '')
						$(b+'.inf>.adds>.duration>a').html('');

					$(b+'.tum>.ST').css({
						'background': 'url(http://static-cdn.jtvnw.net/previews-ttv/live_user_'+StreamerName+'-320x200.jpg)',
						'background-size': 'contain',
						'cursor': 'pointer'
					});

					var jl = $(b+'.tum>.GT1').css('background').split('/');
					if (isGameThumb)
						if (jl[jl.length-1] != encodeURI(StreamGame)+'-272x380.jpg')
							$(b+'.tum>.GT1').css({
								'background':'url("http://static-cdn.jtvnw.net/ttv-boxart/'+encodeURI(StreamGame)+'-272x380.jpg")',
								'background-size':'contain',
								'cursor':'pointer'
							});
							else
							$(b+'.tum>.GT1').css({
								'background-size':'contain',
								'cursor':'pointer'
							});
					$(b+'.tum>.GT2').css({
						'background':'url("./img/playing.png")',
						'background-size': 'contain',
						'cursor':'pointer'
					});
					if (StreamGame == 'Not playing')
						$(b+'.tum>.GT2, '+b+'.tum>.GT1').hide();
				}
		}

		if (local.Status.online == 0 && local.Status.update == 0)
		    $('#insertContentHere').html('<div class="NOO"><a>No one online right now :(</a></div>');
	});
}

var pg = false, st = 1;
setInterval(function(){
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
	pg = Upd!==0;
	if (pg) {
		if (_$('CheckingProgress').hidden) {
			$('#CheckingProgress').show();
			_$('CheckingProgress').hidden=false;
		}
		_$('CheckingProgress').value = Math.floor( (100 / local.Following) * local.Status.checked);
		if (st === 8) { Animation('refresh', ['spin', false, 0.8]); st = 1; }
		else { st+=1 }
	} else if (!_$('CheckingProgress').hidden) {
		$('#CheckingProgress').hide();
		_$('CheckingProgress').hidden=true;
	}
}, 100);

window.onload = function(e){
	setInterval(InsertOnlineList, 1000);
	setTimeout(InsertOnlineList, 0);
};
