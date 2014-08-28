{{LICENSE_HEADER}}
if (localStorage.FirstLaunch === 'true') {
    localStorage.Following = 0;
    localJSON('Status.update', 7);
    BadgeOnlineCount(' Hi ');
} else {
    BadgeOnlineCount(0);
    localJSON('Status.online', 0);
    for (var i=0; i<local.Following; i++)
        FollowingList(i, null, false);
    if (local.Config.Format==='Mini')
        localJSON('Config.Format', 'Light');
}

ga('set', 'appVersion', local.App_Version.Ver.replace('v.',''));

var NowOnline = [];

function CheckFollowingList() {
    function checkStatus(key,j,ch) {
        $.getJSON(j)
        .fail(function(d) { 
            err({message:'checkStatus() ended with error',stack:d});
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
                if (Status === null)
                    Status = 'Untitled stream';
                if (Game === null)
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
                FollowingList(key, null, false)                      
            }
            if (local.Status.checked==local.Following || key===local.Following) {
                if (ch) {
                    localJSON('Status.online', 0);
                    for (var i=0; i<local.Following; i++)
                        if (local.FollowingList[i].Stream) { localJSON('Status.online', '+1'); };
                }
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

    if (!localStorage.Following)
        localStorage.Following = 0;
    localJSON('Status.update', 1);

    if (['','Guest',undefined].indexOf(local.Config.User_Name) !== -1) {
        if (localStorage.FirstLaunch !== 'true') {
            localJSON('Status.update', 6);
            log('Change user name!');
        }
    } else {
        log("Behold! Update is comin'");
        Notify({title:'Behold! Update!', msg:'Starting update...', type:'update'});
        localJSON('Status.update', 2);

        var uri = 'https://api.twitch.tv/kraken/users/'+local.Config.User_Name+'/follows/channels?limit=500&offset=0';
        if (local.Config.token !== "")
            uri += '&oauth_token='+local.Config.token;

        $.getJSON(uri)
        .fail(function(j) {
            err({message:"Can't get following list",stack:j});
            localJSON('Status.update', 5);
            Notify({title:"Update follows list", msg:"Error, can't update", type:"update"});
        })
        .done(function(j) {
            var chg;
            if (local.Following !== j._total) {
                log('Update list of following channels');
                localJSON('Following', j._total);
                chg = true;
                for (var i=0; i<j._total; i++)
                    FollowingList(i, j.follows[i].channel.name, false);
            } else {
                chg = false; }
            localJSON('Status.checked', 0);
            localJSON('Status.update', 4);
            log('Checking Status of channels...');
            for (var i=0; i<local.Following; i++) {
                var k = 'https://api.twitch.tv/kraken/streams/'+local.FollowingList[i].Name;
                if (local.Config.token !== "")
                    k += '?oauth_token='+local.Config.token;
                checkStatus(i, k, chg);
            }
        });
    }
}

(function(){
    CheckFollowingList();
    CheckTwitch = setInterval(function(){CheckFollowingList()}, 60000*local.Config.Interval_of_Checking);
    localJSON('Status.StopInterval', false);
    setInterval(function(){
        if (local.Status.StopInterval) {
            clearInterval(CheckTwitch);
            CheckFollowingList();
            CheckTwitch = setInterval(function(){CheckFollowingList()}, 60000*local.Config.Interval_of_Checking);
            localJSON('Status.StopInterval', false)
        }
    },500);
})();