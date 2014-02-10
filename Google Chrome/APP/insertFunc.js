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
	if (localJSON('Status','v',['online']) <= 2) {
		doc('insertContentHere').style.overflow='hidden'
	} else if (localJSON('Status','v',['online']) > 2) {
		doc('insertContentHere').style.overflow='auto'
	}
	var c = localJSON('Config', 'v', ['Format']),
		FollowList = localJSON('FollowingList');

	if (c == 'Grid') { var Num = 315, Num2 = 43, Num3 = 'none', Num4 = 16, Num6 = 315; } 
	else if (c == 'Full') { var Num = 340, Num2 = 43, Num3 = 'none', Num4 = 17, Num6 = 340; }
	else { var Num = 525, Num2 = 43, Num3 = 90, Num4 = 16, Num6 = 180; };

	for (var i = 0; i < localJSON('Following') ; i++) {
		var StreamTitle = FollowList[i].Stream.Title,
			StreamerName = FollowList[i].Name,
			StreamGame = FollowList[i].Stream.Game,
			StreamVievers = FollowList[i].Stream.Viewers;
		
		if ('object'.indexOf(StreamTitle) != -1) StreamTitle = 'getting...';
		if ('object'.indexOf(StreamerName) != -1) StreamerName = 'getting...';
		if ('object'.indexOf(StreamGame) != -1) StreamGame = 'getting...';
		if ('object'.indexOf(StreamVievers) != -1) StreamVievers = '...';
		
		if (TimersetToUpdate.indexOf(i) < 0) {
		    if (FollowList[i]['Stream']) {
		        if (doc('insertContentHere').innerHTML == '<a style="color:black;width:713px;text-align:center">No one online right now :(</a>') doc('insertContentHere').innerHTML = null;
				
				var TitleWidth = false, GameWidth = false;
				doc('textWidth').innerHTML = StreamTitle;
				doc('textWidth').style.fontSize = Num4;
				if (doc('textWidth').offsetWidth > Num) TitleWidth = true;
				doc('textWidth').innerHTML = StreamGame;
				doc('textWidth').style.fontSize = Num4;
				if (doc('textWidth').offsetWidth > Num6) GameWidth = true;
				
				var StreamListUnit = '<div class="content" id="'+i+'">';
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
						doc('message').style.display = 'block';
					};
					doc('Title_'+i).onmouseout = function(){ $('#message').hide() };
				}
				if (GameWidth) {
					doc('stream_game_'+i).onmouseover = function(call){
						doc('message').innerHTML = doc(call.target.id).innerHTML;
						doc('message').style.display = 'block';
					};
					doc('stream_game_'+i).onmouseout = function(){ $('#message').hide() };
				}

				if (FirstLoadInsertFunc != 1) Animation(i, 'animated fadeIn', false);
				TimersetToUpdate.push(i);

				doc('stream_img_'+i).setAttribute('style','background:url(http://static-cdn.jtvnw.net/previews-ttv/live_user_'+StreamerName+'-320x200.jpg);background-size:'+Num3+';cursor:pointer');
				if (StreamGame != 'Not playing') {
					doc('stream_game_img_'+i).setAttribute('style','background:url("http://static-cdn.jtvnw.net/ttv-boxart/'+StreamGame+'.jpg");background-size:'+Num2+';cursor:pointer')
					doc('stream_game_2_img_'+i).setAttribute('style','background:url("/img/playing.png");background-size:'+Num2+';cursor:pointer')
				} else {
					doc('stream_game_'+i).setAttribute('style','cursor:default');
					$('#stream_game_img_'+i).hide();
					$('#stream_game_2_img_'+i).hide();
					doc('stream_game_2_img_'+i).setAttribute('style','cursor:default');
				}
			}
		} else if (TimersetToUpdate.indexOf(i) >= 0) {
		    if (FollowingList('v', i)[1] == null && doc(i) != null) doc(i).remove();

			doc('Title_'+i).innerHTML = StreamTitle
			doc('stream_game_'+i).innerHTML = StreamGame
			doc('Viewers_' + i).innerHTML = FollowingList('v', i)[3];

			if (doc('stream_img_'+i).style.background != 'http://static-cdn.jtvnw.net/previews-ttv/live_user_'+StreamerName+'-320x200.jpg')
				doc('stream_img_'+i).setAttribute('style', 'background:url(http://static-cdn.jtvnw.net/previews-ttv/live_user_'+StreamerName+'-320x200.jpg);background-size:'+Num3+';cursor:pointer;z-index:0');
			
			if (StreamGame == 'Not playing') {
				doc('stream_game_' + i).setAttribute('style', 'cursor:default');
				doc('stream_game_2_' + i).setAttribute('style', 'cursor:default');
				$('#stream_game_img_'+i).hide();
				$('#stream_game_2_img_'+i).hide();
			} else if (doc('stream_game_img_'+i).style.background.substring(4, doc('stream_game_img_'+i).style.background.length - 2) != 'http://static-cdn.jtvnw.net/ttv-boxart/'+encodeURIComponent(StreamGame)+'.jpg') {
				doc('stream_game_img_' + i).setAttribute('style', 'background:url("http://static-cdn.jtvnw.net/ttv-boxart/' + StreamGame + '.jpg");background-size:' + Num2 + ';cursor:pointer')
			}
		}

		if (localJSON('Status','v',['online']) == 0 && localJSON('Status','v',['update']) == 0) 
		    doc('insertContentHere').innerHTML = '<div style="width:100%;text-align:center"><a style="color:black">No one online right now :(</a></div>';
	}
}

setInterval(function(){
	/*
	StatusUpdate : 
	
	0 :: Not updating, finished
	1 :: Timer ended, start update
	2 :: Update list of followed channels
	3 :: List of followed channels updated
	4 :: Checking online channel
	5 :: Error
	6 :: Name doesn't set up!
	7 :: First start

	*/
	InsertHere=doc('FollowedChannelsOnline');
	Upd = localJSON('Status', 'v', ['update']);
	Onlv = localJSON('Status', 'v', ['online']);
	if (!Onlv) Onlv = 0;
	if (localJSON('Status', 'v', ['update']) == 0) {
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
	if (refresh) Animation('refresh', 'animated spin', false);
	
	if (localJSON('Config','v',['Duration_of_stream']) == 'Enable') {
		for (var i=0;i<TimersetToUpdate.length;i++) {
			InsertTimeHere = 'Stream_Duration_'+TimersetToUpdate[i];
			StreamDurationTime = 'Stream_Time_'+TimersetToUpdate[i];
			SubtractTimes = Math.floor((new Date() - new Date(FollowingList('v',TimersetToUpdate[i])[4])) / 1000);
			Days = Math.floor((SubtractTimes % 31536000) / 86400);
			Hours = Math.floor(((SubtractTimes % 31536000) % 86400) / 3600);
			Minutes = Math.floor((((SubtractTimes % 31536000) % 86400) % 3600) / 60);
			Seconds = (((SubtractTimes % 31536000) % 86400) % 3600) % 60;
			if (Days == 0) {Days = ''} else { if (Days < 10) {Days = '0'+Days+'d:'} else if (Days >= 10) {Days = Days+'d:'} };
			if (Hours == 0) {Hours = ''} else { if (Hours < 10) {Hours = '0'+Hours+'h:'} else if (Hours >= 10) {Hours = Hours+'h:'} };
			if (Minutes == 0) {Minutes = ''} else { if (Minutes < 10) {Minutes = '0'+Minutes+'m:'} else if (Minutes >= 10) {Minutes = Minutes+'m:'} };
			if (Seconds == 0) {Seconds = '00s'} else { if (Seconds < 10) {Seconds = '0'+Seconds+'s'} else if (Seconds >= 10) {Seconds = Seconds+'s'} };
			Time = Days + '' + Hours + '' + Minutes + '' + Seconds;
            if (doc(InsertTimeHere) && 'NaN'.indexOf(Time) == -1) doc(InsertTimeHere).innerHTML = Time;
		}
	} 

	if (localJSON('Config','v',['Timeout'])) {
		if (Math.abs(new Date(localJSON('Config','v',['Timeout']))) - Math.abs(new Date()) < 0) {
			localJSON('Config','c',['Closed','false']);
			donationUnit = "<a style='color:black;margin-left:45;font-size:19'>Don't forget support me by a donate ;)</a>";
			donationUnit += '<div style="text-align:right;margin:-23 184 0 0">';
			donationUnit += '<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">';
			donationUnit += '<input type="hidden" name="cmd" value="_s-xclick">';
			donationUnit += '<input type="hidden" name="hosted_button_id" value="PMS9N35GNTLNQ">';
			donationUnit += '<input type="image" id="PayPalCheckOut" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">';
			donationUnit += '<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">';
			donationUnit += '</form></div>';
			donationUnit += '<a style="color:black;position:absolute;margin:-41 0 0 627;font-size:15" id="CloseNews">[x]Close</a>';
			doc('News').innerHTML=donationUnit;
			doc('News').setAttribute('style','display:block;background:rgba(0,0,0,0.08);border-radius:25;margin:4 0 -19 0');
			doc('CloseNews').addEventListener('click',function(){
				doc('News').setAttribute('style','display:none');
				localJSON('Config','c',['Timeout',Math.abs(new Date())+5*24*60*60*1000]);
				_gaq.push(['_setCustomVar', 4, 'PayPalButton', 'false', 1]);
				localJSON('Config','c',['Closed','true'])
			});
			doc('PayPalCheckOut').addEventListener('click',function(){ _gaq.push(['_setCustomVar', 4, 'PayPalButton', 'true', 1]) })
		} else if (localJSON('Config','v',['Closed']) != 'true') {
			donationUnit = "<a style='color:black;margin-left:45;font-size:19'>Don't forget support me by a donate ;)</a>";
			donationUnit += '<div style="text-align:right;margin:-23 184 0 0">';
			donationUnit += '<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">';
			donationUnit += '<input type="hidden" name="cmd" value="_s-xclick">';
			donationUnit += '<input type="hidden" name="hosted_button_id" value="PMS9N35GNTLNQ">';
			donationUnit += '<input type="image" id="PayPalCheckOut" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">';
			donationUnit += '<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">';
			donationUnit += '</form></div>';
			donationUnit += '<a style="color:black;position:absolute;margin:-41 0 0 627;font-size:15" id="CloseNews">[x]Close</a>';
			doc('News').innerHTML=donationUnit;
			doc('News').setAttribute('style','display:block;background:rgba(0,0,0,0.08);border-radius:25;margin:4 0 -19 0');
			doc('CloseNews').addEventListener('click',function(){
				doc('News').setAttribute('style','display:none');
				localJSON('Config','c',['Timeout',Math.abs(new Date())+5*24*60*60*1000]);
				_gaq.push(['_setCustomVar', 4, 'PayPalButton', 'false', 1]);
				localJSON('Config','c',['Closed','true'])
			});
			doc('PayPalCheckOut').addEventListener('click',function(){ _gaq.push(['_setCustomVar', 4, 'PayPalButton', 'true', 1]) })
		}
	} else { localJSON('Config','c',['Timeout',new Date()]) }

	if (Math.abs(new Date(localJSON('Config','v',['Timeout']))) - Math.abs(new Date()) > Math.abs(new Date())+5*24*60*60*1000) localJSON('Config','c',['Timeout',0]);
	InsertOnlineList()
},1001)