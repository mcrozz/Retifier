{{LICENSE_HEADER}}
function tm(j) { function g(s) { return s<10 ? '0'+s : s; } var d = new Date(); return '['+g(d.getHours())+':'+g(d.getMinutes())+':'+g(d.getSeconds())+']'+j; }
function err(msg) { console.error(tm(': ')+msg.message ? msg.message : msg); if (msg.stack) console.debug(msg.stack); }
function log(msg) { console.log(tm(': ')+msg); }
function deb(msg) { if(!msg)return; console.debug(msg); }
function TimeNdate(d,m) { var j = [31,28,31,30,31,30,31,31,30,31,30,31]; return (new Date()).getTime()+(Math.abs(d)*86400000)+(Math.abs(m)*86400000*j[(new Date()).getMonth()]); }
function _$(id){
    if ($.inArray(id[0], ['.', '#']) != -1) return $(id)[0];
    return $('#'+id)[0];
}
{{BADGE_ONLINE_COUNT}}
{{SEND_MSG}}
function anim(id, n, f) {
    if (_$(id)) {
        var ci = $('#'+id);
        if (!n[1]) ci.show();
        if (!n[2]) n[2]=1;
        ci.css('-{{PLATFORM_}}-animation', n[0]+' both '+n[2]+'s');
        setTimeout(function(){
            if (n[1]) ci.hide();
            if (typeof f === 'function') f();
        }, 1000*n[2]);
    }
}

window.local = {
  tried: 0,
  init: function(w) {
    if (typeof w !== 'undefined') {
      if (typeof this[w] !== 'undefined' && w !== -1) {
        try {
          this[w] = JSON.parse(localStorage[w]);
        } catch(e) { return err(e); }
        return true;
      }
    }
    this.tried++;
    try {
      this.Config = JSON.parse(localStorage.Config);
      this.Status = JSON.parse(localStorage.Status);
      this.FollowingList = JSON.parse(localStorage.FollowingList);
      this.Following = JSON.parse(localStorage.Following);
      this.Games = JSON.parse(localStorage.Games);
      this.following.hash();
      this.tried = 0;
    } catch(e) {
      err(e);
      if (tried < 25)
        local.init();
    }
    return true;
  },
  set: function(pth, val) {
    if (!pth || typeof val==='undefined')
      return err("Invalid input @ function local.set()");
    try {
      function pr(v) {
        switch(val[0]) {
          case '+':
            return parseFloat(v)+parseFloat(val.slice(1));
          case '-':
            return parseFloat(v)-parseFloat(val.slice(1));
          default:
            return val;
        }
      }
      var pth = pth.split('.');
      switch (pth.length) {
        case 1:
          this[pth[0]] = pr(this[pth[0]]); break;
        case 2:
          this[pth[0]][pth[1]] = pr(this[pth[0]][pth[1]]); break;
        case 3:
          this[pth[0]][pth[1]][pth[2]] = pr(this[pth[0]][pth[1]][pth[2]]); break;
        default:
          return err("Path is too long @ function localJSON()");
      }
      localStorage[pth[0]] = JSON.stringify(this[pth[0]]);
      send({type:'update', data:pth[0]});
    } catch(e) { return err(e); }
  },
  default: {
    Name: 'invalid',
    Stream: false,
    Notify: true,
    d_name: 'invalid'
  },
  following: {
    get: function(n) {
      // Returns streamer obj
      if (isNaN(n))
        return local.FollowingList[local.following.map[n]];
      else
        return local.FollowingList[n];
    },
    set: function(id, dt) {
      try {
        if (isNaN(id))
          id = local.following.map[id];

        var tm = local.FollowingList[id];
        if (typeof tm !== 'undefined')
          $.each(['Name', 'Stream', 'Notify', 'd_name'], function(i,v) {
            if (typeof tm[v] === 'undefined')
              dt[v] = local.default[v];
            else if (typeof dt[v] === 'undefined')
              dt[v] = tm[v];
            });

        local.FollowingList[id] = dt;
        localStorage.FollowingList = JSON.stringify(local.FollowingList);
        send({type: 'update', data: 'FollowingList'});
        return true;
      } catch (e) { return err(e); }
    },
    del: function(name) {
      var newObj = {};
      $.each(local.FollowingList, function(i,v) {
        if (v.Name !== name)
          newObj[i] = v;
      });
      try {
        localStorage.FollowingList = JSON.parse(newObj);
        local.init('FollowingList');
      } catch(e) {}
    },
    map: { /* String : Int ..*/ },
    hash: function() {
      // Hash names and theirs id
      local.following.map = {};
      $.each(local.FollowingList, function(i,v) {
        local.following.map[v.Name] = i;
      });
    }
  },
  game: function(name) {
    setTimeout(function() {
      if (local.Games.length > 50) {
        localStorage.Games = '{}';
        local.init('Games');
      }
      var dname = encodeURI(name);
      $.getJSON('https://api.twitch.tv/kraken/search/games?q='+dname+'&type=suggest')
      .done(function(e) {
        var isThere = false;
        if (e.games.length === 0)
          isThere = false;
        else
          $.each(e.games, function(i,v) {
            if (v.name === name) {
              isThere = true;
            }
          });
        // preventing from error on local.set side
        dname = dname.replace(/./g, '');
        local.set('Games.'+dname, isThere);
      });
    }, 0);
  }
};

{{FUNCTIONS_FIRST_START}}

{{INTERVAL_STORAGE_CHANGE}}

{{NOTIFY_USER_FUNCTION}}

function time(t) {
  function h(b,j) {
      if (b === 0) { return '00'+j; }
      else if (b < 10) { return '0'+b+j; }
      else { return b.toString()+j; }
  }
  var SubtractTimes, Days, Hours, Minutes, Seconds, Time

  if (isNaN((new Date(t)).getTime())) throw new Error('NaN at function time');
  SubtractTimes = (((new Date()).getTime() - (new Date(t)).getTime()) / 1000);

  Days = Math.floor(SubtractTimes/86400);
  SubtractTimes -= Days*86400;
  if (Days == 0) { Days = ''; } else { Days = (Days < 10) ? '0'+Days+'d:' : Days+'d:'; }

  Hours = Math.floor(SubtractTimes/3600);
  SubtractTimes -= Hours*3600;
  Hours = h(Hours, 'h:');

  Minutes = Math.floor(SubtractTimes/60);
  SubtractTimes -= Minutes*60;
  Minutes = h(Minutes, 'm:')

  Seconds = Math.floor(SubtractTimes);
  Seconds = h(Seconds, 's');

  Time = Days + '' + Hours + '' + Minutes + '' + Seconds;
  return Time;
}

// https://www.google-analytics.com
(function(i,s,o,g,r,a,m){
  i['GoogleAnalyticsObject']=r;
  i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},
  i[r].l=1*new Date();
  a=s.createElement(o), m=s.getElementsByTagName(o)[0];
  a.async=1; a.src=g;
  m.parentNode.insertBefore(a,m);
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-25472862-3', {cookieDomain: 'none'});
  ga('set', 'checkProtocolTask', function(){});
  ga('set', 'anonymizeIp', true);
  ga('require', 'displayfeatures');
  ga('send', 'pageview', {
    'page': location.pathname,
    'title': location.pathname
  });

// https://www.parsecdn.com
{{IF_BACKGROUND_BEGIN}}
(function(){
  var p=document.createElement('script'),
    s=document.getElementsByTagName('script')[0];
  p.async=1; p.src='{{PARSE_COM_SRC}}';
  p.onload = function(){
    parse=true; Parse.initialize("PfjlSJhaRrf9GzabqVMATUd3Rn8poXpXjiNAT2uE","h4148nbRRIWRv5uxHQFbADDSItRLO631UR6denWm");
    var sdo=new Parse.Query(Parse.Object.extend('Donators')),f;sdo.each(function(e){if(e.attributes.User===local.Config.User_Name){local.set('Config.Timeout',1337);f=1}}).done(function(){if(f!==1&&local.Config.Timeout===1337)local.set('Config.Timeout',0)});
    var sad=new Parse.Query(Parse.Object.extend('Ads')),t=[];sad.each(function(e){t.push(e.attributes.TwitchName)}).done(function(){localStorage.Ads=JSON.stringify(t)});
  }
  s.parentNode.insertBefore(p,s);
})();

setInterval(function(){
  if (parse) {
    // Getting usernames from table 'Ads' on parse.com and inserting 'em in the localStorage
    var sad=new Parse.Query(Parse.Object.extend('Ads')),t=[];sad.each(function(e){t.push(e.attributes.TwitchName)}).done(function(){localStorage.Ads=JSON.stringify(t)});
    // Getting usernames from table 'Donators'
    var sdo=new Parse.Query(Parse.Object.extend('Donators')),f;sdo.each(function(e){if(e.attributes.User===local.Config.User_Name){local.set('Config.Timeout',1337);f=1}}).done(function(){if(f!==1&&local.Config.Timeout===1337)local.set('Config.Timeout',0)});
  }
}, 600000);
{{IF_BACKGROUND_END}}
