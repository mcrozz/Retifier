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

FirstLoadInsertFunc = 1;
TimersetToUpdate = [];
refresh = false;

function InsertOnlineList() {
	function zoom() {
		Animation('zoomContent', ['fadeIn', false]);
		Animation('userChangePopup2', ['fadeIn', false]);
		doc('userChangePopup2').onclick = function() {
			Animation('zoomContent', ['fadeOut', true]);
			Animation('userChangePopup2', ['fadeOut', true]);
			doc('userChangePopup2').onclick = null;
			doc('zoomContent').onclick = null;
		}
	}

	if (localJSON('Status','v',['online']) <= 2) doc('insertContentHere').style.overflow='hidden'
	else doc('insertContentHere').style.overflow='auto';
	var c = local.Config.Format,
		FollowList = local.FollowingList,
        Num, Num2, Num3, Num4, Num6;

	if (c == 'Grid') { Num = 315, Num2 = 43, Num3 = 'none', Num4 = 16, Num6 = 315; }
	else if (c == 'Full') { Num = 340, Num2 = 43, Num3 = 'none', Num4 = 17, Num6 = 340; }
	else { Num = 525, Num2 = 43, Num3 = 90, Num4 = 16, Num6 = 180; };

	for (var i = 0; i < localJSON('Following') ; i++) {
		var StreamTitle = FollowList[i].Stream.Title,
			StreamerName = FollowList[i].Name,
			StreamGame = FollowList[i].Stream.Game,
			StreamVievers = FollowList[i].Stream.Viewers,
			TitleWidth = false,
			GameWidth = false,
			SLU, dc;

		if (FollowList[i].Stream) {
			dc = doc('textWidth')
			dc.style.fontSize = Num4+'px';
			dc.innerHTML = StreamTitle;
			if (dc.offsetWidth > Num) TitleWidth = true;
			dc.innerHTML = StreamGame;
			if (dc.offsetWidth > Num6) GameWidth = true;
		}

		if (TimersetToUpdate.indexOf(i) < 0) {
		    if (FollowList[i].Stream) {
		        if (doc('insertContentHere').innerHTML == '<div class="NOO"><a>No one online right now :(</a></div>') doc('insertContentHere').innerHTML = null;
				SLU = '<div class="content" id="'+i+'">';
					SLU += '<div class="tumblr">';
						SLU += '<a href="http://www.twitch.tv/'+StreamerName+'" target="_blank"><img class="TumbStream" id="stream_img_'+i+'" /></a>';
						SLU += '<a ';
						if (StreamGame != 'Not Playing') SLU += 'href="http://www.twitch.tv/directory/game/'+StreamGame+'" target="_blank"';
						SLU +='><img class="GameTumb1" id="stream_game_img_'+i+'" /></a>';
						SLU += '<img class="GameTumb2" id="stream_game_2_img_'+i+'" />';
						SLU += '<div class="zoom" id="zoom_'+i+'"></div>';
					SLU += '</div>';
					SLU += '<div class="information">';
						SLU += '<div class="informationTextTitle" id="Title_'+i+'">'+ StreamTitle + '</div>';
						SLU += '<div class="streamer">';
							SLU += '<a class="informationTextStreamer" id="stream_title_'+i+'" target="_blank" href="http://www.twitch.tv/'+StreamerName+'">' + StreamerName+'</a>';
						SLU += '</div>';
						SLU += '<div class="viewers">';
							SLU += '<div class="informationTextViewers" id="Viewers_'+i+'">' + StreamVievers + '</div>';
							SLU += '<p class="pViewers">viewers</p>';
						SLU += '</div><div class="informationTextGame" id="stream_game_'+i+'">'+StreamGame;
							SLU += '<a class=';
							if (StreamGame!='Not Playing') SLU+='href="http://www.twitch.tv/directory/game/'+StreamGame+'" target="_blank"';
							SLU += '</a>';
						SLU += '</div>';
						SLU += '<div class="StreamOnChannelPage">';
							SLU += '<div class="ChannelPageDiv"><a href="http://www.twitch.tv/"'+StreamerName+'" target="_blank">';
								SLU += '<button type="button" name="Go to a stream page" class="button">Channel page</button></a>';
								SLU += '</div>';
							SLU += '<div class="StreamDurationDiv">';
								SLU += '<a id="Stream_Duration_'+i+'" class="StreamDuration"></a>';
								SLU += '</div>';
						SLU += '</div>';
					SLU += '</div>';
				SLU += '</div>';

				doc('insertContentHere').innerHTML += SLU;

				doc('zoom_'+i).onclick = function(call) {
					doc('zoomIMG').setAttribute('style', 'background:url(http://static-cdn.jtvnw.net/previews-ttv/live_user_'+doc('stream_title_'+call.target.id.match(/\d+/)[0]).innerHTML+'-640x400.jpg) no-repeat');
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

				doc('stream_img_'+i).setAttribute('style','background:url(http://static-cdn.jtvnw.net/previews-ttv/live_user_'+StreamerName+'-320x200.jpg);background-size:'+Num3+';cursor:pointer');
				if (StreamGame != 'Not playing') {
					doc('stream_game_img_'+i).setAttribute('style','background:url("http://static-cdn.jtvnw.net/ttv-boxart/'+StreamGame+'.jpg");background-size:'+Num2+';cursor:pointer')
					doc('stream_game_2_img_'+i).setAttribute('style','background:url("/img/playing.png");background-size:'+Num2+';cursor:pointer')
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
					doc('zoomIMG').setAttribute('style', 'background:url(http://static-cdn.jtvnw.net/previews-ttv/live_user_'+doc('stream_title_'+call.target.id.match(/\d+/)[0]).innerHTML+'-640x400.jpg) no-repeat');
					zoom();
				};

				doc('stream_game_'+i).innerHTML = StreamGame
				doc('Viewers_' + i).innerHTML = local.FollowingList[i].Stream.Viewers;

				if (doc('stream_img_'+i).style.background != 'http://static-cdn.jtvnw.net/previews-ttv/live_user_'+StreamerName+'-320x200.jpg')
					doc('stream_img_'+i).setAttribute('style', 'background:url(http://static-cdn.jtvnw.net/previews-ttv/live_user_'+StreamerName+'-320x200.jpg);background-size:'+Num3+';cursor:pointer;z-index:0');
				
				if (StreamGame == 'Not playing') {
					$('#stream_game_' + i).css('cursor', 'default');
					$('#stream_game_2_' + i).css('cursor', 'default');
					$('#stream_game_img_'+i).hide();
					$('#stream_game_2_img_'+i).hide();
				} else if (doc('stream_game_img_'+i).style.background.match(/rt\/\S+\.jpg/)[0].slice(3) != encodeURIComponent(StreamGame)+'.jpg') {
					doc('stream_game_img_' + i).setAttribute('style', 'background:url("http://static-cdn.jtvnw.net/ttv-boxart/' + StreamGame + '.jpg");background-size:' + Num2 + ';cursor:pointer')
				}
			}
		}

		if (local.Status.online == 0 && local.Status.update == 0) 
		    doc('insertContentHere').innerHTML = '<div class="NOO"><a>No one online right now :(</a></div>';
	}
}

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
	var InsertHere = doc('FollowedChannelsOnline'),
	    Upd = local.Status.update,
	    Onlv = local.Status.online;
	if (!Onlv) Onlv = 0;
	if (Upd == 0) {
	    InsertHere.innerHTML = 'Now online ' + Onlv + ' from ' + localStorage.Following;
		progressBar('Disable');
		refresh = false;
	} else if (Upd == 1) {
		InsertHere.innerHTML='Behold! Update!';
		progressBar('Enable');
		refresh = true;
	} else if (Upd == 2) { 
		InsertHere.innerHTML='Updating list of followed channels...';
		progressBar('Enable');
		refresh = true;
	} else if (Upd == 3) { 
		InsertHere.innerHTML='List of followed channels updated.';
		progressBar('Enable');
		refresh = true;
	} else if (Upd == 4) { 
	    InsertHere.innerHTML = 'Checking, online ' + Onlv + ' from ' + localStorage.Following;
		progressBar('Enable');
		refresh = true;
	} else if (Upd == 5) { 
		InsertHere.innerHTML='App have a problem with update'
	} else if (Upd == 6) { 
		InsertHere.innerHTML="Name doesn't set up yet!"
	}
}, 100);

setInterval(function(){
	if (refresh) Animation('refresh', ['spin', false, 0.8]);
	
	if (local.Config.Duration_of_stream == 'Enable') {
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

	function donationUnit() {
		var donationUnit = "<a class='donation1'>Don't forget support me by a donate ;)</a>";
		donationUnit += '<div style="text-align:right;margin:-23 184 0 0">';
		donationUnit += '<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">';
		donationUnit += '<input type="hidden" name="cmd" value="_s-xclick">';
		donationUnit += '<input type="hidden" name="hosted_button_id" value="PMS9N35GNTLNQ">';
		donationUnit += '<input type="image" id="PayPalCheckOut" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">';
		donationUnit += '<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">';
		donationUnit += '</form></div>';
		donationUnit += '<a id="CloseNews">[x]Close</a>';
		doc('News').innerHTML=donationUnit;
		doc('News').setAttribute('style','display:block;background:rgba(0,0,0,0.08);border-radius:25;margin:4 0 -19 0');
		doc('CloseNews').addEventListener('click',function(){
			$('#News').hide();
			localJSON('Config','c',['Timeout',Math.abs(new Date())+432000000]);
			_gaq.push(['_setCustomVar', 4, 'PayPalButton', 'false', 1]);
			localJSON('Config','c',['Closed','true'])
		});
		doc('PayPalCheckOut').addEventListener('click',function(){ _gaq.push(['_setCustomVar', 4, 'PayPalButton', 'true', 1]) })
	}
	var timeout = localJSON('Config','v',['Timeout']),
        time = new Date();
	if (timeout) {
		if (Math.abs(new Date(timeout)) - Math.abs(time) < 0) {
			localJSON('Config','c',['Closed', 'false']);
			donationUnit()
		} else if (local.Config.Closed != 'true') { donationUnit() }
	} else { localJSON('Config','c',['Timeout',time]) }

	if (Math.abs(time) - Math.abs(time) > Math.abs(time)+432000000) localJSON('Config','c',['Timeout', 0]);
	InsertOnlineList()
},1001)