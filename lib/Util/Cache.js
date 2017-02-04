"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var discrimS = Symbol();
var discrimCacheS = Symbol();

class Cache extends Array {
	constructor(discrim, limit) {
		super();
		this[discrimS] = discrim || "id";
		this[discrimCacheS] = {};
		this.limit = limit;
	}

	get(key, value) {
		if (typeof key === 'function') {
			var valid = key;
			key = null;
		} else if (key && !value) {
			return this[discrimCacheS][key] || null;
		} else if (key === this[discrimS] && typeof value === "string") {
			return this[discrimCacheS][value] || null;
		} else if (value && value.constructor.name === 'RegExp') {
			var valid = function valid(item) {
				return value.test(item);
			};
		} else if (typeof value !== 'function') {
			var valid = function valid(item) {
				return item == value;
			};
		}

		for (var item of this) {
			if (valid(key == null ? item : item[key])) {
				return item;
			}
		}

		return null;
	}

	has(key, value) {
		return !!this.get(key, value);
	}

	getAll(key, value) {
		var found = new Cache(this[discrimS]);

		if (typeof key === 'function') {
			var valid = key;
			key = null;
		} else if (value && value.constructor.name === 'RegExp') {
			var valid = function valid(item) {
				return value.test(item);
			};
		} else if (typeof value !== 'function') {
			var valid = function valid(item) {
				return item == value;
			};
		}

		for (var item of this) {
			if (valid(key == null ? item : item[key])) {
				found.add(item);
			}
		}

		return found;
	}

	add(data) {
		var cacheKey = data[this[discrimS]];
		if (this[discrimCacheS][cacheKey]) {
			return this[discrimCacheS][cacheKey];
		}
		if (this.limit && this.length >= this.limit) {
			this.splice(0, 1);
		}
		this.push(data);
		this[discrimCacheS][cacheKey] = data;
		return data;
	}

	update(old, data) {
		var obj = this[discrimCacheS][old[this[discrimS]]];
		if (obj) {
			for (var key in data) {
				if (data.hasOwnProperty(key)) {
					obj[key] = data[key];
				}
			}
			return obj;
		}
		return false;
	}

	random() {
		return this[Math.floor(Math.random() * this.length)];
	}

	remove(data) {
		if (!this[discrimCacheS][data[this[discrimS]]]) return false;

		delete this[discrimCacheS][data[this[discrimS]]];
		for (var i in this) {
			if (this[i] && this[i][this[discrimS]] === data[this[discrimS]]) {
				this.splice(i, 1);
				return true;
			}
		}
		return false;
	}
}
exports.default = Cache;
//# sourceMappingURL=Cache.js.map
