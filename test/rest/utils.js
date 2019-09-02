'use strict';

function createLogger(name) {
  return (method, route, extras = '') => console.log(`[${name}]
    Method: ${method}
    Route : ${route}
    Extra : ${extras || '---'}`);
}

exports.createLogger = createLogger;
