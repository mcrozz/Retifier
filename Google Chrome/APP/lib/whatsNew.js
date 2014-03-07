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

changes = [
    "-1.3.9 Edited some animation, edited design, stability improvements",
    "-1.3.8 Fixed bug with text on hover, added new feature: zoom in",
    "-1.3.7 Deleted 'Live update' script, various style editings",
    "-1.3.6 Cumulative update",
    "-1.3.5 Fixed update script",
    "-1.3.4 Happy New Year!",
    "-1.3.3 Cumulative update",
    "-1.3.2 Style improvements",
    "-1.3.1 Bug fixes, style improvements",
    "-1.3.0 Added possibility to change style of online list, improvements",
    "-1.2.9.9 Now options are easy to understand",
    "-1.2.9 A little redesign, added DejaVu font",
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
messages = {
    "v.1.3.9": {
        "msg": "Stability improvements",
        "contain": "-Edited some animation <br /> -Edited design <br /> -Stability improvements"
    }
};

function versionCheck() {
    if (localStorage.FirstLaunch != 'true') {
        var versions = local.App_Version;

        if (versions.Got != versions.Ver) {
            notifyUser("Extension has been updated", "From " + versions.Ver + " to " + versions.Got, "ScriptUpdate", 'Upd' + Math.floor(Math.random(100) * 100));
            localJSON('App_Version', 'c', ['Ver', versions.Got]);
            localStorage.removeItem('Log');
            localStorage.removeItem('LogInf');

            var msgUnit;
            msgUnit = '<div class="msgTitle">';
                msgUnit += messages[versions.Got].msg;
            msgUnit += '</div>';
            msgUnit += '<div class="msgContain">';
                msgUnit += messages[versions.Got].contain;
            msgUnit += '</div>';

            /*
            msgUnit += '<div class="msgChange">Please disable or enable option below</div>';

            msgUnit += '<div class="msgCheckbox"><input type="checkbox" id="msgDisSmth_1" checked="false">';
            msgUnit += messages[versionGot]['change']['STORAGE'][1];
            msgUnit += '</input></div>';
            */
            msgUnit += '<button id="msgClose">Okay</button>';
            
            doc('WhatsNew').innerHTML = msgUnit;
            Animation('WhatsNew', ['slideInDown', false]);
            
            doc('msgClose').onclick = function () {
                Animation('WhatsNew', ['slideOutUp', true]);
            };
        }
    }
}