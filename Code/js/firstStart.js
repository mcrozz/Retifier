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

function reLogin() {
	Animation('userChangePopup', ['bounceOut', true]);
	Animation('userChangePopup2', ['fadeOut', true, 0.5]);
	Animation('AppVersion', ['fadeIn', false]);
	if (opened) {
		Animation('fndAbug', ['hideReportBtnA', true, 0.7]);
		Animation('FoundAbugText', ['hideReportA', true, 0.7]);
	} else {
		Animation('fndAbug', ['hideReportBtn', true, 0.9]);
		Animation('FoundAbugText', ['hideReport', true, 0.9]);
	}
	opened = false;
	localJSON('Config','c',['User_Name', 'Guest']);
	localJSON('Config','c',['token', '']);
	localStorage.FollowingList={};
	localStorage.Following=0;
	localStorage.FirstLaunch='true';
	TimersetToUpdate=[];
	setTimeout(lgin, 1000);
}

function lgin() {
	if (localStorage.FirstLaunch === 'true'){
		doc('FollowedChannelsOnline').innerHTML = "Greetings!";
		doc('ChgUsr').disabled = true;
		doc('LstFlwdChnls').disabled = true;
		doc('Direct').disabled = true;
		doc('Dashboard').disabled = true;

		doc('insertContentHere').innerHTML = '<div class="fs1">'+
			'<a>Welcome!</a>'+
			'<a>Please, choose how to login</a>'+
			'<div id="TwitchAccount"><a>Using Twitct.TV account</a></div>'+
			'<div id="TwitchName"><a>Using Twitct.TV username</a></div>'+
			'</div>';
			
		// AUTH BY TWITCH ACCOUNT
		$('#TwitchAccount, #TwitchAccount>a').on('click', function(){
			doc('insertContentHere').innerHTML = '<iframe src="https://api.twitch.tv/kraken/oauth2/authorize?response_type=token&client_id=2p0gptvg3t1erx2h8fhbo9cwv8k5zq0&redirect_uri=http://twitchtvnotifier.host-ed.me/auth.php&scope=user_follows_edit+user_read" width="696" height="520" style="position:absolute;top:0;left:13" frameborder="0"></iframe>';
			doc('FollowedChannelsOnline').innerHTML = "Sign in by Twicth Account";
			t = 0;
			$(window).on('message', function(e){
				if (t !== 0) return false; t++;
				try {
					var f = e.originalEvent.data.split(':')[1];
					log('Got message');
					if (f === undefined || f === 'ERROR') throw Error();
					localJSON('Config','c',['token', f]);
					$.ajax({url:'https://api.twitch.tv/kraken/user?oauth_token='+f,dataType:'JSONP',complete:function(e){
						log('Got user');
						if (e.responseJSON.name !== undefined) {
							localJSON('Config','c',['User_Name', e.responseJSON.name]);
							doc('ChgUsr').disabled = false;
							doc('LstFlwdChnls').disabled = false;
							doc('Direct').disabled = false;
							doc('Dashboard').disabled = false;
							//localJSON('Status','c',['update',0]);
					        localStorage.FirstLaunch = 'false';
							doc('insertContentHere').innerHTML = null;
							localJSON('Status','c',['StopInterval',true]);
							doc('FollowedChannelsOnline').innerHTML = "Please wait a moment";
						} else { err({message:'Cannot get user name from response',stack:e}) }
					}, error:function(e){err({message:'Tried to get username',stack:e})}});
				} catch(e) { err(e); doc('FollowedChannelsOnline').innerHTML = "Error :(, please, restart extension"; }
			});
		});

		// AUTH BY TWICH NAME
		$('#TwitchName, #TwitchName>a').on('click', function(){
			function firstLaunchUserByName() {
				if (doc('SetUpUserNameInp').value !== undefined && doc('SetUpUserNameInp').value != ' ' && doc('SetUpUserNameInp').value != ''){ 
					localJSON('Config','c',['User_Name',doc('SetUpUserNameInp').value]);
			        localJSON('Status','c',['update',0]);
			        localStorage.FirstLaunch = 'false';
					localJSON('Status','c',['StopInterval',true]);
					doc('FollowedChannelsOnline').innerHTML = "Please wait a moment";
					doc('ChgUsr').disabled = false;
					doc('LstFlwdChnls').disabled = false;
					doc('Direct').disabled = false;
					doc('Dashboard').disabled = false;
					doc('SetUpUserNameInp').onkeyup = function(){};
					doc("SetUpUserName").onclick = function(){};
					doc('insertContentHere').innerHTML = null;
				} else { doc('FollowedChannelsOnline').innerHTML = 'Invalid name!' }
			}
			doc('FollowedChannelsOnline').innerHTML = "Sign in by Twicth Name";
			doc('insertContentHere').innerHTML = '<div class="Welcome" style="animated FadeIn">'+
				'<p>Hello!</p>'+
				'<p>Before you will use this app,</p>'+
				'<p>could you say your Twitch.tv name?</p>'+
				'<input type="text" name="userName" id="SetUpUserNameInp" value="" class="inSetUpUserName">'+
				'<p>Thanks for downloading this app!</p>'+
				'<p>Hope this app will be useful for you</p>'+
				'<button type="button" id="SetUpUserName" name="SetUpUserName" class="WelcomOK">OK</button>'+
				'</div>';
			doc('SetUpUserNameInp').focus();
			doc("SetUpUserName").onclick = firstLaunchUserByName;
			doc('SetUpUserNameInp').onkeyup = function (evt) { if (evt.keyCode == 13) firstLaunchUserByName() }
		});
	}
}

$(document).on("DOMContentLoaded", lgin);