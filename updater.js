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

	
	=====Structure of======
	localStorage['Code']
	{
		"Background": {
			"code": "code",
			"date": "Date",
			"hex": "hex",
			"version": "version",
			"version_geted": "version_geted"
		},
		"Popup": {
			"code": "code",	
			"date": "date",	
			"hex": "hex",
			"version": "version",
			"version_geted": "version_geted"},
			"insertFunc": {
				"code": "code",
				"date": "date",
				"hex": "hex",
				"version": "version",
				"version_geted": "version_geted"
			}
		}
	}

	=====Structure of======
	localStorage['Config']
	{
		"User_Name": "Guest",
		"Notifications": {
			"status": "Enable",
			"online": "Enable",
			"update": "Enable",
			"sound_status": "Enable",
			"sound": "DinDon"
		},
		"Duration_of_stream": "Enable",
		"Interval_of_Checking": "3"
	}

    =====Structure of======
	localStorage['Status']
	{
		"update": "0",
		"online": "2",
		"checked": "37",
		"ShowWaves": "true",
		"InsertOnlineList": "1"
	}
*/

$.getJSON('/manifest.json', function(data){localStorage['App_Version']=data.version});

// Export old formated setting

if (!localStorage['OldSetting']) {
	if (readCookie('UserName') != null) {
		console.error('Exporting old-format settings');
		Code = {"Background": {"code": "//code","date": "Date","hex": "hex","version": "0","version_geted": "0"},"Popup": {"code": "//code","date": "date",	"hex": "hex","version": "0","version_geted": "0"},"insertFunc": {"code": "//code","date": "date","hex": "hex","version": "0","version_geted": "0"}};
		Config = {"User_Name": "Guest","Notifications": {"status": "Enable","online": "Enable","update": "Enable","sound_status": "Enable","sound": "DinDon"},"Duration_of_stream": "Enable","Interval_of_Checking": "3"};
		Status = {"update": "0","online": "0","checked": "0","ShowWaves": "true","InsertOnlineList": "0"};
		Following = {"Following": "count","Stream": {"Name": "","Status": "","Title": "","Game": "","Time": "","Tumb": ""}};
		localStorage['Code'] = JSON.stringify(Code);
		localStorage['Config'] = JSON.stringify(Config);
		localStorage['Status'] = JSON.stringify(Status);
		localStorage['Following'] = JSON.stringify(Following);
		DeleteStream = [];
		if (localStorage['ChannelsCount']) {
			DeleteStream.length = localStorage['ChannelsCount'];
			RandomVariable = 0;
			$.each(DeleteStream, function(){
				delete localStorage['Stream_Name_'+RandomVariable];
				delete localStorage['Stream_Game_'+RandomVariable];
				delete localStorage['Stream_Tumb_'+RandomVariable];
				delete localStorage['Stream_Title_'+RandomVariable];
				delete localStorage['Stream_Status_'+RandomVariable];
				delete localStorage['Stream_Time_'+RandomVariable];
				delete localStorage['Stream_Viewers_'+RandomVariable];
				RandomVariable += 1 
			});
			delete localStorage['Stream_Name_'+localStorage['ChannelsCount']];
			delete localStorage['Stream_Game_'+localStorage['ChannelsCount']];
			delete localStorage['Stream_Tumb_'+localStorage['ChannelsCount']];
			delete localStorage['Stream_Title_'+localStorage['ChannelsCount']];
			delete localStorage['Stream_Status_'+localStorage['ChannelsCount']];
			delete localStorage['Stream_Time_'+localStorage['ChannelsCount']];
			delete localStorage['Stream_Viewers_'+localStorage['ChannelsCount']];
		}
		delete localStorage['Version_BackgroundJS'];
		delete localStorage['Version_BackgroundJS_Date'];
		delete localStorage['Version_BackgroundJS_Hex'];
		delete localStorage['Version_BackgroundJS_get'];
		delete localStorage['Version_PopupJS'];
		delete localStorage['Version_PopupJS_Date'];
		delete localStorage['Version_PopupJS_Hex'];
		delete localStorage['Version_PopupJS_get'];
		delete localStorage['Version_insertFuncJS'];
		delete localStorage['Version_insertFuncJS_Date'];
		delete localStorage['Version_insertFuncJS_Hex'];
		delete localStorage['code_Background'];
		delete localStorage['code_Popup'];
		delete localStorage['code_insertFunc'];
		delete localStorage['ChannelsCount'];
		delete localStorage['FollowingChannels'];
		delete localStorage['InsertOnlineList'];
		delete localStorage['NumberOfChecked'];
		delete localStorage['ShowWaves'];
		JSONparse = JSON.parse(localStorage['Config']);
		JSONparse.User_Name = readCookie('UserName');
		localStorage['Config'] = JSON.stringify(JSONparse);

		JSONparse.Notifications.status = readCookie('conf_Notify');
		localStorage['Config'] = JSON.stringify(JSONparse);

		JSONparse.Notifications.online = readCookie('conf_Notify_Online');
		localStorage['Config'] = JSON.stringify(JSONparse);

		JSONparse.Notifications.update = readCookie('conf_Notify_Update');
		localStorage['Config'] = JSON.stringify(JSONparse);

		JSONparse.Notifications.sound_status = readCookie('conf_Sound');
		localStorage['Config'] = JSON.stringify(JSONparse);

		JSONparse.Notifications.sound = readCookie('conf_Sound_Name')
		localStorage['Config'] = JSON.stringify(JSONparse);

		JSONparse.Duration_of_stream = readCookie('conf_StreamDuration');
		localStorage['Config'] = JSON.stringify(JSONparse);
		
		delCookie('conf_StreamDuration');
		delCookie('UserName');
		delCookie('conf_Sound_Name');
		delCookie('conf_Sound');
		delCookie('conf_Notify_Update');
		delCookie('conf_Notify_Online');
		delCookie('conf_Notify');

		localStorage['OldSetting'] = 'Exported';
		localStorage['SecondReload'] = 'True';
	} else {localStorage['OldSetting'] = 'Skipped';location.reload()}
} else {

Code = {"Background": {"code": "//code","date": "Date","hex": "hex","version": "0","version_geted": "0"},"Popup": {"code": "//code","date": "date",	"hex": "hex","version": "0","version_geted": "0"},"insertFunc": {"code": "//code","date": "date","hex": "hex","version": "0","version_geted": "0"}};
Config = {"User_Name": "Guest","Notifications": {"status": "Enable","online": "Enable","update": "Enable","sound_status": "Enable","sound": "DinDon"},"Duration_of_stream": "Enable","Interval_of_Checking": "3"};
Status = {"update": "0","online": "0","checked": "0","ShowWaves": "true","InsertOnlineList": "0"};
if (localStorage['Code'] == undefined) localStorage['Code'] = JSON.stringify(Code);
if (localStorage['Config'] == undefined) localStorage['Config'] = JSON.stringify(Config);
if (localStorage['Status'] == undefined) localStorage['Status'] = JSON.stringify(Status);

console.log('[UPDATER]: Start up');

acceptedVersions = {"background": "58", "popup": "68", "insertFunc": "96"};

function CheckForUpdates() {
	JSONparse = JSON.parse(localStorage['Code']);

	//Check app version
	console.log('[UPDATER]: Checking for update');
	var getVersions = $.ajax({url:'https://app.mcrozz.net/Twitch.tv_Notifier/Update.php?callback=Versions'});
	getVersions.complete(function(){
		ParsedVers = JSON.parse(getVersions.responseText);
		// Parse it and save
		sessionStorage['AppVersion'] = ParsedVers.AppVersion;
		sessionStorage['BackgroundJS'] = ParsedVers.BackgroundJS;
		sessionStorage['PopupJS'] = ParsedVers.PopupJS;
		sessionStorage['insertFuncJS'] = ParsedVers.insertFuncJS

		if (localStorage['App_Version'] == sessionStorage['AppVersion']) {
			//Update...
			if (Math.floor(JSON.parse(localStorage['Code']).Background.version) < Math.floor(sessionStorage['BackgroundJS'])) {
				JSONparse.Background.version = sessionStorage['BackgroundJS'];
				localStorage['Code'] = JSON.stringify(JSONparse);

				var getBackgroundDate = $.ajax({url:'https://app.mcrozz.net/Twitch.tv_Notifier/Update.php?callback=versionBackgroundDate'});
				getBackgroundDate.done(function(){
					JSONparse.Background.date = getBackgroundDate.responseText.replace(/\s/g, '');
					localStorage['Code'] = JSON.stringify(JSONparse);
				}); 
				getBackgroundDate.fail(function(){
					console.error("[UPDATER]: Can't get date of Background.js from server...")
				});
				var getBackgroundHex = $.ajax({url:'https://app.mcrozz.net/Twitch.tv_Notifier/Update.php?callback=versionBackgroundHex'});
				getBackgroundHex.done(function(){
					JSONparse.Background.hex = getBackgroundHex.responseText.replace(/\s/g, '');
					localStorage['Code'] = JSON.stringify(JSONparse);

					var getBackgroundCode = $.ajax({url:'https://app.mcrozz.net/Twitch.tv_Notifier/Background_code.php'});
					getBackgroundCode.done(function() { 
						JSONparse.Background.code = getBackgroundCode.responseText;
						localStorage['Code'] = JSON.stringify(JSONparse);
						console.log('[UPDATER]: Success update Background.js');
						SubtractTimes = Math.abs(new Date() - new Date(JSON.parse(localStorage['Code']).Background.date)) / 1000;
						SubtractTimes = Math.floor(SubtractTimes);
						Days = Math.floor((SubtractTimes % 31536000) / 86400);
						Hours = Math.floor(((SubtractTimes % 31536000) % 86400) / 3600);
						Minutes = Math.floor((((SubtractTimes % 31536000) % 86400) % 3600) / 60);
						Seconds = (((SubtractTimes % 31536000) % 86400) % 3600) % 60;
						if (Days == 0) {Days = ''} else { if (Days < 10) {Days = '0'+Days+'d:'} else if (Days >= 10) {Days = Days+'d:'} };
						if (Hours == 0) {Hours = ''} else { if (Hours < 10) {Hours = '0'+Hours+'h:'} else if (Hours >= 10) {Hours = Hours+'h:'} };
						if (Minutes == 0) {Minutes = ''} else { if (Minutes < 10) {Minutes = '0'+Minutes+'m'} else if (Minutes >= 10) {Minutes = Minutes+'m'} };
						LastEdit = Days+''+Hours+''+Minutes;
						notifyUser('Success update Background.js','Ver. '+JSON.parse(localStorage['Code']).Background.version+' (edited '+LastEdit+' ago)','ScriptUpdate');
						// Check Background.js sums
						if (hex_md5(JSON.parse(localStorage['Code']).Background.code) != JSON.parse(localStorage['Code']).Background.hex) {
							JSONparse.Background.version = '0';
							localStorage['Code'] = JSON.stringify(JSONparse);
							console.error('[UPDATER]: Background.js is broken, redownload...');
						}
						//
						localStorage['JustReload'] = '1'
					});
				});
			} else {
				console.log('[UPDATER]: Background.js is up to date...')
			}
			//Popup.js check...
			if (Math.floor(JSON.parse(localStorage['Code']).Popup.version) < Math.floor(sessionStorage['PopupJS'])) {
				JSONparse.Popup.version = sessionStorage['PopupJS'];
				localStorage['Code'] = JSON.stringify(JSONparse);

				var getPopupDate = $.ajax({url:'https://app.mcrozz.net/Twitch.tv_Notifier/Update.php?callback=versionPopupDate'});
				getPopupDate.done(function(){
					JSONparse.Popup.date = getPopupDate.responseText.replace(/\s/g, '');
					localStorage['Code'] = JSON.stringify(JSONparse);
				});
				getPopupDate.fail(function(){
					console.error("[UPDATER]: Can't get date of Popup.js from server...")
				});
				var getPopupHex = $.ajax({url:'https://app.mcrozz.net/Twitch.tv_Notifier/Update.php?callback=versionPopupHex'});
				getPopupHex.done(function(){
					JSONparse.Popup.hex = getPopupHex.responseText.replace(/\s/g, '');
					localStorage['Code'] = JSON.stringify(JSONparse);
					var getPopupCode = $.ajax({url:'https://app.mcrozz.net/Twitch.tv_Notifier/Popup_code.php'});
					getPopupCode.done(function() { 
						JSONparse.Popup.code = getPopupCode.responseText;
						localStorage['Code'] = JSON.stringify(JSONparse);
						console.log('[UPDATER]: Success update Popup.js');
						SubtractTimes = Math.abs(new Date() - new Date(JSON.parse(localStorage['Code']).Popup.date)) / 1000;
						SubtractTimes = Math.floor(SubtractTimes);
						Days = Math.floor((SubtractTimes % 31536000) / 86400);
						Hours = Math.floor(((SubtractTimes % 31536000) % 86400) / 3600);
						Minutes = Math.floor((((SubtractTimes % 31536000) % 86400) % 3600) / 60);
						Seconds = (((SubtractTimes % 31536000) % 86400) % 3600) % 60;
						if (Days == 0) {Days = ''} else { if (Days < 10) {Days = '0'+Days+'d:'} else if (Days >= 10) {Days = Days+'d:'} };
						if (Hours == 0) {Hours = ''} else { if (Hours < 10) {Hours = '0'+Hours+'h:'} else if (Hours >= 10) {Hours = Hours+'h:'} };
						if (Minutes == 0) {Minutes = ''} else { if (Minutes < 10) {Minutes = '0'+Minutes+'m'} else if (Minutes >= 10) {Minutes = Minutes+'m'} };
						LastEdit = Days+''+Hours+''+Minutes;
						notifyUser('Success update Popup.js','Ver. '+JSON.parse(localStorage['Code']).Popup.version+' (edited '+LastEdit+' ago)','ScriptUpdate');
						// Check Popup.js sums
						if (hex_md5(JSON.parse(localStorage['Code']).Popup.code) != JSON.parse(localStorage['Code']).Popup.hex) {
							JSONparse.Popup.version = '0';
							localStorage['Code'] = JSON.stringify(JSONparse);
							console.error('[UPDATER]: Popup.js is broken, redownload...');
						}
						//
						//localStorage['JustReload'] = '1'
					});
				});
			} else {
				console.log('[UPDATER]: Popup.js is up to date...')
			}
			//insertFunc.js check...
			if (Math.floor(JSON.parse(localStorage['Code']).insertFunc.version) < Math.floor(sessionStorage['insertFuncJS'])) {
				JSONparse.insertFunc.version = sessionStorage['insertFuncJS'];
				localStorage['Code'] = JSON.stringify(JSONparse);

				var getInsertFuncDate = $.ajax({url:'https://app.mcrozz.net/Twitch.tv_Notifier/Update.php?callback=versionInsertFuncDate'});
				getInsertFuncDate.done(function(){
					JSONparse.insertFunc.date = getInsertFuncDate.responseText.replace(/\s/g, '');
					localStorage['Code'] = JSON.stringify(JSONparse)
				});
				getInsertFuncDate.fail(function(){
					console.error("[UPDATER]: Can't get date of insertFunc.js from server...")
				});
				var getInsertFuncHex = $.ajax({url:'https://app.mcrozz.net/Twitch.tv_Notifier/Update.php?callback=versionInsertFuncHex'});
				getInsertFuncHex.done(function(){
					JSONparse.insertFunc.hex = getInsertFuncHex.responseText.replace(/\s/g, '');
					localStorage['Code'] = JSON.stringify(JSONparse);

					var getInsertFuncCode = $.ajax({url:'https://app.mcrozz.net/Twitch.tv_Notifier/insertFunc_code.php'});
					getInsertFuncCode.done(function() { 
						JSONparse.insertFunc.code = getInsertFuncCode.responseText;
						localStorage['Code'] = JSON.stringify(JSONparse);
						console.log('[UPDATER]: Success update insertFunc.js');
						SubtractTimes = Math.abs(new Date() - new Date(JSON.parse(localStorage['Code']).insertFunc.date)) / 1000;
						SubtractTimes = Math.floor(SubtractTimes);
						Days = Math.floor((SubtractTimes % 31536000) / 86400);
						Hours = Math.floor(((SubtractTimes % 31536000) % 86400) / 3600);
						Minutes = Math.floor((((SubtractTimes % 31536000) % 86400) % 3600) / 60);
						Seconds = (((SubtractTimes % 31536000) % 86400) % 3600) % 60;
						if (Days == 0) {Days = ''} else { if (Days < 10) {Days = '0'+Days+'d:'} else if (Days >= 10) {Days = Days+'d:'} };
						if (Hours == 0) {Hours = ''} else { if (Hours < 10) {Hours = '0'+Hours+'h:'} else if (Hours >= 10) {Hours = Hours+'h:'} };
						if (Minutes == 0) {Minutes = ''} else { if (Minutes < 10) {Minutes = '0'+Minutes+'m'} else if (Minutes >= 10) {Minutes = Minutes+'m'} };
						LastEdit = Days+''+Hours+''+Minutes;
						notifyUser('Success update insertFunc.js','Ver. '+JSON.parse(localStorage['Code']).insertFunc.version+' (edited '+LastEdit+' ago)','ScriptUpdate');
						// Check insertFunc.js sums
						if (hex_md5(JSON.parse(localStorage['Code']).insertFunc.code) != JSON.parse(localStorage['Code']).insertFunc.hex) {
							JSONparse.insertFunc.version = '0';
							localStorage['Code'] = JSON.stringify(JSONparse);
							console.error('[UPDATER]: insertFunc.js is broken, redownload...');
						}
						//
						//localStorage['JustReload'] = '1'
					});
				});
			} else {
				console.log('[UPDATER]: insertFunc.js is up to date...')
			}
		} else {
			console.error('[UPDATER]: Please update extension...')
		}
	});
	getVersions.fail(function(){
		if (Math.floor(JSONparse.Background.version) < Math.floor(acceptedVersions.Background)) {
			var getBackgroundCode = $.ajax({url:'./offline/Background_code.php'});
			getBackgroundCode.done(function() { 
				JSONparse.Background.code = getBackgroundCode.responseText;
				JSONparse.Background.version = acceptedVersions.Background;
				localStorage['Code'] = JSON.stringify(JSONparse);
				location.reload()
			});
		} if (Math.floor(JSONparse.Popup.version) < Math.floor(acceptedVersions.Popup)) {
			var getPopupCode = $.ajax({url:'./offline/Popup_code.php'});
			getPopupCode.done(function() { 
				JSONparse.Popup.code = getPopupCode.responseText;
				JSONparse.Popup.version = acceptedVersions.Popup;
				localStorage['Code'] = JSON.stringify(JSONparse);
			});
		} if (Math.floor(JSONparse.insertFunc.version) < Math.floor(acceptedVersions.insertFunc)) {
			var getInsertFuncCode = $.ajax({url:'./offline/insertFunc_code.php'});
			getInsertFuncCode.done(function() { 
				JSONparse.insertFunc.code = getInsertFuncCode.responseText;
				JSONparse.insertFunc.version = acceptedVersions.insertFunc;
				localStorage['Code'] = JSON.stringify(JSONparse);
			});
		}
	});
}

CheckForUpdates();
setInterval(CheckForUpdates,1000*60*10)
}