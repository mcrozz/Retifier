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

$.ajaxSetup ({cache:false,crossDomain:true});
Code = {"Background": {"code": "//code","date": "Date","hex": "hex","version": 0},"Popup": {"code": "//code","date": "date",    "hex": "hex","version": 0},"insertFunc": {"code": "//code","date": "date","hex": "hex","version": 0}};
Config = {"User_Name": "Guest","Notifications": {"status": true,"online": true,"update": false,"sound_status": true,"sound": "DinDon"},"Duration_of_stream": true,"Interval_of_Checking": 3};
Status = {"update": 0,"online": 0,"checked": 0,"StopInterval": true};
if (localStorage['Code'] == undefined) localStorage['Code'] = JSON.stringify(Code);
if (localStorage['Config'] == undefined) localStorage['Config'] = JSON.stringify(Config);
if (localStorage['Status'] == undefined) localStorage['Status'] = JSON.stringify(Status);
if (!localStorage['FirstLaunch']) {localStorage['FirstLaunch']='true'; console.debug('Set up your user name in options')}
try { JSON.parse(localStorage['App_Version'])}
catch(e) { localStorage['App_Version'] = '{"Ver": "{appver}", "Got": "0"}' }
$.getJSON('./manifest.json', function (data){ localJSON('App_Version', 'c', ['Got', 'v.'+data.version]) });

if (localStorage['Status'] != null && localStorage['Config'] != null) {
	function firstLaunchUser() {
		if (doc('SetUpUserNameInp').value != undefined && doc('SetUpUserNameInp').value != ' ' && doc('SetUpUserNameInp').value != ''){ 
			localJSON('Config','c',['User_Name',doc('SetUpUserNameInp').value]);
	        localJSON('Config','c',['Timeout',new Date().setDate(new Date().getDate()+14)]);
	        localJSON('Config','c',['Ceneled','true']);
	        localJSON('Config','c',['Closed','true']);
	        localJSON('Status','c',['update',0]);
		} else { doc('FollowedChannelsOnline').innerHTML = 'Invalid name!' }
	}
	document.addEventListener("DOMContentLoaded",function (){
		if (localStorage['FirstLaunch'] == 'true'){
			localStorage['Following'] = 0;
			localJSON('Status','c',['update',7]);
			localJSON('Config','c',['Timeout',new Date().setDate(new Date().getDate()+14)]);
	        localJSON('Config','c',['Ceneled','true']);
	        localJSON('Config','c',['Closed','true']);
	        BadgeOnlineCount(' Hi ');
			
			doc('NoOneOnline').setAttribute('style', 'display:none');
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
			doc("SetUpUserName").addEventListener("click", firstLaunchUser);
			doc('SetUpUserNameInp').onkeyup = function (evt) { if (evt.keyCode == 13) firstLaunchUser() }

			doc('ChgUsr').disabled = true;
			doc('LstFlwdChnls').disabled = true;
			doc('Direct').disabled = true;
			doc('Dashboard').disabled = true;
		    
		    d = setInterval(function(){					
			    if (doc('SetUpUserNameInp').value == localJSON('Config','v',['User_Name'])) {
					localStorage['FirstLaunch'] = 'false';
					doc('insertContentHere').innerHTML = null;
					localJSON('Status','c',['StopInterval',true]);
					doc('NoOneOnline').setAttribute('style', 'display:block');
					doc('FollowedChannelsOnline').innerHTML = "Please wait a moment";
					doc('ChgUsr').disabled = false;
					doc('LstFlwdChnls').disabled = false;
					doc('Direct').disabled = false;
					doc('Dashboard').disabled = false;
				}

				if (localStorage['FirstLaunch'] == 'false') clearInterval(d);
			},10);
		}
	});
}