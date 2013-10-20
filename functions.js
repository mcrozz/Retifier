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
var NotificationsCount;

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

function localJSON(name,vars,values) {
	if (values == undefined && vars != undefined) {
		returnVal = JSON.parse(localStorage[name]);
		if (returnVal[vars] != undefined) { return returnVal[vars]; } else { return false; }
	} else if (values != undefined && vars != undefined) {
		returnVal = JSON.parse(localStorage[name]);
		returnVal[vars] = values;
		localStorage[name] = JSON.stringify(returnVal);
		return true;
	} else if (vars == undefined && values == undefined) {
		return JSON.parse(localStorage[name]);
	} else { return false; }
}
function createCookie(name,value,days){if(days){var date=new Date();date.setTime(date.getTime()+(days*24*60*60*1000));expires="; expires="+date.toGMTString();} else expires="";document.cookie=name+"="+value+expires+"; path=/";}
function readCookie(name){var nameEQ=name+"=";var ca=document.cookie.split(';');for(var i=0;i<ca.length;i++){var c=ca[i];while(c.charAt(0)==' ')c=c.substring(1,c.length);if(c.indexOf(nameEQ)==0) return c.substring(nameEQ.length,c.length);}return null;}
function delCookie(name){document.cookie=name+'=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'}
function BadgeOnlineCount(count){if(count=='0')chrome.browserAction.setBadgeText({text:String('')});else chrome.browserAction.setBadgeText({text:String(count)})};

function sendNotify(Title, msg, streamer, scriptUpd) {
	if (!scriptUpd) {
		console.error(new Date+' : '+Title+' -  '+msg);
		chrome.notifications.create(streamer,
			{type:"basic",title:Title,message:msg,iconUrl:"goesOnline.png",buttons:[{title:"Watch now!"}]},
		function(){})
		if (JSON.parse(localStorage['Config']).Notifications.sound_status == 'Enable') {
			Audio = document.createElement('audio');
			MusicName = '/Music/'+localJSON('Config').Notifications.sound+'.mp3';
			Audio.setAttribute('src', MusicName);
			Audio.setAttribute('autoplay', 'autoplay');
			Audio.play()
		}
	} else if (scriptUpd == 'Update') {
		console.error(new Date+' : '+Title+' -  '+msg);
		chrome.notifications.create(scriptUpd,
			{type:"basic",title:Title,message:msg,iconUrl:"goesOnlineUpd.png"},
		function(){sessionStorage['NtfcnTemp'] = scriptUpd});
		setTimeout(function(){chrome.notifications.clear(sessionStorage['NtfcnTemp'], function(){})},10*1000)
		if (JSON.parse(localStorage['Config']).Notifications.sound_status == 'Enable') {
			Audio = document.createElement('audio');
			MusicName = '/Music/'+localJSON('Config').Notifications.sound+'.mp3';
			Audio.setAttribute('src', MusicName);
			Audio.setAttribute('autoplay', 'autoplay');
			Audio.play()
		}
	}
}

chrome.notifications.onButtonClicked.addListener(function(notificationId){window.open('http://www.twitch.tv/'+notificationId)});
chrome.notifications.onClosed.addListener(function(notificationId){ chrome.notifications.clear(notificationId,function(){}) });
chrome.notifications.onClicked.addListener(function(notificationId){ chrome.notifications.clear(notificationId,function(){}) });

function notifyUser(streamerName, titleOfStream, type, streamer) {
	if (localJSON('Config').Notifications.status == 'Enable') {
		if (type == 'Online' && localJSON('Config').Notifications.online == 'Enable') {
			sendNotify(streamerName, titleOfStream, streamer);NotificationsCount+=1
		} if (type == 'Changed' && localJSON('Config').Notifications.update == 'Enable') {
			sendNotify(streamerName, titleOfStream, NotificationsCount);NotificationsCount+=1;
		} if (type == 'ScriptUpdate') {
			if (!sessionStorage['Disable_Update_Notifies'])
			sendNotify(streamerName, titleOfStream, streamerName, 'Update');NotificationsCount+=1
		}
	}
}

if ( Math.floor(localJSON('Code').Background.version) < Math.floor(localJSON('Code').Background.version_geted) ) {Background = 'Out dated'} else {Background = 'New'}
if ( Math.floor(localJSON('Code').Popup.version) < Math.floor(localJSON('Code').Background.version_geted) ) {Popup = 'Out dated'} else {Popup = 'New'}
if ( Math.floor(localJSON('Code').Background.version) < Math.floor(localJSON('Code').Background.version_geted) ) {insertFunc = 'Out dated'} else {insertFunc = 'New'}


var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-25472862-3']);
_gaq.push(['_setCustomVar', 3, 'App_Version', localStorage['App_Version'], 1]);
_gaq.push(['_setCustomVar', 2, 'BackgroundJS', localJSON('Code').Background.version, 1]);
_gaq.push(['_setCustomVar', 2, 'PopupJS', localJSON('Code').Popup.version, 1]);
_gaq.push(['_setCustomVar', 3, 'insertFuncJS', localJSON('Code').Background.version, 1]);
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