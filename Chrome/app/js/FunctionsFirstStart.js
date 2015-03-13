if (window.location.pathname === '/background.html') {
  $.ajaxSetup ({cache:false,crossDomain:true});
  if (!localStorage.Config)
    localStorage.Config = '{"User_Name":"Guest","token":"","Notifications":{"status":true,"online":true,"offline":true,"update":false,"sound_status":true,"sound":"DinDon","status":true,"follow":false},"Duration_of_stream":true,"Interval_of_Checking":3,"Format":"Grid","Screen":"big","ScreenCustom":[1,1]}';
  if (!localStorage.Status)
    localStorage.Status = '{"update":7,"online":0,"checked":0}';
  if (!localStorage.FirstLaunch)
    localStorage.FirstLaunch='true';
  if (!localStorage.FollowingList)
    localStorage.FollowingList = '{}';
  if (localStorage.Ads === '')
    localStorage.Ads = '[]';
  if (!localStorage.FollowingList)
    localStorage.FollowingList='{}';
  if (!localStorage.Games)
    localStorage.Games = '{}';

  local.init();

  if (!local.Config.Format)
    local.set('Config.Format', 'Grid');

  if (local.Config.Format == 'Light')
    local.set('Config.Format', 'mini');

  if (!local.Config.Screen)
      local.set('Config.Screen', 'big');

  try {
    var j = JSON.parse(localStorage.App_Version),
        k = chrome.runtime.getManifest().version;
    if (k != j.Ver) {
      Notify({title:"Extension has been updated", msg:"From "+j.Ver+" to "+k, type:"sys"});
      j.Try = 0;
      local.set('App_Version.Ver', k);
    }
  } catch(e) {
    localStorage.App_Version = '{"Ver": "'+chrome.runtime.getManifest().version+'", "Got": "'+chrome.runtime.getManifest().version+'","Try":0}';
  }
} else
  local.init();
