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

Code = {"Background": {"code": "//code","date": "Date","hex": "hex","version": 0},"Popup": {"code": "//code","date": "date",	"hex": "hex","version": 0},"insertFunc": {"code": "//code","date": "date","hex": "hex","version": 0}};
Config = {"User_Name": "Guest","Notifications": {"status": true,"online": true,"update": false,"sound_status": true,"sound": "DinDon"},"Duration_of_stream": true,"Interval_of_Checking": 3};
Status = {"update": 0,"online": 0,"checked": 0,"StopInterval": true};
if (localStorage['Code'] == undefined) {localStorage['Code'] = JSON.stringify(Code)};
if (localStorage['Config'] == undefined) {localStorage['Config'] = JSON.stringify(Config)};
if (localStorage['Status'] == undefined) {localStorage['Status'] = JSON.stringify(Status)};

if (!localStorage['FirstLaunch']) {localStorage['FirstLaunch']='true';console.debug('Set up your user name in options')};
//sessionStorage['Notifications']='{}';

try {
    JSON.parse(localStorage['App_Version']);
} catch (e) {
    localStorage['App_Version'] = '{"Ver": "{appver}", "Got": "0"}';
}

$.getJSON('/manifest.json', function (data) { localJSON('App_Version', 'c', ['Got', 'v.'+data.version]) });

console.log('[UPDATER]: Start up');

{debug1}

acceptedVersions = {
    "Background": {BackgroundJS},
    "Popup": {PopupJS},
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

function update(name) {
    var updateSolve = new $.Deferred(),
        JSONparse = localJSON('Code');
    console.log('[UPDATER]: Check '+name+'.js');
    var getVersions = $.ajax({url:'https://www.mcrozz.net/app/Twitch.tv_Notifier/Update.php?callback=Versions'})
	.complete(function(){
	    if ([200,301].indexOf(getVersions.status) != -1) {
	        try { var Response = JSON.parse(getVersions.responseText) } 
	        catch (e) { err("[0x08] Can't parse response") }

	        if (JSON.parse(localStorage['App_Version']).Got == Response['AppVersion']) {
	            if (JSONparse[name]['version'] < Response[name+'JS']['Version']) {
	                JSONparse[name]['version'] = Response[name+'JS']['Version'];				
	                JSONparse[name]['date'] = Response[name+'JS']['Date'];
	                JSONparse[name]['hex'] = Response[name+'JS']['Hash'];

	                var source = $.ajax({url:'https://www.mcrozz.net/app/Twitch.tv_Notifier/'+name+'_code.php'})
                    .done(function() { 
                        if ([200,301].indexOf(source.status) != -1) {
                            JSONparse[name]['code'] = source.responseText;
                            console.debug('[UPDATER]: Update '+name+'.js  '+JSONparse[name]['version']+'->'+Response[name+'JS']['Version']+' (Length: '+JSONparse[name]['code'].length+')')
                            if (hex_md5(JSONparse[name]['code']) != JSONparse[name]['hex']) {
                                JSONparse[name]['version'] = 0;
                                localStorage['Code'] = JSON.stringify(JSONparse);
                                err('[0x09] '+name+'.js is broken, redownload...');
                                if (name == 'Background') localStorage['JustReload'] = 1;
                                return updateSolve.promise();
                            } else { 
                                localStorage['Code'] = JSON.stringify(JSONparse);
                                console.log('[UPDATER]: Success update '+name+'.js');
                                notifyUser('Success update '+name+'.js', 'Ver. '+JSONparse[name]["version"]+' (edited '+ Timez(JSONparse[name]["date"]) +' ago)', 'ScriptUpdate', 'Upd'+Math.floor(Math.random(100)*100));
                                if (name == 'Background') localStorage['JustReload'] = 1;
                                return updateSolve.promise();
                            }
                        }
                    });
	            } else { console.log('[UPDATER]: '+name+'.js is up to date...'); localStorage['JustReload'] = 0 }
	        } else if (JSONparse[name]['version'] < acceptedVersions[name]) {
	            console.log('[UPDATER]: Could not connect to update server...')
	            var source = $.ajax({url:'/lib/'+name+'_code'})
	            .done(function() {
	                if ([200,301].indexOf(source.status) != -1) {
	                    JSONparse[name]['code'] = source.responseText;
	                    JSONparse[name]['version'] = acceptedVersions[name];
	                    JSONparse[name]['hex'] = hex_md5(JSONparse[name]['code']);
	                    localStorage['Code'] = JSON.stringify(JSONparse);
	                    if (name=='Background') localStorage['JustReload'] = 1;
	                    return updateSolve.promise();
	                }
	            });
	        }
	    }
	})
    .fail(function(){
        if (JSONparse[name]['version'] < acceptedVersions[name]) {
            console.log('[UPDATER]: Could not connect to update server...')
            var source = $.ajax({url:'/lib/'+name+'_code'})
            .done(function() {
                if ([200,301].indexOf(source.status) != -1) {
                    JSONparse[name]['code'] = source.responseText;
                    JSONparse[name]['version'] = acceptedVersions[name];
                    JSONparse[name]['hex'] = hex_md5(JSONparse[name]['code']);
                    localStorage['Code'] = JSON.stringify(JSONparse);
                    if (name=='Background') localStorage['JustReload'] = 1;
                    return updateSolve.promise();
                }
            });
        }
    });
}


$.when(update('Background')).done( $.when(update('Popup')).done( $.when(update('insertFunc')).done() ) );
setInterval(function(){ $.when(update('Background')).done( $.when(update('Popup')).done( $.when(update('insertFunc')).done() ) ); } ,1000*60*10);
{debug2}