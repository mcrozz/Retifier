window.parseMsg = function(msg) {
	switch(msg.type) {
		case "update": local.init(msg.data); break;
	}
	if (msg.type === 'update' && msg.data === 'FollowingList')
		insert(msg.who);
	else if (msg.type === 'update' && msg.data === 'Status')
		updateStatus();
};
