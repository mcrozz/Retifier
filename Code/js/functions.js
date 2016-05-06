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
	function c(val,just) {
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
	function s(i) {
		return String.fromCharCode(i);
	}
	
	return s(c(i+j-48))+
		s(c(j/i))+
		s(c((i%j)*100))+
		s(c(i/2))+
		s(c(i*5))+
		s(c(j+15))+
		s(c(j-4))+
		s(c(i-j+100))+
		'-'+
		c(i/5,1)+
		c(i+j,1)+
		c(z-4,1)+
		c(j/z,1)+
		'-'+
		s(c(z*j-14884))+
		s(c(122-z))+
		s(c(122-j))+
		s(c(z%2))+
		s(c(j%10))+
		s(c(z>>1))+
		s(c(j>>4))+
		s(c(z^2-14884));
}

// Storage unit
// @input
//   id as String, used as localStorage name
// :options
//   fallback: any object, used if localStorage[id]
//     is undefined.
//   local: boolean, if true disable saving to the
//     localStorage
//   onchange(changed object): callback on change
//   onremove(removed object): callback on remove
//   onadd(added object): callback on adding
function storage(id, options) {
	if (!(this instanceof arguments.callee))
		throw new Error('Cannot be used as function!');
	var data = null;
	var id = id;
	var options = options? options:{};

	if (options.local) { data = id; id = null; }
	
	this.get = function(id, sec) {
		if (typeof data.length === 'undefined') {
			if (typeof sec !== 'undefined')
				return data[id][sec];
			else
				return data[id];
		} else
			return id? data[id] : data;
	};
	this.set = function(id, val, sec) {
		if (typeof data.length === 'undefined') {
			if (typeof sec !== 'undefined')
				data[id][val] = sec;
			else
				data[id] = val;

			return data[id];
		}

		if (isNaN(id))
			id = this.findBy('id', id);

		if (!id) return false;
		id = id.i;

		if (typeof data[id] == 'undefined')
			return false;

		if (typeof sec == 'undefined') {
			data[id] = val;

			if (typeof options.onchange === 'function')
				options.onchange(data[id]);
			
			return data[id];
		}	else if (typeof data[id][val] != 'undefined') {
			data[id][val] = sec;

			if (typeof options.onchange === 'function')
				options.onchange(data[id][val]);

			return data[id];
		}

		return false;
	};
	this.del = function(id, by) {
		if (typeof data.length === 'undefined') {

			return true;
		}

		var f = id;
		var o = null;
		if (typeof by !== 'undefined')
			f = this.findBy(id, by).i;
		o = data[f];

		data = data.filter(function(i,v) {
			return f !== i;
		});

		if (typeof options.onchange === 'function')
			options.onchange(o);

		if (typeof options.onremove === 'function')
			options.onremove(o);

		return true;
	};
	this.push = function(d) {
		if (typeof data.length === 'undefined')
			return browser.error(new Error('Invalid type of storage'));

		data.push(d);

		if (typeof options.onchange === 'function')
			options.onchange(d);

		if (typeof options.onadd === 'function')
			options.onadd(d);
	};
	this.length = function() {
		return data.length;
	};
	// @Dependend on Array.prototype.findBy
	this.findBy = function(par, equ) {
		return data.findBy(par, equ);
	};
	this.isSet = function(par, equ) {
		if (typeof data.length === 'number') {
			for (var i in data) {
				if (typeof equ !== 'undefined') {
					if (data[i][par] === 'undefined')
						return false;
					return typeof data[i][par][equ] !== 'undefined';
				}

				return typeof data[i][par] !== 'undefined';
			}
		} else {
			if (typeof equ !== 'undefined') {
				if (data[par] === 'undefined')
						return false;
				return typeof data[par][equ] !== 'undefined';
			}

			return typeof data[par] !== 'undefined';
		}
	};

	if (options.local) return this;

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
	this.reset = function() {
		if (typeof options === 'undefined') {
			browser.error(new Error('Cannot reset storage'));
			return null;
		}

		return (data = options);
	};

	try {
		data = JSON.parse(localStorage[id]);
	} catch(e) {
		localStorage[id] = options.fallback;
	}

	return this;
}


// Date function (type, input, arg)
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
//     diffRaw: optional @input arg as timestamp
//       returns similar object as in 'raw' type
//     fill: @requires input as String
//       optional: arg as int for time difference
//   input: @required if type is smart
//     or type is fill and used as difference
//   arg: optional
function date(type, input, arg) {
	if (!type) return new Date().getTime();
	var t = new Date();

	function fill(str, data) {
		var _t = {
			'?h': data.h+''=='00'? '':data.h,
			'?m': data.m+''=='00'? '':data.m,
			'?s': data.s+''=='00'? '':data.s,
			'?D': data.D+''=='00'? '':data.D,
			'?M': data.M+''=='00'? '':data.M,
			'?Y': data.Y+''=='00'? '':data.Y
		};
		
		if (/\?/.test(str))
			for (;;) {
				var rx = /(\?.){(.)}/;
				if (!rx.test(str))
					break;

				var _r = str.match(rx);
				_t = {
					'?h': data.h+''=='00'? '':data.h,
					'?m': data.m+''=='00'? '':data.m,
					'?s': data.s+''=='00'? '':data.s,
					'?D': data.D+''=='00'? '':data.D,
					'?M': data.M+''=='00'? '':data.M,
					'?Y': data.Y+''=='00'? '':data.Y
				};
				try {
					if (_t[_r[1]] !== '') _t[_r[1]]+= _r[2];
					str = str.replace(_r[0], _t[_r[1]]);
				} catch(e) {}
			}

		for (var i in data)
			str = str.replace(i, data[i]);

		return str;
	}
	function normalize(str, lt) {
		if (lt)
			return Number(str)<lt?'0'+str:str;
		else
			return str+''.length===0?'0'+str:str;
	}

	if (type == 'smart' && !isNaN(input)) {
		var dif = t.getTime()-input;
		var rtn = '';
		var _t = -1;
		
		if (dif/3600000 < 1) { // Less than a hour
			_t = Math.round(dif/60000);
			rtn = 'minute';
		} else if (dif/(86400000) < 1) { // Less than a day
			_t = Math.round(dif/3600000);
			rtn = 'hour'; 
		} else if (dif/31536000000 < 1) { // Less than a year
			_t = Math.round(dif/86400000);
			rtn = 'day';
		} else {
			_t = Math.round(dif/31536000000);
			rtn = 'year';
		}

		_t = _t===0 ? 1:_t;
		if (arg)
			return _t+rtn[0];
		
		rtn+= _t===1?'':'s';
		
		return _t+' '+rtn;
	} else if (type == 'raw') {
		return {
			h: normalize(t.getHours(), 10),
			m: normalize(t.getMinutes(), 10),
			s: normalize(t.getSeconds(), 10),
			D: normalize(t.getDate(), 10),
			M: arg?t.getMonth():['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Oct', 'Dec'][t.getMonth()],
			Y: t.getFullYear()
		};
	} else if (type == 'diffRaw') {
		var diff = !isNaN(input)? t.getTime()-input : t.getTime();
		var r = {};

		// Years
		r.Y = Math.floor(diff/31536000000);
		diff-= r.Y*31536000000;

		// Days
		r.D = Math.floor(diff/86400000);
		diff-= r.D*86400000;

		// Hours
		r.h = Math.floor(diff/3600000);
		diff-= r.h*3600000;

		// Minutes
		r.m = Math.floor(diff/60000);
		diff-= r.m*60000;

		// Seconds
		r.s = Math.floor(diff/1000);

		for (var h in r)
			r[h] = normalize(r[h], 10);

		return r;
	} else if (type == 'fill') {
		// Pattern can include 'toggleable' elements
		// e.g. ?h{:}m:s will not replace "h:"
		// if property is '00' and will replace only
		// 'm' and 's'

		// pattern : String input
		// *arg : int Timestamp
		if (!isNaN(arg))
			return fill(input, date('diffRaw', arg));

		return fill(input, date('raw', input));
	}
	return false;
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

	var queue = new storage([], {local: true});

	var send = function(title, data) {
		if (!title)
			throw new Error('Cannot create notification without a title');
		var d = {};

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

		var NotificationType = {
			online: 0,
			offline: 3,
			changed: 1,
			hosting: 2
		};

		// Accept users settings 
		if (!window.settings.notification[d.type])
			return;

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

	this.send = function(title, data) {
		send(title, data);
	};

	this.closed = function(id) {
		this.sendCallback(id, 'closed');
	}.bind(this);

	this.clicked = function(id, button) {
		this.sendCallback(id, button? 'button':'body');
	}.bind(this);

	this.type = {
		wentOnline: 0,
		changedTitle: 1,
		incomingHosting: 2,
		wentOffline: 3
	};

	return this;
};