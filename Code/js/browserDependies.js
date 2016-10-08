// Example for Chromium engine

// Set and get badge text
browser.badge = {
	set: function(str) {
		chrome.browserAction.setBadgeText({ text: String(str) });
		if (Number(str) !== 0) {
			chrome.browserAction.setBadgeBackgroundColor({
				color:'#593a94'});
			chrome.browserAction.setIcon({
				path:'/img/icon_1.png'}, function(){});
		} else {
			chrome.browserAction.setBadgeBackgroundColor({
				color:'#c9c9c9'});
			chrome.browserAction.setIcon({
				path:'/img/icon_0.png'}, function(){});
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
notificationConstructor.constructor.prototype.sendMethod = function(ntf) {
	chrome.notifications.create(ntf.id,
		{
			iconUrl: '/img/icon_1.png',
			title: ntf.title,
			message: ntf.body,
			contextMessage: ntf.context,
			eventTime: ntf.date,
			buttons: ntf.buttons,
			isClickable: true
		}, function() {});
}

view.browserGetView(chrome.extension.getViews);

browser.getView = function() {
	var view = null;
	chrome.extension.getViews(function(views) {
		for (var i in views) {
			if (views[i].location.pathname === location.pathname)
				continue;

			view = views[i];
			return;
		}
	});

	return !view? false:view;
};