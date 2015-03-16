{{LICENSE_HEADER}}
$(function() {
	var TimersetToUpdate = [];

	function reloadStyle(l){
		/*
			Optional input
			l :: object {
				*size : array of integers,
				*format : string
			}
		*/
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
				hp = .54; break;
			case 'mini':
				hp = .47; break;
			case 'micro':
				hp = .38; break;
			case 'custom':
				hp = (local.Config.ScreenCustom) ? local.Config.ScreenCustom : .35;
				break;
		}
		if (l && l.size) {
			w = l.size[0];
			h = l.size[1];
		}
		else {
			h = s.availHeight*hp*1.2;
			w = h*1.2;
		}
		w = w<385?385:w;
		h = h<400?400:h;
		$('style').html('html {width:'+(w>700?700:w)+'px;height:'+(h>585?585:h)+'px;}');

		if (l && l.format)
			$('#cust')[0].href = "./css/"+l.format.toLowerCase()+".css";
		else
			$('#cust')[0].href = "./css/"+local.Config.Format.toLowerCase()+".css";
	}

	var Popup = {
		init: function(id, callback) {
			$('#popup').fadeIn(300);
			$(id).fadeIn(285);
			Popup.id = id;
			if (typeof callback === 'function')
				Popup.callback = callback;
		},
		close: function() {
			$('#popup').fadeOut(300);
			$('#AppVersion').fadeIn(1000);
			$(Popup.id).fadeOut(285);
			Popup.id = '';
		},
		clicked: function() {
			if (Popup.alerted)
				return Popup.onClose();

			if (typeof Popup.callback === 'function')
				Popup.callback();
			Popup.callback = null;
			Popup.close();
		},
		alert: function(par) {
			/*
				par :: object {
					header :: string,
					content :: html or DOM,
					onOk :: function,
					onClose :: function,
					showClose :: boolean,
					returns :: boolean
				}
			*/
			if (typeof par.onOk === 'function')
				Popup.onOk = par.onOk;
			if (typeof par.onClose === 'function')
				Popup.onClose = par.onClose;
			if (typeof par.returns === 'boolean')
				Popup.returns = par.returns;

			// hide current window
			if (Popup.id)
				$(Popup.id).hide();

			if (!Popup.returns) {
				Popup.id = '';
				Popup.callback = null;
			}

			$('.alert>header>p').html(par.header);
			$('.alert>div>div').html(par.content);
			$('.alert>footer>button[name=k]').css('width', par.showClose?'49%':'100%');
			$('.alert>footer>button[name=c]')[par.showClose?'show':'hide']();

			$('#AppVersion').fadeOut(1000);

			// show background
			if ($('#popup').css('display')[0] === 'n')
				$('#popup').fadeIn(300);

			$('.alert').fadeIn(285);
			Popup.alerted = true;
		},
		closeAlert: function() {
			// If clicked 'Cancel' or outside of window
			if (typeof Popup.onClose === 'function')
				Popup.onClose();

			Popup.onClose = null;
			Popup.alerted = false;

			$('.alert').fadeOut(285);
			if (Popup.returns) {
				Popup.returns = false;
				Popup.init(Popup.id, Popup.callback);
			} else
				$('#popup').fadeOut(300);

			if (!Popup.returns)
				$('#AppVersion').fadeIn(1000);
		},
		clickAlert: function() {
			// Clicked 'Ok'
			if (typeof Popup.onOk === 'function')
				Popup.onOk();

			Popup.onOk = null;

			Popup.closeAlert();
		},
		onOk: null,
		onClose: null,
		returns: false,
		callback: null,
		alerted: false,
		id: ''
	};

	function clickChangeUserCls() {
		reloadStyle();
	}

	function clickChangeUser() {
		Popup.init('#options', clickChangeUserCls);

		$('#UserName>p:nth-child(2)').html(local.Config.User_Name);
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

		$('.List_Format>div').each(function(i,e) {
			if ($.inArray(local.Config.Format, e.classList) === -1)
				e.className = e.className.replace(/ selected/g, '');
			else if ($.inArray('selected', e.classList) === -1)
				e.className+= ' selected';
		});

		$('#options_bg').fadeIn(900);
		anim('options', ['bounceIn', false, 0.9]);

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

		Popup.close();
	}

	function ReportAbug() {
		ga('send', 'event', 'button', 'click', 'Report a bug');
	}

	function FollowedList(chk) {
		function cr(n) { return document.createElement(n); }
		var flw = cr('div');
		$.each(local.FollowingList, function(i,v) {
			var hld = cr('div');

			var nm = cr('div');
			nm.className = 'user';
			var name = cr('a');
			name.innerHTML = v.d_name;
			name.href = 'http://www.twitch.tv/'+v.Name+'/profile'
			name.target = '_blank';
			name.style.color = (v.Stream) ? "rgb(0, 194, 40)" : "white";
			nm.appendChild(name);
			hld.appendChild(nm);

			if (chk) {
				var ch = cr('div');
				ch.className = 'checkBox';
				var check = cr('input');
				check.type = 'checkbox';
				check.id = i;
				check.className = 'Check_Box_2';
				check.checked = v.Notify;
				check.onClick = function(e) {
					local.following(e.target.id, {Notify: e.target.checked});
				};
				ch.appendChild(check);
				hld.appendChild(ch);
			}

			flw.appendChild(hld);
		});

		function saveList() {
			$('input[id].Check_Box_2').each(function(i,v) {
				if (local.FollowingList[v.id].Notify !== v.checked)
					local.following(v.id, {Notify: v.checked});
			});
		}

		Popup.alert({
			header: chk?'Receive notifications from':'Following list',
			content: flw,
			onOk: chk?saveList:null,
			returns: chk,
			showClose: chk
		});
	}

	function AppVersionChanges(c) {
		if (c=='c') {
			anim('AppChanges', ['bounceOutDown', true]);
			$('#AppInfoBack').fadeOut(500,
				function(){ $('body').css('overflow', 'auto'); });
			$('#AppVersion').fadeIn();
		} else if (c=='o') {
			anim('AppChanges', ['bounceInUp', false]);
			$('#AppInfoBack').fadeIn();
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
	ael('.settings', clickChangeUser);
	ael('#ChgUsrSnd', changeScriptStarter);
	ael('.following', function(){
		FollowedList(false); });
	ael('.style', function(t){
		var a = t.target.className.split(' ')[1],
			b = _$('.selected').className.split(' ')[1];
		_$('.selected').className = 'style '+b;
		_$('.'+a).className += ' selected';
		reloadStyle({format: a}); });
	ael('.EnNotify', function(t){
		if (t.target.checked) {
			$('#Notify>div').css('color', '');
			$('#Notify>div>input[type=checkbox]').each(function(e){this.disabled = false;});
		} else {
			$('#Notify>div').css('color', 'grey');
			$('#Notify>div>input[type=checkbox]').each(function(e){this.disabled = true;});
		} });
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
	ael('.directory', function(){
		ga('send', 'event', 'button', 'click', 'Direct');
		window.open('http://www.twitch.tv/directory/following'); });
	ael('#SoundCheck', function(){
		_$('SoundSelect').disabled = !_$('SoundCheck').checked; });
	ael('.NotificationsOpt', function() {
		FollowedList(true);} );
	ael('.refresh', function(){
		send('refresh'); });
	ael('#UserName>p', function(){
		Popup.close();
		reLogin(); });
	ael(window, function(e) {
		if (e.target.className === 'zoom') {
			var n = local.FollowingList[e.target.id.match(/\d+/)[0]].Name,
				w = WIDTH*.625;
			$('#zoomIMG').css({
				background: 'url(http://static-cdn.jtvnw.net/previews-ttv/live_user_'+n+'-640x400.jpg) no-repeat',
				backgroundSize: 'contain',
				height: w+'px',
				margin: ((HEIGHT-w)/2)+'px 0'
			});
			Popup.init('#zoomIMG');
		}
	});
	ael('#popup>.background', Popup.clicked);
	ael('#zoomIMG', Popup.close);
	ael('button[name=k]', Popup.clickAlert);
	ael('button[name=c]', Popup.closeAlert);
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
	window.WIDTH = $(window).width(),
	window.HEIGHT = $(window).height();
	$(window).on('resize', function(e) {
		WIDTH = $(window).width();
		HEIGHT = $(window).height();
	});

	{{MSG_PARSER_POP_FUNC}}
});
