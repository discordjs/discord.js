module.exports = function CloneObject(obj) {

	let cloned = Object.create(obj);

	Object.assign(cloned, obj);

	return cloned;

};
