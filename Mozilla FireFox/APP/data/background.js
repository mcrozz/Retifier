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
localJSON('Status', 'c', ['online', 0]);
for (var i = 0; i < localJSON('Following'); i++) { FollowingList('c', i, '', false) }

function CheckFollowingList() {
    function checkStatus(url,key) {
        $.ajax({
            url:url, dataType:'JSONP',
            error:function (e){ err({message:'checkStatus() ended with error',stack:e}); notifyUser("Update follows list", "Error, can't update", "Update"); localJSON('Status', 'c', ['update', 5]); },
            complete:function (e){
                localJSON('Status', 'c', ['checked', local.Status.checked + 1]);

                if (e.responseJSON.stream) {
                    if (!local.FollowingList[key].Stream.Title) localJSON('Status', 'c', ['online', local.Status.online + 1]);

                    var Game = e.responseJSON.stream.game,
                        Status = e.responseJSON.stream.channel.status,
                        Name = local.FollowingList[key].Name,
                        Time = e.responseJSON.stream.channel.updated_at;

                    if (Status == null) Status = 'Untitled stream';
                    if (Game == null) Game = 'Not playing';
                    if (local.FollowingList[key].Stream.Title == null) notifyUser(Name+' just went live!',Status,'Online',Name);
                    if (local.FollowingList[key].Stream.Title != Status && local.FollowingList[key].Stream.Title != undefined)notifyUser(Name+' changed stream title on',Status,'Changed',Name);
                    if (Math.abs(new Date() - new Date(Time)) > Math.abs(new Date() - new Date(local.FollowingList[key].Stream.Time)) || local.FollowingList[key].Stream.Time == null) { Time2 = Time }
                    else { Time2 = local.FollowingList[key].Stream.Time }

                    FollowingList('c',key,'',[Status, Game, e.responseJSON.stream.viewers, Time2, "NotYet"])
                } else if (local.FollowingList[key].Stream) {
                    localJSON('Status', 'c', ['online', local.Status.online - 1]);
                    BadgeOnlineCount(local.Status.online);
                    FollowingList('c', key, '', false)                      
                }
                if (local.Status.checked == localJSON('Following') || key == localJSON('Following')) {
                    BadgeOnlineCount(local.Status.online);
                    sessionStorage.First_Notify = 1;
                    log('Every channel checked ('+local.Status.checked+')');
                    localJSON('Status', 'c', ['update', 0]);

                    if (local.Status.online > 1) {
                        notifyUser('Update finished!', 'Now online '+local.Status.online+' channels', 'Update')
                    } else if (local.Status.online == 1) {
                        notifyUser('Update finished!', 'Now online one channel', 'Update')
                    } else if (local.Status.online == 0) {
                        notifyUser('Update finished!', 'No one online right now :(', 'Update')
                    }
                }
            }
        });
    }

    if (!localStorage.Following) localStorage.Following = 0;
    localJSON('Status', 'c', ['update', 1]);
    if (local.Config.User_Name === 'Guest' || typeof local.Config.User_Name === 'undefined') {
        localJSON('Status', 'c', ['update', 6]); log('Change user name!')
    } else {
        log("Behold! Update is comin'");
        notifyUser('Behold! Update!', 'Starting update...', 'Update');
        localJSON('Status', 'c', ['update', 2]);
        var h = 'https://api.twitch.tv/kraken/users/'+local.Config.User_Name+'/follows/channels?limit=116&offset=0';
        if (local.Config.token !== "") h += '&oauth_token='+local.Config.token;
        $.ajax({
            url:h, dataType:"JSONP",
            error:function(e){ err({message:"Can't get following list",stack:e}); notifyUser("Update follows list", "Error, can't update", "Update"); localJSON('Status', 'c', ['update', 5]); },
            complete:function(e){
                var g = e.responseJSON;
                if (Math.floor(localStorage.Following) !== g._total) {
                    log('Update list of following channels');
                    localStorage.Following = g._total;
                    localJSON('Status', 'c', ['online', 0]);
                    for (var i=0; i<Math.floor(localStorage.Following); i++) 
                        g.follows[i] ? FollowingList('add', i, g.follows[i].channel.name) : log(g);
                }
                localJSON('Status','c',['checked', 0]);
                localJSON('Status','c',['update', 4]);
                log('Checking Status of channels...');
                for (var i=0; i<Math.floor(localStorage.Following); i++) {
                    var k = 'https://api.twitch.tv/kraken/streams/'+local.FollowingList[i].Name;
                    if (local.Config.token !== "") k += '?oauth_token='+local.Config.token;
                    checkStatus(k, i);
                }
            }
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
setInterval(function(){
    // Get donation list
    $.ajax({
        url:"https://www.mcrozz.net/app/Twitch.tv_Notifier/DonationsList.php",dataType:"JSONP",
        complete: function(data) { try {var rsp = JSON.parse(data.responseText)} catch (e) {log(e.stack)} if (rsp.indexOf(hex_md5(local.Config.User_Name)) != -1 ) localJSON('Config','c',['Timeout', 1337]); },
        error: function(e) { err({message:'Failed to get donations list...',stack:e}); }
    });
},3600000);