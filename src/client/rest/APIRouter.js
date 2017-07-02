const util = require('util');

const methods = ['get', 'post', 'delete', 'patch', 'put'];
const reflectors = [
  'toString', 'valueOf', 'inspect', 'constructor',
  Symbol.toPrimitive, util.inspect.custom,
];

module.exports = restManager => {
  const handler = {
    get(list, name) {
      if (name === 'opts') {
        function toReturn(...args) { // eslint-disable-line no-inner-declarations
          list.push(...args.filter(x => x !== null && typeof x !== 'undefined'));
          return new Proxy(list, handler);
        }
        const directJoin = () => `${list.join('/')}/${name}`;
        for (const r of reflectors) toReturn[r] = directJoin;
        for (const method of methods) {
          toReturn[method] = options => restManager.request(method, directJoin(), options);
        }
        return toReturn;
      }
      if (reflectors.includes(name)) return () => list.join('/');
      if (methods.includes(name)) return options => restManager.request(name, list.join('/'), options);
      list.push(name);
      return new Proxy(list, handler);
    },
  };

  return new Proxy([''], handler);
};
