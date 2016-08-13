const Constants = require('../util/Constants');

class Role {
  constructor(guild, data) {
    this.guild = guild;
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
    this.id = data.id;
    this.name = data.name;
    this.color = data.color;
    this.hoist = data.hoist;
    this.position = data.position;
    this.permissions = data.permissions;
    this.managed = data.managed;
  }

  delete() {
    return this.client.rest.methods.deleteGuildRole(this);
  }

  edit(data) {
    return this.client.rest.methods.updateGuildRole(this, data);
  }

  setName(name) {
    return this.client.rest.methods.updateGuildRole(this, { name });
  }

  setColor(color) {
    return this.client.rest.methods.updateGuildRole(this, { color });
  }

  setHoist(hoist) {
    return this.client.rest.methods.updateGuildRole(this, { hoist });
  }

  setPosition(position) {
    return this.client.rest.methods.updateGuildRole(this, { position });
  }

  setPermissions(permissions) {
    return this.client.rest.methods.updateGuildRole(this, { permissions });
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

module.exports = Role;
