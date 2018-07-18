const Permissions = require('../../util/Permissions');
const Collection = require('../../util/Collection');

module.exports = function resolvePermissions(overwrites, guild) {
  if (overwrites instanceof Collection || overwrites instanceof Array) {
    overwrites = overwrites.map(overwrite => {
      const role = this.client.resolver.resolveRole(guild, overwrite.id);
      if (role) {
        overwrite.id = role.id;
        overwrite.type = 'role';
      } else {
        overwrite.id = this.client.resolver.resolveUserID(overwrite.id);
        overwrite.type = 'member';
      }

      return {
        allow: Permissions.resolve(overwrite.allow || overwrite.allowed || 0),
        deny: Permissions.resolve(overwrite.deny || overwrite.denied || 0),
        type: overwrite.type,
        id: overwrite.id,
      };
    });
  }

  return overwrites;
};
