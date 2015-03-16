window.parseMsg = function(msg) {
	switch(msg.type) {
		case "update": local.init(msg.data); break;
	}
};
