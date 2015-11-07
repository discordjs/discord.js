"use strict";

var WebSocket = require("ws");
var dns = require("dns");
var udp = require("dgram");
var Lame = require("lame");
var Opus = require('node-opus');
var Wav = require('wav');
var fs = require("fs");
var ffmpeg = require('fluent-ffmpeg');
var AudioEncoder = require("./AudioEncoder.js");
var VoicePacket = require("./VoicePacket.js");

class VoiceConnection {
	constructor(channel, client, session, token, server, endpoint) {
		this.voiceChannel = channel;
		this.client = client;
		this.session = session;
		this.token = token;
		this.server = server;
		this.endpoint = endpoint.replace(":80", "");
		this.vWS = null; // vWS means voice websocket
		this.ready = false;
		this.vWSData = {};
		this.opus = new Opus.OpusEncoder(48000, 1);
		this.encoder = new AudioEncoder();
		this.udp = null;
		this.init();
	}
	
	playRawStream(stream){
		
		var self = this;
		self.playing = true;
		
		var startTime = Date.now();
		var sequence = 0;
		var time = 0;
		var count = 0;
		
		var length = 20;
		
		function send(){
			try{
				count++;
				sequence + 10 < 65535 ? sequence += 1 : sequence = 0; 
				time + 9600 < 4294967295 ? time += 960 : time = 0;
				
				self.sendBuffer(stream.read(1920), sequence, time, (e) => {
					console.log(e);
				});
				
				var nextTime = startTime + (count * length);
				
				setTimeout(function() {
					send();
				}, length + (nextTime - Date.now()));
				
			}catch(e){
				
			}
		}
		
		self.vWS.send(JSON.stringify({
			op : 5,
			d : {
				speaking : true,
				delay : 0
			}
		}));
		send();
		
		
	}
	
	sendPacket(packet, callback=function(err){}){
		var self = this;
		self.playing = true;
		try{
			self.udp.send(packet, 0, packet.length, self.vWSData.port, self.endpoint, callback);
			
		}catch(e){
			self.playing = false;
			callback(e);
			return false;
		}
	}
	
	sendBuffer(buffer, sequence, timestamp, callback){
		var self = this;
		self.playing = true;
		try{
			
			var buffer = self.encoder.opusBuffer(buffer);
			var packet = new VoicePacket(buffer, sequence, timestamp, self.vWSData.ssrc);
			
			return self.sendPacket(packet, callback);
		
		}catch(e){
			self.playing = false;
			console.log("etype", e.stack);
			return false;
		}
	}

	test() {
		var self = this;
		this.encoder
			.encodeFile("C:/users/amish/desktop/audio.mp3")
			.catch(error)
			.then( stream => {
				
				self.playRawStream(stream);
				
			} );
		function error(){
			console.log("ERROR!");
		}
	}

	init() {
		var self = this;
		dns.lookup(this.endpoint, (err, address, family) => {
			self.endpoint = address;
			var vWS = self.vWS = new WebSocket("wss://" + this.endpoint, null, { rejectUnauthorized: false });
			var udpClient = self.udp = udp.createSocket("udp4");

			var firstPacket = true;

			var discordIP = "", discordPort = "";

			udpClient.bind({ exclusive: true });
            udpClient.on('message', function (msg, rinfo) {
                var buffArr = JSON.parse(JSON.stringify(msg)).data;
                if (firstPacket === true) {
                    for (var i = 4; i < buffArr.indexOf(0, i); i++) {
                        discordIP += String.fromCharCode(buffArr[i]);
                    }
                    discordPort = msg.readUIntLE(msg.length - 2, 2).toString(10);

                    var wsDiscPayload = {
                        "op": 1,
                        "d": {
                            "protocol": "udp",
                            "data": {
                                "address": discordIP,
                                "port": Number(discordPort),
                                "mode": self.vWSData.modes[0] //Plain
                            }
                        }
                    }
					console.log("success!!!");
                    vWS.send(JSON.stringify(wsDiscPayload));
                    firstPacket = false;
                }
            });

			vWS.on("open", () => {
				vWS.send(JSON.stringify({
					op: 0,
					d: {
						server_id: self.server.id,
						user_id: self.client.internal.user.id,
						session_id: self.session,
						token: self.token
					}
				}));
			});

			var KAI;

			vWS.on("message", (msg) => {
				var data = JSON.parse(msg);
				switch (data.op) {
					case 2:
						self.vWSData = data.d;

						KAI = setInterval(() => {
							vWS.send(JSON.stringify({
								op: 3,
								d: null
							}));
						}, data.d.heartbeat_interval);

						var udpPacket = new Buffer(70);
						udpPacket.writeUIntBE(data.d.ssrc, 0, 4);
						udpClient.send(udpPacket, 0, udpPacket.length, data.d.port, self.endpoint, err => {
							console.log("err", err);
						});
						break;
					case 4:

						self.ready = true;
						self.mode = data.d.mode;
						console.log("ready!!!");

						self.test();

						break;
				}
			});

		});
	}
}

module.exports = VoiceConnection;