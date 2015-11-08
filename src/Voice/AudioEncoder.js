"use strict";

var cpoc = require("child_process");

var opus;
try{
	opus = require("node-opus");
}catch(e){
	// no opus!
}
var VoicePacket = require("./VoicePacket.js");

class AudioEncoder{
	constructor(){
		if(opus){	
			this.opus = new opus.OpusEncoder(48000, 1);
		}
		this.choice = false;
	}
	
	opusBuffer(buffer){
		
		return this.opus.encode(buffer, 1920);
		
	}
	
	getCommand(force){
		
		if(this.choice && force)
			return choice;
		
		var choices = ["avconv", "ffmpeg"];
		
		for(var choice of choices){
			var p = cpoc.spawnSync(choice);
			if(!p.error){
				this.choice = choice;
				return choice;
			}
		}
		
		return "help";
	}
	
	encodeStream(stream, callback=function(err, buffer){}){
		var self = this;
		return new Promise((resolve, reject) => {
			var enc = cpoc.spawn(self.getCommand() , [
				"-f", "s16le",
				"-ar", "48000",
				"-ac", "1", // this can be 2 but there's no point, discord makes it mono on playback, wasted bandwidth.
				"-af", "volume=1",
				"pipe:1",
				"-i", "-"
			]);
			
			stream.pipe(enc.stdin);
			
			enc.stdout.once("readable", function() {
				callback(null, {
					proc : enc,
					stream : enc.stdout,
					instream : stream
				});
				resolve({
					proc : enc,
					stream : enc.stdout,
					instream : stream
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
	
	encodeFile(file, callback=function(err, buffer){}){
		var self = this;
		return new Promise((resolve, reject) => {
			var enc = cpoc.spawn(self.getChoice() , [
				"-f", "s16le",
				"-ar", "48000",
				"-ac", "1", // this can be 2 but there's no point, discord makes it mono on playback, wasted bandwidth.
				"-af", "volume=1",
				"pipe:1",
				"-i", file
			]);
			
			enc.stdout.once("readable", function() {
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