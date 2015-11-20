"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var Permissions=require("../Constants.js").Permissions; /*

example data

{ position: -1,
    permissions: 36953089,
    name: '@everyone',
    managed: false,
    id: '110007368451915776',
    hoist: false,
    color: 0 }
*/var DefaultRole=[Permissions.createInstantInvite,Permissions.readMessages,Permissions.readMessageHistory,Permissions.sendMessages,Permissions.sendTTSMessages,Permissions.embedLinks,Permissions.attachFiles,Permissions.readMessageHistory,Permissions.mentionEveryone,Permissions.voiceConnect,Permissions.voiceSpeak,Permissions.voiceUseVAD].reduce(function(previous,current){return previous | current;},0);var Role=(function(){function Role(data,server,client){_classCallCheck(this,Role);this.position = data.position || -1;this.permissions = data.permissions || (data.name === "@everyone"?DefaultRole:0);this.name = data.name || "@everyone";this.managed = data.managed || false;this.id = data.id;this.hoist = data.hoist || false;this.color = data.color || 0;this.server = server;this.client = client;}Role.prototype.serialise = function serialise(explicit){var _this=this;var hp=function hp(perm){return _this.hasPermission(perm,explicit);};return { // general
createInstantInvite:hp(Permissions.createInstantInvite),kickMembers:hp(Permissions.kickMembers),banMembers:hp(Permissions.banMembers),manageRoles:hp(Permissions.manageRoles),manageChannels:hp(Permissions.manageChannels),manageServer:hp(Permissions.manageServer), // text
readMessages:hp(Permissions.readMessages),sendMessages:hp(Permissions.sendMessages),sendTTSMessages:hp(Permissions.sendTTSMessages),manageMessages:hp(Permissions.manageMessages),embedLinks:hp(Permissions.embedLinks),attachFiles:hp(Permissions.attachFiles),readMessageHistory:hp(Permissions.readMessageHistory),mentionEveryone:hp(Permissions.mentionEveryone), // voice
voiceConnect:hp(Permissions.voiceConnect),voiceSpeak:hp(Permissions.voiceSpeak),voiceMuteMembers:hp(Permissions.voiceMuteMembers),voiceDeafenMembers:hp(Permissions.voiceDeafenMembers),voiceMoveMembers:hp(Permissions.voiceMoveMembers),voiceUseVAD:hp(Permissions.voiceUseVAD)};};Role.prototype.serialize = function serialize(){ // ;n;
return this.serialise();};Role.prototype.hasPermission = function hasPermission(perm){var explicit=arguments.length <= 1 || arguments[1] === undefined?false:arguments[1];if(perm instanceof String || typeof perm === "string"){perm = Permissions[perm];}if(!perm){return false;}if(!explicit){ // implicit permissions allowed
if(!!(this.permissions & Permissions.manageRoles)){ // manageRoles allowed, they have all permissions
return true;}} // e.g.
// !!(36953089 & Permissions.manageRoles) = not allowed to manage roles
// !!(36953089 & (1 << 21)) = voice speak allowed
return !!(this.permissions & perm);};Role.prototype.setPermission = function setPermission(permission,value){if(permission instanceof String || typeof permission === "string"){permission = Permissions[permission];}if(permission){ // valid permission
if(value){this.permissions |= permission;}else {this.permissions &= ~permission;}}};Role.prototype.setPermissions = function setPermissions(obj){var _this2=this;obj.forEach(function(value,permission){if(permission instanceof String || typeof permission === "string"){permission = Permissions[permission];}if(permission){ // valid permission
_this2.setPermission(permission,value);}});};Role.prototype.colorAsHex = function colorAsHex(){var val=this.color.toString();while(val.length < 6) {val = "0" + val;}return "#" + val;};return Role;})();module.exports = Role;
