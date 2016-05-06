window.settings = new storage('settings', {
	fallback: {
		ui: {
			scale: null
		},
		checkInterval: 1000*60*5,
		user: {
			name: null,
			id: null,
			token: null
		},
		notifications: [
			true, // went online
			false,// changed title
			true, // starts hosting
			false // went offline
		]
	},
	onchange: function(d) {
		browser.debug(d);
	}
});