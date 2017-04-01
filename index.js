"use strict";

const Client = require("./lib/Client");

function Eris(token, options) {
    return new Client(token, options);
}

Eris.Bucket = require("./lib/util/Bucket");
Eris.Call = require("./lib/structures/Call");
Eris.Channel = require("./lib/structures/Channel");
Eris.Client = Client;
Eris.Collection = require("./lib/util/Collection");
Eris.Command = require("./lib/command/Command");
Eris.CommandClient = require("./lib/command/CommandClient");
Eris.Constants = require("./lib/Constants");
Eris.ExtendedUser = require("./lib/structures/ExtendedUser");
Eris.GroupChannel = require("./lib/structures/GroupChannel");
Eris.Guild = require("./lib/structures/Guild");
Eris.GuildChannel = require("./lib/structures/GuildChannel");
Eris.GuildIntegration = require("./lib/structures/GuildIntegration");
Eris.Invite = require("./lib/structures/Invite");
Eris.Member = require("./lib/structures/Member");
Eris.Message = require("./lib/structures/Message");
Eris.Permission = require("./lib/structures/Permission");
Eris.PermissionOverwrite = require("./lib/structures/PermissionOverwrite");
Eris.PrivateChannel = require("./lib/structures/PrivateChannel");
Eris.Relationship = require("./lib/structures/Relationship");
Eris.Role = require("./lib/structures/Role");
Eris.Shard = require("./lib/gateway/Shard");
Eris.SharedStream = require("./lib/voice/SharedStream");
Eris.User = require("./lib/structures/User");
Eris.VoiceConnection = require("./lib/voice/VoiceConnection");
Eris.VoiceConnectionManager = require("./lib/voice/VoiceConnectionManager");
Eris.VoiceState = require("./lib/structures/VoiceState");

module.exports = Eris;
