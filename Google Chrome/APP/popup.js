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

var NumberOfidOfListOfFollowedChannels = 1,
	LinesInListOfFollowedChannels = 0;
TimersetToUpdate = [];
AddedEventListener = [];
FirstLoadVar = 1;
openCloseVersionVar = 1;
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
		css = '.StreamDuration {color:black;margin:0 0 0 17}';
		css += '.title {width:340px;height:30px;display:block;border-bottom:1px solid black;margin-bottom:5px}';
		css += 'button:focus {outline-color:rgba(255,255,255,0)}';
		css += '.streamer {width:150px;height:30px;display:block}';
		css += '.viewers {width:160px;height:30px;display:block;position:absolute;right:15;top:37;text-align:right}';
		css += '.gamename {width:340px;height:30px;display:block;margin-top:-6px;text-align:center;border-top:1px solid black}';
		css += '.pViewers {cursor:default;width:75px;display:inline;text-transform:lowercase;padding-left:5px;border:none}';
		css += '.content {height:200px;width:685px;padding:2;position:relative}';
		css += '#insertContentHere {max-height:100%;overflow:auto}';
		css += '.tumblr {background:url("/img/StillDownloading.gif");height:200px;width:320px;display:inline;position:absolute;margin-left:10px}';
		css += '.tumblr:hover::after {content:"Go to streaming page";width:317px;height:22px;z-index:1;position:absolute;left:1;top:168;text-align:center;color:rgba(255,255,255,0.5);padding:4 0;background:-webkit-gradient(linear,left top,left bottom,from(rgba(39, 39, 39, 0.66)),to(rgba(0, 0, 0, 0.85)));-webkit-animation-name:fadeIn;-webkit-animation-duration:0.5s}';
		css += '.information {width:345px;height:130px;display:inline;position:absolute;right:0;top:15}';
		css += '.informationTextTitle,.informationTextTitle2 {cursor:default;z-index:1;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);padding-top:6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:328px}';
		css += '.informationTextTitle:hover::after {content:attr(data-title);left:-1%;top:0%;width:322px;background:rgba(255,255,255,0.95);font-size:14px;padding:7 10;border:1px solid rgba(51, 51, 51, 0.34);-webkit-animation-name:fadeInDown;-webkit-animation-duration:0.2s;white-space:normal;display:block;position:absolute;font-size:17;z-index:1}';
		css += '.informationTextStreamer {cursor:pointer;font-size:16;color:black;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);margin-left:6}';
		css += '.informationTextViewers {cursor:default;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);width:75px;display:inline}';
		css += '.informationTextGame,.informationTextGame2 {cursor:pointer;font-size:16;color:black;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:340px;display:block;margin-top:5px}';
		css += '.informationTextGame:hover::after {content:attr(data-title);left:-1%;top:45%;width:322px;background:rgba(255,255,255,0.95);font-size:14px;padding:7 10;border:1px solid rgba(51, 51, 51, 0.34);-webkit-animation-name:fadeInDown;-webkit-animation-duration:0.2s;white-space:normal;display:block;position:absolute;font-size:17;z-index:1;text-align:center}';
		css += '.GameTumb1, .GameTumb2{width:43px;height:60px;position:absolute;margin:139 0 0 -44}';
		css += '.GameTumb1 {z-index:3}';
		css += '.GameTumb2 {z-index:2}';
		css += '.TumbStream {width:320px;height:200px}';
		css += '.StreamOnChannelPage {width:340px;height:40px;padding-top:2px}';
		css += '.StreamDurationDiv {width:170;height:40;position:absolute;right:16;top:96;text-align:right}';
		css += '.ChannelPageDiv {width:150;height:40;display:inline}';
		css += '.aFoundAbug {z-index:20;text-align:justify;font-size:21px;width:100%;display:block}';
		css += '.foundAbug {z-index:19;padding:37 5 13 5;position:absolute;width:98px;height:113px;background:-webkit-gradient(linear, left top, left bottom, from(rgba(1,1,1,0.8)),to(rgba(1,1,1,0.5)))}';
		css += 'button.button {color:black;text-decoration:none;font-size:22px;width:150px;height:30px;background:-webkit-gradient(linear,left top,left bottom,from(rgba(255, 255, 255, 0.73)),to(rgba(129, 129, 129, 0.64)))}';
	} else if (format == 'Mini') {
		css = '.StreamDuration {color:black;margin:0 0 0 17;font-size:19}';
		css += '.title {width:530px;height:20px;border-bottom:1px solid black;padding-bottom:3px}';
		css += '.streamer {width:230px;height:20px;display:inline}';
		css += 'button:focus {outline-color:rgba(255,255,255,0)}';
		css += '.viewers {width:150px;height:20px;display:inline;position:absolute;right:243;text-align:right;top:27}';
		css += '.gamename {width:200px;height:20px;display:inline;position:absolute;left:330;top:27}';
		css += '.pViewers {cursor:default;width:75px;padding-left:5px;display:inline;border:none}';
		css += '.content {height:90px;width:685px;padding:2;position:relative}';
		css += '#insertContentHere {max-height:100%;overflow:auto}';
		css += '.information {width:535px;height:80px;display:inline;position:absolute;right:0;top:6}';
		css += '.informationTextTitle,.informationTextTitle2 {cursor:default;display:-webkit-inline-flex;z-index:1;padding-left:5px;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:525px}';
		css += '.informationTextTitle:hover::after {content:attr(data-title);left:0%;top:-5%;z-index:5;width:512px;background:rgba(255,255,255,0.95);font-size:17px;padding:7 10;border:1px solid rgba(51, 51, 51, 0.34);-webkit-animation-name:fadeInDown;-webkit-animation-duration:0.2s;white-space:normal;display:block;position:absolute}';
		css += '.informationTextStreamer {cursor:pointer;font-size:16;color:black;display:inline;padding-left:5px;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);padding-left:5}';
		css += '.informationTextViewers {cursor:default;display:inline;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);padding-left:5}';
		css += '.informationTextGame,.informationTextGame2 {cursor:pointer;font-size:16;color:black;display:-webkit-inline-flex;padding-left:5px;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);padding-left:5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:195px}';
		css += '.informationTextGame:hover::after {content:attr(data-title);left:1%;top:-4%;z-index:5;width:177px;background:rgba(255,255,255,0.95);font-size:17px;padding:7 10;border:1px solid rgba(51, 51, 51, 0.34);-webkit-animation-name:fadeInDown;-webkit-animation-duration:0.2s;white-space:normal;display:block;position:absolute;text-align:center}';
		css += '.tumblr {background:url("/img/StillDownloading.gif");height:60px;width:90px;display:inline;position:absolute;margin:5 0 0 10}';
		css += '.GameTumb1, .GameTumb2{width:43px;height:60px;position:absolute;margin:0 0 0 1}';
		css += '.GameTumb1 {z-index:3}';
		css += '.GameTumb2 {z-index:2}';
		css += '.TumbStream {width:90px;height:60px}';
		css += '.StreamOnChannelPage {width:340px;height:40px;padding-top:2px}';
		css += '.StreamDurationDiv {width:160;height:22;position:absolute;right:20;top:45;text-align:right}';
		css += '.ChannelPageDiv {width:150;height:40;display:inline}';
        css += '.aFoundAbug {z-index:20;text-align:justify;font-size:21px;width:100%;display:block}';
        css += '.foundAbug {z-index:19;padding:37 5 13 5;position:absolute;width:98px;height:113px;background:-webkit-gradient(linear, left top, left bottom, from(rgba(1,1,1,0.8)),to(rgba(1,1,1,0.5)))}';
		css += 'button.button {color:black;text-decoration:none;font-size:18px;width:110px;height:22px;background:-webkit-gradient(linear,left top,left bottom,from(rgba(255, 255, 255, 0.73)),to(rgba(129, 129, 129, 0.64)))}';
	} else if (format == 'Grid') {
		css = '.StreamDuration {color:white;text-shadow: 1px 2px 3px black;margin:0 0 0 17}';
		css += '.title {width:315px;height:30px;display:block;border-bottom:1px solid black;margin-bottom:5px}';
		css += 'button:focus {outline-color:rgba(255,255,255,0)}';
		css += '.streamer {width:150px;height:30px;display:block}';
		css += '.viewers {width:160px;height:30px;display:block;position:absolute;right:3;top:37;text-align:right}';
		css += '.gamename {width:315px;height:30px;display:block;margin-top:-6px;text-align:center;border-top:1px solid black}';
		css += '.pViewers {cursor:default;width:75px;display:inline;text-transform:lowercase;padding-left:5px;border:none}';
		css += '.content {height:290px;width:330px;padding:2;position:relative;display:inline-block;margin-left:7}';
		css += '#insertContentHere {max-height:100%;overflow:auto}';
		css += '.tumblr {background:url("/img/StillDownloading.gif");height:200px;width:320px;display:inline;position:absolute;margin-left:10px}';
		css += '.tumblr:hover::after {content:"Go to streaming page";width:317px;height:22px;z-index:1;position:absolute;left:1;top:168;text-align:center;color:rgba(255,255,255,0.5);padding:4 0;background:-webkit-gradient(linear,left top,left bottom,from(rgba(39, 39, 39, 0.66)),to(rgba(0, 0, 0, 0.85)));-webkit-animation-name:fadeIn;-webkit-animation-duration:0.5s}';
		css += '.information {width:315px;height:90px;display:inline;position:absolute;left:15;top:200}';
		css += '.informationTextTitle,.informationTextTitle2 {cursor:default;z-index:1;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);padding-top:6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:315px}';
		css += '.informationTextTitle:hover::after {content:attr(data-title);left:-2%;top:0%;width:305px;background:rgba(255,255,255,0.95);font-size:14px;padding:7 10;border:1px solid rgba(51, 51, 51, 0.34);-webkit-animation-name:fadeInDown;-webkit-animation-duration:0.2s;white-space:normal;display:block;position:absolute;font-size:17;z-index:1}';
		css += '.informationTextStreamer {cursor:pointer;font-size:16;color:black;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);margin-left:3}';
		css += '.informationTextViewers {cursor:default;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);width:75px;display:inline}';
		css += '.informationTextGame,.informationTextGame2 {cursor:pointer;font-size:16;color:black;text-shadow:0px -1px 0px rgba(000,000,000,0.2),0px 1px 0px rgba(255,255,255,0.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:315px;display:block;margin-top:5px}';
		css += '.informationTextGame:hover::after {content:attr(data-title);left:-2%;top:65%;width:305px;background:rgba(255,255,255,0.95);font-size:14px;padding:7 10;border:1px solid rgba(51, 51, 51, 0.34);-webkit-animation-name:fadeInDown;-webkit-animation-duration:0.2s;white-space:normal;display:block;position:absolute;font-size:17;z-index:1;text-align:center}';
		css += '.GameTumb1, .GameTumb2{width:43px;height:60px;position:absolute;margin:139 0 0 -44}';
		css += '.GameTumb1 {z-index:3}';
		css += '.GameTumb2 {z-index:2}';
		css += '.TumbStream {width:320px;height:200px}';
		css += '.StreamOnChannelPage {width:315px;height:40px;position:absolute;top:-197;left:-2;text-align:center}';
		css += '.StreamDurationDiv {width:170;height:40;display:inline}';
		css += '.ChannelPageDiv {display:none}';
		css += '.aFoundAbug {z-index:20;text-align:justify;font-size:21px;width:100%;display:block}';
		css += '.foundAbug {z-index:19;padding:37 5 13 5;position:absolute;width:98px;height:113px;background:-webkit-gradient(linear, left top, left bottom, from(rgba(1,1,1,0.8)),to(rgba(1,1,1,0.5)))}';
		css += 'button.button {color:black;text-decoration:none;font-size:22px;width:150px;height:30px;background:-webkit-gradient(linear,left top,left bottom,from(rgba(255, 255, 255, 0.73)),to(rgba(129, 129, 129, 0.64)))}';
	}
	css += AddAnyways;
	if (style.styleSheet){style.styleSheet.cssText=css}else{style.appendChild(document.createTextNode(css));document.getElementsByTagName('head')[0].appendChild(style)}
	}
}

function clickChangeUser() {
	doc("userChangePopup").style.display='block';
	doc("userChangePopup2").setAttribute("style","display:block");
	doc("userChangePopup").setAttribute("style","left:173");
	doc("AppVersion").setAttribute("style","display:none");
	$('#userChangePopup2').removeClass('animated FadeOut');
	$('#userChangePopup2').addClass('animated FadeIn');
	$('#userChangePopup').removeClass('animated bounceOut');
	$('#userChangePopup').addClass('animated bounceIn');
	doc("ChgUsrNam").value=localJSON('Config','v',['User_Name']);
	doc("ChgUsrInt").value=localJSON('Config','v',['Interval_of_Checking']);
	doc('fndAbug').setAttribute("style","display:block;top:190;right:-68");
	changeNotify('Checking');
	checkSoundEnable('Checking');
	checkStreamDuration('Checking');
	doc('List_Format_List').value=localJSON('Config','v',['Format']);

	_gaq.push(['_trackEvent', 'Options', 'clicked'])
}

function clickChangeUserCls() {
	$('#userChangePopup').removeClass('animated bounceIn');
	$('#userChangePopup').addClass('animated bounceOut');
	$('#userChangePopup2').removeClass('animated FadeIn');
	$('#userChangePopup2').addClass('animated FadeOut');
	doc('fndAbug').setAttribute("style","display:none");
	doc("AppVersion").setAttribute("style","display:block");
	setTimeout(function(){
		doc("userChangePopup").style.display = 'none';
		doc("userChangePopup2").setAttribute("style","display:none");
		doc("FoundAbugText").setAttribute('style', 'display:none');
		openCloseReportVar = 1
	},800);
}

function changeUserName() {
	if (doc("ChgUsrNam").value != localJSON('Config','v',['User_Name'])) {
		localStorage['FollowingList']='{}';
		localStorage['Following']=0;
		localJSON('Config','c',['User_Name',doc("ChgUsrNam").value]);
		localJSON('Status','c',['StopInterval',true]);
		doc('insertContentHere').innerHTML=null;
		InsertOnlineList();		
	} if (doc("ChgUsrNam").value == ''||doc("ChgUsrNam").value==null||!doc("ChgUsrNam").value||doc("ChgUsrNam").value == 'Guest') {
		localJSON('Config','c',['User_Name','Guest']);
		localJSON('Status','c',['update',6]);
		doc('insertContentHere').innerHTML=null;
		InsertOnlineList();
		localStorage['FollowingList']='{}';
		localStorage['Following']=0;
	}
}

function changeNotify(type) {
	if (type == 'Change') {
		if (doc('EnNotify').checked) {localJSON('Config','c',['Notifications','status',true])} 
		else if (doc('DisNotify').checked) {localJSON('Config','c',['Notifications','status',false])};
		localJSON('Config','c',['Notifications','online',doc('NotifyStreamer').checked]);
		localJSON('Config','c',['Notifications','update',doc('NotifyStreamerChanged').checked]);
		localJSON('Config','c',['Notifications','follow',doc('NotifyUpdate').checked])		
	} else if (type == 'Checking') {
		if (localJSON('Config','v',['Notifications','status'])) {doc('EnNotify').checked=true;doc('DisNotify').checked=false;doc('NotifyStreamerChanged').disabled=false;doc('NotifyStreamer').disabled=false;doc('NotifyUpdate').disabled=false} 
		else {doc('EnNotify').checked=false;doc('DisNotify').checked=true;doc('NotifyStreamerChanged').disabled=true;doc('NotifyStreamer').disabled=true;doc('NotifyUpdate').disabled=true} 
		doc('NotifyStreamerChanged').checked = localJSON('Config','v',['Notifications','update']);
		doc('NotifyStreamer').checked = localJSON('Config','v',['Notifications','online']);
		doc('NotifyUpdate').checked = localJSON('Config','v',['Notifications','follow'])
	}
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

function checkSoundEnable(type) {
	if (type == 'Change') {
		if (doc('SoundCheck').checked) {
			localJSON('Config','c',['Notifications','sound_status','Enable'])
		} else if (!doc('SoundCheck').checked) {
			localJSON('Config','c',['Notifications','sound_status','Disable'])
		}
	} else if (type == 'Checking') {
		if (localJSON('Config','v',['Notifications','sound_status']) == 'Enable') {
			doc('SoundCheck').checked = true;
			doc('SoundSelect').disabled = false
		} else if (localJSON('Config','v',['Notifications','sound_status']) == 'Disable') {
			doc('SoundCheck').checked = false;
			doc('SoundSelect').disabled = true
		}
	}
}

function checkStreamDuration(type) {
	if (type == 'Change') {
		if (doc('StreamDurationCheck').checked) {localJSON('Config','c',['Duration_of_stream','Enable'])} 
		else if (!doc('StreamDurationCheck').checked) {localJSON('Config','c',['Duration_of_stream','Disable'])}
	} else if (type == 'Checking') {
		if (localJSON('Config','v',['Duration_of_stream']) == 'Enable') {doc('StreamDurationCheck').checked = true}
		else {doc('StreamDurationCheck').checked = false}
	}
}

function changeScriptStarter() {
	changeSoundFile('Change');
	changeUserName();
	if(!isNaN(doc('ChgUsrInt').value)&&localJSON('Config','v',['Interval_of_Checking'])!=doc('ChgUsrInt'))
		{localJSON('Config','c',['Interval_of_Checking',Math.floor(doc("ChgUsrInt").value)]);
		localJSON('Status','c',['StopInterval',true])}
	changeNotify('Change');
	checkSoundEnable('Change');
	checkStreamDuration('Change');
	clickChangeUserCls();
	localJSON('Config','c',['Format',doc('List_Format_List').value]);
	element = document.getElementsByTagName("style");
	element[0].parentNode.removeChild(element[0]);
	CSScompiler();
	InsertOnlineList();
}

function FollowedChannelsList(content,status) {
	if (LinesInListOfFollowedChannels == 22) {
		NumberOfidOfListOfFollowedChannels += 1;
		LinesInListOfFollowedChannels = 0} 
	else if (NumberOfidOfListOfFollowedChannels==4) {doc('FollowedChannelsList').style.overflow='auto'};
	if (status == 'Online') statusColor = 'rgb(0, 194, 40)'; else statusColor = 'black';

	idOfListOfFollowedChannels = 'InsertFollowedChannelsHere'+NumberOfidOfListOfFollowedChannels;
	TempVariable = doc(idOfListOfFollowedChannels).innerHTML;
	TempVariable += '<div><a href="http://www.twitch.tv/'+content+'/profile" style="color:'+statusColor+';border-bottom:1px black dotted" target="_blank">'+content+'</a><br></div>';
	doc(idOfListOfFollowedChannels).innerHTML = TempVariable;

	LinesInListOfFollowedChannels += 1
	// If 19 lines in current #div then change to next #div
	// "InsertFollowedChannelsHere" += Number (1 ~ 4)
}

function openFollowedList() {
	doc('InsertFollowedChannelsHere1').style.height='590px';
	doc('InsertFollowedChannelsHere2').style.height='590px';
	doc('InsertFollowedChannelsHere3').style.height='590px';
	doc('InsertFollowedChannelsHere4').style.height='590px';
	doc('InsertFollowedChannelsHere5').style.height='590px';
	doc('InsertFollowedChannelsHere6').style.height='590px';

	doc("firstScane").setAttribute("style","display:none");
	doc("FollowedChannelsList").style.display = 'block';
	doc("FollowedChannelsList").style.overflow = 'hidden';
	doc("FollowedChannelsList").style.height = '584px';
	$('#FollowedChannelsList').removeClass('animated fadeOut');
	$('#FollowedChannelsList').addClass('animated fadeIn');

	_gaq.push(['_trackEvent', 'Following List', 'clicked']);
	
	for (var i=0;i<localJSON('Following');i++) {
		if (FollowingList('v',i)[1]!=undefined) {p="Online"}else{p="Offline"};
		FollowedChannelsList(FollowingList('v',i)[0],p)
	}
}

function closeFollowedList() {
	$('#FollowedChannelsList').removeClass('fadeIn');
	$('#FollowedChannelsList').addClass('animated fadeOut');
	setTimeout(function(){
		doc("FollowedChannelsList").setAttribute("style","display:none");
		doc("firstScane").setAttribute("style","display:block");
		$('#firstScane').removeClass('animated fadeOut');
		$('#firstScane').addClass('animated fadeIn')
	});
	doc('InsertFollowedChannelsHere1').innerHTML=null;
	doc('InsertFollowedChannelsHere2').innerHTML=null;
	doc('InsertFollowedChannelsHere3').innerHTML=null;
	doc('InsertFollowedChannelsHere4').innerHTML=null;
	doc('InsertFollowedChannelsHere5').innerHTML=null;
	doc('InsertFollowedChannelsHere6').innerHTML=null;
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
        doc('fndAbug').setAttribute("style","display:block");
		doc("fndAbug").setAttribute('style', 'display:block;top:190;right:-68');
		doc('AppChanges').setAttribute('style', 'display:block');
		doc('body').setAttribute('style', 'overflow:hidden');
		doc("AppInfoBack").setAttribute("style","display:block");
		doc("AppVersion").setAttribute("style","display:none");
		changeAppContent('AppFirst');
		openCloseVersionVar = 0
	} else if (openCloseVersionVar == 0) {
		$('#AppChanges').removeClass('animated bounceInUp');
		$('#AppChanges').addClass('animated bounceOutDown');
		$('#AppInfoBack').removeClass('animated FadeIn');
		$('#AppInfoBack').addClass('animated FadeOut');
		doc("AppVersion").setAttribute("style","display:block");
		setTimeout(function(){
			doc('fndAbug').setAttribute("style","display:none");
			doc("FoundAbugText").setAttribute('style', 'display:none');
			doc('AppChanges').setAttribute('style', 'display:none');
			doc('body').setAttribute('style', 'overflow:auto');
			doc('fndAbug').setAttribute("style","display:none");
			doc("AppInfoBack").setAttribute("style","display:none")
		},800);
		openCloseVersionVar = 1
	}
}

function CloseAppVersionChanges() {
	$('#AppChanges').removeClass('animated bounceInUp');
	$('#AppChanges').addClass('animated bounceOutDown');
	$('#AppInfoBack').removeClass('animated FadeIn');
	$('#AppInfoBack').addClass('animated FadeOut');
	doc("AppVersion").setAttribute("style","display:block");
	doc('fndAbug').setAttribute("style","display:none");
	setTimeout(function(){
		doc("FoundAbugText").setAttribute('style', 'display:none');
		doc('AppChanges').setAttribute('style', 'display:none');
		doc('body').setAttribute('style', 'overflow:auto');
		doc("AppInfoBack").setAttribute("style","display:none")
	},800);
	openCloseVersionVar = 1
}

function changeAppContent(App) {
    if (App == 'AppFirst') {
        AppFirst = '';
        for (i = 0; i < changes.length; i++) AppFirst += "<div class='AppInfo'><a class='aAppInfo'> " + changes[i] + " </a></div>";

		$('#AppVersionContent').removeClass('animated bounceOutDown');
		$('#AppVersionContent').addClass('animated bounceOutDown');
		setTimeout(function(){
			doc('AppVersionContent').innerHTML = AppFirst;

			doc('AppFirst').setAttribute('style','border-bottom:2px solid rgb(3,64,223)');
			doc('AppSecond').setAttribute('style','border-bottom:2px solid white');
			doc('AppThird').setAttribute('style','border-bottom:2px solid white');
			doc('AppInfoClose').setAttribute('style','border-bottom:2px solid white');

			$('#AppVersionContent').removeClass('animated bounceOutDown');
			$('#AppVersionContent').removeClass('animated fadeIn');
			$('#AppVersionContent').addClass('animated fadeIn')
		},400)
	} else if (App == 'AppSecond') {
		AppSecond = '<div class="AppInfoFuture"><a class="aAppInfoFuture"> For now, nothing...</a></div>';

		$('#AppVersionContent').removeClass('animated bounceOutDown');
		$('#AppVersionContent').addClass('animated bounceOutDown');
		setTimeout(function(){
			doc('AppVersionContent').innerHTML = AppSecond;

			doc('AppFirst').setAttribute('style','border-bottom:2px solid white');
			doc('AppSecond').setAttribute('style','border-bottom:2px solid rgb(3,64,223)');
			doc('AppThird').setAttribute('style','border-bottom:2px solid white');
			doc('AppInfoClose').setAttribute('style','border-bottom:2px solid white');

			$('#AppVersionContent').removeClass('animated bounceOutDown');
			$('#AppVersionContent').removeClass('animated fadeIn');
			$('#AppVersionContent').addClass('animated fadeIn')
		},400)
	} else if (App == 'AppThird') {
		AppThird = '<div class="AppInfoAbout1"><a class="aAppInfoAbout1">This extension developed and published by</a></div>';
		AppThird += "<div class='AppInfoAbout2'><a class='aAppInfoAbout2'>Ivan 'MacRozz' Zarudny</a></div>";
		AppThird += "<div class='AppInfoAbout3'><a class='aAppInfoAbout3' href='http://www.mcrozz.net' target='_blank'>My website www.mcrozz.net</a></div>";
		AppThird += "<div class='AppInfoAbout4'><a class='aAppInfoAbout4' href='http://www.twitter.com/iZarudny' target='_blank'>Twitter @iZarudny</a></div>";
		AppThird += "<div class='AppInfoAbout5'><a class='aAppInfoAbout5' href='https://chrome.google.com/webstore/detail/twitchtv-notifier/mmemeoejijknklekkdacacimmkmmokbn/reviews' target='_blank'>Don't forget to rate my app ;)</a></div>";
		
		$('#AppVersionContent').removeClass('animated bounceOutDown');
		$('#AppVersionContent').addClass('animated bounceOutDown');
		setTimeout(function(){
			doc('AppVersionContent').innerHTML = AppThird;

			doc('AppFirst').setAttribute('style','border-bottom:2px solid white');
			doc('AppSecond').setAttribute('style','border-bottom:2px solid white');
			doc('AppThird').setAttribute('style','border-bottom:2px solid rgb(3,64,223)');
			doc('AppInfoClose').setAttribute('style','border-bottom:2px solid white');

			$('#AppVersionContent').removeClass('animated bounceOutDown');
			$('#AppVersionContent').removeClass('animated fadeIn');
			$('#AppVersionContent').addClass('animated fadeIn')
		},400)
	}
}

function changeSoundFile(type) {
	if (type != 'Change') {
		var Audio = document.createElement('audio');
		MusicName = '/Music/'+doc("SoundSelect").value+'.mp3';
		Audio.setAttribute('src', MusicName);
		Audio.setAttribute('autoplay', 'autoplay');
		Audio.play()
	} else if (type == 'Change'){
		localJSON('Config','c',['Notifications','sound',doc("SoundSelect").value])
	}
}

function progressBar(type) {
	if (type == 'Enable') {
		doc('CheckingProgress').setAttribute('style', 'display:block');
		doc('CheckingProgress').value = Math.floor( (100 / localJSON('Following')) * localJSON('Status','v',['checked']) )
	} else if (type == 'Disable') {
		setTimeout(function(){ doc('CheckingProgress').setAttribute('style', 'display:none') },800);
	}
}


document.addEventListener("DOMContentLoaded", function () {
    CSScompiler();
    versionCheck();
    doc('AppVersion').innerHTML = localJSON('App_Version', 'v', ['Ver']) + ' (changes)';
    doc("ChgUsr").addEventListener("click", clickChangeUser);
    doc("ChgUsrSnd").addEventListener("click", changeScriptStarter);
    doc("LstFlwdChnls").addEventListener("click", openFollowedList);
    doc("ClsFlwdChnlsLst").addEventListener("click", closeFollowedList);
    doc("Notify_All").addEventListener('click', function () { doc('EnNotify').checked = true; doc('DisNotify').checked = false; doc('NotifyStreamer').disabled = false; doc('NotifyStreamerChanged').disabled = false; doc('NotifyUpdate').disabled = false });
    doc("DisNotify_All").addEventListener('click', function () { doc('DisNotify').checked = true; doc('EnNotify').checked = false; doc('NotifyStreamer').disabled = true; doc('NotifyStreamerChanged').disabled = true; doc('NotifyUpdate').disabled = true });
    doc('Notify_Streamer').addEventListener('click', function () { if (doc('NotifyStreamer').checked && !doc('NotifyStreamer').disabled) doc('NotifyStreamer').checked = false; else if (!doc('NotifyStreamer').disabled) doc('NotifyStreamer').checked = true });
    doc('NotifyStreamer').addEventListener('click', function () { if (doc('NotifyStreamer').checked && !doc('NotifyStreamer').disabled) doc('NotifyStreamer').checked = false; else if (!doc('NotifyStreamer').disabled) doc('NotifyStreamer').checked = true });
    doc('Notify_Streamer_Changed').addEventListener('click', function () { if (doc('NotifyStreamerChanged').checked && !doc('NotifyStreamerChanged').disabled) doc('NotifyStreamerChanged').checked = false; else if (!doc('NotifyStreamerChanged').disabled) doc('NotifyStreamerChanged').checked = true });
    doc('NotifyStreamerChanged').addEventListener('click', function () { if (doc('NotifyStreamerChanged').checked && !doc('NotifyStreamerChanged').disabled) doc('NotifyStreamerChanged').checked = false; else if (!doc('NotifyStreamerChanged').disabled) doc('NotifyStreamerChanged').checked = true });
    doc('Notify_Upd').addEventListener('click', function () { if (doc('NotifyUpdate').checked && !doc('NotifyUpdate').disabled) doc('NotifyUpdate').checked = false; else if (!doc('NotifyUpdate').disabled) doc('NotifyUpdate').checked = true });
    doc('NotifyUpdate').addEventListener('click', function () { if (doc('NotifyUpdate').checked && !doc('NotifyUpdate').disabled) doc('NotifyUpdate').checked = false; else if (!doc('NotifyUpdate').disabled) doc('NotifyUpdate').checked = true });
    doc('Notify_Sound').addEventListener('click', function () { if (doc('SoundCheck').checked) { doc('SoundCheck').checked = false; doc('SoundSelect').disabled = true } else { doc('SoundCheck').checked = true; doc('SoundSelect').disabled = false } });
    doc('SoundCheck').addEventListener('click', function () { if (doc('SoundCheck').checked) { doc('SoundCheck').checked = false; doc('SoundSelect').disabled = true } else { doc('SoundCheck').checked = true; doc('SoundSelect').disabled = false } });
    doc('DurationOfStream').addEventListener('click', function () { doc('StreamDurationCheck').checked ? doc('StreamDurationCheck').checked = false : doc('StreamDurationCheck').checked = true; });
    doc('StreamDurationCheck').addEventListener('click', function () { doc('StreamDurationCheck').checked ? doc('StreamDurationCheck').checked = false : doc('StreamDurationCheck').checked = true; });
    doc("fndAbug").addEventListener("click", openCloseReportAbug);
    doc("AppVersion").addEventListener("click", openAppVersionChanges);
    doc("SoundSelect").addEventListener("change", changeSoundFile);
    doc("AppFirst").addEventListener("click", function () { changeAppContent('AppFirst') });
    doc("AppSecond").addEventListener("click", function () { changeAppContent('AppSecond') });
    doc("AppThird").addEventListener("click", function () { changeAppContent('AppThird') });
    doc("AppInfoClose").addEventListener("click", function () { CloseAppVersionChanges() });
    doc('userChangePopup2').addEventListener('click', function () { clickChangeUserCls() });
    doc('AppInfoBack').addEventListener('click', function () { CloseAppVersionChanges() });
    doc('Dashboard').addEventListener('click', function () { _gaq.push(['_trackEvent', 'Dashboard', 'clicked']); window.open('http://www.twitch.tv/broadcast/dashboard') });
    doc('Direct').addEventListener('click', function () { _gaq.push(['_trackEvent', 'Direct', 'clicked']); window.open('http://www.twitch.tv/directory/following') });
    doc("SoundCheck").addEventListener("click", function () { if (doc('SoundCheck').checked) { doc('SoundSelect').disabled = false } else { doc('SoundSelect').disabled = true } })
} );