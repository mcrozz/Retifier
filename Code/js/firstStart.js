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
	localStorage.Following=0;
	localStorage.FirstLaunch='true';
	TimersetToUpdate=[];
	setTimeout(lgin, 1000);
}

function lgin() {
	if (localStorage.FirstLaunch === 'true'){
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
			$('#insertContentHere').html('<iframe src="https://api.twitch.tv/kraken/oauth2/authorize?response_type=token&client_id=2p0gptvg3t1erx2h8fhbo9cwv8k5zq0&redirect_uri=http://twitchtvnotifier.host-ed.me/auth.php&scope=user_follows_edit+user_read" width="696" height="520" style="position:absolute;top:0;left:13" frameborder="0"></iframe>');
			$('#FollowedChannelsOnline').html("Sign in by Twicth Account");
			t = 0;
			$(window).on('message', function(e){
				if (t !== 0) return false; t++;
				try {
					var f = e.originalEvent.data.split(':')[1];
					log('Got message');
					if (f === undefined || f === 'ERROR') throw Error();
					localJSON('Config.token', f);
					$.ajax({url:'https://api.twitch.tv/kraken/user?oauth_token='+f,dataType:'JSONP',complete:function(e){
						log('Got user');
						if (e.responseJSON.name !== undefined) {
							localJSON('Config.User_Name', e.responseJSON.name);
							doc('ChgUsr').disabled = false;
							doc('LstFlwdChnls').disabled = false;
							doc('Direct').disabled = false;
							doc('Dashboard').disabled = false;
					        localStorage.FirstLaunch = false;
							$('#insertContentHere').html('');
							localJSON('Status.StopInterval',true);
							$('#FollowedChannelsOnline').html("Please wait a moment");
						} else { err({message:'Cannot get user name from response',stack:e}) }
					}, error:function(e){err({message:'Tried to get username',stack:e})}});
				} catch(e) { err(e); doc('FollowedChannelsOnline').innerHTML = "Error :(, please, restart extension"; }
			});
		});

		// AUTH BY TWICH NAME
		$('#TwitchName, #TwitchName>a').on('click', function(){
			function firstLaunchUserByName() {
				if (doc('SetUpUserNameInp').value !== undefined && doc('SetUpUserNameInp').value != ' ' && doc('SetUpUserNameInp').value != ''){ 
					localJSON('Config.User_Name',doc('SetUpUserNameInp').value);
			        localJSON('Status.update',0);
			        localStorage.FirstLaunch = false;
					localJSON('Status.StopInterval',true);
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