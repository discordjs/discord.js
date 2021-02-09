'use strict';

const { Error } = require('../errors');

const noop = () => {}; // eslint-disable-line no-empty-function
const methods = ['get', 'post', 'delete', 'patch', 'put'];
const reflectors = [
  'toString',
  'valueOf',
  'inspect',
  'constructor',
  Symbol.toPrimitive,
  Symbol.for('nodejs.util.inspect.custom'),
];

function buildRoute(manager) {
  const route = [''];
  const handler = {
    get(target, name) {
      if (reflectors.includes(name)) return () => route.join('/');
      route.push(name);
      return new Proxy(noop, handler);
    },
    apply(target, _, args) {
      const method = route[route.length - 1];
      if (!methods.includes(method)) {
        return Promise.reject(new Error('API_ROUTER_INVALID_CALL'));
      }

      route.pop();
      const routeBucket = [];
      for (let i = 0; i < route.length; i++) {
        // Reactions routes and sub-routes all share the same bucket
        if (route[i - 1] === 'reactions') break;
        // Literal IDs should only be taken account if they are the Major ID (the Channel/Guild ID)
        if (/\d{16,19}/g.test(route[i]) && !/channels|guilds/.test(route[i - 1])) routeBucket.push(':id');
        // All other parts of the route should be considered as part of the bucket identifier
        else routeBucket.push(route[i]);
      }
      return manager.request(
        method,
        route.join('/'),
        Object.assign(
          {
            versioned: manager.versioned,
            route: routeBucket.join('/'),
          },
          args[0],
        ),
      );
    },
  };
  return new Proxy(noop, handler);
}

module.exports = buildRoute;
