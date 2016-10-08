// Generates random key, e.g.
//AbCDeFGh-1234-IjKLmNop
var generateGuid = function () {
    // 48-90 and 97-122
    var i = Math.floor((Math.random() * 122) + 48);
    var j = Math.floor((Math.random() * 122) + 48);
    var k = Math.floor((Math.random() * 122) + 48);
    var normalize = function (val, isSingleChar) {
        if (isSingleChar === void 0) { isSingleChar = false; }
        if (val >= 91 && val <= 96) {
            var t = Math.random() * 50 - 50;
            if (t < 0)
                val = 90 + t;
            else
                val = 97 + t;
        }
        else if (val > 122)
            val = 122 - (Math.random() * 74);
        else if (val < 48)
            val = 48 + (Math.random() * 74);
        if (isSingleChar) {
            var tmp = Math.round(val);
            return Number((tmp + '')[(tmp + '').length - 1]);
        }
        else
            return Math.round(val);
    };
    var toChar = function (code) {
        return String.fromCharCode(code);
    };
    return toChar(normalize(i + j - 48)) +
        toChar(normalize(j / i)) +
        toChar(normalize((i % j) * 100)) +
        toChar(normalize(i / 2)) +
        toChar(normalize(i * 5)) +
        toChar(normalize(j + 15)) +
        toChar(normalize(j - 4)) +
        toChar(normalize(i - j + 100)) +
        '-' +
        normalize(i / 5, true) +
        normalize(i + j, true) +
        normalize(k - 4, true) +
        normalize(j / k, true) +
        '-' +
        toChar(normalize(k * j - 14884)) +
        toChar(normalize(122 - k)) +
        toChar(normalize(122 - j)) +
        toChar(normalize(k % 2)) +
        toChar(normalize(j % 10)) +
        toChar(normalize(k >> 1)) +
        toChar(normalize(j >> 4)) +
        toChar(normalize(k ^ 2 - 14884));
};
var FindByResult = (function () {
    function FindByResult(index, object, error) {
        this.index = index;
        this.object = object;
        this.error = error || false;
    }
    return FindByResult;
}());
var Holder = (function () {
    function Holder(id, options) {
        var _this = this;
        this.getData = function () { return _this.data; };
        this.get = function (id, item) {
            if (item != null)
                return _this.data[id][item];
            return _this.data[id];
        };
        this.set = function (id, value) {
            if (_this.data[id] === undefined) {
                var item = _this.findBy('id', id);
                if (item.error)
                    return false;
                id = String(item.index);
            }
            _this.data[id] = value;
            return true;
        };
        this.del = function (id) {
            if (_this.data[id] === undefined) {
                var item = _this.findBy('id', id);
                if (item.error)
                    return false;
                id = String(item.index);
            }
            var temp = _this.data[id];
            delete _this.data[id];
            if (_this.options.onRemove != null)
                _this.options.onRemove(temp);
            if (_this.options.onChange != null)
                _this.options.onChange(temp);
            return true;
        };
        this.push = function (value) {
            if (_this.options.beforeAdd != null)
                value = _this.options.beforeAdd(value);
            _this.data.push(value);
            if (_this.options.onAdd != null)
                _this.options.onAdd(value);
            if (_this.options.onChange != null)
                _this.options.onChange(value);
        };
        this.length = function () {
            if (_this.data.length !== undefined)
                return _this.data.length;
            var length = 0;
            for (var itm in _this.data)
                if (_this.data.hasOwnProperty(itm))
                    length++;
            return length;
        };
        this.findBy = function (property, should) {
            for (var itm in _this.data) {
                if (!_this.data.hasOwnProperty(itm))
                    continue;
                if (_this.data[itm][property] === should)
                    return new FindByResult(itm, _this.data[itm]);
            }
            return new FindByResult(null, null, true);
        };
        this.save = function () {
            var data = _this.data;
            if (_this.options.beforeSave != null)
                data = _this.options.beforeSave(data);
            var stringified = null;
            try {
                stringified = JSON.stringify(data);
            }
            catch (ex) {
            }
            if (stringified == null)
                return false;
            return (localStorage[_this.id] = stringified);
        };
        this.reset = function () {
            if (_this.options.fallback == null) {
                //TODO: Can not reset storage, fallback value is not presented
                return false;
            }
            _this.data = _this.options.fallback;
            return true;
        };
        if (options != null && options.isLocal)
            return;
        try {
            this.data = localStorage[id];
        }
        catch (ex) {
            if (options != null)
                localStorage[id] = options.fallback;
            this.data = [];
        }
    }
    return Holder;
}());
//# sourceMappingURL=functions.js.map