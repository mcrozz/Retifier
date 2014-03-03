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
    NameBuffer = [];
if (localStorage.Log == undefined) localStorage.Log = clearErrors;

var local = {};
try {
    local.Config = JSON.parse(localStorage.Config);
    local.Status = JSON.parse(localStorage.Status);
    local.FollowingList = JSON.parse(localStorage.FollowingList);
    local.App_Version = JSON.parse(localStorage.App_Version);
} catch(e) { console.error(e.stack) }

setInterval(function(){
    if (typeof localStorage.Changed !== 'undefined') {
        try {
            local.Config = JSON.parse(localStorage.Config);
            local.Status = JSON.parse(localStorage.Status);
            local.FollowingList = JSON.parse(localStorage.FollowingList);
            local.App_Version = JSON.parse(localStorage.App_Version);
            localStorage.removeItem('Changed');
        } catch(e) { console.error(e.stack) }
    }
},1000);

if (localStorage.Status&&localStorage.Config) {
    function err(msg) { console.error('[ERROR] ' + msg.substring(7)); }
    function log(msg) { if (local.Config.Debug) console.log(msg); }

    function TimeNdate(d, m, k) {
        // TODO: will not add years
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
            if (name&&type=='c'&&arrayz) {
                sz = arrayz.length;
                b = local[name];
                if (sz == 2) {
                    b[arrayz[0]]=arrayz[1];
                    localStorage[name] = JSON.stringify(b);
                    localStorage.Changed = 'y';
                    return true;
                } else if (sz == 3) {
                    b[arrayz[0]][arrayz[1]] = arrayz[2];
                    localStorage[name] = JSON.stringify(b);
                    localStorage.Changed = 'y';
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
                };
                return localStorage.FollowingList = JSON.stringify(local.FollowingList);
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
                return localStorage.FollowingList = JSON.stringify(local.FollowingList);
            }
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

    function Animation(id, n, f) {
        if (doc(id)) {
            var ci = $('#'+id);
            if (!n[1]) ci.show();
            if (!n[2]) n[2] = 1;
            ci.css('-webkit-animation', n[0]+' both '+n[2]+'s');
            setTimeout(function(){
                if (n[1]) ci.hide();
                if (typeof f === 'function') f();
            }, 1000 * n[2]);
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