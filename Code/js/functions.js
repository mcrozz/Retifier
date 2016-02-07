// Returns position and object itself as
// { i: int, element: object }
Array.prototype.findBy = function(par, equ) {
	for (var i in this) {
		if (this[i][par] == equ)
			return {i: i, element: this[i]};
	}
	return false;
};

// Storage unit
// @input
//   id as String, used as localStorage name
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
			if (typeof this.data[id][val] != 'undefined')
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
}

// Date function
// @input
//   type:
//     smart: e.g. "5 minutes"
//     raw: returns object {
//       h: int - hours
//       m: int - minutes
//       s: int - seconds
//       D: int - days
//       M: int - mounths
//       Y: int - years
//       }
//     fill: @requires input as String
//       or input as object:
//       { pattern: String, time: int }
//   input: @required if type is smart
//     or type is fill and used as difference
function date(type, input) {
	if (!type) return new Date().getTime();
	var t = new Date();
	
	function fill(str, data) {
		for (var i in data)
			str = str.replace(i, data[i]);

		return str;
	}

	if (type == 'smart' && !isNaN(input)) {
		var diff = t-input;
		var rtn = ' ago';
		
		if (diff/(3600000) < 1)
			rtn = Math.round(diff/(60000))+' minutes'+rtn; // Minutes ago
		else if (diff/(86400000) < 1)
			rtn = Math.round(diff/(3600000))+' hours'+rtn; // Hours ago
		else
			rtn = Math.round(diff/(86400000))+' days'+rtn; // Days ago

		return rtn;
	} else if (type == 'raw') {
		return {
			h: t.getHours(),
			m: t.getMinutes(),
			s: t.getSeconds(),
			D: t.getDate(),
			M: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Oct', 'Dec'][t.getMonth()],
			Y: t.getFullYear()
		};
	} else if (type == 'fill') {
		// @input as it is raw
		if (typeof input === 'undefined')
			return null;

		switch(typeof input) {
			case 'object':
				return fill(input.pattern, date('raw', t-input.time));
			case 'string':
				return fill(input, date('raw', input));
		}
	}
	return false;
}


// Bridge between scripts, need to be initiated after
//browserDependies.js and before creation of browser
//object.
// Usage:
// message.async('getAll', function(response){});
// message.sync('getAll');
var message = function() {
	var body = new messageParser();
	this.async = function(msg, args, callback) {
		return body.send(new body.messageConstructor(msg, args, callback));
	}.bind(this);
	this.sync = function(msg, args) {
		// @TODO
	}.bind(this);
	this.receive = function(data) {
		return body.receive(data);
	}.bind(this);
	this.send = function() {
		return body.send().bind(this);
	}.bind(this);
}();


// Pair background script and popup window
// @requires methods: sendMethod, receiveMethod
//which is platform depended
function messageParser() {
	var cmds = {
		getOnlineList: function() { return checker.online; },
		getAll: function() { return checker.following.get(); },
		getStreamer: function(str) { return checker.following.find(str); },
		setStreamer: function(str) { return 1; },
		getConfig: function() { return ''; },
		setConfig: function(cfg) { return 1; },
		forceUpdate: function() { return checker.restart(); },
		getSuggestions: function() { return ''; },
		change: function(type) { $(window).trigger(type); }
	};

	function message(msg, args, callback) {
		function randomID() {
			// 48-90 and 97-122
			var i = Math.floor((Math.random()*122)+48);
			var j = Math.floor((Math.random()*122)+48);
			var z = Math.floor((Math.random()*122)+48);
			function clamp(val,just) {
				if (val>=91&&val<=96) {
					var t = Math.random()*50-50;
					if (t<0)
						val = 90+t;
					else
						val = 97+t;
				}
				else if (val>122) val = 122-(Math.random()*74);
				else if (val<48) val = 48+(Math.random()*74);
				if (just) {
					var _t = Math.round(val);
					return (_t+'')[(_t+'').length-1];
				} else
					return Math.round(val);
			}
			
			return String.fromCharCode(clamp(i+j-48))+
				String.fromCharCode(clamp(j/i))+
				String.fromCharCode(clamp((i%j)*100))+
				String.fromCharCode(clamp(i/2))+
				String.fromCharCode(clamp(i*5))+
				String.fromCharCode(clamp(j+15))+
				String.fromCharCode(clamp(j-4))+
				String.fromCharCode(clamp(i-j+100))+
				'-'+
				clamp(i/5,1)+
				clamp(i+j,1)+
				clamp(z-4,1)+
				clamp(j/z,1)+
				'-'+
				String.fromCharCode(clamp(z*j-14884))+
				String.fromCharCode(clamp(122-z))+
				String.fromCharCode(clamp(122-j))+
				String.fromCharCode(clamp(z%2))+
				String.fromCharCode(clamp(j%10))+
				String.fromCharCode(clamp(z>>1))+
				String.fromCharCode(clamp(j>>4))+
				String.fromCharCode(clamp(z^2-14884));
		}

		this.id = randomID();
		this.message = msg;
		this.args = args;
		this.callback = callback?callback:null;

		return this;
	}

	this.messageConstructor = message;

	var queue = [];
	this.find = function(id) {
		var rtn = null;
		for (var i in queue)
			if (queue[i].id == id) {
				rtn = queue[i]; break;
			}
		return rtn;
	};
	this.del = function(id) {
		queue = queue.filter(function(i,v) {
			v.id !== id;
		});
	};

	this.send = function(data) {
		this.queue.push(data);
		this.sendMethod(data);
		return true;
	}.bind(this);

	this.receive = function(data) {
		if (!data)
			return browser.error(new Error('Empty data'));

		if (data.message === 'RESPONSE') {
			var _t = this.find(data.callTo);
			if (_t === null) return browser.error(new Error('Cannot find callback with such ID'));
			if (typeof _t.callback === 'function')
				_t.callback(_t.response);
			this.del(data.callTo);
			return true;
		}

		if (typeof cmds[data.message] === 'undefined')
			browser.error(new Error('Cannot find such command'));

		var response = 'ERROR';
		try {
			response = cmds[data.message](data.args||null);
		} catch(e) { browser.error(e); }
		
		var rsp = new this.messageConstructor('RESPONSE');
		rsp.response = response;
		return this.send(rsp);
	}.bind(this);

	// Example for Chromium engine
	this.sendMethod = function(data) {
		$.each(chrome.extension.getViews(), function(i,v) {
			if (v.location.pathname === location.pathname)
				return;

			message.receive(msg);
		}.bind(this));
	};
}