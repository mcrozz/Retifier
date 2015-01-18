{{LICENSE_HEADER}}
$(window).on('load',function() {
	var TimersetToUpdate = [];

	function reloadStyle(l){
		var css;
		if (!local.Config.Format)
			localJSON('Config.Format', 'Grid');
		switch (local.Config.Format) {
			case 'Full':
				css = 'full'; break;
			case 'Light':
				css = 'mini'; break;
			case 'Grid':
				css = 'grid'; break;
		}
		$('#cust')[0].href = "./style/"+css+".css";
	}

	function clickChangeUserCls(e) {
		if (e && e.target.id !== 'options_bg')
			return false;
		Animation('options', ['bounceOut', true]);
		Animation('options_bg', ['fadeOut', true, 0.5]);
		Animation('AppVersion', ['fadeIn', false]);
		if ($('#fndAbug').css('-webkit-animation')[0] == 'o') {
			Animation('fndAbug', ['hideReportBtnA', true, 0.7]);
			Animation('FoundAbugText', ['hideReportA', true, 0.7]);
		} else {
			Animation('fndAbug', ['hideReportBtn', true, 0.9]);
			Animation('FoundAbugText', ['hideReport', true, 0.9]);
		}
	}

	function clickChangeUser() {
		$('#options, #options_bg').show();
		$('#AppVersion').hide();
		$('#UserName>a').html(local.Config.User_Name);
		doc('ChgUsrInt').value = local.Config.Interval_of_Checking;
		
		var a = !local.Config.Notifications.status;
		doc('.EnNotify').checked = !a;
		
		doc('.NotifyStreamerChanged').disabled = a;
		doc('.NotifyStreamer').disabled = a;
		doc('.NotifysStreamer').disabled = a;
		doc('.NotifyUpdate').disabled = a;

		doc('.NotifyStreamer').checked = local.Config.Notifications.online;
		doc('.NotifysStreamer').checked = local.Config.Notifications.offline;
		doc('.NotifyUpdate').checked = local.Config.Notifications.update;
		doc('.NotifyStreamerChanged').checked = local.Config.Notifications.follow;
	
		doc('.SoundCheck').checked = local.Config.Notifications.sound_status
		
		doc('.StreamDurationCheck').checked = local.Config.Duration_of_stream;

		doc('.List_Format>.'+local.Config.Format).className += ' selected';

		Animation('options_bg', ['fadeIn', false, 0.9]);
		Animation('options', ['bounceIn', false, 0.9]);
		doc('fndAbug').setAttribute("style","top:190;right:-68");
		Animation('fndAbug', ['showReportBtn', false, 0.8]);
		Animation('FoundAbugText', ['showReport', false, 0.8]);

		ga('send', 'event', 'button', 'click', 'Options');
	}

	function changeScriptStarter() {
		var g = Math.floor(doc('ChgUsrInt').value);
		if (!isNaN(g) && local.Config.Interval_of_Checking !== g && g >= 1) {
			localJSON('Config.Interval_of_Checking', g);
			localJSON('Status.StopInterval', true)
		}
		
		localJSON('Config.Notifications.status', doc('.EnNotify').checked);

		localJSON('Config.Notifications.online', doc('.NotifyStreamer').checked);
		localJSON('Config.Notifications.offline', doc('.NotifysStreamer').checked);
		localJSON('Config.Notifications.update', doc('.NotifyUpdate').checked);
		localJSON('Config.Notifications.follow', doc('.NotifyStreamerChanged').checked);
		
		localJSON('Config.Notifications.sound_status', doc('.SoundCheck').checked);
		
		localJSON('Config.Duration_of_stream', doc('.StreamDurationCheck').checked);
		
		var a = doc('.selected').className.split(' ')[1];
		if (local.Config.Format !== a) {
			localJSON('Config.Format', a);
			reloadStyle(true);
			texts = { d:new Date() };
		}

		clickChangeUserCls();
	}

	function ReportAbug() {
		ga('send', 'event', 'button', 'click', 'Report a bug');
		if ($('#fndAbug').css('-webkit-animation')[0] == 'c') {
			Animation('FoundAbugText', ['openReport', false, 0.8]);
			Animation('fndAbug', ['openReportBtn', false, 0.8]);
		} else {
			Animation('FoundAbugText', ['closeReport', false, 0.8]);
			Animation('fndAbug', ['closeReportBtn', false, 0.8]);
		}
	}

	function FollowedList(c) {
		function append(i,v) {
			var j = (v.Stream) ? "rgb(0, 194, 40)" : "black";
			$('#FollowingList').append('<a class="user" style="color:'+j+'" href="http://www.twitch.tv/'+v.Name+'/profile" target="_blank">'+v.Name+'</a>');
		}
		if (c.id === 'ClsFlwdChnlsLst') {
			clearInterval(flw);
			$('#FollowedChannelsList').fadeOut(250, function(){ $('#firstScane').fadeIn(250, function(){$('#FollowingList').html('');}) });
		} else {
			$.each(local.FollowingList, append);
			var curr = local.FollowingList.length;
			flw = setInterval(function(){
				if (curr !== local.FollowingList.length) {
					$('#FollowingList').html('');
					$.each(local.FollowingList, append);
					curr = local.FollowingList.length;
				} else {
					$.each($('#FollowingList>.user'), function(i,v){
						v.style.color = (local.FollowingList[i].Stream)?'rgb(0, 194, 40)':'black';
					});
				}
			}, 1000);
			$('#firstScane').fadeOut(250, function(){ $('#FollowedChannelsList').fadeIn(250); });
		}
	}

	function AppVersionChanges(c) {
		if (c=='c') {
			Animation('AppChanges', ['bounceOutDown', true]);
			Animation('AppInfoBack', ['fadeOut', true, 0.5], function(){ $('body').css('overflow', 'auto'); });
			if ($('#fndAbug').css('-webkit-animation')[0] == 'o') {
				Animation('fndAbug', ['hideReportBtnA', true, 0.7]);
				Animation('FoundAbugText', ['hideReportA', true, 0.7]);
			} else {
				Animation('fndAbug', ['hideReportBtn', true, 0.9]);
				Animation('FoundAbugText', ['hideReport', true, 0.9]);
			}
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

	function ael(id, type, func) { $(id).on(['click', 'change'][type], func); }
	reloadStyle();
	versionCheck();
	$('#AppVersion').html(local.App_Version.Ver);
	ael('#ChgUsr', 0, clickChangeUser);
	ael('#ChgUsrSnd', 0, changeScriptStarter);
	ael('#ClsFlwdChnlsLst, #LstFlwdChnls', 0, function(){
		FollowedList(this); });
	ael('.style', 0, function(t){
		var a = t.target.className.split(' ')[1],
			b = doc('.selected').className.split(' ')[1];
		doc('.selected').className = 'style '+b;
		doc('.'+a).className += ' selected'; });
	ael('.EnNotify', 0, function(t){
		if (t.target.checked) {
			$('#Notify>div').css('color', '');
			$('#Notify>div>input[type=checkbox]').each(function(e){this.disabled = false;})
		} else {
			$('#Notify>div').css('color', 'grey');
			$('#Notify>div>input[type=checkbox]').each(function(e){this.disabled = true;})
		} });
	ael('#options_bg', 0, clickChangeUserCls);
	ael('#options_bg', 0, function(e){
		if (doc('zoomContent')) {
			Animation('zoomContent', ['fadeOut', true, 0.7]);
			Animation('userChangePopup2', ['fadeOut', true, 0.5]);
		} });
	ael('#fndAbug', 0, ReportAbug);
	ael('#AppVersion', 0, function(){
		AppVersionChanges('o') });
	ael('#AppFirst', 0, function(){
		AppVersionChanges('ch') });
	ael('#AppThird', 0, function(){
		AppVersionChanges('ch') });
	ael('#AppInfoClose', 0, function(){
		AppVersionChanges('c') });
	ael('#AppInfoBack', 0, function(){
		AppVersionChanges('c') });
	ael('#Dashboard', 0, function(){
		ga('send', 'event', 'button', 'click', 'Dashboard');
		window.open('http://www.twitch.tv/broadcast/dashboard') });
	ael('#Direct', 0, function(){
		ga('send', 'event', 'button', 'click', 'Direct');
		window.open('http://www.twitch.tv/directory/following') });
	ael('#SoundCheck', 0, function(){
		doc('SoundSelect').disabled = !doc('SoundCheck').checked });
	ael('#refresh', 0, function(){
		localJSON('Status.StopInterval', true) });
	ael('#UserName>p', 0, reLogin);
	ael('#zoomContent', 0, function() {
		Animation('zoomContent', 'fadeOut', true);
		Animation('options_bg', 'fadeOut', true); });
	window.onclick = function(e) {
		var e = e.target;
		if (e.className === 'zoom') {
			var n = local.FollowingList[e.id.match(/\d+/)[0]].Name;
			$('#zoomIMG').css({
				'background': 'url(http://static-cdn.jtvnw.net/previews-ttv/live_user_'+n+'-640x400.jpg) no-repeat',
				'background-size': '696 400'
			});
			Animation('zoomContent', ['fadeIn', false, 0.8]);
			Animation('options_bg', ['fadeIn', false, 0.8]);
			doc('options_bg').onclick = function() {
				Animation('zoomContent', ['fadeOut', true, 0.7]);
			}
		}
	}
	document.onmousemove = function(p){
		if (!$.data(p.target, 'show')) {
			if ($('#message').css('display') === 'block')
				$('#message').css('display', 'none');
			return false;
		}
		if ($('#message').css('display') === 'none') {
			$('#message').html(p.target.innerText);
			$('#message').css('display', 'block');
		}
		if ($('#message').html() !== p.target.innerText)
			$('#message').html(p.target.innerText);
		var left, top, offsetX=10, width=doc('message').offsetWidth, height=doc('message').offsetHeight;
        left = (697-width-p.x-10 < 0) ? 697-width : p.x+offsetX;
        top = (600-height-p.y < 0) ? p.y-height-5 : p.y-height-5;
		doc('message').style.left = left+'px';
		doc('message').style.top = top+'px';
	}

	{{MSG_PARSER_POP_FUNC}}
});