window.parseMsg = function(msg) {
	switch(msg) {
		case "update": local.init(msg.data); break;
	}
};
