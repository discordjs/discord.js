"use strict";

const Base = require("./Base");

/**
* Represents a guild integration
* @prop {String} id The ID of the integration
* @prop {Number} createdAt Timestamp of the guild integration's creation
* @prop {String} name The name of the integration
* @prop {String} type The type of the integration
* @prop {String} roleID The ID of the role connected to the integration
* @prop {User} user The user connected to the integration
* @prop {Object} account Info on the integration account
* @prop {String} account.id The ID of the integration account
* @prop {String} account.name The name of the integration account
* @prop {Boolean} enabled Whether the integration is enabled or not
* @prop {Boolean} syncing Whether the integration is syncing or not
* @prop {Number} expireBehavior behavior of expired subscriptions
* @prop {Number} expireGracePeriod grace period for expired subscriptions
* @prop {Boolean} enableEmoticons Whether integration emoticons are enabled or not
* @prop {Number} subscriberCount number of subscribers
* @prop {Number} syncedAt Unix timestamp of last integration sync
*/
class GuildIntegration extends Base {
    constructor(data, guild) {
        super(data.id);
        this.guild = guild;
        this.name = data.name;
        this.type = data.type;
        this.roleID = data.role_id;
        this.user = guild.shard.client.users.add(data.user, guild.shard.client);
        this.account = data.account; // not worth making a class for
        this.update(data);
    }

    update(data) {
        this.enabled = data.enabled;
        this.syncing = data.syncing;
        this.expireBehavior = data.expire_behavior;
        this.expireGracePeriod = data.expire_grace_period;
        this.enableEmoticons = data.enable_emoticons;
        this.subscriberCount = data.subscriber_count;
        this.syncedAt = data.synced_at;
    }

    /**
    * Edit the guild integration
    * @arg {Object} options The properties to edit
    * @arg {String} [options.expireBehavior] What to do when a user's subscription runs out
    * @arg {String} [options.expireGracePeriod] How long before the integration's role is removed from an unsubscribed user
    * @arg {String} [options.enableEmoticons] Whether to enable integration emoticons or not
    * @returns {Promise}
    */
    edit(options) {
        return this.guild.shard.client.editGuildIntegration.call(this.guild.shard.client, this.guild.id, this.id, options);
    }

    /**
    * Delete the guild integration
    * @returns {Promise}
    */
    delete() {
        return this.guild.shard.client.deleteGuildIntegration.call(this.guild.shard.client, this.guild.id, this.id);
    }

    /**
    * Force the guild integration to sync
    * @returns {Promise}
    */
    sync() {
        return this.guild.shard.client.syncGuildIntegration.call(this.guild.shard.client, this.guild.id, this.id);
    }
}

module.exports = GuildIntegration;