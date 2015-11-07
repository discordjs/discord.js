"use strict";

var cpoc = require("child_process");
var opus = require("node-opus");
var VoicePacket = require("./VoicePacket.js");

class AudioEncoder{
	constructor(){
		this.opus = new opus.OpusEncoder(48000, 1);
	}
	
	opusBuffer(buffer){
		
		return this.opus.encode(buffer, 1920);
		
	}
	
	encodeFile(file, callback=function(err, buffer){}){
		var self = this;
		return new Promise((resolve, reject) => {
			var enc = cpoc.spawn("ffmpeg" , [
				"-i", file,
				"-f", "s16le",
				"-ar", "48000",
				"-ac", "1",
				"-af", "volume=1",
				"pipe:1"
			]);
			
			enc.stdout.on("readable", function() {
				callback(null, {
					proc : enc,
					stream : enc.stdout
				});
				resolve({
					proc : enc,
					stream : enc.stdout
				});
			});
	
			enc.stdout.on("end", function() {
				callback("end");
				reject("end");
			});
						
			enc.stdout.on("close", function() {
				callback("close");
				reject("close");
			});
		});
	}
}

module.exports = AudioEncoder;