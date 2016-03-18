module.exports = function CloneObject(obj) {
	var cloned = Object.create(obj);
	Object.assign(cloned, obj);

	return cloned;
};
