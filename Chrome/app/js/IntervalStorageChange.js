/*
* msg : object {
*  type : String [ update,  ],
*  data : String or object
* }
*/
chrome.runtime.onMessage.addListener(function(msg) {
	if (msg === 'refresh')
		msg = {type: msg};
	window.parseMsg(msg);
});
