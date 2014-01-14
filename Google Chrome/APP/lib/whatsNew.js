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

var changes = [
    "-1.3.5 Fixed update script",
    "-1.3.4 Happy New Year!",
    "-1.3.3 Cumulative update",
    "-1.3.2 Style improvements",
    "-1.3.1 Bug fixes, style improvements",
    "-1.3.0 Added possibility to change style of online list, improvements",
    "-1.2.9.9 Now options are easy to understand",
    "-1.2.9 A little redesign, added DejaVu font<",
    "-1.2.8 Bug fixes, improvements",
    "-1.2.7 Bug fixes",
    "-1.2.6 Added 'Watch now!' to notifications",
    "-1.2.5 Added Animation, thanks for Animate.css (http://daneden.me/animate)",
    "-1.2.4 Reedited 'Live Update' script",
    "-1.2.3 Bug fixes (3), eyep",
    "-1.2.2 Bug fixes (2)",
    "-1.2.0 Modified storage system",
    "-1.1.9 Added version control for 'Live Update' script",
    "-1.1.8 Bug fixes",
    "-1.1.7 Added 'Live Update' script. Fixed minor bugs",
    "-1.1.6 Bug fixes",
    "-1.1.5 A little optimisation in style. Now you can disable duration of stream. Button 'Found a bug?' now only viewable in options and in changes",
    "-1.1.4 Fixed freezes on opening",
    "-1.1.3 Bug with notifications, fixed stream duration",
    "-1.1.2 Stream duration",
    "-1.1.1 Hotfix",
    "-1.1.0 Added sound effects for notifications. Added 'Version changes' page. And more...",
    "-1.0.2 Resolved a problem which freezes app",
    "-1.0.1 Bug fixes",
    "-1.0.0 First publish in Google Web Store"
];
var messages = {
    "v.1.3.5": {
        "msg": "Snowfall",
        "contain": "-Snowfall is now disabled by default but you can enable it down below <br / > -Fixed update script",
        "change": {
            "JSON": [null],
            "STORAGE": ['NewYearMode', 'Snowfall']
        }
    }
};

function versionCheck() {
    if (localStorage['FirstLaunch'] != 'true') {
        versionGot = localJSON('App_Version', 'v', ['Got']);

        if (versionGot != localJSON('App_Version', 'v', ['Ver'])) {
            notifyUser("Extension has been updated", "From " + localJSON('App_Version', 'v', ['Ver']) + " to " + versionGot, "ScriptUpdate", 'Upd' + Math.floor(Math.random(100) * 100));
            localJSON('App_Version', 'c', ['Ver', versionGot]);

            msgUnit = '<div class="msgTitle">';
            msgUnit += messages[versionGot]["msg"];
            msgUnit += '</div>';
            msgUnit += '<div class="msgContain">';
            msgUnit += messages[versionGot]["contain"];
            msgUnit += '</div>';

            msgUnit += '<div class="msgChange">Please disable or enable option below</div>';

            msgUnit += '<div class="msgCheckbox"><input type="checkbox" id="msgDisSmth_1" checked="false">';
            msgUnit += messages[versionGot]['change']['STORAGE'][1];
            msgUnit += '</input></div>';
            
            msgUnit += '<button id="msgClose">Okay</button>';
            doc('WhatsNew').style.display = 'block';
            $('#WhatsNew').addClass('animated slideInDown');

            doc('WhatsNew').innerHTML = msgUnit;
            doc('msgClose').addEventListener('click', function () {
                $('#WhatsNew').removeClass('animated slideInDown');
                $('#WhatsNew').addClass('animated slideOutUp');
                setTimeout(function () {
                    doc('WhatsNew').style.display = 'none';
                }, 1000);
                if (doc('msgDisSmth_1').checked) localStorage[messages[versionGot]['change']['STORAGE'][0]] = doc('msgDisSmth_1').checked;
                err('erase');
                setTimeout(function () { location.reload() }, 1005);
            });
        }
    }
}