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

if (localStorage.Status != null && localStorage.Config != null) {
	$(document).on("DOMContentLoaded", function (){
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
				'</div>'+
				'<canvas id="welc" style="position:absolute;top:0;left:0;z-index:-5" width="704" height="520"></canvas>';
				
			var strTime = (new Date()).getTime();
			t1 = 0; t3 = 100;
			function wlc() {
				var cv = $('#welc')[0].getContext('2d'),
					lineSpeed = 100,
					delta = ((new Date()).getTime() - strTime) / 1000;
				cv.fillStyle = 'rgb(229,229,229)';
				cv.fillRect(0,0,704,520);
				// draw intro
				if (delta <= 0.656 && delta >= 0) {
					if (t1 <= 1000) t1+=45*delta;
					cv.beginPath();
					cv.fillStyle = 'rgb(75,10,221)';
					cv.arc(352, 0, t1, 0, 2*Math.PI, true);
					cv.fill();
				}
				// smooth outro
				if (delta >= 0.656 && delta <= 2.284) {
					if (t3 >= 0) t3-=1;
					if (t3 < 0) t3 = 0;
					cv.fillStyle = 'rgba(75,10,221,'+t3/100+')';
					cv.fillRect(0,0,703,510);
				}
				delta <= 2.285 ? setTimeout(wlc, 1000/60) : $('#welc')[0].remove();
			}
			setTimeout(wlc, 100);

			// AUTH BY TWITCH ACCOUNT
			$('#TwitchAccount').on('click', function(){
				doc('insertContentHere').innerHTML = '<iframe src="https://api.twitch.tv/kraken/oauth2/authorize?response_type=token&client_id=2p0gptvg3t1erx2h8fhbo9cwv8k5zq0&redirect_uri=http://twitchtvnotifier.host-ed.me/auth.php&scope=user_follows_edit+user_read" width="696" height="520" style="position:absolute;top:0;left:13" frameborder="0"></iframe>';
				$(window).on('message', function(e){
					try {
						if (e.originalEvent.data.split(':')[1] === undefined) throw Error();
						localJSON('Config','c',['token', e.originalEvent.data.split(':')[1]]);
						$.getJSON('https://api.twitch.tv/kraken/user?oauth_token='+e.originalEvent.data.split(':')[1]).done(function(e){
							if (e.name !== undefined) {
								localJSON('Config','c',['User_Name', e.name]);
								doc('ChgUsr').disabled = false;
								doc('LstFlwdChnls').disabled = false;
								doc('Direct').disabled = false;
								doc('Dashboard').disabled = false;
								localJSON('Status','c',['update',0]);
						        localStorage.FirstLaunch = 'false';
								doc('insertContentHere').innerHTML = null;
								localJSON('Status','c',['StopInterval',true]);
								doc('FollowedChannelsOnline').innerHTML = "Please wait a moment";
							}
						});
					} catch(e) {
						console.error(e.stack);
						doc('FollowedChannelsOnline').innerHTML = "Error :(, please, restart extension";
					}
				});
			});

			// AUTH BY TWICH NAME
			$('#TwitchName').on('click', function(){
				function firstLaunchUserByName() {
					if (doc('SetUpUserNameInp').value != undefined && doc('SetUpUserNameInp').value != ' ' && doc('SetUpUserNameInp').value != ''){ 
						localJSON('Config','c',['User_Name',doc('SetUpUserNameInp').value]);
				        localJSON('Status','c',['update',0]);
				        localStorage.FirstLaunch = 'false';
						doc('insertContentHere').innerHTML = null;
						localJSON('Status','c',['StopInterval',true]);
						doc('FollowedChannelsOnline').innerHTML = "Please wait a moment";
						doc('ChgUsr').disabled = false;
						doc('LstFlwdChnls').disabled = false;
						doc('Direct').disabled = false;
						doc('Dashboard').disabled = false;
						doc('SetUpUserNameInp').onkeyup = null;
						doc("SetUpUserName").onclick = null;
					} else { doc('FollowedChannelsOnline').innerHTML = 'Invalid name!' }
				}
				doc('insertContentHere').innerHTML = '<div class="Welcome" style="animated FadeIn">'+
					'<p class="pWelcome1">Hello!</p>'+
					'<p class="pWelcome2">Before you will use this app,</p>'+
					'<p class="pWelcome3">could you say your Twitch.tv name?</p>'+
					'<input type="text" name="userName" id="SetUpUserNameInp" value="" class="inSetUpUserName">'+
					'<p class="pWelcome4">Thanks for downloading this app!</p>'+
					'<p class="pWelcome5">Hope this app will be useful for you</p>'+
					'<button type="button" id="SetUpUserName" name="SetUpUserName" class="WelcomOK">OK</button>'+
					'</div>';
				doc('SetUpUserNameInp').focus();
				doc("SetUpUserName").onclick = firstLaunchUserByName;
				doc('SetUpUserNameInp').onkeyup = function (evt) { if (evt.keyCode == 13) firstLaunchUserByName() }
			});
		}
	});
}