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

var TimersetToUpdate = [];

function CSScompiler() {
	var style = document.createElement('style'),
		format = local.Config.Format,
		AddAnyways, css;
	if (!format) {
		localJSON('Config', 'c', ['Format', 'Grid']);
		CSScompiler()
	} else {
		if (format == 'Full') {
			css = '.StreamDuration {color:black;margin:0 0 0 17;display:inline-block}'+
				'button:focus {outline-color:rgba(255,255,255,0)}'+
				'.streamer {width:170px;height:20px;display:inline-block;padding-left:3;padding-bottom:5}'+
				'.viewers {width:160px;height:20px;display:inline-block;text-align:right}'+
				'.viewers>p {cursor:default;width:75px;display:inline;text-transform:lowercase;padding-left:5px;border:none}'+
				'.content {height:200px;width:685px;padding:2;position:relative;font-size:17}'+
				'.tumblr {background:url("/img/StillDownloading.gif");height:200px;width:320px;display:inline;position:absolute;margin-left:10px}'+
				'.information {width:345px;height:130px;display:inline;position:absolute;right:0;top:15}'+
				'.informationTextTitle {width:337px;height:20px;display:block;border-bottom:1px solid black;margin-bottom:5px;cursor:default;z-index:1;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);padding-top:6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-left:3}'+
				'.informationTextStreamer {cursor:pointer;font-size:17;color:black;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4)}'+
				'.informationTextViewers {cursor:default;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);width:75px;display:inline}'+
				'.informationTextGame {text-align:center;border-top:1px solid black;height:20px;cursor:pointer;font-size:17;color:black;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:340px;display:block;padding-top:5px}'+
				'.GameTumb1, .GameTumb2{width:43px;height:60px;position:absolute;margin:139 0 0 -44}'+
				'.TumbStream {width:320px;height:200px}'+
				'.StreamOnChannelPage {width:340px;height:28px;padding-top:2px}'+
				'.StreamDurationDiv {width:170;height:20;position:absolute;right:16;top:90;text-align:right}'+
				'.ChannelPageDiv {width:150;height:40;display:inline}'+
				'.aFoundAbug {z-index:20;text-align:justify;font-size:21px;width:100%;display:block}'+
				'.foundAbug {z-index:19;padding:37 5 13 5;position:absolute;width:98px;height:113px;background:-webkit-gradient(linear, left top, left bottom, from(rgba(1,1,1,0.8)),to(rgba(1,1,1,0.5)))}'+
				'button.button {font-size:22px;width:150px;height:30px}';
		} else if (format == 'Mini') {
			css = '.StreamDuration {color:black;margin:0 0 0 17;font-size:19}'+
				'.streamer {width:180px;height:20px;display:inline-block}'+
				'button:focus {outline-color:rgba(255,255,255,0)}'+
				'.viewers {width:150px;height:20px;position:absolute;right:12;text-align:right;top:20}'+
				'.viewers>p {cursor:default;width:75px;padding-left:5px;display:inline;border:none}'+
				'.content {height:90px;width:685px;padding:2;position:relative}'+
				'.information {width:535px;height:80px;display:inline;position:absolute;right:0;top:6}'+
				'.informationTextTitle {cursor:default;display:-webkit-inline-flex;z-index:1;padding-left:5px;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:525px;border-bottom:1px black solid}'+
				'.informationTextStreamer {cursor:pointer;font-size:16;color:black;display:inline;padding-left:5px;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);padding-left:5}'+
				'.informationTextViewers {cursor:default;display:inline;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);padding-left:5}'+
				'.informationTextGame {cursor:pointer;font-size:16;color:black;display:inline-block;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:195px;left:145px;text-align:center}'+
				'.tumblr {background:url("/img/StillDownloading.gif");height:60px;width:90px;display:inline;position:absolute;margin:5 0 0 10}'+
				'.LaunchStream {display:none!important}'+
				'.GameTumb1, .GameTumb2{width:43px;height:60px;position:absolute;margin:0 0 0 1}'+
				'.TumbStream {width:90px;height:60px}'+
				'.StreamOnChannelPage {width:530px;height:23px}'+
				'.StreamDurationDiv {width:160;height:23;text-align:right;display:inline-block}'+
				'.ChannelPageDiv {width:110;height:23;display:inline-block;margin-right:260px}'+
		        '.aFoundAbug {z-index:20;text-align:justify;font-size:21px;width:100%;display:block}'+
		        '.foundAbug {z-index:19;padding:37 5 13 5;position:absolute;width:98px;height:113px;background:-webkit-gradient(linear, left top, left bottom, from(rgba(1,1,1,0.8)),to(rgba(1,1,1,0.5)))}'+
				'button.button {font-size:18px;width:110px;height:22px}';
		} else if (format == 'Grid') {
			css = '.StreamDuration {color:white;text-shadow: 1px 2px 3px black;margin:0 0 0 17}'+
				'button:focus {outline-color:rgba(0,0,0,0)}'+
				'.streamer {width:165px;height:20px;display:inline-table;padding-top:6px}'+
				'.viewers {width:150px;height:20px;display:inline-block;text-align:right}'+
				'.viewers>p {cursor:default;width:75px;display:inline;text-transform:lowercase;padding-left:5px;border:none}'+
				'.content {height:290px;width:330px;padding:2;position:relative;display:inline-block;margin-left:7}'+
				'.tumblr {background:url("/img/StillDownloading.gif");height:200px;width:320px;display:inline;position:absolute;margin-left:10px}'+
				'.information {width:315px;height:90px;display:inline;position:absolute;left:15;top:200}'+
				'.informationTextTitle {height:20px;display:inline-block;cursor:default;z-index:1;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);padding-top:6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:315px;border-bottom:1px black solid}'+
				'.informationTextStreamer {cursor:pointer;font-size:16;color:black;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);margin-left:3}'+
				'.informationTextViewers {cursor:default;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);width:75px;display:inline}'+
				'.informationTextGame {text-align:center;border-top:1px solid black;height:20px;cursor:pointer;font-size:16;color:black;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:315px;display:block;padding-top:5px}'+
				'.GameTumb1, .GameTumb2{width:43px;height:60px;position:absolute;margin:139 0 0 -44}'+
				'.GamaTumb1:hover::after {content:attr(data-title);left:-2%;top:0%;width:305px;background:rgba(255,255,255,0.95);font-size:14px;padding:7 10;border:1px solid rgba(51, 51, 51, 0.34);-webkit-animation:fadeInDown 0.2s both;white-space:normal;display:block;position:absolute;font-size:17;z-index:1}'+
				'.TumbStream {width:320px;height:200px}'+
				'.StreamOnChannelPage {width:315px;height:40px;position:absolute;top:-197;left:-2;text-align:center}'+
				'.StreamDurationDiv {width:170;height:40;display:inline}'+
				'.ChannelPageDiv {display:none}'+
				'.aFoundAbug {z-index:20;text-align:justify;font-size:21px;width:100%;display:block}'+
				'.foundAbug {z-index:19;padding:37 5 13 5;position:absolute;width:98px;height:113px;background:-webkit-gradient(linear, left top, left bottom, from(rgba(1,1,1,0.8)),to(rgba(1,1,1,0.5)))}'+
				'button.button {font-size:22px;width:150px;height:30px}';
		}
		style.appendChild(document.createTextNode(css)); document.getElementsByTagName('head')[0].appendChild(style);
	}
}

opened = false;
function ReportAbug() {
	ga('set', 'event', 'Report a bug', 'clicked');
	if (!opened) {
		Animation('FoundAbugText', ['openReport', false, 0.8]);
		Animation('fndAbug', ['openReportBtn', false, 0.8]);
		opened = true;
	} else {
		Animation('FoundAbugText', ['closeReport', false, 0.8]);
		Animation('fndAbug', ['closeReportBtn', false, 0.8]);
		opened = false;
	}
}

function clickChangeUser() {
	doc('userChangePopup2').onclick = clickChangeUserCls;
	$('#userChangePopup').show();
	$('#userChangePopup2').show();
	$('#AppVersion').hide();
	doc('UserName').innerHTML = "You're loggin as "+local.Config.User_Name+'<button id="log_out">Log out</button>';
	$('#log_out').on('click', reLogin);
	Animation('userChangePopup2', ['fadeIn', false, 0.9]);
	Animation('userChangePopup', ['bounceIn', false, 0.9]);
	doc("ChgUsrInt").value = local.Config.Interval_of_Checking;
	doc('fndAbug').setAttribute("style","top:190;right:-68");
	Animation('fndAbug', ['showReportBtn', false, 0.8]);
	Animation('FoundAbugText', ['showReport', false, 0.8]);
	// Notifications
	if (local.Config.Notifications.status) {
		doc('EnNotify').checked = true;
		doc('DisNotify').checked = false;
		doc('NotifyStreamerChanged').disabled = false;
		doc('NotifyStreamer').disabled = false;
		doc('NotifyUpdate').disabled = false
	} else {
		doc('EnNotify').checked = false;
		doc('DisNotify').checked = true;
		doc('NotifyStreamerChanged').disabled = true;
		doc('NotifyStreamer').disabled = true;
		doc('NotifyUpdate').disabled = true
	} 
	doc('NotifyStreamerChanged').checked = local.Config.Notifications.update;
	doc('NotifyStreamer').checked = local.Config.Notifications.online;
	doc('NotifyUpdate').checked = local.Config.Notifications.follow;
	// Sound
	if (local.Config.Notifications.sound_status) {
		doc('SoundCheck').checked = true;
		doc('SoundSelect').disabled = false
	} else {
		doc('SoundCheck').checked = false;
		doc('SoundSelect').disabled = true
	}
	// Duration of stream
	doc('StreamDurationCheck').checked = local.Config.Duration_of_stream;
	
	doc('List_Format_List').value = local.Config.Format;

	ga('set', 'event', 'Options', 'clicked');
}

function clickChangeUserCls() {
	Animation('userChangePopup', ['bounceOut', true]);
	Animation('userChangePopup2', ['fadeOut', true, 0.5]);
	Animation('AppVersion', ['fadeIn', false]);
	if (opened) {
		Animation('fndAbug', ['hideReportBtnA', true, 0.7]);
		Animation('FoundAbugText', ['hideReportA', true, 0.7]);
	} else {
		Animation('fndAbug', ['hideReportBtn', true, 0.9]);
		Animation('FoundAbugText', ['hideReport', true, 0.9]);
	}
	opened = false;
}

function changeScriptStarter() {
	// Interval of checking
	var g = Math.floor(doc('ChgUsrInt').value);
	if (!isNaN(g) && local.Config.Interval_of_Checking !== g && g > 0) {
		localJSON('Config','c',['Interval_of_Checking', g]);
		localJSON('Status','c',['StopInterval', true])
	}
	// Notifications
	if (doc('EnNotify').checked) localJSON('Config','c',['Notifications','status', true]);
	if (doc('DisNotify').checked) localJSON('Config','c',['Notifications','status', false]);
	localJSON('Config','c',['Notifications','online',doc('NotifyStreamer').checked]);
	localJSON('Config','c',['Notifications','update',doc('NotifyStreamerChanged').checked]);
	localJSON('Config','c',['Notifications','follow',doc('NotifyUpdate').checked]);
	// Sound
	localJSON('Config','c',['Notifications','sound_status',doc('SoundCheck').checked]);
	localJSON('Config','c',['Notifications','sound', doc("SoundSelect").value]);
	// Duration of stream
	localJSON('Config','c',['Duration_of_stream',doc('StreamDurationCheck').checked]);
	// Update style and list of online users
	if (doc('List_Format_List').value !== local.Config.Format) {
		localJSON('Config','c',['Format', doc('List_Format_List').value]);
		document.getElementsByTagName("style")[0].remove();
		CSScompiler();
		doc('insertContentHere').innerHTML = '';
		TimersetToUpdate = [];
		InsertOnlineList();
	}
	// Close options
	clickChangeUserCls();
}

function FollowedList(c) {
	var NumberId = 1,
		Lines = 0,
		FollowList = localJSON('FollowingList'),
        StatusColor;
	if (c=='o') {
		doc('IFCHc').innerHTML = '<div class="IFCH" id="IFCH_'+NumberId+'"></div>';
		function FollowedChannelsList(content, Status) {
			if (Lines == 21) {
				NumberId++;
				doc('IFCHc').innerHTML += '<div class="IFCH" id="IFCH_'+NumberId+'"></div>';
				Lines = 0;
			}
			StatusColor = (Status == 'Online') ? 'rgb(0, 194, 40)' : 'black';
			doc('IFCH_'+NumberId).innerHTML += '<div><a href="http://www.twitch.tv/'+content+'/profile" style="color:'+StatusColor+';border-bottom:1px black dotted" target="_blank">'+content+'</a><br></div>';
			Lines++;
		}

		$('#firstScane').hide();
		Animation('FollowedChannelsList', ['fadeIn', false]);

		ga('set', 'event', 'Following List', 'clicked');
		
		for (var i=0;i<localJSON('Following');i++) FollowedChannelsList(FollowList[i].Name, (FollowList[i].Stream) ? 'Online' : 'Offline');
	} else if (c=='c') {
		Animation('FollowedChannelsList', ['fadeOut', true]);
		Animation('firstScane', ['fadeIn', false], function(){ doc('IFCHc').innerHTML = null; });
	}
}

function AppVersionChanges(c) {
    if (c=='c') {
    	Animation('AppChanges', ['bounceOutDown', true]);
		Animation('AppInfoBack', ['fadeOut', true, 0.5], function(){ $('body').css('overflow', 'auto'); });
		if (opened) {
			Animation('fndAbug', ['hideReportBtnA', true, 0.7]);
			Animation('FoundAbugText', ['hideReportA', true, 0.7]);
		} else {
			Animation('fndAbug', ['hideReportBtn', true, 0.9]);
			Animation('FoundAbugText', ['hideReport', true, 0.9]);
		}
		opened = false;
		Animation('AppVersion', ['fadeIn', false]);
	} else if (c=='o') {
		Animation('AppChanges', ['bounceInUp', false]);
		Animation('AppInfoBack', ['fadeIn', false]);
		doc('fndAbug').setAttribute('style', 'top:190px;right:-68px');
		Animation('fndAbug', ['showReportBtn', false]);
		Animation('FoundAbugText', ['showReport', false]);
		Animation('AppVersion', ['fadeOut', true]);
		$('body').css('overflow', 'hidden');
		$('#AppVersion').hide();
		CURRENT_APP_PAGE = 'About';
		AppVersionChanges('ch');
	} else if (c=='ch') {
		if (CURRENT_APP_PAGE == 'About') {
			var AppFirst = '';
			for (i = 0; i < changes.length; i++) AppFirst += "<div class='AppInfo'><a>"+changes[i]+"</a></div>";
			Animation('AppVersionContent', ['fadeIn', false]);
			doc('AppVersionContent').innerHTML = AppFirst;
			$('#AppFirst').css('border-bottom', '2px solid rgb(3,64,223)');
			$('#AppThird').css('border-bottom', '2px solid white');
			$('#AppInfoClose').css('border-bottom', '2px solid white');
			CURRENT_APP_PAGE = 'Changes';
		} else if (CURRENT_APP_PAGE == 'Changes') {
			doc('AppVersionContent').innerHTML = '<div class="AppInfoAbout1"><a class="aAppInfoAbout1">This extension developed and published by</a></div>'+
				"<div class='AppInfoAbout2'><a>Ivan 'MacRozz' Zarudny</a></div>"+
				"<div class='AppInfoAbout3'><a href='http://www.mcrozz.net' target='_blank'>My website www.mcrozz.net</a></div>"+
				"<div class='AppInfoAbout4'><a href='http://www.twitter.com/iZarudny' target='_blank'>Twitter @iZarudny</a></div>"+
				"<div class='AppInfoAbout5'><a href='https://chrome.google.com/webstore/detail/twitchtv-notifier/mmemeoejijknklekkdacacimmkmmokbn/reviews' target='_blank'>Don't forget to rate my app ;)</a></div>";
			Animation('AppVersionContent', ['fadeIn', false]);
			$('#AppFirst').css('border-bottom', '2px solid white');
			$('#AppThird').css('border-bottom', '2px solid rgb(3,64,223)');
			$('#AppInfoClose').css('border-bottom', '2px solid white');
			CURRENT_APP_PAGE = 'About';
		}
    }
}

$(window).on('load',function() {
	function ael(id, type, func) {var d = ['click', 'change'], j = ''; if ($.isArray(id)) {for (var i=0; i<id.length; i++) { if (i !== 0) j += ', '; j += '#'+id[i]; }} else { j = '#'+id; } $(j).on(d[type], func);}
	CSScompiler();
	versionCheck();
	doc('AppVersion').innerHTML = local.App_Version.Ver+' (changes)';
	ael('ChgUsr', 0, clickChangeUser);
	ael('ChgUsrSnd', 0, changeScriptStarter);
	ael('LstFlwdChnls', 0, function(){ FollowedList('o') });
	ael('ClsFlwdChnlsLst', 0, function(){ FollowedList('c') });
	ael(['Notify_All', 'DisNotify_All'], 0, function(){ doc('EnNotify').checked = !(this.id === 'DisNotify_All'); doc('DisNotify').checked = (this.id === 'DisNotify_All'); $('[name=ntf]').each(function(){this.disabled = doc('DisNotify').checked}); });
	ael(['Notify_Streamer', 'NotifyStreamer'], 0, function(){ if (doc('EnNotify').checked) doc('NotifyStreamer').checked = !doc('NotifyStreamer').checked; });
	ael(['Notify_Streamer_Changed', 'NotifyStreamerChanged'], 0, function(){ if (doc('EnNotify').checked) doc('NotifyStreamerChanged').checked = !doc('NotifyStreamerChanged').checked; });
	ael(['Notify_Upd', 'NotifyUpdate'], 0, function(){ if (doc('EnNotify').checked) doc('NotifyUpdate').checked = !doc('NotifyUpdate').checked; });
	ael(['Notify_Sound', 'SoundCheck'], 0, function(){ if (doc('EnNotify').checked) { doc('SoundCheck').checked = !doc('SoundCheck').checked; doc('SoundSelect').disabled = !doc('SoundCheck').checked; } });
	ael(['DurationOfStream', 'StreamDurationCheck'], 0, function(){ doc('StreamDurationCheck').checked = !doc('StreamDurationCheck').checked; });
	ael('fndAbug', 0, ReportAbug);
	ael('AppVersion', 0, function(){ AppVersionChanges('o') });
	ael('SoundSelect', 1, function(){ var a=document.createElement('audio');a.src='/Music/'+doc("SoundSelect").value+'.wav'; a.play() });
	ael('AppFirst', 0, function(){ AppVersionChanges('ch') });
	ael('AppThird', 0, function(){ AppVersionChanges('ch') });
	ael('AppInfoClose', 0, function(){ AppVersionChanges('c') });
	ael('AppInfoBack', 0, function(){ AppVersionChanges('c') });
	ael('Dashboard', 0, function(){ ga('set', 'event', 'Dashboard', 'clicked'); window.open('http://www.twitch.tv/broadcast/dashboard') });
	ael('Direct', 0, function(){ ga('set', 'event', 'Direct', 'clicked'); window.open('http://www.twitch.tv/directory/following') });
	ael('SoundCheck', 0, function(){ doc('SoundSelect').disabled = !doc('SoundCheck').checked });
	ael('refresh', 0, function(){ localJSON('Status', 'c', ['StopInterval', true]) });
	ael('zoomContent', 0, function() {Animation('zoomContent', 'fadeOut', true); Animation('userChangePopup2', 'fadeOut', true); doc('userChangePopup2').onclick = null; doc('zoomContent').onclick = null;});
	document.onmousemove = function(p){
		var left, top, offsetX=10, width=doc('message').offsetWidth, height=doc('message').offsetHeight;
        left = (697-width-p.x-10 < 0) ? 697-width : p.x+offsetX;
        top = (600-height-p.y < 0) ? p.y-height-5 : p.y-height-5;
		doc('message').style.left = left+'px';
		doc('message').style.top = top+'px';
	};
});