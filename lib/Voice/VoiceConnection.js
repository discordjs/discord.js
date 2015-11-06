"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebSocket = require("ws");
var dgram = require("dgram");

var VoiceConnection = function VoiceConnection(channel, client, session, token, server, endpoint) {
	_classCallCheck(this, VoiceConnection);

	this.voiceChannel = channel;
	this.client = client;
	this.session = session;
	this.token = token;
	this.server = server;
	this.endpoint = endpoint;
	console.log("I was instantiated!");
};

module.exports = VoiceConnection;