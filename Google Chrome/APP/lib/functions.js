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
var NotificationsCount = 0,
    NameBuffer = [],
    clearErrors = "0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0",
    ErrorList = [1, "", 2, "", 3, "", 4, "", 5, "", 6, "", 7, "", 8, "", 9, "", 10, "", 11, "", 12, "", 13, "", 14, "", 15, ""];
if (localStorage.Log == undefined) localStorage.Log = clearErrors;

var local = {};
try {
    local.Config = JSON.parse(localStorage.Config);
    local.Status = JSON.parse(localStorage.Status);
    local.FollowingList = JSON.parse(localStorage.FollowingList);
    local.App_Version = JSON.parse(localStorage.App_Version);
} catch(e) { console.error(r.stack) }

if (localStorage.Status&&localStorage.Config) {
    function err(msg) {
        try {
            var log, code, j;
            log = localStorage.Log.split('/');
            code = msg[3]=='0' ? Math.floor(msg[4]) : Math.floor(msg[4]*10);
            j = ErrorList.indexOf(code);
            if (j != -1) {
                log[j] = Math.floor(log[j]) + 1;
                if (log[j + 1] == "0") log[j + 1] = Math.abs(new Date());
                localStorage.Log = log.join('/');
                console.error('[ERROR] ' + msg.substring(7));
                return true;
            } else {
                console.error("[ERROR] err() ended with error: Couldn't find error in list");
                return false;
            }
        } catch (e) {
            localStorage.Log = clearErrors;
            console.error('[ERROR] err() ended with error: ' + e.message);
            console.debug(e.stack);
            return false;
        }
    }

    function TimeNdate(d, m, k) {
        // TODO: do not add years
        var newDate = new Date(),
            time, month, year, day,
            DaysInMonths = [31,28,31,30,31,30,31,31,30,31,30,31];
        month = newDate.getMonth()+1+m;
        if (newDate.getDate()+d > DaysInMonths[newDate.getMonth()]) {
            month++;
            day = (d-(DaysInMonths[newDate.getMonth()] - newDate.getDate())) < 10 ? '0'+(d-(DaysInMonths[newDate.getMonth()]-newDate.getDate())) : d-DaysInMonths[newDate.getMonth()]-newDate.getDate()
        } else { day = newDate.getDate()+d < 10 ? '0'+(newDate.getDate()+d) : newDate.getDate()+d }
        year = ((new Date()).getYear()-100);
        time = newDate.getHours()+':';
        time +=newDate.getMinutes() < 10 ? '0'+newDate.getMinutes() : newDate.getMinutes();
        return [month < 10 ? '0'+month : month,day,year,time].join(k);
    }

    function localJSON(name,type,arrayz) {
        try {
            var sz, b, h;
            if (name && type == 'c' && arrayz) {
                sz = arrayz.length;
                b = local[name];
                if (sz == 2) {
                    b[arrayz[0]]=arrayz[1];
                    localStorage[name] = JSON.stringify(b);
                    return true;
                } else if (sz == 3) {
                    h = b[arrayz[0]];
                    h[arrayz[1]] = arrayz[2];
                    b[arrayz[0]] = h;
                    localStorage[name] = JSON.stringify(b);
                    return true;	
                } else { return false; }
            } else if (name&&type=='v'&&arrayz) {
                b = local[name];
                if (arrayz.length == 1){			
                    if (b[arrayz[0]]) {return b[arrayz[0]];} else {return false;}
                } else if (arrayz.length == 2) {
                    f = b[arrayz[0]];
                    if (f[arrayz[1]]) {return f[arrayz[1]];} else {return false;}
                } else { return false; }
            } else if (name&&!type&&!arrayz) {
                return JSON.parse(localStorage[name]);
            } else { Error('[ERROR]: Wrong input in localJSON function!'); return false; }
        } catch (e) {
            err('[0x02] localJSON() ended with error: ' + e.message);
            console.debug(e.stack);
            return "ERROR";
        }
    }

    if (!localStorage.FollowingList) localStorage.FollowingList='{}';
    function FollowingList(type,id,name,stream) {
        try {
            var b, z, x;
            b = local.FollowingList;
            if (type == 'add') {
                local.FollowingList[id] = {
                    Name: name,
                    Stream: false
                }
                if (localStorage.FollowingList=JSON.stringify(local.FollowingList)) {return true;} else {return false;}
            } else if (type == 'c') {
                if (stream) {
                    local.FollowingList[id].Stream = {
                        Title: stream[0],
                        Game: stream[1],
                        Viewers: stream[2],
                        Time: stream[3],
                        GameIMG: stream[4]
                    };
                } else { local.FollowingList[id].Stream = false; }
                if (localStorage.FollowingList=JSON.stringify(local.FollowingList)) { return true; } else { return false; }
            } 
            /*else if (type == 'v') {
                z=b[id];
                if (!z.Stream) { return [ z.Name ];
                } else {
                    return [z.Name, z.Stream.Title, z.Stream.Game, z.Stream.Viewers, z.Stream.Time, z.Stream.GameIMG];
                }
            } else if (type == 'GameIMG') {
                x = b[id].Stream;
                x.GameIMG = name;
                return true;
            }*/
        } catch (e) {
            err('[0x03] FollowingList() ended with error: ' + e.message);
            console.debug(e.stack);
            return false;
        }
        return Error('Nope');
    }

    function doc(id){return document.getElementById(id);}
    function BadgeOnlineCount(count) { chrome.browserAction.setBadgeText({ text: String(count) })}

    function notifyUser(streamerName, titleOfStream, type, streamer) {
	    
        function delNotify(id, types) {
            var idToDel = id, times;
            if (types == 'Online') { times = 1000*15 }
            else if (types == 'Changed') { times = 1000*10 }
            else { times = 1000*20 }
            setTimeout(function(){chrome.notifications.clear(idToDel, function(){});}, times);
        }

        function sendNotify(tle, msg, strm, upd) {
            console.debug(TimeNdate(0, 0, '/') + ': ' + tle + ' -  ' + msg);
            var NotifyConf = {type:"basic", title:tle, message:msg, iconUrl:"/img/icon.png"};
            if (upd != 'ScriptUpdate') NotifyConf['buttons']=[{title:"Watch now!"}];
            chrome.notifications.create('n'+strm, NotifyConf, function(){});
            delNotify('n'+strm, upd);
            if (localJSON('Config','v',['Notifications','sound_status']) == 'Enable') {
                var Audio = document.createElement('audio');
                Audio.src = '/Music/' + localJSON('Config', 'v', ['Notifications', 'sound']) + '.mp3';
                Audio.autoplay = 'autoplay';
                Audio.play()
            }
        }

        if (localJSON('Config','v',['Notifications','status'])) {
		    if (type == 'Online' && localJSON('Config','v',['Notifications','online'])) {
		        sendNotify(streamerName, titleOfStream, NotificationsCount, type);
			    NotificationsCount++;
                NameBuffer.push(streamer);
		    } else if (type == 'Changed' && localJSON('Config','v',['Notifications','update'])) {
		        sendNotify(streamerName, titleOfStream, NotificationsCount, type);
			    NotificationsCount++;
                NameBuffer.push(streamer);
		    } else if (type == 'ScriptUpdate' && !sessionStorage.Disable_Update_Notifies) {
		        sendNotify(streamerName, titleOfStream, NotificationsCount, type);
			    NotificationsCount++;
                NameBuffer.push(' ');
		    } else {
		        console.debug(TimeNdate(0, 0, '/') + ': ' + streamerName + ' ' + titleOfStream + '   [Was not displayed]')
		    }
	    }
    }

    function Animation(id, name, clr, adds) {
        if (doc(id)) {
            var ci = $('#'+id);
            if (!clr) ci.show();
            ci.css('-webkit-animation', name+' both 1s');
            setTimeout(function(){
                if (clr) ci.hide();
                if (adds) adds();
            }, 1000);
        }
    }

    chrome.notifications.onButtonClicked.addListener(function(id){ window.open('http://www.twitch.tv/'+NameBuffer[id.match(/\d+/)[0]]) });
    chrome.notifications.onClosed.addListener(function(id){ chrome.notifications.clear(id,function(){})});
    chrome.notifications.onClicked.addListener(function(id){ chrome.notifications.clear(id,function(){})});

    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-25472862-3']);
    _gaq.push(['_setCustomVar', 3, 'App_Version', localJSON('App_Version').Ver, 1]);
    _gaq.push(['_trackPageview']);

    (function () { var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true; ga.src = 'https://ssl.google-analytics.com/ga.js'; var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s) })()

}