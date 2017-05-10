const RESTMethods = require('./RESTMethods');
const SequentialRequestHandler = require('./RequestHandlers/Sequential');
const BurstRequestHandler = require('./RequestHandlers/Burst');
const APIRequest = require('./APIRequest');
const Constants = require('../../util/Constants');

class RESTManager {
  constructor(client) {
    this.client = client;
    this.handlers = {};
    this.methods = new RESTMethods(this);
    this.rateLimitedEndpoints = {};
    this.globallyRateLimited = false;

    const Package = Constants.Package;
    this.userAgent = `DiscordBot (${Package.homepage.split('#')[0]}, ${Package.version}) Node.js/${process.version}`;
  }

  destroy() {
    for (const handlerID in this.handlers) {
      this.handlers[handlerID].destroy();
    }
  }

  push(handler, apiRequest) {
    return new Promise((resolve, reject) => {
      handler.push({
        request: apiRequest,
        resolve,
        reject,
      });
    });
  }

  getRequestHandler() {
    switch (this.client.options.apiRequestMethod) {
      case 'sequential':
        return SequentialRequestHandler;
      case 'burst':
        return BurstRequestHandler;
      default:
        throw new Error(Constants.Errors.INVALID_RATE_LIMIT_METHOD);
    }
  }

  request(method, url, options) {
    const request = new APIRequest(this.client, method, url, options);
    if (!this.handlers[request.route]) {
      const RequestHandlerType = this.getRequestHandler();
      this.handlers[request.route] = new RequestHandlerType(this, request.route);
    }

    return this.push(this.handlers[request.route], request);
  }
}

module.exports = RESTManager;
