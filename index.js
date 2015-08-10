var request = require("superagent");
var Endpoints = require("./lib/endpoints.js");
var Server = require("./lib/server.js").Server;
var Message = require("./lib/message.js").Message;
var User = require("./lib/user.js").User;
var Channel = require("./lib/channel.js").Channel;
var WebSocket = require('ws');

exports.Client = function(options) {

    this.options = options || {};
    this.token = "";
    this.loggedIn = false;
    this.websocket = null;
    this.events = {};
    this.user = null;
    this.channelCache = {};

}

exports.Client.prototype.triggerEvent = function(event, args) {

    if (this.events[event]) {
        this.events[event].apply(this, args);
    } else {
        return false;
    }

}

exports.Client.prototype.on = function(name, fn) {
    this.events[name] = fn;
}

exports.Client.prototype.off = function(name) {
    this.events[name] = function() {};
}

exports.Client.prototype.cacheChannel = function(id, cb) {

    if (this.channelCache[id]) {
        cb(this.channelCache[id]);
        return;
    }

    var self = this;

    request
        .get(Endpoints.CHANNELS + "/" + id)
        .set("authorization", this.token)
        .end(function(err, res) {
            var dat = res.body;
            self.channelCache[id] = new Channel(dat.name, dat.guild_id, dat.type, dat.id, dat.is_private);
            cb(self.channelCache[id]);
        });

}

exports.Client.prototype.login = function(email, password, cb) {

    var client = this;

    var details = {
        email: email,
        password: password
    };

    request
        .post(Endpoints.LOGIN)
        .send(details)
        .end(function(err, res) {
            if (!res.ok) {
                cb(err);
            } else {
                client.token = res.body.token;
                client.loggedIn = true;
                cb();
                client.connectWebsocket();
            }
        });

}

exports.Client.prototype.connectWebsocket = function(cb) {

    var client = this;

    this.websocket = new WebSocket(Endpoints.WEBSOCKET_HUB);
    this.websocket.onclose = function() {
        client.triggerEvent("disconnected");
    };
    this.websocket.onmessage = function(e) {

        var dat = JSON.parse(e.data);

        switch (dat.op) {

            case 0:
                if (dat.t === "READY") {

                    var data = dat.d;

                    self = this;
                    setInterval(function() {
                        self.keepAlive.apply(self);
                    }, data.heartbeat_interval);

                    var _servers = data.guilds,
                        servers = [];
                    for (x in _servers) {
                        _server = _servers[x];
                        servers.push(new Server(_server.region, _server.owner_id, _server.name, _server.roles[0].id, _server.members));
                    }

                    client.servers = servers;

                    client.user = new User(data.user.username, data.user.id, data.user.discriminator, data.user.avatar);

                    client.triggerEvent("ready");
                } else if (dat.t === "MESSAGE_CREATE") {

                    var data = dat.d;

                    client.cacheChannel(data.channel_id, function(channel) {
                        var message = new Message(data.timestamp, data.author, data.content, channel, data.id, data.mentions);
                        client.triggerEvent("message", [message]);
                    });

                }
                break;

        }

    };
    this.websocket.sendPacket = function(p) {
        this.send(JSON.stringify(p));
    }
    this.websocket.keepAlive = function() {

        this.sendPacket({
            op: 1,
            d: Date.now()
        });

    }
    this.websocket.onopen = function() {

        var connDat = {
            op: 2,
            d: {
                token: client.token,
                v: 2
            }
        };

        connDat.d.properties = {
            "$os": "Windows",
            "$browser": "Chrome",
            "$device": "discord.js",
            "$referrer": "",
            "$referring_domain": ""
        };

        this.sendPacket(connDat);
    }
}

exports.Client.prototype.logout = function() {

    var client = this;

    request
        .post(Endpoints.LOGOUT)
        .end(function() {
            client.loggedIn = false;
        });

}

exports.Client.prototype.createServer = function(details, cb) {

    var client = this;

    request
        .post(Endpoints.SERVERS)
        .set("authorization", client.token)
        .send(details)
        .end(function(err, res) {
            if (!res.ok) {
                cb(err);
            } else {
                cb(new Server(res.body));
            }
        });

}

exports.Client.prototype.sendMessage = function(channelId, message, _mentions){

    for(mention in _mentions){
        _mentions[mention] = _mentions[mention].id;
    }

    var client = this;
    var details = {
        content : message,
        mentions : _mentions || []
    };

    request
        .post(Endpoints.CHANNELS + "/" + channelId.id + "/messages")
        .set("authorization", client.token)
        .send(details)
        .end(function(err, res){

        });
}
