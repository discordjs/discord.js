"use strict";

var WebSocket = require("ws");
var dgram = require("dgram");

class VoiceConnection{
	constructor(channel, client, session, token, server, endpoint){
		this.voiceChannel = channel;
		this.client = client;
		this.session = session;
		this.token = token;
		this.server = server;
		this.endpoint = endpoint;
		console.log("I was instantiated!");
	}
}

module.exports = VoiceConnection;