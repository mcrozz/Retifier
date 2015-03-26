function send(msg, callback) {
	if (typeof callback === 'function')
		chrome.runtime.sendMessage(msg, null, callback);
	else
		chrome.runtime.sendMessage(msg);
}
