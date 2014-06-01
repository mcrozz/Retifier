try { 
    JSON.parse(localStorage.App_Version); 
    localJSON('App_Version', 'c', ['Got', 'v.'+items.version]);
    localJSON('App_Version', 'c', ['Ver', '{{APP_VERSION_CURRENT}}']);
    if (local.App_Version.Ver !== '{{APP_VERSION_CURRENT}}') {
        //notifyUser("Extension has been updated", "From "+local.App_Version.Ver+" to "+d.version, "ScriptUpdate", 'Upd'+Math.floor(Math.random(100)*100));
        localStorage.App_Version_Update=true;
        localStorage.App_Version_Try=0
    }
} catch(e) { localStorage.App_Version = '{"Ver": "{{APP_VERSION_CURRENT}}", "Got": "{{APP_VERSION_CURRENT}}"}'; localStorage.App_Version_Update=false; localStorage.App_Version_Try=0 }

if (!localStorage.Config) localStorage.Config = '{"User_Name":"Guest","token":"","Notifications":{"status":true,"online":true,"update":false,"sound_status":true,"sound":"DinDon","status":true,"follow":false},"Duration_of_stream":true,"Interval_of_Checking":3,"Format":"Grid"}';
if (!localStorage.Status) localStorage.Status = '{"update":7,"online":0,"checked":0,"StopInterval":false}';
if (!localStorage.FirstLaunch) {
    localStorage.FirstLaunch='true';
    localStorage.Following = 0;
    //localJSON('Status','c',['update',7]);
    BadgeOnlineCount(' Hi ');
}
if (!localStorage.Following) localStorage.Following = 0;
$.ajaxSetup ({cache:false,crossDomain:true});