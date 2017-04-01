"use strict";

const Base = require("./Base");

/**
* Represents a Relationship
* @prop {User} user The other user in the relationship
* @prop {Number} type The type of relationship. 1 is friend, 2 is block, 3 is incoming request, 4 is outgoing request
* @prop {String} status The other user's status. Either "online", "idle", or "offline"
* @prop {Object?} game The active game the other user is playing
* @prop {String} game.name The name of the active game
* @prop {Number} game.type The type of the active game (0 is default, 1 is Twitch, 2 is YouTube)
* @prop {String?} game.url The url of the active game
*/

class Relationship extends Base {
    constructor(data, client) {
        super(data.id);
        this.user = client.users.add(data.user, client);
        this.update(data);
    }

    update(data) {
        this.type = data.type !== undefined ? data.type : this.type || 0;
        this.status = data.status !== undefined ? data.status : this.status || "offline";
        this.game = data.game !== undefined ? data.game : this.game || null;
    }
}

module.exports = Relationship;
