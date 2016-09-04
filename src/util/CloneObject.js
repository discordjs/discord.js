module.exports = function cloneObject(obj) {
  const cloned = Object.create(obj);
  Object.assign(cloned, obj);
  return cloned;
};
