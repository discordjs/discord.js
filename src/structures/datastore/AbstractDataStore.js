'use strict';

class AbstractDataStore{
	constructor() {
		this.data = {};
	}

	register(name) {
		this.data[name] = {};
	}

	add(location, object) {
		if (this.data[location][object.id]) {
			return this.data[location][object.id];
		} else {
			return this.data[location][object.id] = object;
		}
	}

	clear(location) {
		this.data[location] = {};
	}

	remove(location, object) {
		let id = (typeof object === 'string' || object instanceof String) ? object : object.id;
		if (this.data[location][id]) {
			delete this.data[location][id];
			return true;
		} else {
			return false;
		}
	}

	get(location, value) {
		return this.data[location][value];
	}

	getAsArray(location) {
		return Object.values(this.data[location]);
	}
}

module.exports = AbstractDataStore;
