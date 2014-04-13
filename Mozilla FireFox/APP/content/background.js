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
if (!sessionStorage.FirstLoad) {
    sessionStorage.FirstLoad = 'true';
    BadgeOnlineCount(0);
    localJSON('Status', 'c', ['online', 0]);
    for (var i = 0; i < localJSON('Following'); i++) { FollowingList('c', i, '', false) }
}

function CheckFollowingList() {
    function checkStatus(url,key) {
        var checkStatus = $.getJSON(url)
            .fail(function () { 
                err('[0x04] checkStatus() ended with error'); 
                notifyUser("Update follows list", "Error, can't update", "Update"); 
                localJSON('Status', 'c', ['update', 5]);
            });

        checkStatus.complete(function() {
            localJSON('Status', 'c', ['checked', local.Status.checked + 1]);

            if (checkStatus.responseJSON.stream) {
                if (!local.FollowingList[key].Stream.Title) localJSON('Status', 'c', ['online', local.Status.online + 1]);

                var Game = checkStatus.responseJSON.stream.game,
                    Status = checkStatus.responseJSON.stream.channel.status,
                    Name = local.FollowingList[key].Name,
                    Time = checkStatus.responseJSON.stream.channel.updated_at.replace('T', ' ').replace('Z', ' ')+' GMT+0000';

                if (Status == null) Status = 'Untitled stream';
                if (Game == null) Game = 'Not playing';
                if (local.FollowingList[key].Stream.Title == null) notifyUser(Name+' just went live!',Status,'Online',Name);
                if (local.FollowingList[key].Stream.Title != Status && local.FollowingList[key].Stream.Title != undefined)notifyUser(Name+' changed stream title on',Status,'Changed',Name);
                if (Math.abs(new Date() - new Date(Time)) > Math.abs(new Date() - new Date(local.FollowingList[key].Stream.Time)) || local.FollowingList[key].Stream.Time == null) { Time2 = Time }
                else { Time2 = local.FollowingList[key].Stream.Time }

                FollowingList('c',key,'',[Status, Game, checkStatus.responseJSON.stream.viewers, Time2, "NotYet"])
            } else if (local.FollowingList[key].Stream) {
                localJSON('Status', 'c', ['online', local.Status.online - 1]);
                BadgeOnlineCount(local.Status.online);
                FollowingList('c', key, '', false)                      
            }
            if (local.Status.checked == localJSON('Following') || key == localJSON('Following')) {
                BadgeOnlineCount(local.Status.online);
                sessionStorage.First_Notify = 1;
                console.log('Every channel checked ('+local.Status.checked+')');
                localJSON('Status', 'c', ['update', 0]);

                if (local.Status.online > 1) {
                    notifyUser('Update finished!', 'Now online '+local.Status.online+' channels', 'Update')
                } else if (local.Status.online == 1) {
                    notifyUser('Update finished!', 'Now online one channel', 'Update')
                } else if (local.Status.online == 0) {
                    notifyUser('Update finished!', 'No one online right now :(', 'Update')
                }
            }
        });
    }

    // Get donation list
    $.ajax({
        url: "https://www.mcrozz.net/app/Twitch.tv_Notifier/DonationsList.php",
        complete: function(data) {
            try {
                var rsp = JSON.parse(data.responseText)
            } catch (e) {console.debug(e.stack)}
            if (rsp.indexOf(hex_md5(local.Config.User_Name)) != -1 ) {
                localJSON('Config','c',['Timeout', 1337]);
                localJSON('Config','c',['Ceneled', true]);
                localJSON('Config','c',['Closed', true]);
            }
        },
        error: function() { err('[0x06] Failed to get donations list... '); }
    });

    if (!localStorage.Following) localStorage.Following = 0;
    var twitch = 'Not loaded yet!',
        urlToJSON = 'https://api.twitch.tv/kraken/users/'+local.Config.User_Name+'/follows/channels?limit=116&offset=0';
    localJSON('Status', 'c', ['update', 1]);

    if (local.Config.User_Name == 'Guest' || typeof local.Config.User_Name === 'undefined') {
        localJSON('Status', 'c', ['update', 6]);
        console.log('Change user name!')
    } else {
        console.log("Behold! Update is comin'");
        notifyUser('Behold! Update!', 'Starting update...', 'Update');
        localJSON('Status', 'c', ['update', 2]);

        var FLG = $.getJSON(urlToJSON);
        FLG.fail(function () {
            err("[0x07] Can't get following list");
            localJSON('Status', 'c', ['update', 5]);
            notifyUser("Update follows list", "Error, can't update", "Update");
        });
        FLG.done(function (data) {
            var twitch = data;
            if (Math.floor(localStorage.Following) != twitch._total) {
                console.log('Update list of following channels');
                localStorage.Following = twitch._total;
                localJSON('Status', 'c', ['online', 0]);

                for (var i=0; i<localJSON('Following'); i++) FLG.responseJSON.follows[i] ? FollowingList('add', i, FLG.responseJSON.follows[i].channel.name) : console.debug(FLG.responseJSON);
            }
            localJSON('Status','c',['checked', 0]);
            localJSON('Status','c',['update', 4]);
            console.log('Checking Status of channels...');
            for (var i = 0; i < localJSON('Following'); i++) checkStatus('https://api.twitch.tv/kraken/streams/'+local.FollowingList[i].Name, i);
        });
    }
}

CheckFollowingList();
CheckTwitch = setInterval(function(){CheckFollowingList()}, 60000 * local.Config.Interval_of_Checking);
localJSON('Status','c',['StopInterval',false]);
setInterval(function(){
    if (local.Status.StopInterval) {
        clearInterval(CheckTwitch);
        CheckFollowingList();
        CheckTwitch = setInterval(function(){CheckFollowingList()}, 60000 * local.Config.Interval_of_Checking);
        localJSON('Status','c',['StopInterval', false])
    }
},500);