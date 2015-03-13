{{LICENSE_HEADER}}
$(function() {
	var TimersetToUpdate = [];

	function reloadStyle(l){
		var s = window.screen, w, h, wp, hp;
		/*
		Aspect ratio 1.2
		Original size: 697px by 584px

		Maximum width is 700px
		Minimum width is 385px
		Maximum height is 585px
		Minimum height is 400px

		big: 35% by 54%
		mini: 25% by 47%
		micro: 18% by 38%
		custom: user's decision
    */
		switch (local.Config.Screen) {
			case 'big':
			default:
				wp = .35; hp = .54; break;
			case 'mini':
				wp = .25; hp = .47; break;
			case 'micro':
				wp = .18; hp = .38; break;
			case 'custom':
				if (local.Config.ScreenCustom) {
					var j = local.Config.ScreenCustom;
					wp = j[0]; hp = j[1];
				} else { wp = .35; hp = .54; }
				break;
		}
		w = s.availWidth*wp*1.2;
		h = s.availHeight*hp*1.2;
		w = w<385?385:w;
		h = h<400?400:h;
		$('style').html('html { width: '+(w>700?700:w)+'px; height: '+(h>585?585:h)+'px; }');

		$('#cust')[0].href = "./css/"+local.Config.Format.toLowerCase()+".css";
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
			local.set('Config.Interval_of_Checking', g);
			send('refresh');
		}

		local.set('Config.Notifications.status', _$('.EnNotify').checked);

		local.set('Config.Notifications.online', _$('.NotifyStreamer').checked);
		local.set('Config.Notifications.offline', _$('.NotifyStreamer2').checked);
		local.set('Config.Notifications.update', _$('.NotifyUpdate').checked);
		local.set('Config.Notifications.follow', _$('.NotifyStreamerChanged').checked);

		local.set('Config.Notifications.sound_status', _$('.SoundCheck').checked);

		local.set('Config.Duration_of_stream', _$('.StreamDurationCheck').checked);

		var a = _$('.selected').className.split(' ')[1];
		if (local.Config.Format !== a) {
			local.set('Config.Format', a);
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

	var flw = -1, curr;
	function FollowedList(c) {
		function insert() {
			$('#FollowingList').html('');
			$.each(local.FollowingList, function(i,v) {
				var j = (v.Stream) ? "rgb(0, 194, 40)" : "black", ht;
				ht  = '<div>';
				ht += '<a class="user" style="color:'+j+'" href="http://www.twitch.tv/'+v.Name+'/profile" target="_blank">'+v.Name+'</a>';
				ht += '<input type="checkbox" id="'+i+'" class="Check_Box_2">';
				ht += '</div>';
				$('#FollowingList').append(ht);
			});
			$('#FollowingList>div>input').on('click', function(e) {
				local.following(e.target.id, {Notify: e.target.checked});
			});
			$.each($('#FollowingList>div>input'), function(i,v) {
				v.checked = local.FollowingList[i].Notify;
			});
		}

		if (c.id === 'ClsFlwdChnlsLst') {
			clearInterval(flw);
			$('#FollowedChannelsList').fadeOut(250, function(){
				$('#firstScane').fadeIn(250, function(){
					$('#FollowingList').html('');
				});
			});
		} else {
			insert();
			curr = local.FollowingList.length;
			flw = setInterval(function(){
				if (curr !== local.FollowingList.length) {
					insert();
					curr = local.FollowingList.length;
				} else {
					$.each($('div>.user'), function(i,v){
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
	ael(window, function(e) {
		if (e.target.className === 'zoom') {
			var n = local.FollowingList[e.target.id.match(/\d+/)[0]].Name;
			$('#zoomIMG').css({
				'background': 'url(http://static-cdn.jtvnw.net/previews-ttv/live_user_'+n+'-640x400.jpg) no-repeat',
				'background-size': 'contain',
				'height': (WIDTH*.625)+'px'
			});
			$('#zoomContent').fadeIn(800);
			$('#options_bg').fadeIn(800);
			_$('options_bg').onclick = function() {
				$('#zoomContent').fadeOut(700);
			};
		}
	});
	$(document).on('mousemove', function(p) {
		function hide() {
			if (k.css('display') === 'block')
				k.css('display', 'none');
			return false;
		}
		var j = p.target.attributes.getNamedItem('show');
		var k = $('#message');
		if (j === null || typeof j === 'undefined')
			return hide();
		if (j.value == 'false')
			return hide();
		if (j.value != 'true')
			return false;

		if (k.css('display') === 'none') {
			k.html(p.target.innerText);
			k.css('display', 'block');
		}

		if (k.html() !== p.target.innerText)
			k.html(p.target.innerText);

		var left, top,
			tarH = $('#message').height();
			width=Math.floor($(window).width()/2),
			height=$(window).height();

		left = p.pageX<width ? 0 : width;
		top = (p.pageY+tarH)>height ? p.pageY-tarH-15 : p.pageY+5;

		k.css({
			left: left+'px',
			top: top+'px',
			width: width+'px'
		});
	});
	var WIDTH = $(window).width();
	$(window).on('resize', function(e) {
		WIDTH = $(window).width();
	});

	{{MSG_PARSER_POP_FUNC}}
});
