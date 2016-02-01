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
	this.set = function(id, val, sec) {
		if (isNaN(id))
			id = this.findBy('id', id);

		if (!id) return false;
		id = id.i;

		if (typeof this.data[id] == 'undefined')
			return false;

		if (typeof sec == 'undefined')
			return (this.data[id] = val);
		else
			if (typeof thisdata[id][val] != 'undefined')
				return (this.data[id][val] = sec);

		return false;
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
		var toSave = this.data;
		if (typeof this.customSave == 'function')
			toSave = this.customSave();

		var js = null;
		try { js = JSON.stringify(toSave); }
		catch(e) { browser.error(e); }
		if (js === null) return false;

		return (localStorage[this.id] = js);
	};

	return this;
};

function date(type, input) {
	if (!type) return new Date().getTime();
	var t = new Date();
	
	if (type == "smart" && !isNaN(input)) {
		var diff = t-input;
		var rtn = " ago";
		
		if (diff/(3600000) < 1)
			rtn = Math.round(diff/(60000))+" minutes"+rtn; // Minutes ago
		else if (diff/(86400000) < 1)
			rtn = Math.round(diff/(3600000))+" hours"+rtn; // Hours ago
		else
			rtn = Math.round(diff/(86400000))+" days"+rtn; // Days ago

		return rtn;
	} else if (type == "raw") {
		return {
			H: t.getHours(),
			M: t.getMinutes(),
			S: t.getSeconds(),
			D: t.getDate(),
			M: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Nov", "Oct", "Dec"][t.getMonth()],
			Y: t.getFullYear()
		};
	}
	return false;
};