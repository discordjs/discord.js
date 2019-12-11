'use strict';

const RequestHandler = require('./RequestHandler');
const APIRequest = require('./APIRequest');
const routeBuilder = require('./APIRouter');
const { Error } = require('../errors');
const { Endpoints } = require('../util/Constants');
const Collection = require('../util/Collection');

class RESTManager {
  constructor(client, tokenPrefix = 'Bot') {
    this.client = client;
    this.handlers = new Collection();
    this.tokenPrefix = tokenPrefix;
    this.versioned = true;
    this.globalTimeout = null;
    if (client.options.restSweepInterval > 0) {
      client.setInterval(() => {
        this.handlers.sweep(handler => handler._inactive);
      }, client.options.restSweepInterval * 1000);
    }
  }

  get api() {
    return routeBuilder(this);
  }

  getAuth() {
    const token = this.client.token || this.client.accessToken;
    if (token) return `${this.tokenPrefix} ${token}`;
    throw new Error('TOKEN_MISSING');
  }

  get cdn() {
    return Endpoints.CDN(this.client.options.http.cdn);
  }

  push(handler, apiRequest) {
    return new Promise((resolve, reject) => {
      handler.push({
        request: apiRequest,
        resolve,
        reject,
        retries: 0,
      }).catch(reject);
    });
  }

  request(method, url, options = {}) {
    const apiRequest = new APIRequest(this, method, url, options);
    let handler = this.handlers.get(apiRequest.route);

    if (!handler) {
      handler = new RequestHandler(this);
      this.handlers.set(apiRequest.route, handler);
    }

    return this.push(handler, apiRequest);
  }

  set endpoint(endpoint) {
    this.client.options.http.api = endpoint;
  }
}

module.exports = RESTManager;
