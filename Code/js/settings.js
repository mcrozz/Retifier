window.settings = new storage('settings', {
	fallback: {
		ui: {},
		checkInterval: 1000*60*5,
		user: {
			name: null,
			id: null,
			token: null
		}
	},
	onchange: function(d) {
		browser.send.async('settingsChanged', d);
	}
});