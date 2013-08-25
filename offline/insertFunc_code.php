/*
	@author Ivan 'MacRozz' Zarudny
*/

JSONstatus = JSON.parse(localStorage['Status']);
JSONconfig = JSON.parse(localStorage['Config']);

FirstLoadInsertFunc = 1;

function insertOnlineListFunc(content,idToInsert) {
	InsertText = document.getElementById(idToInsert).innerHTML;
	InsertText += content;
	document.getElementById(idToInsert).innerHTML = InsertText;
}

function InsertOnlineList() {
	TimersetToUpdate = [];
	var CountOfChannels = [];
	CountOfRetryEach = 0;
	if (JSONstatus.checked) {
		CountOfChannels.length = localStorage['Following']
	} else {
		CountOfChannels.length = null
	}
	if (document.getElementById('insertContentHere')) {
		document.getElementById('insertContentHere').innerHTML = null
	}
	
	localStorage['Status'] = JSON.stringify(JSONstatus);
	
	$.each(CountOfChannels, function() {
	setTimeout(function(){
		StreamTitle = localStorage['Stream_Title_'+CountOfRetryEach];
		StreamerName = localStorage['Stream_Name_'+CountOfRetryEach];
		StreamGame = localStorage['Stream_Game_'+CountOfRetryEach];
	
		if (localStorage['Stream_Status_'+CountOfRetryEach] == 'Online') {	
			StreamListUnit = '<div class="content">';
			StreamListUnit += '<div class="tumblr">';
			StreamListUnit += '<img target="_blank" id="stream_img_';
			StreamListUnit += CountOfRetryEach;
			StreamListUnit += '" height="200px" width="320px" scr=""';
			StreamListUnit += '</img>';
			StreamListUnit += '</div>';
			StreamListUnit += '<div class="information">';
			StreamListUnit += '<div class="title">';
			StreamListUnit += '<p class="pTitle">Title</p>';
			StreamListUnit += '<div class="informationTextTitle">';
			if (StreamTitle.length >= 29) {
				CountToCut = StreamTitle.length - 29;
				StreamListUnit += StreamTitle.substring (0, StreamTitle.length - CountToCut);
				StreamListUnit += '...';
			} else {
				StreamListUnit += StreamTitle;
			}
			StreamListUnit += '</div>';
			StreamListUnit += '</div>';
			StreamListUnit += '<div class="streamer">';
			StreamListUnit += '<p class="pStreamer">Streamer</p>';
			StreamListUnit += '<a class="informationTextStreamer" target="_blank" href="http://www.twitch.tv/';
			StreamListUnit += StreamerName;
			StreamListUnit += '">';
			StreamListUnit += StreamerName;
			StreamListUnit += '</a>';
			StreamListUnit += '</div>';
			StreamListUnit += '<div class="viewers">';
			StreamListUnit += '<p class="pViewers">Viewers</p>';
			StreamListUnit += '<div class="informationTextViewers">';
			StreamListUnit += localStorage['Stream_Viewers_'+CountOfRetryEach];
			StreamListUnit += '</div>';
			StreamListUnit += '</div>';
			StreamListUnit += '<div class="gamename">';
			StreamListUnit += '<p class="pGamename">Game</p>';
			StreamListUnit += '<a class="informationTextGame" target="_blank" id="stream_game_'
			StreamListUnit += CountOfRetryEach;
			StreamListUnit += '">';
			if (StreamGame.length >= 29) {
				CountToCut = StreamGame.length - 29;
				StreamListUnit += StreamGame.substring (0, StreamGame.length - CountToCut);
				StreamListUnit += '...';
			} else {
				StreamListUnit += StreamGame;
			}
			StreamListUnit += '</a>';
			StreamListUnit += '</div>';
			StreamListUnit += '<div class="StreamOnChannelPage">';
			StreamListUnit += '<div style="width:150;height:40;display:inline">';
			StreamListUnit += '<button type="button" name="Go to a stream page" class="button">';
			StreamListUnit += '<a href="http://www.twitch.tv/'
			StreamListUnit += StreamerName;
			StreamListUnit += '"class="aStreamOnChannelPage" target="_blank">';
			StreamListUnit += 'Channel page';
			StreamListUnit += '</a>';
			StreamListUnit += '</button></div>';
			StreamListUnit += '<div style="width:170;height:40;display:inline;text-align:right;margin-left:18">';
			StreamListUnit += '<a id="Stream_Duration_';
			StreamListUnit += CountOfRetryEach;
			StreamListUnit += '" class="StreamDuration">';
			StreamListUnit += '</a>';
			StreamListUnit += '</div>';
			StreamListUnit += '</div>';
			StreamListUnit += '</div>';
			StreamListUnit += '</div>';

			if (JSON.parse(localStorage['Status']).online == '0') {
				JSONstatus.ShowWaves = 'true';
				localStorage['Status'] = JSON.stringify(JSONstatus);
			} else { 
				JSONstatus.ShowWaves = 'false';
				localStorage['Status'] = JSON.stringify(JSONstatus);
			}

			TimersetToUpdate.push(CountOfRetryEach);
			
			insertOnlineListFunc(StreamListUnit,'insertContentHere');
			
			ElementIdIs = 'stream_img_';
			ElementIdIs += CountOfRetryEach;
			if (localStorage['Stream_Tumb_'+CountOfRetryEach] != 'null') {
				tumbURL = localStorage['Stream_Tumb_'+CountOfRetryEach];
				document.getElementById(ElementIdIs).setAttribute('style','background:url('+tumbURL+')')
			} else {
				tumbURL = 'https://app.mcrozz.net/Twitch.tv_Notifier/none.png';
				document.getElementById(ElementIdIs).setAttribute('style','background:url('+tumbURL+')')
			}			
			
			document.getElementById(ElementIdIs).href = 'http://www.twitch.tv/'+StreamerName;
			
			ElementIdIs2 = 'stream_game_';
			ElementIdIs2 += CountOfRetryEach;
			document.getElementById(ElementIdIs2).href = 'http://www.twitch.tv/directory/game/'+StreamGame;
		} if (CountOfRetryEach == Math.floor(JSONstatus.checked)) {
			console.log('Insert Online List finished!')
		}
		CountOfRetryEach += 1;
	},1);
	} );
}

InsertOnlineList();

setInterval(function(){
	JSONstatus = JSON.parse(localStorage['Status']);
	if (FirstLoadInsertFunc == 1) {
		JSONstatus.InsertOnlineList = '0';
		localStorage['Status'] = JSON.stringify(JSONstatus);
		FirstLoadInsertFunc = 0
	} else if (FirstLoadInsertFunc == 0) {
		if (JSONstatus.InsertOnlineList == '1') {
			InsertOnlineList();
			JSONstatus.InsertOnlineList = '0';
			localStorage['Status'] = JSON.stringify(JSONstatus)
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
	-4 - Checking online channel or not
	-5 - Error
	-6 - Name doesn't set up!
	-7 - First start

	*/
	JSONstatus2 = JSON.parse(localStorage['Status']);
	if (JSONstatus2.update == '0') {
		insertText('Now online '+JSON.parse(localStorage['Status']).online+' from '+localStorage['Following'],'FollowedChannelsOnline');
		progressBar('Disable')
	} else if (JSONstatus2.update == '1') {
		insertText('Behold! Update!','FollowedChannelsOnline');
		progressBar('Enable')
	} else if (JSONstatus2.update == '2') { 
		insertText('Updating list of followed channels...','FollowedChannelsOnline');
		progressBar('Enable')
	} else if (JSONstatus2.update == '3') { 
		insertText('List of followed channels updated.','FollowedChannelsOnline');
		progressBar('Enable')
	} else if (JSONstatus2.update == '4') { 
		insertText('Now online '+JSON.parse(localStorage['Status']).online+' from '+localStorage['Following'],'FollowedChannelsOnline');
		progressBar('Enable')
	} else if (JSONstatus2.update == '5') { 
		insertText('App had a problem with update','FollowedChannelsOnline')
	} else if (JSONstatus2.update == '6') { 
		insertText("Name doesn't set up yet!",'FollowedChannelsOnline')
	}
}, 100);

setInterval(function(){
	if (JSONconfig.Duration_of_stream == 'Enable') {
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
},1000);

setInterval(function(){
	JSONstatus3 = JSON.parse(localStorage['Status']);
	if (JSONstatus3.ShowWaves == 'true') {
		document.getElementById('NoOneOnline').setAttribute('style', 'display:block')
	} else if (JSONstatus3.ShowWaves == 'false') {
		document.getElementById('NoOneOnline').setAttribute('style', 'display:none')
	}
},100);