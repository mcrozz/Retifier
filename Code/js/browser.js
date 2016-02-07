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

browser.send = new message();

if (typeof browser.badge === 'undefined')
	throw new Error('browser.badge is undefined!');