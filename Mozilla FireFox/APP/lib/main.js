var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");
var data = self.data;

var tabs = require("sdk/tabs");

//pageWorker = require("sdk/page-worker").Page({ contentURL: data.url("background.html") });

var button = ToggleButton({
	id: "twitchtv_notifier",
	label: "Who's online?",
	icon: {
		"16": data.url("icon.png"),
		"32": data.url("icon.png"),
		"64": data.url("icon.png")
	},
	onChange: handleChange
});

var panel = panels.Panel({
	width: 697,
	height: 584,
	contentURL: data.url("popup.html"),
	onHide: handleHide
});

function handleChange(state) {
	//if (state.checked) { panel.show({ position: { right: 15, top: 0 } }); }
	tabs.open(data.url("popup.html"));
}

function handleHide() {
	button.state('window', {checked: false});
}