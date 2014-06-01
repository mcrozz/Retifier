/*
	Copyright 2014 Ivan 'MacRozz' Zarudny

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

		http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

var FirstLoadInsertFunc = 1,
	TimersetToUpdate = [],
	refresh = false,
	texts = { t:[], r:[], d:new Date() };

(function snum(){
	switch (local.Config.Format) {
		case 'Grid': Num = 315, Num2 = 43, Num3 = 'none', Num4 = 16, Num6 = 315; break;
		case 'Full': Num = 340, Num2 = 43, Num3 = 'none', Num4 = 17, Num6 = 340; break;
		default: Num = 525, Num2 = 43, Num3 = 90, Num4 = 16, Num6 = 180; break;
	}
})();

function InsertOnlineList() {
	function zoom() {
		Animation('zoomContent', ['fadeIn', false, 0.8]);
		Animation('userChangePopup2', ['fadeIn', false, 0.8]);
		doc('userChangePopup2').onclick = function() {
			Animation('zoomContent', ['fadeOut', true, 0.7]);
			Animation('userChangePopup2', ['fadeOut', true, 0.5]);
			doc('userChangePopup2').onclick = null;
			doc('zoomContent').onclick = null;
		}
	}

	if (local.Status.online <= 2) doc('insertContentHere').style.overflow='hidden'
	else doc('insertContentHere').style.overflow='auto';

	var FollowList = local.FollowingList;

	for (var i = 0; i < localJSON('Following') ; i++) {
		var StreamTitle = FollowList[i].Stream.Title,
			StreamerName = FollowList[i].Name,
			StreamGame = FollowList[i].Stream.Game,
			StreamVievers = FollowList[i].Stream.Viewers,
			TitleWidth = false,
			GameWidth = false,
			SLU, dc;

		if (FollowList[i].Stream) {
			dc = doc('textWidth');
			if (texts.t.indexOf(StreamTitle) === -1) {
				dc.style.fontSize = Num4+'px';
				dc.innerHTML = StreamTitle;
				texts.t.push(StreamTitle);
				if (dc.offsetWidth > Num) TitleWidth = true;
				texts.r.push(textWidth ? true : false);
			} else { TitleWidth = texts.r[texts.t.indexOf(StreamTitle)]; }
			
			if (texts.t.indexOf(StreamGame) === -1) {
				dc.innerHTML = StreamGame;
				dc.style.fontSize = Num4+'px';
				texts.t.push(StreamGame);
				if (dc.offsetWidth > Num6) GameWidth = true;
				texts.r.push(GameWidth ? true : false);
			} else { GameWidth = texts.r[texts.t.indexOf(StreamGame)]; }
		}

		if (TimersetToUpdate.indexOf(i) < 0) {
		    if (FollowList[i].Stream) {
		        if (doc('insertContentHere').innerHTML == '<div class="NOO"><a>No one online right now :(</a></div>') doc('insertContentHere').innerHTML = null;
				SLU = '<div class="content" id="'+i+'">';
					SLU += '<div class="tumblr">';
						SLU += '<a class="LaunchStream" href="http://www.twitch.tv/'+StreamerName+'" target="_blank">Launch Stream</a>'
						SLU += '<img class="TumbStream" id="stream_img_'+i+'" />';
						SLU += '<img class="GameTumb1" id="stream_game_img_'+i+'" />';
						SLU += '<img class="GameTumb2" id="stream_game_2_img_'+i+'" />';
						SLU += '<div class="zoom" id="zoom_'+i+'"></div>';
					SLU += '</div><div class="information">';
						SLU += '<div class="informationTextTitle" id="Title_'+i+'">'+StreamTitle+'</div>';
						SLU += '<div class="streamer">';
							SLU += '<a class="informationTextStreamer" id="stream_title_'+i+'" target="_blank" href="http://www.twitch.tv/'+StreamerName+'">' + StreamerName+'</a>';
						SLU += '</div><div class="viewers">';
							SLU += '<div class="informationTextViewers" id="Viewers_'+i+'">'+StreamVievers+'</div>';
							SLU += '<p>viewers</p>';
						SLU += '</div><div class="informationTextGame" id="stream_game_'+i+'">'+StreamGame;
							SLU += '<a class=';
							if (StreamGame!='Not Playing') SLU+='href="http://www.twitch.tv/directory/game/'+StreamGame+'" target="_blank"';
							SLU += '</a>';
						SLU += '</div><div class="StreamOnChannelPage">';
							SLU += '<div class="ChannelPageDiv"><a href="http://www.twitch.tv/"'+StreamerName+'" target="_blank">';
								SLU += '<button type="button" class="button">Channel page</button></a></div>';
							SLU += '<div class="StreamDurationDiv"><a id="Stream_Duration_'+i+'" class="StreamDuration"></a>';
				SLU += '</div></div></div></div>';

				doc('insertContentHere').innerHTML += SLU;

				doc('zoom_'+i).onclick = function(call) {
					doc('zoomIMG').setAttribute('style', 'background:url(http://static-cdn.jtvnw.net/previews-ttv/live_user_'+doc('stream_title_'+call.target.id.match(/\d+/)[0]).innerHTML+'-640x400.jpg) no-repeat;background-size:696 400');
					zoom();
				};

				if (TitleWidth) {
					doc("Title_"+i).onmouseover = function(call){
						doc('message').innerHTML = doc(call.target.id).innerHTML;
						$('#message').show();
					};
					doc('Title_'+i).onmouseout = function(){ $('#message').hide() };
				} else {
					doc("Title_"+i).onmouseover = null;
					doc('Title_'+i).onmouseout = null;
				}
				if (GameWidth) {
					doc('stream_game_'+i).onmouseover = function(call){
						doc('message').innerHTML = doc(call.target.id).innerHTML;
						$('#message').show();
					};
					doc('stream_game_'+i).onmouseout = function(){ $('#message').hide() };
				} else {
					doc("stream_game_"+i).onmouseover = null;
					doc('stream_game_'+i).onmouseout = null;
				}

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
		    	doc("Title_"+i).onmouseover = null;
				doc('Title_'+i).onmouseout = null;
				doc("stream_game_"+i).onmouseover = null;
				doc('stream_game_'+i).onmouseout = null;
		    } else {
				doc('Title_'+i).innerHTML = StreamTitle
				if (TitleWidth) {
					doc("Title_"+i).onmouseover = function(call){
						doc('message').innerHTML = doc(call.target.id).innerHTML;
						$('#message').show();
					};
					doc('Title_'+i).onmouseout = function(){ $('#message').hide() };
				} else {
					doc("Title_"+i).onmouseover = null;
					doc('Title_'+i).onmouseout = null;
				}
				if (GameWidth) {
					doc('stream_game_'+i).onmouseover = function(call){
						doc('message').innerHTML = doc(call.target.id).innerHTML;
						$('#message').show();
					};
					doc('stream_game_'+i).onmouseout = function(){ $('#message').hide() };
				} else {
					doc("stream_game_"+i).onmouseover = null;
					doc('stream_game_'+i).onmouseout = null;
				}
				doc('zoom_'+i).onclick = function(call) {
					doc('zoomIMG').setAttribute('style', 'background:url(http://static-cdn.jtvnw.net/previews-ttv/live_user_'+doc('stream_title_'+call.target.id.match(/\d+/)[0]).innerHTML+'-640x400.jpg) no-repeat;background-size:696 400');
					zoom();
				};

				doc('stream_game_'+i).innerHTML = StreamGame
				doc('Viewers_' + i).innerHTML = local.FollowingList[i].Stream.Viewers;

				if (doc('stream_img_'+i).style.background != 'http://static-cdn.jtvnw.net/previews-ttv/live_user_'+StreamerName+'-320x200.jpg')
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
		case 0: j.innerHTML = 'Now online '+Onlv+' from '+localStorage.Following; pg=false; break;
		case 1: j.innerHTML='Behold! Update!'; pg=true; break;
		case 2: j.innerHTML='Updating list of followed channels...'; pg=true; break;
		case 3: j.innerHTML='List of followed channels updated.'; pg=true; break;
		case 4: j.innerHTML = 'Checking, online '+Onlv+' from '+localStorage.Following; pg=true; break;
		case 5: j.innerHTML='App have a problem with update'; break;
		case 6: j.innerHTML="Name doesn't set up yet!"; break;
	}
	if (pg) {
		if (doc('CheckingProgress').hidden) { $('#CheckingProgress').show(); doc('CheckingProgress').hidden=false; }
		doc('CheckingProgress').value = Math.floor( (100 / localJSON('Following')) * local.Status.checked);
		if (st === 8) { Animation('refresh', ['spin', false, 0.8]); st = 1; }
		else { st+=1 }
	} else if (!doc('CheckingProgress').hidden) { $('#CheckingProgress').hide(); doc('CheckingProgress').hidden=true; }
}, 100);

var run = function() {
	if (local.Config.Duration_of_stream) {
		for (var i=0;i<TimersetToUpdate.length;i++) {
			var InsertTimeHere, StreamTime, SubtractTimes, Days, Hours, Minutes, Seconds, Time, Today;
			InsertTimeHere = 'Stream_Duration_'+TimersetToUpdate[i];
			StreamTime = new Date(local.FollowingList[TimersetToUpdate[i]].Stream.Time);
			Today = new Date();
			SubtractTimes = Math.floor((Today.getTime() - StreamTime.getTime()) / 1000);
			Days = Math.floor(SubtractTimes/24/60/60);
			SubtractTimes -= Days*24*60*60;
			if (Days == 0) { Days = '' } else { Days = (Days < 10) ? '0'+Days+'d:' : Days+'d:'; }
			Hours = Math.floor(SubtractTimes/60/60);
			SubtractTimes -= Hours*60*60;
			if (Hours == 0) { Hours = '' } else { Hours = (Hours < 10) ? '0'+Hours+'h:' : Hours+'h:'; }
			Minutes = Math.floor(SubtractTimes/60);
			SubtractTimes -= Minutes*60;
			if (Minutes == 0) { Minutes = '00m:' } else { Minutes = (Minutes < 10) ? '0'+Minutes+'m:' : Minutes+'m:'; }
			Seconds = Math.floor(SubtractTimes);
			if (Seconds == 0) { Seconds = '00s' } else { Seconds = (Seconds < 10) ? '0'+Seconds+'s' : Seconds+'s'; }
			Time = Days + '' + Hours + '' + Minutes + '' + Seconds;
            if (doc(InsertTimeHere)) doc(InsertTimeHere).innerHTML = Time;
		}
	} 

	(function() {
		if (typeof local.Config.Timeout !== 'undefined') {
			var dif = (new Date(local.Config.Timeout)).getTime()-(new Date()).getTime();
			dif/=86400000;
			if (local.Config.Timeout === 1337) return true;
			if (dif > 0) return true;
			if (dif <= 0 || dif > 14) localJSON('Config','c',['Timeout', 0]);
		} else {
			localJSON('Config','c',['Timeout', TimeNdate(14,0,'-')]);
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
			setTimeout(function(){$('#CloseNews').on('click', function(){doc('donate').remove();localJSON('Config','c',['Timeout',TimeNdate(14,0)]);ga('set','PayPalButton','false')});
			$('#PayPalCheckOut').on('click', function(){ga('set', 'PayPalButton', 'true')});},100);
		}
	})();
	InsertOnlineList()
};
setInterval(run, 1000);