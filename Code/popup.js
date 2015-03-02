{{LICENSE_HEADER}}
$(function() {
	var TimersetToUpdate = [];

	function reloadStyle(l){
		// TODO: big, light, micro
		// big: 697px by 584px
		// light: 450px by 584px
		// micro: 340px by 584px
		$('style').html('html { width: 697px; height: 584px; }');
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
		$('#cust')[0].href = "./css/"+css+".css";
	}

	function clickChangeUserCls(e) {
		if (e && e.target.id !== 'options_bg')
			return false;
		anim('options', ['bounceOut', true]);
		$('#options_bg').fadeOut(500);
		$('#AppVersion').fadeIn(1000);
		if ($('#fndAbug').css('-webkit-animation')[0] == 'o') {
			anim('fndAbug', ['hideReportBtnA', true, 0.7]);
			anim('FoundAbugText', ['hideReportA', true, 0.7]);
		} else {
			anim('fndAbug', ['hideReportBtn', true, 0.9]);
			anim('FoundAbugText', ['hideReport', true, 0.9]);
		}
	}

	function clickChangeUser() {
		$('#options, #options_bg').show();
		$('#AppVersion').hide();
		$('#UserName>a').html(local.Config.User_Name);
		_$('ChgUsrInt').value = local.Config.Interval_of_Checking;

		var a = !local.Config.Notifications.status;
		_$('.EnNotify').checked = !a;

		_$('.NotifyStreamerChanged').disabled = a;
		_$('.NotifyStreamer').disabled = a;
		_$('.NotifyStreamer2').disabled = a;
		_$('.NotifyUpdate').disabled = a;

		_$('.NotifyStreamer').checked = local.Config.Notifications.online;
		_$('.NotifyStreamer2').checked = local.Config.Notifications.offline;
		_$('.NotifyUpdate').checked = local.Config.Notifications.update;
		_$('.NotifyStreamerChanged').checked = local.Config.Notifications.follow;

		_$('.SoundCheck').checked = local.Config.Notifications.sound_status;

		_$('.StreamDurationCheck').checked = local.Config.Duration_of_stream;

		_$('.List_Format>.'+local.Config.Format).className += ' selected';

		$('#options_bg').fadeIn(900);
		anim('options', ['bounceIn', false, 0.9]);
		_$('fndAbug').setAttribute("style","top:190;right:-68");
		anim('fndAbug', ['showReportBtn', false, 0.8]);
		anim('FoundAbugText', ['showReport', false, 0.8]);

		ga('send', 'event', 'button', 'click', 'Options');
	}

	function changeScriptStarter() {
		var g = Math.floor(_$('ChgUsrInt').value);
		if (!isNaN(g) && local.Config.Interval_of_Checking !== g && g >= 1) {
			localJSON('Config.Interval_of_Checking', g);
			localJSON('Status.StopInterval', true);
		}

		localJSON('Config.Notifications.status', _$('.EnNotify').checked);

		localJSON('Config.Notifications.online', _$('.NotifyStreamer').checked);
		localJSON('Config.Notifications.offline', _$('.NotifyStreamer2').checked);
		localJSON('Config.Notifications.update', _$('.NotifyUpdate').checked);
		localJSON('Config.Notifications.follow', _$('.NotifyStreamerChanged').checked);

		localJSON('Config.Notifications.sound_status', _$('.SoundCheck').checked);

		localJSON('Config.Duration_of_stream', _$('.StreamDurationCheck').checked);

		var a = _$('.selected').className.split(' ')[1];
		if (local.Config.Format !== a) {
			localJSON('Config.Format', a);
			reloadStyle(true);
			texts = { d:new Date() };
			snum();
		}

		clickChangeUserCls();
	}

	function ReportAbug() {
		ga('send', 'event', 'button', 'click', 'Report a bug');
		if ($('#fndAbug').css('-webkit-animation')[0] == 'c') {
			anim('FoundAbugText', ['openReport', false, 0.8]);
			anim('fndAbug', ['openReportBtn', false, 0.8]);
		} else {
			anim('FoundAbugText', ['closeReport', false, 0.8]);
			anim('fndAbug', ['closeReportBtn', false, 0.8]);
		}
	}

	function FollowedList(c) {
		function append(i,v) {
			var j = (v.Stream) ? "rgb(0, 194, 40)" : "black";
			$('#FollowingList').append('<a class="user" style="color:'+j+'" href="http://www.twitch.tv/'+v.Name+'/profile" target="_blank">'+v.Name+'</a>');
		}
		if (c.id === 'ClsFlwdChnlsLst') {
			clearInterval(flw);
			$('#FollowedChannelsList').fadeOut(250, function(){
				$('#firstScane').fadeIn(250, function(){
					$('#FollowingList').html('');
				});
			});
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
			anim('AppChanges', ['bounceOutDown', true]);
			$('#AppInfoBack').fadeOut(500,
				function(){ $('body').css('overflow', 'auto'); });
			if ($('#fndAbug').css('-webkit-animation')[0] == 'o') {
				anim('fndAbug', ['hideReportBtnA', true, 0.7]);
				anim('FoundAbugText', ['hideReportA', true, 0.7]);
			} else {
				anim('fndAbug', ['hideReportBtn', true, 0.9]);
				anim('FoundAbugText', ['hideReport', true, 0.9]);
			}
			$('#AppVersion').fadeIn();
		} else if (c=='o') {
			anim('AppChanges', ['bounceInUp', false]);
			$('#AppInfoBack').fadeIn();
			// FIXIT: must be percent
			_$('fndAbug').setAttribute('style', 'top:190px;right:-68px');
			anim('fndAbug', ['showReportBtn', false]);
			anim('FoundAbugText', ['showReport', false]);
			$('#AppVersion').fadeOut();
			$('body').css('overflow', 'hidden');
			$('#AppVersion').hide();
			CURRENT_APP_PAGE = 'About';
			AppVersionChanges('ch');
		} else if (c=='ch') {
			if (CURRENT_APP_PAGE == 'About') {
				var AppFirst = '';
				for (i = 0; i < changes.length; i++) AppFirst += "<div class='AppInfo'><a>"+changes[i]+"</a></div>";
				$('#AppVersionContent').fadeIn();
				_$('AppVersionContent').innerHTML = AppFirst;
				$('#AppFirst').css('border-bottom', '2px solid rgb(3,64,223)');
				$('#AppThird').css('border-bottom', '2px solid white');
				$('#AppInfoClose').css('border-bottom', '2px solid white');
				CURRENT_APP_PAGE = 'Changes';
			} else if (CURRENT_APP_PAGE == 'Changes') {
				_$('AppVersionContent').innerHTML = '<div class="AppInfoAbout1"><a class="aAppInfoAbout1">This extension developed and published by</a></div>'+
					"<div class='AppInfoAbout2'><a>Ivan 'MacRozz' Zarudny</a></div>"+
					"<div class='AppInfoAbout3'><a href='http://www.mcrozz.net' target='_blank'>My website www.mcrozz.net</a></div>"+
					"<div class='AppInfoAbout4'><a href='http://www.twitter.com/iZarudny' target='_blank'>Twitter @iZarudny</a></div>"+
					"<div class='AppInfoAbout5'><a href='{{LINK_REVIEW}}' target='_blank'>Don't forget to rate my app ;)</a></div>";
				$('#AppVersionContent').fadeIn();
				$('#AppFirst').css('border-bottom', '2px solid white');
				$('#AppThird').css('border-bottom', '2px solid rgb(3,64,223)');
				$('#AppInfoClose').css('border-bottom', '2px solid white');
				CURRENT_APP_PAGE = 'About';
			}
		}
	}

	function ael(id, func) { $(id).on('click', func); }
	reloadStyle();
	versionCheck();
	$('#AppVersion').html(local.App_Version.Ver);
	ael('#ChgUsr', clickChangeUser);
	ael('#ChgUsrSnd', changeScriptStarter);
	ael('#ClsFlwdChnlsLst, #LstFlwdChnls', function(){
		FollowedList(this); });
	ael('.style', function(t){
		var a = t.target.className.split(' ')[1],
			b = _$('.selected').className.split(' ')[1];
		_$('.selected').className = 'style '+b;
		_$('.'+a).className += ' selected'; });
	ael('.EnNotify', function(t){
		if (t.target.checked) {
			$('#Notify>div').css('color', '');
			$('#Notify>div>input[type=checkbox]').each(function(e){this.disabled = false;});
		} else {
			$('#Notify>div').css('color', 'grey');
			$('#Notify>div>input[type=checkbox]').each(function(e){this.disabled = true;});
		} });
	ael('#options_bg', clickChangeUserCls);
	ael('#options_bg', function(e){
		if (_$('zoomContent')) {
			$('#zoomContent').fadeOut(700);
			$('#userChangePopup2').fadeOut(500);
		} });
	ael('#fndAbug', ReportAbug);
	ael('#AppVersion', function(){
		AppVersionChanges('o'); });
	ael('#AppFirst', function(){
		AppVersionChanges('ch'); });
	ael('#AppThird', function(){
		AppVersionChanges('ch'); });
	ael('#AppInfoClose', function(){
		AppVersionChanges('c'); });
	ael('#AppInfoBack', function(){
		AppVersionChanges('c'); });
	ael('#Dashboard', function(){
		ga('send', 'event', 'button', 'click', 'Dashboard');
		window.open('http://www.twitch.tv/broadcast/dashboard'); });
	ael('#Direct', function(){
		ga('send', 'event', 'button', 'click', 'Direct');
		window.open('http://www.twitch.tv/directory/following'); });
	ael('#SoundCheck', function(){
		_$('SoundSelect').disabled = !_$('SoundCheck').checked; });
	ael('#refresh', function(){
		send('refresh'); });
	ael('#UserName>p', reLogin);
	ael('#zoomContent', function() {
		$('#zoomContent').fadeOut(700);
		$('#options_bg').fadeOut(1);} );
	window.onclick = function(e) {
		if (e.target.className === 'zoom') {
			var n = local.FollowingList[e.target.id.match(/\d+/)[0]].Name;
			$('#zoomIMG').css({
				'background': 'url(http://static-cdn.jtvnw.net/previews-ttv/live_user_'+n+'-640x400.jpg) no-repeat',
				'background-size': '696 400'
			});
			$('#zoomContent').fadeIn(800);
			$('#options_bg').fadeIn(800);
			_$('options_bg').onclick = function() {
				$('#zoomContent').fadeOut(700);
			};
		}
	};
	$(document).on('mousemove', function(p) {
		function hide() {
			if ($('#message').css('display') === 'block')
				$('#message').css('display', 'none');
			return false;
		}
		var j = p.target.attributes.getNamedItem('show');
		if (j === null || typeof j === 'undefined')
			return hide();
		if (j.value == 'false')
			return hide();
		if (j.value != 'true')
			return false;

		if ($('#message').css('display') === 'none') {
			$('#message').html(p.target.innerText);
			$('#message').css('display', 'block');
		}

		if ($('#message').html() !== p.target.innerText)
			$('#message').html(p.target.innerText);

		var left, top, offsetX=10, width=_$('message').offsetWidth, height=_$('message').offsetHeight;
        left = (697-width-p.x-10 < 0) ? 697-width : p.x+offsetX;
        top = (600-height-p.y < 0) ? p.y-height-5 : p.y-height-5;
		$('#message').css({
			left: left+'px',
			top: top+'px'
		});
	});

	{{MSG_PARSER_POP_FUNC}}
});
