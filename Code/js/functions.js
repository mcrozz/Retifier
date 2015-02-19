{{LICENSE_HEADER}}
{{FUNCTIONS_FIRST_START}}
if (localStorage.Ads === '')
    localStorage.Ads = '[]';
function tm(j) { function g(s) { return s<10 ? '0'+s : s; } var d = new Date(); return '['+g(d.getHours())+':'+g(d.getMinutes())+':'+g(d.getSeconds())+']'+j; }
function err(msg) { console.error(tm(': ')+msg.message ? msg.message : msg); if (msg.stack) console.debug(msg.stack); }
function log(msg) { console.log(tm(': ')+msg); }
function deb(msg) { console.debug(msg); }
function TimeNdate(d,m) { var j = [31,28,31,30,31,30,31,31,30,31,30,31]; return (new Date()).getTime()+(Math.abs(d)*86400000)+(Math.abs(m)*86400000*j[(new Date()).getMonth()]); }
function doc(id){if (id[0] === '.') return $(id)[0]; return document.getElementById(id);}
{{BADGE_ONLINE_COUNT}}
{{SEND_MSG}}
function Animation(id, n, f) {
    if (doc(id)) {
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

window.local = {};

function loc() {
    local.Config = JSON.parse(localStorage.Config);
    local.Status = JSON.parse(localStorage.Status);
    local.FollowingList = JSON.parse(localStorage.FollowingList);
    local.App_Version = JSON.parse(localStorage.App_Version);
    local.Following = JSON.parse(localStorage.Following);
}

try { loc() } catch(e) { err(e) }

{{INTERVAL_STORAGE_CHANGE}}

function localJSON(pth,val) {
    if (!pth || typeof val==='undefined')
        return err("Invalid input @ function localJSON()");
    try {
        {{UPDATE_LOCAL_VAR_FUNC}}
        function pr(v) {
            switch(val[0]) {
                case '+':
                    v = parseFloat(v)+parseFloat(val.slice(1)); break;
                case '-':
                    v = parseFloat(v)-parseFloat(val.slice(1)); break;
                default:
                    v = val; break;
            }
            return v;
        }
        var pth = pth.split('.');
        switch (pth.length) {
            case 1:
                local[pth[0]] = pr(local[pth[0]]); break;
            case 2:
                local[pth[0]][pth[1]] = pr(local[pth[0]][pth[1]]); break;
            case 3:
                local[pth[0]][pth[1]][pth[2]] = pr(local[pth[0]][pth[1]][pth[2]]); break;
            default:
                return err("Path is too long @ function localJSON()");
        }
        localStorage[pth[0]] = JSON.stringify(local[pth[0]]);
        {{UPDATE_LOCAL_VAR_CALL}}
    } catch(e) { return err(e); }
}

if (!localStorage.FollowingList) localStorage.FollowingList='{}';
function FollowingList(id, nm, st) {
    try {
        if (nm === null)
            nm = local.FollowingList[id].Name;
        local.FollowingList[id] = {
            Name  : nm,
            Stream: st
        }
        return localStorage.FollowingList = JSON.stringify(local.FollowingList);
    } catch (e) { return err(e); }
}

{{NOTIFY_USER_FUNCTION}}

function time(t) {
    function h(b,j) {
        if (b === 0) { return '00'+j; }
        else if (b < 10) { return '0'+b+j; }
        else { return b.toString()+j; }
    }
    var SubtractTimes, Days, Hours, Minutes, Seconds, Time
    
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
    ga('create', 'UA-25472862-3', {'cookieDomain': 'none'});
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
    p.type='text/javascript';p.async=true;
    p.src='{{PARSE_COM_SRC}}';
    p.onload = function(){
        parse=true; Parse.initialize("PfjlSJhaRrf9GzabqVMATUd3Rn8poXpXjiNAT2uE","h4148nbRRIWRv5uxHQFbADDSItRLO631UR6denWm");
        var sdo=new Parse.Query(Parse.Object.extend('Donators')),f;sdo.each(function(e){if(e.attributes.User===local.Config.User_Name){localJSON('Config.Timeout',1337);f=1}}).done(function(){if(f!==1&&local.Config.Timeout===1337)localJSON('Config.Timeout',0)});
        var sad=new Parse.Query(Parse.Object.extend('Ads')),t=[];sad.each(function(e){t.push(e.attributes.TwitchName)}).done(function(){localStorage.Ads=JSON.stringify(t)});
    }
    s.parentNode.insertBefore(p,s);
})();

setInterval(function(){
    if (parse) {
        // Getting usernames from 'Ads' table on parse.com and pasting them in localStorage
        var sad=new Parse.Query(Parse.Object.extend('Ads')),t=[];sad.each(function(e){t.push(e.attributes.TwitchName)}).done(function(){localStorage.Ads=JSON.stringify(t)});
        // Getting usernames from 'Donators' table and disabling 'Please, support...'
        var sdo=new Parse.Query(Parse.Object.extend('Donators')),f;sdo.each(function(e){if(e.attributes.User===local.Config.User_Name){localJSON('Config.Timeout',1337);f=1}}).done(function(){if(f!==1&&local.Config.Timeout===1337)localJSON('Config.Timeout',0)});
    }
}, 600000);
{{IF_BACKGROUND_END}}