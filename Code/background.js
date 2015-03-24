{{LICENSE_HEADER}}
if (localStorage.FirstLaunch === 'true') {
  localStorage.Following = 0;
  local.set('Status.update', 7);
  BadgeOnlineCount(' Hi ');
} else {
  BadgeOnlineCount(0);
  local.set('Status.online', 0);
  if (local.Games.length > 50) {
    localStorage.Games = '{}';
    local.init('Games');
  }
  if ($.inArray("object Object", localStorage.FollowingList) != -1) {
    localStorage.FollowingList = "{}";
    localStorage.Following = 0;
    send('refresh');
  }
  if (typeof local.FollowingList.length === 'undefined' && local.Following !== 0)
    local.set('Following', 0);
  $.each(local.FollowingList, function(i,v) {
    if (local.FollowingList.length === 0)
      return false;

    var j = {Stream: false}, k = local.FollowingList[i];
    if (typeof k.Notify === 'undefined')
      j.Notify = true;
    if (typeof k.d_name === 'undefined')
      j.d_name = k.Name;

    local.following.set(i, j);
  });
}

try {
  ga('set', 'appVersion', local.App_Version.Ver);
  ga('send', 'event', 'version', local.App_Version.Ver, 'ver');
}catch(e){};

var NowOnline = [], reCount = false;

var basicCheck = function() {
  if (!localStorage.Following)
    localStorage.Following = 0;

  if (['','Guest',undefined].indexOf(local.Config.User_Name) !== -1) {
    if (localStorage.FollowingList !== "{}") {
      localStorage.FollowingList = "{}";
      send('refresh');
    }
    if (localStorage.FirstLaunch !== 'true') {
      local.set('Status.update', 6);
      log('Change user name!');
    }
    return false;
  }
  return true;
};
var CheckStatus = function() {
  function check(key,j) {
    $.getJSON(j)
    .fail(function(d) {
      err({message:'checkStatus() ended with error', stack:d});
    })
    .done(function(d){
      local.set('Status.checked', '+1');
      var FoLi = local.FollowingList[key];
      if (d.stream) {
        // Channel is online
        var Game = d.stream.channel.game,
          Status = d.stream.channel.status,
          Name   = d.stream.channel.name,
          d_name = d.stream.channel.display_name,
          Time   = d.stream.channel.updated_at;

        if (Status == null && FoLi.Stream.Title !== "")
          Status = FoLi.Stream.Title
        else if (Status == null && !FoLi.Stream)
          Status = 'Untitled stream';

        if (Game == null && FoLi.Stream.Game !== "")
          Game = FoLi.Stream.Game
        else if (Game == null && !FoLi.Stream)
          Game = 'Not playing';

        if (!FoLi.Stream && NowOnline.indexOf(Name) === -1) {
          if (FoLi.Notify)
            Notify({
              name:Name,
              title:Name+' just went live!',
              msg:Status,
              type:'online',
              button:true
            });
          local.set('Status.online', '+1');
          NowOnline.push(Name);
          BadgeOnlineCount(local.Status.online);
        }

        if (FoLi.Stream.Title !== Status && FoLi.Stream.Title !== undefined)
          Notify({name:Name, title:d_name+' changed stream title on', msg:Status, type:'follow'});

        if (new Date(FoLi.Stream.Time) - new Date(Time))
          Time = FoLi.Stream.Time;

        local.game(Game);

        var s = {
          Name    : Name,
          d_name  : d_name,
          Stream  : {
            Title  : Status,
            Game   : Game,
            Viewers: d.stream.viewers,
            Time   : Time
          }
        };
        local.following.set(key, s);
        send({type:'following', data:s});
      } else if (FoLi.Stream) {
        // Channel went offline
        if (FoLi.Notify)
          Notify({
            title: FoLi.Name+" went offline",
            msg: "Been online for "+time(FoLi.Stream.Time),
            type: "offline"
          });
        local.set('Status.online', '-1');
        BadgeOnlineCount(local.Status.online);
        NowOnline = NowOnline.filter(function(e){ return e !== FoLi.Name; });
        local.following.set(key, {Stream: false});
        send({type:'following', data: {Name:FoLi.Name, Stream:false}});
      }

      if (local.Status.checked==local.Following || key===local.Following) {
        // double check...
        var onl = 0;
        $.each(local.FollowingList, function(i,v) {
          if (v.Stream)
            onl++;
        });
        local.set('Status.online', onl);
        reCount = false;

        if (local.Status.online === 0 && NowOnline.length !== 0)
          local.set('Status.online', NowOnline.length);
        BadgeOnlineCount(local.Status.online);
        log('Every channel checked ('+local.Status.checked+')');
        local.set('Status.update', 0);
        timeOut.check();
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
  local.set('Status.update', 1);
  log("Checking status of streamers");
  Notify({title:'Behold! Update!', msg:'Checking status of streamers...', type:'update'});
  local.set('Status.update', 4);
  local.set('Status.checked', 0);

  var token = local.Config.token;
  $.each(local.FollowingList, function(i,v) {
    var k = 'https://api.twitch.tv/kraken/streams/'+v.Name;
    if (token !== "")
      k += '?oauth_token='+token;
    check(i, k);
  });

  if (local.Status.update !== 5)
    local.set('Status.update', 0);
};
var CheckFollowingList = function() {
  if (!basicCheck())
    return;
  local.set('Status.update', 1);
  log("Checking following list");
  Notify({title:'Status', msg:'Checking following list...', type:'update'});
  local.set('Status.update', 2);

  var uri = 'https://api.twitch.tv/kraken/';

  if (local.Config.token) {
    // Check token
    $.getJSON(uri+'?oauth_token='+local.Config.token)
    .done(function(e) {
      if (!e.token.valid) {
        // token is invalid, inform user
        window.toShow = 777;
      }
    });

    uri+= 'streams/followed?limit=100&offset=0&oauth_token='+local.Config.token;
  } else
    uri+= 'users/'+local.Config.User_Name+'/follows/channels?limit=100&offset=0';

  $.getJSON(uri)
  .fail(function(j) {
    err({message:"Can't get following list",stack:j});
    local.set('Status.update', 5);
    Notify({title:"Error happen", msg:"Cannot update following list", type:"update"});
  })
  .done(function(j) {
    if (typeof local.FollowingList.length === 'undefined' && local.Following !== 0)
      local.set('Following', 0);
    else if (local.Following === j._total)
      return;

      log('Updating list of following channels');

      if (local.Following == 0) {
        $.each(j.follows, function(i,v) {
          local.following.set(i, {
            Name: v.channel.name,
            Stream: false,
            Notify: true,
            d_name: v.channel.display_name
          });
        });
        local.set('Following', j._total);
        reCount = true;
        CheckStatus();
      } else {
        local.set('Following', j._total);
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
        } catch(e) { err(e); }
        local.set('Status.online', 0);
        reCount = true;
        CheckStatus();
      }
  });
  if (local.Status.update !== 5)
    local.set('Status.update', 0);
};

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
