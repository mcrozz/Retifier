window.parseMsg = function(msg) {
	switch(msg.type) {
		case "update": local.init(msg.data); break;
		case "following": insert(msg.data); break;
	}
	if (msg.type === 'update' && msg.data === 'Status')
		updateStatus();
};
