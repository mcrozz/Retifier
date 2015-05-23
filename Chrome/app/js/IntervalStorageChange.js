/*
* msg : object {
*  type : String [ update,  ],
*  data : String or object
* }
*/

// Dismiss all notifications when user opens extension's window
if (location.pathname === '/popup.html') {
	chrome.notifications.getAll(function(n) {
		$.each(n, function(i,v) {
			if (i == 'new_update' || i == 'sys')
				return;
			chrome.notifications.clear(i, function(){});
		});
	});
}

chrome.runtime.onMessage.addListener(function(msg, s, resp) {
	if (typeof msg === 'string')
		msg = {type: msg};

	if (location.pathname === '/background.html') {
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
});
