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

$.ajaxSetup ({cache:false,crossDomain:true});

Code = {"Background": {"code": "//code","date": "Date","hex": "hex","version": 0},"Popup": {"code": "//code","date": "date",	"hex": "hex","version": 0},"insertFunc": {"code": "//code","date": "date","hex": "hex","version": 0}};
Config = {"User_Name": "Guest","Notifications": {"status": true,"online": true,"update": false,"sound_status": true,"sound": "DinDon"},"Duration_of_stream": true,"Interval_of_Checking": 3};
Status = {"update": 0,"online": 0,"checked": 0,"StopInterval": true};
if (localStorage['Code'] == undefined) {localStorage['Code'] = JSON.stringify(Code)};
if (localStorage['Config'] == undefined) {localStorage['Config'] = JSON.stringify(Config)};
if (localStorage['Status'] == undefined) {localStorage['Status'] = JSON.stringify(Status)};

if (!localStorage['FirstLaunch']) {localStorage['FirstLaunch']='true';console.debug('Set up your user name in options')};
sessionStorage['Notifications']='{}';

try {
    JSON.parse(localStorage['App_Version']);
} catch (e) {
    localStorage['App_Version'] = '{"Ver": "{appver}", "Got": "0"}';
}

$.getJSON('/manifest.json', function (data) { localJSON('App_Version', 'c', ['Got', 'v.'+data.version]) });

console.log('[UPDATER]: Start up');

{debug1}

acceptedVersions = {
    "background": {BackgroundJS},
    "popup": {PopupJS},
    "insertFunc": {insertFuncJS}
};

function Timez(a) {
    SubtractTimes = Math.abs(new Date() - new Date( a ) / 1000);
    SubtractTimes = Math.floor(SubtractTimes);
    Days = Math.floor((SubtractTimes % 31536000) / 86400);
    Hours = Math.floor(((SubtractTimes % 31536000) % 86400) / 3600);
    Minutes = Math.floor((((SubtractTimes % 31536000) % 86400) % 3600) / 60);
    Seconds = (((SubtractTimes % 31536000) % 86400) % 3600) % 60;
    if (Days == 0) Days = ''; else  Days < 10 ? Days = '0'+Days+'d:' : Days = Days+'d:';
    if (Hours == 0) Hours = ''; else Hours < 10 ? Hours = '0'+Hours+'h:' : Hours = Hours+'h:';
    if (Minutes == 0) Minutes = ''; else Minutes < 10 ? Minutes = '0'+Minutes+'m' : Minutes = Minutes+'m';
    return Days+''+Hours+''+Minutes;
}

function CheckForUpdates() {
	JSONparse = localJSON('Code');

	console.log('[UPDATER]: Check versions');
	var getVersions = $.ajax({url:'https://www.mcrozz.net/app/Twitch.tv_Notifier/Update.php?callback=Versions'})
	.complete(function(){
	    if ([200,301].indexOf(getVersions.status) != -1) {
	        try {
	            Response = JSON.parse(getVersions.responseText);
	        } catch (e) {
	            err("[0x08] Can't parse response")
	        }
        
	        if (JSON.parse(localStorage['App_Version']).Got == Response['AppVersion']) {
	            // Update...
	            if (JSONparse.Background.version < Response.BackgroundJS.Version) {
	                JSONparse.Background.version = Response.BackgroundJS.Version;				
	                JSONparse.Background.date = Response.BackgroundJS.Date.replace(/\s/g, '');
	                JSONparse.Background.hex = Response.BackgroundJS.Hash.replace(/\s/g, '');

	                var getBackgroundCode = $.ajax({url:'https://www.mcrozz.net/app/Twitch.tv_Notifier/Background_code'});
	                getBackgroundCode.done(function() { 
	                    JSONparse.Background.code = getBackgroundCode.responseText;
	                    console.log('[UPDATER]: Success update Background.js');
	                    notifyUser('Success update Background.js','Ver. '+JSONparse.Background.version+' (edited '+ Timez(JSONparse.Background.date) +' ago)','ScriptUpdate');
	                    // Check Background.js sums {
	                    if (hex_md5(JSONparse.Background.code) != JSONparse.Background.hex) {
	                        JSONparse.Background.version = '0';
	                        localStorage['Code'] = JSON.stringify(JSONparse);
	                        err('[0x09] Background.js is broken, redownload...');
	                    } else { localStorage['Code'] = JSON.stringify(JSONparse) }
	                    // }
	                    localStorage['JustReload'] = 1;
	                })
                    .fail(function(){
                        err("[0x10] Can't update Background.js");
                    });
	            } else { console.log('[UPDATER]: Background.js is up to date...') }

	            //Popup.js check...
	            if (JSONparse.Popup.version < Response.PopupJS.Version) {
	                JSONparse.Popup.version = Response.PopupJS.Version;
	                JSONparse.Popup.date = Response.PopupJS.Date.replace(/\s/g, '');
	                JSONparse.Popup.hex = Response.PopupJS.Hash.replace(/\s/g, '');

	                var getPopupCode = $.ajax({url:'https://www.mcrozz.net/app/Twitch.tv_Notifier/Popup_code'});
	                getPopupCode.done(function() { 
	                    JSONparse.Popup.code = getPopupCode.responseText;					
	                    console.log('[UPDATER]: Success update Popup.js');					
	                    notifyUser('Success update Popup.js','Ver. '+localJSON('Code').Popup.version+' (edited '+ Timez(JSONparse.Popup.date) +' ago)','ScriptUpdate');
	                    // Check Popup.js sums {
	                    if (hex_md5(localJSON('Code').Popup.code) != localJSON('Code').Popup.hex) {
	                        JSONparse.Popup.version = '0';
	                        localStorage['Code'] = JSON.stringify(JSONparse);
	                        err('[0x11] Popup.js is broken, redownload...');
	                    } else { localStorage['Code'] = JSON.stringify(JSONparse) }
	                    // }
	                })
                    .fail(function(){
                        err("[0x12] Can't update Popup.js");
                    });
	            } else { console.log('[UPDATER]: Popup.js is up to date...') }
	            //insertFunc.js check...
	            if (JSONparse.insertFunc.version < Response.insertFuncJS.Version) {
	                JSONparse.insertFunc.version = Response.insertFuncJS.Version;
	                JSONparse.insertFunc.date = Response.insertFuncJS.Date.replace(/\s/g, '');
	                JSONparse.insertFunc.hex = Response.insertFuncJS.Hash.replace(/\s/g, '');

	                var getInsertFuncCode = $.ajax({url:'https://www.mcrozz.net/app/Twitch.tv_Notifier/insertFunc_code'});
	                getInsertFuncCode.done(function() { 
	                    JSONparse.insertFunc.code = getInsertFuncCode.responseText;					
	                    console.log('[UPDATER]: Success update insertFunc.js');					
	                    notifyUser('Success update insertFunc.js','Ver. '+localJSON('Code').insertFunc.version+' (edited '+ Timez(JSONparse.insertFunc.date) +' ago)','ScriptUpdate');
	                    // Check insertFunc.js sums {
	                    if (hex_md5(localJSON('Code').insertFunc.code) != localJSON('Code').insertFunc.hex) {
	                        JSONparse.insertFunc.version = '0';
	                        localStorage['Code'] = JSON.stringify(JSONparse);
	                        err('[0x13] insertFunc.js is broken, redownload...');
	                    } else { localStorage['Code'] = JSON.stringify(JSONparse) }
	                    // }
	                })
                    .fail(function(){
                        err("[0x14] Can't update insertFunc.js");
                    });
	            } else { console.log('[UPDATER]: insertFunc.js is up to date...') }
	        } else { err('[0x15] Please update extension...') }
	    } else {
	        if (JSONparse.Background.version < acceptedVersions.background) {
	            var getBackgroundCode = $.ajax({url:'/lib/Background_code'});
	            getBackgroundCode.done(function() { 
	                JSONparse.Background.code = getBackgroundCode.responseText;
	                JSONparse.Background.version = acceptedVersions.Background;
	                localStorage['Code'] = JSON.stringify(JSONparse);
	                localStorage['JustReload'] = 1;
	            });
	        } if (JSONparse.Popup.version < acceptedVersions.popup) {
	            var getPopupCode = $.ajax({url:'/lib/Popup_code'});
	            getPopupCode.done(function() { 
	                JSONparse.Popup.code = getPopupCode.responseText;
	                JSONparse.Popup.version = acceptedVersions.Popup;
	                localStorage['Code'] = JSON.stringify(JSONparse);
	            });
	        } if (JSONparse.insertFunc.version < acceptedVersions.insertFunc) {
	            var getInsertFuncCode = $.ajax({url:'/lib/insertFunc_code'});
	            getInsertFuncCode.done(function() { 
	                JSONparse.insertFunc.code = getInsertFuncCode.responseText;
	                JSONparse.insertFunc.version = acceptedVersions.insertFunc;
	                localStorage['Code'] = JSON.stringify(JSONparse);
	            });
	        }
	    }
	});
}

CheckForUpdates();
setInterval(CheckForUpdates,1000*60*10)
{debug2}