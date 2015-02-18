{{LICENSE_HEADER}}
if (localStorage.FirstLaunch === 'true') {
    localStorage.Following = 0;
    localJSON('Status.update', 7);
    BadgeOnlineCount(' Hi ');
} else {
    BadgeOnlineCount(0);
    localJSON('Status.online', 0);
    if ($.inArray("object Object", localStorage.FollowingList) != -1) {
        localStorage.FollowingList = "[]";
        local.FollowingList = [];
        localStorage.Following = 0;
        local.Following = 0;
    }
    $.each(local.FollowingList, function(i,v) {
        FollowingList(i, null, false);
    });
    if (local.Config.Format==='Mini')
        localJSON('Config.Format', 'Light');
}

try { ga('set', 'appVersion', local.App_Version.Ver) }catch(e){};

var NowOnline = [];

var basicCheck = function() {
    if (!localStorage.Following)
        localStorage.Following = 0;

    if (['','Guest',undefined].indexOf(local.Config.User_Name) !== -1) {
        if (localStorage.FirstLaunch !== 'true') {
            localJSON('Status.update', 6);
            log('Change user name!');
            return false;
        }
    }
    return true;
}
var CheckStatus = function() {
    function check(key,j) {
        $.getJSON(j)
        .fail(function(d) { 
            err({message:'checkStatus() ended with error', stack:d});
        })
        .done(function(d){
            localJSON('Status.checked', '+1');
            if (d.stream) {
                var FoLi   = local.FollowingList[key],
                    Game   = d.stream.channel.game,
                    Status = d.stream.channel.status,
                    Name   = d.stream.channel.name,
                    d_name = d.stream.channel.display_name,
                    Time   = d.stream.channel.updated_at.replace('T', ' ').replace('Z', ' ')+' GMT+0000';
                
                if (Status == null && FoLi.Stream.Title !== "")
                    Status = FoLi.Stream.Title
                else
                    Status = 'Untitled stream';

                if (Game == null && FoLi.Stream.Game !== "")
                    Game = FoLi.Stream.Game
                else
                    Game = 'Not playing';
                
                if (!FoLi.Stream && NowOnline.indexOf(Name) === -1) {
                    Notify({name:Name, title:Name+' just went live!', msg:Status, type:'online', button:true});
                    localJSON('Status.online', '+1');
                    NowOnline.push(Name);
                    BadgeOnlineCount(local.Status.online);
                }
                
                if (FoLi.Stream.Title !== Status && FoLi.Stream.Title !== undefined)
                    Notify({name:Name, title:d_name+' changed stream title on', msg:Status, type:'follow'});
                
                if (new Date(FoLi.Stream.Time) - new Date(Time))
                    Time = FoLi.Stream.Time;

                FollowingList(key, Name, {
                    d_name  : d_name,
                    Title   : Status,
                    Game    : Game,
                    Viewers : d.stream.viewers,
                    Time    : Time });
            } else if (local.FollowingList[key].Stream) {
                localJSON('Status.online', '-1');
                BadgeOnlineCount(local.Status.online);
                NowOnline = NowOnline.filter(function(e){ return e !== local.FollowingList[key].Name; });
                FollowingList(key, null, false);
            }
            if (local.Status.checked==local.Following || key===local.Following) {
                if (local.Status.online === 0 && NowOnline.length !== 0)
                    localJSON('Status.online', NowOnline.length);
                BadgeOnlineCount(local.Status.online);
                log('Every channel checked ('+local.Status.checked+')');
                localJSON('Status.update', 0);
                if (local.Config.Notifications.update) {
                    switch (local.Status.online) {
                        case 0:
                            Notify({title:'Update finished!', msg:'No one online right now :(', type:'update'}); break;
                        case 1:
                            Notify({title:'Update finished!', msg:'Now online one channel', type:'update'}); break;
                        default:
                            Notify({title:'Update finished!', msg:'Now online '+local.Status.online+' channels', type:'update'}); break;
                    }
                }
            }
        });
    }

    if (!basicCheck())
        return;
    localJSON('Status.update', 1);
    log("Checking status of streamers");
    Notify({title:'Behold! Update!', msg:'Checking status of streamers...', type:'update'});
    localJSON('Status.update', 4);
    localJSON('Status.checked', 0);

    var token = local.Config.token;
    $.each(local.FollowingList, function(i,v) {
        var k = 'https://api.twitch.tv/kraken/streams/'+v.Name;
        if (token !== "")
            k += '?oauth_token='+token;
        check(i, k);
    });
}
var CheckFollowingList = function() {
    if (!basicCheck())
        return;
    localJSON('Status.update', 1);
    log("Checking following list");
    Notify({title:'Status', msg:'Checking following list...', type:'update'});
    localJSON('Status.update', 2);

    var uri = 'https://api.twitch.tv/kraken/users/'+local.Config.User_Name+'/follows/channels?limit=500&offset=0';
    if (local.Config.token !== "")
        uri += '&oauth_token='+local.Config.token;

    $.getJSON(uri)
    .fail(function(j) {
        err({message:"Can't get following list",stack:j});
        localJSON('Status.update', 5);
        Notify({title:"Error happen", msg:"Cannot update following list", type:"update"});
    })
    .done(function(j) {
        if (local.Following === j._total)
            return;

        log('Updating list of following channels');
        
        if (local.Following == 0) {
            $.each(j.follows, function(i,v) {
                FollowingList(i, v.channel.name, false);
            });
            localJSON('Following', j._total);
            CheckStatus();
        } else {
            localJSON('Following', j._total);
            var NewJson = [];
            $.each(local.FollowingList, function(i,v) {
                var del = true;
                $.each(j.follows, function(j,k) {
                    if (k.channel.name === v.Name)
                        del = false;
                });
                if (!del)
                    NewJson[i] = v;
            });
            try {
                localStorage.FollowingList = JSON.stringify(NewJson);
            } catch(e) {
                err(e);
            }
            localJSON('Status.online', 0);
            CheckStatus();
        }
    });
}

var TwitchFollowing = -1, TwitchStatus = -1;
var initTwitch = function() {
    function setIntervals() {
        TwitchFollowing = setInterval(function(){CheckFollowingList()}, 120000);
        CheckFollowingList();

        TwitchStatus = setInterval(function(){CheckStatus()}, 60000*local.Config.Interval_of_Checking);
        CheckStatus();
    }
    if (TwitchFollowing == -1 && TwitchStatus == -1)
        setIntervals()
    else {
        clearInterval(TwitchFollowing);
        clearInterval(TwitchStatus);
        setIntervals();
    }
};
initTwitch();

{{MSG_PARSER_BAC_FUNC}}