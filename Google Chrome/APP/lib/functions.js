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
var NotificationsCount=0,
    clearErrors = "0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0",
    ErrorList = [1, "", 2, "", 3, "", 4, "", 5, "", 6, "", 7, "", 8, "", 9, "", 10, "", 11, "", 12, "", 13, "", 14, "", 15, ""];
if (localStorage['Log'] == undefined) localStorage['Log'] = clearErrors;

if (localStorage['Status']&&localStorage['Config']) {
    function err(msg) {
        try {
            log = localStorage['Log'].split('/');
            msg[3]=='0' ? code = Math.floor(msg[4]) : code = Math.floor(msg[4]*10);
            j = ErrorList.indexOf(code);
            if (j != -1) {
                log[j] = Math.floor(log[j]) + 1;
                if (log[j + 1] == "0") log[j + 1] = Math.abs(new Date());
                console.debug('Adding to ' + ErrorList[j] + ' one');
                localStorage['Log'] = log.join('/');
                console.error('[ERROR] ' + msg.substring(7));
                return true;
            } else {
                return false;
                console.error("[ERROR] err() ended with error: Couldn't find error in list");
            }
        } catch (e) {
            localStorage['Log'] = clearErrors;
            console.error('[ERROR] err() ended with error: ' + e.message);
            return false;
        }
    }

    function TimeNdate(d, m, k) {
        newDate = new Date();
        time = '';
        if ((newDate.getMonth() + 1 + m) < 10) time += "0" + (newDate.getMonth() + 1 + m);
        else time += (newDate.getMonth() + 1 + m);
        time += k;
        if ((newDate.getDate() + d) < 10) time += "0" + (newDate.getDate() + d);
        else time += (newDate.getDate() + d);
        time += k;
        time += ((new Date()).getYear() - 100);
        time += ' ' + newDate.getHours() + ':';
        newDate.getMinutes()<10 ? time += newDate.getMinutes()*10 : time += newDate.getMinutes();
        return time;
    }

    function localJSON(name,type,arrayz) {
        try {
            if (name && type == 'c' && arrayz) {
                sz = arrayz.length;
                b = JSON.parse(localStorage[name]);
                if (sz == 2) {
                    b[arrayz[0]]=arrayz[1];
                    if (localStorage[name]=JSON.stringify(b)) return true; else return false;
                } else if (sz == 3) {
                    h = b[arrayz[0]];
                    h[arrayz[1]] = arrayz[2];
                    b[arrayz[0]] = h;
                    if (localStorage[name]=JSON.stringify(b)) {return true;} else {return false;}		
                } else {return false;}
            } else if (name&&type=='v'&&arrayz) {
                b = JSON.parse(localStorage[name]);
                if (arrayz.length == 1){			
                    if (b[arrayz[0]]) {return b[arrayz[0]];} else {return false;}
                } else if (arrayz.length == 2) {
                    f = b[arrayz[0]];
                    if (f[arrayz[1]]) {return f[arrayz[1]];} else {return false;}
                } else {return false;}
            } else if (name&&!type&&!arrayz) {
                return JSON.parse(localStorage[name]);
            } else { return false; Error('[ERROR]: Wrong input in localJSON function!') }
        } catch (e) {
            err('[0x02] localJSON() ended with error: ' + e.message);
            return "ERROR";
        }
    }

    if (localStorage['FollowingList']==undefined) {localStorage['FollowingList']='{}'};
    function FollowingList(type,id,name,stream) {
        try {
            b = JSON.parse(localStorage['FollowingList']);
            if (type == 'add') {
                b[id]={};
                z=b[id];
                z['Name']=name;
                z['Stream']=false;
                if (localStorage['FollowingList']=JSON.stringify(b)) {return true;} else {return false;}
            } else if (type == 'c') {
                z=b[id];
                if (stream) {
                    z['Stream']={};
                    x=z['Stream'];
                    x['Title']=stream[0];
                    x['Game']=stream[1];
                    x['Viewers']=stream[2];
                    x['Time'] = stream[3];
                    x['GameIMG'] = stream[4]
                } else { z['Stream']=false }
                if (localStorage['FollowingList']=JSON.stringify(b)) {return true;} else {return false;}
            } else if (type == 'v') {
                z=b[id];
                if (!z['Stream']) { return [ z['Name'] ];
                } else {
                    return [z['Name'], z['Stream']['Title'], z['Stream']['Game'], z['Stream']['Viewers'], z['Stream']['Time'], z['Stream']['GameIMG']];
                }
            } else if (type == 'GameIMG') {
                x = b[id]['Stream'];
                x['GameIMG'] = name;
                return true;
            }
        } catch (e) {
            err('[0x03] FollowingList() ended with error: ' + e.message);
            return false;
        }
    }

    function doc(id){return document.getElementById(id);}
    function BadgeOnlineCount(count) { chrome.browserAction.setBadgeText({ text: String(count) })}

    function sendNotify(Title, msg, streamer, scriptUpd) {
        console.debug(TimeNdate(0, 0, '/') + ': ' + Title + ' -  ' + msg);
	    NotifyConf = {type:"basic",title:Title,message:msg,iconUrl:"/img/goesOnline.png"};
	    if (!scriptUpd) NotifyConf['buttons']=[{title:"Watch now!"}];
	    chrome.notifications.create(streamer,NotifyConf,function(){});
	    if (localJSON('Config','v',['Notifications','sound_status']) == 'Enable') {
		    Audio = document.createElement('audio');
		    Audio.setAttribute('src', '/Music/' + localJSON('Config', 'v', ['Notifications', 'sound']) + '.mp3');
		    Audio.setAttribute('autoplay', 'autoplay');
		    Audio.play()
	    }
    }

    function notifyUser(streamerName, titleOfStream, type, streamer) {
	    if (localJSON('Config','v',['Notifications','status'])) {
		    date = new Date();
		    if (type == 'Online' && localJSON('Config','v',['Notifications','online'])) {
		        sendNotify(streamerName, titleOfStream, streamer);
			    NotificationsCount++;
		    } else if (type == 'Changed' && localJSON('Config','v',['Notifications','update'])) {
		        sendNotify(streamerName, titleOfStream, streamer);
			    NotificationsCount++;
		    } else if (type == 'ScriptUpdate' && !sessionStorage['Disable_Update_Notifies']) {
		        sendNotify(streamerName, titleOfStream, streamer, 'Update');
			    NotificationsCount++;
		    } else {
		        console.debug(TimeNdate(0, 0, '/') + ': ' + streamerName + ' ' + titleOfStream + '   [Was not displayed]')
		    }
		    sessionStorage['NotificationsCount'] = NotificationsCount;
	    }
    }

    chrome.notifications.onButtonClicked.addListener(function(notificationId){ window.open('http://www.twitch.tv/'+notificationId) });
    chrome.notifications.onClosed.addListener(function(notificationId){ chrome.notifications.clear(notificationId,function(){})});
    chrome.notifications.onClicked.addListener(function(notificationId){ chrome.notifications.clear(notificationId,function(){})});

    Math.floor(localJSON('Code').Background.version) < Math.floor(localJSON('Code').Background.version_geted) ? Background = 'Out dated' : Background = 'New';
    Math.floor(localJSON('Code').Popup.version) < Math.floor(localJSON('Code').Background.version_geted) ? Popup = 'Out dated' : Popup = 'New';
    Math.floor(localJSON('Code').Background.version) < Math.floor(localJSON('Code').Background.version_geted) ? insertFunc = 'Out dated' : insertFunc = 'New';


    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-25472862-3']);
    _gaq.push(['_setCustomVar', 3, 'App_Version', localStorage['App_Version'], 1]);
    _gaq.push(['_setCustomVar', 2, 'BackgroundJS', localJSON('Code','v',['Background','version']), 1]);
    _gaq.push(['_setCustomVar', 2, 'PopupJS', localJSON('Code','v',['Popup','version']), 1]);
    _gaq.push(['_setCustomVar', 3, 'insertFuncJS', localJSON('Code','v',['Background','version']), 1]);
    _gaq.push(['_trackPageview']);

    (function () { var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true; ga.src = 'https://ssl.google-analytics.com/ga.js'; var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s) })()

}