"use strict";

var request = require("superagent");
var Endpoints = require("./Endpoints.js");
var Client = require("./Client.js");

var Discord = {
	Endpoints: Endpoints,
	Client: Client
};

module.exports = Discord;