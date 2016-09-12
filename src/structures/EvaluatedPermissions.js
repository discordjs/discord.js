const Constants = require('../util/Constants');

/**
 * The final evaluated permissions for a member in a channel
 */
class EvaluatedPermissions {
  constructor(member, raw) {
    /**
     * The member this permissions refer to
     * @type {GuildMember}
     */
    this.member = member;

    /**
     * A number representing the packed permissions
     * @type {number}
     */
    this.raw = raw;
  }

  /**
   * Get an object mapping permission name, e.g. `READ_MESSAGES` to a boolean - whether the user
   * can perform this or not.
   * @returns {Object<string, boolean>}
   */
  serialize() {
    const serializedPermissions = {};
    for (const permissionName in Constants.PermissionFlags) {
      serializedPermissions[permissionName] = this.hasPermission(permissionName);
    }
    return serializedPermissions;
  }

  /**
   * Checks whether the user has a certain permission, e.g. `READ_MESSAGES`.
   * @param {PermissionResolvable} permission The permission to check for
   * @param {boolean} [explicit=false] Whether to require the user to explicitly have the exact permission
   * @returns {boolean}
   */
  hasPermission(permission, explicit = false) {
    permission = this.member.client.resolver.resolvePermission(permission);
    if (!explicit && (this.raw & Constants.PermissionFlags.ADMINISTRATOR) > 0) return true;
    return (this.raw & permission) > 0;
  }

  /**
   * Checks whether the user has all specified permissions.
   * @param {PermissionResolvable[]} permissions The permissions to check for
   * @param {boolean} [explicit=false] Whether to require the user to explicitly have the exact permissions
   * @returns {boolean}
   */
  hasPermissions(permissions, explicit = false) {
    return permissions.map(p => this.hasPermission(p, explicit)).every(v => v);
  }
}

module.exports = EvaluatedPermissions;
