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
if (window.location.pathname === '/background.html') {
    $.ajaxSetup ({cache:false,crossDomain:true});
    if (!localStorage.Config) localStorage.Config = '{"User_Name":"Guest","token":"","Notifications":{"status":true,"online":true,"update":false,"sound_status":true,"sound":"DinDon","status":true,"follow":false},"Duration_of_stream":true,"Interval_of_Checking":3,"Format":"Grid"}';
    if (!localStorage.Status) localStorage.Status = '{"update":0,"online":0,"checked":0,"StopInterval":false}';
    if (!localStorage.FirstLaunch) localStorage.FirstLaunch='true';
    try { 
        JSON.parse(localStorage.App_Version); 
        $.getJSON('./manifest.json', function (d){
            localJSON('App_Version', 'c', ['Got', 'v.'+d.version]);
            localJSON('App_Version', 'c', ['Ver', 'v.'+d.version]);
            if (local.App_Version.Ver !== 'v.'+d.version) {
                notifyUser("Extension has been updated", "From "+local.App_Version.Ver+" to "+d.version, "ScriptUpdate", 'Upd'+Math.floor(Math.random(100)*100));
                localStorage.App_Version_Update=true;
                localStorage.App_Version_Try=0
            }
        });
    }
    catch(e) { localStorage.App_Version = '{"Ver": "v.0.9.0.1", "Got": "v.0.9.0.1"}'; localStorage.App_Version_Update=false; localStorage.App_Version_Try=0 }
    //chrome.notifications.onButtonClicked.addListener(function(id){ window.open('http://www.twitch.tv/'+NameBuffer[id.match(/\d+/)[0]]) });
    //chrome.notifications.onClosed.addListener(function(id){ chrome.notifications.clear(id,function(){})});
    //chrome.notifications.onClicked.addListener(function(id){ chrome.notifications.clear(id,function(){})});
}
function err(msg) { var d = (new Date()); console.error('['+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()+']: '+msg.message ? msg.message : msg); if (msg.stack) console.debug(msg.stack); }
function log(msg) { var d = (new Date()); console.log('['+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()+']: '+msg); }
function TimeNdate(d,m) { var j = [31,28,31,30,31,30,31,31,30,31,30,31]; return (new Date()).getTime()+(Math.abs(d)*86400000)+(Math.abs(m)*86400000*j[(new Date()).getMonth()]); }
function doc(id){return document.getElementById(id);}
function BadgeOnlineCount(count) { chrome.browserAction.setBadgeText({ text: String(count) })}
function Animation(id, n, f) {
    if (doc(id)) {
        var ci = $('#'+id);
        if (!n[1]) ci.show();
        if (!n[2]) n[2]=1;
        ci.css('-webkit-animation', n[0]+' both '+n[2]+'s');
        setTimeout(function(){
            if (n[1]) ci.hide();
            if (typeof f === 'function') f();
        }, 1000*n[2]);
    }
}

var ncnt = 0, NameBuffer = [];
local = {};

function loc() {
    local.Config = JSON.parse(localStorage.Config);
    local.Status = JSON.parse(localStorage.Status);
    local.FollowingList = JSON.parse(localStorage.FollowingList);
    local.App_Version = JSON.parse(localStorage.App_Version);
}

try { loc() } catch(e) { err(e) }

setInterval(function(){
    if (typeof localStorage.ChangedBG !== 'undefined' && window.location.pathname === '/background.html') {
        try { loc(); localStorage.removeItem('ChangedBG') } catch(e) { err(e) }
    } else if (typeof localStorage.ChangedPP !== 'undefined' && window.location.pathname === '/popup.html') {
        try { loc(); localStorage.removeItem('ChangedPP') } catch(e) { err(e) }
    }
}, 100);

if (localStorage.Status&&localStorage.Config) {
    function localJSON(name,type,arrayz) {
        function chd() {localStorage.ChangedBG = 'y'; localStorage.ChangedPP = 'y'}
        try {
            var sz, b, h;
            if (name&&type=='c'&&arrayz) {
                sz = arrayz.length;
                b = local[name];
                if (sz == 2) {
                    b[arrayz[0]]=arrayz[1];
                    localStorage[name] = JSON.stringify(b);
                    chd();
                    return true;
                } else if (sz == 3) {
                    b[arrayz[0]][arrayz[1]] = arrayz[2];
                    localStorage[name] = JSON.stringify(b);
                    chd();
                    return true;
                } else {
                    return false;
                }
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
            err(e);
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
        } catch (e) { err(e); return false; }
        return Error('Nope');
    }

    function notifyUser(streamerName, titleOfStream, type, streamer) {
        // Currently Opera does not support notifications
        if (window.location.pathname !== '/background.html') return false;
        function delNotify(id, types) {
            var idToDel = id, times = 1000;
            switch (types) {
                case 'Online': times *= 120; break;
                case 'Changed': times *= 60; break;
                default: times *= 60; break;
            }
            setTimeout(function(){chrome.notifications.clear(idToDel, function(){});}, times);
        }

        function sendNotify(tle, msg, strm, upd) {
            log(tle+' - '+msg);
            var NotifyConf = {type:"basic", title:tle, message:msg, iconUrl:"/img/icon.png"};
            if (upd !== 'ScriptUpdate') NotifyConf['buttons']=[{title:"Watch now!"}];
            //chrome.notifications.create('n'+strm, NotifyConf, function(){});
            //delNotify('n'+strm, upd);
            if (local.Config.Notifications.sound_status) {
                var a = document.createElement('audio');
                a.src = '/Music/'+local.Config.Notifications.sound+'.wav';
                a.play();
            }
        }

        if (local.Config.Notifications.status) {
            if (type === 'Online' && local.Config.Notifications.online) {
                sendNotify(streamerName, titleOfStream, ncnt, type);
                ncnt++; NameBuffer.push(streamer);
            } else if (type === 'Changed' && local.Config.Notifications.update) {
                sendNotify(streamerName, titleOfStream, ncnt, type);
                ncnt++; NameBuffer.push(streamer);
            } else if (type === 'ScriptUpdate' && !sessionStorage.Disable_Update_Notifies) {
                sendNotify(streamerName, titleOfStream, ncnt, type);
                ncnt++; NameBuffer.push(' ');
            } else { log(streamerName+' '+titleOfStream+' :: [Was not displayed]'); }
        }
    }

    // https://www.google-analytics.com
    (function(i,s,o,g,r,a,m){
        i['GoogleAnalyticsObject']=r;
        i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},
        i[r].l=1*new Date();
        a=s.createElement(o), m=s.getElementsByTagName(o)[0];
        a.async=1; a.src=g;
        m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-25472862-3', 'mcrozz.ru');
    ga('send', 'pageview');
    ga('set', 'App_Version', local.App_Version.Ver);

    // https://www.parsecdn.com
    if (window.location.pathname === '/background.html') {
        (function(){
            var p=document.createElement('script'),s=document.getElementsByTagName('script')[0];p.type='text/javascript';p.async=true;
            p.src='lib/parse-1.2.18.min.js';
            p.onload = function(){Parse.initialize("PfjlSJhaRrf9GzabqVMATUd3Rn8poXpXjiNAT2uE","h4148nbRRIWRv5uxHQFbADDSItRLO631UR6denWm");var sj=new Parse.Query(Parse.Object.extend('Donators')),f;sj.each(function(e){if(e.attributes.User===local.Config.User_Name){localJSON('Config','c',['Timeout',1337]);f=1}});if(f!==1&&local.Config.Timeout===1337)localJSON('Config','c',['Timeout',0]);}
            s.parentNode.insertBefore(p,s);
        })();
    }

}