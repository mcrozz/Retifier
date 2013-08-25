/*
	@author Ivan 'MacRozz' Zarudny
*/

if (localStorage['Reload'] == undefined){localStorage['Reload']='false'}
setInterval(function(){

	if (localStorage['SecondReload'] == 'True') {
		setTimeout(location.reload, 3000);
		delete localStorage['SecondReload']}
	if (localStorage['JustReload'] == '1') {
		delete localStorage['JustReload'];
		setTimeout(window.location.reload.bind(window.location), 200)}
	if (localStorage['Reload'] != 'false') {
		setTimeout(window.location.reload.bind(window.location), 200)
		localStorage['Reload'] = 'false'
	}

},1000);

if (localStorage['Status'] != undefined && localStorage['Config'] != undefined) {

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		expires = "; expires="+date.toGMTString();
	}
	else expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function delCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function BadgeOnlineCount(count) {
	if (count == '0') {
		chrome.browserAction.setBadgeText({text: String('')})
	} else {
		chrome.browserAction.setBadgeText({text: String(count)})
	}
}
var NotificationVar = [];

function sendNotify(Title, msg, streamer, scriptUpd) {
	if (!scriptUpd) {
		console.error(new Date+' : '+Title+' -  '+msg);
		NotifyOpt = {
			type:"basic",
			title:Title,
			message:msg,
			iconUrl:"goesOnline.png",
			buttons: [{title:"Watch now!"}]
		};
		chrome.notifications.create(streamer,NotifyOpt,function(){});
		if (JSON.parse(localStorage['Config']).Notifications.sound_status == 'Enable') {
			Audio = document.createElement('audio');
			MusicName = '/Music/'+JSON.parse(localStorage['Config']).Notifications.sound+'.mp3';
			Audio.setAttribute('src', MusicName);
			Audio.setAttribute('autoplay', 'autoplay');
			Audio.play()
		}
	} else if (scriptUpd == 'Update') {
		console.error(new Date+' : '+Title+' -  '+msg);
		NotifyOpt = {
			type:"basic",
			title:Title,
			message:msg,
			iconUrl:"goesOnlineUpd.png",
		};
		chrome.notifications.create(scriptUpd,NotifyOpt,function(){});
		if (JSON.parse(localStorage['Config']).Notifications.sound_status == 'Enable') {
			Audio = document.createElement('audio');
			MusicName = '/Music/'+JSON.parse(localStorage['Config']).Notifications.sound+'.mp3';
			Audio.setAttribute('src', MusicName);
			Audio.setAttribute('autoplay', 'autoplay');
			Audio.play()
		}
	} else if (scriptUpd == 'UpdateStat') {
		console.error(new Date+' : '+Title+' -  '+msg);
		NotifyOpt = {
			type:"basic",
			title:Title,
			message:msg,
			iconUrl:"goesOnlineUpdStatus.png",
		};
		chrome.notifications.create(scriptUpd+Math.floor(Math.random()*10),NotifyOpt,function(){});
		if (JSON.parse(localStorage['Config']).Notifications.sound_status == 'Enable') {
			Audio = document.createElement('audio');
			MusicName = '/Music/'+JSON.parse(localStorage['Config']).Notifications.sound+'.mp3';
			Audio.setAttribute('src', MusicName);
			Audio.setAttribute('autoplay', 'autoplay');
			Audio.play()
		}
	}
}

chrome.notifications.onButtonClicked.addListener(function(notificationId){window.open('http://www.twitch.tv/'+notificationId)})

function notifyUser(streamerName, titleOfStream, type, streamer) {
	if (JSON.parse(localStorage['Config']).Notifications.status == 'Enable') {
		if (type == 'Update') {
			if (JSON.parse(localStorage['Config']).Notifications.update == 'Enable') {
				sendNotify(streamerName, titleOfStream, streamer, 'UpdateStat')
			} else if (JSON.parse(localStorage['Config']).Notifications.update == 'Enable' && JSON.parse(localStorage['Config']).Notifications.status == 'Enable') {
				sendNotify(streamerName, titleOfStream, streamer, 'UpdateStat')
			}
		} if (type == 'Online') {
			if (JSON.parse(localStorage['Config']).Notifications.online == 'Enable') {
				sendNotify(streamerName, titleOfStream, streamer)
			} else if (JSON.parse(localStorage['Config']).Notifications.online == 'Enable' && JSON.parse(localStorage['Config']).Notifications.status == 'Enable') {
				sendNotify(streamerName, titleOfStream, streamer)
			}
		} if (type == 'ScriptUpdate') {
			sendNotify(streamerName, titleOfStream, streamerName, 'Update')
		}
	}
}

function AppVersion(type, ver) {
	if (type == 'Version') {
		VersionUnit = 'ver. ';
		VersionUnit += localStorage['App_Version'];
		VersionUnit += ' (changes)';
		
		document.getElementById('AppVersionClick').innerHTML = VersionUnit
	}
}

if ( Math.floor(JSON.parse(localStorage['Code']).Background.version) < Math.floor(JSON.parse(localStorage['Code']).Background.version_geted) ) {Background = 'Out dated'} else {Background = 'New'}
if ( Math.floor(JSON.parse(localStorage['Code']).Popup.version) < Math.floor(JSON.parse(localStorage['Code']).Background.version_geted) ) {Popup = 'Out dated'} else {Popup = 'New'}
if ( Math.floor(JSON.parse(localStorage['Code']).Background.version) < Math.floor(JSON.parse(localStorage['Code']).Background.version_geted) ) {insertFunc = 'Out dated'} else {insertFunc = 'New'}


var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-25472862-3']);
_gaq.push(['_setCustomVar', 3, 'App_Version', localStorage['App_Version'], 1]);
_gaq.push(['_setCustomVar', 2, 'BackgroundJS', JSON.parse(localStorage['Code']).Background.version, 1]);
_gaq.push(['_setCustomVar', 2, 'PopupJS', JSON.parse(localStorage['Code']).Popup.version, 1]);
_gaq.push(['_setCustomVar', 3, 'insertFuncJS', JSON.parse(localStorage['Code']).Background.version, 1]);
_gaq.push(['_trackPageview']);
_gaq.push(['_trackEvent', 'App Version', localStorage['App_Version']]);
_gaq.push(['_trackEvent', 'BackgroundJS version', Background]);
_gaq.push(['_trackEvent', 'PopupJS version', Popup]);
_gaq.push(['_trackEvent', 'insertFuncJS version', insertFunc]);

(function() {
	var ga = document.createElement('script'); 
	ga.type = 'text/javascript'; 
	ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
}