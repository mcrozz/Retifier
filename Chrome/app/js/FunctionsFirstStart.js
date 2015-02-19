if (window.location.pathname === '/background.html') {
    $.ajaxSetup ({cache:false,crossDomain:true});
    if (!localStorage.Config)
        localStorage.Config = '{"User_Name":"Guest","token":"","Notifications":{"status":true,"online":true,"offline":true,"update":false,"sound_status":true,"sound":"DinDon","status":true,"follow":false},"Duration_of_stream":true,"Interval_of_Checking":3,"Format":"Grid"}';
    if (!localStorage.Status)
        localStorage.Status = '{"update":7,"online":0,"checked":0}';
    if (!localStorage.FirstLaunch)
        localStorage.FirstLaunch='true';
    if (!localStorage.FollowingList)
        localStorage.FollowingList = '{}';
    deb(localStorage.FollowingList);
    try {
        var j = JSON.parse(localStorage.App_Version),
            k = chrome.runtime.getManifest().version;
        if (k !== j) {
            Notify({title:"Extension has been updated", msg:"From "+j.Ver+" to "+k, type:"sys"});
            localStorage.App_Version_Update=true;
            localStorage.App_Version_Try=0;
            localJSON('App_Version.Ver', k);
        }
    } catch(e) { localStorage.App_Version = '{"Ver": "'+chrome.runtime.getManifest().version+'", "Got": "'+chrome.runtime.getManifest().version+'"}'; localStorage.App_Version_Update=false; localStorage.App_Version_Try=0 }
}
