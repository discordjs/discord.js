(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Discord = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";var _createClass=(function(){function defineProperties(target,props){for(var i=0;i < props.length;i++) {var descriptor=props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if("value" in descriptor)descriptor.writable = true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};})();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var ChannelPermissions=(function(){function ChannelPermissions(data,channel){_classCallCheck(this,ChannelPermissions);var self=this;function getBit(x){return (self.packed >>> x & 1) === 1;}this.type = data.type; //either member or role
this.id = data.id;if(this.type === "member"){this.packed = channel.server.getMember("id",data.id).evalPerms.packed;}else {this.packed = channel.server.getRole(data.id).packed;}this.packed = this.packed & ~data.deny;this.packed = this.packed | data.allow;this.deny = data.deny;this.allow = data.allow;}ChannelPermissions.prototype.getBit = function getBit(x){return (this.packed >>> x & 1) === 1;};ChannelPermissions.prototype.setBit = function setBit(){};_createClass(ChannelPermissions,[{key:"createInstantInvite",get:function get(){return this.getBit(0);},set:function set(val){this.setBit(0,val);}},{key:"manageRoles",get:function get(){return this.getBit(3);},set:function set(val){this.setBit(3,val);}},{key:"manageChannels",get:function get(){return this.getBit(4);},set:function set(val){this.setBit(4,val);}},{key:"readMessages",get:function get(){return this.getBit(10);},set:function set(val){this.setBit(10,val);}},{key:"sendMessages",get:function get(){return this.getBit(11);},set:function set(val){this.setBit(11,val);}},{key:"sendTTSMessages",get:function get(){return this.getBit(12);},set:function set(val){this.setBit(12,val);}},{key:"manageMessages",get:function get(){return this.getBit(13);},set:function set(val){this.setBit(13,val);}},{key:"embedLinks",get:function get(){return this.getBit(14);},set:function set(val){this.setBit(14,val);}},{key:"attachFiles",get:function get(){return this.getBit(15);},set:function set(val){this.setBit(15,val);}},{key:"readMessageHistory",get:function get(){return this.getBit(16);},set:function set(val){this.setBit(16,val);}},{key:"mentionEveryone",get:function get(){return this.getBit(17);},set:function set(val){this.setBit(17,val);}},{key:"voiceConnect",get:function get(){return this.getBit(20);},set:function set(val){this.setBit(20,val);}},{key:"voiceSpeak",get:function get(){return this.getBit(21);},set:function set(val){this.setBit(21,val);}},{key:"voiceMuteMembers",get:function get(){return this.getBit(22);},set:function set(val){this.setBit(22,val);}},{key:"voiceDeafenMembers",get:function get(){return this.getBit(23);},set:function set(val){this.setBit(23,val);}},{key:"voiceMoveMembers",get:function get(){return this.getBit(24);},set:function set(val){this.setBit(24,val);}},{key:"voiceUseVoiceActivation",get:function get(){return this.getBit(25);},set:function set(val){this.setBit(25,val);}}]);return ChannelPermissions;})();module.exports = ChannelPermissions;

},{}],2:[function(require,module,exports){
//discord.js modules
"use strict";var _createClass=(function(){function defineProperties(target,props){for(var i=0;i < props.length;i++) {var descriptor=props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if("value" in descriptor)descriptor.writable = true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};})();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var Endpoints=require("./Endpoints.js");var User=require("./user.js");var Server=require("./server.js");var Channel=require("./channel.js");var Message=require("./message.js");var Invite=require("./invite.js");var PMChannel=require("./PMChannel.js");var gameMap=require("../ref/gameMap.json"); //node modules
var request=require("superagent");var WebSocket=require("ws");var fs=require("fs");var defaultOptions={queue:false};var Client=(function(){function Client(){var options=arguments.length <= 0 || arguments[0] === undefined?defaultOptions:arguments[0];var token=arguments.length <= 1 || arguments[1] === undefined?undefined:arguments[1];_classCallCheck(this,Client); /*
			When created, if a token is specified the Client will
			try connecting with it. If the token is incorrect, no
			further efforts will be made to connect.
		*/this.options = options;this.options.queue = this.options.queue;this.token = token;this.state = 0;this.websocket = null;this.events = {};this.user = null;this.alreadySentData = false;this.serverCreateListener = {};this.typingIntervals = {};this.email = "abc";this.password = "abc"; /*
			State values:
			0 - idle
			1 - logging in
			2 - logged in
			3 - ready
			4 - disconnected
		*/this.userCache = [];this.channelCache = [];this.serverCache = [];this.pmChannelCache = [];this.readyTime = null;this.checkingQueue = {};this.userTypingListener = {};this.queue = {};this.__idleTime = null;this.__gameId = null;}Client.prototype.sendPacket = function sendPacket(JSONObject){if(this.websocket.readyState === 1){this.websocket.send(JSON.stringify(JSONObject));}}; //def debug
Client.prototype.debug = function debug(message){this.trigger("debug",message);};Client.prototype.on = function on(event,fn){this.events[event] = fn;};Client.prototype.off = function off(event){this.events[event] = null;};Client.prototype.keepAlive = function keepAlive(){this.debug("keep alive triggered");this.sendPacket({op:1,d:Date.now()});}; //def trigger
Client.prototype.trigger = function trigger(event){var args=[];for(var arg in arguments) {args.push(arguments[arg]);}var evt=this.events[event];if(evt){evt.apply(this,args.slice(1));}}; //def login
Client.prototype.login = function login(){var email=arguments.length <= 0 || arguments[0] === undefined?"foo@bar.com":arguments[0];var password=arguments.length <= 1 || arguments[1] === undefined?"pass1234":arguments[1];var callback=arguments.length <= 2 || arguments[2] === undefined?function(err,token){}:arguments[2];var self=this;return new Promise(function(resolve,reject){if(self.state === 0 || self.state === 4){self.state = 1; //set the state to logging in
self.email = email;self.password = password;request.post(Endpoints.LOGIN).send({email:email,password:password}).end(function(err,res){if(err){self.state = 4; //set state to disconnected
self.trigger("disconnected");if(self.websocket){self.websocket.close();}callback(err);reject(err);}else {self.state = 2; //set state to logged in (not yet ready)
self.token = res.body.token; //set our token
self.getGateway().then(function(url){self.createws(url);callback(null,self.token);resolve(self.token);})["catch"](function(err){callback(err);reject(err);});}});}else {reject(new Error("Client already logging in or ready"));}});};Client.prototype.logout = function logout(){var callback=arguments.length <= 0 || arguments[0] === undefined?function(err){}:arguments[0];var self=this;return new Promise(function(resolve,reject){request.post(Endpoints.LOGOUT).set("authorization",self.token).end(function(err,res){if(err){callback(err);reject(err);}else {self.websocket.close();self.state = 4;callback();resolve();}});});};Client.prototype.createServer = function createServer(name,region){var callback=arguments.length <= 2 || arguments[2] === undefined?function(err,server){}:arguments[2];var self=this;return new Promise(function(resolve,reject){request.post(Endpoints.SERVERS).set("authorization",self.token).send({name:name,region:region}).end(function(err,res){if(err){callback(err);reject(err);}else { // potentially redundant in future
// creating here does NOT give us the channels of the server
// so we must wait for the guild_create event.
self.serverCreateListener[res.body.id] = [resolve,callback]; /*var srv = self.addServer(res.body);
						callback(null, srv);
						resolve(srv);*/}});});};Client.prototype.createChannel = function createChannel(server,channelName,channelType){var callback=arguments.length <= 3 || arguments[3] === undefined?function(err,chann){}:arguments[3];var self=this;return new Promise(function(resolve,reject){request.post(Endpoints.SERVERS + "/" + self.resolveServerID(server) + "/channels").set("authorization",self.token).send({name:channelName,type:channelType}).end(function(err,res){if(err){callback(err);reject(err);}else {var server=self.getServer("id",res.body.guild_id);var chann=self.addChannel(res.body,res.body.guild_id);server.addChannel(chann);callback(null,chann);resolve(chann);}});});};Client.prototype.leaveServer = function leaveServer(server){var callback=arguments.length <= 1 || arguments[1] === undefined?function(err,server){}:arguments[1];var self=this;return new Promise(function(resolve,reject){request.del(Endpoints.SERVERS + "/" + self.resolveServerID(server)).set("authorization",self.token).end(function(err,res){if(err){callback(err);reject(err);}else {self.serverCache.splice(self.serverCache.indexOf(server),1);callback(null);resolve();}});});};Client.prototype.createInvite = function createInvite(serverOrChannel,options){var callback=arguments.length <= 2 || arguments[2] === undefined?function(err,invite){}:arguments[2];var self=this;return new Promise(function(resolve,reject){var destination;if(serverOrChannel instanceof Server){destination = serverOrChannel.id;}else if(serverOrChannel instanceof Channel){destination = serverOrChannel.id;}else {destination = serverOrChannel;}options = options || {};options.max_age = options.maxAge || 0;options.max_uses = options.maxUses || 0;options.temporary = options.temporary || false;options.xkcdpass = options.xkcd || false;request.post(Endpoints.CHANNELS + "/" + destination + "/invites").set("authorization",self.token).send(options).end(function(err,res){if(err){callback(err);reject(err);}else {var inv=new Invite(res.body,self);callback(null,inv);resolve(inv);}});});};Client.prototype.startPM = function startPM(user){var self=this;return new Promise(function(resolve,reject){var userId=user;if(user instanceof User){userId = user.id;}request.post(Endpoints.USERS + "/" + self.user.id + "/channels").set("authorization",self.token).send({recipient_id:userId}).end(function(err,res){if(err){reject(err);}else {resolve(self.addPMChannel(res.body));}});});};Client.prototype.reply = function reply(destination,message,tts){var callback=arguments.length <= 3 || arguments[3] === undefined?function(err,msg){}:arguments[3];var self=this;return new Promise(function(response,reject){if(typeof tts === "function"){ // tts is a function, which means the developer wants this to be the callback
callback = tts;tts = false;}var user=destination.sender;self.sendMessage(destination,message,tts,callback,user + ", ").then(response)["catch"](reject);});};Client.prototype.deleteMessage = function deleteMessage(message,timeout){var callback=arguments.length <= 2 || arguments[2] === undefined?function(err,msg){}:arguments[2];var self=this;return new Promise(function(resolve,reject){if(timeout){setTimeout(remove,timeout);}else {remove();}function remove(){request.del(Endpoints.CHANNELS + "/" + message.channel.id + "/messages/" + message.id).set("authorization",self.token).end(function(err,res){if(err){bad();}else {good();}});}function good(){callback();resolve();}function bad(err){callback(err);reject(err);}});};Client.prototype.updateMessage = function updateMessage(message,content){var callback=arguments.length <= 2 || arguments[2] === undefined?function(err,msg){}:arguments[2];var self=this;var prom=new Promise(function(resolve,reject){content = content instanceof Array?content.join("\n"):content;if(self.options.queue){if(!self.queue[message.channel.id]){self.queue[message.channel.id] = [];}self.queue[message.channel.id].push({action:"updateMessage",message:message,content:content,then:good,error:bad});self.checkQueue(message.channel.id);}else {self._updateMessage(message,content).then(good)["catch"](bad);}function good(msg){prom.message = msg;callback(null,msg);resolve(msg);}function bad(error){prom.error = error;callback(error);reject(error);}});return prom;};Client.prototype.setUsername = function setUsername(newName){var callback=arguments.length <= 1 || arguments[1] === undefined?function(err){}:arguments[1];var self=this;return new Promise(function(resolve,reject){request.patch(Endpoints.API + "/users/@me").set("authorization",self.token).send({avatar:self.user.avatar,email:self.email,new_password:null,password:self.password,username:newName}).end(function(err){callback(err);if(err)reject(err);else resolve();});});};Client.prototype.getChannelLogs = function getChannelLogs(channel){var amount=arguments.length <= 1 || arguments[1] === undefined?500:arguments[1];var callback=arguments.length <= 2 || arguments[2] === undefined?function(err,logs){}:arguments[2];var self=this;return new Promise(function(resolve,reject){var channelID=channel;if(channel instanceof Channel){channelID = channel.id;}request.get(Endpoints.CHANNELS + "/" + channelID + "/messages?limit=" + amount).set("authorization",self.token).end(function(err,res){if(err){callback(err);reject(err);}else {var logs=[];var channel=self.getChannel("id",channelID);for(var _iterator=res.body,_isArray=Array.isArray(_iterator),_i=0,_iterator=_isArray?_iterator:_iterator[Symbol.iterator]();;) {var _ref;if(_isArray){if(_i >= _iterator.length)break;_ref = _iterator[_i++];}else {_i = _iterator.next();if(_i.done)break;_ref = _i.value;}var message=_ref;var mentions=[];for(var _iterator2=message.mentions,_isArray2=Array.isArray(_iterator2),_i2=0,_iterator2=_isArray2?_iterator2:_iterator2[Symbol.iterator]();;) {var _ref2;if(_isArray2){if(_i2 >= _iterator2.length)break;_ref2 = _iterator2[_i2++];}else {_i2 = _iterator2.next();if(_i2.done)break;_ref2 = _i2.value;}var mention=_ref2;mentions.push(self.addUser(mention));}var author=self.addUser(message.author);logs.push(new Message(message,channel,mentions,author));}callback(null,logs);resolve(logs);}});});};Client.prototype.deleteChannel = function deleteChannel(channel){var callback=arguments.length <= 1 || arguments[1] === undefined?function(err){}:arguments[1];var self=this;return new Promise(function(resolve,reject){var channelID=channel;if(channel instanceof Channel){channelID = channel.id;}request.del(Endpoints.CHANNELS + "/" + channelID).set("authorization",self.token).end(function(err){if(err){callback(err);reject(err);}else {callback(null);resolve();}});});};Client.prototype.joinServer = function joinServer(invite){var callback=arguments.length <= 1 || arguments[1] === undefined?function(err,server){}:arguments[1];var self=this;return new Promise(function(resolve,reject){var id=invite instanceof Invite?invite.code:invite;request.post(Endpoints.API + "/invite/" + id).set("authorization",self.token).end(function(err,res){if(err){callback(err);reject(err);}else {if(self.getServer("id",res.body.guild.id)){resolve(self.getServer("id",res.body.guild.id));}else {self.serverCreateListener[res.body.guild.id] = [resolve,callback];}}});});};Client.prototype.sendFile = function sendFile(destination,file){var fileName=arguments.length <= 2 || arguments[2] === undefined?"image.png":arguments[2];var callback=arguments.length <= 3 || arguments[3] === undefined?function(err,msg){}:arguments[3];var self=this;var prom=new Promise(function(resolve,reject){var fstream;if(typeof file === "string" || file instanceof String){fstream = fs.createReadStream(file);fileName = file;}else {fstream = file;}self.resolveDestination(destination).then(send)["catch"](bad);function send(destination){if(self.options.queue){ //queue send file too
if(!self.queue[destination]){self.queue[destination] = [];}self.queue[destination].push({action:"sendFile",attachment:fstream,attachmentName:fileName,then:good,error:bad});self.checkQueue(destination);}else { //not queue
self._sendFile(destination,fstream,fileName).then(good)["catch"](bad);}}function good(msg){prom.message = msg;callback(null,msg);resolve(msg);}function bad(err){prom.error = err;callback(err);reject(err);}});return prom;};Client.prototype.sendMessage = function sendMessage(destination,message,tts){var callback=arguments.length <= 3 || arguments[3] === undefined?function(err,msg){}:arguments[3];var premessage=arguments.length <= 4 || arguments[4] === undefined?"":arguments[4];var self=this;var prom=new Promise(function(resolve,reject){if(typeof tts === "function"){ // tts is a function, which means the developer wants this to be the callback
callback = tts;tts = false;}message = premessage + resolveMessage(message);var mentions=resolveMentions();self.resolveDestination(destination).then(send)["catch"](error);function error(err){callback(err);reject(err);}function send(destination){if(self.options.queue){ //we're QUEUEING messages, so sending them sequentially based on servers.
if(!self.queue[destination]){self.queue[destination] = [];}self.queue[destination].push({action:"sendMessage",content:message,mentions:mentions,tts:!!tts, //incase it's not a boolean
then:mgood,error:mbad});self.checkQueue(destination);}else {self._sendMessage(destination,message,tts,mentions).then(mgood)["catch"](mbad);}}function mgood(msg){prom.message = msg;callback(null,msg);resolve(msg);}function mbad(error){prom.error = error;callback(error);reject(error);}function resolveMessage(){var msg=message;if(message instanceof Array){msg = message.join("\n");}return msg;}function resolveMentions(){var _mentions=[];for(var _iterator3=message.match(/<@[^>]*>/g) || [],_isArray3=Array.isArray(_iterator3),_i3=0,_iterator3=_isArray3?_iterator3:_iterator3[Symbol.iterator]();;) {var _ref3;if(_isArray3){if(_i3 >= _iterator3.length)break;_ref3 = _iterator3[_i3++];}else {_i3 = _iterator3.next();if(_i3.done)break;_ref3 = _i3.value;}var mention=_ref3;_mentions.push(mention.substring(2,mention.length - 1));}return _mentions;}});return prom;}; //def createws
Client.prototype.createws = function createws(url){if(this.websocket)return false;var self=this; //good to go
this.websocket = new WebSocket(url); //open
this.websocket.onopen = function(){self.trySendConnData(); //try connecting
}; //close
this.websocket.onclose = function(){self.trigger("disconnected");}; //message
this.websocket.onmessage = function(e){var dat=false,data={};try{dat = JSON.parse(e.data);data = dat.d;}catch(err) {self.trigger("error",err,e);return;}self.trigger("raw",dat); //valid message
switch(dat.t){case "READY":self.debug("received ready packet");self.user = self.addUser(data.user);for(var _iterator4=data.guilds,_isArray4=Array.isArray(_iterator4),_i4=0,_iterator4=_isArray4?_iterator4:_iterator4[Symbol.iterator]();;) {var _ref4;if(_isArray4){if(_i4 >= _iterator4.length)break;_ref4 = _iterator4[_i4++];}else {_i4 = _iterator4.next();if(_i4.done)break;_ref4 = _i4.value;}var _server=_ref4;var server=self.addServer(_server);}for(var _iterator5=data.private_channels,_isArray5=Array.isArray(_iterator5),_i5=0,_iterator5=_isArray5?_iterator5:_iterator5[Symbol.iterator]();;) {var _ref5;if(_isArray5){if(_i5 >= _iterator5.length)break;_ref5 = _iterator5[_i5++];}else {_i5 = _iterator5.next();if(_i5.done)break;_ref5 = _i5.value;}var _pmc=_ref5;var pmc=self.addPMChannel(_pmc);}self.trigger("ready");self.readyTime = Date.now();self.debug("cached " + self.serverCache.length + " servers, " + self.channelCache.length + " channels, " + self.pmChannelCache.length + " PMs and " + self.userCache.length + " users.");self.state = 3;setInterval(function(){self.keepAlive.apply(self);},data.heartbeat_interval);break;case "MESSAGE_CREATE":self.debug("received message");var mentions=[];data.mentions = data.mentions || []; //for some reason this was not defined at some point?
for(var _iterator6=data.mentions,_isArray6=Array.isArray(_iterator6),_i6=0,_iterator6=_isArray6?_iterator6:_iterator6[Symbol.iterator]();;) {var _ref6;if(_isArray6){if(_i6 >= _iterator6.length)break;_ref6 = _iterator6[_i6++];}else {_i6 = _iterator6.next();if(_i6.done)break;_ref6 = _i6.value;}var mention=_ref6;mentions.push(self.addUser(mention));}var channel=self.getChannel("id",data.channel_id);if(channel){var msg=channel.addMessage(new Message(data,channel,mentions,self.addUser(data.author)));self.trigger("message",msg);}break;case "MESSAGE_DELETE":self.debug("message deleted");var channel=self.getChannel("id",data.channel_id);var message=channel.getMessage("id",data.id);if(message){self.trigger("messageDelete",channel,message);channel.messages.splice(channel.messages.indexOf(message),1);}else { //don't have the cache of that message ;(
self.trigger("messageDelete",channel);}break;case "MESSAGE_UPDATE":self.debug("message updated");var channel=self.getChannel("id",data.channel_id);var formerMessage=channel.getMessage("id",data.id);if(formerMessage){ //new message might be partial, so we need to fill it with whatever the old message was.
var info={};for(var key in formerMessage) {info[key] = formerMessage[key];}for(var key in data) {info[key] = data[key];}var mentions=[];for(var _iterator7=info.mentions,_isArray7=Array.isArray(_iterator7),_i7=0,_iterator7=_isArray7?_iterator7:_iterator7[Symbol.iterator]();;) {var _ref7;if(_isArray7){if(_i7 >= _iterator7.length)break;_ref7 = _iterator7[_i7++];}else {_i7 = _iterator7.next();if(_i7.done)break;_ref7 = _i7.value;}var mention=_ref7;mentions.push(self.addUser(mention));}var newMessage=new Message(info,channel,mentions,formerMessage.author);self.trigger("messageUpdate",newMessage,formerMessage);channel.messages[channel.messages.indexOf(formerMessage)] = newMessage;} // message isn't in cache, and if it's a partial it could cause
// all hell to break loose... best to just act as if nothing happened
break;case "GUILD_DELETE":var server=self.getServer("id",data.id);if(server){self.serverCache.splice(self.serverCache.indexOf(server),1);self.trigger("serverDelete",server);}break;case "CHANNEL_DELETE":var channel=self.getChannel("id",data.id);if(channel){var server=channel.server;if(server){server.channels.splice(server.channels.indexOf(channel),1);}self.trigger("channelDelete",channel);self.serverCache.splice(self.serverCache.indexOf(channel),1);}break;case "GUILD_CREATE":var server=self.getServer("id",data.id);if(!server){ //if server doesn't already exist because duh
server = self.addServer(data);} /*else if(server.channels.length === 0){
						
						var srv = new Server(data, self);
						for(channel of data.channels){
							srv.channels.push(new Channel(channel, data.id));
						}
						self.serverCache[self.serverCache.indexOf(server)] = srv;
						
					}*/if(self.serverCreateListener[data.id]){var cbs=self.serverCreateListener[data.id];cbs[0](server); //promise then callback
cbs[1](null,server); //legacy callback
self.serverCreateListener[data.id] = null;}self.trigger("serverCreate",server);break;case "CHANNEL_CREATE":var channel=self.getChannel("id",data.id);if(!channel){var chann;if(data.is_private){chann = self.addPMChannel(data);}else {chann = self.addChannel(data,data.guild_id);}var srv=self.getServer("id",data.guild_id);if(srv){srv.addChannel(chann);}self.trigger("channelCreate",chann);}break;case "GUILD_MEMBER_ADD":var server=self.getServer("id",data.guild_id);if(server){var user=self.addUser(data.user); //if for whatever reason it doesn't exist..
self.trigger("serverNewMember",server.addMember(user,data.roles),server);}break;case "GUILD_MEMBER_REMOVE":var server=self.getServer("id",data.guild_id);if(server){var user=self.addUser(data.user); //if for whatever reason it doesn't exist..
server.removeMember("id",user.id);self.trigger("serverRemoveMember",user,server);}break;case "USER_UPDATE":if(self.user && data.id === self.user.id){var newUser=new User(data); //not actually adding to the cache
self.trigger("userUpdate",newUser,self.user);if(~self.userCache.indexOf(self.user)){self.userCache[self.userCache.indexOf(self.user)] = newUser;}self.user = newUser;}break;case "PRESENCE_UPDATE":var userInCache=self.getUser("id",data.user.id);if(userInCache){ //user exists
data.user.username = data.user.username || userInCache.username;data.user.id = data.user.id || userInCache.id;data.user.discriminator = data.user.discriminator || userInCache.discriminator;data.user.avatar = data.user.avatar || userInCache.avatar;var presenceUser=new User(data.user);if(presenceUser.equalsStrict(userInCache)){ //they're exactly the same, an actual presence update
self.trigger("presence",{user:userInCache,oldStatus:userInCache.status,status:data.status,server:self.getServer("id",data.guild_id),gameId:data.game_id});userInCache.status = data.status;userInCache.gameId = data.game_id;}else { //one of their details changed.
self.userCache[self.userCache.indexOf(userInCache)] = presenceUser;self.trigger("userUpdate",userInCache,presenceUser);}}break;case "CHANNEL_UPDATE":var channelInCache=self.getChannel("id",data.id),serverInCache=self.getServer("id",data.guild_id);if(channelInCache && serverInCache){var newChann=new Channel(data,serverInCache);newChann.messages = channelInCache.messages;self.trigger("channelUpdate",channelInCache,newChann);self.channelCache[self.channelCache.indexOf(channelInCache)] = newChann;}break;case "TYPING_START":var userInCache=self.getUser("id",data.user_id);var channelInCache=self.getChannel("id",data.channel_id);if(!self.userTypingListener[data.user_id] || self.userTypingListener[data.user_id] === -1){self.trigger("startTyping",userInCache,channelInCache);}self.userTypingListener[data.user_id] = Date.now();setTimeout(function(){if(self.userTypingListener[data.user_id] === -1){return;}if(Date.now() - self.userTypingListener[data.user_id] > 6000){ // stopped typing
self.trigger("stopTyping",userInCache,channelInCache);self.userTypingListener[data.user_id] = -1;}},6000);break;case "GUILD_ROLE_DELETE":var server=self.getServer("id",data.guild_id);var role=server.getRole(data.role_id);self.trigger("serverRoleDelete",server,role);server.removeRole(role.id);break;case "GUILD_ROLE_UPDATE":var server=self.getServer("id",data.guild_id);var role=server.getRole(data.role.id);var newRole=server.updateRole(data.role);self.trigger("serverRoleUpdate",server,role,newRole);break;default:self.debug("received unknown packet");self.trigger("unknown",dat);break;}};}; //def addUser
Client.prototype.addUser = function addUser(data){if(!this.getUser("id",data.id)){this.userCache.push(new User(data));}return this.getUser("id",data.id);}; //def addChannel
Client.prototype.addChannel = function addChannel(data,serverId){if(!this.getChannel("id",data.id)){this.channelCache.push(new Channel(data,this.getServer("id",serverId)));}return this.getChannel("id",data.id);};Client.prototype.addPMChannel = function addPMChannel(data){if(!this.getPMChannel("id",data.id)){this.pmChannelCache.push(new PMChannel(data,this));}return this.getPMChannel("id",data.id);};Client.prototype.setTopic = function setTopic(channel,topic){var callback=arguments.length <= 2 || arguments[2] === undefined?function(err){}:arguments[2];var self=this;return new Promise(function(resolve,reject){self.resolveDestination(channel).then(next)["catch"](error);function error(e){callback(e);reject(e);}function next(destination){var asChan=self.getChannel("id",destination);request.patch(Endpoints.CHANNELS + "/" + destination).set("authorization",self.token).send({name:asChan.name,position:0,topic:topic}).end(function(err,res){if(err){error(err);}else {asChan.topic = res.body.topic;resolve();callback();}});}});}; //def addServer
Client.prototype.addServer = function addServer(data){var self=this;var server=this.getServer("id",data.id);if(data.unavailable){self.trigger("unavailable",data);self.debug("Server ID " + data.id + " has been marked unavailable by Discord. It was not cached.");return;}if(!server){server = new Server(data,this);this.serverCache.push(server);if(data.channels){for(var _iterator8=data.channels,_isArray8=Array.isArray(_iterator8),_i8=0,_iterator8=_isArray8?_iterator8:_iterator8[Symbol.iterator]();;) {var _ref8;if(_isArray8){if(_i8 >= _iterator8.length)break;_ref8 = _iterator8[_i8++];}else {_i8 = _iterator8.next();if(_i8.done)break;_ref8 = _i8.value;}var channel=_ref8;server.channels.push(this.addChannel(channel,server.id));}}}for(var _iterator9=data.presences,_isArray9=Array.isArray(_iterator9),_i9=0,_iterator9=_isArray9?_iterator9:_iterator9[Symbol.iterator]();;) {var _ref9;if(_isArray9){if(_i9 >= _iterator9.length)break;_ref9 = _iterator9[_i9++];}else {_i9 = _iterator9.next();if(_i9.done)break;_ref9 = _i9.value;}var presence=_ref9;var user=self.getUser("id",presence.user.id);user.status = presence.status;user.gameId = presence.game_id;}return server;}; //def getUser
Client.prototype.getUser = function getUser(key,value){for(var _iterator10=this.userCache,_isArray10=Array.isArray(_iterator10),_i10=0,_iterator10=_isArray10?_iterator10:_iterator10[Symbol.iterator]();;) {var _ref10;if(_isArray10){if(_i10 >= _iterator10.length)break;_ref10 = _iterator10[_i10++];}else {_i10 = _iterator10.next();if(_i10.done)break;_ref10 = _i10.value;}var user=_ref10;if(user[key] === value){return user;}}return null;}; //def getChannel
Client.prototype.getChannel = function getChannel(key,value){for(var _iterator11=this.channelCache,_isArray11=Array.isArray(_iterator11),_i11=0,_iterator11=_isArray11?_iterator11:_iterator11[Symbol.iterator]();;) {var _ref11;if(_isArray11){if(_i11 >= _iterator11.length)break;_ref11 = _iterator11[_i11++];}else {_i11 = _iterator11.next();if(_i11.done)break;_ref11 = _i11.value;}var channel=_ref11;if(channel[key] === value){return channel;}}return this.getPMChannel(key,value); //might be a PM
};Client.prototype.getPMChannel = function getPMChannel(key,value){for(var _iterator12=this.pmChannelCache,_isArray12=Array.isArray(_iterator12),_i12=0,_iterator12=_isArray12?_iterator12:_iterator12[Symbol.iterator]();;) {var _ref12;if(_isArray12){if(_i12 >= _iterator12.length)break;_ref12 = _iterator12[_i12++];}else {_i12 = _iterator12.next();if(_i12.done)break;_ref12 = _i12.value;}var channel=_ref12;if(channel[key] === value){return channel;}}return null;}; //def getServer
Client.prototype.getServer = function getServer(key,value){for(var _iterator13=this.serverCache,_isArray13=Array.isArray(_iterator13),_i13=0,_iterator13=_isArray13?_iterator13:_iterator13[Symbol.iterator]();;) {var _ref13;if(_isArray13){if(_i13 >= _iterator13.length)break;_ref13 = _iterator13[_i13++];}else {_i13 = _iterator13.next();if(_i13.done)break;_ref13 = _i13.value;}var server=_ref13;if(server[key] === value){return server;}}return null;}; //def trySendConnData
Client.prototype.trySendConnData = function trySendConnData(){if(this.token && !this.alreadySentData){this.alreadySentData = true;var data={op:2,d:{token:this.token,v:3,properties:{"$os":"discord.js","$browser":"discord.js","$device":"discord.js","$referrer":"","$referring_domain":""}}};this.websocket.send(JSON.stringify(data));}};Client.prototype.resolveServerID = function resolveServerID(resource){if(resource instanceof Server){return resource.id;}else if(!isNaN(resource) && resource.length && resource.length === 17){return resource;}};Client.prototype.resolveDestination = function resolveDestination(destination){var channId=false;var self=this;return new Promise(function(resolve,reject){if(destination instanceof Server){channId = destination.id; //general is the same as server id
}else if(destination instanceof Channel){channId = destination.id;}else if(destination instanceof Message){channId = destination.channel.id;}else if(destination instanceof PMChannel){channId = destination.id;}else if(destination instanceof User){ //check if we have a PM
for(var _iterator14=self.pmChannelCache,_isArray14=Array.isArray(_iterator14),_i14=0,_iterator14=_isArray14?_iterator14:_iterator14[Symbol.iterator]();;) {var _ref14;if(_isArray14){if(_i14 >= _iterator14.length)break;_ref14 = _iterator14[_i14++];}else {_i14 = _iterator14.next();if(_i14.done)break;_ref14 = _i14.value;}var pmc=_ref14;if(pmc.user && pmc.user.equals(destination)){resolve(pmc.id);return;}} //we don't, at this point we're late
self.startPM(destination).then(function(pmc){resolve(pmc.id);})["catch"](reject);}else {channId = destination;}if(channId)resolve(channId);else reject();});};Client.prototype._sendMessage = function _sendMessage(destination,content,tts,mentions){var self=this;return new Promise(function(resolve,reject){request.post(Endpoints.CHANNELS + "/" + destination + "/messages").set("authorization",self.token).send({content:content,mentions:mentions,tts:tts}).end(function(err,res){if(err){reject(err);}else {var data=res.body;var mentions=[];data.mentions = data.mentions || []; //for some reason this was not defined at some point?
for(var _iterator15=data.mentions,_isArray15=Array.isArray(_iterator15),_i15=0,_iterator15=_isArray15?_iterator15:_iterator15[Symbol.iterator]();;) {var _ref15;if(_isArray15){if(_i15 >= _iterator15.length)break;_ref15 = _iterator15[_i15++];}else {_i15 = _iterator15.next();if(_i15.done)break;_ref15 = _i15.value;}var mention=_ref15;mentions.push(self.addUser(mention));}var channel=self.getChannel("id",data.channel_id);if(channel){var msg=channel.addMessage(new Message(data,channel,mentions,self.addUser(data.author)));resolve(msg);}}});});};Client.prototype._sendFile = function _sendFile(destination,attachment){var attachmentName=arguments.length <= 2 || arguments[2] === undefined?"DEFAULT BECAUSE YOU DIDN'T SPECIFY WHY.png":arguments[2];var self=this;return new Promise(function(resolve,reject){request.post(Endpoints.CHANNELS + "/" + destination + "/messages").set("authorization",self.token).attach("file",attachment,attachmentName).end(function(err,res){if(err){reject(err);}else {var chann=self.getChannel("id",destination);if(chann){var msg=chann.addMessage(new Message(res.body,chann,[],self.user));resolve(msg);}}});});};Client.prototype._updateMessage = function _updateMessage(message,content){var self=this;return new Promise(function(resolve,reject){request.patch(Endpoints.CHANNELS + "/" + message.channel.id + "/messages/" + message.id).set("authorization",self.token).send({content:content,mentions:[]}).end(function(err,res){if(err){reject(err);}else {var msg=new Message(res.body,message.channel,message.mentions,message.sender);resolve(msg);message.channel.messages[message.channel.messages.indexOf(message)] = msg;}});});};Client.prototype.getGateway = function getGateway(){var self=this;return new Promise(function(resolve,reject){request.get(Endpoints.API + "/gateway").set("authorization",self.token).end(function(err,res){if(err){reject(err);}else {resolve(res.body.url);}});});};Client.prototype.setStatusIdle = function setStatusIdle(){this.setStatus("idle");};Client.prototype.setStatusOnline = function setStatusOnline(){this.setStatus("online");};Client.prototype.setStatusActive = function setStatusActive(){this.setStatusOnline();};Client.prototype.setStatusHere = function setStatusHere(){this.setStatusOnline();};Client.prototype.setStatusAway = function setStatusAway(){this.setStatusIdle();};Client.prototype.startTyping = function startTyping(chann,stopTypeTime){var self=this;this.resolveDestination(chann).then(next);function next(channel){if(self.typingIntervals[channel]){return;}var fn=function fn(){request.post(Endpoints.CHANNELS + "/" + channel + "/typing").set("authorization",self.token).end();};fn();var interval=setInterval(fn,3000);self.typingIntervals[channel] = interval;if(stopTypeTime){setTimeout(function(){self.stopTyping(channel);},stopTypeTime);}}};Client.prototype.stopTyping = function stopTyping(chann){var self=this;this.resolveDestination(chann).then(next);function next(channel){if(!self.typingIntervals[channel]){return;}clearInterval(self.typingIntervals[channel]);delete self.typingIntervals[channel];}};Client.prototype.setStatus = function setStatus(stat){var idleTime=stat === "online"?null:Date.now();this.__idleTime = idleTime;this.websocket.send(JSON.stringify({op:3,d:{idle_since:this.__idleTime,game_id:this.__gameId}}));};Client.prototype.setPlayingGame = function setPlayingGame(id){if(id instanceof String || typeof id === "string"){ // working on names
var gid=id.trim().toUpperCase();id = null;for(var _iterator16=gameMap,_isArray16=Array.isArray(_iterator16),_i16=0,_iterator16=_isArray16?_iterator16:_iterator16[Symbol.iterator]();;) {var _ref16;if(_isArray16){if(_i16 >= _iterator16.length)break;_ref16 = _iterator16[_i16++];}else {_i16 = _iterator16.next();if(_i16.done)break;_ref16 = _i16.value;}var game=_ref16;if(game.name.trim().toUpperCase() === gid){id = game.id;break;}}}this.__gameId = id;this.websocket.send(JSON.stringify({op:3,d:{idle_since:this.__idleTime,game_id:this.__gameId}}));};Client.prototype.playGame = function playGame(id){this.setPlayingGame(id);};Client.prototype.playingGame = function playingGame(id){this.setPlayingGame(id);};_createClass(Client,[{key:"uptime",get:function get(){return this.readyTime?Date.now() - this.readyTime:null;}},{key:"ready",get:function get(){return this.state === 3;}},{key:"servers",get:function get(){return this.serverCache;}},{key:"channels",get:function get(){return this.channelCache;}},{key:"users",get:function get(){return this.userCache;}},{key:"PMChannels",get:function get(){return this.pmChannelCache;}},{key:"messages",get:function get(){var msgs=[];for(var _iterator17=this.channelCache,_isArray17=Array.isArray(_iterator17),_i17=0,_iterator17=_isArray17?_iterator17:_iterator17[Symbol.iterator]();;) {var _ref17;if(_isArray17){if(_i17 >= _iterator17.length)break;_ref17 = _iterator17[_i17++];}else {_i17 = _iterator17.next();if(_i17.done)break;_ref17 = _i17.value;}var channel=_ref17;msgs = msgs.concat(channel.messages);}return msgs;}}]);return Client;})();module.exports = Client;

},{"../ref/gameMap.json":19,"./Endpoints.js":3,"./PMChannel.js":6,"./channel.js":8,"./invite.js":10,"./message.js":11,"./server.js":12,"./user.js":13,"fs":14,"superagent":15,"ws":18}],3:[function(require,module,exports){
"use strict";exports.BASE_DOMAIN = "discordapp.com";exports.BASE = "https://" + exports.BASE_DOMAIN;exports.WEBSOCKET_HUB = "wss://" + exports.BASE_DOMAIN + "/hub";exports.API = exports.BASE + "/api";exports.AUTH = exports.API + "/auth";exports.LOGIN = exports.AUTH + "/login";exports.LOGOUT = exports.AUTH + "/logout";exports.USERS = exports.API + "/users";exports.SERVERS = exports.API + "/guilds";exports.CHANNELS = exports.API + "/channels";

},{}],4:[function(require,module,exports){
"use strict";var _createClass=(function(){function defineProperties(target,props){for(var i=0;i < props.length;i++) {var descriptor=props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if("value" in descriptor)descriptor.writable = true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};})();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var EvaluatedPermissions=(function(){function EvaluatedPermissions(data){_classCallCheck(this,EvaluatedPermissions);var self=this;this.packed = data;if(this.getBit(3))this.packed = 4294967295;}EvaluatedPermissions.prototype.serialise = function serialise(){return {createInstantInvite:this.createInstantInvite,manageRoles:this.manageRoles,manageChannels:this.manageChannels,readMessages:this.readMessages,sendMessages:this.sendMessage,sendTTSMessages:this.sendTTSMessages,manageMessages:this.manageMessages,embedLinks:this.embedLinks,attachFiles:this.attachFiles,readMessageHistory:this.readMessageHistory,mentionEveryone:this.mentionEveryone,voiceConnect:this.voiceConnect,voiceSpeak:this.voiceSpeak,voiceMuteMembers:this.voiceMuteMembers,voiceDeafenMembers:this.voiceDeafenMembers,voiceMoveMember:this.voiceMoveMembers,voiceUseVoiceActivation:this.voiceUseVoiceActivation};};EvaluatedPermissions.prototype.getBit = function getBit(x){return (this.packed >>> x & 1) === 1;};EvaluatedPermissions.prototype.setBit = function setBit(){};_createClass(EvaluatedPermissions,[{key:"createInstantInvite",get:function get(){return this.getBit(0);},set:function set(val){this.setBit(0,val);}},{key:"manageRoles",get:function get(){return this.getBit(3);},set:function set(val){this.setBit(3,val);}},{key:"manageChannels",get:function get(){return this.getBit(4);},set:function set(val){this.setBit(4,val);}},{key:"readMessages",get:function get(){return this.getBit(10);},set:function set(val){this.setBit(10,val);}},{key:"sendMessages",get:function get(){return this.getBit(11);},set:function set(val){this.setBit(11,val);}},{key:"sendTTSMessages",get:function get(){return this.getBit(12);},set:function set(val){this.setBit(12,val);}},{key:"manageMessages",get:function get(){return this.getBit(13);},set:function set(val){this.setBit(13,val);}},{key:"embedLinks",get:function get(){return this.getBit(14);},set:function set(val){this.setBit(14,val);}},{key:"attachFiles",get:function get(){return this.getBit(15);},set:function set(val){this.setBit(15,val);}},{key:"readMessageHistory",get:function get(){return this.getBit(16);},set:function set(val){this.setBit(16,val);}},{key:"mentionEveryone",get:function get(){return this.getBit(17);},set:function set(val){this.setBit(17,val);}},{key:"voiceConnect",get:function get(){return this.getBit(20);},set:function set(val){this.setBit(20,val);}},{key:"voiceSpeak",get:function get(){return this.getBit(21);},set:function set(val){this.setBit(21,val);}},{key:"voiceMuteMembers",get:function get(){return this.getBit(22);},set:function set(val){this.setBit(22,val);}},{key:"voiceDeafenMembers",get:function get(){return this.getBit(23);},set:function set(val){this.setBit(23,val);}},{key:"voiceMoveMembers",get:function get(){return this.getBit(24);},set:function set(val){this.setBit(24,val);}},{key:"voiceUseVoiceActivation",get:function get(){return this.getBit(25);},set:function set(val){this.setBit(25,val);}}]);return EvaluatedPermissions;})();module.exports = EvaluatedPermissions;

},{}],5:[function(require,module,exports){
"use strict";var _createClass=(function(){function defineProperties(target,props){for(var i=0;i < props.length;i++) {var descriptor=props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if("value" in descriptor)descriptor.writable = true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};})();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _inherits(subClass,superClass){if(typeof superClass !== "function" && superClass !== null){throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__ = superClass;}var User=require("./user.js");var ServerPermissions=require("./ServerPermissions.js");var EvaluatedPermissions=require("./EvaluatedPermissions.js");var Member=(function(_User){_inherits(Member,_User);function Member(user,server,roles){_classCallCheck(this,Member);_User.call(this,user); // should work, we are basically creating a Member that has the same properties as user and a few more
this.server = server;this.rawRoles = roles;}Member.prototype.permissionsIn = function permissionsIn(channel){if(channel.server.ownerID === this.id){return new EvaluatedPermissions(4294967295); //all perms
}var affectingOverwrites=[];var affectingMemberOverwrites=[];for(var _iterator=channel.roles,_isArray=Array.isArray(_iterator),_i=0,_iterator=_isArray?_iterator:_iterator[Symbol.iterator]();;) {var _ref;if(_isArray){if(_i >= _iterator.length)break;_ref = _iterator[_i++];}else {_i = _iterator.next();if(_i.done)break;_ref = _i.value;}var overwrite=_ref;if(overwrite.id === this.id && overwrite.type === "member"){affectingMemberOverwrites.push(overwrite);}else if(this.rawRoles.indexOf(overwrite.id) !== -1){affectingOverwrites.push(overwrite);}}if(affectingOverwrites.length === 0 && affectingMemberOverwrites.length === 0){return new EvaluatedPermissions(this.evalPerms.packed);}var finalPacked=affectingOverwrites.length !== 0?affectingOverwrites[0].packed:affectingMemberOverwrites[0].packed;for(var _iterator2=affectingOverwrites,_isArray2=Array.isArray(_iterator2),_i2=0,_iterator2=_isArray2?_iterator2:_iterator2[Symbol.iterator]();;) {var _ref2;if(_isArray2){if(_i2 >= _iterator2.length)break;_ref2 = _iterator2[_i2++];}else {_i2 = _iterator2.next();if(_i2.done)break;_ref2 = _i2.value;}var overwrite=_ref2;finalPacked = finalPacked & ~overwrite.deny;finalPacked = finalPacked | overwrite.allow;}for(var _iterator3=affectingMemberOverwrites,_isArray3=Array.isArray(_iterator3),_i3=0,_iterator3=_isArray3?_iterator3:_iterator3[Symbol.iterator]();;) {var _ref3;if(_isArray3){if(_i3 >= _iterator3.length)break;_ref3 = _iterator3[_i3++];}else {_i3 = _iterator3.next();if(_i3.done)break;_ref3 = _i3.value;}var overwrite=_ref3;finalPacked = finalPacked & ~overwrite.deny;finalPacked = finalPacked | overwrite.allow;}return new EvaluatedPermissions(finalPacked);};_createClass(Member,[{key:"roles",get:function get(){var ufRoles=[this.server.getRole(this.server.id)];for(var _iterator4=this.rawRoles,_isArray4=Array.isArray(_iterator4),_i4=0,_iterator4=_isArray4?_iterator4:_iterator4[Symbol.iterator]();;) {var _ref4;if(_isArray4){if(_i4 >= _iterator4.length)break;_ref4 = _iterator4[_i4++];}else {_i4 = _iterator4.next();if(_i4.done)break;_ref4 = _i4.value;}var rawRole=_ref4;ufRoles.push(this.server.getRole(rawRole));}return ufRoles;}},{key:"evalPerms",get:function get(){var basePerms=this.roles, //cache roles as it can be slightly expensive
basePerm=basePerms[0].packed;for(var _iterator5=basePerms,_isArray5=Array.isArray(_iterator5),_i5=0,_iterator5=_isArray5?_iterator5:_iterator5[Symbol.iterator]();;) {var _ref5;if(_isArray5){if(_i5 >= _iterator5.length)break;_ref5 = _iterator5[_i5++];}else {_i5 = _iterator5.next();if(_i5.done)break;_ref5 = _i5.value;}var perm=_ref5;basePerm = basePerm | perm.packed;}return new ServerPermissions({permissions:basePerm});}}]);return Member;})(User);module.exports = Member;

},{"./EvaluatedPermissions.js":4,"./ServerPermissions.js":7,"./user.js":13}],6:[function(require,module,exports){
"use strict";var _createClass=(function(){function defineProperties(target,props){for(var i=0;i < props.length;i++) {var descriptor=props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if("value" in descriptor)descriptor.writable = true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};})();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var PMChannel=(function(){function PMChannel(data,client){_classCallCheck(this,PMChannel);this.user = client.getUser("id",data.recipient.id);this.id = data.id;this.messages = [];this.client = client;}PMChannel.prototype.addMessage = function addMessage(data){if(!this.getMessage("id",data.id)){this.messages.push(data);}return this.getMessage("id",data.id);};PMChannel.prototype.getMessage = function getMessage(key,value){if(this.messages.length > 1000){this.messages.splice(0,1);}for(var _iterator=this.messages,_isArray=Array.isArray(_iterator),_i=0,_iterator=_isArray?_iterator:_iterator[Symbol.iterator]();;) {var _ref;if(_isArray){if(_i >= _iterator.length)break;_ref = _iterator[_i++];}else {_i = _iterator.next();if(_i.done)break;_ref = _i.value;}var message=_ref;if(message[key] === value){return message;}}return null;};_createClass(PMChannel,[{key:"isPrivate",get:function get(){return true;}}]);return PMChannel;})();module.exports = PMChannel;

},{}],7:[function(require,module,exports){
"use strict";var _createClass=(function(){function defineProperties(target,props){for(var i=0;i < props.length;i++) {var descriptor=props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if("value" in descriptor)descriptor.writable = true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};})();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var ServerPermissions=(function(){function ServerPermissions(data){_classCallCheck(this,ServerPermissions);var self=this;function getBit(x){return (self.packed >>> x & 1) === 1;}this.packed = data.permissions;this.name = data.name;this.id = data.id;}ServerPermissions.prototype.getBit = function getBit(x){return (this.packed >>> x & 1) === 1;};ServerPermissions.prototype.setBit = function setBit(){ //dummy function for now
};ServerPermissions.prototype.toString = function toString(){return this.name;};_createClass(ServerPermissions,[{key:"createInstantInvite",get:function get(){return this.getBit(0);},set:function set(val){this.setBit(0,val);}},{key:"banMembers",get:function get(){return this.getBit(1);},set:function set(val){this.setBit(1,val);}},{key:"kickMembers",get:function get(){return this.getBit(2);},set:function set(val){this.setBit(2,val);}},{key:"manageRoles",get:function get(){return this.getBit(3);},set:function set(val){this.setBit(3,val);}},{key:"manageChannels",get:function get(){return this.getBit(4);},set:function set(val){this.setBit(4,val);}},{key:"manageServer",get:function get(){return this.getBit(5);},set:function set(val){this.setBit(5,val);}},{key:"readMessages",get:function get(){return this.getBit(10);},set:function set(val){this.setBit(10,val);}},{key:"sendMessages",get:function get(){return this.getBit(11);},set:function set(val){this.setBit(11,val);}},{key:"sendTTSMessages",get:function get(){return this.getBit(12);},set:function set(val){this.setBit(12,val);}},{key:"manageMessages",get:function get(){return this.getBit(13);},set:function set(val){this.setBit(13,val);}},{key:"embedLinks",get:function get(){return this.getBit(14);},set:function set(val){this.setBit(14,val);}},{key:"attachFiles",get:function get(){return this.getBit(15);},set:function set(val){this.setBit(15,val);}},{key:"readMessageHistory",get:function get(){return this.getBit(16);},set:function set(val){this.setBit(16,val);}},{key:"mentionEveryone",get:function get(){return this.getBit(17);},set:function set(val){this.setBit(17,val);}},{key:"voiceConnect",get:function get(){return this.getBit(20);},set:function set(val){this.setBit(20,val);}},{key:"voiceSpeak",get:function get(){return this.getBit(21);},set:function set(val){this.setBit(21,val);}},{key:"voiceMuteMembers",get:function get(){return this.getBit(22);},set:function set(val){this.setBit(22,val);}},{key:"voiceDeafenMembers",get:function get(){return this.getBit(23);},set:function set(val){this.setBit(23,val);}},{key:"voiceMoveMembers",get:function get(){return this.getBit(24);},set:function set(val){this.setBit(24,val);}},{key:"voiceUseVoiceActivation",get:function get(){return this.getBit(25);},set:function set(val){this.setBit(25,val);}}]);return ServerPermissions;})();module.exports = ServerPermissions;

},{}],8:[function(require,module,exports){
"use strict";var _createClass=(function(){function defineProperties(target,props){for(var i=0;i < props.length;i++) {var descriptor=props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if("value" in descriptor)descriptor.writable = true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};})();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var ChannelPermissions=require("./ChannelPermissions.js");var Channel=(function(){function Channel(data,server){_classCallCheck(this,Channel);this.server = server;this.name = data.name;this.type = data.type;this.topic = data.topic;this.id = data.id;this.messages = [];this.roles = [];if(data.permission_overwrites)for(var _iterator=data.permission_overwrites,_isArray=Array.isArray(_iterator),_i=0,_iterator=_isArray?_iterator:_iterator[Symbol.iterator]();;) {var _ref;if(_isArray){if(_i >= _iterator.length)break;_ref = _iterator[_i++];}else {_i = _iterator.next();if(_i.done)break;_ref = _i.value;}var role=_ref;this.roles.push(new ChannelPermissions(role,this));} //this.isPrivate = isPrivate; //not sure about the implementation of this...
}Channel.prototype.permissionsOf = function permissionsOf(member){var mem=this.server.getMember("id",member.id);if(mem){return mem.permissionsIn(this);}else {return null;}};Channel.prototype.equals = function equals(object){return object && object.id === this.id;};Channel.prototype.addMessage = function addMessage(data){if(this.messages.length > 1000){this.messages.splice(0,1);}if(!this.getMessage("id",data.id)){this.messages.push(data);}return this.getMessage("id",data.id);};Channel.prototype.getMessage = function getMessage(key,value){for(var _iterator2=this.messages,_isArray2=Array.isArray(_iterator2),_i2=0,_iterator2=_isArray2?_iterator2:_iterator2[Symbol.iterator]();;) {var _ref2;if(_isArray2){if(_i2 >= _iterator2.length)break;_ref2 = _iterator2[_i2++];}else {_i2 = _iterator2.next();if(_i2.done)break;_ref2 = _i2.value;}var message=_ref2;if(message[key] === value){return message;}}return null;};Channel.prototype.toString = function toString(){return "<#" + this.id + ">";};_createClass(Channel,[{key:"permissionOverwrites",get:function get(){return this.roles;}},{key:"permissions",get:function get(){return this.roles;}},{key:"client",get:function get(){return this.server.client;}},{key:"isPrivate",get:function get(){return false;}},{key:"users",get:function get(){return this.server.members;}},{key:"members",get:function get(){return this.server.members;}}]);return Channel;})();module.exports = Channel;

},{"./ChannelPermissions.js":1}],9:[function(require,module,exports){
"use strict";var request=require("superagent");var Endpoints=require("./Endpoints.js");var Client=require("./Client.js");var Discord={Endpoints:Endpoints,Client:Client};Discord.patchStrings = function(){defineProperty("bold","**");defineProperty("underline","__");defineProperty("strike","~~");defineProperty("code","`");defineProperty("codeblock","```");defineProperty("newline","\n");Object.defineProperty(String.prototype,"italic",{get:function get(){return "*" + this + "*";}});function defineProperty(name,joiner){Object.defineProperty(String.prototype,name,{get:function get(){return joiner + this + joiner;}});}};module.exports = Discord;

},{"./Client.js":2,"./Endpoints.js":3,"superagent":15}],10:[function(require,module,exports){
"use strict";var _createClass=(function(){function defineProperties(target,props){for(var i=0;i < props.length;i++) {var descriptor=props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if("value" in descriptor)descriptor.writable = true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};})();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var Invite=(function(){function Invite(data,client){_classCallCheck(this,Invite);this.max_age = data.max_age;this.code = data.code;this.server = client.getServer("id",data.guild.id);this.revoked = data.revoked;this.created_at = Date.parse(data.created_at);this.temporary = data.temporary;this.uses = data.uses;this.max_uses = data.uses;this.inviter = client.addUser(data.inviter);this.xkcd = data.xkcdpass;this.channel = client.getChannel("id",data.channel.id);}_createClass(Invite,[{key:"URL",get:function get(){var code=this.xkcd?this.xkcdpass:this.code;return "https://discord.gg/" + code;}}]);return Invite;})();module.exports = Invite;

},{}],11:[function(require,module,exports){
"use strict";var _createClass=(function(){function defineProperties(target,props){for(var i=0;i < props.length;i++) {var descriptor=props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if("value" in descriptor)descriptor.writable = true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};})();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var PMChannel=require("./PMChannel.js");var Message=(function(){function Message(data,channel,mentions,author){_classCallCheck(this,Message);this.tts = data.tts;this.timestamp = Date.parse(data.timestamp);this.nonce = data.nonce;this.mentions = mentions;this.everyoneMentioned = data.mention_everyone;this.id = data.id;this.embeds = data.embeds;this.editedTimestamp = data.edited_timestamp;this.content = data.content.trim();this.channel = channel;if(this.isPrivate){this.author = this.channel.client.getUser("id",author.id);}else {this.author = this.channel.server.getMember("id",author.id) || this.channel.client.getUser("id",author.id);}this.attachments = data.attachments;} /*exports.Message.prototype.isPM = function() {
	return ( this.channel instanceof PMChannel );
}*/Message.prototype.isMentioned = function isMentioned(user){var id=user.id?user.id:user;for(var _iterator=this.mentions,_isArray=Array.isArray(_iterator),_i=0,_iterator=_isArray?_iterator:_iterator[Symbol.iterator]();;) {var _ref;if(_isArray){if(_i >= _iterator.length)break;_ref = _iterator[_i++];}else {_i = _iterator.next();if(_i.done)break;_ref = _i.value;}var mention=_ref;if(mention.id === id){return true;}}return false;};_createClass(Message,[{key:"sender",get:function get(){return this.author;}},{key:"isPrivate",get:function get(){return this.channel.isPrivate;}}]);return Message;})();module.exports = Message;

},{"./PMChannel.js":6}],12:[function(require,module,exports){
"use strict";var _createClass=(function(){function defineProperties(target,props){for(var i=0;i < props.length;i++) {var descriptor=props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if("value" in descriptor)descriptor.writable = true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};})();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var ServerPermissions=require("./ServerPermissions.js");var Member=require("./Member.js");var Server=(function(){function Server(data,client){_classCallCheck(this,Server);this.client = client;this.region = data.region;this.ownerID = data.owner_id;this.name = data.name;this.id = data.id;this.members = [];this.channels = [];this.icon = data.icon;this.afkTimeout = data.afk_timeout;this.afkChannelId = data.afk_channel_id;this.roles = [];for(var _iterator=data.roles,_isArray=Array.isArray(_iterator),_i=0,_iterator=_isArray?_iterator:_iterator[Symbol.iterator]();;) {var _ref;if(_isArray){if(_i >= _iterator.length)break;_ref = _iterator[_i++];}else {_i = _iterator.next();if(_i.done)break;_ref = _i.value;}var permissionGroup=_ref;this.roles.push(new ServerPermissions(permissionGroup));}if(!data.members){data.members = [client.user];return;}for(var _iterator2=data.members,_isArray2=Array.isArray(_iterator2),_i2=0,_iterator2=_isArray2?_iterator2:_iterator2[Symbol.iterator]();;) {var _ref2;if(_isArray2){if(_i2 >= _iterator2.length)break;_ref2 = _iterator2[_i2++];}else {_i2 = _iterator2.next();if(_i2.done)break;_ref2 = _i2.value;}var member=_ref2; // first we cache the user in our Discord Client,
// then we add it to our list. This way when we
// get a user from this server's member list,
// it will be identical (unless an async change occurred)
// to the client's cache.
if(member.user)this.addMember(client.addUser(member.user),member.roles);}} // get/set
Server.prototype.getRole = function getRole(id){for(var _iterator3=this.roles,_isArray3=Array.isArray(_iterator3),_i3=0,_iterator3=_isArray3?_iterator3:_iterator3[Symbol.iterator]();;) {var _ref3;if(_isArray3){if(_i3 >= _iterator3.length)break;_ref3 = _iterator3[_i3++];}else {_i3 = _iterator3.next();if(_i3.done)break;_ref3 = _i3.value;}var role=_ref3;if(role.id === id){return role;}}return null;};Server.prototype.updateRole = function updateRole(data){var oldRole=this.getRole(data.id);if(oldRole){var index=this.roles.indexOf(oldRole);this.roles[index] = new ServerPermissions(data);return this.roles[index];}else {return false;}};Server.prototype.removeRole = function removeRole(id){for(var roleId in this.roles) {if(this.roles[roleId].id === id){this.roles.splice(roleId,1);}}for(var _iterator4=this.members,_isArray4=Array.isArray(_iterator4),_i4=0,_iterator4=_isArray4?_iterator4:_iterator4[Symbol.iterator]();;) {var _ref4;if(_isArray4){if(_i4 >= _iterator4.length)break;_ref4 = _iterator4[_i4++];}else {_i4 = _iterator4.next();if(_i4.done)break;_ref4 = _i4.value;}var member=_ref4;for(var roleId in member.rawRoles) {if(member.rawRoles[roleId] === id){member.rawRoles.splice(roleId,1);}}}};Server.prototype.getChannel = function getChannel(key,value){for(var _iterator5=this.channels,_isArray5=Array.isArray(_iterator5),_i5=0,_iterator5=_isArray5?_iterator5:_iterator5[Symbol.iterator]();;) {var _ref5;if(_isArray5){if(_i5 >= _iterator5.length)break;_ref5 = _iterator5[_i5++];}else {_i5 = _iterator5.next();if(_i5.done)break;_ref5 = _i5.value;}var channel=_ref5;if(channel[key] === value){return channel;}}return null;};Server.prototype.getMember = function getMember(key,value){for(var _iterator6=this.members,_isArray6=Array.isArray(_iterator6),_i6=0,_iterator6=_isArray6?_iterator6:_iterator6[Symbol.iterator]();;) {var _ref6;if(_isArray6){if(_i6 >= _iterator6.length)break;_ref6 = _iterator6[_i6++];}else {_i6 = _iterator6.next();if(_i6.done)break;_ref6 = _i6.value;}var member=_ref6;if(member[key] === value){return member;}}return null;};Server.prototype.removeMember = function removeMember(key,value){for(var _iterator7=this.members,_isArray7=Array.isArray(_iterator7),_i7=0,_iterator7=_isArray7?_iterator7:_iterator7[Symbol.iterator]();;) {var _ref7;if(_isArray7){if(_i7 >= _iterator7.length)break;_ref7 = _iterator7[_i7++];}else {_i7 = _iterator7.next();if(_i7.done)break;_ref7 = _i7.value;}var member=_ref7;if(member[key] === value){this.members.splice(key,1);return member;}}return false;};Server.prototype.addChannel = function addChannel(chann){if(!this.getChannel("id",chann.id)){this.channels.push(chann);}return chann;};Server.prototype.addMember = function addMember(user,roles){if(!this.getMember("id",user.id)){var mem=new Member(user,this,roles);this.members.push(mem);}return mem;};Server.prototype.toString = function toString(){return this.name;};Server.prototype.equals = function equals(object){return object.id === this.id;};_createClass(Server,[{key:"permissionGroups",get:function get(){return this.roles;}},{key:"permissions",get:function get(){return this.roles;}},{key:"iconURL",get:function get(){if(!this.icon)return null;return "https://discordapp.com/api/guilds/" + this.id + "/icons/" + this.icon + ".jpg";}},{key:"afkChannel",get:function get(){if(!this.afkChannelId)return false;return this.getChannel("id",this.afkChannelId);}},{key:"defaultChannel",get:function get(){return this.getChannel("name","general");}},{key:"owner",get:function get(){return this.client.getUser("id",this.ownerID);}},{key:"users",get:function get(){return this.members;}}]);return Server;})();module.exports = Server;

},{"./Member.js":5,"./ServerPermissions.js":7}],13:[function(require,module,exports){
"use strict";var _createClass=(function(){function defineProperties(target,props){for(var i=0;i < props.length;i++) {var descriptor=props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if("value" in descriptor)descriptor.writable = true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};})();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var User=(function(){function User(data){_classCallCheck(this,User);this.username = data.username;this.discriminator = data.discriminator;this.id = data.id;this.avatar = data.avatar;this.status = data.status || "offline";this.gameId = data.game_id || null;} // access using user.avatarURL;
User.prototype.mention = function mention(){return "<@" + this.id + ">";};User.prototype.toString = function toString(){ /*
			if we embed a user in a String - like so:
			"Yo " + user + " what's up?"
			It would generate something along the lines of:
			"Yo @hydrabolt what's up?"
		*/return this.mention();};User.prototype.equals = function equals(object){return object.id === this.id;};User.prototype.equalsStrict = function equalsStrict(object){return object.id === this.id && object.avatar === this.avatar && object.username === this.username && object.discriminator === this.discriminator;};_createClass(User,[{key:"avatarURL",get:function get(){if(!this.avatar)return null;return "https://discordapp.com/api/users/" + this.id + "/avatars/" + this.avatar + ".jpg";}}]);return User;})();module.exports = User;

},{}],14:[function(require,module,exports){

},{}],15:[function(require,module,exports){
/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var reduce = require('reduce');

/**
 * Root reference for iframes.
 */

var root;
if (typeof window !== 'undefined') { // Browser window
  root = window;
} else if (typeof self !== 'undefined') { // Web Worker
  root = self;
} else { // Other environments
  root = this;
}

/**
 * Noop.
 */

function noop(){};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * TODO: future proof, move to compoent land
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isHost(obj) {
  var str = {}.toString.call(obj);

  switch (str) {
    case '[object File]':
    case '[object Blob]':
    case '[object FormData]':
      return true;
    default:
      return false;
  }
}

/**
 * Determine XHR.
 */

request.getXHR = function () {
  if (root.XMLHttpRequest
      && (!root.location || 'file:' != root.location.protocol
          || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  return false;
};

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return obj === Object(obj);
}

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    if (null != obj[key]) {
      pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(obj[key]));
    }
  }
  return pairs.join('&');
}

/**
 * Expose serialization method.
 */

 request.serializeObject = serialize;

 /**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var parts;
  var pair;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    parts = pair.split('=');
    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

 request.serialize = {
   'application/x-www-form-urlencoded': serialize,
   'application/json': JSON.stringify
 };

 /**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  lines.pop(); // trailing CRLF

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function type(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function params(str){
  return reduce(str.split(/ *; */), function(obj, str){
    var parts = str.split(/ *= */)
      , key = parts.shift()
      , val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req, options) {
  options = options || {};
  this.req = req;
  this.xhr = this.req.xhr;
  // responseText is accessible only if responseType is '' or 'text' and on older browsers
  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
     ? this.xhr.responseText
     : null;
  this.statusText = this.req.xhr.statusText;
  this.setStatusProperties(this.xhr.status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this.setHeaderProperties(this.header);
  this.body = this.req.method != 'HEAD'
    ? this.parseBody(this.text ? this.text : this.xhr.response)
    : null;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

Response.prototype.get = function(field){
  return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

Response.prototype.setHeaderProperties = function(header){
  // content-type
  var ct = this.header['content-type'] || '';
  this.type = type(ct);

  // params
  var obj = params(ct);
  for (var key in obj) this[key] = obj[key];
};

/**
 * Force given parser
 * 
 * Sets the body parser no matter type.
 * 
 * @param {Function}
 * @api public
 */

Response.prototype.parse = function(fn){
  this.parser = fn;
  return this;
};

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype.parseBody = function(str){
  var parse = this.parser || request.parse[this.type];
  return parse && str && (str.length || str instanceof Object)
    ? parse(str)
    : null;
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

Response.prototype.setStatusProperties = function(status){
  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
  if (status === 1223) {
    status = 204;
  }

  var type = status / 100 | 0;

  // status / class
  this.status = this.statusCode = status;
  this.statusType = type;

  // basics
  this.info = 1 == type;
  this.ok = 2 == type;
  this.clientError = 4 == type;
  this.serverError = 5 == type;
  this.error = (4 == type || 5 == type)
    ? this.toError()
    : false;

  // sugar
  this.accepted = 202 == status;
  this.noContent = 204 == status;
  this.badRequest = 400 == status;
  this.unauthorized = 401 == status;
  this.notAcceptable = 406 == status;
  this.notFound = 404 == status;
  this.forbidden = 403 == status;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var url = req.url;

  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  Emitter.call(this);
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {};
  this._header = {};
  this.on('end', function(){
    var err = null;
    var res = null;

    try {
      res = new Response(self);
    } catch(e) {
      err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = e;
      return self.callback(err);
    }

    self.emit('response', res);

    if (err) {
      return self.callback(err, res);
    }

    if (res.status >= 200 && res.status < 300) {
      return self.callback(err, res);
    }

    var new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
    new_err.original = err;
    new_err.response = res;
    new_err.status = res.status;

    self.callback(new_err, res);
  });
}

/**
 * Mixin `Emitter`.
 */

Emitter(Request.prototype);

/**
 * Allow for extension
 */

Request.prototype.use = function(fn) {
  fn(this);
  return this;
}

/**
 * Set timeout to `ms`.
 *
 * @param {Number} ms
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.timeout = function(ms){
  this._timeout = ms;
  return this;
};

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.clearTimeout = function(){
  this._timeout = 0;
  clearTimeout(this._timer);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */

Request.prototype.abort = function(){
  if (this.aborted) return;
  this.aborted = true;
  this.xhr.abort();
  this.clearTimeout();
  this.emit('abort');
  return this;
};

/**
 * Set header `field` to `val`, or multiple fields with one object.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Remove header `field`.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.unset = function(field){
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Get case-insensitive header `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api private
 */

Request.prototype.getHeader = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function(type){
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} pass
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass){
  var str = btoa(user + ':' + pass);
  this.set('Authorization', 'Basic ' + str);
  return this;
};

/**
* Add query-string `val`.
*
* Examples:
*
*   request.get('/shoes')
*     .query('size=10')
*     .query({ color: 'blue' })
*
* @param {Object|String} val
* @return {Request} for chaining
* @api public
*/

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Write the field `name` and `val` for "multipart/form-data"
 * request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 * ```
 *
 * @param {String} name
 * @param {String|Blob|File} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.field = function(name, val){
  if (!this._formData) this._formData = new root.FormData();
  this._formData.append(name, val);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `filename`.
 *
 * ``` js
 * request.post('/upload')
 *   .attach(new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String} filename
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function(field, file, filename){
  if (!this._formData) this._formData = new root.FormData();
  this._formData.append(field, file, filename);
  return this;
};

/**
 * Send `data`, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // querystring
 *       request.get('/search')
 *         .end(callback)
 *
 *       // multiple data "writes"
 *       request.get('/search')
 *         .send({ search: 'query' })
 *         .send({ range: '1..5' })
 *         .send({ order: 'desc' })
 *         .end(callback)
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"})
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
  *      request.post('/user')
  *        .send('name=tobi')
  *        .send('species=ferret')
  *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.send = function(data){
  var obj = isObject(data);
  var type = this.getHeader('Content-Type');

  // merge
  if (obj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    if (!type) this.type('form');
    type = this.getHeader('Content-Type');
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!obj || isHost(data)) return this;
  if (!type) this.type('json');
  return this;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  var fn = this._callback;
  this.clearTimeout();
  fn(err, res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Origin is not allowed by Access-Control-Allow-Origin');
  err.crossDomain = true;
  this.callback(err);
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

Request.prototype.timeoutError = function(){
  var timeout = this._timeout;
  var err = new Error('timeout of ' + timeout + 'ms exceeded');
  err.timeout = timeout;
  this.callback(err);
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

Request.prototype.withCredentials = function(){
  this._withCredentials = true;
  return this;
};

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  var self = this;
  var xhr = this.xhr = request.getXHR();
  var query = this._query.join('&');
  var timeout = this._timeout;
  var data = this._formData || this._data;

  // store callback
  this._callback = fn || noop;

  // state change
  xhr.onreadystatechange = function(){
    if (4 != xhr.readyState) return;

    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"
    var status;
    try { status = xhr.status } catch(e) { status = 0; }

    if (0 == status) {
      if (self.timedout) return self.timeoutError();
      if (self.aborted) return;
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  var handleProgress = function(e){
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;
    }
    self.emit('progress', e);
  };
  if (this.hasListeners('progress')) {
    xhr.onprogress = handleProgress;
  }
  try {
    if (xhr.upload && this.hasListeners('progress')) {
      xhr.upload.onprogress = handleProgress;
    }
  } catch(e) {
    // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
    // Reported here:
    // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
  }

  // timeout
  if (timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self.timedout = true;
      self.abort();
    }, timeout);
  }

  // querystring
  if (query) {
    query = request.serializeObject(query);
    this.url += ~this.url.indexOf('?')
      ? '&' + query
      : '?' + query;
  }

  // initiate request
  xhr.open(this.method, this.url, true);

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !isHost(data)) {
    // serialize stuff
    var contentType = this.getHeader('Content-Type');
    var serialize = request.serialize[contentType ? contentType.split(';')[0] : ''];
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;
    xhr.setRequestHeader(field, this.header[field]);
  }

  // send stuff
  this.emit('request', this);
  xhr.send(data);
  return this;
};

/**
 * Faux promise support
 *
 * @param {Function} fulfill
 * @param {Function} reject
 * @return {Request}
 */

Request.prototype.then = function (fulfill, reject) {
  return this.end(function(err, res) {
    err ? reject(err) : fulfill(res);
  });
}

/**
 * Expose `Request`.
 */

request.Request = Request;

/**
 * Issue a request:
 *
 * Examples:
 *
 *    request('GET', '/users').end(callback)
 *    request('/users').end(callback)
 *    request('/users', callback)
 *
 * @param {String} method
 * @param {String|Function} url or callback
 * @return {Request}
 * @api public
 */

function request(method, url) {
  // callback
  if ('function' == typeof url) {
    return new Request('GET', method).end(url);
  }

  // url first
  if (1 == arguments.length) {
    return new Request('GET', method);
  }

  return new Request(method, url);
}

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn){
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn){
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.del = function(url, fn){
  var req = request('DELETE', url);
  if (fn) req.end(fn);
  return req;
};

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn){
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn){
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn){
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * Expose `request`.
 */

module.exports = request;

},{"emitter":16,"reduce":17}],16:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],17:[function(require,module,exports){

/**
 * Reduce `arr` with `fn`.
 *
 * @param {Array} arr
 * @param {Function} fn
 * @param {Mixed} initial
 *
 * TODO: combatible error handling?
 */

module.exports = function(arr, fn, initial){  
  var idx = 0;
  var len = arr.length;
  var curr = arguments.length == 3
    ? initial
    : arr[idx++];

  while (idx < len) {
    curr = fn.call(null, curr, arr[idx], ++idx, arr);
  }
  
  return curr;
};
},{}],18:[function(require,module,exports){

/**
 * Module dependencies.
 */

var global = (function() { return this; })();

/**
 * WebSocket constructor.
 */

var WebSocket = global.WebSocket || global.MozWebSocket;

/**
 * Module exports.
 */

module.exports = WebSocket ? ws : null;

/**
 * WebSocket constructor.
 *
 * The third `opts` options object gets ignored in web browsers, since it's
 * non-standard, and throws a TypeError if passed to the constructor.
 * See: https://github.com/einaros/ws/issues/227
 *
 * @param {String} uri
 * @param {Array} protocols (optional)
 * @param {Object) opts (optional)
 * @api public
 */

function ws(uri, protocols, opts) {
  var instance;
  if (protocols) {
    instance = new WebSocket(uri, protocols);
  } else {
    instance = new WebSocket(uri);
  }
  return instance;
}

if (WebSocket) ws.prototype = WebSocket.prototype;

},{}],19:[function(require,module,exports){
module.exports=[{"executables":{"win32":["pol.exe"]},"id":0,"name":"FINAL FANTASY XI"},{"executables":{"win32":["ffxiv.exe","ffxiv_dx11.exe"]},"id":1,"name":"FINAL FANTASY XIV"},{"executables":{"win32":["Wow.exe","Wow-64.exe"]},"id":3,"name":"World of Warcraft"},{"executables":{"darwin":["LoLLauncher.app"],"win32":["LolClient.exe","League of Legends.exe"]},"id":4,"name":"League of Legends"},{"executables":{"darwin":["Diablo%20III.app"],"win32":["Diablo III.exe"]},"id":5,"name":"Diablo 3"},{"executables":{"darwin":["dota_osx.app"],"win32":["dota2.exe"]},"id":6,"name":"DOTA 2"},{"executables":{"darwin":["Heroes.app"],"win32":["Heroes of the Storm.exe","HeroesOfTheStorm_x64.exe","HeroesOfTheStorm.exe"]},"id":7,"name":"Heroes of the Storm"},{"executables":{"darwin":["Hearthstone.app"],"win32":["Hearthstone.exe"]},"id":8,"name":"Hearthstone"},{"executables":{"win32":["csgo.exe"]},"id":9,"name":"Counter-Strike: Global Offensive"},{"executables":{"win32":["WorldOfTanks.exe"]},"id":10,"name":"World of Tanks"},{"executables":{"darwin":["gw2.app"],"win32":["gw2.exe"]},"id":11,"name":"Guild Wars 2"},{"executables":{"win32":["dayz.exe"]},"id":12,"name":"Day Z"},{"executables":{"darwin":["starcraft%20ii.app"],"win32":["starcraft ii.exe","SC2_x64.exe","SC2.exe"]},"id":13,"name":"Starcraft II"},{"executables":{"win32":["diablo.exe"]},"id":14,"name":"Diablo"},{"executables":{"win32":["diablo ii.exe"]},"id":15,"name":"Diablo 2"},{"executables":{"win32":["left4dead.exe"]},"id":17,"name":"Left 4 Dead"},{"executables":{"darwin":["minecraft.app"],"win32":["minecraft.exe"]},"id":18,"name":"Minecraft"},{"executables":{"win32":["smite.exe"]},"id":19,"name":"Smite"},{"executables":{"win32":["bf4.exe"]},"id":20,"name":"Battlefield 4"},{"executables":{"win32":["AoK HD.exe","empires2.exe"]},"id":101,"name":"Age of Empire II"},{"executables":{"win32":["age3y.exe"]},"id":102,"name":"Age of Empire III"},{"executables":{"win32":["AlanWake.exe"]},"id":104,"name":"Alan Wake"},{"executables":{"win32":["alan_wakes_american_nightmare.exe"]},"id":105,"name":"Alan Wake's American Nightmare"},{"executables":{"win32":["AlienBreed2Assault.exe"]},"id":106,"name":"Alien Breed 2: Assault"},{"executables":{"win32":["Amnesia.exe"]},"id":107,"name":"Amnesia: The Dark Descent"},{"executables":{"win32":["UDK.exe"]},"id":108,"name":"Antichamber"},{"executables":{"win32":["ArcheAge.exe"]},"id":109,"name":"ArcheAge"},{"executables":{"win32":["arma3.exe"]},"id":110,"name":"Arma III"},{"executables":{"win32":["AC3SP.exe"]},"id":111,"name":"Assassin's Creed 3"},{"executables":{"win32":["Bastion.exe"]},"id":112,"name":"Bastion"},{"executables":{"win32":["BF2.exe"]},"id":113,"name":"Battlefield 2"},{"executables":{"win32":["bf3.exe"]},"id":114,"name":"Battlefield 3"},{"executables":{"win32":["Besiege.exe"]},"id":116,"name":"Besiege"},{"executables":{"win32":["Bioshock.exe"]},"id":117,"name":"Bioshock"},{"executables":{"win32":["Bioshock2.exe"]},"id":118,"name":"BioShock II"},{"executables":{"win32":["BioShockInfinite.exe"]},"id":119,"name":"BioShock Infinite"},{"executables":{"win32":["Borderlands2.exe"]},"id":122,"name":"Borderlands 2"},{"executables":{"win32":["braid.exe"]},"id":123,"name":"Braid"},{"executables":{"win32":["ShippingPC-StormGame.exe"]},"id":124,"name":"Bulletstorm"},{"executables":{},"id":125,"name":"Cabal 2"},{"executables":{"win32":["CabalMain.exe"]},"id":126,"name":"Cabal Online"},{"executables":{"win32":["iw4mp.exe","iw4sp.exe"]},"id":127,"name":"Call of Duty: Modern Warfare 2"},{"executables":{"win32":["t6sp.exe"]},"id":128,"name":"Call of Duty: Black Ops"},{"executables":{"win32":["iw5mp.exe"]},"id":129,"name":"Call of Duty: Modern Warfare 3"},{"executables":{"win32":["RelicCOH.exe"]},"id":132,"name":"Company of Heroes"},{"executables":{"win32":["Crysis64.exe"]},"id":135,"name":"Crysis"},{"executables":{"win32":["Crysis2.exe"]},"id":136,"name":"Crysis 2"},{"executables":{"win32":["Crysis3.exe"]},"id":137,"name":"Crysis 3"},{"executables":{"win32":["Crysis.exe"]},"id":138,"name":"Crysis 4  "},{"executables":{"win32":["DATA.exe"]},"id":140,"name":"Dark Souls"},{"executables":{"win32":["DarkSoulsII.exe"]},"id":141,"name":"Dark Souls II"},{"executables":{"win32":["dfuw.exe"]},"id":142,"name":"Darkfall: Unholy Wars"},{"executables":{"win32":["DCGAME.exe"]},"id":144,"name":"DC Universe Online"},{"executables":{"win32":["DeadIslandGame.exe"]},"id":145,"name":"Dead Island"},{"executables":{"win32":["deadspace2.exe"]},"id":146,"name":"Dead Space 2"},{"executables":{"win32":["LOTDGame.exe"]},"id":147,"name":"Deadlight"},{"executables":{"win32":["dxhr.exe"]},"id":148,"name":"Deus Ex: Human Revolution"},{"executables":{"win32":["DeviMayCry4.exe"]},"id":149,"name":"Devil May Cry 4"},{"executables":{"win32":["DMC-DevilMayCry.exe"]},"id":150,"name":"DmC Devil May Cry"},{"executables":{"win32":["dirt2_game.exe"]},"id":154,"name":"DiRT 2"},{"executables":{"win32":["dirt3_game.exe"]},"id":155,"name":"DiRT 3"},{"executables":{"win32":["dota.exe"]},"id":156,"name":"DOTA"},{"executables":{"win32":["DoubleDragon.exe"]},"id":158,"name":"Double Dragon Neon"},{"executables":{"win32":["DragonAge2.exe"]},"id":159,"name":"Dragon Age II"},{"executables":{"win32":["DragonAgeInquisition.exe"]},"id":160,"name":"Dragon Age: Inquisition"},{"executables":{"win32":["daorigins.exe"]},"id":161,"name":"Dragon Age: Origins"},{"executables":{"win32":["DBXV.exe"]},"id":162,"name":"Dragon Ball XenoVerse"},{"executables":{"win32":["DukeForever.exe"]},"id":163,"name":"Duke Nukem Forever"},{"executables":{"darwin":["Dustforce.app"],"win32":["dustforce.exe"]},"id":164,"name":"Dustforce"},{"executables":{"win32":["EliteDangerous32.exe"]},"id":165,"name":"Elite: Dangerous"},{"executables":{"win32":["exefile.exe"]},"id":166,"name":"Eve Online"},{"executables":{"win32":["eqgame.exe"]},"id":167,"name":"EverQuest"},{"executables":{"win32":["EverQuest2.exe"]},"id":168,"name":"EverQuest II"},{"executables":{},"id":169,"name":"EverQuest Next"},{"executables":{"win32":["Engine.exe"]},"id":170,"name":"F.E.A.R."},{"executables":{"win32":["FEAR2.exe"]},"id":171,"name":"F.E.A.R. 2: Project Origin"},{"executables":{"win32":["fallout3.exe"]},"id":172,"name":"Fallout 3"},{"executables":{"win32":["FalloutNV.exe"]},"id":174,"name":"Fallout: New Vegas"},{"executables":{"win32":["farcry3.exe"]},"id":175,"name":"Far Cry 3"},{"executables":{"win32":["fifa15.exe"]},"id":176,"name":"FIFA 15"},{"executables":{"win32":["FTLGame.exe"]},"id":180,"name":"FTL: Faster Than Light"},{"executables":{"win32":["GTAIV.exe"]},"id":181,"name":"Grand Theft Auto 4"},{"executables":{"win32":["GTA5.exe"]},"id":182,"name":"Grand Theft Auto 5"},{"executables":{"win32":["Gw.exe"]},"id":183,"name":"Guild Wars"},{"executables":{"win32":["H1Z1.exe"]},"id":186,"name":"H1Z1"},{"executables":{"win32":["HL2HL2.exe","hl2.exe"]},"id":188,"name":"Half Life 2"},{"executables":{"win32":["HOMEFRONT.exe"]},"id":195,"name":"Homefront"},{"executables":{"win32":["invisibleinc.exe"]},"id":196,"name":"Invisible Inc."},{"executables":{"win32":["LANoire.exe"]},"id":197,"name":"L.A. Noire"},{"executables":{"win32":["Landmark64.exe"]},"id":198,"name":"Landmark"},{"executables":{"win32":["left4dead2.exe"]},"id":201,"name":"Left 4 Dead 2"},{"executables":{"win32":["lineage.exe"]},"id":203,"name":"Lineage"},{"executables":{"win32":["Magicka.exe"]},"id":206,"name":"Magicka"},{"executables":{"win32":["MapleStory.exe"]},"id":208,"name":"MapleStory"},{"executables":{},"id":209,"name":"Mark of the Ninja"},{"executables":{"win32":["MassEffect.exe"]},"id":210,"name":"Mass Effect"},{"executables":{"win32":["MassEffect2.exe"]},"id":211,"name":"Mass Effect 2"},{"executables":{"win32":["MassEffect3Demo.exe"]},"id":212,"name":"Mass Effect 3"},{"executables":{"win32":["METAL GEAR RISING REVENGEANCE.exe"]},"id":214,"name":"Metal Gear Rising: Revengeance"},{"executables":{"win32":["metro2033.exe"]},"id":215,"name":"Metro 2033"},{"executables":{"win32":["MetroLL.exe"]},"id":216,"name":"Metro Last Light"},{"executables":{"win32":["MK10.exe"]},"id":218,"name":"Mortal Kombat X"},{"executables":{"win32":["speed.exe"]},"id":219,"name":"Need For Speed Most Wanted"},{"executables":{},"id":220,"name":"Neverwinder"},{"executables":{"darwin":["Outlast.app"],"win32":["OLGame.exe"]},"id":221,"name":"Outlast"},{"executables":{"win32":["PapersPlease.exe"]},"id":222,"name":"Papers, Please"},{"executables":{"win32":["payday_win32_release.exe"]},"id":223,"name":"PAYDAY"},{"executables":{"win32":["payday2_win32_release.exe"]},"id":224,"name":"PAYDAY2"},{"executables":{"win32":["PillarsOfEternity.exe"]},"id":225,"name":"Pillars of Eternity"},{"executables":{"win32":["PA.exe"]},"id":226,"name":"Planetary Annihilation"},{"executables":{"win32":["planetside2_x86.exe"]},"id":227,"name":"Planetside 2"},{"executables":{"win32":["hl2P.exe"]},"id":228,"name":"Portal"},{"executables":{"win32":["portal2.exe"]},"id":229,"name":"Portal 2"},{"executables":{"win32":["PrimalCarnageGame.exe"]},"id":231,"name":"Primal Cargnage"},{"executables":{"win32":["pCARS.exe"]},"id":232,"name":"Project Cars"},{"executables":{"win32":["RaceTheSun.exe"]},"id":233,"name":"Race The Sun"},{"executables":{"win32":["Rage.exe"]},"id":234,"name":"RAGE"},{"executables":{"win32":["ragexe.exe"]},"id":235,"name":"Ragnarok Online"},{"executables":{"win32":["rift.exe"]},"id":236,"name":"Rift"},{"executables":{"win32":["Rocksmith2014.exe"]},"id":237,"name":"Rocksmith 2014"},{"executables":{"win32":["SwiftKit-RS.exe","JagexLauncher.exe"]},"id":238,"name":"RuneScape"},{"executables":{"win32":["Shadowgrounds.exe"]},"id":239,"name":"Shadowgrounds"},{"executables":{"win32":["survivor.exe"]},"id":240,"name":"Shadowgrounds: Survivor"},{"executables":{"win32":["ShovelKnight.exe"]},"id":241,"name":"Shovel Knight"},{"executables":{"win32":["SimCity.exe"]},"id":242,"name":"SimCity"},{"executables":{"win32":["SporeApp.exe"]},"id":245,"name":"Spore"},{"executables":{"win32":["StarCitizen.exe"]},"id":246,"name":"Star Citizen"},{"executables":{},"id":247,"name":"Star Trek Online"},{"executables":{"win32":["battlefront.exe"]},"id":248,"name":"Star Wars Battlefront"},{"executables":{"win32":["swtor.exe"]},"id":249,"name":"Star Wars: The Old Republic"},{"executables":{"win32":["starbound.exe","starbound_opengl.exe"]},"id":250,"name":"Starbound"},{"executables":{"win32":["starcraft.exe"]},"id":251,"name":"Starcraft"},{"executables":{"win32":["SSFIV.exe"]},"id":253,"name":"Ultra Street Fighter IV"},{"executables":{"win32":["superhexagon.exe"]},"id":254,"name":"Super Hexagon"},{"executables":{"win32":["swordandsworcery_pc.exe"]},"id":255,"name":"Superbrothers: Sword & Sworcery EP"},{"executables":{"win32":["hl2TF.exe"]},"id":256,"name":"Team Fortress 2"},{"executables":{"win32":["TERA.exe"]},"id":258,"name":"TERA"},{"executables":{"win32":["Terraria.exe"]},"id":259,"name":"Terraria"},{"executables":{"win32":["Bethesda.net_Launcher.exe"]},"id":260,"name":"The Elder Scrolls Online"},{"executables":{"win32":["TESV.exe"]},"id":261,"name":"The Elder Scrolls V: Skyrim"},{"executables":{"win32":["TheSecretWorld.exe"]},"id":262,"name":"The Secret World"},{"executables":{"win32":["TS3.exe","ts3w.exe"]},"id":264,"name":"The Sims 3"},{"executables":{"win32":["WALKINGDEAD101.EXE"]},"id":265,"name":"The Walking Dead"},{"executables":{"win32":["TheWalkingDead2.exe"]},"id":266,"name":"The Walking Dead Season Two"},{"executables":{"win32":["witcher3.exe"]},"id":267,"name":"The Witcher 3"},{"executables":{"win32":["Future Soldier.exe"]},"id":268,"name":"Tom Clancy's Ghost Recon: Future Solider"},{"executables":{"win32":["TombRaider.exe"]},"id":269,"name":"Tomb Raider (2013)"},{"executables":{"win32":["Torchlight.exe"]},"id":271,"name":"Torchlight"},{"executables":{"win32":["Torchlight2.exe"]},"id":272,"name":"Torchlight 2"},{"executables":{"win32":["Shogun2.exe"]},"id":273,"name":"Total War: Shogun 2"},{"executables":{"win32":["Transistor.exe"]},"id":274,"name":"Transistor"},{"executables":{"win32":["trine.exe"]},"id":275,"name":"Trine"},{"executables":{"win32":["trine2_32bit.exe"]},"id":276,"name":"Trine 2"},{"executables":{"win32":["UOKR.exe"]},"id":277,"name":"Ultima Online"},{"executables":{"win32":["aces.exe"]},"id":279,"name":"War Thunder"},{"executables":{"win32":["Warcraft III.exe","wc3.exe"]},"id":281,"name":"Warcraft 3: Reign of Chaos"},{"executables":{"win32":["Warcraft II BNE.exe"]},"id":282,"name":"Warcraft II"},{"executables":{"win32":["Warframe.x64.exe","Warframe.exe"]},"id":283,"name":"Warframe"},{"executables":{"win32":["watch_dogs.exe"]},"id":284,"name":"Watch Dogs"},{"executables":{"win32":["WildStar64.exe"]},"id":285,"name":"WildStar"},{"executables":{"win32":["XComGame.exe"]},"id":288,"name":"XCOM: Enemy Unknown"},{"executables":{"win32":["DFO.exe","dfo.exe"]},"id":289,"name":"Dungeon Fighter Online"},{"executables":{"win32":["aclauncher.exe","acclient.exe"]},"id":290,"name":"Asheron's Call"},{"executables":{"win32":["MapleStory2.exe"]},"id":291,"name":"MapleStory 2"},{"executables":{"win32":["ksp.exe"]},"id":292,"name":"Kerbal Space Program"},{"executables":{"win32":["PINBALL.EXE"]},"id":293,"name":"3D Pinball: Space Cadet"},{"executables":{"win32":["dave.exe"]},"id":294,"name":"Dangerous Dave"},{"executables":{"win32":["iwbtgbeta(slomo).exe","iwbtgbeta(fs).exe"]},"id":295,"name":"I Wanna Be The Guy"},{"executables":{"win32":["MechWarriorOnline.exe "]},"id":296,"name":"Mech Warrior Online"},{"executables":{"win32":["dontstarve_steam.exe"]},"id":297,"name":"Don't Starve"},{"executables":{"win32":["GalCiv3.exe"]},"id":298,"name":"Galactic Civilization 3"},{"executables":{"win32":["Risk of Rain.exe"]},"id":299,"name":"Risk of Rain"},{"executables":{"win32":["Binding_of_Isaac.exe","Isaac-ng.exe"]},"id":300,"name":"The Binding of Isaac"},{"executables":{"win32":["RustClient.exe"]},"id":301,"name":"Rust"},{"executables":{"win32":["Clicker Heroes.exe"]},"id":302,"name":"Clicker Heroes"},{"executables":{"win32":["Brawlhalla.exe"]},"id":303,"name":"Brawlhalla"},{"executables":{"win32":["TownOfSalem.exe"]},"id":304,"name":"Town of Salem"},{"executables":{"win32":["osu!.exe"]},"id":305,"name":"osu!"},{"executables":{"win32":["PathOfExileSteam.exe","PathOfExile.exe"]},"id":306,"name":"Path of Exile"},{"executables":{"win32":["Dolphin.exe"]},"id":307,"name":"Dolphin"},{"executables":{"win32":["RocketLeague.exe"]},"id":308,"name":"Rocket League"},{"executables":{"win32":["TJPP.exe"]},"id":309,"name":"Jackbox Party Pack"},{"executables":{"win32":["KFGame.exe"]},"id":310,"name":"Killing Floor 2"},{"executables":{"win32":["ShooterGame.exe"]},"id":311,"name":"Ark: Survival Evolved"},{"executables":{"win32":["LifeIsStrange.exe"]},"id":312,"name":"Life Is Strange"},{"executables":{"win32":["Client_tos.exe"]},"id":313,"name":"Tree of Savior"},{"executables":{"win32":["olliolli2.exe"]},"id":314,"name":"OlliOlli2"},{"executables":{"win32":["cw.exe"]},"id":315,"name":"Closers Dimension Conflict"},{"executables":{"win32":["ESSTEAM.exe","elsword.exe","x2.exe"]},"id":316,"name":"Elsword"},{"executables":{"win32":["ori.exe"]},"id":317,"name":"Ori and the Blind Forest"},{"executables":{"win32":["Skyforge.exe"]},"id":318,"name":"Skyforge"},{"executables":{"win32":["projectzomboid64.exe","projectzomboid32.exe"]},"id":319,"name":"Project Zomboid"},{"executables":{"win32":["From_The_Depths.exe"]},"id":320,"name":"The Depths"},{"executables":{"win32":["TheCrew.exe"]},"id":321,"name":"The Crew"},{"executables":{"win32":["MarvelHeroes2015.exe"]},"id":322,"name":"Marvel Heroes 2015"},{"executables":{"win32":["timeclickers.exe"]},"id":324,"name":"Time Clickers"},{"executables":{"win32":["eurotrucks2.exe"]},"id":325,"name":"Euro Truck Simulator 2"},{"executables":{"win32":["FarmingSimulator2015Game.exe"]},"id":326,"name":"Farming Simulator 15"},{"executables":{"win32":["strife.exe"]},"id":327,"name":"Strife"},{"executables":{"win32":["Awesomenauts.exe"]},"id":328,"name":"Awesomenauts"},{"executables":{"win32":["Dofus.exe"]},"id":329,"name":"Dofus"},{"executables":{"win32":["Boid.exe"]},"id":330,"name":"Boid"},{"executables":{"win32":["adventure-capitalist.exe"]},"id":331,"name":"AdVenture Capitalist"},{"executables":{"win32":["OrcsMustDie2.exe"]},"id":332,"name":"Orcs Must Die! 2"},{"executables":{"win32":["Mountain.exe"]},"id":333,"name":"Mountain"},{"executables":{"win32":["Valkyria.exe"]},"id":335,"name":"Valkyria Chronicles"},{"executables":{"win32":["ffxiiiimg.exe"]},"id":336,"name":"Final Fantasy XIII"},{"executables":{"win32":["TLR.exe"]},"id":337,"name":"The Last Remnant"},{"executables":{"win32":["Cities.exe"]},"id":339,"name":"Cities Skylines"},{"executables":{"win32":["worldofwarships.exe","WoWSLauncher.exe"]},"id":341,"name":"World of Warships"},{"executables":{"win32":["spacegame-Win64-shipping.exe"]},"id":342,"name":"Fractured Space"},{"executables":{"win32":["thespacegame.exe"]},"id":343,"name":"Ascent - The Space Game"},{"executables":{"win32":["DuckGame.exe"]},"id":344,"name":"Duck Game"},{"executables":{"win32":["PPSSPPWindows.exe"]},"id":345,"name":"PPSSPP"},{"executables":{"win32":["MBAA.exe"]},"id":346,"name":"Melty Blood Actress Again: Current Code"},{"executables":{"win32":["TheWolfAmongUs.exe"]},"id":347,"name":"The Wolf Among Us"},{"executables":{"win32":["SpaceEngineers.exe"]},"id":348,"name":"Space Engineers"},{"executables":{"win32":["Borderlands.exe"]},"id":349,"name":"Borderlands"},{"executables":{"win32":["100orange.exe"]},"id":351,"name":"100% Orange Juice"},{"executables":{"win32":["reflex.exe"]},"id":354,"name":"Reflex"},{"executables":{"win32":["pso2.exe"]},"id":355,"name":"Phantasy Star Online 2"},{"executables":{"win32":["AssettoCorsa.exe"]},"id":356,"name":"Assetto Corsa"},{"executables":{"win32":["iw3mp.exe","iw3sp.exe"]},"id":357,"name":"Call of Duty 4: Modern Warfare"},{"executables":{"win32":["WolfOldBlood_x64.exe"]},"id":358,"name":"Wolfenstein: The Old Blood"},{"executables":{"win32":["castle.exe"]},"id":359,"name":"Castle Crashers"},{"executables":{"win32":["vindictus.exe"]},"id":360,"name":"Vindictus"},{"executables":{"win32":["ShooterGame-Win32-Shipping.exe"]},"id":361,"name":"Dirty Bomb"},{"executables":{"win32":["BatmanAK.exe"]},"id":362,"name":"Batman Arkham Knight"},{"executables":{"win32":["drt.exe"]},"id":363,"name":"Dirt Rally"},{"executables":{"win32":["rFactor.exe"]},"id":364,"name":"rFactor"},{"executables":{"win32":["clonk.exe"]},"id":365,"name":"Clonk Rage"},{"executables":{"win32":["SRHK.exe"]},"id":366,"name":"Shadowrun: Hong Kong"},{"executables":{"win32":["Insurgency.exe"]},"id":367,"name":"Insurgency"},{"executables":{"win32":["StepMania.exe"]},"id":368,"name":"Step Mania"},{"executables":{"win32":["FirefallCLient.exe"]},"id":369,"name":"Firefall"},{"executables":{"win32":["mirrorsedge.exe"]},"id":370,"name":"Mirrors Edge"},{"executables":{"win32":["MgsGroundZeroes.exe"]},"id":371,"name":"Metal Gear Solid V: Ground Zeroes"},{"executables":{"win32":["mgsvtpp.exe"]},"id":372,"name":"Metal Gear Solid V: The Phantom Pain"},{"executables":{"win32":["tld.exe"]},"id":373,"name":"The Long Dark"},{"executables":{"win32":["TKOM.exe"]},"id":374,"name":"Take On Mars"},{"executables":{"win32":["robloxplayerlauncher.exe","Roblox.exe"]},"id":375,"name":"Roblox"},{"executables":{"win32":["eu4.exe"]},"id":376,"name":"Europa Universalis 4"},{"executables":{"win32":["APB.exe"]},"id":377,"name":"APB Reloaded"},{"executables":{"win32":["Robocraft.exe"]},"id":378,"name":"Robocraft"},{"executables":{"win32":["Unity.exe"]},"id":379,"name":"Unity"},{"executables":{"win32":["Simpsons.exe"]},"id":380,"name":"The Simpsons: Hit & Run"},{"executables":{"win32":["Dnlauncher.exe","DragonNest.exe"]},"id":381,"name":"Dragon Nest"},{"executables":{"win32":["Trove.exe"]},"id":382,"name":"Trove"},{"executables":{"win32":["EndlessLegend.exe"]},"id":383,"name":"Endless Legend"},{"executables":{"win32":["TurbineLauncher.exe","dndclient.exe"]},"id":384,"name":"Dungeons & Dragons Online"},{"executables":{"win32":["quakelive.exe","quakelive_steam.exe"]},"id":385,"name":"Quake Live"},{"executables":{"win32":["7DaysToDie.exe"]},"id":386,"name":"7DaysToDie"},{"executables":{"win32":["SpeedRunners.exe"]},"id":387,"name":"SpeedRunners"},{"executables":{"win32":["gamemd.exe"]},"id":388,"name":"Command & Conquer: Red Alert 2"},{"executables":{"win32":["generals.exe"]},"id":389,"name":"Command & Conquer Generals: Zero Hour"},{"executables":{"win32":["Oblivion.exe"]},"id":390,"name":"The Elder Scrolls 4: Oblivion"},{"executables":{"win32":["mgsi.exe"]},"id":391,"name":"Metal Gear Solid"},{"executables":{"win32":["EoCApp.exe"]},"id":392,"name":"Divinity - Original Sin"},{"executables":{"win32":["Torment.exe"]},"id":393,"name":"Planescape: Torment"},{"executables":{"win32":["HexPatch.exe"]},"id":394,"name":"Hex: Shards of Fate"},{"executables":{"win32":["NS3FB.exe"]},"id":395,"name":"Naruto Shippuden Ultimate Ninja Storm 3 Full Burst"},{"executables":{"win32":["NSUNSR.exe"]},"id":396,"name":"Naruto Shippuden Ultimate Ninja Storm Revolution"},{"executables":{"win32":["SaintsRowIV.exe"]},"id":397,"name":"Saints Row IV"},{"executables":{"win32":["Shadowrun.exe"]},"id":398,"name":"Shadowrun"},{"executables":{"win32":["DungeonoftheEndless.exe"]},"id":399,"name":"Dungeon of the Endless"},{"executables":{"win32":["Hon.exe"]},"id":400,"name":"Heroes of Newerth"},{"executables":{"win32":["mabinogi.exe"]},"id":401,"name":"Mabinogi"},{"executables":{"win32":["CoD2MP_s.exe","CoDSP_s.exe"]},"id":402,"name":"Call of Duty 2:"},{"executables":{"win32":["CoDWaWmp.exe","CoDWaw.exe"]},"id":403,"name":"Call of Duty: World at War"},{"executables":{"win32":["heroes.exe"]},"id":404,"name":"Mabinogi Heroes (Vindictus)  "},{"executables":{"win32":["KanColleViewer.exe"]},"id":405,"name":"KanColle "},{"executables":{"win32":["cyphers.exe"]},"id":406,"name":"Cyphers"},{"executables":{"win32":["RelicCoH2.exe"]},"id":407,"name":"Company of Heroes 2"},{"executables":{"win32":["MJ.exe"]},"id":408,"name":"セガNET麻雀MJ"},{"executables":{"win32":["ge.exe"]},"id":409,"name":"Granado Espada"},{"executables":{"win32":["NovaRO.exe"]},"id":410,"name":"Nova Ragnarok Online"},{"executables":{"win32":["RivalsofAether.exe"]},"id":411,"name":"Rivals of Aether"},{"executables":{"win32":["bfh.exe"]},"id":412,"name":"Battlefield Hardline"},{"executables":{"win32":["GrowHome.exe"]},"id":413,"name":"Grow Home"},{"executables":{"win32":["patriots.exe"]},"id":414,"name":"Rise of Nations Extended"},{"executables":{"win32":["Railroads.exe"]},"id":415,"name":"Sid Meier's Railroads!"},{"executables":{"win32":["Empire.exe"]},"id":416,"name":"Empire: Total War"},{"executables":{"win32":["Napoleon.exe"]},"id":417,"name":"Napoleon: Total War"},{"executables":{"win32":["gta_sa.exe"]},"id":418,"name":"Grand Theft Auto: San Andreas"},{"executables":{"win32":["MadMax.exe"]},"id":419,"name":"Mad Max"},{"executables":{"win32":["Titanfall.exe"]},"id":420,"name":"Titanfall"},{"executables":{"win32":["age2_x1.exe"]},"id":421,"name":"Age of Empires II: The Conquerors"},{"executables":{"win32":["Rome2.exe"]},"id":422,"name":"Total War: ROME 2"},{"executables":{"win32":["ShadowOfMordor.exe"]},"id":423,"name":"Middle-earth: Shadow of Mordor"},{"executables":{"win32":["Subnautica.exe"]},"id":424,"name":"Subnautica"},{"executables":{"win32":["anno5.exe"]},"id":425,"name":"Anno 2070"},{"executables":{"win32":["carrier.exe"]},"id":426,"name":"Carrier Command Gaea Mission"},{"executables":{"win32":["DarksidersPC.exe"]},"id":427,"name":"Darksiders"},{"executables":{"win32":["Darksiders2.exe"]},"id":428,"name":"Darksiders 2"},{"executables":{"win32":["mudlet.exe"]},"id":429,"name":"Mudlet"},{"executables":{"win32":["DunDefLauncher.exe"]},"id":430,"name":"Dungeon Defenders II"},{"executables":{"win32":["hng.exe"]},"id":431,"name":"Heroes and Generals"},{"executables":{"win32":["WFTOGame.exe"]},"id":432,"name":"War of the Overworld"},{"executables":{"win32":["Talisman.exe"]},"id":433,"name":"Talisman: Digital Edition"},{"executables":{"win32":["limbo.exe"]},"id":434,"name":"Limbo"},{"executables":{"win32":["ibbobb.exe"]},"id":435,"name":"ibb & obb"},{"executables":{"win32":["BattleBlockTheater.exe"]},"id":436,"name":"BattleBlock Theater"},{"executables":{"win32":["iracinglauncher.exe","iracingsim.exe","iracingsim64.exe"]},"id":437,"name":"iRacing"},{"executables":{"win32":["CivilizationV_DX11.exe"]},"id":438,"name":"Civilization V"}]
},{}]},{},[9])(9)
});