function send(msg, callback) {
	$.each(chrome.extension.getViews(), function(i,v) {
		if (v.location.pathname === location.pathname)
			return;

		if (typeof v.parseMessage === 'function')
			v.parseMessage(msg, null, (typeof callback === 'function')?callback:null);
	});
}
