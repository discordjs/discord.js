//discord.js modules
var Endpoints = require("./Endpoints.js");

//node modules
var request = require("superagent");

var defaultOptions = {
	cache_tokens: false
}

class Client {

	constructor(options = defaultOptions, token = undefined) {
		/*
			When created, if a token is specified the Client will
			try connecting with it. If the token is incorrect, no
			further efforts will be made to connect.
		*/
        this.options = options;
		this.token = token;
		this.state = 0;
		this.websocket = null;
		this.events = new Map();
		this.user = null;
		/*
			State values:
			0 - idle
			1 - logging in
			2 - logged in
			3 - ready
			4 - disconnected
		*/
	}

	get ready() {
		return this.state === 3;
	}
	
	//def login
	login(email = "foo@bar.com", password = "pass1234s", callback = function(){}) {

		var self = this;

		if (this.state === 0 || this.state === 4) {
			
			this.state = 1; //set the state to logging in
			
			request
				.post(Endpoints.LOGIN)
				.send({
					email : email,
					password : password
				}).end(function(err, res){
					
					if(err){
						self.state = 4; //set state to disconnected
						callback(err);
					}else{
						self.state = 2; //set state to logged in (not yet ready)
						self.token = res.body.token;
					}
					
				});

		}

	}

}