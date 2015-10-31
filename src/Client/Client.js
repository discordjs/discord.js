"use strict";

var InternalClient = require("./InternalClient.js");
var EventEmitter = require("events");

class Client extends EventEmitter{
	/*
		this class is an interface for the internal
		client.
	*/
	constructor(options){
		super();
		this.options = options || {};
		this.internal = new InternalClient(this);
	}
	
	// def login
	login(email, password, cb=function(err, token){}){
		var self = this;
		return new Promise((resolve, reject) => {
			
			self.internal.login(email, password)
				.then((token)=>{
					cb(null, token);
					resolve(token);
				})
				.catch((e)=>{
					cb(e);
					reject(e);
				});
			
		});
	}
	
	// def logout
	logout(cb=function(err){}){
		var self = this;
		return new Promise((resolve, reject) => {
			
			self.internal.logout()
				.then(() => {
					cb();
					resolve();
				})
				.catch((e) => {
					cb(e);
					reject(e);
				})
			
		})
	}
	
	sendMessage(where, content, options={}, callback=function(e, m){}){
		var self = this;
		return new Promise((resolve, reject) => {
			
			if(typeof options === "function"){
				// options is the callback
				callback = options;
			}
			
			self.internal.sendMessage(where, content, options)
				.then(m => {
					callback(null, m);
					resolve(m);
				}).catch(e => {
					callback(e);
					reject(e);
				});
			
		});
	}
	
	sendTTSMessage(where, content, callback=function(e, m){}){
		var self = this;
		return new Promise((resolve, reject) => {
			self.sendMessage(where, content, {tts:true})
				.then(m => {
					callback(null, m);
					resolve(m);
				}).catch(e => {
					callback(e);
					reject(e);
				});
			
		});
	}
	
	reply(where, content, options={}, callback=function(e,m){}){
		var self = this;
		return new Promise((resolve, reject) => {
			
			if(typeof options === "function"){
				// options is the callback
				callback = options;
			}
			
			var msg = self.internal.resolver.resolveMessage(where);
			if(msg){
				content = msg.author + ", " + content;
				self.internal.sendMessage(msg, content, options)
				.then(m => {
					callback(null, m);
					resolve(m);
				}).catch(e => {
					callback(e);
					reject(e);
				});
			}else{
				var err = new Error("Destination not resolvable to a message!");
				callback(err);
				reject(err);
			}
			
		});
	}
	
	replyTTS(where, content, callback=function(){}){
		return new Promise((resolve, reject)=>{
			self.reply(where, content, {tts:true})
				.then(m => {
					callback(null, m);
					resolve(m);
				}).catch(e => {
					callback(e);
					reject(e);
				});
		});
	}
}

module.exports = Client;