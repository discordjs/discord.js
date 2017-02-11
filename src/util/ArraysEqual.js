module.exports = function arraysEqual(a, b) {
  if (a === b) return true;
  if (a.length !== b.length) return false;

  return a.every(e => b.includes(e));
};
