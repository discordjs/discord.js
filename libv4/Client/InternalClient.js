"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _superagent = require("superagent");

var _superagent2 = _interopRequireDefault(_superagent);

var _ws = require("ws");

var _ws2 = _interopRequireDefault(_ws);

var _ConnectionState = require("./ConnectionState");

var _ConnectionState2 = _interopRequireDefault(_ConnectionState);

var _querystring = require("querystring");

var _querystring2 = _interopRequireDefault(_querystring);

var _Constants = require("../Constants");

var _Bucket = require("../Util/Bucket");

var _Bucket2 = _interopRequireDefault(_Bucket);

var _Cache = require("../Util/Cache");

var _Cache2 = _interopRequireDefault(_Cache);

var _Resolver = require("./Resolver/Resolver");

var _Resolver2 = _interopRequireDefault(_Resolver);

var _User = require("../Structures/User");

var _User2 = _interopRequireDefault(_User);

var _Channel = require("../Structures/Channel");

var _Channel2 = _interopRequireDefault(_Channel);

var _ServerChannel = require("../Structures/ServerChannel");

var _ServerChannel2 = _interopRequireDefault(_ServerChannel);

var _TextChannel = require("../Structures/TextChannel");

var _TextChannel2 = _interopRequireDefault(_TextChannel);

var _VoiceChannel = require("../Structures/VoiceChannel");

var _VoiceChannel2 = _interopRequireDefault(_VoiceChannel);

var _PMChannel = require("../Structures/PMChannel");

var _PMChannel2 = _interopRequireDefault(_PMChannel);

var _Server = require("../Structures/Server");

var _Server2 = _interopRequireDefault(_Server);

var _Message = require("../Structures/Message");

var _Message2 = _interopRequireDefault(_Message);

var _Role = require("../Structures/Role");

var _Role2 = _interopRequireDefault(_Role);

var _Invite = require("../Structures/Invite");

var _Invite2 = _interopRequireDefault(_Invite);

var _Webhook = require("../Structures/Webhook");

var _Webhook2 = _interopRequireDefault(_Webhook);

var _VoiceConnection = require("../Voice/VoiceConnection");

var _VoiceConnection2 = _interopRequireDefault(_VoiceConnection);

var _TokenCacher = require("../Util/TokenCacher");

var _TokenCacher2 = _interopRequireDefault(_TokenCacher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GATEWAY_VERSION = 6;
var zlib = void 0;
// let libVersion = require('../../package.json').version;

function waitFor(condition) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : condition;
  var interval = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;

  return new Promise(function (resolve) {
    var int = setInterval(function () {
      var isDone = condition();
      if (isDone) {
        if (condition === value) {
          resolve(isDone);
        } else {
          resolve(value(isDone));
        }
        return clearInterval(int);
      }
    }, interval);
  });
}

function delay(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}

var InternalClient = function () {
  function InternalClient(discordClient) {
    _classCallCheck(this, InternalClient);

    this.setupCalled = false;
    this.setup(discordClient);
  }

  _createClass(InternalClient, [{
    key: "apiRequest",
    value: function apiRequest(method, url, useAuth, data, file) {
      var resolve = void 0,
          reject = void 0;
      var promise = new Promise(function (res, rej) {
        resolve = res;
        reject = rej;
      });
      var buckets = [];
      var match = url.match(/\/channels\/([0-9]+)\/messages(\/[0-9]+)?$/);
      if (match) {
        if (method === "del" && (match[1] = this.channels.get("id", match[1]) || this.private_channels.get("id", match[1]))) {
          buckets = ["dmsg:" + (match[1].server || {}).id];
        } else if (this.user.bot) {
          if (method === "post" || method === "patch") {
            if (this.private_channels.get("id", match[1])) {
              buckets = ["bot:msg:dm", "bot:msg:global"];
            } else if (match[1] = this.channels.get("id", match[1])) {
              buckets = ["bot:msg:guild:" + match[1].server.id, "bot:msg:global"];
            }
          }
        } else {
          buckets = ["msg"];
        }
      } else if (method === "patch") {
        if (url === "/users/@me" && this.user && data.username && data.username !== this.user.username) {
          buckets = ["username"];
        } else if (match = url.match(/\/guilds\/([0-9]+)\/members\/[0-9]+$/)) {
          buckets = ["guild_member:" + match[1]];
        } else if (match = url.match(/\/guilds\/([0-9]+)\/members\/@me\/nick$/)) {
          buckets = ["guild_member_nick:" + match[1]];
        }
      }

      var self = this;

      var actualCall = function actualCall() {
        var startTime = Date.now();
        var ret = _superagent2.default[method](url);
        if (useAuth) {
          ret.set("authorization", self.token);
        }
        if (file) {
          ret.attach("file", file.file, file.name);
          if (data) {
            for (var _i in data) {
              if (data.hasOwnProperty(_i)) {
                if (data[_i] !== undefined) {
                  ret.field(_i, data[_i]);
                }
              }
            }
          }
        } else if (data) {
          ret.send(data);
        }
        ret.set('User-Agent', self.userAgentInfo.full);
        ret.end(function (error, data) {
          if (error) {
            if (data && data.status === 429) {
              self.client.emit("debug", "Encountered 429 at " + url + " | " + self.client.options.shard + " | Buckets" + buckets + " | " + (Date.now() - startTime) + "ms latency");
            }
            reject(error);
          } else {
            resolve(data.body);
          }
        });
      };
      var waitFor = 1;
      var i = 0;
      var done = function done() {
        if (++i === waitFor) {
          actualCall();
        }
      };
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = buckets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var bucket = _step.value;

          ++waitFor;
          this.buckets[bucket].queue(done);
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

      done();
      return promise;
    }
  }, {
    key: "setup",
    value: function setup(discordClient) {
      this.setupCalled = true;
      discordClient = discordClient || this.client;
      this.client = discordClient;
      this.state = _ConnectionState2.default.IDLE;
      this.websocket = null;
      this.userAgent = {
        url: 'https://github.com/hydrabolt/discord.js',
        version: require('../../package.json').version
      };

      if (this.client.options.compress) {
        zlib = require("zlib");
      }

      // creates 4 caches with discriminators based on ID
      this.users = new _Cache2.default();
      this.friends = new _Cache2.default();
      this.blocked_users = new _Cache2.default();
      this.outgoing_friend_requests = new _Cache2.default();
      this.incoming_friend_requests = new _Cache2.default();
      this.channels = new _Cache2.default();
      this.servers = new _Cache2.default();
      this.unavailableServers = new _Cache2.default();
      this.private_channels = new _Cache2.default();
      this.autoReconnectInterval = 1000;
      this.unsyncedGuilds = 0;
      this.guildSyncQueue = [];
      this.guildSyncQueueLength = 1;

      this.intervals = {
        typing: [],
        kai: null,
        misc: []
      };

      this.voiceConnections = new _Cache2.default();
      this.resolver = new _Resolver2.default(this);
      this.readyTime = null;
      this.messageAwaits = {};
      this.buckets = {
        "bot:msg:dm": new _Bucket2.default(5, 5000),
        "bot:msg:global": new _Bucket2.default(50, 10000),
        "msg": new _Bucket2.default(10, 10000),
        "dmsg:undefined": new _Bucket2.default(5, 1000),
        "username": new _Bucket2.default(2, 3600000)
      };

      if (!this.tokenCacher) {
        this.tokenCacher = new _TokenCacher2.default(this.client);
        this.tokenCacher.init(0);
      }
    }
  }, {
    key: "cleanIntervals",
    value: function cleanIntervals() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.intervals.typing.concat(this.intervals.misc).concat(this.intervals.kai)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var interval = _step2.value;

          if (interval) {
            clearInterval(interval);
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
    }
  }, {
    key: "disconnected",
    value: function disconnected() {
      var _this = this;

      var autoReconnect = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;


      this.cleanIntervals();

      this.voiceConnections.forEach(function (vc) {
        _this.leaveVoiceChannel(vc);
      });

      if (autoReconnect) {
        this.autoReconnectInterval = Math.min(this.autoReconnectInterval * (Math.random() + 1), 60000);
        setTimeout(function () {
          if (!_this.email && !_this.token) {
            return;
          }

          // Check whether the email is set (if not, only a token has been used for login)
          _this.loginWithToken(_this.token, _this.email, _this.password).catch(function () {
            return _this.disconnected(true);
          });
        }, this.autoReconnectInterval);
      }

      this.client.emit("disconnected");
    }
  }, {
    key: "leaveVoiceChannel",


    //def leaveVoiceChannel
    value: function leaveVoiceChannel(chann) {
      var _this2 = this;

      if (this.user.bot) {
        var _ret = function () {
          var leave = function leave(connection) {
            return new Promise(function (resolve) {
              connection.destroy();
              resolve();
            });
          };

          if (chann instanceof _VoiceChannel2.default) {
            return {
              v: _this2.resolver.resolveChannel(chann).then(function (channel) {
                if (!channel) {
                  return Promise.reject(new Error("voice channel does not exist"));
                }

                if (channel.type !== 2) {
                  return Promise.reject(new Error("channel is not a voice channel!"));
                }

                var connection = _this2.voiceConnections.get("voiceChannel", channel);
                if (!connection) {
                  return Promise.reject(new Error("not connected to that voice channel"));
                }
                return leave(connection);
              })
            };
          } else if (chann instanceof _VoiceConnection2.default) {
            return {
              v: leave(chann)
            };
          } else {
            return {
              v: Promise.reject(new Error("invalid voice channel/connection to leave"))
            };
          }
        }();

        if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
      } else {
        // preserve old functionality for non-bots
        if (this.voiceConnections[0]) {
          this.voiceConnections[0].destroy();
        }
        return Promise.resolve();
      }
    }

    //def awaitResponse

  }, {
    key: "awaitResponse",
    value: function awaitResponse(msg) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {

        msg = _this3.resolver.resolveMessage(msg);

        if (!msg) {
          reject(new Error("message undefined"));
          return;
        }

        var awaitID = msg.channel.id + msg.author.id;

        if (!_this3.messageAwaits[awaitID]) {
          _this3.messageAwaits[awaitID] = [];
        }

        _this3.messageAwaits[awaitID].push(resolve);
      });
    }

    //def joinVoiceChannel

  }, {
    key: "joinVoiceChannel",
    value: function joinVoiceChannel(chann) {
      var _this4 = this;

      return this.resolver.resolveChannel(chann).then(function (channel) {
        if (!channel) {
          return Promise.reject(new Error("voice channel does not exist"));
        }

        if (channel.type !== 2) {
          return Promise.reject(new Error("channel is not a voice channel!"));
        }

        var joinSendWS = function joinSendWS() {
          _this4.sendWS({
            op: 4,
            d: {
              "guild_id": channel.server.id,
              "channel_id": channel.id,
              "self_mute": false,
              "self_deaf": false
            }
          });
        };

        var joinVoice = function joinVoice() {
          return new Promise(function (resolve, reject) {
            var session = _this4.sessionID,
                token = void 0,
                server = channel.server,
                endpoint = void 0;

            var timeout = null;

            var check = function check(data) {
              if (data.t === "VOICE_SERVER_UPDATE") {
                var _ret2 = function () {
                  if (data.d.guild_id !== server.id) return {
                      v: void 0
                    }; // ensure it is the right server
                  token = data.d.token;
                  endpoint = data.d.endpoint;
                  if (!token || !endpoint) return {
                      v: void 0
                    };
                  var chan = new _VoiceConnection2.default(channel, _this4.client, session, token, server, endpoint);
                  _this4.voiceConnections.add(chan);

                  chan.on("ready", function () {
                    return resolve(chan);
                  });
                  chan.on("error", reject);
                  chan.on("close", reject);

                  if (timeout) {
                    clearTimeout(timeout);
                  }
                  _this4.client.removeListener("raw", check);
                }();

                if ((typeof _ret2 === "undefined" ? "undefined" : _typeof(_ret2)) === "object") return _ret2.v;
              }
            };

            timeout = setTimeout(function () {
              _this4.client.removeListener("raw", check);
              reject(new Error("No voice server details within 10 seconds"));
            }, 10000);

            _this4.client.on("raw", check);
            joinSendWS();
          });
        };

        var existingServerConn = _this4.voiceConnections.get("server", channel.server); // same server connection
        if (existingServerConn) {
          joinSendWS(); // Just needs to update by sending via WS, movement in cache will be handled by global handler
          return Promise.resolve(existingServerConn);
        }

        if (!_this4.user.bot && _this4.voiceConnections.length > 0) {
          // nonbot, one voiceconn only, just like last time just disconnect
          return _this4.leaveVoiceChannel().then(joinVoice);
        }

        return joinVoice();
      });
    }

    // Backwards-compatible utility getter method for the first voice connection
    // Thanks to #q (@qeled) for suggesting this

  }, {
    key: "getGuildMembers",
    value: function getGuildMembers(serverID, chunkCount) {
      this.forceFetchCount[serverID] = chunkCount;
      if (this.forceFetchLength + 3 + serverID.length > 4000) {
        // 4096 max, '{"op":8,"d":{"guild_id":[],"query":"","limit":0}}'.length = 49 plus some leeway
        this.requestGuildMembers(this.forceFetchQueue);
        this.forceFetchQueue = [serverID];
        this.forceFetchLength = 1 + serverID.length + 3;
      } else {
        this.forceFetchQueue.push(serverID);
        this.forceFetchLength += serverID.length + 3;
      }
    }
  }, {
    key: "requestGuildMembers",
    value: function requestGuildMembers(serverID, query, limit) {
      this.sendWS({
        op: 8,
        d: {
          guild_id: serverID,
          query: query || "",
          limit: limit || 0
        }
      });
    }
  }, {
    key: "syncGuild",
    value: function syncGuild(guildID) {
      if (this.guildSyncQueueLength + 3 + guildID.length > 4050) {
        // 4096 max, '{"op":12,"d":[]}'.length = 16 plus some leeway
        this.sendWS({ op: 12, d: this.guildSyncQueue });
        this.guildSyncQueue = [guildID];
        this.guildSyncQueueLength = 1 + guildID.length + 3;
      } else {
        this.guildSyncQueue.push(guildID);
        this.guildSyncQueueLength += guildID.length + 3;
      }
    }
  }, {
    key: "checkReady",
    value: function checkReady() {
      if (!this.readyTime) {
        if (this.guildSyncQueue.length > 0) {
          this.sendWS({ op: 12, d: this.guildSyncQueue });
          this.guildSyncQueue = [];
          this.guildSyncQueueLength = 1;
          return;
        }
        if (this.unsyncedGuilds > 0) {
          return;
        }
        if (this.forceFetchQueue.length > 0) {
          this.requestGuildMembers(this.forceFetchQueue);
          this.forceFetchQueue = [];
          this.forceFetchLength = 1;
        } else {
          for (var key in this.forceFetchCount) {
            if (this.forceFetchCount.hasOwnProperty(key)) {
              return;
            }
          }
          this.readyTime = Date.now();
          this.client.emit("ready");
        }
      }
    }
  }, {
    key: "restartServerCreateTimeout",
    value: function restartServerCreateTimeout() {
      var _this5 = this;

      if (this.guildCreateTimeout) {
        clearTimeout(this.guildCreateTimeout);
        this.guildCreateTimeout = null;
      }
      if (!this.readyTime) {
        this.guildCreateTimeout = setTimeout(function () {
          _this5.checkReady();
        }, this.client.options.guildCreateTimeout);
      }
    }

    // def createServer

  }, {
    key: "createServer",
    value: function createServer(name) {
      var _this6 = this;

      var region = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "london";

      name = this.resolver.resolveString(name);

      return this.apiRequest('post', _Constants.Endpoints.SERVERS, true, { name: name, region: region }).then(function (res) {
        // valid server, wait until it is cached
        return waitFor(function () {
          return _this6.servers.get("id", res.id);
        });
      });
    }

    //def joinServer

  }, {
    key: "joinServer",
    value: function joinServer(invite) {
      var _this7 = this;

      invite = this.resolver.resolveInviteID(invite);
      if (!invite) {
        return Promise.reject(new Error("Not a valid invite"));
      }

      return this.apiRequest("post", _Constants.Endpoints.INVITE(invite), true).then(function (res) {
        // valid server, wait until it is received via ws and cached
        return waitFor(function () {
          return _this7.servers.get("id", res.guild.id);
        });
      });
    }

    //def updateServer

  }, {
    key: "updateServer",
    value: function updateServer(server, options) {
      var _this8 = this;

      server = this.resolver.resolveServer(server);
      if (!server) {
        return Promise.reject(new Error("server did not resolve"));
      }

      var newOptions = {
        name: options.name || server.name,
        region: options.region || server.region
      };

      if (options.icon) {
        newOptions.icon = this.resolver.resolveToBase64(options.icon);
      }
      if (options.splash) {
        newOptions.splash = this.resolver.resolveToBase64(options.splash);
      }
      if (options.owner) {
        var _user = this.resolver.resolveUser(options.owner);
        if (!_user) {
          return Promise.reject(new Error("owner could not be resolved"));
        }
        options.owner_id = _user.id;
      }
      if (options.verificationLevel) {
        options.verification_level = user.verificationLevel;
      }
      if (options.afkChannel) {
        var channel = this.resolver.resolveUser(options.afkChannel);
        if (!channel) {
          return Promise.reject(new Error("afkChannel could not be resolved"));
        }
        options.afk_channel_id = channel.id;
      }
      if (options.afkTimeout) {
        options.afk_timeout = options.afkTimeout;
      }

      return this.apiRequest("patch", _Constants.Endpoints.SERVER(server.id), true, options).then(function (res) {
        // wait until the name and region are updated
        return waitFor(function () {
          return _this8.servers.get("name", res.name) ? _this8.servers.get("name", res.name).region === res.region ? _this8.servers.get("id", res.id) : false : false;
        });
      });
    }

    //def leaveServer

  }, {
    key: "leaveServer",
    value: function leaveServer(srv) {
      var server = this.resolver.resolveServer(srv);
      if (!server) {
        return Promise.reject(new Error("server did not resolve"));
      }

      return this.apiRequest("del", _Constants.Endpoints.ME_SERVER(server.id), true);
    }

    //def deleteServer

  }, {
    key: "deleteServer",
    value: function deleteServer(srv) {
      var server = this.resolver.resolveServer(srv);
      if (!server) {
        return Promise.reject(new Error("server did not resolve"));
      }

      return this.apiRequest("del", _Constants.Endpoints.SERVER(server.id), true);
    }

    // def loginWithToken
    // email and password are optional

  }, {
    key: "loginWithToken",
    value: function loginWithToken(token, email, password) {
      if (!this.setupCalled) {
        this.setup();
      }

      this.state = _ConnectionState2.default.LOGGED_IN;
      this.token = token;
      this.email = email;
      this.password = password;

      var self = this;
      return this.getGateway().then(function (url) {
        self.token = self.client.options.bot && !self.token.startsWith("Bot ") ? "Bot " + self.token : self.token;
        self.createWS(url);
        return self.token;
      });
    }

    // def login

  }, {
    key: "login",
    value: function login(email, password) {
      var _this9 = this;

      var client = this.client;

      if (!this.tokenCacher.done) {
        return new Promise(function (resolve, reject) {
          setTimeout(function () {
            _this9.login(email, password).then(resolve).catch(reject);
          }, 20);
        });
      } else {
        var tk = this.tokenCacher.getToken(email, password);
        if (tk) {
          this.client.emit("debug", "bypassed direct API login, used cached token");
          return this.loginWithToken(tk, email, password);
        }
      }

      if (this.state !== _ConnectionState2.default.DISCONNECTED && this.state !== _ConnectionState2.default.IDLE) {
        return Promise.reject(new Error("already logging in/logged in/ready!"));
      }

      this.state = _ConnectionState2.default.LOGGING_IN;

      return this.apiRequest("post", _Constants.Endpoints.LOGIN, false, {
        email: email,
        password: password
      }).then(function (res) {
        _this9.client.emit("debug", "direct API login, cached token was unavailable");
        var token = res.token;
        _this9.tokenCacher.setToken(email, password, token);
        return _this9.loginWithToken(token, email, password);
      }, function (error) {
        _this9.websocket = null;
        throw error;
      }).catch(function (error) {
        _this9.websocket = null;
        _this9.state = _ConnectionState2.default.DISCONNECTED;
        client.emit("disconnected");
        throw error;
      });
    }

    // def logout

  }, {
    key: "logout",
    value: function logout() {
      var _this10 = this;

      if (this.state === _ConnectionState2.default.DISCONNECTED || this.state === _ConnectionState2.default.IDLE) {
        return Promise.reject(new Error("Client is not logged in!"));
      }

      var disconnect = function disconnect() {
        if (_this10.websocket) {
          _this10.websocket.close(1000);
          _this10.websocket = null;
        }
        _this10.token = null;
        _this10.email = null;
        _this10.password = null;
        _this10.state = _ConnectionState2.default.DISCONNECTED;
        return Promise.resolve();
      };

      if (!this.user.bot) {
        return this.apiRequest("post", _Constants.Endpoints.LOGOUT, true).then(disconnect);
      } else {
        return disconnect();
      }
    }

    // def startPM

  }, {
    key: "startPM",
    value: function startPM(resUser) {
      var _this11 = this;

      var user = this.resolver.resolveUser(resUser);
      if (!user) {
        return Promise.reject(new Error("Unable to resolve resUser to a User"));
      }
      // start the PM
      return this.apiRequest("post", _Constants.Endpoints.ME_CHANNELS, true, {
        recipient_id: user.id
      }).then(function (res) {
        return _this11.private_channels.add(new _PMChannel2.default(res, _this11.client));
      });
    }

    // def getGateway

  }, {
    key: "getGateway",
    value: function getGateway() {
      var _this12 = this;

      if (this.gatewayURL) {
        return Promise.resolve(this.gatewayURL);
      }
      return this.apiRequest("get", _Constants.Endpoints.GATEWAY, true).then(function (res) {
        return _this12.gatewayURL = res.url;
      });
    }

    // def sendMessage

  }, {
    key: "sendMessage",
    value: function sendMessage(where, _content) {
      var _this13 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (options.file) {
        if (_typeof(options.file) !== "object") {
          options.file = {
            file: options.file
          };
        }
        if (!options.file.name) {
          if (options.file.file instanceof String || typeof options.file.file === "string") {
            options.file.name = require("path").basename(options.file.file);
          } else if (options.file.file.path) {
            // fs.createReadStream()'s have .path that give the path. Not sure about other streams though.
            options.file.name = require("path").basename(options.file.file.path);
          } else {
            options.file.name = "default.png"; // Just have to go with default filenames.
          }
        }
      }

      return this.resolver.resolveChannel(where).then(function (destination) {
        var content = _this13.resolver.resolveString(_content);

        if (_this13.client.options.disableEveryone || options.disableEveryone) {
          content = content.replace(/(@)(everyone|here)/g, "$1\u200B$2");
        }

        if (options.file) {
          return _this13.resolver.resolveFile(options.file.file).then(function (file) {
            return _this13.apiRequest("post", _Constants.Endpoints.CHANNEL_MESSAGES(destination.id), true, {
              content: content,
              tts: options.tts,
              nonce: options.nonce
            }, {
              name: options.file.name,
              file: file
            }).then(function (res) {
              return destination.messages.add(new _Message2.default(res, destination, _this13.client));
            });
          });
        } else {
          return _this13.apiRequest("post", _Constants.Endpoints.CHANNEL_MESSAGES(destination.id), true, {
            content: content,
            tts: options.tts,
            nonce: options.nonce
          }).then(function (res) {
            return destination.messages.add(new _Message2.default(res, destination, _this13.client));
          });
        }
      });
    }

    // def sendFile

  }, {
    key: "sendFile",
    value: function sendFile(where, _file, name, content) {
      var _this14 = this;

      if (!name) {
        if (_file instanceof String || typeof _file === "string") {
          name = require("path").basename(_file);
        } else if (_file && _file.path) {
          // fs.createReadStream()'s have .path that give the path. Not sure about other streams though.
          name = require("path").basename(_file.path);
        } else {
          name = "default.png"; // Just have to go with default filenames.
        }
      }

      if (content) {
        content = {
          content: this.resolver.resolveString(content)
        };
        if (this.client.options.disableEveryone) {
          content.content = content.content.replace(/(@)(everyone|here)/g, "$1\u200B$2");
        }
      }

      return this.resolver.resolveChannel(where).then(function (channel) {
        return _this14.resolver.resolveFile(_file).then(function (file) {
          return _this14.apiRequest("post", _Constants.Endpoints.CHANNEL_MESSAGES(channel.id), true, content, {
            name: name,
            file: file
          }).then(function (res) {
            return channel.messages.add(new _Message2.default(res, channel, _this14.client));
          });
        });
      });
    }

    // def deleteMessage

  }, {
    key: "deleteMessage",
    value: function deleteMessage(_message) {
      var _this15 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


      var message = this.resolver.resolveMessage(_message);
      if (!message) {
        return Promise.reject(new Error("Supplied message did not resolve to a message!"));
      }

      var chain = options.wait ? delay(options.wait) : Promise.resolve();
      return chain.then(function () {
        return _this15.apiRequest("del", _Constants.Endpoints.CHANNEL_MESSAGE(message.channel.id, message.id), true);
      }).then(function () {
        return message.channel.messages.remove(message);
      });
    }

    // def deleteMessages

  }, {
    key: "deleteMessages",
    value: function deleteMessages(_messages) {
      if (!_messages instanceof Array) return Promise.reject(new Error("Messages provided must be in an array"));
      if (_messages.length < 1) return Promise.reject(new Error("You must provide at least one message to delete"));else if (_messages.length === 1) return this.deleteMessage(_messages[0]);

      var messages = [];
      var channel = void 0;
      var message = void 0;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = _messages[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _message = _step3.value;

          message = this.resolver.resolveMessage(_message);
          if (!message) return Promise.reject(new Error("Something other than a message could not be resolved in the array..."));
          if (!message.server) return Promise.reject(new Error("You can only bulk delete messages on guild channels"));

          // ensure same channel
          if (!channel) {
            channel = message.channel;
          } else {
            //noinspection JSUnusedAssignment
            if (message.channel.id !== channel.id) return Promise.reject(new Error("You can only bulk delete messages from the same channel at one time..."));
          }

          messages.push(message);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return this.apiRequest("post", _Constants.Endpoints.CHANNEL_MESSAGES(channel.id) + "/bulk_delete", true, {
        messages: messages.map(function (m) {
          return m.id;
        })
      }).then(function () {
        return messages.forEach(function (m) {
          return channel.messages.remove(m);
        });
      });
    }

    // def updateMessage

  }, {
    key: "updateMessage",
    value: function updateMessage(msg, _content) {
      var _this16 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


      var message = this.resolver.resolveMessage(msg);

      if (!message) {
        return Promise.reject(new Error("Supplied message did not resolve to a message!"));
      }

      var content = this.resolver.resolveString(_content);

      return this.apiRequest("patch", _Constants.Endpoints.CHANNEL_MESSAGE(message.channel.id, message.id), true, {
        content: content,
        tts: options.tts
      }).then(function (res) {
        return message.channel.messages.update(message, new _Message2.default(res, message.channel, _this16.client));
      });
    }

    // def getChannelLogs

  }, {
    key: "getChannelLogs",
    value: function getChannelLogs(_channel) {
      var _this17 = this;

      var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      return this.resolver.resolveChannel(_channel).then(function (channel) {
        var qsObject = { limit: limit };
        if (options.before) {
          var res = _this17.resolver.resolveMessage(options.before);
          if (res) {
            qsObject.before = res.id;
          }
        }
        if (options.after) {
          var _res = _this17.resolver.resolveMessage(options.after);
          if (_res) {
            qsObject.after = _res.id;
          }
        }
        if (options.around) {
          var _res2 = _this17.resolver.resolveMessage(options.around);
          if (_res2) {
            qsObject.around = _res2.id;
          }
        }

        return _this17.apiRequest("get", _Constants.Endpoints.CHANNEL_MESSAGES(channel.id) + "?" + _querystring2.default.stringify(qsObject), true).then(function (res) {
          return res.map(function (msg) {
            return channel.messages.add(new _Message2.default(msg, channel, _this17.client));
          });
        });
      });
    }

    // def getMessage

  }, {
    key: "getMessage",
    value: function getMessage(_channel, messageID) {
      var _this18 = this;

      return this.resolver.resolveChannel(_channel).then(function (channel) {
        if (!_this18.user.bot) {
          return Promise.reject(new Error("Only OAuth bot accounts can use this function"));
        }

        if (!(channel instanceof _TextChannel2.default || channel instanceof _PMChannel2.default)) {
          return Promise.reject(new Error("Provided channel is not a Text or PMChannel"));
        }

        var msg = channel.messages.get("id", messageID);
        if (msg) {
          return Promise.resolve(msg);
        }

        return _this18.apiRequest("get", _Constants.Endpoints.CHANNEL_MESSAGES(channel.id) + "/" + messageID, true).then(function (res) {
          return channel.messages.add(new _Message2.default(res, channel, _this18.client));
        });
      });
    }

    // def pinMessage

  }, {
    key: "pinMessage",
    value: function pinMessage(msg) {
      var message = this.resolver.resolveMessage(msg);

      if (!message) {
        return Promise.reject(new Error("Supplied message did not resolve to a message"));
      }

      return this.apiRequest("put", "" + _Constants.Endpoints.CHANNEL_PIN(msg.channel.id, msg.id), true);
    }

    // def unpinMessage

  }, {
    key: "unpinMessage",
    value: function unpinMessage(msg) {
      var message = this.resolver.resolveMessage(msg);

      if (!message) {
        return Promise.reject(new Error("Supplied message did not resolve to a message"));
      }

      if (!message.pinned) {
        return Promise.reject(new Error("Supplied message is not pinned"));
      }

      return this.apiRequest("del", "" + _Constants.Endpoints.CHANNEL_PIN(msg.channel.id, msg.id), true);
    }

    // def getPinnedMessages

  }, {
    key: "getPinnedMessages",
    value: function getPinnedMessages(_channel) {
      var _this19 = this;

      return this.resolver.resolveChannel(_channel).then(function (channel) {
        return _this19.apiRequest("get", "" + _Constants.Endpoints.CHANNEL_PINS(channel.id), true).then(function (res) {
          return res.map(function (msg) {
            return channel.messages.add(new _Message2.default(msg, channel, _this19.client));
          });
        });
      });
    }

    // def getBans

  }, {
    key: "getBans",
    value: function getBans(server) {
      var _this20 = this;

      server = this.resolver.resolveServer(server);

      return this.apiRequest("get", _Constants.Endpoints.SERVER_BANS(server.id), true).then(function (res) {
        return res.map(function (ban) {
          return _this20.users.add(new _User2.default(ban.user, _this20.client));
        });
      });
    }

    // def createChannel

  }, {
    key: "createChannel",
    value: function createChannel(server, name) {
      var _this21 = this;

      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;


      server = this.resolver.resolveServer(server);

      return this.apiRequest("post", _Constants.Endpoints.SERVER_CHANNELS(server.id), true, {
        name: name,
        type: type
      }).then(function (res) {
        var channel = void 0;
        if (res.type === 0) {
          channel = new _TextChannel2.default(res, _this21.client, server);
        } else {
          channel = new _VoiceChannel2.default(res, _this21.client, server);
        }
        return server.channels.add(_this21.channels.add(channel));
      });
    }

    // def deleteChannel

  }, {
    key: "deleteChannel",
    value: function deleteChannel(_channel) {
      var _this22 = this;

      return this.resolver.resolveChannel(_channel).then(function (channel) {
        return _this22.apiRequest("del", _Constants.Endpoints.CHANNEL(channel.id), true).then(function () {
          if (channel.server) {
            channel.server.channels.remove(channel);
            _this22.channels.remove(channel);
          } else {
            _this22.private_channels.remove(channel);
          }
        });
      });
    }

    // def banMember

  }, {
    key: "banMember",
    value: function banMember(user, server) {
      var length = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

      var resolvedUser = this.resolver.resolveUser(user);
      server = this.resolver.resolveServer(server);

      if (resolvedUser === null && typeof user === "string") {
        user = { id: user };
      } else {
        user = resolvedUser;
      }

      return this.apiRequest("put", _Constants.Endpoints.SERVER_BANS(server.id) + "/" + user.id + "?delete-message-days=" + length, true);
    }

    // def unbanMember

  }, {
    key: "unbanMember",
    value: function unbanMember(user, server) {

      server = this.resolver.resolveServer(server);
      var resolvedUser = this.resolver.resolveUser(user);

      if (resolvedUser === null && typeof user === "string") {
        user = { id: user };
      } else {
        user = resolvedUser;
      }

      return this.apiRequest("del", _Constants.Endpoints.SERVER_BANS(server.id) + "/" + user.id, true);
    }

    // def kickMember

  }, {
    key: "kickMember",
    value: function kickMember(user, server) {
      user = this.resolver.resolveUser(user);
      server = this.resolver.resolveServer(server);

      return this.apiRequest("del", _Constants.Endpoints.SERVER_MEMBERS(server.id) + "/" + user.id, true);
    }

    // def moveMember

  }, {
    key: "moveMember",
    value: function moveMember(user, channel) {
      var _this23 = this;

      user = this.resolver.resolveUser(user);
      return this.resolver.resolveChannel(channel).then(function (channel) {
        var server = channel.server;

        // Make sure `channel` is a voice channel
        if (channel.type !== 2) {
          throw new Error("Can't moveMember into a non-voice channel");
        } else {
          return _this23.apiRequest("patch", _Constants.Endpoints.SERVER_MEMBERS(server.id) + "/" + user.id, true, { channel_id: channel.id }).then(function (res) {
            user.voiceChannel = channel;
            return res;
          });
        }
      });
    }

    // def muteMember

  }, {
    key: "muteMember",
    value: function muteMember(user, server) {
      user = this.resolver.resolveUser(user);
      server = this.resolver.resolveServer(server);
      return this.apiRequest("patch", _Constants.Endpoints.SERVER_MEMBERS(server.id) + "/" + user.id, true, { mute: true });
    }

    // def unmuteMember

  }, {
    key: "unmuteMember",
    value: function unmuteMember(user, server) {
      user = this.resolver.resolveUser(user);
      server = this.resolver.resolveServer(server);
      return this.apiRequest("patch", _Constants.Endpoints.SERVER_MEMBERS(server.id) + "/" + user.id, true, { mute: false });
    }

    // def deafenMember

  }, {
    key: "deafenMember",
    value: function deafenMember(user, server) {
      user = this.resolver.resolveUser(user);
      server = this.resolver.resolveServer(server);
      return this.apiRequest("patch", _Constants.Endpoints.SERVER_MEMBERS(server.id) + "/" + user.id, true, { deaf: true });
    }

    // def undeafenMember

  }, {
    key: "undeafenMember",
    value: function undeafenMember(user, server) {
      user = this.resolver.resolveUser(user);
      server = this.resolver.resolveServer(server);
      return this.apiRequest("patch", _Constants.Endpoints.SERVER_MEMBERS(server.id) + "/" + user.id, true, { deaf: false });
    }

    // def setNickname

  }, {
    key: "setNickname",
    value: function setNickname(server, nick, user) {
      nick = nick || "";
      user = this.resolver.resolveUser(user);
      server = this.resolver.resolveServer(server);
      return this.apiRequest("patch", _Constants.Endpoints.SERVER_MEMBERS(server.id) + "/" + (user.id === this.user.id ? "@me/nick" : user.id), true, { nick: nick });
    }

    //def setNote

  }, {
    key: "setNote",
    value: function setNote(user, note) {
      user = this.resolver.resolveUser(user);
      note = note || "";

      if (!user) {
        return Promise.reject(new Error("Failed to resolve user"));
      }

      return this.apiRequest("put", _Constants.Endpoints.ME_NOTES + "/" + user.id, true, { note: note });
    }

    // def createRole

  }, {
    key: "createRole",
    value: function createRole(server, data) {
      var _this24 = this;

      server = this.resolver.resolveServer(server);

      return this.apiRequest("post", _Constants.Endpoints.SERVER_ROLES(server.id), true).then(function (res) {
        var role = server.roles.add(new _Role2.default(res, server, _this24.client));

        if (data) {
          return _this24.updateRole(role, data);
        }
        return role;
      });
    }

    // def updateRole

  }, {
    key: "updateRole",
    value: function updateRole(role, data) {
      var _this25 = this;

      role = this.resolver.resolveRole(role);
      var server = this.resolver.resolveServer(role.server);

      var newData = {
        color: "color" in data ? data.color : role.color,
        hoist: "hoist" in data ? data.hoist : role.hoist,
        name: "name" in data ? data.name : role.name,
        position: "position" in data ? data.position : role.position,
        permissions: "permissions" in data ? data.permissions : role.permissions,
        mentionable: "mentionable" in data ? data.mentionable : role.mentionable
      };

      if (data.permissions) {
        newData.permissions = 0;
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = data.permissions[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var perm = _step4.value;

            if (perm instanceof String || typeof perm === "string") {
              newData.permissions |= _Constants.Permissions[perm] || 0;
            } else {
              newData.permissions |= perm;
            }
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }
      }

      return this.apiRequest("patch", _Constants.Endpoints.SERVER_ROLES(server.id) + "/" + role.id, true, newData).then(function (res) {
        return server.roles.update(role, new _Role2.default(res, server, _this25.client));
      });
    }

    // def deleteRole

  }, {
    key: "deleteRole",
    value: function deleteRole(role) {
      if (role.server.id === role.id) {
        return Promise.reject(new Error("Stop trying to delete the @everyone role. It is futile"));
      } else {
        return this.apiRequest("del", _Constants.Endpoints.SERVER_ROLES(role.server.id) + "/" + role.id, true);
      }
    }

    //def addMemberToRole

  }, {
    key: "addMemberToRole",
    value: function addMemberToRole(member, roles) {
      var _this26 = this;

      member = this.resolver.resolveUser(member);

      if (!member) {
        return Promise.reject(new Error("user not found"));
      }

      if (!Array.isArray(roles) || roles.length === 0) {
        roles = this.resolver.resolveRole(roles);
        if (roles) {
          roles = [roles];
        } else {
          return Promise.reject(new Error("invalid array of roles"));
        }
      } else {
        roles = roles.map(function (r) {
          return _this26.resolver.resolveRole(r);
        });
      }

      if (roles.some(function (role) {
        return !role.server.memberMap[member.id];
      })) {
        return Promise.reject(new Error("Role does not exist on same server as member"));
      }

      var roleIDs = roles[0].server.memberMap[member.id].roles.map(function (r) {
        return r && r.id || r;
      });

      for (var i = 0; i < roles.length; i++) {
        if (!~roleIDs.indexOf(roles[i].id)) {
          roleIDs.push(roles[i].id);
        }
      }

      return this.apiRequest("patch", _Constants.Endpoints.SERVER_MEMBERS(roles[0].server.id) + "/" + member.id, true, {
        roles: roleIDs
      });
    }
  }, {
    key: "memberHasRole",
    value: function memberHasRole(member, role) {
      role = this.resolver.resolveRole(role);
      member = this.resolver.resolveUser(member);

      if (!role) {
        throw new Error("invalid role");
      }
      if (!member) {
        throw new Error("user not found");
      }

      var roledata = role.server.rolesOf(member);
      if (roledata) {
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = roledata[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var r = _step5.value;

            if (r.id == role.id) {
              return true;
            }
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }
      }
      return false;
    }

    //def removeMemberFromRole

  }, {
    key: "removeMemberFromRole",
    value: function removeMemberFromRole(member, roles) {
      var _this27 = this;

      member = this.resolver.resolveUser(member);

      if (!member) {
        return Promise.reject(new Error("user not found"));
      }

      if (!Array.isArray(roles) || roles.length === 0) {
        roles = this.resolver.resolveRole(roles);
        if (roles) {
          roles = [roles];
        } else {
          return Promise.reject(new Error("invalid array of roles"));
        }
      } else {
        roles = roles.map(function (r) {
          return _this27.resolver.resolveRole(r);
        });
      }

      var roleIDs = roles[0].server.memberMap[member.id].roles.map(function (r) {
        return r && r.id || r;
      });

      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = roles[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var role = _step6.value;

          if (!role.server.memberMap[member.id]) {
            return Promise.reject(new Error("member not in server"));
          }
          for (var item in roleIDs) {
            if (roleIDs.hasOwnProperty(item)) {
              if (roleIDs[item] === role.id) {
                roleIDs.splice(item, 1);
                break;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      return this.apiRequest("patch", _Constants.Endpoints.SERVER_MEMBERS(roles[0].server.id) + "/" + member.id, true, {
        roles: roleIDs
      });
    }

    // def createInvite

  }, {
    key: "createInvite",
    value: function createInvite(chanServ, options) {
      var _this28 = this;

      return this.resolver.resolveChannel(chanServ).then(function (channel) {
        if (!options) {
          options = {
            validate: null
          };
        } else {
          options.max_age = options.maxAge || 0;
          options.max_uses = options.maxUses || 0;
          options.temporary = options.temporary || false;
          options.xkcdpass = options.xkcd || false;
        }

        return _this28.apiRequest("post", _Constants.Endpoints.CHANNEL_INVITES(channel.id), true, options).then(function (res) {
          return new _Invite2.default(res, _this28.channels.get("id", res.channel.id), _this28.client);
        });
      });
    }

    //def deleteInvite

  }, {
    key: "deleteInvite",
    value: function deleteInvite(invite) {
      invite = this.resolver.resolveInviteID(invite);
      if (!invite) {
        throw new Error("Not a valid invite");
      }
      return this.apiRequest("del", _Constants.Endpoints.INVITE(invite), true);
    }

    //def getInvite

  }, {
    key: "getInvite",
    value: function getInvite(invite) {
      var _this29 = this;

      invite = this.resolver.resolveInviteID(invite);
      if (!invite) {
        return Promise.reject(new Error("Not a valid invite"));
      }

      return this.apiRequest("get", _Constants.Endpoints.INVITE(invite), true).then(function (res) {
        if (!_this29.channels.has("id", res.channel.id)) {
          return new _Invite2.default(res, null, _this29.client);
        }
        return _this29.apiRequest("post", _Constants.Endpoints.CHANNEL_INVITES(res.channel.id), true, { validate: invite }).then(function (res2) {
          return new _Invite2.default(res2, _this29.channels.get("id", res.channel.id), _this29.client);
        });
      });
    }

    //def getInvites

  }, {
    key: "getInvites",
    value: function getInvites(channel) {
      var _this30 = this;

      if (!(channel instanceof _Channel2.default)) {
        var server = this.resolver.resolveServer(channel);
        if (server) {
          return this.apiRequest("get", _Constants.Endpoints.SERVER_INVITES(server.id), true).then(function (res) {
            return res.map(function (data) {
              return new _Invite2.default(data, _this30.channels.get("id", data.channel.id), _this30.client);
            });
          });
        }
      }
      return this.resolver.resolveChannel(channel).then(function (channel) {
        return _this30.apiRequest("get", _Constants.Endpoints.CHANNEL_INVITES(channel.id), true).then(function (res) {
          return res.map(function (data) {
            return new _Invite2.default(data, _this30.channels.get("id", data.channel.id), _this30.client);
          });
        });
      });
    }

    //def overwritePermissions

  }, {
    key: "overwritePermissions",
    value: function overwritePermissions(channel, role, updated) {
      var _this31 = this;

      return this.resolver.resolveChannel(channel).then(function (channel) {
        if (!channel instanceof _ServerChannel2.default) {
          return Promise.reject(new Error("Not a server channel"));
        }

        var data = {
          allow: 0,
          deny: 0
        };

        if (role instanceof String || typeof role === "string") {
          role = _this31.resolver.resolveUser(role) || _this31.resolver.resolveRole(role);
        }

        if (role instanceof _User2.default) {
          data.id = role.id;
          data.type = "member";
        } else if (role instanceof _Role2.default) {
          data.id = role.id;
          data.type = "role";
        } else {
          return Promise.reject(new Error("Role could not be resolved"));
        }

        var previousOverwrite = channel.permissionOverwrites.get("id", data.id);

        if (previousOverwrite) {
          data.allow |= previousOverwrite.allow;
          data.deny |= previousOverwrite.deny;
        }

        for (var perm in updated) {
          if (updated.hasOwnProperty(perm)) {
            if (updated[perm] === true) {
              data.allow |= _Constants.Permissions[perm] || 0;
              data.deny &= ~(_Constants.Permissions[perm] || 0);
            } else if (updated[perm] === false) {
              data.allow &= ~(_Constants.Permissions[perm] || 0);
              data.deny |= _Constants.Permissions[perm] || 0;
            } else {
              data.allow &= ~(_Constants.Permissions[perm] || 0);
              data.deny &= ~(_Constants.Permissions[perm] || 0);
            }
          }
        }

        return _this31.apiRequest("put", _Constants.Endpoints.CHANNEL_PERMISSIONS(channel.id) + "/" + data.id, true, data);
      });
    }

    //def setStatus

  }, {
    key: "setStatus",
    value: function setStatus(idleStatus, game) {

      if (idleStatus === "online" || idleStatus === "here" || idleStatus === "available") {
        this.idleStatus = null;
      } else if (idleStatus === "idle" || idleStatus === "away") {
        this.idleStatus = Date.now();
      } else {
        this.idleStatus = this.idleStatus || null; //undefined
      }

      // convert undefined and empty string to null
      if (typeof game === "string" && !game.length) game = null;

      this.game = game === null ? null : !game ? this.game || null : typeof game === "string" ? { name: game } : game;

      var packet = {
        op: 3,
        d: {
          idle_since: this.idleStatus,
          game: this.game
        }
      };

      this.sendWS(packet);

      this.user.status = this.idleStatus ? "idle" : "online";
      this.user.game = this.game;

      return Promise.resolve();
    }

    //def sendTyping

  }, {
    key: "sendTyping",
    value: function sendTyping(channel) {
      var _this32 = this;

      return this.resolver.resolveChannel(channel).then(function (channel) {
        return _this32.apiRequest("post", _Constants.Endpoints.CHANNEL(channel.id) + "/typing", true);
      });
    }

    //def startTyping

  }, {
    key: "startTyping",
    value: function startTyping(channel) {
      var _this33 = this;

      return this.resolver.resolveChannel(channel).then(function (channel) {

        if (_this33.intervals.typing[channel.id]) {
          // typing interval already exists, leave it alone
          throw new Error("Already typing in that channel");
        }

        _this33.intervals.typing[channel.id] = setInterval(function () {
          return _this33.sendTyping(channel).catch(function (error) {
            return _this33.client.emit("error", error);
          });
        }, 4000);

        return _this33.sendTyping(channel);
      });
    }

    //def stopTyping

  }, {
    key: "stopTyping",
    value: function stopTyping(channel) {
      var _this34 = this;

      return this.resolver.resolveChannel(channel).then(function (channel) {

        if (!_this34.intervals.typing[channel.id]) {
          // typing interval doesn"t exist
          throw new Error("Not typing in that channel");
        }

        clearInterval(_this34.intervals.typing[channel.id]);
        _this34.intervals.typing[channel.id] = false;
      });
    }

    //def updateDetails

  }, {
    key: "updateDetails",
    value: function updateDetails(data) {
      if (!this.user.bot && !(this.email || data.email)) {
        throw new Error("Must provide email since a token was used to login");
      }

      var options = {};

      if (data.username) {
        options.username = data.username;
      } else {
        options.username = this.user.username;
      }

      if (data.avatar) {
        options.avatar = this.resolver.resolveToBase64(data.avatar);
      }

      if (this.email || data.email) {
        options.email = data.email || this.email;
        options.new_password = data.newPassword || null;
        options.password = data.password || this.password;
      }

      return this.apiRequest("patch", _Constants.Endpoints.ME, true, options);
    }

    //def setAvatar

  }, {
    key: "setAvatar",
    value: function setAvatar(avatar) {
      return this.updateDetails({ avatar: avatar });
    }

    //def setUsername

  }, {
    key: "setUsername",
    value: function setUsername(username) {
      return this.updateDetails({ username: username });
    }

    //def setChannelTopic

  }, {
    key: "setChannelTopic",
    value: function setChannelTopic(channel) {
      var topic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

      topic = topic || "";

      return this.updateChannel(channel, { topic: topic });
    }

    //def setChannelName

  }, {
    key: "setChannelName",
    value: function setChannelName(channel, name) {
      name = name || "unnamed-channel";

      return this.updateChannel(channel, { name: name });
    }

    //def setChannelPosition

  }, {
    key: "setChannelPosition",
    value: function setChannelPosition(channel, position) {
      position = position || 0;

      return this.updateChannel(channel, { position: position });
    }

    //def setChannelUserLimit

  }, {
    key: "setChannelUserLimit",
    value: function setChannelUserLimit(channel, limit) {
      limit = limit || 0; // default 0 = no limit

      return this.updateChannel(channel, { userLimit: limit });
    }

    //def setChannelBitrate

  }, {
    key: "setChannelBitrate",
    value: function setChannelBitrate(channel, kbitrate) {
      kbitrate = kbitrate || 64; // default 64kbps

      return this.updateChannel(channel, { bitrate: kbitrate });
    }

    //def updateChannel

  }, {
    key: "updateChannel",
    value: function updateChannel(channel, data) {
      var _this35 = this;

      return this.resolver.resolveChannel(channel).then(function (channel) {
        if (!channel) {
          return Promise.reject(new Error("Failed to resolve channel"));
        }

        data = {
          name: data.name || channel.name,
          topic: data.topic || channel.topic,
          position: data.position ? data.position : channel.position,
          user_limit: data.userLimit ? data.userLimit : channel.userLimit,
          bitrate: data.bitrate ? data.bitrate : channel.bitrate ? channel.bitrate : undefined
        };

        if (data.position < 0) {
          return Promise.reject(new Error("Position cannot be less than 0"));
        }

        if (data.user_limit < 0 || data.user_limit > 99) {
          return Promise.reject(new Error("User limit must be between 0-99"));
        }

        if (data.kbitrate < 8 || data.kbitrate > 96) {
          return Promise.reject(new Error("Bitrate must be between 8-96kbps"));
        }

        if (data.bitrate) {
          data.bitrate *= 1000; // convert to bits before sending
        }

        return _this35.apiRequest("patch", _Constants.Endpoints.CHANNEL(channel.id), true, data).then(function (res) {
          channel.name = data.name;
          channel.topic = data.topic;
          channel.position = data.position;
          channel.userLimit = data.user_limit;
          channel.bitrate = Math.ceil(data.bitrate / 1000);
          channel._bitrate = data.bitrate;
        });
      });
    }

    //def addFriend

  }, {
    key: "addFriend",
    value: function addFriend(user) {
      if (this.user.bot) return Promise.reject(new Error("user is a bot, bot's do not have friends support"));

      var id = void 0;
      if (user instanceof String || typeof user === "string") id = user;else if (user instanceof _User2.default) {
        user = this.resolver.resolveUser(user);
        id = user.id;
      } else {
        if (user.username && user.discriminator) // add by username and discriminator (pass in an object)
          return this.apiRequest("put", _Constants.Endpoints.FRIENDS, true, user);else return Promise.reject("invalid user");
      }

      return this.apiRequest("put", _Constants.Endpoints.FRIENDS + "/" + id, true, {});
    }

    //def removeFriend

  }, {
    key: "removeFriend",
    value: function removeFriend(user) {
      if (this.user.bot) return Promise.reject(new Error("user is a bot, bot's do not have friends support"));

      user = this.resolver.resolveUser(user);

      return this.apiRequest("delete", _Constants.Endpoints.FRIENDS + "/" + user.id, true);
    }
  }, {
    key: "getServerWebhooks",
    value: function getServerWebhooks(server) {
      var _this36 = this;

      server = this.resolver.resolveServer(server);

      if (!server) {
        return Promise.reject(new Error("Failed to resolve server"));
      }

      return this.apiRequest("get", _Constants.Endpoints.SERVER_WEBHOOKS(server.id), true).then(function (res) {
        return res.map(function (webhook) {
          var channel = _this36.channels.get("id", webhook.channel_id);
          return channel.webhooks.add(new _Webhook2.default(webhook, server, channel, _this36.users.get("id", webhook.user.id)));
        });
      });
    }
  }, {
    key: "getChannelWebhooks",
    value: function getChannelWebhooks(channel) {
      var _this37 = this;

      return this.resolver.resolveChannel(channel).then(function (channel) {
        if (!channel) {
          return Promise.reject(new Error("Failed to resolve channel"));
        }

        return _this37.apiRequest("get", _Constants.Endpoints.CHANNEL_WEBHOOKS(channel.id), true).then(function (res) {
          return res.map(function (webhook) {
            return channel.webhooks.add(new _Webhook2.default(webhook, _this37.servers.get("id", webhook.guild_id), channel, _this37.users.get("id", webhook.user.id)));
          });
        });
      });
    }
  }, {
    key: "editWebhook",
    value: function editWebhook(webhook) {
      var _this38 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.resolver.resolveWebhook(webhook).then(function (webhook) {
        if (!webhook) {
          return Promise.reject(new Error(" Failed to resolve webhook"));
        }

        if (options.hasOwnProperty("avatar")) {
          options.avatar = _this38.resolver.resolveToBase64(options.avatar);
        }

        return _this38.apiRequest("patch", _Constants.Endpoints.WEBHOOK(webhook.id), true, options).then(function (res) {
          webhook.name = res.name;
          webhook.avatar = res.hasOwnProperty('avatar') ? res.avatar : webhook.avatar;
        });
      });
    }
  }, {
    key: "createWebhook",
    value: function createWebhook(channel) {
      var _this39 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.resolver.resolveChannel(channel).then(function (destination) {
        if (!channel) {
          return Promise.reject(new Error(" Failed to resolve channel"));
        }

        if (options.hasOwnProperty("avatar")) {
          options.avatar = _this39.resolver.resolveToBase64(options.avatar);
        }

        return _this39.apiRequest("post", _Constants.Endpoints.CHANNEL_WEBHOOKS(destination.id), true, options).then(function (webhook) {
          return channel.webhooks.add(new _Webhook2.default(webhook, _this39.servers.get("id", webhook.guild_id), channel, _this39.users.get("id", webhook.user.id)));
        });
      });
    }
  }, {
    key: "deleteWebhook",
    value: function deleteWebhook(webhook) {
      var _this40 = this;

      return this.resolver.resolveWebhook(webhook).then(function (webhook) {
        if (!webhook) {
          return Promise.reject(new Error(" Failed to resolve webhook"));
        }

        return _this40.apiRequest("delete", _Constants.Endpoints.WEBHOOK(webhook.id), true).then(function () {
          webhook.channel.webhooks.remove(webhook);
        });
      });
    }
  }, {
    key: "sendWebhookMessage",
    value: function sendWebhookMessage(webhook, _content) {
      var _this41 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      return this.resolver.resolveWebhook(webhook).then(function (destination) {
        var content = _this41.resolver.resolveString(_content);

        if (_this41.client.options.disableEveryone || options.disableEveryone) {
          content = content.replace(/(@)(everyone|here)/g, "$1\u200B$2");
        }

        if (!options.hasOwnProperty("username")) {
          options.username = _this41.user.username;
        }

        var slack = void 0;
        if (options.hasOwnProperty("slack")) {
          slack = options.slack;
          delete options["slack"];
        }

        options.content = content;

        return _this41.apiRequest("post", "" + _Constants.Endpoints.WEBHOOK_MESSAGE(destination.id, destination.token) + (slack ? "/slack" : "") + "?wait=true", true, options);
      });
    }

    //def getOAuthApplication

  }, {
    key: "getOAuthApplication",
    value: function getOAuthApplication(appID) {
      appID = appID || "@me";
      return this.apiRequest("get", _Constants.Endpoints.OAUTH2_APPLICATION(appID), true);
    }

    //def ack

  }, {
    key: "ack",
    value: function ack(msg) {
      msg = this.resolver.resolveMessage(msg);

      if (!msg) {
        return Promise.reject(new Error("Message does not exist"));
      }

      return this.apiRequest("post", _Constants.Endpoints.CHANNEL_MESSAGE(msg.channel.id, msg.id) + "/ack", true);
    }
  }, {
    key: "sendWS",
    value: function sendWS(object) {
      if (this.websocket) {
        //noinspection NodeModulesDependencies,NodeModulesDependencies
        this.websocket.send(JSON.stringify(object));
      }
    }
  }, {
    key: "createWS",
    value: function createWS(url) {
      var _this42 = this;

      if (this.websocket) {
        return false;
      }
      if (!url.endsWith("/")) {
        url += "/";
      }
      url += "?encoding=json&v=" + GATEWAY_VERSION;

      this.websocket = new _ws2.default(url);

      this.websocket.onopen = function () {};

      this.websocket.onclose = function (event) {
        _this42.websocket = null;
        _this42.state = _ConnectionState2.default.DISCONNECTED;
        if (event && event.code) {
          _this42.client.emit("warn", "WS close: " + event.code);
          var err = void 0;
          if (event.code === 4001) {
            err = new Error("Gateway received invalid OP code");
          } else if (event.code === 4005) {
            err = new Error("Gateway received invalid message");
          } else if (event.code === 4003) {
            err = new Error("Not authenticated");
          } else if (event.code === 4004) {
            err = new Error("Authentication failed");
          } else if (event.code === 4005) {
            err = new Error("Already authenticated");
          }
          if (event.code === 4006 || event.code === 4009) {
            err = new Error("Invalid session");
          } else if (event.code === 4007) {
            _this42.sequence = 0;
            err = new Error("Invalid sequence number");
          } else if (event.code === 4008) {
            err = new Error("Gateway connection was ratelimited");
          } else if (event.code === 4010) {
            err = new Error("Invalid shard key");
          }
          if (err) {
            _this42.client.emit("error", err);
          }
        }
        _this42.disconnected(_this42.client.options.autoReconnect);
      };

      this.websocket.onerror = function (e) {
        _this42.client.emit("error", e);
        _this42.websocket = null;
        _this42.state = _ConnectionState2.default.DISCONNECTED;
        _this42.disconnected(_this42.client.options.autoReconnect);
      };

      this.websocket.onmessage = function (e) {
        if (e.data instanceof Buffer) {
          if (!zlib) zlib = require("zlib");
          e.data = zlib.inflateSync(e.data).toString();
        }

        var packet = void 0;
        try {
          packet = JSON.parse(e.data);
        } catch (e) {
          _this42.client.emit("error", e);
          return;
        }

        _this42.client.emit("raw", packet);

        if (packet.s) {
          _this42.sequence = packet.s;
        }

        switch (packet.op) {
          case 0:
            _this42.processPacket(packet);
            break;
          case 1:
            _this42.heartbeatAcked = true;
            _this42.heartbeat();
            break;
          case 7:
            _this42.disconnected(true);
            break;
          case 9:
            _this42.sessionID = null;
            _this42.sequence = 0;
            _this42.identify();
            break;
          case 10:
            if (_this42.sessionID) {
              _this42.resume();
            } else {
              _this42.identify();
            }
            _this42.heartbeatAcked = true; // start off without assuming we didn't get a missed heartbeat acknowledge right away;
            _this42.heartbeat();
            _this42.heartbeatAcked = true;
            _this42.intervals.kai = setInterval(function () {
              return _this42.heartbeat();
            }, packet.d.heartbeat_interval);
            break;
          case 11:
            _this42.heartbeatAcked = true;
            break;
          default:
            _this42.client.emit("unknown", packet);
            break;
        }
      };
    }
  }, {
    key: "processPacket",
    value: function processPacket(packet) {
      var _this43 = this;

      var client = this.client;
      var data = packet.d;
      switch (packet.t) {
        case _Constants.PacketType.RESUMED:
        case _Constants.PacketType.READY:
          {
            this.autoReconnectInterval = 1000;
            this.state = _ConnectionState2.default.READY;

            if (packet.t === _Constants.PacketType.RESUMED) {
              break;
            }

            this.sessionID = data.session_id;
            var startTime = Date.now();

            this.user = this.users.add(new _User2.default(data.user, client));

            this.forceFetchCount = {};
            this.forceFetchQueue = [];
            this.forceFetchLength = 1;

            data.guilds.forEach(function (server) {
              if (!server.unavailable) {
                server = _this43.servers.add(new _Server2.default(server, client));
                if (client.options.bot === false) {
                  _this43.unsyncedGuilds++;
                  _this43.syncGuild(server.id);
                }
                if (_this43.client.options.forceFetchUsers && server.members && server.members.length < server.memberCount) {
                  _this43.getGuildMembers(server.id, Math.ceil(server.memberCount / 1000));
                }
              } else {
                client.emit("debug", "server " + server.id + " was unavailable, could not create (ready)");
                _this43.unavailableServers.add(server);
              }
            });
            data.private_channels.forEach(function (pm) {
              _this43.private_channels.add(new _PMChannel2.default(pm, client));
            });
            if (!data.user.bot) {
              // bots dont have friends
              data.relationships.forEach(function (friend) {
                if (friend.type === 1) {
                  // is a friend
                  _this43.friends.add(new _User2.default(friend.user, client));
                } else if (friend.type === 2) {
                  // incoming friend requests
                  _this43.blocked_users.add(new _User2.default(friend.user, client));
                } else if (friend.type === 3) {
                  // incoming friend requests
                  _this43.incoming_friend_requests.add(new _User2.default(friend.user, client));
                } else if (friend.type === 4) {
                  // outgoing friend requests
                  _this43.outgoing_friend_requests.add(new _User2.default(friend.user, client));
                } else {
                  client.emit("warn", "unknown friend type " + friend.type);
                }
              });
            } else {
              this.friends = null;
              this.blocked_users = null;
              this.incoming_friend_requests = null;
              this.outgoing_friend_requests = null;
            }

            // add notes to users
            if (data.notes) {
              for (var note in data.notes) {
                if (data.notes.hasOwnProperty(note)) {
                  var _user2 = this.users.get("id", note);
                  if (_user2) {
                    var newUser = _user2;
                    newUser.note = data.notes[note];

                    this.users.update(_user2, newUser);
                  } else {
                    client.emit("warn", "note in ready packet but user not cached");
                  }
                }
              }
            }

            client.emit("debug", "ready packet took " + (Date.now() - startTime) + "ms to process");
            client.emit("debug", "ready with " + this.servers.length + " servers, " + this.unavailableServers.length + " unavailable servers, " + this.channels.length + " channels and " + this.users.length + " users cached.");

            this.restartServerCreateTimeout();

            break;
          }
        case _Constants.PacketType.MESSAGE_CREATE:
          {
            // format: https://discordapi.readthedocs.org/en/latest/reference/channels/messages.html#message-format
            var channel = this.channels.get("id", data.channel_id) || this.private_channels.get("id", data.channel_id);
            if (channel) {
              (function () {
                var msg = channel.messages.add(new _Message2.default(data, channel, client));
                channel.lastMessageID = msg.id;
                if (_this43.messageAwaits[channel.id + msg.author.id]) {
                  _this43.messageAwaits[channel.id + msg.author.id].map(function (fn) {
                    return fn(msg);
                  });
                  _this43.messageAwaits[channel.id + msg.author.id] = null;
                  client.emit("message", msg, true); //2nd param is isAwaitedMessage
                } else {
                  client.emit("message", msg);
                }
              })();
            } else {
              client.emit("warn", "message created but channel is not cached");
            }
            break;
          }
        case _Constants.PacketType.MESSAGE_DELETE:
          {
            var _channel2 = this.channels.get("id", data.channel_id) || this.private_channels.get("id", data.channel_id);
            if (_channel2) {
              // potentially blank
              var msg = _channel2.messages.get("id", data.id);
              client.emit("messageDeleted", msg, _channel2);
              if (msg) {
                _channel2.messages.remove(msg);
              } else {
                client.emit("debug", "message was deleted but message is not cached");
              }
            } else {
              client.emit("warn", "message was deleted but channel is not cached");
            }
            break;
          }
        case _Constants.PacketType.MESSAGE_DELETE_BULK:
          {
            var _ret4 = function () {
              var channel = _this43.channels.get("id", data.channel_id) || _this43.private_channels.get("id", data.channel_id);
              if (channel) {
                data.ids.forEach(function (id) {
                  // potentially blank
                  var msg = channel.messages.get("id", id);
                  client.emit("messageDeleted", msg, channel);
                  if (msg) {
                    channel.messages.remove(msg);
                  } else {
                    client.emit("debug", "message was deleted but message is not cached");
                  }
                });
              } else {
                client.emit("warn", "message was deleted but channel is not cached");
              }
              return "break";
            }();

            if (_ret4 === "break") break;
          }
        case _Constants.PacketType.MESSAGE_UPDATE:
          {
            // format https://discordapi.readthedocs.org/en/latest/reference/channels/messages.html#message-format
            var _channel3 = this.channels.get("id", data.channel_id) || this.private_channels.get("id", data.channel_id);
            if (_channel3) {
              // potentially blank
              var _msg = _channel3.messages.get("id", data.id);

              if (_msg) {
                // old message exists
                data.nonce = data.nonce !== undefined ? data.nonce : _msg.nonce;
                data.attachments = data.attachments !== undefined ? data.attachments : _msg.attachments;
                data.tts = data.tts !== undefined ? data.tts : _msg.tts;
                data.embeds = data.embeds !== undefined ? data.embeds : _msg.embeds;
                data.timestamp = data.timestamp !== undefined ? data.timestamp : _msg.timestamp;
                data.mention_everyone = data.mention_everyone !== undefined ? data.mention_everyone : _msg.everyoneMentioned;
                data.content = data.content !== undefined ? data.content : _msg.content;
                data.mentions = data.mentions !== undefined ? data.mentions : _msg.mentions;
                data.author = data.author !== undefined ? data.author : _msg.author;
                _msg = new _Message2.default(_msg, _channel3, client);
              } else if (!data.author || !data.content) {
                break;
              }
              var nmsg = new _Message2.default(data, _channel3, client);
              client.emit("messageUpdated", _msg, nmsg);
              if (_msg) {
                _channel3.messages.update(_msg, nmsg);
              }
            } else {
              client.emit("warn", "message was updated but channel is not cached");
            }
            break;
          }
        case _Constants.PacketType.SERVER_CREATE:
          {
            var server = this.servers.get("id", data.id);
            if (!server) {
              if (!data.unavailable) {
                server = this.servers.add(new _Server2.default(data, client));
                if (client.options.bot === false) {
                  this.unsyncedGuilds++;
                  this.syncGuild(server.id);
                }
                if (client.readyTime) {
                  client.emit("serverCreated", server);
                }
                if (this.client.options.forceFetchUsers && server.large && server.members.length < server.memberCount) {
                  this.getGuildMembers(server.id, Math.ceil(server.memberCount / 1000));
                }
                var unavailable = this.unavailableServers.get("id", server.id);
                if (unavailable) {
                  this.unavailableServers.remove(unavailable);
                }
                this.restartServerCreateTimeout();
              } else {
                client.emit("debug", "server was unavailable, could not create");
              }
            }
            break;
          }
        case _Constants.PacketType.SERVER_DELETE:
          {
            var _server = this.servers.get("id", data.id);
            if (_server) {
              if (!data.unavailable) {
                client.emit("serverDeleted", _server);

                var _iteratorNormalCompletion7 = true;
                var _didIteratorError7 = false;
                var _iteratorError7 = undefined;

                try {
                  for (var _iterator7 = _server.channels[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var _channel4 = _step7.value;

                    this.channels.remove(_channel4);
                  }
                } catch (err) {
                  _didIteratorError7 = true;
                  _iteratorError7 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                      _iterator7.return();
                    }
                  } finally {
                    if (_didIteratorError7) {
                      throw _iteratorError7;
                    }
                  }
                }

                this.servers.remove(_server);

                var _iteratorNormalCompletion8 = true;
                var _didIteratorError8 = false;
                var _iteratorError8 = undefined;

                try {
                  for (var _iterator8 = _server.members[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var _user3 = _step8.value;

                    var found = false;
                    var _iteratorNormalCompletion9 = true;
                    var _didIteratorError9 = false;
                    var _iteratorError9 = undefined;

                    try {
                      for (var _iterator9 = this.servers[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                        var s = _step9.value;

                        if (s.members.get("id", _user3.id)) {
                          found = true;
                          break;
                        }
                      }
                    } catch (err) {
                      _didIteratorError9 = true;
                      _iteratorError9 = err;
                    } finally {
                      try {
                        if (!_iteratorNormalCompletion9 && _iterator9.return) {
                          _iterator9.return();
                        }
                      } finally {
                        if (_didIteratorError9) {
                          throw _iteratorError9;
                        }
                      }
                    }

                    if (!found) {
                      this.users.remove(_user3);
                    }
                  }
                } catch (err) {
                  _didIteratorError8 = true;
                  _iteratorError8 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion8 && _iterator8.return) {
                      _iterator8.return();
                    }
                  } finally {
                    if (_didIteratorError8) {
                      throw _iteratorError8;
                    }
                  }
                }
              } else {
                client.emit("debug", "server was unavailable, could not update");
              }
              this.buckets["bot:msg:guild:" + packet.d.id] = this.buckets["dmsg:" + packet.d.id] = this.buckets["bdmsg:" + packet.d.id] = this.buckets["guild_member:" + packet.d.id] = this.buckets["guild_member_nick:" + packet.d.id] = undefined;
            } else {
              client.emit("warn", "server was deleted but it was not in the cache");
            }
            break;
          }
        case _Constants.PacketType.SERVER_UPDATE:
          {
            var _server2 = this.servers.get("id", data.id);
            if (_server2) {
              // server exists
              data.members = data.members || [];
              data.channels = data.channels || [];
              var newserver = new _Server2.default(data, client);
              newserver.members = _server2.members;
              newserver.memberMap = _server2.memberMap;
              newserver.channels = _server2.channels;
              if (newserver.equalsStrict(_server2)) {
                // already the same don't do anything
                client.emit("debug", "received server update but server already updated");
              } else {
                client.emit("serverUpdated", new _Server2.default(_server2, client), newserver);
                this.servers.update(_server2, newserver);
              }
            } else if (!_server2) {
              client.emit("warn", "server was updated but it was not in the cache");
            }
            break;
          }
        case _Constants.PacketType.CHANNEL_CREATE:
          {

            var _channel5 = this.channels.get("id", data.id);

            if (!_channel5) {

              var _server3 = this.servers.get("id", data.guild_id);
              if (_server3) {
                var chan = null;
                if (data.type === 0) {
                  chan = this.channels.add(new _TextChannel2.default(data, client, _server3));
                } else {
                  chan = this.channels.add(new _VoiceChannel2.default(data, client, _server3));
                }
                client.emit("channelCreated", _server3.channels.add(chan));
              } else if (data.is_private) {
                client.emit("channelCreated", this.private_channels.add(new _PMChannel2.default(data, client)));
              } else {
                client.emit("warn", "channel created but server does not exist");
              }
            } else {
              client.emit("warn", "channel created but already in cache");
            }

            break;
          }
        case _Constants.PacketType.CHANNEL_DELETE:
          {
            var _channel6 = this.channels.get("id", data.id) || this.private_channels.get("id", data.id);
            if (_channel6) {

              if (_channel6.server) {
                // accounts for PMs
                _channel6.server.channels.remove(_channel6);
                this.channels.remove(_channel6);
              } else {
                this.private_channels.remove(_channel6);
              }

              client.emit("channelDeleted", _channel6);
            } else {
              client.emit("warn", "channel deleted but already out of cache?");
            }
            break;
          }
        case _Constants.PacketType.CHANNEL_UPDATE:
          {
            var _channel7 = this.channels.get("id", data.id) || this.private_channels.get("id", data.id);
            if (_channel7) {

              if (_channel7 instanceof _PMChannel2.default) {
                //PM CHANNEL
                client.emit("channelUpdated", new _PMChannel2.default(_channel7, client), this.private_channels.update(_channel7, new _PMChannel2.default(data, client)));
              } else {
                if (_channel7.server) {
                  if (_channel7.type === 0) {
                    //TEXT CHANNEL
                    var _chan = new _TextChannel2.default(data, client, _channel7.server);
                    _chan.messages = _channel7.messages;
                    client.emit("channelUpdated", _channel7, _chan);
                    _channel7.server.channels.update(_channel7, _chan);
                    this.channels.update(_channel7, _chan);
                  } else {
                    //VOICE CHANNEL
                    data.members = _channel7.members;
                    var _chan2 = new _VoiceChannel2.default(data, client, _channel7.server);
                    client.emit("channelUpdated", _channel7, _chan2);
                    _channel7.server.channels.update(_channel7, _chan2);
                    this.channels.update(_channel7, _chan2);
                  }
                } else {
                  client.emit("warn", "channel updated but server non-existant");
                }
              }
            } else {
              client.emit("warn", "channel updated but not in cache");
            }
            break;
          }
        case _Constants.PacketType.SERVER_ROLE_CREATE:
          {
            var _server4 = this.servers.get("id", data.guild_id);
            if (_server4) {
              client.emit("serverRoleCreated", _server4.roles.add(new _Role2.default(data.role, _server4, client)), _server4);
            } else {
              client.emit("warn", "server role made but server not in cache");
            }
            break;
          }
        case _Constants.PacketType.SERVER_ROLE_DELETE:
          {
            var _server5 = this.servers.get("id", data.guild_id);
            if (_server5) {
              var role = _server5.roles.get("id", data.role_id);
              if (role) {
                _server5.roles.remove(role);
                client.emit("serverRoleDeleted", role);
              } else {
                client.emit("warn", "server role deleted but role not in cache");
              }
            } else {
              client.emit("warn", "server role deleted but server not in cache");
            }
            break;
          }
        case _Constants.PacketType.SERVER_ROLE_UPDATE:
          {
            var _server6 = this.servers.get("id", data.guild_id);
            if (_server6) {
              var _role = _server6.roles.get("id", data.role.id);
              if (_role) {
                var newRole = new _Role2.default(data.role, _server6, client);
                client.emit("serverRoleUpdated", new _Role2.default(_role, _server6, client), newRole);
                _server6.roles.update(_role, newRole);
              } else {
                client.emit("warn", "server role updated but role not in cache");
              }
            } else {
              client.emit("warn", "server role updated but server not in cache");
            }
            break;
          }
        case _Constants.PacketType.SERVER_MEMBER_ADD:
          {
            var _server7 = this.servers.get("id", data.guild_id);
            if (_server7) {

              _server7.memberMap[data.user.id] = {
                roles: data.roles,
                mute: false,
                selfMute: false,
                deaf: false,
                selfDeaf: false,
                joinedAt: Date.parse(data.joined_at),
                nick: data.nick || null
              };

              _server7.memberCount++;

              client.emit("serverNewMember", _server7, _server7.members.add(this.users.add(new _User2.default(data.user, client))));
            } else {
              client.emit("warn", "server member added but server doesn't exist in cache");
            }
            break;
          }
        case _Constants.PacketType.SERVER_MEMBER_REMOVE:
          {
            var _server8 = this.servers.get("id", data.guild_id);
            if (_server8) {
              var _user4 = this.users.get("id", data.user.id);
              if (_user4) {
                client.emit("serverMemberRemoved", _server8, _user4);
                _server8.memberMap[data.user.id] = null;
                _server8.members.remove(_user4);
                _server8.memberCount--;
              } else {
                client.emit("warn", "server member removed but user doesn't exist in cache");
              }
            } else {
              client.emit("warn", "server member removed but server doesn't exist in cache");
            }
            break;
          }
        case _Constants.PacketType.SERVER_MEMBER_UPDATE:
          {
            var _server9 = this.servers.get("id", data.guild_id);
            if (_server9) {
              var _user5 = this.users.add(new _User2.default(data.user, client));
              if (_user5) {
                var oldMember = null;
                if (_server9.memberMap[data.user.id]) {
                  oldMember = {
                    roles: _server9.memberMap[data.user.id].roles,
                    mute: _server9.memberMap[data.user.id].mute,
                    selfMute: _server9.memberMap[data.user.id].selfMute,
                    deaf: _server9.memberMap[data.user.id].deaf,
                    selfDeaf: _server9.memberMap[data.user.id].selfDeaf,
                    nick: _server9.memberMap[data.user.id].nick
                  };
                } else {
                  _server9.memberMap[data.user.id] = {};
                }
                _server9.memberMap[data.user.id].roles = data.roles ? data.roles : _server9.memberMap[data.user.id].roles;
                _server9.memberMap[data.user.id].mute = data.mute || _server9.memberMap[data.user.id].mute;
                _server9.memberMap[data.user.id].selfMute = data.self_mute === undefined ? _server9.memberMap[data.user.id].selfMute : data.self_mute;
                _server9.memberMap[data.user.id].deaf = data.deaf || _server9.memberMap[data.user.id].deaf;
                _server9.memberMap[data.user.id].selfDeaf = data.self_deaf === undefined ? _server9.memberMap[data.user.id].selfDeaf : data.self_deaf;
                _server9.memberMap[data.user.id].nick = data.nick === undefined ? _server9.memberMap[data.user.id].nick : data.nick || null;
                client.emit("serverMemberUpdated", _server9, _user5, oldMember);
              } else {
                client.emit("warn", "server member removed but user doesn't exist in cache");
              }
            } else {
              client.emit("warn", "server member updated but server doesn't exist in cache");
            }
            break;
          }
        case _Constants.PacketType.PRESENCE_UPDATE:
          {

            var _user6 = this.users.add(new _User2.default(data.user, client));
            var _server10 = this.servers.get("id", data.guild_id);

            if (_user6 && _server10) {

              _server10.members.add(_user6);

              data.user.username = data.user.username || _user6.username;
              data.user.id = data.user.id || _user6.id;
              data.user.avatar = data.user.avatar !== undefined ? data.user.avatar : _user6.avatar;
              data.user.discriminator = data.user.discriminator || _user6.discriminator;
              data.user.status = data.status || _user6.status;
              data.user.game = data.game !== undefined ? data.game : _user6.game;
              data.user.bot = data.user.bot !== undefined ? data.user.bot : _user6.bot;

              var presenceUser = new _User2.default(data.user, client);

              if (!presenceUser.equalsStrict(_user6)) {
                client.emit("presence", _user6, presenceUser);
                this.users.update(_user6, presenceUser);
              }
            } else {
              client.emit("warn", "presence update but user/server not in cache");
            }

            break;
          }
        case _Constants.PacketType.USER_UPDATE:
          {

            var _user7 = this.users.get("id", data.id);

            if (_user7) {

              data.username = data.username || _user7.username;
              data.id = data.id || _user7.id;
              data.avatar = data.avatar || _user7.avatar;
              data.discriminator = data.discriminator || _user7.discriminator;
              this.email = data.email || this.email;

              var _presenceUser = new _User2.default(data, client);

              client.emit("presence", _user7, _presenceUser);
              this.users.update(_user7, _presenceUser);
            } else {
              client.emit("warn", "user update but user not in cache (this should never happen)");
            }

            break;
          }
        case _Constants.PacketType.TYPING:
          {
            var _ret5 = function () {

              var user = _this43.users.get("id", data.user_id);
              var channel = _this43.channels.get("id", data.channel_id) || _this43.private_channels.get("id", data.channel_id);

              if (user && channel) {
                if (user.typing.since) {
                  user.typing.since = Date.now();
                  user.typing.channel = channel;
                } else {
                  user.typing.since = Date.now();
                  user.typing.channel = channel;
                  client.emit("userTypingStarted", user, channel);
                }
                setTimeout(function () {
                  if (Date.now() - user.typing.since > 5500) {
                    // they haven't typed since
                    user.typing.since = null;
                    user.typing.channel = null;
                    client.emit("userTypingStopped", user, channel);
                  }
                }, 6000);
              } else {
                client.emit("warn", "user typing but user or channel not existant in cache");
              }
              return "break";
            }();

            if (_ret5 === "break") break;
          }
        case _Constants.PacketType.SERVER_BAN_ADD:
          {
            var _user8 = this.users.get("id", data.user.id);
            var _server11 = this.servers.get("id", data.guild_id);

            if (_user8 && _server11) {
              client.emit("userBanned", _user8, _server11);
            } else {
              client.emit("warn", "user banned but user/server not in cache.");
            }
            break;
          }
        case _Constants.PacketType.SERVER_BAN_REMOVE:
          {
            var _user9 = this.users.get("id", data.user.id);
            var _server12 = this.servers.get("id", data.guild_id);

            if (_user9 && _server12) {
              client.emit("userUnbanned", _user9, _server12);
            } else {
              client.emit("warn", "user unbanned but user/server not in cache.");
            }
            break;
          }
        case _Constants.PacketType.USER_NOTE_UPDATE:
          {
            if (this.user.bot) {
              return;
            }
            var _user10 = this.users.get("id", data.id);
            var oldNote = _user10.note;
            var _note = data.note || null;

            // user in cache
            if (_user10) {
              var updatedUser = _user10;
              updatedUser.note = _note;

              client.emit("noteUpdated", _user10, oldNote);

              this.users.update(_user10, updatedUser);
            } else {
              client.emit("warn", "note updated but user not in cache");
            }
            break;
          }
        case _Constants.PacketType.VOICE_STATE_UPDATE:
          {
            var _user11 = this.users.get("id", data.user_id);
            var _server13 = this.servers.get("id", data.guild_id);

            if (_user11 && _server13) {

              if (data.channel_id) {
                // in voice channel
                var _channel8 = this.channels.get("id", data.channel_id);
                if (_channel8 && _channel8.type === 2) {
                  _server13.eventVoiceStateUpdate(_channel8, _user11, data);
                } else {
                  client.emit("warn", "voice state channel not in cache");
                }
              } else {
                // not in voice channel
                client.emit("voiceLeave", _server13.eventVoiceLeave(_user11), _user11);
              }
            } else {
              client.emit("warn", "voice state update but user or server not in cache");
            }

            if (_user11 && _user11.id === this.user.id) {
              // only for detecting self user movements for connections.
              var connection = this.voiceConnections.get("server", _server13);
              // existing connection, perhaps channel moved
              if (connection && connection.voiceChannel && connection.voiceChannel.id !== data.channel_id) {
                // moved, update info
                connection.voiceChannel = this.channels.get("id", data.channel_id);
                client.emit("voiceMoved", connection.voiceChannel); // Moved to a new channel
              }
            }

            break;
          }
        case _Constants.PacketType.SERVER_MEMBERS_CHUNK:
          {

            var _server14 = this.servers.get("id", data.guild_id);

            if (_server14) {

              var testtime = Date.now();

              var _iteratorNormalCompletion10 = true;
              var _didIteratorError10 = false;
              var _iteratorError10 = undefined;

              try {
                for (var _iterator10 = data.members[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                  var _user12 = _step10.value;

                  _server14.memberMap[_user12.user.id] = {
                    roles: _user12.roles,
                    mute: _user12.mute,
                    selfMute: false,
                    deaf: _user12.deaf,
                    selfDeaf: false,
                    joinedAt: Date.parse(_user12.joined_at),
                    nick: _user12.nick || null
                  };
                  _server14.members.add(this.users.add(new _User2.default(_user12.user, client)));
                }
              } catch (err) {
                _didIteratorError10 = true;
                _iteratorError10 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion10 && _iterator10.return) {
                    _iterator10.return();
                  }
                } finally {
                  if (_didIteratorError10) {
                    throw _iteratorError10;
                  }
                }
              }

              if (this.forceFetchCount.hasOwnProperty(_server14.id)) {
                if (this.forceFetchCount[_server14.id] <= 1) {
                  delete this.forceFetchCount[_server14.id];
                  this.restartServerCreateTimeout();
                } else {
                  this.forceFetchCount[_server14.id]--;
                }
              }

              client.emit("debug", Date.now() - testtime + "ms for " + data.members.length + " user chunk for server with id " + _server14.id);
            } else {
              client.emit("warn", "chunk update received but server not in cache");
            }

            break;
          }
        case _Constants.PacketType.FRIEND_ADD:
          {
            if (this.user.bot) {
              return;
            }
            if (data.type === 1) {
              // accepted/got accepted a friend request
              var inUser = this.incoming_friend_requests.get("id", data.id);
              if (inUser) {
                // client accepted another user
                this.incoming_friend_requests.remove(this.friends.add(new _User2.default(data.user, client)));
                return;
              }

              var outUser = this.outgoing_friend_requests.get("id", data.id);
              if (outUser) {
                // another user accepted the client
                this.outgoing_friend_requests.remove(this.friends.add(new _User2.default(data.user, client)));
                client.emit("friendRequestAccepted", outUser);
                return;
              }
            } else if (data.type === 2) {
              // client received block
              this.blocked_users.add(new _User2.default(data.user, client));
            } else if (data.type === 3) {
              // client received friend request
              client.emit("friendRequestReceived", this.incoming_friend_requests.add(new _User2.default(data.user, client)));
            } else if (data.type === 4) {
              // client sent friend request
              this.outgoing_friend_requests.add(new _User2.default(data.user, client));
            }
            break;
          }
        case _Constants.PacketType.FRIEND_REMOVE:
          {
            if (this.user.bot) {
              return;
            }
            var _user13 = this.friends.get("id", data.id);
            if (_user13) {
              this.friends.remove(_user13);
              client.emit("friendRemoved", _user13);
              return;
            }

            _user13 = this.blocked_users.get("id", data.id);
            if (_user13) {
              // they rejected friend request
              this.blocked_users.remove(_user13);
              return;
            }

            _user13 = this.incoming_friend_requests.get("id", data.id);
            if (_user13) {
              // they rejected outgoing friend request OR client user manually deleted incoming through web client/other clients
              var rejectedUser = this.outgoing_friend_requests.get("id", _user13.id);
              if (rejectedUser) {
                // other person rejected outgoing
                client.emit("friendRequestRejected", this.outgoing_friend_requests.remove(rejectedUser));
                return;
              }

              // incoming deleted manually
              this.incoming_friend_requests.remove(_user13);
              return;
            }

            _user13 = this.outgoing_friend_requests.get("id", data.id);
            if (_user13) {
              // client cancelled incoming friend request OR client user manually deleted outgoing through web client/other clients
              var incomingCancel = this.incoming_friend_requests.get("id", _user13.id);
              if (incomingCancel) {
                // client cancelled incoming
                this.incoming_friend_requests.remove(_user13);
                return;
              }

              // outgoing deleted manually
              this.outgoing_friend_requests.remove(_user13);
              return;
            }
            break;
          }
        case _Constants.PacketType.SERVER_SYNC:
          {
            var _ret6 = function () {
              var guild = _this43.servers.get(data.id);
              data.members.forEach(function (dataUser) {
                guild.memberMap[dataUser.user.id] = {
                  roles: dataUser.roles,
                  mute: dataUser.mute,
                  selfMute: dataUser.self_mute,
                  deaf: dataUser.deaf,
                  selfDeaf: dataUser.self_deaf,
                  joinedAt: Date.parse(dataUser.joined_at),
                  nick: dataUser.nick || null
                };
                guild.members.add(client.internal.users.add(new _User2.default(dataUser.user, client)));
              });
              var _iteratorNormalCompletion11 = true;
              var _didIteratorError11 = false;
              var _iteratorError11 = undefined;

              try {
                for (var _iterator11 = data.presences[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                  var presence = _step11.value;

                  var _user15 = client.internal.users.get("id", presence.user.id);
                  if (_user15) {
                    _user15.status = presence.status;
                    _user15.game = presence.game;
                  }
                }
              } catch (err) {
                _didIteratorError11 = true;
                _iteratorError11 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion11 && _iterator11.return) {
                    _iterator11.return();
                  }
                } finally {
                  if (_didIteratorError11) {
                    throw _iteratorError11;
                  }
                }
              }

              if (guild.pendingVoiceStates && guild.pendingVoiceStates.length > 0) {
                var _iteratorNormalCompletion12 = true;
                var _didIteratorError12 = false;
                var _iteratorError12 = undefined;

                try {
                  for (var _iterator12 = guild.pendingVoiceStates[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                    var voiceState = _step12.value;

                    var _user14 = guild.members.get("id", voiceState.user_id);
                    if (_user14) {
                      guild.memberMap[_user14.id] = guild.memberMap[_user14.id] || {};
                      guild.memberMap[_user14.id].mute = voiceState.mute || guild.memberMap[_user14.id].mute;
                      guild.memberMap[_user14.id].selfMute = voiceState.self_mute === undefined ? guild.memberMap[_user14.id].selfMute : voiceState.self_mute;
                      guild.memberMap[_user14.id].deaf = voiceState.deaf || guild.memberMap[_user14.id].deaf;
                      guild.memberMap[_user14.id].selfDeaf = voiceState.self_deaf === undefined ? guild.memberMap[_user14.id].selfDeaf : voiceState.self_deaf;
                      var _channel9 = guild.channels.get("id", voiceState.channel_id);
                      if (_channel9) {
                        guild.eventVoiceJoin(_user14, _channel9);
                      } else {
                        guild.client.emit("warn", "channel doesn't exist even though GUILD_SYNC expects them to");
                      }
                    } else {
                      guild.client.emit("warn", "user doesn't exist even though GUILD_SYNC expects them to");
                    }
                  }
                } catch (err) {
                  _didIteratorError12 = true;
                  _iteratorError12 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion12 && _iterator12.return) {
                      _iterator12.return();
                    }
                  } finally {
                    if (_didIteratorError12) {
                      throw _iteratorError12;
                    }
                  }
                }
              }
              guild.pendingVoiceStates = null;
              _this43.unsyncedGuilds--;
              _this43.restartServerCreateTimeout();
              return "break";
            }();

            if (_ret6 === "break") break;
          }
        default:
          {
            client.emit("unknown", packet);
            break;
          }
      }
    }
  }, {
    key: "resume",
    value: function resume() {
      var data = {
        op: 6,
        d: {
          token: this.token,
          session_id: this.sessionID,
          seq: this.sequence
        }
      };

      this.sendWS(data);
    }
  }, {
    key: "identify",
    value: function identify() {
      var data = {
        op: 2,
        d: {
          token: this.token,
          v: GATEWAY_VERSION,
          compress: this.client.options.compress,
          large_threshold: this.client.options.largeThreshold,
          properties: {
            "$os": process.platform,
            "$browser": "discord.js",
            "$device": "discord.js",
            "$referrer": "",
            "$referring_domain": ""
          }
        }
      };

      if (this.client.options.shard) {
        data.d.shard = this.client.options.shard;
      }

      this.sendWS(data);
    }
  }, {
    key: "heartbeat",
    value: function heartbeat() {
      if (!this.heartbeatAcked) this.disconnected(true);
      this.heartbeatAcked = false;
      this.sendWS({ op: 1, d: Date.now() });
    }
  }, {
    key: "uptime",
    get: function get() {
      return this.readyTime ? Date.now() - this.readyTime : null;
    }
  }, {
    key: "userAgent",
    set: function set(info) {
      info.full = "DiscordBot (" + info.url + ", " + info.version + ")";
      this.userAgentInfo = info;
    },
    get: function get() {
      return this.userAgentInfo;
    }
  }, {
    key: "voiceConnection",
    get: function get() {
      return this.voiceConnections[0];
    }
  }]);

  return InternalClient;
}();

exports.default = InternalClient;
//# sourceMappingURL=InternalClient.js.map
