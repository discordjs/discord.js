module.exports = function merge(def, given) {
	if (!given) {
		return def;
	}

	given = given || {};

	for (let key in def) {
		if (!given.hasOwnProperty(key)) {
			given[key] = def[key];
		} else if (given[key] === Object(given[key])) {
			given[key] = merge(def[key], given[key]);
		}
	}

	return given;
};
