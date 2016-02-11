window.browser = {};

// Returns position and object itself as
// { i: int, element: object }
Array.prototype.findBy = function(par, equ) {
	for (var i in this) {
		if (this[i][par] == equ)
			return {i: i, element: this[i]};
	}
	return false;
};

// Generates random key, e.g.
//AbCDeFGh-1234-IjKLmNop
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

// Storage unit
// @input
//   id as String, used as localStorage name
function storage(id, fallback) {
	if (!(this instanceof arguments.callee))
		throw new Error('Cannot be used as function!');
	var data = null;
	var id = id;
	
	this.get = function(id) {
		return id? data[id] : data;
	};
	this.set = function(id, val, sec) {
		if (isNaN(id))
			id = this.findBy('id', id);

		if (!id) return false;
		id = id.i;

		if (typeof data[id] == 'undefined')
			return false;

		if (typeof sec == 'undefined')
			return (data[id] = val);
		else
			if (typeof data[id][val] != 'undefined')
				return (data[id][val] = sec);

		return false;
	};
	this.push = function(d) {
		data.push(d);
	};
	this.length = function() {
		return data.length;
	};
	// @Dependend on Array.prototype.findBy
	this.findBy = function(par, equ) {
		return data.findBy(par, equ);
	};
	this.save = function() {
		var toSave = data;
		if (typeof this.customSave == 'function')
			toSave = this.customSave();

		var js = null;
		try { js = JSON.stringify(toSave); }
		catch(e) { browser.error(e); }
		if (js === null) return false;

		return (localStorage[this.id] = js);
	};

	try {
		data = JSON.parse(localStorage[id]);
	} catch(e) {
		localStorage[id] = fallback;
	}

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

	if (type == 'smart' && !isNaN(input)) {
		var diff = t-input;
		var rtn = '';
		var _t = -1;
		
		if (diff/3600000 < 1) { // Less than a hour
			_t = Math.round(diff/60000);
			rtn = 'minute';
		} else if (diff/(86400000) < 1) { // Less than a day
			_t = Math.round(diff/3600000);
			rtn = 'hour'; 
		} else if (diff/31536000000 < 1) { // Less than a year
			_t = Math.round(diff/86400000);
			rtn = 'day';
		} else {
			_t = Math.round(diff/31536000000);
			rtn = 'year';
		}

		_t = _t===0 ? 1:_t;
		rtn+= _t===1?'':'s';

		return _t+' '+rtn+' ago';
	} else if (type == 'raw') {
		return {
			h: t.getHours()<10?'0'+t.getHours():t.getHours(),
			m: t.getMinutes()<10?'0'+t.getMinutes():t.getMinutes(),
			s: t.getSeconds()<10?'0'+t.getSeconds():t.getSeconds(),
			D: t.getDate()<10?'0'+t.getDate():t.getDate(),
			M: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Oct', 'Dec'][t.getMonth()],
			Y: t.getFullYear()
		};
	} else if (type == 'fill') {
		// Pattern can include 'toggleable' elements
		// e.g. ?h{:}m:s will not replace "h:"
		// if property is '00' and will replace only
		// 'm' and 's'

		function fill(str, data) {
			var _t = {};
			_t['?h'] = data.h+''=='00'? '':data.h;
			_t['?m'] = data.m+''=='00'? '':data.m;
			_t['?s'] = data.s+''=='00'? '':data.s;
			_t['?D'] = data.D+''=='00'? '':data.D;
			_t['?M'] = data.M+''=='00'? '':data.M;
			_t['?Y'] = data.Y+''=='00'? '':data.Y;
			
			if (/\?/.test(str))
				for (;;) {
					var rx = /(\?.){(.)}/;
					if (!rx.test(str))
						break;

					var _r = str.match(rx);
					try {
						str = str.replace(_r[0], _t[_r[1]]+_r[2]);
					} catch(e) {}
				}

			for (var i in data)
				str = str.replace(i, data[i]);

			return str;
		}

		switch(typeof input) {
			case 'object':
				// { pattern: String, time: int }
				return fill(input.pattern, date('raw', t-input.time));
			case 'string':
				// pattern == input
				return fill(input, date('raw', input));
			case 'undefined':
				return null;
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
	if (!(this instanceof arguments.callee))
		throw new Error('Cannot be used as function!');
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

	return this;
};


// Pair background script and popup window
// @requires methods: sendMethod, receiveMethod
//which is platform depended
function messageParser() {
	if (!(this instanceof arguments.callee))
		throw new Error('Cannot be used as function!');

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

	// Expand commands if necessary
	this.bind = function(command, callback) {
		if (!command || !callback)
			return browser.error(new Error('Invalid input, cannot bind!'));

		if (typeof cmds[command] === 'undefined')
			return (cmds[command] = callback);
		else
			return false;
	};

	function message(msg, args, callback) {
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

	return this;
}


// Notification facility
// browser.notification.send(Title, {buttons: [Title: callback], Body, Context}).click(function(event));
// @depends on sendMethod, closeMethod, clickMethod function
// clickMethod can be replaced by two other functions as
//clickBodyMethod, clickButtonMethod and clickCloseMethod
var notificationConstructor = function() {
	function notification(data) {
		this.id = randomID();
		this.title = data.title;
		this.body = data.body;
		this.date = new Date().getTime();
		this.buttons = data.buttons;

		this.click = function(cal) {
			this.callback = cal;
		}.bind(this);
		this.callback = null;

		return this;
	};

	var queue = [];
	var del = function(id) {
		if (id.length !== 20)
			id = queue[id].id;

		queue = queue.filter(function(i,v) {
			return v.id != id;
		});

		return true;
	}.bind(this);

	var send = function(title, data) {
		if (!title) throw new Error('Cannot create notification without a title');
		var d = {};

		// @TODO check settings for restrictions
		// data.type!!

		if (typeof data === 'undefined' && typeof title !== 'undefined') {
			d.body = title;
			d.title = '';
			d.buttons = [];
		} else {
			d.title = title;
			d.body = data.body || '';
			d.buttons = data.buttons || [];
		}

		if (d == {})
			throw new Error('Something went wrong :(');

		var ntf = new notification(d);
		queue.push(ntf);
		this.sendMethod(ntf);

		return ntf;
	}.bind(this);

	var sendCallback = function(id, event) {
		var _t = queue.findBy('id', id);
		if (_t == null)
			throw new Error('Cannot find such notification');

		if (typeof _t.callback === 'function')
			_t.callback({
				type: event,
				target: _t
			});
	};

	this.closed = function(id) {
		this.sendCallback(id, 'closed');
	}.bind(this);

	this.clicked = function(id, button) {
		this.sendCallback(id, button? 'button':'body');
	}.bind(this);

	return this;
};