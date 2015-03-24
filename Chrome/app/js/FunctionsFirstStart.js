if (window.location.pathname === '/background.html') {
  $.ajaxSetup ({cache:false,crossDomain:true});
  if (!localStorage.Config)
    localStorage.Config = '{"User_Name":"Guest","token":"","Notifications":{"status":true,"online":true,"offline":true,"update":false,"sound_status":true,"sound":"DinDon","status":true,"follow":false},"Duration_of_stream":true,"Interval_of_Checking":3,"Format":"Grid","Screen":0.34}';
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

  if (local.Config.Format == 'Mini')
    local.set('Config.Format', 'Light');

  if (!local.Config.Screen)
      local.set('Config.Screen', 0.34);


  var j = localStorage.App_Version,
      k = chrome.runtime.getManifest().version;

  if (!j || localStorage.App_Version[0]==='{')
    localStorage.App_Version = k;

  if (k != j) {
    Notify({
      title:"Extension has been updated",
      msg:"From "+j+" to "+k,
      type:"sys"});

    localStorage.App_Version = k;
    window.toShow = 123;
  }
} else
  local.init();
