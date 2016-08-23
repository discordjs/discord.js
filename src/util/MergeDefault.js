module.exports = function merge(def, given) {
  if (!given) {
    return def;
  }

  given = given || {};

  for (const key in def) {
    if (!{}.hasOwnProperty.call(given, key)) {
      given[key] = def[key];
    } else if (given[key] === Object(given[key])) {
      given[key] = merge(def[key], given[key]);
    }
  }

  return given;
};
