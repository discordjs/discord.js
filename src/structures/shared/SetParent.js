module.exports = function setParent(channel, parent, lockPermissions, reason) {
  return channel.edit({
    parentID: parent !== null ? parent.id ? parent.id : parent : null,
    lockPermissions,
  }, reason);
};
