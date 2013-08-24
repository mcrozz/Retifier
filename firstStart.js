if (localStorage['Following'] != null && localStorage['Status'] != null && localStorage['Config'] != null) {
JSONstatus = JSON.parse(localStorage['Status']);
JSONconfig = JSON.parse(localStorage['Config']);

function firstLaunchUser() {
	JSONconfig.User_Name = document.getElementById('SetUpUserNameInp').value;
	localStorage['Config'] = JSON.stringify(JSONconfig)
}

if (!localStorage['FirstLaunch']) {
	localStorage['FirstLaunch'] = 'true'; 
	createCookie('UserName','Guest',365); 
	console.error('Set up your user name in options')
}

setInterval(function(){
	if (localStorage['FirstLaunch'] == 'true'){
		JSONstatus.update = '7';
		JSONstatus.ShowWaves = 'false';
		localStorage['Status'] = JSON.stringify(JSONstatus);
		
		document.getElementById('NoOneOnline').setAttribute('style', 'display:none');
		document.getElementById('FollowedChannelsOnline').innerHTML = "Greetings!";
		var WelcomeMsg;
		WelcomeMsg = '<div class="Welcome">';
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
			document.getElementById("SetUpUserName").addEventListener("click", firstLaunchUser);
	    }

	    if (document.getElementById('SetUpUserNameInp').value == JSONconfig.User_Name) {
			localStorage['FirstLaunch'] = 'false';
			document.getElementById('insertContentHere').innerHTML = null;
			createCookie('InstatntCheck','1',365);
			document.getElementById('NoOneOnline').setAttribute('style', 'display:block');
			localStorage['Reload'] = '0';
			setTimeout(location.reload(),1000 * 10);
			document.getElementById('FollowedChannelsOnline').innerHTML = "Please wait a moment";
		}
	}
}, 100);
}