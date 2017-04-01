"use strict";

const Base = require("./Base");
const Permission = require("./Permission");

/**
* Represents a role
* @prop {String} id The ID of the role
* @prop {Number} createdAt Timestamp of the role's creation
* @prop {Guild} guild The guild that owns the role
* @prop {String} mention A string that mentions the role
* @prop {Number} createdAt Timestamp of role creation
* @prop {String} name The name of the role
* @prop {Boolean} mentionable Whether the role is mentionable or not
* @prop {Boolean} managed Whether a guild integration manages this role or not
* @prop {Boolean} hoist Whether users with this role are hoisted in the user list or not
* @prop {Number} color The hex color of the role in base 10
* @prop {Number} position The position of the role
* @prop {Permission} permissions The permissions representation of the role
*/
class Role extends Base {
    constructor(data, guild) {
        super(data.id);
        this.guild = guild;
        this.update(data);
    }

    update(data) {
        this.name = data.name !== undefined ? data.name : this.name;
        this.mentionable = data.mentionable !== undefined ? data.mentionable : this.mentionable;
        this.managed = data.managed !== undefined ? data.managed : this.managed;
        this.hoist = data.hoist !== undefined ? data.hoist : this.hoist;
        this.color = data.color !== undefined ? data.color : this.color;
        this.position = data.position !== undefined ? data.position : this.position;
        this.permissions = data.permissions !== undefined ? new Permission(data.permissions) : this.permissions;
    }

    /**
    * Generates a JSON representation of the role permissions
    * @returns {Object}
    */
    get json() {
        return this.permissions.json;
    }

    get mention() {
        return `<@&${this.id}>`;
    }

    /**
    * Edit the guild role
    * @arg {Object} options The properties to edit
    * @arg {String} [options.name] The name of the role
    * @arg {Number} [options.permissions] The role permissions number
    * @arg {Number} [options.color] The hex color of the role, in number form (ex: 0x3da5b3 or 4040115)
    * @arg {Boolean} [options.hoist] Whether to hoist the role in the user list or not
    * @arg {Boolean} [options.mentionable] Whether the role is mentionable or not
    * @returns {Promise<Role>}
    */
    edit(options) {
        return this.guild.shard.client.editRole.call(this.guild.shard.client, this.guild.id, this.id, options);
    }

    /**
    * Edit the role's position. Note that role position numbers are highest on top and lowest at the bottom.
    * @arg {Number} position The new position of the role
    * @returns {Promise}
    */
    editPosition(position) {
        return this.guild.shard.client.editRolePosition.call(this.guild.shard.client, this.guild.id, this.id, position);
    }

    /**
    * Delete the role
    * @returns {Promise}
    */
    delete() {
        return this.guild.shard.client.deleteRole.call(this.guild.shard.client, this.guild.id, this.id);
    }
}

module.exports = Role;
