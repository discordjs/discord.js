"use strict";

var User = require("./user.js").User;
var List = require("./list.js").List;
var PMChannel = require("./PMChannel.js").PMChannel;

exports.Message = function (time, author, content, channel, id, mentions, everyoneMentioned, embeds) {

	if (!content) {
		message = time;
		channel = author;
		time = message.timestamp;
		author = message.author;
		content = message.content;
		id = message.id;
		mentions = message.mentions;
		everyoneMentioned = message.mention_everyone;
		embeds = message.embeds;
	}

	this.time = Date.parse(time);
	this.author = new User(author);
	this.content = content.replace(/\s+/g, ' ').trim(); //content.replace(/<[^>]*>/g, "").replace(/\s+/g, ' ').trim();
	this.channel = channel;
	this.id = id;
	this.mentions = new List("id");
	this.everyoneMentioned = everyoneMentioned;
	this.embeds = embeds;
	for (x in mentions) {
		var _mention = mentions[x];
		this.mentions.add(new User(_mention));
	}
};

exports.Message.prototype.isPM = function () {
	return this.channel instanceof PMChannel;
};

exports.Message.prototype.isMentioned = function (user) {
	return this.mentions.filter("id", user.id).length > 0;
};