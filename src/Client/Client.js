"use strict";

import InternalClient from "./InternalClient";
import EventEmitter from "events";
import PMChannel from "../Structures/PMChannel";

// This utility function creates an anonymous error handling wrapper function
// for a given callback. It is used to allow error handling inside the callback
// and using other means.
function constructErrorCallback(callback) {
	return error => {
		callback(error);
		throw error;
	};
}

export default class Client extends EventEmitter {
	/*
		this class is an interface for the internal
		client.
	*/
	constructor(options = {}) {
		super();
		this.options = options || {};
		this.options.compress = options.compress || true;
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

	// def login
	login(email, password, callback = (/*err, token*/) => { }) {
		return this.internal.login(email, password)
			.then(token => {
				callback(null, token);
				return token;
			}, constructErrorCallback(callback));
	}

	// def logout
	logout(callback = (/*err*/) => { }) {
		return this.internal.logout()
			.then(callback, constructErrorCallback(callback));
	}

	// def destroy
	destroy(callback = (/*err*/) => { }) {
		this.internal.logout()
			.then(() => {
				this.internal.disconnected(true);
			});
	}

	// def sendMessage
	sendMessage(where, content, options = {}, callback = (/*e, m*/) => { }) {
		if (typeof options === "function") {
			// options is the callback
			callback = options;
		}

		return this.internal.sendMessage(where, content, options)
			.then(m => {
				callback(null, m);
				return m;
			}, constructErrorCallback(callback));
	}

	// def sendTTSMessage
	sendTTSMessage(where, content, callback = (/*e, m*/) => { }) {
		return this.sendMessage(where, content, { tts: true })
			.then(m => {
				callback(null, m);
				return m;
			}, constructErrorCallback(callback));
	}
	// def reply
	reply(where, content, options = {}, callback = (/*e, m*/) => { }) {

		if (typeof options === "function") {
			// options is the callback
			callback = options;
		}

		var msg = this.internal.resolver.resolveMessage(where);
		if (msg) {
			if (!(msg.channel instanceof PMChannel)) {
				content = msg.author + ", " + content;
			}
			return this.internal.sendMessage(msg, content, options)
				.then(m => {
					callback(null, m);
					return m;
				}, constructErrorCallback(callback));
		}
		var err = new Error("Destination not resolvable to a message!");
		callback(err);
		return Promise.reject(err);
	}

	// def replyTTS
	replyTTS(where, content, callback = (/**/) => { }) {
		return this.reply(where, content, { tts: true })
			.then(m => {
				callback(null, m);
				return m;
			}, constructErrorCallback(callback));
	}
	// def deleteMessage
	deleteMessage(msg, options = {}, callback = (/*e*/) => { }) {
		if (typeof options === "function") {
			// options is the callback
			callback = options;
		}

		return this.internal.deleteMessage(msg, options)
			.then(callback, constructErrorCallback(callback));
	}
	//def updateMessage
	updateMessage(msg, content, options = {}, callback = (/*err, msg*/) => { }) {
		if (typeof options === "function") {
			// options is the callback
			callback = options;
		}

		return this.internal.updateMessage(msg, content, options)
			.then(msg => {
				callback(null, msg);
				return msg;
			}, constructErrorCallback(callback));
	}

	// def getChannelLogs
	getChannelLogs(where, limit = 500, options = {}, callback = (/*err, logs*/) => { }) {
		if (typeof options === "function") {
			// options is the callback
			callback = options;
		}

		return this.internal.getChannelLogs(where, limit, options)
			.then(logs => {
				callback(null, logs);
				return logs;
			}, constructErrorCallback(callback));
	}

	// def getBans
	getBans(where, callback = (/*err, bans*/) => { }) {
		return this.internal.getBans(where)
			.then(bans => {
				callback(null, bans);
				return bans;
			}, constructErrorCallback(callback));
	}

	// def sendFile
	sendFile(where, attachment, name = "image.png", callback = (/*err, m*/) => { }) {
		return this.internal.sendFile(where, attachment, name)
			.then(m => {
				callback(null, m);
				return m;
			}, constructErrorCallback(callback));
	}

	// def joinServer
	joinServer(invite, callback = (/*err, srv*/) => { }) {
		return this.internal.joinServer(invite)
			.then(srv => {
				callback(null, srv);
				return srv;
			}, constructErrorCallback(callback));
	}

	// def createServer
	createServer(name, region = "london", callback = (/*err, srv*/) => { }) {
		return this.internal.createServer(name, region)
			.then(srv => {
				callback(null, srv);
				return srv;
			}, constructErrorCallback(callback));
	}

	// def leaveServer
	leaveServer(server, callback = (/*err*/) => { }) {
		return this.internal.leaveServer(server)
			.then(callback, constructErrorCallback(callback));
	}

	// def deleteServer
	deleteServer(server, callback = (/*err*/) => { }) {
		return this.internal.leaveServer(server)
			.then(callback, constructErrorCallback(callback));
	}

	// def createChannel
	createChannel(server, name, type = "text", callback = (/*err, channel*/) => { }) {
		if (typeof type === "function") {
			// options is the callback
			callback = type;
		}
		return this.internal.createChannel(server, name, type)
			.then(channel => {
				callback(channel);
				return channel;
			}, constructErrorCallback(callback));
	}

	// def deleteChannel
	deleteChannel(channel, callback = (/*err*/) => { }) {
		return this.internal.deleteChannel(channel)
			.then(callback, constructErrorCallback(callback));
	}

	//def banMember
	banMember(user, server, length = 1, callback = (/*err*/) => { }) {

		if (typeof length === "function") {
			// length is the callback
			callback = length;
		}
		return this.internal.banMember(user, server, length)
			.then(callback, constructErrorCallback(callback));
	}

	//def unbanMember
	unbanMember(user, server, callback = (/*err*/) => { }) {
		return this.internal.unbanMember(user, server)
			.then(callback, constructErrorCallback(callback));
	}

	//def kickMember
	kickMember(user, server, callback = (/*err*/) => { }) {
		return this.internal.kickMember(user, server)
			.then(callback, constructErrorCallback(callback));
	}

	//def createRole
	createRole(server, data = null, callback = (/*err, res*/) => { }) {
		if (typeof data === "function") {
			// data is the callback
			callback = data;
		}
		return this.internal.createRole(server, data)
			.then(role => {
				callback(null, role);
				return role;
			}, constructErrorCallback(callback));
	}

	//def updateRole
	updateRole(role, data = null, callback = (/*err, res*/) => { }) {
		if (typeof data === "function") {
			// data is the callback
			callback = data;
		}
		return this.internal.updateRole(role, data)
			.then(role => {
				callback(null, role);
				return role;
			}, constructErrorCallback(callback));
	}

	//def deleteRole
	deleteRole(role, callback = (/*err*/) => { }) {
		return this.internal.deleteRole(role)
			.then(callback, constructErrorCallback(callback));
	}

	//def addMemberToRole
	addMemberToRole(member, role, callback = (/*err*/) => { }) {
		return this.internal.addMemberToRole(member, role)
			.then(callback, constructErrorCallback(callback));
	}

	// def addUserToRole
	addUserToRole(member, role, callback = (/*err*/) => { }) {
		return this.addMemberToRole(member, role, callback);
	}

	// def removeMemberFromRole
	removeMemberFromRole(member, role, callback = (/*err*/) => { }) {
		return this.internal.removeMemberFromRole(member, role)
			.then(callback, constructErrorCallback(callback));
	}

	// def removeUserFromRole
	removeUserFromRole(member, role, callback = (/*err*/) => { }) {
		return this.removeMemberFromRole(member, role, callback);
	}

	//def addMemberToRole
	addMemberToRoles(member, roles, callback = (/*err*/) => { }) {
		return this.internal.addMemberToRoles(member, roles)
			.then(callback, constructErrorCallback(callback));
	}

	// def addUserToRole
	addUserToRoles(member, roles, callback = (/*err*/) => { }) {
		return this.addMemberToRoles(member, roles, callback);
	}

	// def removeMemberFromRole
	removeMemberFromRoles(member, roles, callback = (/*err*/) => { }) {
		return this.internal.removeMemberFromRoles(member, roles)
			.then(callback, constructErrorCallback(callback));
	}

	// def removeUserFromRole
	removeUserFromRoles(member, roles, callback = (/*err*/) => { }) {
		return this.removeMemberFromRoles(member, roles, callback);
	}

	// def createInvite
	createInvite(chanServ, options, callback = (/*err, invite*/) => { }) {

		if (typeof options === "function") {
			// length is the callback
			callback = options;
		}

		return this.internal.createInvite(chanServ, options)
			.then(invite => {
				callback(null, invite);
			}, constructErrorCallback(callback));
	}

	// def deleteInvite
	deleteInvite(invite, callback = (/*err*/) => { }) {
		return this.internal.deleteInvite(invite)
			.then(callback, constructErrorCallback(callback));
	}

	// def overwritePermissions
	overwritePermissions(channel, role, options = {}, callback = (/*err*/) => { }) {
		return this.internal.overwritePermissions(channel, role, options)
			.then(callback, constructErrorCallback(callback));
	}

	//def setStatus
	setStatus(idleStatus, gameID, callback = (/*err*/) => { }) {

		if (typeof gameID === "function") {
			// gameID is the callback
			callback = gameID;
		} else if (typeof idleStatus === "function") {
			// idleStatus is the callback
			callback = idleStatus;
		}

		return this.internal.setStatus(idleStatus, gameID)
			.then(callback, constructErrorCallback(callback));
	}

	//def sendTyping
	sendTyping(channel, callback = (/*err*/) => { }) {
		return this.internal.sendTyping(channel)
			.then(callback, constructErrorCallback(callback));
	}

	// def setTopic
	setChannelTopic(channel, topic, callback = (/*err*/) => { }) {
		return this.internal.setChannelTopic(channel, topic)
			.then(callback, constructErrorCallback(callback));
	}

	//def setChannelName
	setChannelName(channel, name, callback = (/*err*/) => { }) {
		return this.internal.setChannelName(channel, name)
			.then(callback, constructErrorCallback(callback));
	}

	//def setChannelNameAndTopic
	setChannelNameAndTopic(channel, name, topic, callback = (/*err*/) => { }) {
		return this.internal.setChannelNameAndTopic(channel, name, topic)
			.then(callback, constructErrorCallback(callback));
	}

	//def setChannelPosition
	setChannelPosition(channel, position, callback = (/*err*/) => { }) {
		return this.internal.setChannelPosition(channel, position)
			.then(callback, constructErrorCallback(callback));
	}

	//def updateChannel
	updateChannel(channel, data, callback = (/*err*/) => { }) {
		return this.internal.updateChannel(channel, data)
			.then(callback, constructErrorCallback(callback));
	}

	//def startTyping
	startTyping(channel, callback = (/*err*/) => { }) {
		return this.internal.startTyping(channel)
			.then(callback, constructErrorCallback(callback));
	}

	//def stopTyping
	stopTyping(channel, callback = (/*err*/) => { }) {
		return this.internal.stopTyping(channel)
			.then(callback, constructErrorCallback(callback));
	}

	//def updateDetails
	updateDetails(details, callback = (/*err*/) => { }) {
		return this.internal.updateDetails(details)
			.then(callback, constructErrorCallback(callback));
	}

	//def setUsername
	setUsername(name, callback = (/*err*/) => { }) {
		return this.internal.setUsername(name)
			.then(callback, constructErrorCallback(callback));
	}

	//def setAvatar
	setAvatar(avatar, callback = (/*err*/) => { }) {
		return this.internal.setAvatar(avatar)
			.then(callback, constructErrorCallback(callback));
	}

	//def joinVoiceChannel
	joinVoiceChannel(channel, callback = (/*err*/) => { }) {
		return this.internal.joinVoiceChannel(channel)
			.then(chan => {
				callback(null, chan);
				return chan;
			}, constructErrorCallback(callback));
	}

	// def leaveVoiceChannel
	leaveVoiceChannel(callback = (/*err*/) => { }) {
		return this.internal.leaveVoiceChannel()
			.then(callback, constructErrorCallback(callback));
	}

	// def awaitResponse
	awaitResponse(msg, toSend = null, options = null, callback = (/*e, newMsg*/) => { }) {

		var ret;

		if (toSend) {
			if (typeof toSend === "function") {
				// (msg, callback)
				callback = toSend;
			} else {
				// (msg, toSend, ...)
				if (options) {
					if (typeof options === "function") {
						//(msg, toSend, callback)
						callback = options;
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
			.then(newMsg => {
				callback(null, newMsg);
				return newMsg;
			}, constructErrorCallback(callback));
	}

	setStatusIdle(callback = (/*err*/) => { }) {
		return this.internal.setStatus("idle")
			.then(callback, constructErrorCallback(callback));
	}

	setStatusOnline(callback = (/*err*/) => { }) {
		return this.internal.setStatus("online")
			.then(callback, constructErrorCallback(callback));
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

	setPlayingGame(game) {
		return this.setStatus(null, game);
	}
}
