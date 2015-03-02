﻿/*
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

changes = [
  "1.4.1 Changed font to PermianSans Typeface, fixed ON/OFF statements, added notify on offline, optimized network code",
  "1.4 A lot of fixes",
  "1.3.9.5 Hotfix",
  "1.3.9.4 Fixed zoomed preview ratio",
  "1.3.9.3 Fixed Donation tab, various improvements",
  "1.3.9.2 Added authification by TwitchTV account, fixed sound on notifications",
  "1.3.9.1 Bug fix",
  "1.3.9 Edited some animation, edited design, stability improvements",
  "1.3.8 Fixed bug with text on hover, added new feature: zoom in",
  "1.3.7 Deleted live update feature, various style improvements",
  "1.3.6 Cumulative update",
  "1.3.5 Fixed live update",
  "1.3.4 Happy New Year!",
  "1.3.3 Cumulative update",
  "1.3.2 Style improvements",
  "1.3.1 Bug fixes, style improvements",
  "1.3.0 Added possibility to change style of online list, improvements",
  "1.2.9.9 More convenient options",
  "1.2.9 A little redesign, added DejaVu font (http://dejavu-fonts.org/)",
  "1.2.8 Hotfix",
  "1.2.7 Bug fixes",
  "1.2.6 Added 'Watch now!' button to notifications",
  "1.2.5 Added animations, thanks for Animate.css (http://daneden.me/animate)",
  "1.2.4 Modified live update",
  "1.2.3 Hotfix",
  "1.2.2 Hotfix",
  "1.2.0 Modified storage system",
  "1.1.9 Added version control for live updating",
  "1.1.8 Bug fixes",
  "1.1.7 Added live update feature. Fixed minor bugs",
  "1.1.6 Bug fixes",
  "1.1.5 Style optimizations. Now you can disable duration of stream. Button 'Found a bug?' now only viewable in options and in changes",
  "1.1.4 Fixed freezes while opening extension",
  "1.1.3 Fixed bug of notifications, fixed stream duration",
  "1.1.2 Added stream duration",
  "1.1.1 Hotfix",
  "1.1.0 Added sound effects for notifications. Added 'Changelog' page.",
  "1.0.2 Resolved a problem with freezes of extension",
  "1.0.1 Bug fixes",
  "1.0.0 First publish in Google Web Store"
];
messages = {
    "v.1.4.1": {
        "msg": "A long time update",
        "contain": "-Changed font from DejaVuSans to PermianSans Typeface <br />"+
            "-Fixed misspelling, miswording and etc <br />"+
            "-Now you can click on game banner <br />"+
            "-Added new feature for notifications: now you can get notifyed when streamer goes offline <br />"+
            "-Get informed right in time, optimized network code <br />"
    }
};

function versionCheck() {
    if (localStorage.FirstLaunch !== 'true') {
        var versions = local.App_Version,
            trys = Math.floor(localStorage.App_Version_Try);
        if (trys === 'NaN') localStorage.App_Version_Try = 1;
        if (trys >= 3 || localStorage.App_Version_Update === 'false') return false;

        if (localStorage.App_Version_Update === 'true') {
            localStorage.App_Version_Try = trys+1;
            localJSON('App_Version', 'c', ['Ver', versions.Got]);

            if (local.Config.Duration_of_stream === 'Enable') localJSON('Config','c',['Duration_of_stream', true]);
            if (local.Config.Duration_of_stream === 'Disable') localJSON('Config','c',['Duration_of_stream', false]);

            /*_$('WhatsNew').innerHTML = '<div class="msgTitle">'+messages[versions.Got].msg+'</div>'+
                '<div class="msgContain">'+messages[versions.Got].contain+'</div>'+
                '<button id="msgClose">Okay</button>';


            msgUnit += '<div class="msgChange">Please disable or enable option below</div>';
            msgUnit += '<div class="msgCheckbox"><input type="checkbox" id="msgDisSmth_1" checked="false">';
            msgUnit += messages[versionGot]['change']['STORAGE'][1];
            msgUnit += '</input></div>';

            Animation('WhatsNew', ['slideInDown', false]);

            _$('msgClose').onclick = function () {
                Animation('WhatsNew', ['slideOutUp', true]);
                localStorage.App_Version_Update=false;
            };*/
        }
    }
}
