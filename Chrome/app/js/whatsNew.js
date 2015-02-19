﻿{{LICENSE_HEADER}}
changes = [
    "-1.4.1 changed font to PermianSans Typeface, fixed ON/OFF statements, added notify on offline, optimized network code",
    "-1.4 Fresh look, fixed 'Following List' page, various improvements",
    "-1.3.9.9 Bug fixing",
    "-1.3.9.8 Code optimization",
    "-1.3.9.7 Fixed notifications",
    "-1.3.9.6 Bugfix",
    "-1.3.9.5 Hotfix",
    "-1.3.9.4 Fixed zoomed prewiew ratio",
    "-1.3.9.3 Fixed Donation tab, various improvements",
    "-1.3.9.2 Added auth by TwitchTV account, fixed sound in notifications",
    "-1.3.9.1 Bug fix",
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
    "v.1.4.1": {
        "msg": "Various improvements",
        "contain": "-changed font to PermianSans Typeface<br>-fixed ON/OFF statements<br>-added notify on offline<br>-optimized network code"
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

            /*doc('WhatsNew').innerHTML = '<div class="msgTitle">'+messages[versions.Got].msg+'</div>'+
                '<div class="msgContain">'+messages[versions.Got].contain+'</div>'+
                '<button id="msgClose">Okay</button>';


            msgUnit += '<div class="msgChange">Please disable or enable option below</div>';
            msgUnit += '<div class="msgCheckbox"><input type="checkbox" id="msgDisSmth_1" checked="false">';
            msgUnit += messages[versionGot]['change']['STORAGE'][1];
            msgUnit += '</input></div>';

            Animation('WhatsNew', ['slideInDown', false]);

            doc('msgClose').onclick = function () {
                Animation('WhatsNew', ['slideOutUp', true]);
                localStorage.App_Version_Update=false;
            };*/
        }
    }
}
