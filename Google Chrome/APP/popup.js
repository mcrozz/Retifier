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

var TimersetToUpdate = [],
	openCloseVersionVar = 1,
	openCloseReportVar = 1;

function CSScompiler() {
	style=document.createElement('style');
	format=localJSON('Config','v',['Format']);
	if (!localJSON('Config','v',['Format'])) {
		StrmLst = localJSON('Config');
		StrmLst.Format = 'Grid';
		localStorage['Config'] = JSON.stringify(StrmLst);
		CSScompiler()} 
	else {
	AddAnyways = '::-webkit-scrollbar {width:12px}';
	AddAnyways += '::-webkit-scrollbar-track {-webkit-box-shadow:inset 0 0 6px white,inset 0 0 6px black;border-radius:10px}';
	AddAnyways += '::-webkit-scrollbar-thumb {-webkit-box-shadow:inset 0 0 6px rgba(0, 0, 0, 1);border-radius:10px;background:-webkit-gradient(linear,left top,left bottom,from(rgba(158, 158, 158, 0.73)),to(rgba(77, 77, 77, 0.64)))}';
	if (format == 'Full') {
		css = '.StreamDuration {color:black;margin:0 0 0 17;display:inline-block}';
		css += 'button:focus {outline-color:rgba(255,255,255,0)}';
		css += '.streamer {width:150px;height:20px;display:inline-block;padding-left:3;padding-bottom:5}';
		css += '.viewers {width:160px;height:20px;display:inline-block;text-align:right}';
		css += '.pViewers {cursor:default;width:75px;display:inline;text-transform:lowercase;padding-left:5px;border:none}';
		css += '.content {height:200px;width:685px;padding:2;position:relative;font-size:17}';
		css += '#insertContentHere {max-height:100%;overflow:auto}';
		css += '.tumblr {background:url("/img/StillDownloading.gif");height:200px;width:320px;display:inline;position:absolute;margin-left:10px}';
		css += '.tumblr:hover::after {content:"Go to streaming page";width:317px;height:22px;z-index:1;position:absolute;left:1;top:168;text-align:center;color:rgba(255,255,255,0.5);padding:4 0;background:-webkit-gradient(linear,left top,left bottom,from(rgba(39, 39, 39, 0.66)),to(rgba(0, 0, 0, 0.85)));-webkit-animation-name:fadeIn;-webkit-animation-duration:0.5s}';
		css += '.information {width:345px;height:130px;display:inline;position:absolute;right:0;top:15}';
		css += '.informationTextTitle {width:340px;height:20px;display:block;border-bottom:1px solid black;margin-bottom:5px;cursor:default;z-index:1;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);padding-top:6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-left:3}';
		css += '.informationTextStreamer {cursor:pointer;font-size:16;color:black;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);margin-left:6}';
		css += '.informationTextViewers {cursor:default;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);width:75px;display:inline}';
		css += '.informationTextGame {text-align:center;border-top:1px solid black;height:20px;cursor:pointer;font-size:16;color:black;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:340px;display:block;padding-top:5px}';
		css += '.GameTumb1, .GameTumb2{width:43px;height:60px;position:absolute;margin:139 0 0 -44}';
		css += '.GameTumb1 {z-index:3}';
		css += '.GameTumb2 {z-index:2}';
		css += '.TumbStream {width:320px;height:200px}';
		css += '.StreamOnChannelPage {width:340px;height:28px;padding-top:2px}';
		css += '.StreamDurationDiv {width:170;height:40;position:absolute;right:16;top:96;text-align:right}';
		css += '.ChannelPageDiv {width:150;height:40;display:inline}';
		css += '.aFoundAbug {z-index:20;text-align:justify;font-size:21px;width:100%;display:block}';
		css += '.foundAbug {z-index:19;padding:37 5 13 5;position:absolute;width:98px;height:113px;background:-webkit-gradient(linear, left top, left bottom, from(rgba(1,1,1,0.8)),to(rgba(1,1,1,0.5)))}';
		css += 'button.button {font-size:22px;width:150px;height:30px}';
	} else if (format == 'Mini') {
		css = '.StreamDuration {color:black;margin:0 0 0 17;font-size:19}';
		css += '.streamer {width:180px;height:20px;display:inline-block}';
		css += 'button:focus {outline-color:rgba(255,255,255,0)}';
		css += '.viewers {width:150px;height:20px;position:absolute;right:12;text-align:right;top:20}';
		css += '.pViewers {cursor:default;width:75px;padding-left:5px;display:inline;border:none}';
		css += '.content {height:90px;width:685px;padding:2;position:relative}';
		css += '#insertContentHere {max-height:100%;overflow:auto}';
		css += '.information {width:535px;height:80px;display:inline;position:absolute;right:0;top:6}';
		css += '.informationTextTitle {cursor:default;display:-webkit-inline-flex;z-index:1;padding-left:5px;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:525px;border-bottom:1px black solid}';
		css += '.informationTextStreamer {cursor:pointer;font-size:16;color:black;display:inline;padding-left:5px;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);padding-left:5}';
		css += '.informationTextViewers {cursor:default;display:inline;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);padding-left:5}';
		css += '.informationTextGame {cursor:pointer;font-size:16;color:black;display:inline;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:195px;left:145px;text-align:center}';
		css += '.tumblr {background:url("/img/StillDownloading.gif");height:60px;width:90px;display:inline;position:absolute;margin:5 0 0 10}';
		css += '.GameTumb1, .GameTumb2{width:43px;height:60px;position:absolute;margin:0 0 0 1}';
		css += '.GameTumb1 {z-index:3}';
		css += '.GameTumb2 {z-index:2}';
		css += '.TumbStream {width:90px;height:60px}';
		css += '.StreamOnChannelPage {width:530px;height:23px}';
		css += '.StreamDurationDiv {width:160;height:23;text-align:right;display:inline-block}';
		css += '.ChannelPageDiv {width:110;height:23;display:inline-block;margin-rigth:260px}';
        css += '.aFoundAbug {z-index:20;text-align:justify;font-size:21px;width:100%;display:block}';
        css += '.foundAbug {z-index:19;padding:37 5 13 5;position:absolute;width:98px;height:113px;background:-webkit-gradient(linear, left top, left bottom, from(rgba(1,1,1,0.8)),to(rgba(1,1,1,0.5)))}';
		css += 'button.button {font-size:18px;width:110px;height:22px}';
	} else if (format == 'Grid') {
		css = '.StreamDuration {color:white;text-shadow: 1px 2px 3px black;margin:0 0 0 17}';
		css += 'button:focus {outline-color:rgba(255,255,255,0)}';
		css += '.streamer {width:165px;height:20px;display:inline-table;padding-top:6px}';
		css += '.viewers {width:150px;height:20px;display:inline-block;text-align:right}';
		css += '.pViewers {cursor:default;width:75px;display:inline;text-transform:lowercase;padding-left:5px;border:none}';
		css += '.content {height:290px;width:330px;padding:2;position:relative;display:inline-block;margin-left:7}';
		css += '#insertContentHere {max-height:100%;overflow:auto}';
		css += '.tumblr {background:url("/img/StillDownloading.gif");height:200px;width:320px;display:inline;position:absolute;margin-left:10px}';
		css += '.tumblr:hover::after {content:"Go to streaming page";width:317px;height:22px;z-index:1;position:absolute;left:1;top:168;text-align:center;color:rgba(255,255,255,0.5);padding:4 0;background:-webkit-gradient(linear,left top,left bottom,from(rgba(39, 39, 39, 0.66)),to(rgba(0, 0, 0, 0.85)));-webkit-animation-name:fadeIn;-webkit-animation-duration:0.5s}';
		css += '.information {width:315px;height:90px;display:inline;position:absolute;left:15;top:200}';
		css += '.informationTextTitle {height:20px;display:inline-block;cursor:default;z-index:1;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);padding-top:6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:315px;border-bottom:1px black solid}';
		css += '.informationTextStreamer {cursor:pointer;font-size:16;color:black;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);margin-left:3}';
		css += '.informationTextViewers {cursor:default;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);width:75px;display:inline}';
		css += '.informationTextGame {text-align:center;border-top:1px solid black;height:20px;cursor:pointer;font-size:16;color:black;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:315px;display:block;padding-top:5px}';
		css += '.GameTumb1, .GameTumb2{width:43px;height:60px;position:absolute;margin:139 0 0 -44}';
		css += '.GameTumb1 {z-index:3}';
		css += '.GameTumb2 {z-index:2}';
		css += '.GamaTumb1:hover::after {content:attr(data-title);left:-2%;top:0%;width:305px;background:rgba(255,255,255,0.95);font-size:14px;padding:7 10;border:1px solid rgba(51, 51, 51, 0.34);-webkit-animation-name:fadeInDown;-webkit-animation-duration:0.2s;white-space:normal;display:block;position:absolute;font-size:17;z-index:1}';
		css += '.TumbStream {width:320px;height:200px}';
		css += '.StreamOnChannelPage {width:315px;height:40px;position:absolute;top:-197;left:-2;text-align:center}';
		css += '.StreamDurationDiv {width:170;height:40;display:inline}';
		css += '.ChannelPageDiv {display:none}';
		css += '.aFoundAbug {z-index:20;text-align:justify;font-size:21px;width:100%;display:block}';
		css += '.foundAbug {z-index:19;padding:37 5 13 5;position:absolute;width:98px;height:113px;background:-webkit-gradient(linear, left top, left bottom, from(rgba(1,1,1,0.8)),to(rgba(1,1,1,0.5)))}';
		css += 'button.button {font-size:22px;width:150px;height:30px}';
	}
	css += AddAnyways;
	if (style.styleSheet){style.styleSheet.cssText=css}else{style.appendChild(document.createTextNode(css));document.getElementsByTagName('head')[0].appendChild(style)}
	}
}

function clickChangeUser() {
	$('#userChangePopup').show();
	$('#userChangePopup2').show();
	$('#AppVersion').hide();
	Animation('userChangePopup2', 'fadeIn', false);
	Animation('userChangePopup', 'bounceIn', false);
	doc("ChgUsrNam").value = localJSON('Config','v',['User_Name']);
	doc("ChgUsrInt").value = localJSON('Config','v',['Interval_of_Checking']);
	doc('fndAbug').setAttribute("style","display:block;top:190;right:-68");
	// Notifications
	if (localJSON('Config','v',['Notifications','status'])) {
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
	doc('NotifyStreamerChanged').checked = localJSON('Config','v',['Notifications','update']);
	doc('NotifyStreamer').checked = localJSON('Config','v',['Notifications','online']);
	doc('NotifyUpdate').checked = localJSON('Config','v',['Notifications','follow']);
	// Sound
	if (localJSON('Config','v',['Notifications','sound_status']) == 'Enable') {
		doc('SoundCheck').checked = true;
		doc('SoundSelect').disabled = false
	} else if (localJSON('Config','v',['Notifications','sound_status']) == 'Disable') {
		doc('SoundCheck').checked = false;
		doc('SoundSelect').disabled = true
	}
	// Duration of stream
	localJSON('Config','v',['Duration_of_stream']) == 'Enable' ? doc('StreamDurationCheck').checked = true : doc('StreamDurationCheck').checked = false;
	
	doc('List_Format_List').value = localJSON('Config','v',['Format']);

	_gaq.push(['_trackEvent', 'Options', 'clicked'])
}

function openCloseReportAbug() {
	_gaq.push(['_trackEvent', 'Report a bug', 'clicked']);
	
	if ($('#userChangePopup').css('display') == 'block') {
		if (openCloseReportVar == 1) {
			doc("FoundAbugText").setAttribute('style','display:block;right:0;top:121');
			doc("fndAbug").setAttribute('style','right:39;top:190');
			openCloseReportVar = 0
		} else if (openCloseReportVar == 0) {
			doc("FoundAbugText").setAttribute('style','display:none');
			doc("fndAbug").setAttribute('style','display:block;top:190;right:-68')
			openCloseReportVar = 1
		}
	} else if ($('#AppChanges').css('display') == 'block') {
		if (openCloseReportVar == 1) {
			doc("FoundAbugText").setAttribute('style','display:block;right:0;top:121');
			doc("fndAbug").setAttribute('style','right:39;top:190');
			openCloseReportVar = 0
		} else if (openCloseReportVar == 0) {
			doc("FoundAbugText").setAttribute('style','display:none');
			doc("fndAbug").setAttribute('style','display:block;top:190;right:-68');
			openCloseReportVar = 1
		}
	}
}

function clickChangeUserCls() {
	Animation('userChangePopup', 'bounceOut', true);
	Animation('userChangePopup2', 'fadeOut', true);
	$('#fndAbug').hide();
	$('#FoundAbugText').hide();
	$('#AppVersion').show();
	openCloseReportVar = 1
}

function changeScriptStarter() {
	// User name
	if (doc("ChgUsrNam").value != localJSON('Config','v',['User_Name'])) {
		localStorage['FollowingList']='{}';
		localStorage['Following']=0;
		localJSON('Config','c',['User_Name',doc("ChgUsrNam").value]);
		localJSON('Status','c',['StopInterval',true]);
		doc('insertContentHere').innerHTML=null;
		InsertOnlineList();		
	} else if (doc("ChgUsrNam").value == '' || doc("ChgUsrNam").value==null || !doc("ChgUsrNam").value || doc("ChgUsrNam").value == 'Guest') {
		localJSON('Config','c',['User_Name','Guest']);
		localJSON('Status','c',['update',6]);
		doc('insertContentHere').innerHTML=null;
		InsertOnlineList();
		localStorage['FollowingList']='{}';
		localStorage['Following']=0;
	}
	// Interval of checking
	if (!isNaN(doc('ChgUsrInt').value) && localJSON('Config','v',['Interval_of_Checking']) != doc('ChgUsrInt')) {
		localJSON('Config','c',['Interval_of_Checking',Math.floor(doc("ChgUsrInt").value)]);
		localJSON('Status','c',['StopInterval',true])
	}
	// Notifications
	if (doc('EnNotify').checked) {localJSON('Config','c',['Notifications','status',true])} 
	else if (doc('DisNotify').checked) {localJSON('Config','c',['Notifications','status',false])};
	localJSON('Config','c',['Notifications','online',doc('NotifyStreamer').checked]);
	localJSON('Config','c',['Notifications','update',doc('NotifyStreamerChanged').checked]);
	localJSON('Config','c',['Notifications','follow',doc('NotifyUpdate').checked]);
	// Sound
	doc('SoundCheck').checked == true ? localJSON('Config','c',['Notifications','sound_status','Enable']) : localJSON('Config','c',['Notifications','sound_status','Disable']);
	localJSON('Config', 'c', ['Notifications','sound', doc("SoundSelect").value])
	// Duration of stream
	doc('StreamDurationCheck').checked == true ? localJSON('Config','c',['Duration_of_stream','Enable']) : localJSON('Config','c',['Duration_of_stream','Disable']);
	// Close options
	clickChangeUserCls();
	// Update style and list of online users
	localJSON('Config','c',['Format',doc('List_Format_List').value]);
	element = document.getElementsByTagName("style");	
	element[0].parentNode.removeChild(element[0]);	
	CSScompiler();
	InsertOnlineList();
}

function openFollowedList() {
	var NumberId = 1,
		Lines = 0;
	function FollowedChannelsList(content, status) {
		if (Lines == 22) {
			NumberId++;
			Lines = 0;
		}
		statusColor = status == 'Online' ? 'rgb(0, 194, 40)' : 'black';
		doc('IFCH_'+NumberId).innerHTML += '<div><a href="http://www.twitch.tv/'+content+'/profile" style="color:'+statusColor+';border-bottom:1px black dotted" target="_blank">'+content+'</a><br></div>';
		Lines++;
	}

	$('#firstScane').hide();
	Animation('FollowedChannelsList', 'fadeIn', false);

	_gaq.push(['_trackEvent', 'Following List', 'clicked']);
	
	for (var i=0;i<localJSON('Following');i++) {
		FollowingList('v',i)[1] != undefined ? p = "Online" : p = "Offline";
		FollowedChannelsList(FollowingList('v',i)[0], p)
	}
}

function closeFollowedList() {
	Animation('FollowedChannelsList', 'fadeOut', true);
	Animation('firstScane', 'fadeIn', false);
	doc('IFCH_1').innerHTML=null;
	doc('IFCH_2').innerHTML=null;
	doc('IFCH_3').innerHTML=null;
	doc('IFCH_4').innerHTML=null;
	doc('IFCH_5').innerHTML=null;
	doc('IFCH_6').innerHTML=null;
}

function openAppVersionChanges() {
	_gaq.push(['_trackEvent', 'App changes', 'clicked']);
	if (openCloseVersionVar == 1) {
		Animation('AppChanges', 'bounceInUp', false);
		Animation('AppInfoBack', 'fadeIn', false);
		doc("fndAbug").setAttribute('style', 'display:block;top:190;right:-68');
		doc('body').setAttribute('style', 'overflow:hidden');
		$('#AppVersion').hide();
		changeAppContent('AppFirst');
		openCloseVersionVar = 0
	} else if (openCloseVersionVar == 0) {
		Animation('AppChanges', 'bounceOutDown', true, function(){ $('#AppVersion').show() });
		Animation('AppInfoBack', 'fadeOut', true);
		$('#fndAbug').hide();
		$('#FoundAbugText').hide();
		doc('body').setAttribute('style', 'overflow:auto');
		openCloseVersionVar = 1
	}
}

function CloseAppVersionChanges() {
	Animation('AppChanges', 'bounceOutDown', true);
	Animation('AppInfoBack', 'fadeOut', true, function(){
		$('#FoundAbugText').hide();
		doc('body').setAttribute('style', 'overflow:auto')
	});
	Animation('fndAbug', 'fadeOut', true);
	Animation('AppVersion', 'fadeIn', false);
	openCloseVersionVar = 1
}

function changeAppContent(App) {
    if (App == 'AppFirst') {
        AppFirst = '';
        for (i = 0; i < changes.length; i++) AppFirst += "<div class='AppInfo'><a class='aAppInfo'> " + changes[i] + " </a></div>";
		Animation('AppVersionContent', ['fadeIn', 0.8], false);
		doc('AppVersionContent').innerHTML = AppFirst;
		doc('AppFirst').setAttribute('style','border-bottom:2px solid rgb(3,64,223)');
		doc('AppSecond').setAttribute('style','border-bottom:2px solid white');
		doc('AppThird').setAttribute('style','border-bottom:2px solid white');
		doc('AppInfoClose').setAttribute('style','border-bottom:2px solid white');
	} else if (App == 'AppSecond') {
		Animation('AppVersionContent', ['fadeIn', 0.8], false);
		AppSecond = '<div class="AppInfoFuture"><a class="aAppInfoFuture"> For now, nothing...</a></div>';
		doc('AppVersionContent').innerHTML = AppSecond;
		doc('AppFirst').setAttribute('style','border-bottom:2px solid white');
		doc('AppSecond').setAttribute('style','border-bottom:2px solid rgb(3,64,223)');
		doc('AppThird').setAttribute('style','border-bottom:2px solid white');
		doc('AppInfoClose').setAttribute('style','border-bottom:2px solid white');
	} else if (App == 'AppThird') {
		AppThird = '<div class="AppInfoAbout1"><a class="aAppInfoAbout1">This extension developed and published by</a></div>';
		AppThird += "<div class='AppInfoAbout2'><a class='aAppInfoAbout2'>Ivan 'MacRozz' Zarudny</a></div>";
		AppThird += "<div class='AppInfoAbout3'><a class='aAppInfoAbout3' href='http://www.mcrozz.net' target='_blank'>My website www.mcrozz.net</a></div>";
		AppThird += "<div class='AppInfoAbout4'><a class='aAppInfoAbout4' href='http://www.twitter.com/iZarudny' target='_blank'>Twitter @iZarudny</a></div>";
		AppThird += "<div class='AppInfoAbout5'><a class='aAppInfoAbout5' href='https://chrome.google.com/webstore/detail/twitchtv-notifier/mmemeoejijknklekkdacacimmkmmokbn/reviews' target='_blank'>Don't forget to rate my app ;)</a></div>";
		Animation('AppVersionContent', ['fadeIn', 0.8], false);
		doc('AppVersionContent').innerHTML = AppThird;
		doc('AppFirst').setAttribute('style','border-bottom:2px solid white');
		doc('AppSecond').setAttribute('style','border-bottom:2px solid white');
		doc('AppThird').setAttribute('style','border-bottom:2px solid rgb(3,64,223)');
		doc('AppInfoClose').setAttribute('style','border-bottom:2px solid white');
	}
}

function progressBar(type) {
	if (type == 'Enable') {
		$('#CheckingProgress').show();
		doc('CheckingProgress').value = Math.floor( (100 / localJSON('Following')) * localJSON('Status','v',['checked']) )
	} else if (type == 'Disable') {
		setTimeout(function(){ $('#CheckingProgress').hide() },800);
	}
}

document.addEventListener("DOMContentLoaded", function () {
	function ael(id, type, func) { var d = ['click', 'change', 'mouseover', 'onmouseout', 'onmousemove']; doc(id).addEventListener(d[type], func) }
	CSScompiler();
	versionCheck();
	doc('AppVersion').innerHTML = localJSON('App_Version', 'v', ['Ver']) + ' (changes)';
	ael('ChgUsr', 0, clickChangeUser);
	ael('ChgUsrSnd', 0, changeScriptStarter);
	ael('LstFlwdChnls', 0, openFollowedList);
	ael('ClsFlwdChnlsLst', 0, closeFollowedList);
	ael('Notify_All', 0, function () { doc('EnNotify').checked = true; doc('DisNotify').checked = false; doc('NotifyStreamer').disabled = false; doc('NotifyStreamerChanged').disabled = false; doc('NotifyUpdate').disabled = false });
	ael('DisNotify_All', 0, function () { doc('DisNotify').checked = true; doc('EnNotify').checked = false; doc('NotifyStreamer').disabled = true; doc('NotifyStreamerChanged').disabled = true; doc('NotifyUpdate').disabled = true });
	ael('Notify_Streamer', 0, function () { if (doc('NotifyStreamer').checked && !doc('NotifyStreamer').disabled) doc('NotifyStreamer').checked = false; else if (!doc('NotifyStreamer').disabled) doc('NotifyStreamer').checked = true });
	ael('NotifyStreamer', 0, function () { if (doc('NotifyStreamer').checked && !doc('NotifyStreamer').disabled) doc('NotifyStreamer').checked = false; else if (!doc('NotifyStreamer').disabled) doc('NotifyStreamer').checked = true });
	ael('Notify_Streamer_Changed', 0, function () { if (doc('NotifyStreamerChanged').checked && !doc('NotifyStreamerChanged').disabled) doc('NotifyStreamerChanged').checked = false; else if (!doc('NotifyStreamerChanged').disabled) doc('NotifyStreamerChanged').checked = true });
	ael('NotifyStreamerChanged', 0, function () { if (doc('NotifyStreamerChanged').checked && !doc('NotifyStreamerChanged').disabled) doc('NotifyStreamerChanged').checked = false; else if (!doc('NotifyStreamerChanged').disabled) doc('NotifyStreamerChanged').checked = true });
	ael('Notify_Upd', 0, function () { if (doc('NotifyUpdate').checked && !doc('NotifyUpdate').disabled) doc('NotifyUpdate').checked = false; else if (!doc('NotifyUpdate').disabled) doc('NotifyUpdate').checked = true });
	ael('NotifyUpdate', 0, function () { if (doc('NotifyUpdate').checked && !doc('NotifyUpdate').disabled) doc('NotifyUpdate').checked = false; else if (!doc('NotifyUpdate').disabled) doc('NotifyUpdate').checked = true });
	ael('Notify_Sound', 0, function () { if (doc('SoundCheck').checked) { doc('SoundCheck').checked = false; doc('SoundSelect').disabled = true } else { doc('SoundCheck').checked = true; doc('SoundSelect').disabled = false } });
	ael('SoundCheck', 0, function () { if (doc('SoundCheck').checked) { doc('SoundCheck').checked = false; doc('SoundSelect').disabled = true } else { doc('SoundCheck').checked = true; doc('SoundSelect').disabled = false } });
	ael('DurationOfStream', 0, function () { doc('StreamDurationCheck').checked ? doc('StreamDurationCheck').checked = false : doc('StreamDurationCheck').checked = true; });
	ael('StreamDurationCheck', 0, function () { doc('StreamDurationCheck').checked ? doc('StreamDurationCheck').checked = false : doc('StreamDurationCheck').checked = true; });
	ael('fndAbug', 0, openCloseReportAbug);
	ael('AppVersion', 0, openAppVersionChanges);
	ael('SoundSelect', 1, function () { var Audio = document.createElement('audio'); MusicName = '/Music/'+doc("SoundSelect").value+'.mp3'; Audio.setAttribute('src', MusicName); Audio.setAttribute('autoplay', 'autoplay'); Audio.play() });
	ael('AppFirst', 0, function () { changeAppContent('AppFirst') });
	ael('AppSecond', 0, function () { changeAppContent('AppSecond') });
	ael('AppThird', 0, function () { changeAppContent('AppThird') });
	ael('AppInfoClose', 0, CloseAppVersionChanges);
	ael('userChangePopup2', 0, clickChangeUserCls);
	ael('AppInfoBack', 0, CloseAppVersionChanges);
	ael('Dashboard', 0, function () { _gaq.push(['_trackEvent', 'Dashboard', 'clicked']); window.open('http://www.twitch.tv/broadcast/dashboard') });
	ael('Direct', 0, function () { _gaq.push(['_trackEvent', 'Direct', 'clicked']); window.open('http://www.twitch.tv/directory/following') });
	ael('SoundCheck', 0, function () { if (doc('SoundCheck').checked) { doc('SoundSelect').disabled = false } else { doc('SoundSelect').disabled = true } })
	ael('refresh', 0, function () { localJSON('Status', 'c', ['StopInterval', true]) });
	document.onmousemove = function(pos){
		var X = pos.x, Y = pos.y, left = 0, top = 0, offsetX = 15, width = doc('message').offsetWidth, height = doc('message').offsetHeight;
		697 - width - X < 0 ? left = 697 - width : left = X + offsetX;
		600 - height - Y < 0 ? top = Y - height - 5 : top = Y - height - 5;
		doc('message').style.left = left+'px';
		doc('message').style.top = top+'px';
	};
} );