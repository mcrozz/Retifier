/*
	Copyright 2013 Ivan 'MacRozz' Zarudny

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

if (localStorage['Status'] != null && localStorage['Config'] != null) {
	JSONstatus = JSON.parse(localStorage['Status']);
	JSONconfig = JSON.parse(localStorage['Config']);

	function firstLaunchUser() {
		if (document.getElementById('SetUpUserNameInp').value != undefined && document.getElementById('SetUpUserNameInp').value != ' ' && document.getElementById('SetUpUserNameInp').value != ''){ 
			JSONconfig.User_Name = document.getElementById('SetUpUserNameInp').value;
			localStorage['Config'] = JSON.stringify(JSONconfig)
		} else {
			document.getElementById('FollowedChannelsOnline').innerHTML = 'Invalid name!'
		}
	}

	if (!localStorage['FirstLaunch']) {
		localStorage['FirstLaunch'] = 'true';
		console.error('Set up your user name in options')
	}
	document.addEventListener( "DOMContentLoaded" , function () {
		setTimeout(function(){
		if (localStorage['FirstLaunch'] == 'true'){
			localStorage['Following'] = 0;
			JSONstatus.update = '7';
			JSONstatus.ShowWaves = 'false';
			localStorage['Status'] = JSON.stringify(JSONstatus);
			
			document.getElementById('NoOneOnline').setAttribute('style', 'display:none');
			document.getElementById('FollowedChannelsOnline').innerHTML = "Greetings!";
			WelcomeMsg = '<div class="Welcome" style="animated FadeIn">';
			WelcomeMsg += '<p class="pWelcome1">Hello!</p>';
			WelcomeMsg += '<p class="pWelcome2">Before you will use this app,</p>';
			WelcomeMsg += '<p class="pWelcome3">could you say your Twitch.tv name?</p>';
			WelcomeMsg += '<input type="text" name="userName" id="SetUpUserNameInp" value="" class="inSetUpUserName">';
			WelcomeMsg += '<p class="pWelcome4">Thanks for downloading this app!</p>';
			WelcomeMsg += '<p class="pWelcome5">Hope this app will be useful for you</p>';
			WelcomeMsg += '<button type="button" id="SetUpUserName" name="SetUpUserName" class="WelcomOK">OK</button>';
			WelcomeMsg += '</div>';
			
			if (document.getElementById('insertContentHere').innerHTML != WelcomeMsg) {
				document.getElementById('insertContentHere').innerHTML = WelcomeMsg;
				document.getElementById('SetUpUserNameInp').focus();
				document.getElementById("SetUpUserName").addEventListener("click", firstLaunchUser);
		    }
		    setInterval(function(){
				document.getElementById('SetUpUserNameInp').onkeyup = function(evt) {
					if(evt.keyCode == 13){
						firstLaunchUser()
					}
				}
				
			    if (document.getElementById('SetUpUserNameInp').value == JSONconfig.User_Name) {
					localStorage['FirstLaunch'] = 'false';
					document.getElementById('insertContentHere').innerHTML = null;
					createCookie('InstatntCheck','1',365);
					document.getElementById('NoOneOnline').setAttribute('style', 'display:block');
					document.getElementById('FollowedChannelsOnline').innerHTML = "Please wait a moment";
					localStorage['Reload'] = 0;
					setTimeout(function(){location.reload()},1000*5);
				}
			},10);
		}
		},100);
	});
}