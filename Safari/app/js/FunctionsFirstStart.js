(function() {
  if (location.href.split('/').pop(1) === 'background.html') {
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
    if (!localStorage.Following)
      localStorage.Following = 0;

    local.init();

    if (!local.Config.Format)
      local.set('Config.Format', 'Grid');

    if (local.Config.Format == 'Mini')
      local.set('Config.Format', 'Light');

    if (!local.Config.Screen)
        local.set('Config.Screen', 0.34);


    var j = localStorage.App_Version,
        k = safari.extension.displayVersion;

    // Fallback for old versions
    try{
      if (j[0] === '{') {
        var te = JSON.parse(j);
        localStorage.App_Version = te.Ver;
        j = te.Ver;
      }
    } catch(e) {}

    if (!j) {
      localStorage.App_Version = k;
      j = k;
    }

    if (k != j) {
      notify.send("new_update", {
        type   : "basic",
        title  : "Extension has been updated",
        message: "From "+j+" to "+k,
        iconUrl: "/img/notification_icon.png",
        buttons: [{title: "Apply update"}]
      }, function() {});

      localStorage.App_Version = k;
      window.toShow = 123;
    }
  } else
    local.init();
})();
