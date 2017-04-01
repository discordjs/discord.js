"use strict";

const Base = require("./Base");

/**
* Represents a guild
* @prop {String} id The ID of the guild
* @prop {Boolean} unavailable Whether the guild is unavailable or not
* @prop {Shard} shard The Shard that owns the guild
*/
class UnavailableGuild extends Base {
    constructor(data, client) {
        super(data.id);
        this.shard = client.shards.get(client.guildShardMap[this.id]);
        this.unavailable = !!data.unavailable;
    }
}

module.exports = UnavailableGuild;
