if (window.location.pathname === '/background.html') {
    $.ajaxSetup ({cache:false,crossDomain:true});
    if (!localStorage.Config)
        localStorage.Config = '{"User_Name":"Guest","token":"","Notifications":{"status":true,"online":true,"update":false,"sound_status":true,"sound":"DinDon","status":true,"follow":false},"Duration_of_stream":true,"Interval_of_Checking":3,"Format":"Grid"}';
    if (!localStorage.Status)
        localStorage.Status = '{"update":7,"online":0,"checked":0,"StopInterval":false}';
    if (!localStorage.FirstLaunch)
        localStorage.FirstLaunch='true';
    try { 
        var j = JSON.parse(localStorage.App_Version),
            k = chrome.app.getDetails().version;
        if (k !== j.Ver.substr(2)) {
            Notify({title:"Extension has been updated", msg:"From "+j.Ver.substr(2)+" to "+k, type:"sys"});
            localStorage.App_Version_Update=true;
            localStorage.App_Version_Try=0;
            localJSON('App_Version.Ver', k);
        }
    }
    catch(e) { localStorage.App_Version = '{"Ver": "{{APP_VERSION_CURRENT}}", "Got": "{{APP_VERSION_CURRENT}}"}'; localStorage.App_Version_Update=false; localStorage.App_Version_Try=0 }
}