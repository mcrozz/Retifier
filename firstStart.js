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
	function firstLaunchUser() {
		if (document.getElementById('SetUpUserNameInp').value != undefined && document.getElementById('SetUpUserNameInp').value != ' ' && document.getElementById('SetUpUserNameInp').value != ''){ 
			localJSON('Config','User_Name',document.getElementById('SetUpUserNameInp').value);
			date = new Date();
	        localJSON('Config','Timeout',date.setDate(date.getDate()+14));
	        localJSON('Config','Ceneled','true');
	        localJSON('Config','Closed','true');
	        localJSON('Status','update','0');
		} else {document.getElementById('FollowedChannelsOnline').innerHTML = 'Invalid name!'}
	}
	if (!localStorage['FirstLaunch']) {localStorage['FirstLaunch']='true';console.error('Set up your user name in options')}
	document.addEventListener( "DOMContentLoaded" , function () {
		if (localStorage['FirstLaunch'] == 'true'){
			localStorage['Following'] = 0;
			localJSON('Status','update','7');
			date = new Date();
			localJSON('Config','Timeout',date.setDate(date.getDate()+14));
	        localJSON('Config','Ceneled','true');
	        localJSON('Config','Closed','true');
			
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
			document.getElementById('insertContentHere').innerHTML = WelcomeMsg;
			document.getElementById('SetUpUserNameInp').focus();
			document.getElementById("SetUpUserName").addEventListener("click", firstLaunchUser);
		    
		    setInterval(function(){		    	
				document.getElementById('SetUpUserNameInp').onkeyup=function(evt){if(evt.keyCode == 13)firstLaunchUser()}
				
			    if (document.getElementById('SetUpUserNameInp').value == localJSON('Config','User_Name')) {
					localStorage['FirstLaunch'] = 'false';
					document.getElementById('insertContentHere').innerHTML = null;
					localJSON('Status','StopInterval','true');
					document.getElementById('NoOneOnline').setAttribute('style', 'display:block');
					document.getElementById('FollowedChannelsOnline').innerHTML = "Please wait a moment";
					localStorage['Reload'] = 0;
					setTimeout(function(){location.reload()},1000*5);
				}
			},10);
		}
	});
}