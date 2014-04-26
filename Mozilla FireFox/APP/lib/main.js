var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");

pageWorker = require("sdk/page-worker").Page({
	contentURL: self.data.url("background.html")
});

var button = ToggleButton({
	id: "my-button",
	label: "my button",
	icon: {
		"16": self.data.url("img/icon.png"),
		"32": self.data.url("img/icon.png"),
		"64": self.data.url("img/icon.png")
	},
	onChange: handleChange
});

var panel = panels.Panel({
	width: 697,
	height: 584,
	contentURL: self.data.url("popup.html"),
	onHide: handleHide
});

function handleChange(state) {
	if (state.checked) {
		panel.show({ position: { right: 15, top: 0 } });
	}
}

function handleHide() {
	button.state('window', {checked: false});
}