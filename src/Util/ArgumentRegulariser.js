"use strict";

export function reg (c, a) {
	return [c].concat(Array.prototype.slice.call(a));
}
