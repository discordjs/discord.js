"use strict";

var discrimS = Symbol();
var discrimCacheS = Symbol();

export default class Cache extends Array {
	constructor(discrim, limit) {
		super();
		this[discrimS] = discrim || "id";
		this[discrimCacheS] = {};
	}

	get(key, value) {
		if (key === this[discrimS])
			return this[discrimCacheS][value] || null;

		var l = this.length;
		for (var i = 0; i < l; i++)
			if (this[i][key] == value)
				return this[i];
		return null;
	}

	has(object) {
		return !!this.get(this[discrimS], object[this[discrimS]]);
	}

	getAll(key, value) {
		var found = new Cache(this[discrimS]);
		this.forEach((val, index, array) => {
			if (val.hasOwnProperty(key) && val[key] == value) {
				found.push(val);
				return;
			}
		});
		return found;
	}

	add(data) {
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
	}

	update(old, data) {
		var item = this.get(this[discrimS], old[this[discrimS]]);
		if (item) {
			var index = this.indexOf(item);
			this[index] = data;
			this[discrimCacheS][data[this[discrimS]]] = this[index];
			return this[index];
		} else {
			return false;
		}
	}

	random() {
		return this[Math.floor(Math.random()*this.length)];
	}

	remove(data) {
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
	}
}
