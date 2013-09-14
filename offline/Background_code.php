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


    https://api.twitch.tv/kraken/users/ NAME OF PROFILE /follows/channels?limit=116&offset=0
    Limit is 116, you have more than that? email me hostingmcrozz@hotmail.com about it :D
    Offset must be 0 (ZERO)

    Object.follows[number, from 0 to follows count].channel.name


    StatusUpdate

    0 - Not updating, finished
    1 - Timer ended, start update
    2 - Update list of followed channels
    3 - List of followed channels updated
    4 - Checking online channel or not
    5 - Error
    6 - Name doesn't set up!
    7 - First start
*/
if (localStorage['Following'] == undefined) localStorage['Following']=0;
if (localStorage['Following'] == 'undefined') localStorage['Following']=0;

try {
    if (JSON.parse(localStorage['Following']).Following) {
        Following = JSON.parse(localStorage['Following']).Following;
        localStorage['Following'] = Following}
} catch(err) {console.error(err)}

if (!sessionStorage['FirstLoad']) {
    sessionStorage['FirstLoad'] = 'true';
    KeyForDelete = 0;
    DeleteCount = [];
    DeleteCount.length = localJSON('Following');
    $.each(DeleteCount, function(){
        delete localStorage['Stream_Title_'+KeyForDelete];
        delete localStorage['Stream_Time_'+KeyForDelete];
        delete localStorage['Stream_Tumb_'+KeyForDelete];
        delete localStorage['Stream_Viewers_'+KeyForDelete];
        delete localStorage['Stream_Game_'+KeyForDelete];
        localStorage['Stream_Status_'+KeyForDelete] = 'Offline';
        KeyForDelete += 1
    });
}

function checkDonations() {
    var GetDonationsList = $.ajax({url:"https://app.mcrozz.net/Twitch.tv_Notifier/DonationsList.php"});
    GetDonationsList.complete(function(){
        ParsedResponse = JSON.parse(GetDonationsList.responseText);
        if (ParsedResponse.indexOf(hex_md5(localJSON('Config','User_Name'))) != -1 ) {
            date = new Date();
            localJSON('Config','Timeout',date.setDate(date.getDate()+30));
            localJSON('Config','Ceneled',true)
        }
    });
}

function checkStatus(url,key) {
    var checkStatus = $.getJSON(url)
        .fail(function(){
            notifyUser("Update follows list", "Error, can't update","Update");
            localJSON('Status','update','8');
            BadgeOnlineCount('...')
        } );

    checkStatus.complete(function() {
        localJSON('Status','checked',Math.floor(localJSON('Status','checked'))+1);
        CheckBar2+='|';
        console.log('[ '+CheckBar2+CheckBar.substring(0,localStorage['Following']-localJSON('Status','checked'))+' ]');

        if (checkStatus.responseJSON.stream) {
            localJSON('Status','online',Math.floor(localJSON('Status','online'))+1);
            localJSON('Status','InsertOnlineList','1');
            TitleToStorage = 'Stream_Title_'+key;
            TimeToStorage = 'Stream_Time_'+key;

            Game = checkStatus.responseJSON.stream.game;
            Status = checkStatus.responseJSON.stream.channel.status;
            Name = localStorage['Stream_Name_'+key];
            Time = checkStatus.responseJSON.stream.channel.updated_at;

            if (Status == null) Status = 'Untitled stream';
            if (Game == null) Game = 'Not playing';

            if (localStorage[TitleToStorage] == undefined) notifyUser(Name+' just went live!',Status,'Online',Name);
            if (localStorage[TitleToStorage] != Status) {
                if (localStorage[TitleToStorage] != undefined) {
                    notifyUser(Name+' changed stream title on',Status,'Online',Name)
                }
            } if (Math.abs(new Date()-new Date(Time))>Math.abs(new Date()-new Date(localStorage[TimeToStorage]))) {
                localStorage[TimeToStorage] = Time
            } else if (!localStorage[TimeToStorage]){
                localStorage[TimeToStorage] = Time
            }

            localStorage['Stream_Title_'+key] = Status;
            localStorage['Stream_Viewers_'+key] = checkStatus.responseJSON.stream.viewers;
            localStorage['Stream_Game_'+key] = Game;
            localStorage['Stream_Status_'+key] = "Online";
        } else {
            localStorage['Stream_Status_'+key] = "Offline";
            delete localStorage['Stream_Title_'+key];
            delete localStorage['Stream_Viewers_'+key];
            delete localStorage['Stream_Game_'+key];
            delete localStorage['Stream_Title_'+key]
            delete localStorage['Stream_Time_'+key]
        } if (localJSON('Status','checked') == localStorage['Following']) {
            BadgeOnlineCount(localJSON('Status','online'));
            createCookie('First_Notify','1',365);
            CheckBar2 += '|';
            console.log('[ '+CheckBar2+CheckBar.substring(0, localStorage['Following']-localJSON('Status','checked'))+']');
            if (JSON.parse(localStorage['Status']).checked != '0') 
                console.log('Checked '+JSON.parse(localStorage['Status']).checked+'/'+localStorage['Following']);
            console.log('Every channel checked');
            localJSON('Status','update','0');
            localJSON('Status','InsertOnlineList','1')
        }
    });
}

function afterUpdate() {
    localJSON('Status','checked','0');
    localJSON('Status','online','0');
    localJSON('Status','update','4');
    CheckBar = '--------------------------------------------------------------------------------------------------------------------';
    CheckBar2 = '';

    for (var i=0;i<=Math.floor(localStorage['Following']);i++) 
        checkStatus('https://api.twitch.tv/kraken/streams/'+localStorage['Stream_Name_'+i], i)
}

var FirstStart = '1',
    FirstStart2 = '1';

function getCheckInsert() {
    checkDonations();
    if (localStorage['Following'] == undefined) localStorage['Following'] = 0;
    var twitch = 'Not loaded yet!',
        urlToJSON = 'https://api.twitch.tv/kraken/users/'+JSON.parse(localStorage['Config']).User_Name+'/follows/channels?limit=116&offset=0';
    localJSON('Status','update','1');

    if (JSON.parse(localStorage['Config']).User_Name == 'Guest') {
        localJSON('Status','update','6');
        console.error('Change user name!')
    } else {
        console.log("Behold! Update is comin'");
        notifyUser('Behold! Update!','Starting update...','Update');
        localJSON('Status','update','2');

        var updateFollowingListAndCheck = $.getJSON(urlToJSON, function(data, status) {
            twitch = data;
            if ([200,304].indexOf(updateFollowingListAndCheck.status) == -1) {
                console.error(updateFollowingListAndCheck.status);
                localJSON('Status','update','5');
                notifyUser("Update follows list","Error, can't update","Update");
                BadgeOnlineCount('0')
            } else {
                localJSON('Status','update','3');
                console.log('Following channels list updated, checking status')
            }
        });

        updateFollowingListAndCheck.complete(function(){
            if (Math.floor(localStorage['Following']) != twitch._total) {
                console.log('Update list of following channels');
                localStorage['Following'] = twitch._total;

                for (var i=0; i<= Math.floor(localStorage['Following']); i++) {
                    if (updateFollowingListAndCheck.responseJSON.follows[i]) {
                        localStorage['Stream_Name_'+i] = updateFollowingListAndCheck.responseJSON.follows[i].channel.name;
                    } else {
                        console.error('Get name of '+i+' ended with error');
                    }
                }
            }
            afterUpdate()
        } );
    }
}

if (FirstStart == '1') setTimeout(function(){ getCheckInsert() }, 10);
setInterval(function(){getCheckInsert()}, 1000 * 60 * Math.floor(JSON.parse(localStorage['Config']).Interval_of_Checking));


setInterval(function(){
    if (readCookie('InstatntCheck') == '1') getCheckInsert(); createCookie('InstatntCheck','0',365);
    if (readCookie('First_Notify') == '1') {
        if (Math.floor(JSON.parse(localStorage['Status']).online) > 1) {
            textANDchannel = 'Now online '+localJSON('Status','online')+' channels';
            notifyUser('Update finished!',textANDchannel,'Update')
        } else if (JSON.parse(localStorage['Status']).online == '1'){
            textANDchannel = 'Now online one channel';
            notifyUser('Update finished!',textANDchannel,'Update')
        } else if (JSON.parse(localStorage['Status']).online == '0'){
            textANDchannel = 'No one online right now :(';
            notifyUser('Update finished!',textANDchannel,'Update')}
        createCookie('First_Notify','0',365)
    } 
    if (localJSON('Config','User_Name') == 'Guest') {JustAvariableRandom = 0; delete localStorage['Following']}
    if (localStorage['Insert'] == 'true') getCheckInsert(); delete localStorage['Insert']
},1000)