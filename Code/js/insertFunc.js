{{LICENSE_HEADER}}
var FirstLoadInsertFunc = 1,
	TimersetToUpdate = [],
	refresh = false;
texts = { d:new Date() };

function snum(){
	switch (local.Config.Format) {
		case 'Grid' : Num = 315, Num2 = 43, Num3 = 'none', Num4 = 16, Num6 = 315; break;
		case 'Full' : Num = 340, Num2 = 43, Num3 = 'none', Num4 = 17, Num6 = 340; break;
		case 'Light': Num = 525, Num2 = 43, Num3 = 90,     Num4 = 16, Num6 = 180; break;
	}
};
snum();

function InsertOnlineList() {
	function name(n){
		if (local.Config.Format === 'Mini')
			return n;
		var nm = {
			// TODO
			'speeddemosarchivesda': 'SDA'
		};
		if ($.inArray(n, nm)!==-1) { return nm[n]; }
		else { return n; }
	}
	function offSet(s,n,w) {
		var d = doc('textWidth');
		d.style.fontSize = s+'px';
		d.innerHTML = n;
		return (d.offsetWidth>w);
	}

	if (local.Status.online <= 2)
		doc('insertContentHere').style.overflow='hidden'
	else
		doc('insertContentHere').style.overflow='auto';

	$.each(local.FollowingList, function(i,v) {
		var StreamTitle   = v.Stream.Title,
			StreamerName  = v.Name,
			ShortStrmName = name(StreamerName),
			StreamGame    = v.Stream.Game,
			StreamVievers = v.Stream.Viewers,
			TitleWidth    = false,
			GameWidth     = false,
			SLU, dc;

		if (v.Stream) {
			if (typeof texts[StreamTitle] === 'undefined') {
				texts[StreamTitle] = offSet(Num4, StreamTitle, Num);
			} else { TitleWidth = texts[StreamTitle] }
			
			if (typeof texts[StreamGame] === 'undefined') {
				texts[StreamGame] = offSet(Num4, StreamGame, Num6);
			} else { GameWidth = texts[StreamGame] }
		}

		if (TimersetToUpdate.indexOf(i) < 0) {
		    if (v.Stream) {
		        if (doc('insertContentHere').innerHTML == '<div class="NOO"><a>No one online right now :(</a></div>')
		        	doc('insertContentHere').innerHTML = null;
				SLU = '<div class="content" id="'+i+'">';
					SLU += '<div class="tumblr">';
						SLU += '<a class="LaunchStream" href="http://www.twitch.tv/'+StreamerName+'" target="_blank">Launch Stream</a>'
						SLU += '<img class="TumbStream" id="stream_img_'+i+'" />';
						SLU += '<img class="GameTumb1" id="stream_game_img_'+i+'" />';
						SLU += '<img class="GameTumb2" id="stream_game_2_img_'+i+'" />';
						SLU += '<div class="zoom" id="zoom_'+i+'"></div>';
					SLU += '</div><div class="information">';
						SLU += '<div id="Title_'+i+'" type="inf">'+StreamTitle+'</div>';
						SLU += '<div class="streamer">';
							SLU += '<a id="stream_title_'+i+'" target="_blank" href="http://www.twitch.tv/'+StreamerName+'">'+ShortStrmName+'</a>';
						SLU += '</div><div class="viewers">';
							SLU += '<div class="informationTextViewers" id="Viewers_'+i+'">'+StreamVievers+'</div>';
							SLU += '<p>viewers</p>';
						SLU += '</div><div class="informationTextGame">';
							SLU += '<a id="stream_game_'+i+'" type="inf"';
							if (StreamGame!=='Not Playing')
								SLU+='href="http://www.twitch.tv/directory/game/'+StreamGame+'" target="_blank"';
							SLU += StreamGame+'</a>';
						SLU += '</div><div class="StreamOnChannelPage">';
							SLU += '<div class="ChannelPageDiv"><a href="http://www.twitch.tv/"'+StreamerName+'" target="_blank">';
								SLU += '<button type="button" class="button">Channel page</button></a></div>';
							SLU += '<div class="StreamDurationDiv"><a id="Stream_Duration_'+i+'" class="StreamDuration"></a>';
				SLU += '</div></div></div></div>';

				doc('insertContentHere').innerHTML += SLU;

				$.data(doc("Title_"+i), 'show', TitleWidth);
				$.data(doc("stream_game_"+i), 'show', TitleWidth);

				if (FirstLoadInsertFunc != 1) Animation(i, ['fadeIn', false]);
				TimersetToUpdate.push(i);

				doc('stream_img_'+i).setAttribute('style','background:url(http://static-cdn.jtvnw.net/previews-ttv/live_user_'+StreamerName+'-320x200.jpg);background-size:'+Num3+'px;cursor:pointer');
				if (StreamGame != 'Not playing') {
					doc('stream_game_img_'+i).setAttribute('style','background:url("http://static-cdn.jtvnw.net/ttv-boxart/'+StreamGame+'.jpg");background-size:'+Num2+'px;cursor:pointer')
					doc('stream_game_2_img_'+i).setAttribute('style','background:url("./img/playing.png");background-size:'+Num2+'px;cursor:pointer')
				} else {
					$('#stream_game_'+i).css('cursor', 'default');
					$('#stream_game_img_'+i).hide();
					$('#stream_game_2_img_'+i).hide();
					$('#stream_game_2_img_'+i).css('cursor', 'default');
				}
			}
		} else if (TimersetToUpdate.indexOf(i) >= 0) {
		    if (!local.FollowingList[i].Stream && doc(i) != null) {
		    	doc(i).remove();
		    	TimersetToUpdate.splice(TimersetToUpdate.indexOf(i), 1);
		    } else {
				doc('Title_'+i).innerHTML = StreamTitle
				
				$.data(doc("Title_"+i), 'show', TitleWidth);
				$.data(doc("stream_game_"+i), 'show', TitleWidth);

				doc('stream_game_'+i).innerHTML = StreamGame
				doc('Viewers_' + i).innerHTML = local.FollowingList[i].Stream.Viewers;

				if ($('#stream_img_'+i).css('background') != 'http://static-cdn.jtvnw.net/previews-ttv/live_user_'+StreamerName+'-320x200.jpg')
					doc('stream_img_'+i).setAttribute('style', 'background:url(http://static-cdn.jtvnw.net/previews-ttv/live_user_'+StreamerName+'-320x200.jpg);background-size:'+Num3+'px;cursor:pointer;z-index:0');
				
				if (StreamGame == 'Not playing') {
					$('#stream_game_' + i).css('cursor', 'default');
					$('#stream_game_2_' + i).css('cursor', 'default');
					$('#stream_game_img_'+i).hide();
					$('#stream_game_2_img_'+i).hide();
				} else if (doc('stream_game_img_'+i).style.background.match(/(?:boxart)(.*)(?:\.jpg)/)[0].slice(7) !== encodeURIComponent(StreamGame).replace('%3A',':')+'.jpg') {
					doc('stream_game_img_' + i).setAttribute('style', 'background:url("http://static-cdn.jtvnw.net/ttv-boxart/'+StreamGame+'.jpg");background-size:'+Num2+'px;cursor:pointer')
				}
			}
		}

		if (local.Status.online == 0 && local.Status.update == 0) 
		    doc('insertContentHere').innerHTML = '<div class="NOO"><a>No one online right now :(</a></div>';
	});
	
	if (local.Config.Duration_of_stream) {
		function h(b,j) {
			if (b === 0) { return '00'+j; }
			else if (b < 10) { return '0'+b+j; }
			else { return b.toString()+j; }
		}
		for (var i=0;i<TimersetToUpdate.length;i++) {
			var SubtractTimes, Days, Hours, Minutes, Seconds, Time
			SubtractTimes = Math.floor(((new Date()).getTime() - (new Date(local.FollowingList[TimersetToUpdate[i]].Stream.Time)).getTime()) / 1000);
			Days = Math.floor(SubtractTimes/24/60/60);
			SubtractTimes -= Days*24*60*60;
			if (Days == 0) { Days = '' } else { Days = (Days < 10) ? '0'+Days+'d:' : Days+'d:'; }
			Hours = Math.floor(SubtractTimes/60/60);
			SubtractTimes -= Hours*60*60;
			Hours = h(Hours, 'h:');
			Minutes = Math.floor(SubtractTimes/60);
			SubtractTimes -= Minutes*60;
			Minutes = h(Minutes, 'm:')
			Seconds = Math.floor(SubtractTimes);
			Seconds = h(Seconds, 's');
			Time = Days + '' + Hours + '' + Minutes + '' + Seconds;
            if (doc('Stream_Duration_'+TimersetToUpdate[i])) doc('Stream_Duration_'+TimersetToUpdate[i]).innerHTML = Time;
		}
	}
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
	var j = doc('FollowedChannelsOnline'),
	    Upd = local.Status.update,
	    Onlv = local.Status.online;
	if (!Onlv) Onlv = 0;
	switch (Upd) {
		case 0: j.innerHTML = 'Now online '+Onlv+' from '+localStorage.Following; break;
		case 1: j.innerHTML='Behold! Update!'; break;
		case 2: j.innerHTML='Updating list of followed channels...'; break;
		case 3: j.innerHTML='List of followed channels updated.'; break;
		case 4: j.innerHTML = 'Checking, online '+Onlv+' from '+localStorage.Following; break;
		case 5: j.innerHTML='App have a problem with update'; break;
		case 6: j.innerHTML="Name doesn't set up yet!"; break;
	}
	pg = Upd!==0;
	if (pg) {
		if (doc('CheckingProgress').hidden) { $('#CheckingProgress').show(); doc('CheckingProgress').hidden=false; }
		doc('CheckingProgress').value = Math.floor( (100 / localJSON('Following')) * local.Status.checked);
		if (st === 8) { Animation('refresh', ['spin', false, 0.8]); st = 1; }
		else { st+=1 }
	} else if (!doc('CheckingProgress').hidden) { $('#CheckingProgress').hide(); doc('CheckingProgress').hidden=true; }
}, 100);

var run = function() {
	(function() {
		if (typeof local.Config.Timeout !== 'undefined') {
			var dif = (new Date(local.Config.Timeout)).getTime()-(new Date()).getTime();
			dif/=86400000;
			if (local.Config.Timeout === 1337) return true;
			if (dif > 0) return true;
			if (dif <= 0 || dif > 14) localJSON('Config',['Timeout', 0]);
		} else {
			localJSON('Config',['Timeout', TimeNdate(14,0,'-')]);
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
			setTimeout(function(){$('#CloseNews').on('click', function(){doc('donate').remove();localJSON('Config',['Timeout',TimeNdate(14,0)]);ga('set','PayPalButton','false')});
			$('#PayPalCheckOut').on('click', function(){ga('set', 'PayPalButton', 'true')});});
		}
	})();
	InsertOnlineList()
};
setInterval(run, 1000);