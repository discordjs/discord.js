"use strict";

class Cache extends Array {
	constructor(discrim, limit) {
		super();
		this.discrim = discrim || "id";
	}

	get(key, value) {
		var found = null;
		this.forEach((val, index, array) => {
			if (val.hasOwnProperty(key) && val[key] == value) {
				found = val;
				return;
			}
		});
		return found;
	}

	has(key, value) {
		return !!this.get(key, value);
	}

	getAll(key, value) {
		var found = new Cache(this.discrim);
		this.forEach((val, index, array) => {
			if (val.hasOwnProperty(key) && val[key] == value) {
				found.push(val);
				return;
			}
		});
		return found;
	}

	add(data) {
		var exit = false;
		for (var item of this) {
			if (item[this.discrim] === data[this.discrim]) {
				exit = item;
				break;
			}
		}
		if (exit) {
			return exit;
		} else {
			if (this.limit && this.length >= this.limit) {
				this.splice(0, 1);
			}
			this.push(data);
			return data;
		}
	}

	update(old, data) {
		var item = this.get(this.discrim, old[this.discrim]);
		if (item) {
			var index = this.indexOf(item);
			this[index] = data;
			return this[index];
		} else {
			return false;
		}
	}

	remove(data) {
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
	}
}

module.exports = Cache;