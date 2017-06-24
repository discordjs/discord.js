const util = require('util');

const methods = ['get', 'post', 'delete', 'patch', 'put'];
// Paramable exists so we don't return a function unless we actually need one #savingmemory
const paramable = [
  'channels', 'users', 'guilds', 'members',
  'bans', 'emojis', 'pins', 'permissions',
  'reactions', 'webhooks', 'messages',
  'notes', 'roles', 'applications',
  'invites', 'bot',
];
const reflectors = ['toString', 'valueOf', 'inspect', Symbol.toPrimitive, util.inspect.custom];

module.exports = restManager => {
  const handler = {
    get(list, name) {
      if (reflectors.includes(name)) return () => list.join('/');
      if (paramable.includes(name)) {
        function toReturn(...args) { // eslint-disable-line no-inner-declarations
          list = list.concat(name);
          for (const arg of args) {
            if (arg !== null && typeof arg !== 'undefined') list = list.concat(arg);
          }
          return new Proxy(list, handler);
        }
        const directJoin = () => `${list.join('/')}/${name}`;
        for (const r of reflectors) toReturn[r] = directJoin;
        for (const method of methods) {
          toReturn[method] = options => restManager.request(method, `${list.join('/')}/${name}`, options);
        }
        return toReturn;
      }
      if (methods.includes(name)) return options => restManager.request(name, list.join('/'), options);
      return new Proxy(list.concat(name), handler);
    },
  };

  return new Proxy([''], handler);
};
