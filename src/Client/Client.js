"use strict";

import InternalClient from "./InternalClient";
import EventEmitter from "events";
import PMChannel from "../Structures/PMChannel";

// This utility function creates an anonymous error handling wrapper function
// for a given callback. It is used to allow error handling inside the callback
// and using other means.
function errorCallback(callback) {
	return error => {
		callback(error);
		throw error;
	};
}

// This utility function creates an anonymous handler function to separate the
// error and the data arguments inside a callback and return the data if it is
// eventually done (for promise propagation).
function dataCallback(callback) {
	return data => {
		callback(null, data);
		return data;
	}
}

export default class Client extends EventEmitter {
	/*
		this class is an interface for the internal
		client.
	*/
	constructor(options = {}) {
		super();
		this.options = options || {};
		this.options.compress = options.compress || (!process.browser);
		this.options.revive = options.revive || false;
		this.options.rate_limit_as_error = options.rate_limit_as_error || false;
		this.internal = new InternalClient(this);
	}


	get users() {
		return this.internal.users;
	}

	get channels() {
		return this.internal.channels;
	}

	get servers() {
		return this.internal.servers;
	}

	get privateChannels() {
		return this.internal.private_channels;
	}

	get voiceConnection() {
		return this.internal.voiceConnection;
	}

	get readyTime() {
		return this.internal.readyTime;
	}

	get uptime() {
		return this.internal.uptime;
	}

	get user() {
		return this.internal.user;
	}

	get userAgent() {
		return this.internal.userAgent;
	}

	set userAgent(userAgent) {
		this.internal.userAgent = userAgent;
	}

	// def loginWithToken
	loginWithToken(token, email = null, password = null, callback = (/*err, token*/) => {}) {
		if (typeof email === "function") {
			// email is the callback
			callback = email;
			email = null;
			password = null;
		}

		return this.internal.loginWithToken(token, email, password)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def login
	login(email, password, callback = (/*err, token*/) => { }) {
		return this.internal.login(email, password)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def logout
	logout(callback = (/*err, {}*/) => { }) {
		return this.internal.logout()
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def destroy
	destroy(callback = (/*err, {}*/) => { }) {
		return this.internal.logout()
			.then(() => this.internal.disconnected(true))
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def sendMessage
	sendMessage(where, content, options = {}, callback = (/*err, msg*/) => { }) {
		if (typeof options === "function") {
			// options is the callback
			callback = options;
			options = {};
		}

		return this.internal.sendMessage(where, content, options)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def sendTTSMessage
	sendTTSMessage(where, content, callback = (/*err, msg*/) => { }) {
		return this.sendMessage(where, content, { tts: true })
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def reply
	reply(where, content, options = {}, callback = (/*err, msg*/) => { }) {
		if (typeof options === "function") {
			// options is the callback
			callback = options;
			options = {};
		}

		var msg = this.internal.resolver.resolveMessage(where);
		if (msg) {
			if (!(msg.channel instanceof PMChannel)) {
				content = msg.author + ", " + content;
			}
			return this.internal.sendMessage(msg, content, options)
				.then(dataCallback(callback), errorCallback(callback));
		}
		var err = new Error("Destination not resolvable to a message!");
		callback(err);
		return Promise.reject(err);
	}

	// def replyTTS
	replyTTS(where, content, callback = (/*err, msg*/) => { }) {
		return this.reply(where, content, { tts: true })
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def deleteMessage
	deleteMessage(msg, options = {}, callback = (/*err, {}*/) => { }) {
		if (typeof options === "function") {
			// options is the callback
			callback = options;
			options = {};
		}

		return this.internal.deleteMessage(msg, options)
			.then(dataCallback(callback), errorCallback(callback));
	}
	//def updateMessage
	updateMessage(msg, content, options = {}, callback = (/*err, msg*/) => { }) {
		if (typeof options === "function") {
			// options is the callback
			callback = options;
			options = {};
		}

		return this.internal.updateMessage(msg, content, options)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def getChannelLogs
	getChannelLogs(where, limit = 50, options = {}, callback = (/*err, logs*/) => { }) {
		if (typeof options === "function") {
			// options is the callback
			callback = options;
			options = {};
		}
		else if (typeof limit === "function") {
			// options is the callback
			callback = limit;
			limit = 50;
		}

		return this.internal.getChannelLogs(where, limit, options)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def getBans
	getBans(where, callback = (/*err, bans*/) => { }) {
		return this.internal.getBans(where)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def sendFile
	sendFile(where, attachment, name, callback = (/*err, m*/) => { }) {
		if (typeof name === "function") {
			// name is the callback
			callback = name;
			name = undefined; // Will get resolved into original filename in internal
		}

		return this.internal.sendFile(where, attachment, name)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def joinServer
	joinServer(invite, callback = (/*err, srv*/) => { }) {
		return this.internal.joinServer(invite)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def createServer
	createServer(name, region = "london", callback = (/*err, srv*/) => { }) {
		return this.internal.createServer(name, region)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def leaveServer
	leaveServer(server, callback = (/*err, {}*/) => { }) {
		return this.internal.leaveServer(server)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def updateServer
	updateServer(server, name, region, callback = (/*err, srv*/) => { }) {
		if (typeof region === "function") {
			// region is the callback
			callback = region;
			region = undefined;
		}

		return this.internal.updateServer(server, name, region)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def deleteServer
	deleteServer(server, callback = (/*err, {}*/) => { }) {
		return this.internal.leaveServer(server)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def createChannel
	createChannel(server, name, type = "text", callback = (/*err, channel*/) => { }) {
		if (typeof type === "function") {
			// options is the callback
			callback = type;
			type = "text";
		}

		return this.internal.createChannel(server, name, type)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def deleteChannel
	deleteChannel(channel, callback = (/*err, {}*/) => { }) {
		return this.internal.deleteChannel(channel)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def banMember
	banMember(user, server, length = 1, callback = (/*err, {}*/) => { }) {
		if (typeof length === "function") {
			// length is the callback
			callback = length;
			length = 1;
		}

		return this.internal.banMember(user, server, length)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def unbanMember
	unbanMember(user, server, callback = (/*err, {}*/) => { }) {
		return this.internal.unbanMember(user, server)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def kickMember
	kickMember(user, server, callback = (/*err, {}*/) => { }) {
		return this.internal.kickMember(user, server)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def moveMember
	moveMember(user, channel, callback = (/*err, {}*/) => { }) {
		return this.internal.moveMember(user, channel)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def createRole
	createRole(server, data = null, callback = (/*err, role*/) => { }) {
		if (typeof data === "function") {
			// data is the callback
			callback = data;
			data = null;
		}

		return this.internal.createRole(server, data)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def updateRole
	updateRole(role, data = null, callback = (/*err, role*/) => { }) {
		if (typeof data === "function") {
			// data is the callback
			callback = data;
			data = null;
		}
		return this.internal.updateRole(role, data)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def deleteRole
	deleteRole(role, callback = (/*err, {}*/) => { }) {
		return this.internal.deleteRole(role)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def addMemberToRole
	addMemberToRole(member, role, callback = (/*err, {}*/) => { }) {
		return this.internal.addMemberToRole(member, role)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def addUserToRole
	addUserToRole(member, role, callback = (/*err, {}*/) => { }) {
		return this.addMemberToRole(member, role, callback);
	}

	// def addUserToRole
	memberHasRole(member, role) {
		return this.internal.memberHasRole(member, role);
	}

	// def addUserToRole
	userHasRole(member, role) {
		return this.memberHasRole(member, role);
	}

	// def removeMemberFromRole
	removeMemberFromRole(member, role, callback = (/*err, {}*/) => { }) {
		return this.internal.removeMemberFromRole(member, role)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def removeUserFromRole
	removeUserFromRole(member, role, callback = (/*err, {}*/) => { }) {
		return this.removeMemberFromRole(member, role, callback);
	}

	// def createInvite
	createInvite(chanServ, options, callback = (/*err, invite*/) => { }) {
		if (typeof options === "function") {
			// options is the callback
			callback = options;
			options = undefined;
		}

		return this.internal.createInvite(chanServ, options)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def deleteInvite
	deleteInvite(invite, callback = (/*err, {}*/) => { }) {
		return this.internal.deleteInvite(invite)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def getInvite
	getInvite(invite, callback = (/*err, inv*/) => { }) {
		return this.internal.getInvite(invite)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def getInvites
	getInvites(channel, callback = (/*err, inv*/) => { }) {
		return this.internal.getInvites(channel)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def overwritePermissions
	overwritePermissions(channel, role, options = {}, callback = (/*err, {}*/) => { }) {
		return this.internal.overwritePermissions(channel, role, options)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def setStatus
	setStatus(idleStatus, game, callback = (/*err, {}*/) => { }) {
		if (typeof game === "function") {
			// game is the callback
			callback = game;
			game = null;
		} else if (typeof idleStatus === "function") {
			// idleStatus is the callback
			callback = idleStatus;
			game = null;
		}

		return this.internal.setStatus(idleStatus, game)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def sendTyping
	sendTyping(channel, callback = (/*err, {}*/) => { }) {
		return this.internal.sendTyping(channel)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def setChannelTopic
	setChannelTopic(channel, topic, callback = (/*err, {}*/) => { }) {
		return this.internal.setChannelTopic(channel, topic)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def setChannelName
	setChannelName(channel, name, callback = (/*err, {}*/) => { }) {
		return this.internal.setChannelName(channel, name)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def setChannelNameAndTopic
	setChannelNameAndTopic(channel, name, topic, callback = (/*err, {}*/) => { }) {
		return this.internal.setChannelNameAndTopic(channel, name, topic)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def setChannelPosition
	setChannelPosition(channel, position, callback = (/*err, {}*/) => { }) {
		return this.internal.setChannelPosition(channel, position)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def updateChannel
	updateChannel(channel, data, callback = (/*err, {}*/) => { }) {
		return this.internal.updateChannel(channel, data)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def startTyping
	startTyping(channel, callback = (/*err, {}*/) => { }) {
		return this.internal.startTyping(channel)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def stopTyping
	stopTyping(channel, callback = (/*err, {}*/) => { }) {
		return this.internal.stopTyping(channel)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def updateDetails
	updateDetails(details, callback = (/*err, {}*/) => { }) {
		return this.internal.updateDetails(details)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def setUsername
	setUsername(name, callback = (/*err, {}*/) => { }) {
		return this.internal.setUsername(name)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def setAvatar
	setAvatar(avatar, callback = (/*err, {}*/) => { }) {
		return this.internal.setAvatar(avatar)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def joinVoiceChannel
	joinVoiceChannel(channel, callback = (/*err, channel*/) => { }) {
		return this.internal.joinVoiceChannel(channel)
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def leaveVoiceChannel
	leaveVoiceChannel(callback = (/*err, {}*/) => { }) {
		return this.internal.leaveVoiceChannel()
			.then(dataCallback(callback), errorCallback(callback));
	}

	// def awaitResponse
	awaitResponse(msg, toSend = null, options = null, callback = (/*err, newMsg*/) => { }) {
		var ret;

		if (toSend) {
			if (typeof toSend === "function") {
				// (msg, callback)
				callback = toSend;
				toSend = null;
				options = null;
			} else {
				// (msg, toSend, ...)
				if (options) {
					if (typeof options === "function") {
						//(msg, toSend, callback)
						callback = options;
						options = null;
						ret = this.sendMessage(msg, toSend);
					} else {
						//(msg, toSend, options, callback)
						ret = this.sendMessage(msg, toSend, options);
					}
				} else {
					// (msg, toSend) promise
					ret = this.sendMessage(msg, toSend);
				}
			}
		}

		if (!ret) {
			ret = Promise.resolve();
		}
		// (msg) promise
		return ret.then(() => this.internal.awaitResponse(msg))
			.then(dataCallback(callback), errorCallback(callback));
	}

	setStatusIdle(callback = (/*err, {}*/) => { }) {
		return this.internal.setStatus("idle")
			.then(dataCallback(callback), errorCallback(callback));
	}

	setStatusOnline(callback = (/*err, {}*/) => { }) {
		return this.internal.setStatus("online")
			.then(dataCallback(callback), errorCallback(callback));
	}

	setStatusActive(callback) {
		return this.setStatusOnline(callback);
	}

	setStatusHere(callback) {
		return this.setStatusOnline(callback);
	}

	setStatusAvailable(callback) {
		return this.setStatusOnline(callback);
	}

	setStatusAway(callback) {
		return this.setStatusIdle(callback);
	}

	setPlayingGame(game, callback = (/*err, {}*/) => { }) {
		return this.setStatus(null, game, callback);
	}
}
