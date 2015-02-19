{{LICENSE_HEADER}}
function reLogin() {
	$('#options, #options_bg').fadeOut(500, function(){
		$('#AppVersion').fadeIn(200)
	});
	Animation('fndAbug', ['hideReportBtnA', true, 0.7]);
	Animation('FoundAbugText', ['hideReportA', true, 0.7]);
	localJSON('Config.User_Name', 'Guest');
	localJSON('Config.token', '');
	localJSON('Status.update', 7);
	localStorage.FollowingList='{}';
	localStorage.Following='0';
	localStorage.FirstLaunch='true';
	TimersetToUpdate=[];
	send('update');
	setTimeout(lgin, 1000);
}

function logged() {
	doc('ChgUsr').disabled = false;
	doc('LstFlwdChnls').disabled = false;
	doc('Direct').disabled = false;
	doc('Dashboard').disabled = false;
	$('#insertContentHere').html('');
	$('#FollowedChannelsOnline').html("Please wait a moment");
}

function lgin() {
	if (localStorage.FirstLaunch === 'true') {
		localJSON('Status.update', 7);
		$('#FollowedChannelsOnline').html("Greetings!");
		doc('ChgUsr').disabled = true;
		doc('LstFlwdChnls').disabled = true;
		doc('Direct').disabled = true;
		doc('Dashboard').disabled = true;

		$('#insertContentHere').html(
			'<div class="fs1">'+
			'<a>Welcome!</a>'+
			'<a>Please, choose how to login</a>'+
			'<div id="TwitchAccount"><a>Using Twitct.TV account</a></div>'+
			'<div id="TwitchName"><a>Using Twitct.TV username</a></div>'+
			'</div>');
			
		// AUTH BY TWITCH ACCOUNT
		$('#TwitchAccount, #TwitchAccount>a').on('click', function(){
			window.open('https://api.twitch.tv/kraken/oauth2/authorize?response_type=token&client_id=2p0gptvg3t1erx2h8fhbo9cwv8k5zq0&redirect_uri=http://twitchtvnotifier.host-ed.me/auth.php&scope=user_follows_edit+user_read');
		});

		// AUTH BY TWICH NAME
		$('#TwitchName, #TwitchName>a').on('click', function(){
			function firstLaunchUserByName() {
				if (doc('SetUpUserNameInp').value !== undefined && doc('SetUpUserNameInp').value != ' ' && doc('SetUpUserNameInp').value != ''){ 
					localJSON('Config.User_Name',doc('SetUpUserNameInp').value);
			        localJSON('Status.update',0);
			        localStorage.FirstLaunch = false;
					send('refresh');
					$('#FollowedChannelsOnline').html("Please wait a moment");
					doc('ChgUsr').disabled = false;
					doc('LstFlwdChnls').disabled = false;
					doc('Direct').disabled = false;
					doc('Dashboard').disabled = false;
					doc('SetUpUserNameInp').onkeyup = function(){};
					doc("SetUpUserName").onclick = function(){};
					doc('insertContentHere').innerHTML = null;
				} else { $('#FollowedChannelsOnline').html('Invalid name!') }
			}
			$('#FollowedChannelsOnline').html("Sign in by Twicth Name");
			$('#insertContentHere').html(
				'<div class="Welcome" style="animated FadeIn">'+
				'<p>Hello!</p>'+
				'<p>Before you will use this app,</p>'+
				'<p>could you say your Twitch.tv name?</p>'+
				'<input type="text" name="userName" id="SetUpUserNameInp" value="" class="inSetUpUserName">'+
				'<p>Thanks for downloading this app!</p>'+
				'<p>Hope this app will be useful for you</p>'+
				'<button type="button" id="SetUpUserName" name="SetUpUserName" class="WelcomOK">OK</button>'+
				'</div>');
			doc('SetUpUserNameInp').focus();
			doc("SetUpUserName").onclick = firstLaunchUserByName;
			doc('SetUpUserNameInp').onkeyup = function (evt) { if (evt.keyCode == 13) firstLaunchUserByName() }
		});
	}
}

$(document).on("DOMContentLoaded", lgin);