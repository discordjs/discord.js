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
	
	/*
		def login
	*/
	login(email, password, cb=function(err, token){}){
		var self = this;
		return new Promise(function(resolve, reject){
			
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
	
	/*
	
	*/
	
}

module.exports = Client;