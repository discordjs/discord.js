const Channel = require('./Channel');
const PermissionOverwrites = require('./PermissionOverwrites');
const EvaluatedPermissions = require('./EvaluatedPermissions');
const Constants = require('../util/Constants');

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a.length !== b.length) return false;

  for (const itemInd in a) {
    const item = a[itemInd];
    const ind = b.indexOf(item);
    if (ind) {
      b.splice(ind, 1);
    }
  }

  return b.length === 0;
}

class ServerChannel extends Channel {
  constructor(guild, data) {
    super(guild.client, data, guild);
  }

  setup(data) {
    super.setup(data);
    this.type = data.type;
    this.topic = data.topic;
    this.position = data.position;
    this.name = data.name;
    this.lastMessageID = data.last_message_id;
    this.ow = data.permission_overwrites;
    this.permissionOverwrites = [];
    if (data.permission_overwrites) {
      for (const overwrite of data.permission_overwrites) {
        this.permissionOverwrites.push(new PermissionOverwrites(this, overwrite));
      }
    }
  }

  equals(other) {
    let base = (
      this.type === other.type &&
      this.topic === other.topic &&
      this.position === other.position &&
      this.name === other.name &&
      this.id === other.id
    );

    if (base) {
      if (other.permission_overwrites) {
        const thisIDSet = this.permissionOverwrites.map(overwrite => overwrite.id);
        const otherIDSet = other.permission_overwrites.map(overwrite => overwrite.id);
        if (arraysEqual(thisIDSet, otherIDSet)) {
          base = true;
        } else {
          base = false;
        }
      } else {
        base = false;
      }
    }

    return base;
  }

  permissionsFor(member) {
    member = this.client.resolver.resolveGuildMember(this.guild, member);
    if (member) {
      if (this.guild.owner.id === member.id) {
        return new EvaluatedPermissions(member, Constants.ALL_PERMISSIONS);
      }

      const roles = member.roles;
      let permissions = 0;
      const overwrites = this.overwritesFor(member, true);

      for (const role of roles) {
        permissions |= role.permissions;
      }

      for (const overwrite of overwrites.role.concat(overwrites.member)) {
        permissions &= ~overwrite.denyData;
        permissions |= overwrite.allowData;
      }

      const admin = Boolean(permissions & (Constants.PermissionFlags.MANAGE_ROLES));
      if (admin) {
        permissions = Constants.ALL_PERMISSIONS;
      }

      return new EvaluatedPermissions(member, permissions);
    }
    return null;
  }

  overwritesFor(member, verified) {
    // for speed
    if (!verified) member = this.client.resolver.resolveGuildMember(this.guild, member);
    if (member) {
      const memberRoles = member._roles;

      const roleOverwrites = [];
      const memberOverwrites = [];

      for (const overwrite of this.permissionOverwrites) {
        if (overwrite.id === member.id) {
          memberOverwrites.push(overwrite);
        } else if (memberRoles.indexOf(overwrite.id) > -1) {
          roleOverwrites.push(overwrite);
        }
      }

      return {
        role: roleOverwrites,
        member: memberOverwrites,
      };
    }

    return [];
  }

  edit(data) {
    return this.client.rest.methods.updateChannel(this, data);
  }

  setName(name) {
    return this.client.rest.methods.updateChannel(this, { name });
  }

  setPosition(position) {
    return this.rest.client.rest.methods.updateChannel(this, { position });
  }

  setTopic(topic) {
    return this.rest.client.rest.methods.updateChannel(this, { topic });
  }

  setBitrate(bitrate) {
    return this.rest.client.rest.methods.updateChannel(this, { bitrate });
  }

  toString() {
    return this.name;
  }
}

module.exports = ServerChannel;
