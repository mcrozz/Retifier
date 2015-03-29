/*
* msg : object {
*  type : String [ update,  ],
*  data : String or object
* }
*/
var receive = function(msg, resp) {
	if (typeof msg === 'string')
		msg = {type: msg};

	if (window.location.pathname === '/background.html') {
		// If something is wrong or new update
		// This object will be indicate what's
		// went wrong:
		// * 777 - token is invalid
		// * 123 - extension updated
		if (!window.toShow)
			window.toShow = -1;

		switch(msg.type) {
			case "refresh": bck.init(); break;
			case "getOnline": bck.getList(); break;
			case "flush": bck.flush(); break;
			case "update": local.init(msg.data); break;
			case "getInf": resp({type:"inf", data:toShow}); toShow=-1; break;
			case "reload": chrome.runtime.reload(); break;
		}
	} else {
		switch(msg.type) {
			case "update": local.init(msg.data); break;
			case "following": insert(msg.data); break;
		}
		if (msg.type === 'update' && msg.data === 'Status')
			updateStatus();
	}
};
