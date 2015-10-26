var request = require("superagent");
var Endpoints = require("./Endpoints.js"); 
var Client = require("./Client.js");
var Colors = require("../ref/colours.js");

var Discord = {
	Endpoints : Endpoints,
	Client : Client,
	Colors : Colors
}

Discord.patchStrings = function () {

	defineProperty("bold", "**");
	defineProperty("underline", "__");
	defineProperty("strike", "~~");
	defineProperty("code", "`");
	defineProperty("codeblock", "```");
	defineProperty("newline", "\n");

	Object.defineProperty(String.prototype, "italic", {
		get: function () {
			return "*" + this + "*";
		}
	});

	function defineProperty(name, joiner) {
		Object.defineProperty(String.prototype, name, {
			get: function () {
				return joiner + this + joiner;
			}
		});
	}
}

module.exports = Discord;