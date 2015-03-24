// If something is wrong or new update
// This object will be indicate what's
// went wrong:
// * 777 - token is invalid
// * 123 - extension updated
if (!window.toShow)
	window.toShow = -1;

window.parseMsg = function(msg, resp) {
	switch(msg.type) {
		case "refresh": initTwitch(); break;
		case "update": local.init(msg.data); break;
		case "getInf": resp({type:"inf", data:toShow}); toShow=-1; break;
	}
};
