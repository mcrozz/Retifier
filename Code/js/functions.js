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
{{FUNCTIONS_FIRST_START}}
if (localStorage.Ads === '') localStorage.Ads = '[]';
function err(msg) { var d = (new Date()); console.error('['+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()+']: '+msg.message ? msg.message : msg); if (msg.stack) console.debug(msg.stack); }
function log(msg) { var d = (new Date()); console.log('['+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()+']: '+msg); }
function TimeNdate(d,m) { var j = [31,28,31,30,31,30,31,31,30,31,30,31]; return (new Date()).getTime()+(Math.abs(d)*86400000)+(Math.abs(m)*86400000*j[(new Date()).getMonth()]); }
function doc(id){return document.getElementById(id);}
{{BADGE_ONLINE_COUNT}}
function Animation(id, n, f) {
    if (doc(id)) {
        var ci = $('#'+id);
        if (!n[1]) ci.show();
        if (!n[2]) n[2]=1;
        ci.css('-{{PLATFORM}}-animation', n[0]+' both '+n[2]+'s');
        setTimeout(function(){
            if (n[1]) ci.hide();
            if (typeof f === 'function') f();
        }, 1000*n[2]);
    }
}

var ncnt = 0, NameBuffer = [];
window.local = {};

function loc() {
    local.Config = JSON.parse(localStorage.Config);
    local.Status = JSON.parse(localStorage.Status);
    local.FollowingList = JSON.parse(localStorage.FollowingList);
    local.App_Version = JSON.parse(localStorage.App_Version);
}

try { loc() } catch(e) { err(e) }

{{INTERVAL_STORAGE_CHANGE}}

function localJSON(name,type,arrayz) {
    try {
        var sz, b, h;
        if (name&&type=='c'&&arrayz) {
            sz = arrayz.length;
            b = local[name];
            if (sz == 2) {
                b[arrayz[0]]=arrayz[1];
                localStorage[name] = JSON.stringify(b);
                loc();
                return true;
            } else if (sz == 3) {
                b[arrayz[0]][arrayz[1]] = arrayz[2];
                localStorage[name] = JSON.stringify(b);
                loc();
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

{{NOTIFY_USER_FUNCTION}}

// https://www.google-analytics.com
(function(i,s,o,g,r,a,m){
    i['GoogleAnalyticsObject']=r;
    i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},
    i[r].l=1*new Date();
    a=s.createElement(o), m=s.getElementsByTagName(o)[0];
    a.async=1; a.src=g;
    a.onload=function(){
        ga('create', 'UA-25472862-3', 'auto');
        ga('set', 'forceSSL', true);
        ga('send', {
            'hitType':'pageview',
            'page': window.location.pathname,
            'title': 'Popup page'
        });
        ga('set', 'appVersion', local.App_Version.Ver.replace('v.','')); };
    m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

// https://www.parsecdn.com
{{IF_BACKGROUND_BEGIN}}
(function(){
    var p=document.createElement('script'),
        s=document.getElementsByTagName('script')[0];
    p.type='text/javascript';p.async=true;
    p.src='https://www.parsecdn.com/js/parse-1.2.18.min.js';
    p.onload = function(){
        parse=true;
        Parse.initialize("PfjlSJhaRrf9GzabqVMATUd3Rn8poXpXjiNAT2uE","h4148nbRRIWRv5uxHQFbADDSItRLO631UR6denWm");
        var sj=new Parse.Query(Parse.Object.extend('Donators')),f;sj.each(function(e){if(e.attributes.User===local.Config.User_Name){localJSON('Config','c',['Timeout',1337]);f=1}});if(f!==1&&local.Config.Timeout===1337)localJSON('Config','c',['Timeout',0]);
        var usr = new Parse.User(); if (local.Config.User_Name!=='Guest'||local.Config.User_Name!==''){usr.set('username', local.Config.User_Name);usr.set('password', local.Config.User_Name);usr.signUp(null,{success:function(){log('Parse.com :: authorized')},error:function(u,e){error({message:e,stack:u})}})};
        var sj = new Parse.Query(Parse.Object.extend('Ads')), t = []; sj.each(function(e){ t.push(e.attributes.TwitchName); }).done(function(){localStorage.Ads = JSON.stringify(t);});
    }
    s.parentNode.insertBefore(p,s);
})();

setInterval(function(){
    if (parse) {
        var sj = new Parse.Query(Parse.Object.extend('Ads')), t = []; sj.each(function(e){ t.push(e.attributes.TwitchName); }).done(function(){localStorage.Ads = JSON.stringify(t);});
        var sj=new Parse.Query(Parse.Object.extend('Donators')),f;sj.each(function(e){if(e.attributes.User===local.Config.User_Name){localJSON('Config','c',['Timeout',1337]);f=1}});if(f!==1&&local.Config.Timeout===1337)localJSON('Config','c',['Timeout',0]);
    }
}, 1000*60*10);
{{IF_BACKGROUND_END}}