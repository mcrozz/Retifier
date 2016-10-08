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
	},
	objetSceleton: function(d) {
		var value = d;

		this.set = function(val) {
			value = val;
			return this.save();
		};

		this.get = function() {
			return value;
		}
		
		this.isSet = function() {
			return (typeof value !== 'undefined' && value !== null);
		};

		return this;
	},
	customSave: function() {
		var data = this.data();
		var save = {};
		
		for (var i in data) {
			if (typeof data[i] === 'object') {
				save[i][j] = (typeof data[i][j].length === 'undefined')?
					{} : [];
				
				for (var j in data[i])
					save[i][j] = data[i][j].get();
			} else
				toSave[i] = data[i].get();
		}

		return save;
	}
});