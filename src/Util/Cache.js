"use strict";

export default class Cache extends Array {
	constructor(discrim, limit) {
		super();
		this.discrim = discrim || "id";
		this.discrimCache = [];
		this.highPerformance = false;
	}

	setHighPerformance() {
		this.highPerformance = true;
	}

	setNormalPerformance() {
		this.discrimCache = [];
		this.highPerformance = false;
	}

	get(key, value) {
		var found = null;
		this.forEach((val, index, array) => {
			if (val[key] == value) {
				found = val;
				return;
			}
		});
		return found;
	}

	has(object) {
		return !!this.get(this.discrim, object[this.discrim]);
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
		exit = ~this.discrimCache.indexOf(data[this.discrim]);
		if (exit) {
			return data;
		} else {
			if (this.limit && this.length >= this.limit) {
				this.splice(0, 1);
			}
			this.push(data);
			this.discrimCache.push(data[this.discrim]);
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

	random() {
		return this[Math.floor(Math.random()*this.length)];
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
