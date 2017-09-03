const util = require('util');

const noop = () => {}; // eslint-disable-line no-empty-function
const methods = ['get', 'post', 'delete', 'patch', 'put'];
const reflectors = [
  'toString', 'valueOf', 'inspect', 'constructor',
  Symbol.toPrimitive, util.inspect.custom,
];

function buildRoute(manager) {
  const route = [''];
  const handler = {
    get(target, name) {
      if (reflectors.includes(name)) return () => route.join('/');
      if (methods.includes(name)) {
        return options => manager.request(name, route.join('/'), Object.assign({
          versioned: manager.versioned,
          route: route.map((r, i) => {
            if (/\d{16,19}/g.test(r)) return /channels|guilds/.test(route[i - 1]) ? r : ':id';
            return r;
          }).join('/'),
        }, options));
      }
      route.push(name);
      return new Proxy(noop, handler);
    },
    apply(target, _, args) {
      route.push(...args.filter(x => x != null)); // eslint-disable-line eqeqeq
      return new Proxy(noop, handler);
    },
  };
  return new Proxy(noop, handler);
}

module.exports = buildRoute;
