/*
	@author Ivan 'MacRozz' Zarudny
*/

JSONstatus = JSON.parse(localStorage['Status']);
JSONconfig = JSON.parse(localStorage['Config']);

var NumberOfidOfListOfFollowedChannels = 1,
	LinesInListOfFollowedChannels = 0;
TimersetToUpdate = [];
FirstLoadVar = 1;
openCloseVersionVar = 1;
openCloseReportVar = 1;

function insertText(content,stream_id) {
	if (stream_id == 'stream_streamer') {
		document.getElementById(stream_id).href='http://www.twitch.tv/'+content
	} else if (stream_id == 'stream_game') {
		document.getElementById(stream_id).href='http://www.twitch.tv/directory/game/'+content
	} else if (stream_id == 'stream_img') {
		document.getElementById(stream_id).setAttribute('style','background:url('+content+')')
	} else {
		document.getElementById(stream_id).innerHTML=content
	}
}

function clickChangeUser() {
	document.getElementById("userChangePopup").style.display = 'block';
	document.getElementById("userChangePopup2").setAttribute("style","display:block");
	document.getElementById("userChangePopup").setAttribute("style","left:173");
	$('#userChangePopup2').removeClass('animated FadeOut');
	$('#userChangePopup2').addClass('animated FadeIn');
	$('#userChangePopup').removeClass('animated bounceOut');
	$('#userChangePopup').addClass('animated bounceIn');
	document.getElementById("ChgUsrNam").value=JSONconfig.User_Name;
	document.getElementById("ChgUsrInt").value=JSONconfig.Interval_of_Checking;
	document.getElementById('fndAbug').setAttribute("style","display:block;top:190;right:-68");
	createCookie('userChangePopup','open',1);
	changeNotify('Checking');
	checkSoundEnable('Checking');
	checkStreamDuration('Checking');
	_gaq.push(['_trackEvent', 'Options', 'clicked'])
}

function clickChangeUserCls() {
	$('#userChangePopup').removeClass('animated bounceIn');
	$('#userChangePopup').addClass('animated bounceOut');
	$('#userChangePopup2').removeClass('animated FadeIn');
	$('#userChangePopup2').addClass('animated FadeOut');
	document.getElementById('fndAbug').setAttribute("style","display:none");
	setTimeout(function(){
		document.getElementById("userChangePopup").style.display = 'none';
		document.getElementById("userChangePopup2").setAttribute("style","display:none");
		document.getElementById("FoundAbugText").setAttribute('style', 'display:none');
		openCloseReportVar = 1
	},800);
}

function changeUserName() {
	if (document.getElementById("ChgUsrNam").value != JSONconfig.User_Name) {
		createCookie('InstatntCheck','1',365);
		JSONconfig.User_Name = document.getElementById("ChgUsrNam").value;
		localStorage['Config'] = JSON.stringify(JSONconfig)
	} else if (document.getElementById("ChgUsrNam").value == '') {
		JSONconfig.User_Name = 'Guest';
		localStorage['Config'] = JSON.stringify(JSONconfig)
	}
}

function changeReftInt() {
	if (!isNaN(document.getElementById("ChgUsrInt").value)) {
		JSONconfig.Interval_of_Checking = document.getElementById("ChgUsrInt").value;
		localStorage['Config'] = JSON.stringify(JSONconfig)
	}
}

function changeNotify(type) {
	if (type == 'Change') {
		if (document.getElementById('Notify').checked) {
			JSONconfig.Notifications.status = 'Enable';
			JSONconfig.Notifications.online = 'Enable';
			JSONconfig.Notifications.update = 'Enable';
			localStorage['Config'] = JSON.stringify(JSONconfig)
		} if (document.getElementById('Notify').checked == false) {
			JSONconfig.Notifications.status = 'Disable';
			JSONconfig.Notifications.online = 'Disable';
			JSONconfig.Notifications.update = 'Disable';
			localStorage['Config'] = JSON.stringify(JSONconfig)
		} if (document.getElementById('NotifyStreamer').checked) {
			JSONconfig.Notifications.status = 'Enable';
			JSONconfig.Notifications.online = 'Enable';
			JSONconfig.Notifications.update = 'Disable';
			localStorage['Config'] = JSON.stringify(JSONconfig)
		} if (document.getElementById('NotifyUpdate').checked) {
			JSONconfig.Notifications.status = 'Enable';
			JSONconfig.Notifications.online = 'Disable';
			JSONconfig.Notifications.update = 'Enable';
			localStorage['Config'] = JSON.stringify(JSONconfig)
		}
	} else if (type == 'Checking') {
		if (JSON.parse(localStorage['Config']).Notifications.status == 'Enable') {
			document.getElementById('Notify').checked = true;
			document.getElementById('NotifyStreamer').checked = false;
			document.getElementById('NotifyUpdate').checked = false
		} if (JSON.parse(localStorage['Config']).Notifications.update == 'Enable') {
			document.getElementById('Notify').checked = false;
			document.getElementById('NotifyStreamer').checked = false;
			document.getElementById('NotifyUpdate').checked = true
		} if (JSON.parse(localStorage['Config']).Notifications.online == 'Enable') {
			document.getElementById('Notify').checked = false;
			document.getElementById('NotifyStreamer').checked = true;
			document.getElementById('NotifyUpdate').checked = false
		}
	}
}

function checkModifyNotify() {
	document.getElementById('NotifyStreamer').checked = false;
	document.getElementById('NotifyUpdate').checked = false;
	createCookie('changed_Notify','1',365)
}

function checkModifyNotifyStreamer() {
	document.getElementById('Notify').checked = false;
	document.getElementById('NotifyUpdate').checked = false;
	createCookie('changed_Notify_Streamer','1',365)
}

function checkModifyNotifyUpdate() {
	document.getElementById('Notify').checked = false;
	document.getElementById('NotifyStreamer').checked = false;
	createCookie('changed_Notify_Update','1',365)
}

function openCloseReportAbug() {
	_gaq.push(['_trackEvent', 'Report a bug', 'clicked']);
	
	if ($('#userChangePopup').css('display') == 'block') {
		if (openCloseReportVar == 1) {
			document.getElementById("FoundAbugText").setAttribute('style', 'display:block;right:0;top:121');
			document.getElementById("fndAbug").setAttribute('style', 'right:95;top:190');
			openCloseReportVar = 0
		} else if (openCloseReportVar == 0) {
			document.getElementById("FoundAbugText").setAttribute('style', 'display:none');
			document.getElementById("fndAbug").setAttribute('style', 'display:block;top:190;right:-68')
			openCloseReportVar = 1
		}
	} else if ($('#AppChanges').css('display') == 'block') {
		if (openCloseReportVar == 1) {
			document.getElementById("FoundAbugText").setAttribute('style', 'display:block;right:0;top:21');
			document.getElementById("fndAbug").setAttribute('style', 'right:95;top:90');
			openCloseReportVar = 0
		} else if (openCloseReportVar == 0) {
			document.getElementById("FoundAbugText").setAttribute('style', 'display:none');
			document.getElementById("fndAbug").setAttribute('style', 'display:block;top:90;right:-68');
			openCloseReportVar = 1
		}
	}
}

function checkSoundEnable(type) {
	if (type == 'Change') {
		if (document.getElementById('SoundCheck').checked == true) {
			JSONconfig.Notifications.sound_status = 'Enable';
			localStorage['Config'] = JSON.stringify(JSONconfig)
		} else if (document.getElementById('SoundCheck').checked == false) {
			JSONconfig.Notifications.sound_status = 'Disable';
			localStorage['Config'] = JSON.stringify(JSONconfig);
		}
	} else if (type == 'Checking') {
		if (JSON.parse(localStorage['Config']).Notifications.sound_status == 'Enable') {
			document.getElementById('SoundCheck').checked = true;
			document.getElementById('SoundSelect').disabled = false
		} else if (JSON.parse(localStorage['Config']).Notifications.sound_status == 'Disable') {
			document.getElementById('SoundCheck').checked = false;
			document.getElementById('SoundSelect').disabled = true
		}
	}
}

function checkStreamDuration(type) {
	if (type == 'Change') {
		if (document.getElementById('StreamDurationCheck').checked == true) {
			JSONconfig.Duration_of_stream = 'Enable';
			localStorage['Config'] = JSON.stringify(JSONconfig)
		} else if (document.getElementById('StreamDurationCheck').checked == false) {
			JSONconfig.Duration_of_stream = 'Disable';
			localStorage['Config'] = JSON.stringify(JSONconfig)
		}
	} else if (type == 'Checking') {
		if (JSON.parse(localStorage['Config']).Duration_of_stream == 'Enable') {
			document.getElementById('StreamDurationCheck').checked = true
		} else if (JSON.parse(localStorage['Config']).Duration_of_stream == 'Disable') {
			document.getElementById('StreamDurationCheck').checked = false
		}
	}
}

function changeScriptStarter() {
	changeSoundFile('Change');
	changeUserName();
	changeReftInt();
	changeNotify('Change');
	checkSoundEnable('Change');
	checkStreamDuration('Change');
	clickChangeUserCls()
}

function FollowedChannelsList(content,status) {
	if (content != undefined) {
		if (LinesInListOfFollowedChannels == '19') {
			NumberOfidOfListOfFollowedChannels += 1;		
		} else {
			if (NumberOfidOfListOfFollowedChannels == '6') {
				LinesInListOfFollowedChannels = 0
			} if (NumberOfidOfListOfFollowedChannels == '4') {
				document.getElementById('FollowedChannelsList').style.overflow = 'auto'}
			idOfListOfFollowedChannels = '';		
			idOfListOfFollowedChannels = 'InsertFollowedChannelsHere'+NumberOfidOfListOfFollowedChannels;
		} if (status == 'Online') {
			statusColor = 'rgb(0, 194, 40)'
		} else {
			statusColor = 'black'}
		
		TempVariable = document.getElementById(idOfListOfFollowedChannels).innerHTML;
		TempVariable += '<div><a href="http://www.twitch.tv/'+content+'/profile" style="color:'+statusColor+';border-bottom:1px black dotted" target="_blank">'+content+'</a><br></div>';
		document.getElementById(idOfListOfFollowedChannels).innerHTML = TempVariable;
	
		LinesInListOfFollowedChannels += 1;
	}
	// If 19 lines then go to next sector
	// InsertFollowedChannelsHere + Number (From 1 to 4)
}

function openFollowedList() {
	$('#firstScane').removeClass('animated fadeOut');
	$('#firstScane').addClass('animated fadeOut');
	setTimeout(function(){
		document.getElementById("firstScane").setAttribute("style","display:none");
		document.getElementById("FollowedChannelsList").style.display = 'block';
		document.getElementById("FollowedChannelsList").style.overflow = 'hidden';
		document.getElementById("FollowedChannelsList").style.height = '584px';
		$('#FollowedChannelsList').removeClass('animated fadeOut');
		$('#FollowedChannelsList').addClass('animated fadeIn')
	},800);

	_gaq.push(['_trackEvent', 'Following List', 'clicked']);

	var CountOfChannels = [];
	CountOfChannels.length = localStorage['Following'];
	CountOfRetryEach = 0;
	
	$.each(CountOfChannels, function() {
		FollowedChannelsList(localStorage['Stream_Name_'+CountOfRetryEach], localStorage['Stream_Status_'+CountOfRetryEach]);
		CountOfRetryEach += 1;
	})
}

function closeFollowedList() {
	$('#FollowedChannelsList').removeClass('fadeIn');
	$('#FollowedChannelsList').addClass('animated fadeOut');
	setTimeout(function(){
		document.getElementById("FollowedChannelsList").setAttribute("style","display:none");
		document.getElementById("firstScane").setAttribute("style","display:block");
		$('#firstScane').removeClass('animated fadeOut');
		$('#firstScane').addClass('animated fadeIn')
	});
	insertText('','InsertFollowedChannelsHere1');
	insertText('','InsertFollowedChannelsHere2');
	insertText('','InsertFollowedChannelsHere3');
	insertText('','InsertFollowedChannelsHere4');
	insertText('','InsertFollowedChannelsHere5');
	insertText('','InsertFollowedChannelsHere6');
	NumberOfidOfListOfFollowedChannels = 1;
	LinesInListOfFollowedChannels = 0
}

function openAppVersionChanges() {
	_gaq.push(['_trackEvent', 'App changes', 'clicked']);
	if (openCloseVersionVar == 1) {
		$('#AppChanges').removeClass('animated bounceOutDown');
		$('#AppChanges').addClass('animated bounceInUp');
		$('#AppInfoBack').removeClass('animated FadeOut');
		$('#AppInfoBack').addClass('animated FadeIn');
		setTimeout(function(){
			document.getElementById('fndAbug').setAttribute("style","display:block");
			document.getElementById("fndAbug").setAttribute('style', 'display:block;top:90;right:-68')
		},800);
		document.getElementById('AppChanges').setAttribute('style', 'display:block');
		document.getElementById('body').setAttribute('style', 'overflow:hidden');
		document.getElementById("AppInfoBack").setAttribute("style","display:block");
		changeAppContent('AppFirst');
		openCloseVersionVar = 0
	} else if (openCloseVersionVar == 0) {
		$('#AppChanges').removeClass('animated bounceInUp');
		$('#AppChanges').addClass('animated bounceOutDown');
		$('#AppInfoBack').removeClass('animated FadeIn');
		$('#AppInfoBack').addClass('animated FadeOut');
		setTimeout(function(){
			document.getElementById('fndAbug').setAttribute("style","display:none");
			document.getElementById("FoundAbugText").setAttribute('style', 'display:none');
			document.getElementById('AppChanges').setAttribute('style', 'display:none');
			document.getElementById('body').setAttribute('style', 'overflow:auto');
			document.getElementById('fndAbug').setAttribute("style","display:none");
			document.getElementById("AppInfoBack").setAttribute("style","display:none")
		},800);
		openCloseVersionVar = 1
	}
}

function CloseAppVersionChanges() {
	$('#AppChanges').removeClass('animated bounceInUp');
	$('#AppChanges').addClass('animated bounceOutDown');
	$('#AppInfoBack').removeClass('animated FadeIn');
	$('#AppInfoBack').addClass('animated FadeOut');
	document.getElementById('fndAbug').setAttribute("style","display:none");
	setTimeout(function(){
		document.getElementById("FoundAbugText").setAttribute('style', 'display:none');
		document.getElementById('AppChanges').setAttribute('style', 'display:none');
		document.getElementById('body').setAttribute('style', 'overflow:auto');
		document.getElementById("AppInfoBack").setAttribute("style","display:none")
	},800);
	openCloseVersionVar = 1
}

function changeAppContent(App) {
	if (App == 'AppFirst') {
		AppFirst = "<div class='AppInfo'><a class='aAppInfo'>-1.2.7 Bug fixes</a></div>";
		AppFirst += "<div class='AppInfo'><a class='aAppInfo'>-1.2.6 Added 'Watch now!' to notifications</a></div>";
		AppFirst += "<div class='AppInfo'><a class='aAppInfo'>-1.2.5 Added Animation, thanks for Animate.css (http://daneden.me/animate)</a></div>";
		AppFirst += "<div class='AppInfo'><a class='aAppInfo'>-1.2.4 Reedited 'Live Update' script</a></div>";
		AppFirst += "<div class='AppInfo'><a class='aAppInfo'>-1.2.3 Bug fixes (3), eyep</a></div>";
		AppFirst += "<div class='AppInfo'><a class='aAppInfo'>-1.2.2 Bug fixes (2)</a></div>";
		AppFirst += "<div class='AppInfo'><a class='aAppInfo'>-1.2.0 Modified storage system</a></div>";
		AppFirst += "<div class='AppInfo'><a class='aAppInfo'>-1.1.9 Added version control for 'Live Update' script</a></div>";
		AppFirst += "<div class='AppInfo'><a class='aAppInfo'>-1.1.8 Bug fixes</a></div>";
		AppFirst += "<div class='AppInfo'><a class='aAppInfo'>-1.1.7 Added 'Live Update' script. Fixed minor bugs</a></div>";
		AppFirst += "<div class='AppInfo'><a class='aAppInfo'>-1.1.6 Bug fixes</a></div>";
		AppFirst += "<div class='AppInfo'><a class='aAppInfo'>-1.1.5 A little optimisation in style. Now you can disable duration of stream. Button 'Found a bug?' now only viewable in options and in changes</a></div>";
		AppFirst += '<div class="AppInfo"><a class="aAppInfo">-1.1.4 Fixed freezes on opening</a></div>';
		AppFirst += '<div class="AppInfo"><a class="aAppInfo">-1.1.3 Bug with notifications, fixed stream duration</a></div>';
		AppFirst += '<div class="AppInfo"><a class="aAppInfo">-1.1.2 Stream duration</a></div>';
		AppFirst += '<div class="AppInfo"><a class="aAppInfo">-1.1.1 Hotfix</a></div>';
		AppFirst += '<div class="AppInfo"><a class="aAppInfo">-1.1.0 Added sound effects for notifications. Added "Version changes" page. And more...</a></div>';
		AppFirst += '<div class="AppInfo"><a class="aAppInfo">-1.0.2 Resolved a problem which freezes app</a></div>';
		AppFirst += '<div class="AppInfo"><a class="aAppInfo">-1.0.1 Bug fixes</a></div>';
		AppFirst += '<div class="AppInfo"><a class="aAppInfo">-1.0.0 First publish in Google Web Store</a></div>';
		document.getElementById('AppVersionContent').innerHTML = AppFirst
	} else if (App == 'AppSecond') {
	
		AppSecond = '<div class="AppInfoFuture"><a class="aAppInfoFuture">-For now, nothing...</a></div>';
		
		document.getElementById('AppVersionContent').innerHTML = AppSecond
	} else if (App == 'AppThird') {
	
		AppThird = '<div class="AppInfoAbout1"><a class="aAppInfoAbout1">This extension developed and published by</a></div>';
		AppThird += "<div class='AppInfoAbout2'><a class='aAppInfoAbout2'>Ivan 'MacRozz' Zarudny</a></div>";
		AppThird += "<div class='AppInfoAbout3'><a class='aAppInfoAbout3' href='http://www.mcrozz.net' target='_blank'>My website www.mcrozz.net</a></div>";
		AppThird += "<div class='AppInfoAbout4'><a class='aAppInfoAbout4' href='http://www.twitter.com/iZarudny' target='_blank'>Twitter @iZarudny</a></div>";
		AppThird += "<div class='AppInfoAbout5'><a class='aAppInfoAbout5' href='https://chrome.google.com/webstore/detail/twitchtv-notifier/mmemeoejijknklekkdacacimmkmmokbn/reviews' target='_blank'>Don't forget to rate my app ;)</a></div>";
		
		document.getElementById('AppVersionContent').innerHTML = AppThird
	}
}

function changeSoundFile(type) {
	if (type != 'Change') {
		var Audio = document.createElement('audio');
		MusicName = '/Music/'+document.getElementById("SoundSelect").value+'.mp3';
		Audio.setAttribute('src', MusicName);
		Audio.setAttribute('autoplay', 'autoplay');
		Audio.play()
	} else if (type == 'Change'){
		JSONconfig.Notifications.sound = document.getElementById("SoundSelect").value;
		localStorage['Config'] = JSON.stringify(JSONconfig)
	}
}

function progressBar(type) {
	if (type == 'Enable') {
		document.getElementById('CheckingProgress').setAttribute('style', 'display:block');
		document.getElementById('CheckingProgress').value = Math.floor(100 / localStorage['Following'] * JSONstatus.checked)
	} else if (type == 'Disable') {
		setTimeout(function(){
			document.getElementById('CheckingProgress').setAttribute('style', 'display:none')
		},800);
	}
}

document.addEventListener( "DOMContentLoaded" , function () {
	AppVersion('Version');
	document.getElementById("ChgUsr").addEventListener( "click" , clickChangeUser);
	document.getElementById("ChgUsrSnd").addEventListener( "click" , changeScriptStarter);
	document.getElementById("LstFlwdChnls").addEventListener( "click" , openFollowedList);
	document.getElementById("ClsFlwdChnlsLst").addEventListener( "click" , closeFollowedList);
	document.getElementById("Notify").addEventListener("change", checkModifyNotify);
	document.getElementById("NotifyStreamer").addEventListener("change", checkModifyNotifyStreamer);
	document.getElementById("NotifyUpdate").addEventListener("change", checkModifyNotifyUpdate);
	document.getElementById("fndAbug").addEventListener("click", openCloseReportAbug);
	document.getElementById("AppVersionClick").addEventListener("click", openAppVersionChanges);
	document.getElementById("SoundSelect").addEventListener("change", changeSoundFile);
	document.getElementById("AppFirst").addEventListener("click", function(){changeAppContent('AppFirst')});
	document.getElementById("AppSecond").addEventListener("click", function(){changeAppContent('AppSecond')});
	document.getElementById("AppThird").addEventListener("click", function(){changeAppContent('AppThird')});
	document.getElementById("AppInfoClose").addEventListener("click", function(){CloseAppVersionChanges()});
	document.getElementById('userChangePopup2').addEventListener('click', function(){clickChangeUserCls()});
	document.getElementById('AppInfoBack').addEventListener('click', function(){CloseAppVersionChanges()});
	document.getElementById('Dashboard').addEventListener('click', function(){_gaq.push(['_trackEvent', 'Dashboard', 'clicked']);window.open('http://www.twitch.tv/broadcast/dashboard')});
	document.getElementById('Direct').addEventListener('click', function(){_gaq.push(['_trackEvent', 'Direct', 'clicked']);window.open('http://www.twitch.tv/directory/following')});
	document.getElementById("SoundCheck").addEventListener("click", function(){ if (document.getElementById('SoundCheck').checked){document.getElementById('SoundSelect').disabled=false}else{document.getElementById('SoundSelect').disabled=true}});
} );
