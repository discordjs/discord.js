"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Cache = (function (_Array) {
	_inherits(Cache, _Array);

	function Cache(discrim, limit) {
		_classCallCheck(this, Cache);

		_Array.call(this);
		this.discrim = discrim || "id";
		this.discrimCache = {};
	}

	Cache.prototype.get = function get(key, value) {
		if (key === this.discrim) return this.discrimCache[value] || null;

		var l = this.length;
		for (var i = 0; i < l; i++) if (this[i][key] == value) return this[i];
		return null;
	};

	Cache.prototype.has = function has(object) {
		return !!this.get(this.discrim, object[this.discrim]);
	};

	Cache.prototype.getAll = function getAll(key, value) {
		var found = new Cache(this.discrim);
		this.forEach(function (val, index, array) {
			if (val.hasOwnProperty(key) && val[key] == value) {
				found.push(val);
				return;
			}
		});
		return found;
	};

	Cache.prototype.add = function add(data) {
		var cacheKey = this.discrim === "id" ? data.id : data[this.discrim];
		if (this.discrimCache[cacheKey]) {
			return this.discrimCache[cacheKey];
		}
		if (this.limit && this.length >= this.limit) {
			this.splice(0, 1);
		}
		this.push(data);
		this.discrimCache[cacheKey] = data;
		return data;
	};

	Cache.prototype.update = function update(old, data) {
		var item = this.get(this.discrim, old[this.discrim]);
		if (item) {
			var index = this.indexOf(item);
			this[index] = data;
			this.discrimCache[data[this.discrim]] = data;
			return this[index];
		} else {
			return false;
		}
	};

	Cache.prototype.random = function random() {
		return this[Math.floor(Math.random() * this.length)];
	};

	Cache.prototype.remove = function remove(data) {
		delete this.discrimCache[data[this.discrim]];
		var index = this.indexOf(data);
		if (~index) {
			this.splice(index, 1);
		} else {
			var item = this.get(this.discrim, data[this.discrim]);
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
