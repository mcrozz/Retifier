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
	this.push = function(data) {
		this.data.push(data);
	};
	this.length = function() {
		return this.data.length;
	};
	// @Dependend on Array.prototype.findBy
	this.findBy = function(par, equ) {
		return this.data.findBy(par, equ);
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