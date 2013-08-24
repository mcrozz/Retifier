//
// @author Ivan 'MacRozz' Zarudny
//
// https://api.twitch.tv/kraken/users/ NAME OF PROFILE /follows/channels?limit=116&offset=0
// Limit is 116, you have more than that? email me hostingmcrozz@hotmail.com about it :D
// Offset must be 0 (ZERO)
//
// Object.follows[number, from 0 to follows count].channel.name
//
//
// StatusUpdate
//
// 0 - Not updating, finished
// 1 - Timer ended, start update
// 2 - Update list of followed channels
// 3 - List of followed channels updated
// 4 - Checking online channel or not
// 5 - Error
// 6 - Name doesn't set up!
//

/*
 JustAvariableRandom = 0;
 delete localStorage['Status'].checked;
 while (JustAvariableRandom <= Math.floor(JSONfollowing.Following)) {
 delete JSONfollowing.Stream[JustAvariableRandom].Status;
 delete JSONfollowing.Stream[JustAvariableRandom].Title;
 delete JSONfollowing.Stream[JustAvariableRandom].Game;
 delete JSONfollowing.Stream[JustAvariableRandom].Time;
 delete JSONfollowing.Stream[JustAvariableRandom].Tumb;
 localStorage['Following'] = JSON.stringify(JSONfollowing);
 JustAvariableRandom += 1
 }
 */
 
 setInterval(function(){
    if (localStorage['Insert'] == 'true') {
        getCheckInsert();
        delete localStorage['Insert']
    }
 }, 100)

if (!sessionStorage['FirstLoad']) {
    sessionStorage['FirstLoad'] = 'true';
    KeyForDelete = 0;
    DeleteCount = [];
    DeleteCount.length = JSON.parse(localStorage['Following']).Following;
    $.each(DeleteCount, function(){
        delete localStorage['Stream_Title_'+KeyForDelete];
        delete localStorage['Stream_Time_'+KeyForDelete];
        delete localStorage['Stream_Tumb_'+KeyForDelete];
        delete localStorage['Stream_Viewers_'+KeyForDelete];
        delete localStorage['Stream_Game_'+KeyForDelete];
        KeyForDelete += 1
    });
}

var JSONfollowing = JSON.parse(localStorage['Following']),
	JSONstatus = JSON.parse(localStorage['Status']),
	JSONconfig = JSON.parse(localStorage['Config']);

function checkStatus(url,key) {
    var getJSONfile = $.getJSON(url, function(data){ statusOfStream = data })
        .fail(function(){
            notifyUser("Update follows list", "Error, can't update","Update");
            JSONstatus.update = '6';
            localStorage['Status'] = JSON.stringify(JSONstatus);
            BadgeOnlineCount('...')
        } );

    getJSONfile.complete(function() {
        NumberOfChecked = Math.floor(JSON.parse(localStorage['Status']).checked);
        NumberOfChecked += 1;
        JSONstatus.checked = NumberOfChecked;
        localStorage['Status'] = JSON.stringify(JSONstatus);
        CheckBar2 += '|';
        console.log('[ '+CheckBar2+CheckBar.substring(0, JSONfollowing.Following - JSONstatus.checked)+' ]');

        if (statusOfStream.stream) {
            NowOnline = Math.floor(JSON.parse(localStorage['Status']).online);
            NowOnline += 1;
            JSONstatus.online = NowOnline;
            localStorage['Status'] = JSON.stringify(JSONstatus);
            TitleToStorage = 'Stream_Title_'+key;
            TimeToStorage = 'Stream_Time_'+key;

            Game = statusOfStream.stream.game;
            Status = statusOfStream.stream.channel.status;
            Name = localStorage['Stream_Name_'+key];
            Time = statusOfStream.stream.channel.updated_at;

            if (Status == null) {Status = 'Untitled stream'}
            if (Game == null) {Game = 'Not playing'}

            if (localStorage[TitleToStorage] == undefined) {
                notifyUser(Name+' just went live!',Status,'Online',Name)
            } if (localStorage[TitleToStorage] != Status) {
                if (localStorage[TitleToStorage] != undefined) {
                    notifyUser(Name+' changed stream title on',Status,'Online',Name)
                }
            } if ( Math.abs(new Date() - new Date(Time)) > Math.abs(new Date() - new Date(localStorage[TimeToStorage])) ) {
                localStorage[TimeToStorage] = Time
            } else if (!localStorage[TimeToStorage]){
                localStorage[TimeToStorage] = Time
            }

            localStorage['Stream_Title_'+key] = Status;
            localStorage['Stream_Viewers_'+key] = statusOfStream.stream.viewers;
            localStorage['Stream_Game_'+key] = Game;
            if (statusOfStream.stream.preview.medium != undefined) {
                localStorage['Stream_Tumb_'+key] = statusOfStream.stream.preview.medium
            } else {
                localStorage['Stream_Tumb_'+key] = null
            }
            localStorage['Stream_Status_'+key] = "Online";
        } else {
            localStorage['Stream_Status_'+key] = "Offline";

            delete localStorage['Stream_Title_'+key];
            delete localStorage['Stream_Viewers_'+key];
            delete localStorage['Stream_Game_'+key];
            delete localStorage['Stream_Tumb_'+key];
            delete localStorage['Stream_Title_'+key]
            delete localStorage['Stream_Time_'+key]
        } if (JSON.parse(localStorage['Status']).checked == JSON.parse(localStorage['Following']).Following) {
            BadgeOnlineCount(JSON.parse(localStorage['Status']).online);
            createCookie('First_Notify','1',365);
            CheckBar2 += '|';
            console.log('[ '+CheckBar2+CheckBar.substring(0, JSONfollowing.Following - JSONstatus.checked)+' ]');
            if (JSON.parse(localStorage['Status']).checked != '0') {console.log('Checked '+JSON.parse(localStorage['Status']).checked+'/'+JSON.parse(localStorage['Following']).Following)}
            console.log('Every channel checked');
            JSONstatus2 = JSON.parse(localStorage['Status']);
            JSONstatus2.update = '0';
            JSONstatus2.InsertOnlineList = '1';
            JSONstatus2.ShowWaves = 'false';
            localStorage['Status'] = JSON.stringify(JSONstatus2)
        }
    });
    JSONstatus.InsertOnlineList = '1';
    localStorage['Status'] = JSON.stringify(JSONstatus)
}

function afterUpdate() {
    JSONstatus.checked = '0';
    JSONstatus.online = '0';
    JSONstatus.update = '4';
    NumberOfRetry = 0;
    CheckBar = '--------------------------------------------------------------------------------------------------------------------';
    CheckBar2 = '';
    var FollowingChannelList = [];
    FollowingChannelList.length = JSON.parse(localStorage['Following']).Following;
    localStorage['Status'] = JSON.stringify(JSONstatus);

    $.each(FollowingChannelList, function() {
        checkStatus('https://api.twitch.tv/kraken/streams/'+localStorage['Stream_Name_'+NumberOfRetry], NumberOfRetry);
        NumberOfRetry += 1
    } );
}

var FirstStart = '1',
    FirstStart2 = '1';

function getCheckInsert() {
    var twitch = 'Not loaded yet!',
        statusOfStream = 'Not loaded yet!!',
        urlToJSON = 'https://api.twitch.tv/kraken/users/'+JSON.parse(localStorage['Config']).User_Name+'/follows/channels?limit=116&offset=0';
    JSONstatus.update = '1';
    localStorage['Status'] = JSON.stringify(JSONstatus);

    if (JSON.parse(localStorage['Config']).User_Name == 'Guest') {
        JSONstatus.update = '6';
        localStorage['Status'] = JSON.stringify(JSONstatus);
        console.error('Change user name!')
    } else {
        console.log("Behold! Update is comin'");
        notifyUser('Behold! Update!','Starting update...','Update');
        JSONstatus.update = '2';
        localStorage['Status'] = JSON.stringify(JSONstatus);

        var updateFollowingListAndCheck = $.getJSON(urlToJSON, function(data, status) {
            twitch = data;
            if ([200,304].indexOf(updateFollowingListAndCheck.status) == -1) {
                console.error(updateFollowingListAndCheck.status);
                JSONstatus.update = '5';
                notifyUser("Update follows list","Error, can't update","Update");
                localStorage['Status'] = JSON.stringify(JSONstatus);
                BadgeOnlineCount('0')
            } else {
                JSONstatus.update = '3';
                localStorage['Status'] = JSON.stringify(JSONstatus);
                console.log('Following channels list updated, checking status')
            }
        });

        updateFollowingListAndCheck.complete(function(){
            if (JSONfollowing.Following != twitch._total) {
                console.log('Update list of following channels');
                NumberOfRetryForKey = 0;
                JSONfollowing.Following = twitch._total;
                localStorage['Following'] = JSON.stringify(JSONfollowing);

                while (NumberOfRetryForKey <= Math.floor(JSONfollowing.Following)-1) {
                    if (updateFollowingListAndCheck.responseJSON.follows[NumberOfRetryForKey]) {
                        localStorage['Stream_Name_'+NumberOfRetryForKey] = updateFollowingListAndCheck.responseJSON.follows[NumberOfRetryForKey].channel.name;
                        NumberOfRetryForKey += 1
                    } else {
                        console.error('Get name of '+NumberOfRetryForKey+' ended with error');
                        NumberOfRetryForKey += 1
                    }
                }

            }
            afterUpdate()
        } );
    }
}

if (FirstStart == '1'){setTimeout(function(){ getCheckInsert() }, 10)}

setInterval(function(){getCheckInsert()}, 1000 * 60 * Math.floor(JSON.parse(localStorage['Config']).Interval_of_Checking));

setInterval(function(){
    if (readCookie('InstatntCheck') == '1') {
        getCheckInsert();
        createCookie('InstatntCheck','0',365)
    } if (readCookie('First_Notify') == '1') {
        if (Math.floor(JSON.parse(localStorage['Status']).online) > 1) {
            textANDchannel = 'Now online '+JSON.parse(localStorage['Status']).online+' channels'
        } else if (JSON.parse(localStorage['Status']).online == '1'){
            textANDchannel = 'Now online one channel'
        } else if (JSON.parse(localStorage['Status']).online == '0'){
            textANDchannel = 'No one online right now :('
        } else {textANDchannel = ''}                    
        notifyUser('Update finished!',textANDchannel,'Update');
        createCookie('First_Notify','0',365)
    } if (JSON.parse(localStorage['Config']).User_Name == 'Guest') {
        JustAvariableRandom = 0;
        delete JSONfollowing;
        localStorage['Following'] = JSON.stringify(JSONfollowing)
    }
},1000)