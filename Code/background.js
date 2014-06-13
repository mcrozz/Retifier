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

BadgeOnlineCount(0);
localJSON('Status', ['online', 0]);
for (var i = 0; i < localJSON('Following'); i++) FollowingList('c', i, '', false);

if (localStorage.FirstLaunch === 'true') {
    localStorage.Following = 0;
    localJSON('Status',['update',7]);
    BadgeOnlineCount(' Hi ');
}

var NowOnline = [];

function CheckFollowingList() {
    function checkStatus(url,key,ch) {
        $.getJSON(url)
        .fail(function(j) { 
            err({message:'checkStatus() ended with error',stack:j});
            notifyUser("Update follows list", "Error, can't update", "Update"); 
            localJSON('Status', ['update', 5]);
        })
        .done(function(j) {
            localJSON('Status', ['checked', local.Status.checked + 1]);

            if (j.stream) {
                var Game = j.stream.game,
                    Status = j.stream.channel.status,
                    Name = local.FollowingList[key].Name,
                    Time = j.stream.channel.updated_at.replace('T', ' ').replace('Z', ' ')+' GMT+0000';

                if (Status === null) Status = 'Untitled stream';
                if (Game === null) Game = 'Not playing';
                if (!local.FollowingList[key].Stream.Title &&
                    !local.FollowingList[key].Stream.Game &&
                    NowOnline.indexOf(Name) === -1)
                {
                    notifyUser(Name+' just went live!',Status,'Online',Name);
                    localJSON('Status', ['online', local.Status.online + 1]);
                    NowOnline.push(Name);
                }
                if (local.FollowingList[key].Stream.Title != Status &&
                    local.FollowingList[key].Stream.Title != undefined) notifyUser(Name+' changed stream title on',Status,'Changed',Name);
                if (Math.abs(new Date() - new Date(Time)) > Math.abs(new Date() - new Date(local.FollowingList[key].Stream.Time)) || local.FollowingList[key].Stream.Time == null) { Time2 = Time }
                else { Time2 = local.FollowingList[key].Stream.Time }

                FollowingList('c',key,'',[Status, Game, j.stream.viewers, Time2, "NotYet"])
            } else if (local.FollowingList[key].Stream) {
                localJSON('Status', ['online', local.Status.online - 1]);
                BadgeOnlineCount(local.Status.online);
                NowOnline = NowOnline.filter(function(e){
                    (e !== local.FollowingList[key].Name) ? deb('Delete '+e) : deb('Still '+e);
                    return e !== local.FollowingList[key].Name;
                });
                FollowingList('c', key, '', false)                      
            }
            if (local.Status.checked == localJSON('Following') || key === localJSON('Following')) {
                if (ch) {
                    localJSON('Status',['online', 0]);
                    for (var i=0; i<local.FollowingList.lenght; i++)
                        if (local.FollowingList[i].Stream) { local.Status.online++; };
                    localJSON('Status',['online', local.Status.online]);
                }
                BadgeOnlineCount(local.Status.online);
                sessionStorage.First_Notify = 1;
                log('Every channel checked ('+local.Status.checked+')');
                localJSON('Status', ['update', 0]);

                if (local.Config.Notifications.update) {
                    switch (local.Status.online) {
                        case 0: notifyUser('Update finished!', 'No one online right now :(', 'Update'); break;
                        case 1: notifyUser('Update finished!', 'Now online one channel', 'Update'); break;
                        default: notifyUser('Update finished!', 'Now online '+local.Status.online+' channels', 'Update');
                    }
                }
            }
        });
    }

    if (!localStorage.Following) localStorage.Following = 0;
    localJSON('Status', ['update', 1]);

    if (['','Guest',undefined].indexOf(local.Config.User_Name) !== -1) {
        if (localStorage.FirstLaunch !== 'true')
            localJSON('Status', ['update', 6]);
        log('Change user name!')
    } else {
        log("Behold! Update is comin'");
        notifyUser('Behold! Update!', 'Starting update...', 'Update');
        localJSON('Status', ['update', 2]);

        var uri = 'https://api.twitch.tv/kraken/users/'+local.Config.User_Name+'/follows/channels?limit=500&offset=0';
        if (local.Config.token !== "") uri += '&oauth_token='+local.Config.token;
        $.getJSON(uri)
        .fail(function(j) {
            err({message:"Can't get following list",stack:j});
            localJSON('Status', ['update', 5]);
            notifyUser("Update follows list", "Error, can't update", "Update");
        })
        .done(function(j) {
            var chg;
            if (Math.floor(localStorage.Following) !== j._total) {
                log('Update list of following channels');
                localStorage.Following = j._total;
                chg = true;
                for (var i=0; i<localJSON('Following'); i++)
                    j.follows[i] ? FollowingList('add', i, J.follows[i].channel.name) : log(j);
            } else {
                chg = false;
            }
            localJSON('Status',['checked', 0]);
            localJSON('Status',['update', 4]);
            log('Checking Status of channels...');
            for (var i=0; i<localJSON('Following'); i++) {
                var k = 'https://api.twitch.tv/kraken/streams/'+local.FollowingList[i].Name;
                if (local.Config.token !== "") k += '?oauth_token='+local.Config.token;
                checkStatus(k, i, chg);
            }
        });
    }
}

(function(){
    CheckFollowingList();
    CheckTwitch = setInterval(function(){CheckFollowingList()}, 60000 * local.Config.Interval_of_Checking);
    localJSON('Status',['StopInterval',false]);
    setInterval(function(){
        if (local.Status.StopInterval) {
            clearInterval(CheckTwitch);
            CheckFollowingList();
            CheckTwitch = setInterval(function(){CheckFollowingList()}, 60000 * local.Config.Interval_of_Checking);
            localJSON('Status',['StopInterval', false])
        }
    },500);
})();