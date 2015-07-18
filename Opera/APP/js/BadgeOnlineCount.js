function badge(count) {
	chrome.browserAction.setBadgeText({ text: String(count) });
	if (count !== 0) {
		chrome.browserAction.setBadgeBackgroundColor({color:"#593a94"});
		chrome.browserAction.setIcon({path:"/img/icon_1.png"}, function(){});
	} else {
		chrome.browserAction.setBadgeBackgroundColor({color:"#c9c9c9"});
		chrome.browserAction.setIcon({path:"/img/icon_0.png"}, function(){});
	}
}
