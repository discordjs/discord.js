const util = require('util');
const snekfetch = require('snekfetch');

// Paramable exists so we don't return a function unless we actually need one #savingmemory
const paramable = ['channels', 'users', 'guilds', 'members', 'bans', 'emojis'];
const reflectors = ['toString', 'valueOf', 'inspect', Symbol.toPrimitive, util.inspect.custom];

module.exports = restManager => {
  const handler = {
    get: (list, name) => {
      if (reflectors.includes(name)) return () => list.join('/');
      if (paramable.includes(name)) {
        function toReturn(id) { // eslint-disable-line no-inner-declarations
          list = list.concat(name);
          if (id) list = list.concat(id);
          return new Proxy(list, handler);
        }
        const directJoin = () => `${list.join('/')}/${name}`;
        for (const r of reflectors) toReturn[r] = directJoin;
        return toReturn;
      }
      if (name in snekfetch) return options => restManager.request(name, list.join('/'), options);
      return new Proxy(list.concat(name), handler);
    },
  };

  return new Proxy([''], handler);
};
