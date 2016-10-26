module.exports = function makePlainError(err) {
  const obj = {};
  obj.name = err.name;
  obj.message = err.message;
  obj.stack = err.stack;
  return obj;
};
