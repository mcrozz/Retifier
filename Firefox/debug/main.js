var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");
var pageworker = require("sdk/page-worker");
var storage = require("sdk/simple-storage").storage;

var button = ToggleButton({
	id: "my-button",
	label: "my button",
	icon: {
		"16": "./img/Logo_16.png",
		"32": "./img/Logo_48.png"
	},
	onChange: handleChange
});
// button.badgeColor
// button.badge

var panel = panels.Panel({
  contentURL: self.data.url("popup.html"),
  onHide: handleHide,
  onMessage: handleMsg
});

function handleChange(state) {
  if (state.checked) {
    panel.show({
      position: button
    });
  }
}

function handleHide() {
  button.state('window', {checked: false});
}


var back = pageworker.Page({
	contentURL: self.data.url("background.html"),
	onMessage: handleMsg
});

function handleMsg(msg) {
	console.log(msg);
}


function checkStorage() {
	if (!storage.Config)
		storage.Config = '{"User_Name":"Guest","token":"","Notifications":{"status":true,"online":true,"offline":true,"update":false,"sound_status":true,"sound":"DinDon","status":true,"follow":false},"Duration_of_stream":true,"Interval_of_Checking":3,"Format":"Grid","Screen":0.34}';
	if (!storage.Status)
		storage.Status = '{"update":7,"online":0,"checked":0}';
	if (!storage.FirstLaunch)
		storage.FirstLaunch='true';
	if (!storage.FollowingList)
		storage.FollowingList = '{}';
	if (storage.Ads === '')
		storage.Ads = '[]';
	if (!storage.FollowingList)
		storage.FollowingList='{}';
	if (!storage.Games)
		storage.Games = '{}';
	if (!storage.Following)
		storage.Following = 0;

	/*var j = storage.App_Version,
			k = chrome.runtime.getManifest().version;

	// Fallback for old versions
	try{
		if (j[0] === '{') {
			var te = JSON.parse(j);
			storage.App_Version = te.Ver;
			j = te.Ver;
		}
	} catch(e) {}

	if (!j) {
		storage.App_Version = k;
		j = k;
	}

	if (k != j) {
		/*chrome.notifications.create("new_update", {
			type   : "basic",
			title  : "Extension has been updated",
			message: "From "+j+" to "+k,
			iconUrl: "/img/notification_icon.png",
			buttons: [{title: "Apply update"}]
		}, function() {});*/
/*
		storage.App_Version = k;
		window.toShow = 123;
	}*/
}