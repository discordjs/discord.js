module.exports = function makeError(obj) {
  const err = new Error(obj.message, obj.fileName, obj.lineNumber);
  err.name = obj.name;
  err.columnNumber = obj.columnNumber;
  err.stack = obj.stack;
  return err;
};
