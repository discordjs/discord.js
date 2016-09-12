const Constants = require('../util/Constants');

/**
 * Represents a Role on Discord
 */
class Role {
  constructor(guild, data) {
    /**
     * The client that instantiated the role
     * @type {Client}
     */
    this.client = guild.client;
    Object.defineProperty(this, 'client', { enumerable: false, configurable: false });

    /**
     * The guild that the role belongs to
     * @type {Guild}
     */
    this.guild = guild;

    if (data) this.setup(data);
  }

  setup(data) {
    /**
     * The ID of the role (unique to the guild it is part of)
     * @type {string}
     */
    this.id = data.id;

    /**
     * The name of the role
     * @type {string}
     */
    this.name = data.name;

    /**
     * The base 10 color of the role
     * @type {number}
     */
    this.color = data.color;

    /**
     * If true, users that are part of this role will appear in a separate category in the users list
     * @type {boolean}
     */
    this.hoist = data.hoist;

    /**
     * The position of the role in the role manager
     * @type {number}
     */
    this.position = data.position;

    /**
     * The evaluated permissions number
     * @type {number}
     */
    this.permissions = data.permissions;

    /**
     * Whether or not the role is managed by an external service
     * @type {boolean}
     */
    this.managed = data.managed;
  }

  /**
   * The time the role was created
   * @readonly
   * @type {Date}
   */
  get creationDate() {
    return new Date((this.id / 4194304) + 1420070400000);
  }

  /**
   * The hexadecimal version of the role color, with a leading hashtag.
   * @type {string}
   * @readonly
   */
  get hexColor() {
    let col = this.color.toString(16);
    while (col.length < 6) col = `0${col}`;
    return `#${col}`;
  }

  /**
   * Get an object mapping permission names to whether or not the role enables that permission
   * @returns {Object<string, boolean>}
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
   * Checks if the role has a permission.
   * @param {PermissionResolvable} permission The permission to check for
   * @param {boolean} [explicit=false] Whether to require the role to explicitly have the exact permission
   * @returns {boolean}
   * @example
   * // see if a role can ban a member
   * if (role.hasPermission('BAN_MEMBERS')) {
   *   console.log('This role can ban members');
   * } else {
   *   console.log('This role can\'t ban members');
   * }
   */
  hasPermission(permission, explicit = false) {
    permission = this.client.resolver.resolvePermission(permission);
    if (!explicit && (this.permissions & Constants.PermissionFlags.ADMINISTRATOR) > 0) return true;
    return (this.permissions & permission) > 0;
  }

  /**
   * Checks if the role has all specified permissions.
   * @param {PermissionResolvable[]} permissions The permissions to check for
   * @param {boolean} [explicit=false] Whether to require the role to explicitly have the exact permissions
   * @returns {boolean}
   */
  hasPermissions(permissions, explicit = false) {
    return permissions.map(p => this.hasPermission(p, explicit)).every(v => v);
  }

  /**
   * Edits the role
   * @param {RoleData} data The new data for the role
   * @returns {Promise<Role>}
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
   * @param {string} name The new name of the role
   * @returns {Promise<Role>}
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
   * @param {number|string} color The new color for the role, either a hex string or a base 10 number
   * @returns {Promise<Role>}
   * @example
   * // set the color of a role
   * role.setColor('#FF0000')
   *  .then(r => console.log(`Set color of role ${r}`))
   *  .catch(console.log);
   */
  setColor(color) {
    return this.client.rest.methods.updateGuildRole(this, { color });
  }

  /**
   * Set whether or not the role should be hoisted
   * @param {boolean} hoist Whether or not to hoist the role
   * @returns {Promise<Role>}
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
   * @param {number} position The position of the role
   * @returns {Promise<Role>}
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
   * @param {string[]} permissions The permissions of the role
   * @returns {Promise<Role>}
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
   * Deletes the role
   * @returns {Promise<Role>}
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
   * Whether this role equals another role. It compares all properties, so for most operations
   * it is advisable to just compare `role.id === role2.id` as it is much faster and is often
   * what most users need.
   * @param {Role} role The role to compare to
   * @returns {boolean}
   */
  equals(role) {
    return role &&
      this.id === role.id &&
      this.name === role.name &&
      this.color === role.color &&
      this.hoist === role.hoist &&
      this.position === role.position &&
      this.permissions === role.permissions &&
      this.managed === role.managed;
  }

  /**
   * When concatenated with a string, this automatically concatenates the Role mention rather than the Role object.
   * @returns {string}
   */
  toString() {
    return `<@&${this.id}>`;
  }
}

module.exports = Role;
