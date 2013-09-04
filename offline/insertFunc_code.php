/*
	Copyright 2013 Ivan 'MacRozz' Zarudny

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

function InsertOnlineList() {
	var CountOfChannels = [];
	CountOfRetryEach = 0;
	if (localJSON('Status','checked')) {
		CountOfChannels.length = localStorage['Following']
	} else { CountOfChannels.length = 0 }
	
	$.each(CountOfChannels, function() {
		StreamTitle = localStorage['Stream_Title_'+CountOfRetryEach];
		StreamerName = localStorage['Stream_Name_'+CountOfRetryEach];
		StreamGame = localStorage['Stream_Game_'+CountOfRetryEach];
		
		if (TimersetToUpdate.indexOf(CountOfRetryEach) < 0) {
			if (localStorage['Stream_Status_'+CountOfRetryEach] == 'Online') {
				StreamListUnit = '<div class="content" id="'+CountOfRetryEach+'">';
				StreamListUnit += '<div class="tumblr">';
				StreamListUnit += '<img target="_blank" width="320px" height="200px" id="stream_img_'+CountOfRetryEach+'"></img>';
				StreamListUnit += '<img target="_blank" width="40px" height="56px" id="stream_game_img_'+CountOfRetryEach+'"></img>';
				StreamListUnit += '</div>';
				StreamListUnit += '<div class="information">';
				StreamListUnit += '<div class="title">';
				StreamListUnit += '<p class="pTitle">Title</p>';
				StreamListUnit += '<div class="informationTextTitle" data-title="'+StreamTitle+'" id="Title_'+CountOfRetryEach+'"">';
				if (StreamTitle.length >= 29) {
					CountToCut = StreamTitle.length - 29;
					StreamListUnit += StreamTitle.substring (0, StreamTitle.length - CountToCut)+'...';
				} else { StreamListUnit += StreamTitle }
				StreamListUnit += '</div>';
				StreamListUnit += '</div>';
				StreamListUnit += '<div class="streamer">';
				StreamListUnit += '<p class="pStreamer">Streamer</p>';
				StreamListUnit += '<a class="informationTextStreamer" target="_blank" href="http://www.twitch.tv/'+StreamerName+'">';
				StreamListUnit += StreamerName;
				StreamListUnit += '</a>';
				StreamListUnit += '</div>';
				StreamListUnit += '<div class="viewers">';
				StreamListUnit += '<p class="pViewers">Viewers</p>';
				StreamListUnit += '<div class="informationTextViewers" id="Viewers_'+CountOfRetryEach+'">';
				StreamListUnit += localStorage['Stream_Viewers_'+CountOfRetryEach];
				StreamListUnit += '</div>';
				StreamListUnit += '</div>';
				StreamListUnit += '<div class="gamename">';
				StreamListUnit += '<p class="pGamename">Game</p>';
				StreamListUnit += '<a class="informationTextGame" target="_blank" id="stream_game_'+CountOfRetryEach+'">';
				if (StreamGame.length >= 29) {
					CountToCut = StreamGame.length - 29;
					StreamListUnit += StreamGame.substring (0, StreamGame.length - CountToCut)+'...'
				} else { StreamListUnit += StreamGame }
				StreamListUnit += '</a>';
				StreamListUnit += '</div>';
				StreamListUnit += '<div class="StreamOnChannelPage">';
				StreamListUnit += '<div style="width:150;height:40;display:inline">';
				StreamListUnit += '<button type="button" name="Go to a stream page" class="button">';
				StreamListUnit += '<a href="http://www.twitch.tv/'+StreamerName+'"class="aStreamOnChannelPage" target="_blank">';
				StreamListUnit += 'Channel page';
				StreamListUnit += '</a>';
				StreamListUnit += '</button></div>';
				StreamListUnit += '<div style="width:170;height:40;display:inline;text-align:right;margin-left:18">';
				StreamListUnit += '<a id="Stream_Duration_'+CountOfRetryEach+'" class="StreamDuration">';
				StreamListUnit += '</a>';
				StreamListUnit += '</div>';
				StreamListUnit += '</div>';
				StreamListUnit += '</div>';
				StreamListUnit += '</div>';
				
				document.getElementById('insertContentHere').innerHTML += StreamListUnit;
				if (FirstLoadInsertFunc != 1) {$('#'+CountOfRetryEach).addClass('animated fadeIn')}				
				TimersetToUpdate.push(CountOfRetryEach);

				document.getElementById('stream_game_'+CountOfRetryEach).href = 'http://www.twitch.tv/directory/game/'+StreamGame;
				document.getElementById('stream_game_img_'+CountOfRetryEach).setAttribute('style','background:url("http://static-cdn.jtvnw.net/ttv-boxart/'+StreamGame+'.jpg");background-size:40;z-index:1;position:absolute;margin:142 0 0 -42');
				
				InsrtImg = 'stream_img_'+CountOfRetryEach;
				if (localStorage['Stream_Tumb_'+CountOfRetryEach] != 'null') {
					tumbURL = localStorage['Stream_Tumb_'+CountOfRetryEach];
					document.getElementById(InsrtImg).setAttribute('style','background:url('+tumbURL+')');
					document.getElementById(InsrtImg).href = 'http://www.twitch.tv/'+StreamerName
				} else {
					tumbURL = 'https://app.mcrozz.net/Twitch.tv_Notifier/none.png';
					document.getElementById(InsrtImg).setAttribute('style','background:url('+tumbURL+')');
					document.getElementById(InsrtImg).href = 'http://www.twitch.tv/'+StreamerName}	
				
			}
		} else if (TimersetToUpdate.indexOf(CountOfRetryEach) >= 0) {
			if (localStorage['Stream_Status_'+CountOfRetryEach] == 'Offline') {
				document.getElementById(CountOfRetryEach).remove()
			}

			StreamTitle = localStorage['Stream_Title_'+CountOfRetryEach];
			if (StreamTitle.length >= 29) {
				CountToCut = StreamTitle.length - 29;
				document.getElementById('Title_'+CountOfRetryEach).innerHTML = StreamTitle.substring (0, StreamTitle.length - CountToCut)+'...';
			} else {
				document.getElementById('Title_'+CountOfRetryEach).innerHTML = StreamTitle
			}
			document.getElementById('Viewers_'+CountOfRetryEach).innerHTML=localStorage['Stream_Viewers_'+CountOfRetryEach];
			document.getElementById('stream_img_'+CountOfRetryEach).innerHTML=localStorage['Stream_Tumb_'+CountOfRetryEach]
		}

		if (localJSON('Status','online') == '0' && localJSON('Status','update') == '0') {
			localJSON('Status','ShowWaves','true');
			document.getElementById('insertContentHere').innerHTML='<a style="color:black">No one online right now :(</a>'
		} else { localJSON('Status','ShowWaves','false') }
		CountOfRetryEach += 1
	})
}

setInterval(function(){
	FrstInsrt = localJSON('Status');
	if (!sessionStorage['FirstStartPopup']) {
		FrstInsrt.InsertOnlineList = '0';
		localStorage['Status'] = JSON.stringify(FrstInsrt);
		sessionStorage['FirstStartPopup'] = true;
		document.getElementById('insertContentHere').innerHTML = null;
		InsertOnlineList()
	} else if (sessionStorage['FirstStartPopup'] == 'true') {
		if (FrstInsrt.InsertOnlineList == '1') {
			InsertOnlineList();
			FrstInsrt.InsertOnlineList = '0';
			localStorage['Status'] = JSON.stringify(FrstInsrt)
		}
	}
}, 1000);

setInterval(function(){
	/*
	StatusUpdate : 
	
	-0 - Not updating, finished
	-1 - Timer ended, start update
	-2 - Update list of followed channels
	-3 - List of followed channels updated
	-4 - Checking online channel
	-5 - Error
	-6 - Name doesn't set up!
	-7 - First start

	*/
	if (localJSON('Status','update') == '0') {
		insertText('Now online '+localJSON('Status','online')+' from '+localJSON('Following'),'FollowedChannelsOnline');
		progressBar('Disable')
	} else if (localJSON('Status','update') == '1') {
		insertText('Behold! Update!','FollowedChannelsOnline');
		progressBar('Enable')
	} else if (localJSON('Status','update') == '2') { 
		insertText('Updating list of followed channels...','FollowedChannelsOnline');
		progressBar('Enable')
	} else if (localJSON('Status','update') == '3') { 
		insertText('List of followed channels updated.','FollowedChannelsOnline');
		progressBar('Enable')
	} else if (localJSON('Status','update') == '4') { 
		insertText('Checking, online '+localJSON('Status','online')+' from '+localJSON('Following'),'FollowedChannelsOnline');
		progressBar('Enable')
	} else if (localJSON('Status','update') == '5') { 
		insertText('App had a problem with update','FollowedChannelsOnline')
	} else if (localJSON('Status','update') == '6') { 
		insertText("Name doesn't set up yet!",'FollowedChannelsOnline')
	}
}, 100);

setInterval(function(){
	if (localJSON('Config','Duration_of_stream') == 'Enable') {
		number = 0;
		$.each(TimersetToUpdate, function() {
			InsertTimeHere = 'Stream_Duration_'+TimersetToUpdate[number];
			StreamDurationTime = 'Stream_Time_'+TimersetToUpdate[number];
			// POWER OF MATH
			SubtractTimes = Math.abs(new Date() - new Date(localStorage[StreamDurationTime])) / 1000;
			SubtractTimes = Math.floor(SubtractTimes);
			Days = Math.floor((SubtractTimes % 31536000) / 86400);
			Hours = Math.floor(((SubtractTimes % 31536000) % 86400) / 3600);
			Minutes = Math.floor((((SubtractTimes % 31536000) % 86400) % 3600) / 60);
			Seconds = (((SubtractTimes % 31536000) % 86400) % 3600) % 60;
			if (Days == 0) {Days = ''} else { if (Days < 10) {Days = '0'+Days+'d:'} else if (Days >= 10) {Days = Days+'d:'} };
			if (Hours == 0) {Hours = ''} else { if (Hours < 10) {Hours = '0'+Hours+'h:'} else if (Hours >= 10) {Hours = Hours+'h:'} };
			if (Minutes == 0) {Minutes = ''} else { if (Minutes < 10) {Minutes = '0'+Minutes+'m:'} else if (Minutes >= 10) {Minutes = Minutes+'m:'} };
			if (Seconds == 0) {Seconds = '00s'} else { if (Seconds < 10) {Seconds = '0'+Seconds+'s'} else if (Seconds >= 10) {Seconds = Seconds+'s'} };
			Time = Days+''+Hours+''+Minutes+''+Seconds;
			if (document.getElementById(InsertTimeHere)) {document.getElementById(InsertTimeHere).innerHTML = Time};
			number += 1
			if (number-1 == TimersetToUpdate.length) {number = 0}
		})
	} 

	if (localJSON('Config','Timeout')) {
		if (Math.abs(new Date(localJSON('Config','Timeout'))) - Math.abs(new Date()) < 0) {
			localJSON('Config','Closed',false);
			donationUnit = "<a style='color:black;margin-left:45'>Don't forget support me by a donate ;)</a>";
			donationUnit += '<div style="text-align:right;margin:-23 184 0 0">';
			donationUnit += '<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">';
			donationUnit += '<input type="hidden" name="cmd" value="_s-xclick">';
			donationUnit += '<input type="hidden" name="hosted_button_id" value="PMS9N35GNTLNQ">';
			donationUnit += '<input type="image" id="PayPalCheckOut" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">';
			donationUnit += '<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">';
			donationUnit += '</form></div>';
			donationUnit += '<a style="color:black;position:absolute;margin:-41 0 0 627;font-size:15" id="CloseNews">[x]Close</a>';
			document.getElementById('News').innerHTML=donationUnit;
			document.getElementById('News').setAttribute('style','display:block;background:rgba(0,0,0,0.08);border-radius:25;margin:4 0 -19 0');
			document.getElementById('CloseNews').addEventListener('click',function(){
				document.getElementById('News').setAttribute('style','display:none');
				localJSON('Config','Timeout',Math.abs(new Date())+5*24*60*60*1000);
				_gaq.push(['_setCustomVar', 4, 'PayPalButton', 'false', 1]);
				localJSON('Config','Closed',true)
			});
			document.getElementById('PayPalCheckOut').addEventListener('click',function(){ _gaq.push(['_setCustomVar', 4, 'PayPalButton', 'true', 1]) })
		} else if (!localJSON('Config','Closed')) {
			donationUnit = "<a style='color:black;margin-left:45'>Don't forget support me by a donate ;)</a>";
			donationUnit += '<div style="text-align:right;margin:-23 184 0 0">';
			donationUnit += '<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">';
			donationUnit += '<input type="hidden" name="cmd" value="_s-xclick">';
			donationUnit += '<input type="hidden" name="hosted_button_id" value="PMS9N35GNTLNQ">';
			donationUnit += '<input type="image" id="PayPalCheckOut" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">';
			donationUnit += '<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">';
			donationUnit += '</form></div>';
			donationUnit += '<a style="color:black;position:absolute;margin:-41 0 0 627;font-size:15" id="CloseNews">[x]Close</a>';
			document.getElementById('News').innerHTML=donationUnit;
			document.getElementById('News').setAttribute('style','display:block;background:rgba(0,0,0,0.08);border-radius:25;margin:4 0 -19 0');
			document.getElementById('CloseNews').addEventListener('click',function(){
				document.getElementById('News').setAttribute('style','display:none');
				localJSON('Config','Timeout',Math.abs(new Date())+5*24*60*60*1000);
				_gaq.push(['_setCustomVar', 4, 'PayPalButton', 'false', 1]);
				localJSON('Config','Closed',true)
			});
			document.getElementById('PayPalCheckOut').addEventListener('click',function(){ _gaq.push(['_setCustomVar', 4, 'PayPalButton', 'true', 1]) })
		}
	} else { localJSON('Config','Timeout',new Date()) }
},1000);

setInterval(function(){
	if (localJSON('Status','ShowWaves') == 'true') {
		document.getElementById('NoOneOnline').setAttribute('style', 'display:block')
	} else if (localJSON('Status','ShowWaves') == 'false') {
		document.getElementById('NoOneOnline').setAttribute('style', 'display:none')
	}
},100);