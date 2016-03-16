const Constants = require('./Constants');

class DataStore{
	constructor() {

	}

	remove(where, object) {
		where = '_' + where;
		let id;
		if (typeof object === 'string' || object instanceof String) {
			id = object;
		} else {
			id = object.id;
		}

		if (this[where][id]) {
			delete this[where][id];
			return true;
		} else {
			return false;
		}
	}

	has(where, object) {
		where = '_' + where;
		if (typeof object === 'string' || object instanceof String) {
			return this[where][object];
		} else {
			return this[where][object.id];
		}
	}

	get(where, key, value) {
		where = '_' + where;
		if (key === 'id') {
			return this[where][value];
		}

		for (var item of Object.entries(this[where])) {
			if (item[key] === value) {
				return item[key];
			}
		}

		return null;
	}

	add(where, object) {
		where = '_' + where;
		if (this[where][object.id]) {
			return this[where][object.id];
		} else {
			return this[where][object.id] = object;
		}
	}
}

module.exports = DataStore;
