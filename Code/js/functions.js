// Returns position and object itself
Array.prototype.findBy = function(par, equ) {
	for (var i in this) {
		if (this[i][par] == equ)
			return {i: i, element: this[i]};
	};
	return false;
};

// Storage unit
function storage(id) {
	this.data = [];
	this.id = id;
	this.get = function(id) {
		return id? this.data[id] : this.data;
	};
	this.save = function() {
		var js = null;
		try { js = JSON.stringify(this.data); }
		catch(e) { browser.error(e); }
		if (js === null) return false;

		return (localStorage[this.id] = js);
	};

	return this;
};