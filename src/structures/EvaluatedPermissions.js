const Constants = require('../util/Constants');

/**
 * The final evaluated permissions for a member in a channel
 */
class EvaluatedPermissions {
  constructor(member, permissions) {
    /**
     * The member this permissions refer to
     * @type {GuildMember}
     */
    this.member = member;
    /**
     * A number representing the packed permissions.
     * @private
     * @type {number}
     */
    this.permissions = permissions;
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
   * Checks whether a user has a certain permission, e.g. `READ_MESSAGES`.
   * @param {string} permission the permission to check for
   * @param {boolean} [explicit=false] whether the user should explicitly have the permission.
   * @returns {boolean}
   */
  hasPermission(permission, explicit = false) {
    if (typeof permission === 'string') permission = Constants.PermissionFlags[permission];
    if (!permission) throw Constants.Errors.NOT_A_PERMISSION;

    if (!explicit && (this.permissions & Constants.PermissionFlags.ADMINISTRATOR) > 0) return true;
    return (this.permissions & permission) > 0;
  }
}

module.exports = EvaluatedPermissions;
