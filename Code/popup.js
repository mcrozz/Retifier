{{LICENSE_HEADER}}
$(function() {
	var pcH;

	function add() {
		if (!isNaN(pcH)) {
			pcH>=54 ? pcH=54 : pcH+=1;
		}
		reloadStyle({size: pcH});
		$('#size>div').hide();
	}
	function sub() {
		if (!isNaN(pcH)) {
			pcH<=30 ? pcH=30 : pcH-=1;
		}
		reloadStyle({size: pcH});
		$('#size>div').hide();
	}
	function sizeSave() {
		// Save it
		local.set('Config.Screen', pcH/100);
		// Close it
		Popup.close_();
		// Reload it
		location.reload();
	}

	function reloadStyle(l){
		/*
			Optional input
			l :: object {
				*size : array of integers,
				*format : string
			}
		*/
		var s = window.screen, w, h, hp, fp, htm;
		/*
		Aspect ratio 1.2
		Original size: 697px by 584px

		width [385, 700]
		height [400, 585]
    */

		hp = (l && l.size) ? l.size/100 : local.Config.Screen;
		pcH = hp*100;

		h = s.availHeight*hp;
		w = h*1.2;
		w = w<385?385:w;
		w = w>700?700:w;
		w = Math.floor(w);
		h = h<400?400:h;
		h = h>585?585:h;
		h = Math.floor(h);

		var add = 0;
		// normalize font size for Linux users
		if (navigator.platform[0].toLowerCase() === 'l')
		 add = -21;
		fp = (screen.pixelDepth*hp*10)+add;

		htm = 'html {width:'+w+'px;height:'+h+'px;font-size:'+fp+'%!important;}';
		htm+= '#size>span{height:'+(h*.142)+'px;}';
		htm+= '.Check_Box, .Check_Box_2 {height:'+(h*.0379)+'px}';
		$('style').html(htm);

		if (l && l.format)
			$('#cust')[0].href = "./css/"+l.format.toLowerCase()+".css";
		else
			$('#cust')[0].href = "./css/"+local.Config.Format.toLowerCase()+".css";
	}

	var Popup = {
		init: function(id, callback) {
			$('#AppVersion').fadeOut(1000);
			$('#popup').fadeIn(300);
			$(id).fadeIn(285);
			Popup.id = id;
			if (typeof callback === 'function')
				Popup.callback = callback;
		},
		change: function(id, returns, callback) {
			if (typeof returns === 'boolean')
				Popup.returns = returns;
			if (typeof callback === 'function')
				Popup.onClose = callback;

			Popup.id_ = id;
			$(id).fadeIn(500);
			$(Popup.id).fadeOut(284);
		},
		close_: function() {
			$(Popup.id_).fadeOut(280);
			if (Popup.returns)
				Popup.init(Popup.id, Popup.callback);

			if (typeof Popup.onClose === 'function')
				Popup.onClose();

			Popup.id_ = '';
			Popup.onClose = null;
			Popup.returns = false;
		},
		close: function() {
			$('#AppVersion').fadeIn(1000);
			$('#popup').fadeOut(300);
			$('#AppVersion').fadeIn(1000);
			$(Popup.id).fadeOut(285);
			Popup.id = '';
		},
		clicked: function() {
			if (Popup.id_)
				return Popup.close_();
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

			// show background
			if ($('#popup').css('display')[0] === 'n')
				$('#popup').fadeIn(300);

			$('#AppVersion').fadeOut(1000);
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
				return Popup.init(Popup.id, Popup.callback);
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
		id: '',
		id_: ''
	};

	function clickChangeUserCls() {
		reloadStyle();
	}

	function clickChangeUser() {
		Popup.init('.options', clickChangeUserCls);

		$('#user>a:nth-child(2)').html(local.Config.User_Name);
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

		Popup.close();
	}

	function FollowedList(chk) {
		function cr(n) { return document.createElement(n); }
		var flw = cr('div');

		if (chk) {
			var d = cr('div');

			var b1 = cr('button');
			b1.innerHTML = 'Show online';
			b1.name = 'Select1';
			b1.onclick = function(e) {
				if (e.target.innerHTML === 'Show online') {
					e.target.innerHTML = 'Show all';
					$('.alert>div>div>div>div').each(function(i,v) {
						if (v.childNodes[0].tagName === 'BUTTON')
							return;
						if (v.childNodes[0].childNodes[0].style.color === 'white')
							v.remove();
					});
				} else {
					e.target.innerHTML = 'Show online';
					$('.alert>div>div>div>div').each(function(i,v) {
						if (v.childNodes[0].tagName === 'BUTTON')
							return;
						v.remove();
					});
					insert();
				}
			};

			var b2 = cr('button');
			b2.innerHTML = 'Deselect all';
			b2.name = 'Select2';
			b2.onclick = function(e) {
				if (e.target.innerHTML === 'Deselect all') {
					e.target.innerHTML = 'Select all';
					$('.alert>div>div>div>div>div.checkBox>input').each(function(i,v) {
						v.checked = false;
					});
				} else {
					e.target.innerHTML = 'Deselect all';
					$('.alert>div>div>div>div>div.checkBox>input').each(function(i,v) {
						v.checked = true;
					});
				}
			};

			d.appendChild(b1);
			d.appendChild(b2);
			flw.appendChild(d);
		}

		function insert() {
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
		}

		function saveList() {
			$('input[id].Check_Box_2').each(function(i,v) {
				if (local.FollowingList[v.id].Notify !== v.checked)
					local.following(v.id, {Notify: v.checked});
			});
		}

		insert();

		Popup.alert({
			header: chk?'Receive notifications from':'Following list',
			content: flw,
			onOk: chk?saveList:null,
			returns: chk,
			showClose: chk
		});
	}

	var AppVersion = {
		init: function() {
			AppVersion.changes();
			Popup.init('#AppChanges', function() {
				// $('')
			});
		},
		changes: function() {
			var data = '';
			for (i=0; i<changes.length; i++)
				data += "<div class='AppInfo'><a>"+changes[i]+"</a></div>";
			$('#AppVersionContent').html(data);
		},
		about: function() {
			$('#AppVersionContent').html('<div class="AppInfoAbout"><a>This extension developed and published by</a>'+
				"<a>Ivan 'MacRozz' Zarudny</a>"+
				"<a href='http://www.mcrozz.net' target='_blank'>My website www.mcrozz.net</a>"+
				"<a href='http://www.twitter.com/iZarudny' target='_blank'>Twitter @iZarudny</a>"+
				"<a href='{{LINK_REVIEW}}' target='_blank'>Don't forget to rate my app ;)</a></div>");
		}
	}

	function ael(id, func) { $(id).on('click', func); }
	// Init extension size
	reloadStyle();
	// Insert current status
	updateStatus();
	setTimeout(function() {
		if (localStorage.FirstLaunch === 'true')
			return;

		// Get working code of background script
		send({type: "getInf"}, function(e) {
			if (!e) return;
			switch(e.data) {
				case 777:
					// Invalid token
					var htm = "<a>Your access token is invalid, but don't worry.</a>";
							htm+= "<a>Something may happen at TwitchTV</a>";
							htm+= "<a>Just click 'Ok' and relogin into your account</a>";
					Popup.alert({
						header: "Token is invalid",
						content: htm,
						onOk: reLogin,
						onClose: reLogin,
						showClose: false
					});
					break;
				case 123:
					// Update
					Popup.alert({
						header: newUpdate.msg,
						content: newUpdate.content,
						showClose: false
					});
					break;
			}
		});

		// Insert online list
		var curOnline = 0;
		$.each(local.FollowingList, function(i,v) {
			if (v.Stream) {
				insert(v);
				curOnline++;
			}
		});
		// In case of incorrect online count
		if (local.Status.online !== curOnline)
			local.set('Status.online', curOnline);

		if (local.Status.online === 0)
			$('#insertContentHere').html('<div class="NOO"><a>No one online right now :(</a></div>');
	}, 0);
	$('#AppVersion').html(localStorage.App_Version);
	ael('.settings', clickChangeUser);
	ael('#ChgUsrSnd', changeScriptStarter);
	ael('.following', function(){
		FollowedList(false); });
	ael('.EnNotify', function(t){
		if (t.target.checked) {
			$('.options>div>li>a').css('color', '');
			$('li>input.Check_Box_2').each(function(e) {
				this.disabled = false;});
		} else {
			$('.options>div>li>a').css('color', 'grey');
			$('li>input.Check_Box_2').each(function(e) {
				this.disabled = true;});
		} });
	ael('#AppVersion', AppVersion.init);
	ael('button.About', AppVersion.about);
	ael('button.Changes', AppVersion.changes);
	ael('button.Close', Popup.close);
	ael('#Dashboard', function(){
		ga('send', 'event', 'button', 'click', 'Dashboard');
		window.open('http://www.twitch.tv/broadcast/dashboard'); });
	ael('.directory', function(){
		ga('send', 'event', 'button', 'click', 'Direct');
		window.open('http://www.twitch.tv/directory/following'); });
	ael('#SoundCheck', function(){
		_$('SoundSelect').disabled = !_$('SoundCheck').checked; });
	ael('button.NotificationsOpt', function() {
		FollowedList(true);} );
	ael('.refresh', function(){
		send('refresh'); });
	ael('#UserName>p', function(){
		Popup.close();
		reLogin(); });
	ael('button.ChangeSize', function() {
		Popup.change('#size', true, function() {
			$('#size>div').show();
			reloadStyle();
		});
	});
	ael('p.Logout', function() {
		Popup.close();
		reLogin();
	});
	ael('.close>span', Popup.close);
	ael('span.cls', Popup.close_);
	ael('#size>.plus', add);
	ael('#size>.minus', sub);
	ael('#size>.ok', sizeSave);
	ael('button.OnlineStyle', function() {
		// Show current style of online list
		$('#view>span').each(function(i,v) {
			if (v.className === local.Config.Format)
				v.className = v.className+' selected';
		});
		Popup.change('#view', true, function() {
			$('#view>span').each(function(i,v) {
				v.className = v.className.replace(' selected', '');
			});
			reloadStyle();
		});
	});
	ael('#view>span', function(e) {
		// Execute Close and Ok buttons
		e = e.target;
		if ($.inArray(e.className, ['cls', 'ok']) !== -1)
			return;

		// Delete selected property from others
		$('#view>span').each(function(i,v) {
			if (v.className !== e.className)
				v.className = v.className.replace(' selected', '');
		});
		reloadStyle({format: e.className});
		e.className = e.className+' selected';

		return true;
	});
	ael('#view>.ok', function() {
		local.set('Config.Format', $('#view>span.selected')[0].classList[0]);
		reloadStyle(); // Just in case
		Popup.close_();
	});
	ael(window, function(e) {
		if (e.target.className === 'zoom') {
			var n = local.following.get(e.target.id.replace('zoom_', '')).Name;
			$('#zoomIMG').css({
				background: 'url(http://static-cdn.jtvnw.net/previews-ttv/live_user_'+n+'-640x400.jpg) no-repeat',
				backgroundSize: 'contain'
			});
			Popup.init('#zoomIMG');
		}
	});
	ael('#popup>.background', Popup.clicked);
	ael('#zoomIMG', Popup.close);
	ael('button[name=k]', Popup.clickAlert);
	ael('button[name=c]', Popup.closeAlert);
	var popupMsg = $('#message');
	$(document).on('mousemove', function(p) {
		function hide() {
			if (popupMsg.css('display') === 'block')
				return popupMsg.hide();
		}
		var j = p.target.attributes.getNamedItem('show');
		if (!j)
			return hide();
		if (j.value == 'false')
			return hide();
		if (j.value != 'true')
			return false;

		if (popupMsg.css('display') === 'none') {
			popupMsg.html(p.target.innerText);
			popupMsg.show();
		}

		if (popupMsg.html() !== p.target.innerText)
			popupMsg.html(p.target.innerText);

		var left, top, tarH = popupMsg.height();

		left = p.pageX<(WIDTH/2) ? 1.5 : 50;
		tops = (p.pageY+tarH)>HEIGHT ? p.pageY-tarH-15 : p.pageY+5;

		popupMsg.css({
			top: tops+'px',
			left: left+'%'
		});
	});
	window.HEIGHT = $(window).height();
	window.WIDTH = $(window).width();
	$(window).on('resize', function(e) {
		HEIGHT = $(window).height();
		WIDTH = $(window).width();
	});

	{{MSG_PARSER_POP_FUNC}}
});
