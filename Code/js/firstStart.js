{{LICENSE_HEADER}}
function reLogin() {
	local.set('Config.User_Name', 'Guest');
	local.set('Config.token', '');
	local.set('Status.update', 7);
	local.set('Status.online', 0);
	badge(' Hi ');
	localStorage.FollowingList='{}';
	localStorage.Following='0';
	localStorage.FirstLaunch='true';
	localStorage.Games = '[]';
	localStorage.timeOut = '{}';
	TimersetToUpdate=[];
	send({type: 'update', data: -1});
	setTimeout(lgin, 100);
}

function logged() {
	$('button.dash').each(function(i,v) {v.disabled = false;});
	$('#content>.online').html('');
	$('#FollowedChannelsOnline').html("Please wait a moment");
}

function lgin() {
	if (localStorage.FirstLaunch !== 'true')
		return false;

	function cr(n) { return document.createElement(n); }

	local.set('Status.update', 7);
	$('#FollowedChannelsOnline').html("Greetings!");
	$('button.dash').each(function(i,v) {v.disabled = true;});

	var hld = cr('div');
	hld.className = 'fs1';

	var a1 = cr('a');
	a1.innerHTML = 'Welcome!';
	hld.appendChild(a1);

	var a2 = cr('a');
	a2.innerHTML = 'Please, choose how to login';
	hld.appendChild(a2);

	// AUTH BY TWITCH ACCOUNT
	var AuthByAcc = function() {
		/* Redirect path:
		* api.twitch.tv ->
		* www.rozz.me ->
		* extension
		*/
		window.open('https://api.twitch.tv/kraken/oauth2/authorize?response_type=token&client_id=2p0gptvg3t1erx2h8fhbo9cwv8k5zq0&redirect_uri=https://mcrozz.github.io/backupsite/auth/twitch.html&scope=user_follows_edit+user_read');
	};
	var TwAcc = cr('div');
	TwAcc.id = 'TwitchAccount';
	TwAcc.onclick = AuthByAcc;
	var a3 = cr('a');
	a3.innerHTML = 'Using TwitchTV account';
	TwAcc.appendChild(a3);

	// AUTH BY TWICH NAME
	var AuthByName = function() {
		function firstLaunchUserByName() {
			if (_$('SetUpUserNameInp').value !== undefined
			&& _$('SetUpUserNameInp').value != ' '
			&& _$('SetUpUserNameInp').value != '') {
				// Check if user on Twitch
				$.getJSON('https://api.twitch.tv/kraken/users/'+_$('SetUpUserNameInp').value)
				.done(function(e) {
					local.set('Config.User_Name', e.display_name);
					local.set('Status.update',0);
					localStorage.FirstLaunch = false;
					send('refresh');
					$('#FollowedChannelsOnline').html("Please wait a moment");
					$('button.dash').each(function(i,v) {v.disabled = false;});
					_$('SetUpUserNameInp').onkeyup = function(){};
					_$("SetUpUserName").onclick = function(){};
					$('#content>.online').html('');
				})
				.error(function(e) {
					$('#FollowedChannelsOnline').html('Could not find such name');
				});
			} else { $('#FollowedChannelsOnline').html('Invalid name!'); }
		}
		$('#FollowedChannelsOnline').html("Sign in by a Twicth Name");
		$('#content>.online').html(
			'<div class="Welcome" style="animated FadeIn">'+
			'<p>Hello!</p>'+
			'<p>Before you will use this app,</p>'+
			'<p>could you say your Twitch.tv name?</p>'+
			'<input type="text" name="userName" id="SetUpUserNameInp" value="" class="inSetUpUserName">'+
			'<p>Thanks for downloading this app!</p>'+
			'<p>Hope this app will be useful for you</p>'+
			'<button type="button" id="SetUpUserName" name="SetUpUserName" class="WelcomOK">OK</button>'+
			'</div>');
		_$('SetUpUserNameInp').focus();
		_$("SetUpUserName").onclick = firstLaunchUserByName;
		_$('SetUpUserNameInp').onkeyup = function (evt) {
			if (evt.keyCode == 13) firstLaunchUserByName();
		}
	};
	var TwNam = cr('div');
	TwNam.id = 'TwitchName';
	TwNam.onclick = AuthByName;
	var a4 = cr('a');
	a4.innerHTML = 'Using TwitchTV username';
	a4.onclick = AuthByName;
	TwNam.appendChild(a4);

	hld.appendChild(TwAcc);
	hld.appendChild(TwNam);

	$('#content>.online').html(hld);
}

$(lgin);
