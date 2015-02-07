chrome.runtime.onMessage.addListener(function(msg) {
	if (msg.type == "update")
		loc();
	else
		// Background and popup pages will have different parseMsg
		parseMsg(msg);
});