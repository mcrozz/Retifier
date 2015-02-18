chrome.runtime.onMessage.addListener(function(msg) {
	if (msg.type == "update")
		loc();
	else
		window.parseMsg(msg);
		// Background and popup pages will have different parseMsg
		// BUG: function reference is working, but chromium thinks
		// that is not...
});