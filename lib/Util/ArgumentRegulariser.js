"use strict";

exports.reg = function (c, a) {
	return [c].concat(Array.prototype.slice.call(a));
};