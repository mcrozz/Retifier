{{LICENSE_HEADER}}
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
		if (Popup.alerted && typeof Popup.onClose === 'function')
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

$(function() {
	var style = {
		reload: function(l) {
			/*
				Optional input
				l :: object {
					*size : array of integers,
					*format : string
				}
			*/
			var s = window.screen, w, h, hp, fp, htm;

			hp = (l && l.size) ? l.size/100 : local.Config.Screen;
			style.size.current = hp*100;

			h = s.availHeight*hp;
			h = Math.floor(h);

			w = h*1.2;
			w = Math.floor(w);

			var add = 0;
			// normalize font size for Linux users
			if (navigator.platform[0].toLowerCase() === 'l')
			 add = -21;
			fp = (screen.pixelDepth*hp*10)+add;

			$('style').html('html {width:'+w+'px;height:'+h+'px;font-size:'+fp+'%!important;}');

			if (typeof safari !== 'undefined') {
				safari.self.width = w;
				safari.self.height = h;
			}

			var css = local.Config.Format.toLowerCase();
			if (l && l.format)
				css = l.format.toLowerCase();
			_$('#cust').href = './css/'+css+'.css';
		},
		size: {
			current: 0,
			// auto detected maximum and minimum size of extension
			MaxMin: [-1, -1],
			add: function() {
				var _this = style.size;
				if (isNaN(_this.current))
					_this.current = 0;

				_this.current>=_this.MaxMin[0] ? _this.current=_this.MaxMin[0] : _this.current+=1;

				style.reload({size: _this.current});
				$('#size>div').hide();
			},
			sub: function() {
				var _this = style.size;
				if (isNaN(_this.current))
					_this.current = 0;

				_this.current<=_this.MaxMin[1] ? _this.current=_this.MaxMin[1] : _this.current-=1;

				style.reload({size: _this.current});
				$('#size>div').hide();
			},
			save: function() {
				// Save it
				local.set('Config.Screen', style.size.current/100);
				// Close it
				Popup.close_();
				// Reload it
				if (typeof safari === 'undefined')
					location.reload();
			}
		}
	};

	function clickChangeUserCls() {
		style.reload();
	}

	function clickChangeUser() {
		Popup.init('.options', clickChangeUserCls);

		// Fix height of custom check boxes
		$('.toggle>.Check_Box').css('height', $('.toggle>.Check_Box')[0].offsetWidth*0.43+'px');
		$('li>.Check_Box_2').css('height', $('li>.Check_Box_2')[0].offsetWidth+'px');

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

		$('.options').anim('bounceIn', 0.9);

		ga('send', 'event', 'button', 'click', 'Options');
	}

	function changeScriptStarter() {
		local.set('Config.Notifications.status', _$('.EnNotify').checked);

		local.set('Config.Notifications.online', _$('.NotifyStreamer').checked);
		local.set('Config.Notifications.offline', _$('.NotifyStreamer2').checked);
		local.set('Config.Notifications.update', _$('.NotifyUpdate').checked);
		local.set('Config.Notifications.follow', _$('.NotifyStreamerChanged').checked);

		local.set('Config.Notifications.sound_status', _$('.SoundCheck').checked);

		local.set('Config.Duration_of_stream', _$('.StreamDurationCheck').checked);

		var g = Math.abs(_$('ChgUsrInt').value);
		if (isNaN(g))
			return Popup.close();
		if (local.Config.token && g < 0.5)
			return Popup.close();
		if (!local.Config.token && g < 1)
			return Popup.close();

		local.set('Config.Interval_of_Checking', g);
		send('refresh');
		Popup.close();
	}

	function FollowedHub() {
		if ($('#content>.following').css('display') === "block") {
			$('#content>.following>div:nth-child(2)').html('');
			$('#content>.following').hide();
			$('#content>.online').show();
			return;
		}

		function insert(obj, online) {
			var cell = c('div', {className: 'container'});
			if (obj.profile_banner !== null)
				cell.style.backgroundImage = "url("+obj.profile_banner+")";
			else
				cell.style.background = "-webkit-linear-gradient(top, #848484 0%,#7c7c7c 54%,#565656 100%)";
			if (obj.profile_banner_background_color !== null)
				cell.style.backgroundColor = obj.profile_banner_background_color;
			cell.style.backgroundSize = "cover";

			var d1 = c('div', {className: 'status'});
			
			var sta = c('div', {className: online?'online':'offline'});
			sta.innerText = (online)?'ONLINE':'OFFLINE';
			d1.appendChild(sta);

			var lgo = c('div', {className: 'logo'});
			var ilgo = c('img', {
				src: obj.logo, 
				href: "http://www.twitch.tv/"+obj.name+"/profile"});
			lgo.appendChild(ilgo);
			d1.appendChild(lgo);

			cell.appendChild(d1);

			
			var d2 = c('div');

			var str = c('div', {className: 'streamer'});
			var astr = c('a', {
				innerText: obj.display_name,
				href: "http://www.twitch.tv/"+obj.name+"/profile"});
			str.appendChild(astr);
			d2.appendChild(str);

			var spa = c('div', {className: 'spacer', innerText: ' '});
			d2.appendChild(spa);

			var sts = c('div', {className: 'stats'});
			var a1 = c('a', {innerText: "Followers: "+obj.followers});
			sts.appendChild(a1);
			var a2 = c('a', {innerText: "Views: "+obj.views});
			sts.appendChild(a2);
			d2.appendChild(sts);

			var btn = c('div', {className: 'buttons'});
			/*var b1 = c('button', {innerText: 'Detailed'});
			b1.onclick = function(e) {
				// TODO: open detailed information abuot this streamer
			}
			btn.appendChild(b1);
			// TODO: check if user auth'ed with token
			var b2 = c('button', {innerText: 'Unfollow'});
			btn.appendChild(b2);*/
			d2.appendChild(btn);

			cell.appendChild(d2);

			$('.following>div:nth-child(2)').append(cell);
		}

		$('#content>.online').css('display', 'none');
		$('#content>.following').css('display', 'block');

		$.each(local.FollowingList, function(i,v) {
			$.getJSON("https://api.twitch.tv/kraken/channels/"+v.Name.toLowerCase())
			.done(function(d) {
				insert(d, v.Stream);
			})
			.error(function(e) { err(e); });
		});
	}

	// TODO: get duration
	function HostedHub() {
		var hstd = c('div');
		function add(name, title, prev, views, game, dur, from, id) {
			var cell = c('div');
			cell.appendChild(str_cell({
				str: name.toLowerCase(),
				dsn: name,
				ttl: title,
				gme: game,
				viw: views,
				pos: id,
				isG: local.Game.list.indexOf(game)!=-1,
				txw: false,
				gmw: false,
				tme: time(dur)
			}));
			hstd.appendChild(cell);
		}

		// getting list of hosted channels
		$.getJSON("http://api.twitch.tv/api/users/"+local.Config.User+"/followed/hosting")
		.done(function(e) {
			$.each(e.hosts, function(i,v) {
				add(v.target.display_name,
					v.target.title,
					v.target.preview,
					v.target.viewers,
					v.target.meta_game,
					false,
					v.display_name,
					i);
			});
			$('#content>.host').append(hstd);
		})
		.error(function(e) {
			err(e);
			// Try to back it up after a second
			setTimeout(HostedHub, 1000);
		});
	}

	// TODO: use it only for notifications
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
				name.innerHTML = v.Name;
				name.href = 'http://www.twitch.tv/'+v.Name.toLowerCase()+'/profile'
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
					ch.appendChild(check);
					hld.appendChild(ch);
				}

				flw.appendChild(hld);
			});
		}

		function saveList() {
			$('input[id].Check_Box_2').each(function(i,v) {
				// if streeamer not in following list (e.g. somehow deleted)
				if (local.following.get(v.id) == null)
					return;

				local.following.set(v.id, {Notify: v.checked});
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
		if (chk)
			$('.Check_Box_2[id]').css('height', $('.Check_Box_2[id]')[0].offsetWidth+'px');
	}

	var AppVersion = {
		init: function() {
			AppVersion.changes();
			Popup.init('#AppChanges', function() {
				$('#AppChanges').anim('bounceOutUp', 1.2);
			});
			$('#AppChanges').anim('bounceInUp', 1.2);
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
				"<a href='{{LINK_REVIEW}}' target='_blank'>Don't forget to rate my app ;)</a>"+
				"<a>By installing this extension you are accepting Twitch's Terms of Service. Futher information can be found here: <a href='http://www.twitch.tv/p/tos'>http://www.twitch.tv/p/tos</a></div>");
		}
	}

	function ael(id, func) { $(id).on('click', func); }

	if (typeof safari !== 'undefined') {
		safari.application.addEventListener('popover', function(event) {
			event.target.contentWindow.location.reload();
		}, true);
	}

	// Init extension size
	style.reload();
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
		badge(curOnline);

		if (local.Status.online === 0)
			$('#content>.online').html('<div class="NOO"><a>No one online right now :(</a></div>');
	}, 0);
	$('#AppVersion').html(localStorage.App_Version);
	ael('.settings', clickChangeUser);
	ael('#ChgUsrSnd', changeScriptStarter);
	ael('button.following', function(){
		FollowedHub(); });
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
	ael('button.directory', function(){
		ga('send', 'event', 'button', 'click', 'Direct');
		window.open('http://www.twitch.tv/directory/following'); });
	ael('button.NotificationsOpt', function() {
		FollowedList(true);} );
	ael('.refresh', function(){
		send('getOnline'); });
	ael('button.Flush', function() {
		send('flush');
	});
	ael('#UserName>p', function(){
		Popup.close();
		reLogin(); });
	ael('button.ChangeSize', function() {
		style.size.MaxMin = [
			(600/screen.availHeight)*100,
			20
		];
		Popup.change('#size', true, function() {
			$('#size>div').show();
			style.reload();
		});
	});
	ael('p.Logout', function() {
		Popup.close();
		reLogin();
	});
	ael('.close>span', Popup.close);
	ael('span.cls', Popup.close_);
	ael('#size>.plus', style.size.add);
	ael('#size>.minus', style.size.sub);
	ael('#size>.ok', style.size.save);
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
			style.reload();
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
		style.reload({format: e.className});
		e.className = e.className+' selected';

		return true;
	});
	ael('#view>.ok', function() {
		local.set('Config.Format', $('#view>span.selected')[0].classList[0]);
		style.reload(); // Just in case
		Popup.close_();
	});
	ael('#popup>.background', Popup.clicked);
	ael('#zoomIMG', Popup.close);
	ael('button[name=k]', Popup.clickAlert);
	ael('button[name=c]', Popup.closeAlert);
	$('input#ChgUsrInt').on('change', function(e) {
		var v = Math.abs(e.target.value);
		if (isNaN(v) || v === 0)
			return $('input#ChgUsrInt').anim('pulse', 2.5);

		if (local.Config.token && v < .5) {
			e.target.value = 0.5;
			$('input#ChgUsrInt').anim('pulse', 2.5);
		} else if (!local.Config.token && v < 1) {
			e.target.value = 1;
			$('input#ChgUsrInt').anim('pulse', 2.5);
		}
	});
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

		var left, tops, tarH = popupMsg.height();

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
	$(document).on('keypress', function(e) {
		// TODO: make it proper
		// User pressed Esc or Backspace
		if (e.charCode === 27 || e.charCode === 8) {
			$('#content>.following>div:nth-child(2)').html('');
			$('#content>.following').hide();
			$('#content>.online').show();
		}
		e.preventDefault();
	});
});
