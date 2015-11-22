"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Cache = (function (_Array) {
	_inherits(Cache, _Array);

	function Cache(discrim, limit) {
		_classCallCheck(this, Cache);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Cache).call(this));

		_this.discrim = discrim || "id";
		return _this;
	}

	_createClass(Cache, [{
		key: "get",
		value: function get(key, value) {
			var found = null;
			this.forEach(function (val, index, array) {
				if (val.hasOwnProperty(key) && val[key] == value) {
					found = val;
					return;
				}
			});
			return found;
		}
	}, {
		key: "has",
		value: function has(key, value) {
			return !!this.get(key, value);
		}
	}, {
		key: "getAll",
		value: function getAll(key, value) {
			var found = new Cache(this.discrim);
			this.forEach(function (val, index, array) {
				if (val.hasOwnProperty(key) && val[key] == value) {
					found.push(val);
					return;
				}
			});
			return found;
		}
	}, {
		key: "add",
		value: function add(data) {
			var exit = false;
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var item = _step.value;

					if (item[this.discrim] === data[this.discrim]) {
						exit = item;
						break;
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

			if (exit) {
				return exit;
			} else {
				if (this.limit && this.length >= this.limit) {
					this.splice(0, 1);
				}
				this.push(data);
				return data;
			}
		}
	}, {
		key: "update",
		value: function update(old, data) {
			var item = this.get(this.discrim, old[this.discrim]);
			if (item) {
				var index = this.indexOf(item);
				this[index] = data;
				return this[index];
			} else {
				return false;
			}
		}
	}, {
		key: "random",
		value: function random() {
			return this[Math.floor(Math.random() * this.length)];
		}
	}, {
		key: "remove",
		value: function remove(data) {
			var index = this.indexOf(data);
			if (~index) {
				this.splice(index, 1);
			} else {
				var item = this.get(this.discrim, data[this.discrim]);
				if (item) {
					this.splice(this.indexOf(item), 1);
				}
			}
			return false;
		}
	}]);

	return Cache;
})(Array);

module.exports = Cache;