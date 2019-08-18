'use strict';

const noop = () => {}; // eslint-disable-line no-empty-function
const methods = ['get', 'post', 'delete', 'patch', 'put'];
const reflectors = [
  'toString', 'valueOf', 'inspect', 'constructor',
  Symbol.toPrimitive, Symbol.for('util.inspect.custom'),
];

module.exports = restManager => {
  const route = [''];
  const handler = {
    get(_, name) {
      if (reflectors.includes(name)) return () => route.join('/');
      if (methods.includes(name)) {
        // method, route, full path, otherOptions
        return options => restManager.request(
          name,
          route.map((r, i) => {
            if (/\d{16,19}/g.test(r)) return /channels|guilds|webhooks/.test(route[i - 1]) ? r : ':id';
            if (route[i - 1] === 'reactions') return ':reaction';
            return r;
          }).join('/'),
          route.join('/'),
          {
            ...options,
            versioned: restManager.versioned,
          }
        );
      }
      route.push(name);
      return new Proxy(noop, handler);
    },
    apply(_, __, args) {
      route.push(...args.filter(x => x != null)); // eslint-disable-line eqeqeq
      return new Proxy(noop, handler);
    },
  };

  return new Proxy(noop, handler);
};
