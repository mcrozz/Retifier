window.parseMsg = function(msg) {
	switch(msg.type) {
		case "refresh": initTwitch(); break;
		case "update": local.init(msg.data); break;
	}
};
