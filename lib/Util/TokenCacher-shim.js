"use strict";

Object.defineProperty(exports, "__esModule", {
			value: true
});
// Shim for the token cacher in the browser.
class TokenCacher {
			constructor() {}

			setToken() {}

			save() {}

			getToken() {
						return null;
			}

			init(ind) {
						this.done = true;
			}
}
exports.default = TokenCacher;
//# sourceMappingURL=TokenCacher-shim.js.map
