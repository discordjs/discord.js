"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChannelPermissions = require("./ChannelPermissions.js");

var Channel = (function () {
    function Channel(data, server) {
        _classCallCheck(this, Channel);

        this.server = server;
        this.name = data.name;
        this.type = data.type;
        this.topic = data.topic;
        this.id = data.id;
        this.messages = [];
        this.roles = [];

        if (data.permission_overwrites) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = data.permission_overwrites[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var role = _step.value;

                    this.roles.push(new ChannelPermissions(role, this));
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator["return"]) {
                        _iterator["return"]();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        } //this.isPrivate = isPrivate; //not sure about the implementation of this...
    }

    _createClass(Channel, [{
        key: "permissionsOf",
        value: function permissionsOf(member) {

            var mem = this.server.getMember("id", member.id);

            if (mem) {
                return mem.permissionsIn(this);
            } else {
                return null;
            }
        }
    }, {
        key: "equals",
        value: function equals(object) {
            return object && object.id === this.id;
        }
    }, {
        key: "addMessage",
        value: function addMessage(data) {

            if (this.messages.length > 1000) {
                this.messages.splice(0, 1);
            }

            if (!this.getMessage("id", data.id)) {
                this.messages.push(data);
            }

            return this.getMessage("id", data.id);
        }
    }, {
        key: "getMessage",
        value: function getMessage(key, value) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.messages[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var message = _step2.value;

                    if (message[key] === value) {
                        return message;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                        _iterator2["return"]();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return null;
        }
    }, {
        key: "toString",
        value: function toString() {
            return "<#" + this.id + ">";
        }
    }, {
        key: "permissionOverwrites",
        get: function get() {
            return this.roles;
        }
    }, {
        key: "permissions",
        get: function get() {
            return this.roles;
        }
    }, {
        key: "client",
        get: function get() {
            return this.server.client;
        }
    }, {
        key: "isPrivate",
        get: function get() {
            return false;
        }
    }, {
        key: "users",
        get: function get() {
            return this.server.members;
        }
    }, {
        key: "members",
        get: function get() {
            return this.server.members;
        }
    }]);

    return Channel;
})();

module.exports = Channel;