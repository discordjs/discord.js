'use strict';

const RequestHandler = require('./RequestHandler');
const APIRequest = require('./APIRequest');
const { createPromiseObject } = require('../util/Util');
const { Endpoints, Events } = require('../util/Constants');
const { Error } = require('../errors');
const Collection = require('../util/Collection');

class RESTManager {
  constructor(client, tokenPrefix = 'Bot') {
    this.client = client;
    this.tokenPrefix = tokenPrefix;
    this.versioned = true;

    // Collection of ratelimit buckets
    this.buckets = new Collection();

    // Collection of rest handlers
    this.handlers = new Collection();

    // Global timeout for ratelimits
    this.globalTimeout = null;

    if (client.options.restSweepInterval > 0) {
      client.setInterval(() => {
        this.handlers.sweep(handler => handler.isInactive);
      }, client.options.restSweepInterval * 1000);
    }

    Object.defineProperty(this, 'authToken', { value: undefined, writable: true });
  }

  get cdn() {
    return Endpoints.CDN(this.client.options.http.cdn);
  }

  request(method, normalizedPath, path, options = {}, stack) {
    this._checkAuthToken();
    const apiRequest = new APIRequest(this, method, path, options);

    const handlerKey = normalizedPath.includes('reactions') ? `*:${normalizedPath}` : `${method}:${normalizedPath}`;

    let handler = this.handlers.get(handlerKey);

    if (!handler) {
      handler = new RequestHandler(this, handlerKey);
      this.handlers.set(handlerKey, handler);
    }

    const { promise, resolve, reject } = createPromiseObject();

    handler.queue({
      request: apiRequest,
      promise,
      resolve,
      reject,
      retries: 0,
      stack,
    });

    return promise;
  }

  debug(message, route) {
    this.client.emit(Events.DEBUG, `[REST${route ? `(${route})` : ''}] ${message}`);
  }

  _checkAuthToken() {
    if (this.authToken) return;
    const token = this.client.token || this.client.accessToken;
    if (token) {
      this.authToken = `${this.tokenPrefix} ${token}`;
      return;
    }
    throw new Error('TOKEN_MISSING');
  }
}

module.exports = RESTManager;
