"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var discrimS = Symbol();
var discrimCacheS = Symbol();

var Cache = (function (_Array) {
	_inherits(Cache, _Array);

	function Cache(discrim, limit) {
		_classCallCheck(this, Cache);

		_Array.call(this);
		this[discrimS] = discrim || "id";
		this[discrimCacheS] = {};
	}

	Cache.prototype.get = function get(key, value) {
		if (key === this[discrimS]) return this[discrimCacheS][value] || null;

		for (var _iterator = this, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
			var _ref;

			if (_isArray) {
				if (_i >= _iterator.length) break;
				_ref = _iterator[_i++];
			} else {
				_i = _iterator.next();
				if (_i.done) break;
				_ref = _i.value;
			}

			var item = _ref;

			if (item[key] == value) {
				return item;
			}
		}
		return null;
	};

	Cache.prototype.has = function has(object) {
		return !!this.get(this[discrimS], object[this[discrimS]]);
	};

	Cache.prototype.getAll = function getAll(key, value) {
		var found = new Cache(this[discrimS]);
		this.forEach(function (val, index, array) {
			if (val.hasOwnProperty(key) && val[key] == value) {
				found.push(val);
				return;
			}
		});
		return found;
	};

	Cache.prototype.add = function add(data) {
		var cacheKey = this[discrimS] === "id" ? data.id : data[this[discrimS]];
		if (this[discrimCacheS][cacheKey]) {
			return this[discrimCacheS][cacheKey];
		}
		if (this.limit && this.length >= this.limit) {
			this.splice(0, 1);
		}
		this.push(data);
		this[discrimCacheS][cacheKey] = data;
		return data;
	};

	Cache.prototype.update = function update(old, data) {
		var item = this.get(this[discrimS], old[this[discrimS]]);
		if (item) {
			var index = this.indexOf(item);
			this[index] = data;
			this[discrimCacheS][data[this[discrimS]]] = this[index];
			return this[index];
		} else {
			return false;
		}
	};

	Cache.prototype.random = function random() {
		return this[Math.floor(Math.random() * this.length)];
	};

	Cache.prototype.remove = function remove(data) {
		delete this[discrimCacheS][data[this[discrimS]]];
		var index = this.indexOf(data);
		if (~index) {
			this.splice(index, 1);
		} else {
			var item = this.get(this[discrimS], data[this[discrimS]]);
			if (item) {
				this.splice(this.indexOf(item), 1);
			}
		}
		return false;
	};

	return Cache;
})(Array);

exports["default"] = Cache;
module.exports = exports["default"];
