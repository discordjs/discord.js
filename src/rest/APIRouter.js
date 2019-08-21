'use strict';

const noop = () => {}; // eslint-disable-line no-empty-function
const methods = ['get', 'post', 'delete', 'patch', 'put'];
const reflectors = [
  'toString', 'valueOf', 'inspect', 'constructor',
  Symbol.toPrimitive, Symbol.for('util.inspect.custom'),
];

function apiRouter(restManager) {
  const stackHolder = {};
  Error.captureStackTrace(stackHolder, apiRouter);
  const route = [''];
  const handler = {
    get(_, name) {
      if (reflectors.includes(name)) return () => route.join('/');
      if (methods.includes(name)) {
        const normalizedRoute = [];
        for (const [i, r] of route.entries()) {
          if (r === 'reactions') {
            normalizedRoute.push('reactions/*');
            break;
          }
          if (/\d{16,19}/g.test(r) && !/channels|guilds|webhooks/.test(route[i - 1])) normalizedRoute.push(':id');
          else normalizedRoute.push(r);
        }
        // Method, normalized route, full path, otherOptions, stack
        return options => restManager.request(
          name,
          normalizedRoute.join('/'),
          route.join('/'),
          {
            ...options,
            versioned: restManager.versioned,
          },
          stackHolder.stack,
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
}

module.exports = apiRouter;
