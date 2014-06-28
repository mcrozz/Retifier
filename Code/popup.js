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

{{CSS_COMPILER}}

opened = false;
function ReportAbug() {
	ga('send', 'event', 'button', 'click', 'Report a bug');
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

	ga('send', 'event', 'button', 'click', 'Options');
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
		localJSON('Config',['Interval_of_Checking', g]);
		localJSON('Status',['StopInterval', true])
	}
	// Notifications
	if (doc('EnNotify').checked) localJSON('Config',['Notifications','status', true]);
	if (doc('DisNotify').checked) localJSON('Config',['Notifications','status', false]);
	localJSON('Config',['Notifications','online',doc('NotifyStreamer').checked]);
	localJSON('Config',['Notifications','update',doc('NotifyStreamerChanged').checked]);
	localJSON('Config',['Notifications','follow',doc('NotifyUpdate').checked]);
	// Sound
	localJSON('Config',['Notifications','sound_status',doc('SoundCheck').checked]);
	localJSON('Config',['Notifications','sound', doc("SoundSelect").value]);
	// Duration of stream
	localJSON('Config',['Duration_of_stream',doc('StreamDurationCheck').checked]);
	// Update style and list of online users
	if (doc('List_Format_List').value !== local.Config.Format) {
		localJSON('Config',['Format', doc('List_Format_List').value]);
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

		ga('send', 'event', 'button', 'click', 'Following List');
		
		for (var i=0;i<localJSON('Following');i++)
			FollowedChannelsList(FollowList[i].Name, (FollowList[i].Stream) ? 'Online' : 'Offline');
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
				"<div class='AppInfoAbout5'><a href='{{LINK_REVIEW}}' target='_blank'>Don't forget to rate my app ;)</a></div>";
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
	$('#AppVersion').html(local.App_Version.Ver);
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
	ael('SoundSelect', 1, function(){ var Audio = document.createElement('audio'); MusicName = '/Music/'+doc("SoundSelect").value+'.mp3'; Audio.setAttribute('src', MusicName); Audio.setAttribute('autoplay', 'autoplay'); Audio.play() });
	ael('AppFirst', 0, function(){ AppVersionChanges('ch') });
	ael('AppThird', 0, function(){ AppVersionChanges('ch') });
	ael('AppInfoClose', 0, function(){ AppVersionChanges('c') });
	ael('AppInfoBack', 0, function(){ AppVersionChanges('c') });
	ael('Dashboard', 0, function(){ ga('send', 'event', 'button', 'click', 'Dashboard'); window.open('http://www.twitch.tv/broadcast/dashboard') });
	ael('Direct', 0, function(){ ga('send', 'event', 'button', 'click', 'Direct'); window.open('http://www.twitch.tv/directory/following') });
	ael('SoundCheck', 0, function(){ doc('SoundSelect').disabled = !doc('SoundCheck').checked });
	ael('refresh', 0, function(){ localJSON('Status', ['StopInterval', true]) });
	ael('zoomContent', 0, function() {Animation('zoomContent', 'fadeOut', true); Animation('userChangePopup2', 'fadeOut', true); doc('userChangePopup2').onclick = null; doc('zoomContent').onclick = null;});
	document.onmousemove = function(p){
		var left, top, offsetX=10, width=doc('message').offsetWidth, height=doc('message').offsetHeight;
        left = (697-width-p.x-10 < 0) ? 697-width : p.x+offsetX;
        top = (600-height-p.y < 0) ? p.y-height-5 : p.y-height-5;
		doc('message').style.left = left+'px';
		doc('message').style.top = top+'px';
	};
});