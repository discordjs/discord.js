const Constants = require('../util/Constants');

/**
 * Represents a Role on Discord
 */
class Role {
  constructor(guild, data) {
    /**
     * The guild that the role belongs to
     * @type {Guild}
     */
    this.guild = guild;
    /**
     * The client that instantiated the role
     * @type {Client}
     */
    this.client = guild.client;
    if (data) {
      this.setup(data);
    }
  }

  equals(role) {
    return (
      this.id === role.id &&
      this.name === role.name &&
      this.color === role.color &&
      this.hoist === role.hoist &&
      this.position === role.position &&
      this.permissions === role.permissions &&
      this.managed === role.managed
    );
  }

  setup(data) {
    /**
     * The ID of the role (unique to the guild it is part of)
     * @type {String}
     */
    this.id = data.id;
    /**
     * The name of the role
     * @type {String}
     */
    this.name = data.name;
    /**
     * The base 10 color of the role
     * @type {Number}
     */
    this.color = data.color;
    /**
     * If true, users that are part of this role will appear in a separate category in the users list
     * @type {Boolean}
     */
    this.hoist = data.hoist;
    /**
     * The position of the role in the role manager
     * @type {Number}
     */
    this.position = data.position;
    /**
     * The evaluated permissions number
     * @type {Number}
     */
    this.permissions = data.permissions;
    /**
     * Whether or not the role is managed by an external service
     * @type {Boolean}
     */
    this.managed = data.managed;
  }

  /**
   * Deletes the role
   * @returns {Promise<Role, Error>}
   * @example
   * // delete a role
   * role.delete()
   *  .then(r => console.log(`Deleted role ${r}`))
   *  .catch(console.log);
   */
  delete() {
    return this.client.rest.methods.deleteGuildRole(this);
  }

  /**
   * Edits the role
   * @param {RoleData} data the new data for the role
   * @returns {Promise<Role, Error>}
   * @example
   * // edit a role
   * role.edit({name: 'new role'})
   *  .then(r => console.log(`Edited role ${r}`))
   *  .catch(console.log);
   */
  edit(data) {
    return this.client.rest.methods.updateGuildRole(this, data);
  }

  /**
   * Set a new name for the role
   * @param {String} name the new name of the role
   * @returns {Promise<Role, Error>}
   * @example
   * // set the name of the role
   * role.setName('new role')
   *  .then(r => console.log(`Edited name of role ${r}`))
   *  .catch(console.log);
   */
  setName(name) {
    return this.client.rest.methods.updateGuildRole(this, { name });
  }

  /**
   * Set a new color for the role
   * @param {Number} color the new color for the role
   * @returns {Promise<Role, Error>}
   * @example
   * // set the color of a role
   * role.setColor(parseInt('FF0000', 16))
   *  .then(r => console.log(`Set color of role ${r}`))
   *  .catch(console.log);
   */
  setColor(color) {
    return this.client.rest.methods.updateGuildRole(this, { color });
  }

  /**
   * Set whether or not the role should be hoisted
   * @param {Boolean} hoist whether or not to hoist the role
   * @returns {Promise<Role, Error>}
   * @example
   * // set the hoist of the role
   * role.setHoist(true)
   *  .then(r => console.log(`Role hoisted: ${r.hoist}`))
   *  .catch(console.log);
   */
  setHoist(hoist) {
    return this.client.rest.methods.updateGuildRole(this, { hoist });
  }

  /**
   * Set the position of the role
   * @param {Number} position the position of the role
   * @returns {Promise<Role, Error>}
   * @example
   * // set the position of the role
   * role.setPosition(1)
   *  .then(r => console.log(`Role position: ${r.position}`))
   *  .catch(console.log);
   */
  setPosition(position) {
    return this.client.rest.methods.updateGuildRole(this, { position });
  }

  /**
   * Set the permissions of the role
   * @param {Array<String>} permissions the permissions of the role
   * @returns {Promise<Role, Error>}
   * @example
   * // set the permissions of the role
   * role.setPermissions(['KICK_MEMBERS', 'BAN_MEMBERS'])
   *  .then(r => console.log(`Role updated ${r}`))
   *  .catch(console.log);
   */
  setPermissions(permissions) {
    return this.client.rest.methods.updateGuildRole(this, { permissions });
  }

  /**
   * Get an object mapping permission names to whether or not the role enables that permission
   * @returns {Object<String, Boolean>}
   * @example
   * // print the serialized role
   * console.log(role.serialize());
   */
  serialize() {
    const serializedPermissions = {};
    for (const permissionName in Constants.PermissionFlags) {
      serializedPermissions[permissionName] = this.hasPermission(permissionName);
    }

    return serializedPermissions;
  }

  /**
   * Whether or not the role includes the given permission
   * @param {String} permission the name of the permission to test
   * @param {Boolean} [explicit=false] whether or not the inclusion of the permission is explicit
   * @returns {Boolean}
   * @example
   * // see if a role can ban a member
   * if (role.hasPermission('BAN_MEMBERS')) {
   *   console.log('This role can ban members');
   * } else {
   *   console.log('This role can\'t ban members');
   * }
   */
  hasPermission(permission, explicit = false) {
    if (permission instanceof String || typeof permission === 'string') {
      permission = Constants.PermissionFlags[permission];
    }

    if (!permission) {
      throw Constants.Errors.NOT_A_PERMISSION;
    }

    if (!explicit) {
      if ((this.permissions & Constants.PermissionFlags.ADMINISTRATOR) > 0) {
        return true;
      }
    }

    return ((this.permissions & permission) > 0);
  }
}

module.exports = Role;
