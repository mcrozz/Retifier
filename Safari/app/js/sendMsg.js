function send(msg, callback) {
	try{
		if (window.location.href.split('/').pop(1) === 'background.html') {
			if (typeof safari.extension.popovers[0].contentWindow.receive === 'function')
				safari.extension.popovers[0].contentWindow.receive(msg, callback);
		} else
			safari.extension.globalPage.contentWindow.receive(msg, callback);
	} catch(e) { err(e); }
}
