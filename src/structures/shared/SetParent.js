module.exports = function setParent(channel, lockPermissions, reason) {
  return this.edit({
    parentID: channel !== null ? channel.id ? channel.id : channel : null,
    lockPermissions,
  }, reason);
};
