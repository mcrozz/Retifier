browser.error = function(d) {
	// @TODO: hook up with analytics
	return console.error(d);
};
browser.log = function(d) {
	return console.log(d);
};
browser.debug = function(d) {
	return console.debug(d);
};

browser.notification = new notificationConstructor();

browser.isOnline = function() {
	return navigator.onLine;
};

$(window).on('offline', function() {
	window.browser.isOnline = false;
});
$(window).on('online', function() {
	window.browser.isOnline = true;
});