{{LICENSE_HEADER}}
var FirstLoadInsertFunc = 1,
	TimersetToUpdate = [],
	refresh = false,
	t, g;
texts = { d:new Date() };

function snum(){
	switch (local.Config.Format) {
		// [T]itle = { [W]idth, [F]ontSize }
		case 'Grid' : t = {w: 315, f: 17}; g = {w: 315, f: 17}; break;
		case 'Full' : t = {w: 340, f: 18}; g = {w: 340, f: 17}; break;
		case 'Light': t = {w: 530, f: 18}; g = {w: 200, f: 16}; break;
	}
};
snum();

function InsertOnlineList() {
	/*
	* s - font size
	* n - text
	* w - max width
	*/
	function offSet(s,n,w) {
		var d = $('#textWidth').css('fontSize', s+'px').html(n);
		return (d.width()>w);
	}
	/*
	* a : {
	*  str : streamer
	*  ttl : title
	*  gme : game
	*  viw : viewers count
	*  pos : id
	* }
	*/
	function insert(a) {
		var t = '', n = (a.gme !== 'Not Playing');
		t += '<div class="content" id="'+a.pos+'">'
			+'<div class="tum"><a href="http://www.twitch.tv/'+a.str
			+'" target="_blank">Launch Stream</a><img class="ST" />'
			+'<img class="GT1" /><img class="GT2" />'
			+'<div class="zoom" id="zoom_'+a.pos+'"></div></div>'
			+'<div class="inf"><div class="title"><a>'+a.ttl+'</a></div>'
			+'<div class="streamer"><a '
			+ (n?'target="_blank" href="http://www.twitch.tv/'+a.str+'/profile"':'')
			+'>'+a.str+'</a></div>'
			+'<div class="viewers"><a>'+a.viw+' viewers</a></div>'
			+'<div class="game"><a '
			+(n?'href="http://www.twitch.tv/directory/game/'+a.gme+'" target="_blank"':'')
			+'>'+a.gme+'</a></div><div class="adds"><div class="page">'
			+'<a href="http://www.twitch.tv/'+a.str+'/profile" target="_blank">'
			+'<button type="button" class="button">Channel page</button></a></div>'
			+'<div class="duration"><a></a></div></div>';
		doc('insertContentHere').innerHTML += t;
	}

	$('#insertContentHere').css('overflow', (local.Status.online <= 2)?'hidden':'auto');

	if (TimersetToUpdate.length >= 1 && $('#'+TimersetToUpdate[0]).length == 0)
		TimersetToUpdate = [];

	$.each(local.FollowingList, function(i,v) {
		var StreamTitle   = v.Stream.Title,
			StreamerName  = v.Name,
			ShortStrmName = v.Stream.d_name || v.Name,
			StreamGame    = v.Stream.Game,
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

		if (TimersetToUpdate.indexOf(i) < 0) {
		    if (v.Stream) {
		        if ($('#insertContentHere').html() === '<div class="NOO"><a>No one online right now :(</a></div>')
		        	$('#insertContentHere').html('');

				insert({
					str: StreamerName,
					ttl: StreamTitle,
					gme: StreamGame,
					viw: StreamVievers,
					pos: i
				});

				$(b+'.inf>.title>a').attr('show', TitleWidth);
				$(b+'.inf>.game>a').attr('show', GameWidth);

				/*if (FirstLoadInsertFunc != 1)
					Animation(i, ['fadeIn', false]);*/

				TimersetToUpdate.push(i);

				$(b+'.tum>.ST').css({
					'background':'url(http://static-cdn.jtvnw.net/previews-ttv/live_user_'+StreamerName+'-320x200.jpg)',
					'background-size':'contain',
					'cursor':'pointer'
				});
				$(b+'.tum>.GT2').css({
					'background':'url("./img/playing.png")',
					'background-size': 'contain',
					'cursor':'pointer'
				});
				if (StreamGame != 'Not playing') {
					$(b+'.tum>.GT1').css({
						'background':'url("http://static-cdn.jtvnw.net/ttv-boxart/'+StreamGame+'.jpg")',
						'background-size':'contain',
						'cursor':'pointer'
					});
				} else {
					$(b+'.tum>.GT2, '+b+'.tum>.GT1').hide();
					$(b+'.tum>.GT2').css('cursor', 'default');
				}
			}
		} else if (TimersetToUpdate.indexOf(i) != -1) {
		    if (!v.Stream && doc(i) !== null) {
		    	doc(i).remove();
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

				if ($(b+'.tum>.ST').css('background') != 'http://static-cdn.jtvnw.net/previews-ttv/live_user_'+StreamerName+'-320x200.jpg')
					$(b+'.tum>.ST').css({
						'background': 'url(http://static-cdn.jtvnw.net/previews-ttv/live_user_'+StreamerName+'-320x200.jpg)',
						'background-size': 'contain',
						'cursor': 'pointer',
						'zIndex': 0
					});

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

var pg = false,
	st = 1;
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
	var j = doc('FollowedChannelsOnline'),
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
		if (doc('CheckingProgress').hidden) {
			$('#CheckingProgress').show();
			doc('CheckingProgress').hidden=false;
		}
		doc('CheckingProgress').value = Math.floor( (100 / local.Following) * local.Status.checked);
		if (st === 8) { Animation('refresh', ['spin', false, 0.8]); st = 1; }
		else { st+=1 }
	} else if (!doc('CheckingProgress').hidden) {
		$('#CheckingProgress').hide();
		doc('CheckingProgress').hidden=true;
	}
}, 100);

var run = function() {
	(function() {
		// You can relax for now... until next time...
		return true;
		if (typeof local.Config.Timeout !== 'undefined') {
			var dif = (new Date(local.Config.Timeout)).getTime()-(new Date()).getTime();
			dif/=86400000;
			if (local.Config.Timeout === 1337) return true;
			if (dif > 0) return true;
			if (dif <= 0 || dif > 14) localJSON('Config.Timeout', 0);
		} else {
			localJSON('Config.Timeout', TimeNdate(14,0,'-'));
			return false;
		}
		if (!doc('donate')) {
			$('#insertContentHere').prepend("<div id='donate'><a>Don't forget support me by donation ;)</a>"+
				'<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">'+
				'<input type="hidden" name="cmd" value="_s-xclick">'+
				'<input type="hidden" name="hosted_button_id" value="PMS9N35GNTLNQ">'+
				'<input type="image" id="PayPalCheckOut" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">'+
				'<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">'+
				'</form><a id="CloseNews">Close</a></div>');
			setTimeout(function(){$('#CloseNews').on('click', function(){doc('donate').remove();localJSON('Config.Timeout',TimeNdate(14,0));ga('set','PayPalButton','false')});
			$('#PayPalCheckOut').on('click', function(){ga('set', 'PayPalButton', 'true')});});
		}
	})();
	InsertOnlineList();
};
// TODO: make it faster
window.onload = function(e){
	setInterval(run, 1000);
	setTimeout(InsertOnlineList, 0);
};