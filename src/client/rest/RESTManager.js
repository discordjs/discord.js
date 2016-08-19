const UserAgentManager = require('./UserAgentManager');
const RESTMethods = require('./RESTMethods');
const SequentialRequestHandler = require('./RequestHandlers/Sequential');
const APIRequest = require('./APIRequest');

class RESTManager {

  constructor(client) {
    this.client = client;
    this.handlers = {};
    this.userAgentManager = new UserAgentManager(this);
    this.methods = new RESTMethods(this);
    this.rateLimitedEndpoints = {};
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

  makeRequest(method, url, auth, data, file) {
    const apiRequest = new APIRequest(this, method, url, auth, data, file);

    if (!this.handlers[apiRequest.getEndpoint()]) {
      this.handlers[apiRequest.getEndpoint()] = new SequentialRequestHandler(this);
    }

    return this.push(this.handlers[apiRequest.getEndpoint()], apiRequest);
  }
}

module.exports = RESTManager;
