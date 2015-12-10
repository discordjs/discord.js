"use strict";

export default class Cache extends Array {
	constructor(discrim, limit) {
		super();
		this.discrim = discrim || "id";
		this.discrimCache = {};
	}

	get(key, value) {
		if (key === this.discrim)
			return this.discrimCache[value] || null;

		var l = this.length;
		for (var i = 0; i < l; i++)
			if (this[i][key] == value)
				return this[i];
		return null;
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
	}

	update(old, data) {
		var item = this.get(this.discrim, old[this.discrim]);
		if (item) {
			var index = this.indexOf(item);
			this[index] = data;
			this.discrimCache[data[this.discrim]] = data;
			return this[index];
		} else {
			return false;
		}
	}

	random() {
		return this[Math.floor(Math.random()*this.length)];
	}

	remove(data) {
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
	}
}
