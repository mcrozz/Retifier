// Example for Chromium engine

// Send message to every view
messageParser.constructor.prototype.sendMethod = function(data) {
	for (var view in chrome.extension.getViews()) {
		if (chrome.extension.getViews()[view].location.pathname === location.pathname)
			return;

		window.browser.send.receive(msg);
	}
};

// Set and get badge text
browser.badge = {
	set: function(str) {
		chrome.browserAction.setBadgeText({ text: String(count) });
		if (count !== 0) {
			chrome.browserAction.setBadgeBackgroundColor({color:"#593a94"});
			chrome.browserAction.setIcon({path:"/img/icon_1.png"}, function(){});
		} else {
			chrome.browserAction.setBadgeBackgroundColor({color:"#c9c9c9"});
			chrome.browserAction.setIcon({path:"/img/icon_0.png"}, function(){});
		}
	},
	get: function() {
		if (!(this instanceof arguments.callee))
			throw new Error('Cannot be used as function!');
		this.done = function(){};
		chrome.browserAction.getBadgeText({},
			function(e){ return this.done(e); }.bind(this));
		return this;
	}
};

// Notification handlers
chrome.notifications.onButtonClicked.addListener(function(id, buttonID) {
	return browser.notification.clicked(id, 'button');
});
chrome.notifications.onClicked.addListener(function(id) {
	return browser.notification.clicked(id, false);
});
chrome.notifications.onClosed.addListener(function(id) {
	return browser.notification.closed(id);
});