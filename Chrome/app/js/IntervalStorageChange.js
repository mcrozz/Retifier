/*
* msg : object {
*  type : String [ update,  ],
*  data : String or object
* }
*/
chrome.runtime.onMessage.addListener(function(msg) {
	if (msg.type == "update")
		local.init(msg.data);
	else
		window.parseMsg(msg);
		// Background and popup pages will have different parseMsg
		// BUG: function reference is working, but chromium thinks
		// that is not...
});
