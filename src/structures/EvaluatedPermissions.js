const Constants = require('../util/Constants');

class EvaluatedPermissions {
  constructor(member, permissions) {
    this.member = member;
    this.permissions = permissions;
  }

  serialize() {
    const serializedPermissions = {};
    for (const permissionName in Constants.PermissionFlags) {
      serializedPermissions[permissionName] = this.hasPermission(permissionName);
    }

    return serializedPermissions;
  }

  hasPermission(permission, explicit) {
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

module.exports = EvaluatedPermissions;
