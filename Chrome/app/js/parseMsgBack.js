function parseMsg(msg) {
	switch(msg) {
		case "refresh": initTwitch(); break;
		case "update": loc(); break;
	}
}