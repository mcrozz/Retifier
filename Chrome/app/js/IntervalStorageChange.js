chrome.runtime.onMessage.addListener(function(msg) {
	if (msg.type == "update")
		loc();
});