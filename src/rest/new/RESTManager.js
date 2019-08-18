'use strict';

const apiRouter = require('./APIRouter');
const { Endpoints } = require('../../util/Constants');

class RESTManager {
  constructor(client, tokenPrefix = 'Bot') {
    this.client = client;
    this.tokenPrefix = tokenPrefix;
    this.versioned = true;

    // if (client.options.restSweepInterval > 0) {
    //   client.setInterval(() => {
    //     this.handlers.sweep(handler => handler._inactive);
    //   }, client.options.restSweepInterval * 1000);
    // }
  }

  get api() {
    return apiRouter(this);
  }

  get cdn() {
    return Endpoints.CDN(this.client.options.http.cdn);
  }

  request(method, normalizedPath, url, options = {}) {
    console.log(method, normalizedPath, url, options);
    throw 'no';
  }
}

module.exports = RESTManager;
