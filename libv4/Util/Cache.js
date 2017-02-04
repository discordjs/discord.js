"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var discrimS = Symbol();
var discrimCacheS = Symbol();

var Cache = function (_Array) {
	_inherits(Cache, _Array);

	function Cache(discrim, limit) {
		_classCallCheck(this, Cache);

		var _this = _possibleConstructorReturn(this, (Cache.__proto__ || Object.getPrototypeOf(Cache)).call(this));

		_this[discrimS] = discrim || "id";
		_this[discrimCacheS] = {};
		_this.limit = limit;
		return _this;
	}

	_createClass(Cache, [{
		key: "get",
		value: function get(key, value) {
			if (typeof key === 'function') {
				var valid = key;
				key = null;
			} else if (key && !value) {
				return this[discrimCacheS][key] || null;
			} else if (key === this[discrimS] && typeof value === "string") {
				return this[discrimCacheS][value] || null;
			} else if (value && value.constructor.name === 'RegExp') {
				var valid = function valid(item) {
					return value.test(item);
				};
			} else if (typeof value !== 'function') {
				var valid = function valid(item) {
					return item == value;
				};
			}

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var item = _step.value;

					if (valid(key == null ? item : item[key])) {
						return item;
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return null;
		}
	}, {
		key: "has",
		value: function has(key, value) {
			return !!this.get(key, value);
		}
	}, {
		key: "getAll",
		value: function getAll(key, value) {
			var found = new Cache(this[discrimS]);

			if (typeof key === 'function') {
				var valid = key;
				key = null;
			} else if (value && value.constructor.name === 'RegExp') {
				var valid = function valid(item) {
					return value.test(item);
				};
			} else if (typeof value !== 'function') {
				var valid = function valid(item) {
					return item == value;
				};
			}

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var item = _step2.value;

					if (valid(key == null ? item : item[key])) {
						found.add(item);
					}
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			return found;
		}
	}, {
		key: "add",
		value: function add(data) {
			var cacheKey = data[this[discrimS]];
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
	}, {
		key: "update",
		value: function update(old, data) {
			var obj = this[discrimCacheS][old[this[discrimS]]];
			if (obj) {
				for (var key in data) {
					if (data.hasOwnProperty(key)) {
						obj[key] = data[key];
					}
				}
				return obj;
			}
			return false;
		}
	}, {
		key: "random",
		value: function random() {
			return this[Math.floor(Math.random() * this.length)];
		}
	}, {
		key: "remove",
		value: function remove(data) {
			if (!this[discrimCacheS][data[this[discrimS]]]) return false;

			delete this[discrimCacheS][data[this[discrimS]]];
			for (var i in this) {
				if (this[i] && this[i][this[discrimS]] === data[this[discrimS]]) {
					this.splice(i, 1);
					return true;
				}
			}
			return false;
		}
	}]);

	return Cache;
}(Array);

exports.default = Cache;
//# sourceMappingURL=Cache.js.map
