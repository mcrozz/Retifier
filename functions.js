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
var NotificationsCount=0;

if (localStorage['Status']&&localStorage['Config']) {

function localJSON(name,type,arrayz) {
	if (name&&type=='c'&&arrayz) {
		sz = arrayz.length;
		b = JSON.parse(localStorage[name]);
		if (sz == 2) {
			b[arrayz[0]]=arrayz[1];
			if (localStorage[name]=JSON.stringify(b)) {return true;} else {return false;}	
		} else if (sz == 3) {
			h = b[arrayz[0]];
			h[arrayz[1]] = arrayz[2];
			b[arrayz[0]] = h;
			if (localStorage[name]=JSON.stringify(b)) {return true;} else {return false;}		
		} else {return false;}
	} else if (name&&type=='v'&&arrayz) {
		b = JSON.parse(localStorage[name]);
		if (arrayz.length == 1){			
			if (b[arrayz[0]]) {return b[arrayz[0]];} else {return false;}
		} else if (arrayz.length == 2) {
			f = b[arrayz[0]];
			if (f[arrayz[1]]) {return f[arrayz[1]];} else {return false;}
		} else {return false;}
	} else if (name&&!type&&!arrayz) {
		return JSON.parse(localStorage[name]);
	} else {return false;console.error('[ERROR]: Wrong input in localJSON function!')}
}

function NotifierStrg(ids,cmd,time,strm) {
	b = JSON.parse(sessionStorage['Notifications']);
	if (ids&&cmd==''&&time&&strm) {
		b[ids]={};
		z=b[ids];
		z['Date']=time;
		z['Del']=false;
		z['Streamer']=strm;
		if (sessionStorage['Notifications']=JSON.stringify(b)) {return true;}else{return false;}
	} else if (ids&&cmd=='ch') {
		if (b[ids]!=null) {
			return [b[ids]['Date'],b[ids]['Del'],b[ids]['Streamer']];
		} else {console.debug('Check failed, id is '+ids)}
	} else if (ids&&cmd) {
		if (b[ids]!=null) {
			z=b[ids];
			z['Del']=cmd;
			if (sessionStorage['Notifications']=JSON.stringify(b)) {return true;}else{return false;}
		} else {console.debug('Failed to change id: '+ids+'. Cmd is '+cmd)}
	} else {return 'Nope :|';console.error('[ERROR]: Wrong input in NotifierStrg function!')}
}

/*
{
	"id from 0 to number of following":
		{
			"Name": "NAME",
			"Stream": 
				{
					"Title": "TITLE",
					"Game": "",
					"Viewers": "",
					"Time": ""
				}
		}
}
*/
if (localStorage['FollowingList']==undefined) {localStorage['FollowingList']='{}'};
function FollowingList(type,id,name,stream) {
	b = JSON.parse(localStorage['FollowingList']);
	if (type == 'add') {
		b[id]={};
		z=b[id];
		z['Name']=name;
		z['Stream']=false;
		if (localStorage['FollowingList']=JSON.stringify(b)) {return true;} else {return false;}
	} else if (type == 'c') {
		z=b[id];
		if (stream) {
			z['Stream']={};
			x=z['Stream'];
			x['Title']=stream[0];
			x['Game']=stream[1];
			x['Viewers']=stream[2];
			x['Time']=stream[3]
		} else { z['Stream']=false }
		if (localStorage['FollowingList']=JSON.stringify(b)) {return true;} else {return false;}
	} else if (type == 'v') {
		z=b[id];
		if (!z['Stream']) { return [ z['Name'] ];
		} else {
			return [ z['Name'], z['Stream']['Title'], z['Stream']['Game'], z['Stream']['Viewers'], z['Stream']['Time'] ];
		}
	}
}

function doc(id){return document.getElementById(id);}
function BadgeOnlineCount(count){if(count==0)chrome.browserAction.setBadgeText({text:String('')});else chrome.browserAction.setBadgeText({text:String(count)})}

function sendNotify(Title, msg, streamer, scriptUpd) {
	console.debug(new Date+': '+Title+' -  '+msg);
	NotifyConf = {type:"basic",title:Title,message:msg,iconUrl:"goesOnline.png"};
	if (!scriptUpd) {NotifyConf['buttons']=[{title:"Watch now!"}]};
	chrome.notifications.create(streamer,NotifyConf,function(){});
	if (localJSON('Config','v',['Notifications','sound_status']) == 'Enable') {
		Audio = document.createElement('audio');
		MusicName = '/Music/'+localJSON('Config','v',['Notifications','sound'])+'.mp3';
		Audio.setAttribute('src', MusicName);
		Audio.setAttribute('autoplay', 'autoplay');
		Audio.play()
	}
}

function notifyUser(streamerName, titleOfStream, type, streamer) {
	if (localJSON('Config','v',['Notifications','status'])) {
		date = new Date();
		if (type == 'Online' && localJSON('Config','v',['Notifications','online'])) {
			sendNotify(streamerName, titleOfStream, 'nf'+NotificationsCount);
			NotifierStrg('nf'+NotificationsCount,'',new Date().setHours(new Date().getHours()+1),streamer);
			NotificationsCount++;
		} else if (type == 'Changed' && localJSON('Config','v',['Notifications','update'])) {
			sendNotify(streamerName, titleOfStream, 'nf'+NotificationsCount);
			NotifierStrg('nf'+NotificationsCount,'',new Date().setSeconds(new Date().getSeconds()+15),streamer);
			NotificationsCount++;
		} else if (type == 'ScriptUpdate') {
			if (!sessionStorage['Disable_Update_Notifies'])
			sendNotify(streamerName, titleOfStream, 'nf'+NotificationsCount, 'Update');
			NotifierStrg('nf'+NotificationsCount,'',new Date().setSeconds(new Date().getSeconds()+5),streamer)
			NotificationsCount++;
		} else {
			console.debug(new Date()+': '+streamerName+' '+titleOfStream+'   [Was not displayed]')
		}
		sessionStorage['NotificationsCount'] = NotificationsCount;
	}
}

chrome.notifications.onButtonClicked.addListener(function(notificationId){
	window.open('http://www.twitch.tv/'+NotifierStrg(notificationId,'ch')[2]);
	NotifierStrg(notificationId,true)
});
chrome.notifications.onClosed.addListener(function(notificationId){ NotifierStrg(notificationId,true); chrome.notifications.clear(notificationId,function(){})});
chrome.notifications.onClicked.addListener(function(notificationId){ NotifierStrg(notificationId,true);chrome.notifications.clear(notificationId,function(){})});

if ( Math.floor(localJSON('Code').Background.version) < Math.floor(localJSON('Code').Background.version_geted) ) {Background = 'Out dated'} else {Background = 'New'}
if ( Math.floor(localJSON('Code').Popup.version) < Math.floor(localJSON('Code').Background.version_geted) ) {Popup = 'Out dated'} else {Popup = 'New'}
if ( Math.floor(localJSON('Code').Background.version) < Math.floor(localJSON('Code').Background.version_geted) ) {insertFunc = 'Out dated'} else {insertFunc = 'New'}


var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-25472862-3']);
_gaq.push(['_setCustomVar', 3, 'App_Version', localStorage['App_Version'], 1]);
_gaq.push(['_setCustomVar', 2, 'BackgroundJS', localJSON('Code','v',['Background','version']), 1]);
_gaq.push(['_setCustomVar', 2, 'PopupJS', localJSON('Code','v',['Popup','version']), 1]);
_gaq.push(['_setCustomVar', 3, 'insertFuncJS', localJSON('Code','v',['Background','version']), 1]);
_gaq.push(['_trackPageview']);

(function() {var ga=document.createElement('script');ga.type='text/javascript';ga.async=true;ga.src='https://ssl.google-analytics.com/ga.js';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(ga, s)})()}