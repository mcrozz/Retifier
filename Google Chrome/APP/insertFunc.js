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
	if (localJSON('Status','v',['online']) <= 2) doc('insertContentHere').style.overflow='hidden'
	else doc('insertContentHere').style.overflow='auto';
	var c = localJSON('Config', 'v', ['Format']),
		FollowList = localJSON('FollowingList');

	if (c == 'Grid') { var Num = 315, Num2 = 43, Num3 = 'none', Num4 = 16, Num6 = 315; } 
	else if (c == 'Full') { var Num = 340, Num2 = 43, Num3 = 'none', Num4 = 17, Num6 = 340; }
	else { var Num = 525, Num2 = 43, Num3 = 90, Num4 = 16, Num6 = 180; };

	for (var i = 0; i < localJSON('Following') ; i++) {
		var StreamTitle = FollowList[i].Stream.Title,
			StreamerName = FollowList[i].Name,
			StreamGame = FollowList[i].Stream.Game,
			StreamVievers = FollowList[i].Stream.Viewers,
			TitleWidth = false,
			GameWidth = false,
			StreamListUnit, dc;

		if (FollowList[i].Stream) {
			dc = doc('textWidth')
			dc.style.fontSize = '16px';
			dc.innerHTML = StreamTitle;
			if (dc.offsetWidth > Num) TitleWidth = true;
			dc.innerHTML = StreamGame;
			if (dc.offsetWidth > Num6) GameWidth = true;
		}

		if (TimersetToUpdate.indexOf(i) < 0) {
		    if (FollowList[i].Stream) {
		        if (doc('insertContentHere').innerHTML == '<div class="NOO"><a>No one online right now :(</a></div>') doc('insertContentHere').innerHTML = null;
				StreamListUnit = '<div class="content" id="'+i+'">';
					StreamListUnit += '<div class="tumblr">';
						StreamListUnit += '<a href="http://www.twitch.tv/'+StreamerName+'" target="_blank"><img class="TumbStream" id="stream_img_'+i+'" /></a>';
						StreamListUnit += '<a';
						StreamListUnit += StreamGame == 'Not Playing' ? 'data-title="Nothing"' : 'href="http://www.twitch.tv/directory/game/'+StreamGame+'" target="_blank" data-title="Who else playing '+StreamGame+'"';
						StreamListUnit +='><img class="GameTumb1" id="stream_game_img_'+i+'" /></a>';
						StreamListUnit += '<img class="GameTumb2" id="stream_game_2_img_'+i+'" />';
					StreamListUnit += '</div>';
					StreamListUnit += '<div class="information">';
						StreamListUnit += '<div class="informationTextTitle" id="Title_'+i+'">'+ StreamTitle + '</div>';
						StreamListUnit += '<div class="streamer">';
							StreamListUnit += '<a class="informationTextStreamer" target="_blank" href="http://www.twitch.tv/'+StreamerName+'">' + StreamerName+'</a>';
						StreamListUnit += '</div>';
						StreamListUnit += '<div class="viewers">';
							StreamListUnit += '<div class="informationTextViewers" id="Viewers_'+i+'">' + StreamVievers + '</div>';
							StreamListUnit += '<p class="pViewers">viewers</p>';
						StreamListUnit += '</div><div class="informationTextGame" id="stream_game_'+i+'">'+StreamGame;
							StreamListUnit += '<a class=';
							if (StreamGame!='Not Playing') StreamListUnit+='href="http://www.twitch.tv/directory/game/'+StreamGame+'" target="_blank"';
							StreamListUnit += '</a>';
						StreamListUnit += '</div>';
						StreamListUnit += '<div class="StreamOnChannelPage">';
							StreamListUnit += '<div class="ChannelPageDiv"><a href="http://www.twitch.tv/"'+StreamerName+'" target="_blank">';
								StreamListUnit += '<button type="button" name="Go to a stream page" class="button">Channel page</button></a>';
								StreamListUnit += '</div>';
							StreamListUnit += '<div class="StreamDurationDiv">';
								StreamListUnit += '<a id="Stream_Duration_'+i+'" class="StreamDuration"></a>';
								StreamListUnit += '</div>';
						StreamListUnit += '</div>';
					StreamListUnit += '</div>';
				StreamListUnit += '</div>';

				doc('insertContentHere').innerHTML += StreamListUnit;
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

				if (FirstLoadInsertFunc != 1) Animation(i, 'animated fadeIn', false);
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
		    if (FollowingList('v', i)[1] == null && doc(i) != null) doc(i).remove();

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

			doc('stream_game_'+i).innerHTML = StreamGame
			doc('Viewers_' + i).innerHTML = FollowingList('v', i)[3];

			if (doc('stream_img_'+i).style.background != 'http://static-cdn.jtvnw.net/previews-ttv/live_user_'+StreamerName+'-320x200.jpg')
				doc('stream_img_'+i).setAttribute('style', 'background:url(http://static-cdn.jtvnw.net/previews-ttv/live_user_'+StreamerName+'-320x200.jpg);background-size:'+Num3+';cursor:pointer;z-index:0');
			
			if (StreamGame == 'Not playing') {
				$('#stream_game_' + i).css('cursor', 'default');
				$('#stream_game_2_' + i).css('cursor', 'default');
				$('#stream_game_img_'+i).hide();
				$('#stream_game_2_img_'+i).hide();
			} else if (doc('stream_game_img_'+i).style.background.substring(4, doc('stream_game_img_'+i).style.background.length - 2) != 'http://static-cdn.jtvnw.net/ttv-boxart/'+encodeURIComponent(StreamGame)+'.jpg') {
				doc('stream_game_img_' + i).setAttribute('style', 'background:url("http://static-cdn.jtvnw.net/ttv-boxart/' + StreamGame + '.jpg");background-size:' + Num2 + ';cursor:pointer')
			}
		}

		if (localJSON('Status','v',['online']) == 0 && localJSON('Status','v',['update']) == 0) 
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
	    Upd = localJSON('Status', 'v', ['update']),
	    Onlv = localJSON('Status', 'v', ['online']);
	if (!Onlv) Onlv = 0;
	if (Upd == 0) {
	    InsertHere.innerHTML = 'Now online ' + Onlv + ' from ' + localJSON('Following');
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
	    InsertHere.innerHTML = 'Checking, online ' + Onlv + ' from ' + localJSON('Following');
		progressBar('Enable');
		refresh = true;
	} else if (Upd == 5) { 
		InsertHere.innerHTML='App have a problem with update'
	} else if (Upd == 6) { 
		InsertHere.innerHTML="Name doesn't set up yet!"
	}
}, 100);

setInterval(function(){
	if (refresh) Animation('refresh', 'spin', false);
	
	if (localJSON('Config','v',['Duration_of_stream']) == 'Enable') {
		for (var i=0;i<TimersetToUpdate.length;i++) {
			var InsertTimeHere = 'Stream_Duration_'+TimersetToUpdate[i],
				StreamDurationTime = 'Stream_Time_'+TimersetToUpdate[i],
				hs, ms, ss,
				date = new Date(Math.abs(new Date()) - Math.abs(new Date(FollowingList('v',TimersetToUpdate[i])[4])));
			hs = date.getHours() < 10 ? '0'+date.getHours() : date.getHours();
			ms = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
			ss = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds();
            if (doc(InsertTimeHere)) doc(InsertTimeHere).innerHTML = hs+'h:'+ms+'m:'+ss+'s';
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
		} else if (localJSON('Config','v',['Closed']) != 'true') { donationUnit() }
	} else { localJSON('Config','c',['Timeout',time]) }

	if (Math.abs(time) - Math.abs(time) > Math.abs(time)+432000000) localJSON('Config','c',['Timeout', 0]);
	InsertOnlineList()
},1001)