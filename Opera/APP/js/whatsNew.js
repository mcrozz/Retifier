/*
	Copyright 2014-2015 Ivan 'MacRozz' Zarudny

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
    "-1.0 Fresh look, added notifications (works only on 25+), fixed 'Following List' page, various improvements",
    "-0.9.0.4 Bug fixing",
    "-0.9.0.3 Code optimization",
    "-0.9.0.2 Fixed sound",
    "-0.9.0.1 Bugfix",
    "-0.9.0.0 First publish in Opera Web Store"
];
messages = {
    "v.0.9.0.3": {
        "msg": "Code optimization",
        "contain": ""
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
