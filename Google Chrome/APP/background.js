/*
    Copyright 2013 Ivan 'MacRozz' Zarudny

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.


    Status Update

    0 :: Not updating, finished
    1 :: Timer ended, start update
    2 :: Update list of followed channels
    3 :: List of followed channels updated
    4 :: Checking online channel
    5 :: Error
    6 :: Name doesn't set up!
    7 :: First start
*/
if (localStorage['AfterUPDchange'] == undefined) localStorage['Following'] = 0;
if (!sessionStorage['FirstLoad']) {
    sessionStorage['FirstLoad'] = 'true';
    BadgeOnlineCount(0);
    localJSON('Status', 'c', ['online',0]);
    for (var i=0;i<Math.floor(localJSON('Following'));i++) { FollowingList('c', i, '', false) }
}

function checkDonations() {
    var GetDonationsList = $.ajax({ url: "https://www.mcrozz.net/app/Twitch.tv_Notifier/DonationsList.php" });
    GetDonationsList.done(function(){
        try {
            ParsedResponse = JSON.parse(GetDonationsList.responseText);
            if (ParsedResponse.indexOf(hex_md5(localJSON('Config','v',['User_Name']))) != -1 ) {
                localJSON('Config','c',['Timeout',new Date().setDate(new Date().getDate()+30)]);
                localJSON('Config','c',['Ceneled','true']);
                localJSON('Config','c',['Closed','true']);
            }
        } catch (e) {
            err('[0x05] Failed to parse donations list... ' + e.message);
        }
    });
    GetDonationsList.error(function () { err('[0x06] Failed to get donations list... '); });
}

function checkStatus(url,key) {
    var checkStatus = $.getJSON(url)
        .fail(function () { 
            err('[0x04] checkStatus() ended with error'); 
            notifyUser("Update follows list", "Error, can't update", "Update"); 
            localJSON('Status', 'c', ['update', 5]);
        });

    checkStatus.complete(function() {
        localJSON('Status', 'c', ['checked', localJSON('Status', 'v', ['checked']) + 1]);
        FlwLst = FollowingList('v',key);

        if (checkStatus.responseJSON.stream) {
            if (!FlwLst[1]) localJSON('Status', 'c', ['online', localJSON('Status', 'v', ['online']) + 1]);

            Game = checkStatus.responseJSON.stream.game;
            Status = checkStatus.responseJSON.stream.channel.status;
            Name = FollowingList('v',key)[0];
            Time = checkStatus.responseJSON.stream.channel.updated_at;            

            if (Status == null) Status = 'Untitled stream';
            if (Game == null) Game = 'Not playing';
            if (FlwLst[1] == null) notifyUser(Name+' just went live!',Status,'Online',Name);
            if (FlwLst[1] != Status && FlwLst[1] != undefined)notifyUser(Name+' changed stream title on',Status,'Changed',Name);
            if (Math.abs(new Date() - new Date(Time)) > Math.abs(new Date() - new Date(FlwLst[4])) || !FollowingList('v', key) || FlwLst[4] == null) { Time2 = Time }
            else { Time2 = FlwLst[4] }

            FollowingList('c',key,'',[Status, Game, checkStatus.responseJSON.stream.viewers, Time2, "NotYet"])
        } else if (FlwLst[1]) {
            localJSON('Status', 'c', ['online', localJSON('Status', 'v', ['online']) - 1]);
            BadgeOnlineCount(Onln);
            FollowingList('c', key, '', false)                      
        }
        if (localJSON('Status', 'v', ['checked']) == localJSON('Following')) {
            Onln = localJSON('Status', 'v', ['online']);
            if (!Onln) Onln = 0;
            BadgeOnlineCount(Onln);
            sessionStorage['First_Notify'] = 1;
            console.log('Every channel checked (' + localJSON('Status', 'v', ['checked']) + ')');
            localJSON('Status', 'c', ['update', 0]);
        }
    });
}

function CheckUserStatus() {
    localJSON('Status','c',['checked',0]);
    localJSON('Status','c',['update',4]);
    console.log('Checking status of channels...');
    for (var i = 0; i < localJSON('Following') ; i++) checkStatus('https://api.twitch.tv/kraken/streams/' + FollowingList('v', i)[0], i);
}

var FirstStart = '1',FirstStart2 = '1';

function CheckFollowingList() {
    checkDonations();
    if (localStorage['Following'] == undefined || localStorage['Following'] == null) localStorage['Following'] = 0;
    var twitch = 'Not loaded yet!',
        urlToJSON = 'https://api.twitch.tv/kraken/users/' + localJSON('Config', 'v', ['User_Name']) + '/follows/channels?limit=116&offset=0';
    localJSON('Status', 'c', ['update', 1]);

    if (localJSON('Config', 'v', ['User_Name']) == 'Guest') {
        localJSON('Status', 'c', ['update', 6]);
        console.log('Change user name!')
    } else {
        console.log("Behold! Update is comin'");
        notifyUser('Behold! Update!', 'Starting update...', 'Update');
        localJSON('Status', 'c', ['update', 2]);

        var updateFollowingListAndCheck = $.getJSON(urlToJSON, function (data, status) {
            twitch = data;
            if ([200, 304].indexOf(updateFollowingListAndCheck.status) == -1) {
                err("[0x07] Can't get following list "+updateFollowingListAndCheck.status);
                localJSON('Status', 'c', ['update', 5]);
                notifyUser("Update follows list", "Error, can't update", "Update");
            } else {
                localJSON('Status', 'c', ['update', 3]);
                console.log('List of following channels got, checking status');
            }
        });

        updateFollowingListAndCheck.fail(function () {
            err("[0x07] Can't get following list");
            localJSON('Status', 'c', ['update', 5]);
            notifyUser("Update follows list", "Error, can't update", "Update");
        });

        updateFollowingListAndCheck.done(function () {
            if (Math.floor(localStorage['Following']) != twitch._total) {
                console.log('Update list of following channels');
                localStorage['Following'] = twitch._total;
                localJSON('Status', 'c', ['online', 0]);

                for (var i = 0; i < Math.floor(localStorage['Following']) ; i++) {
                    if (updateFollowingListAndCheck.responseJSON.follows[i]) {
                        FollowingList('add', i, updateFollowingListAndCheck.responseJSON.follows[i].channel.name)
                    } else { console.debug(updateFollowingListAndCheck.responseJSON); console.error('Get name of ' + i + ' ended with error') }
                }
            }
            CheckUserStatus()
        });
    }
}

CheckFollowingList()
CheckTwitch = setInterval(function(){CheckFollowingList()}, 60000 * localJSON('Config','v',['Interval_of_Checking']));
localJSON('Status','c',['StopInterval',false]);
IntervalSetted=1;
setInterval(function(){
    if (!localJSON('Status','v',['StopInterval']) && IntervalSetted==0){
        CheckFollowingList();
        CheckTwitch = setInterval(function(){CheckFollowingList()}, 60000 * localJSON('Config','v',['Interval_of_Checking']));
        IntervalSetted=1
    } else if (localJSON('Status','v',['StopInterval']) && IntervalSetted==1){
        clearInterval(CheckTwitch);
        IntervalSetted=0;
        localJSON('Status','c',['StopInterval',false])
    } else if (localJSON('Status','v',['StopInterval'])){
        IntervalSetted=0;
        localJSON('Status','c',['StopInterval',false])
    }        
},500);


setInterval(function () {
    if (sessionStorage['First_Notify'] == 1) {
        if (localJSON('Status', 'v', ['online']) > 1) {
            textANDchannel = 'Now online ' + localJSON('Status', 'v', ['online']) + ' channels';
            notifyUser('Update finished!', textANDchannel, 'Update')
        } else if (localJSON('Status', 'v', ['online']) == 1) {
            textANDchannel = 'Now online one channel';
            notifyUser('Update finished!', textANDchannel, 'Update')
        } else if (localJSON('Status', 'v', ['online']) == 0) {
            textANDchannel = 'No one online right now :(';
            notifyUser('Update finished!', textANDchannel, 'Update')
        }
        sessionStorage['First_Notify'] = 0
    }
    /*
    if (sessionStorage['NotificationsCount'] != 0) {
        for (var i = 0; i < sessionStorage['NotificationsCount']; i++) {
            if (Math.abs(new Date()) > NotifierStrg('nf' + i, 'ch')[0] && !NotifierStrg('nf' + i, 'ch')[1])
                chrome.notifications.clear('nf' + i, function () { NotifierStrg('nf' + i, true) });
        }
    }
    */
}, 1000);

setInterval(function () {
    // Send logged errors to my site...
    if (new Date().getDate() - new Date(localStorage['LogInf']).getDate() >= 14 || new Date(localStorage['LogInf']).getDate() - new Date().getDate() >= 14) {
        console.debug('Send errors log to my site...');
        rAjax = $.ajax({ url: "https://www.mcrozz.net/app/Twitch.tv_Notifier/errors/log.php?errors=" + err('export') })
        .done(function () {
            if ((rAjax.responseText).indexOf('0x01') != -1) {
                console.debug('Success! Thanks for help!)');
                localStorage['LogInf'] = TimeNdate(14, 0, ' ');
                err('erase');
            } else { console.debug('Server caused error...'); }
        })
        .fail(function () { console.debug('Failed to connect...'); });
    } else if (!localStorage['LogInf']) localStorage['LogInf'] = TimeNdate(0,0,' ');
}, 15000);