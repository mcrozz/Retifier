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
	function firstLaunchUser() {
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
	document.addEventListener("DOMContentLoaded",function (){
		if (localStorage.FirstLaunch == 'true'){
			localStorage.Following = 0;
			localJSON('Status','c',['update',7]);
	        BadgeOnlineCount(' Hi ');

			doc('FollowedChannelsOnline').innerHTML = "Greetings!";

			WelcomeMsg = '<div class="Welcome" style="animated FadeIn">';
			WelcomeMsg += '<p class="pWelcome1">Hello!</p>';
			WelcomeMsg += '<p class="pWelcome2">Before you will use this app,</p>';
			WelcomeMsg += '<p class="pWelcome3">could you say your Twitch.tv name?</p>';
			WelcomeMsg += '<input type="text" name="userName" id="SetUpUserNameInp" value="" class="inSetUpUserName">';
			WelcomeMsg += '<p class="pWelcome4">Thanks for downloading this app!</p>';
			WelcomeMsg += '<p class="pWelcome5">Hope this app will be useful for you</p>';
			WelcomeMsg += '<button type="button" id="SetUpUserName" name="SetUpUserName" class="WelcomOK">OK</button>';
			WelcomeMsg += '</div>';
			doc('insertContentHere').innerHTML = WelcomeMsg;
			doc('SetUpUserNameInp').focus();
			doc("SetUpUserName").onclick = firstLaunchUser;
			doc('SetUpUserNameInp').onkeyup = function (evt) { if (evt.keyCode == 13) firstLaunchUser() }

			doc('ChgUsr').disabled = true;
			doc('LstFlwdChnls').disabled = true;
			doc('Direct').disabled = true;
			doc('Dashboard').disabled = true;
		}
	});
}