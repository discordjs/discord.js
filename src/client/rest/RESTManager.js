const request = require('superagent');
const Constants = require('../../util/Constants');
const UserAgentManager = require('./UserAgentManager');
const RESTMethods = require('./RESTMethods');

class RESTManager {

  constructor(client) {
    this.client = client;
    this.queue = [];
    this.userAgentManager = new UserAgentManager(this);
    this.methods = new RESTMethods(this);
    this.rateLimitedEndpoints = {};
  }

  addRequestToQueue(method, url, auth, data, file, resolve, reject) {
    const endpoint = url.replace(/\/[0-9]+/g, '/:id');

    const rateLimitedEndpoint = this.rateLimitedEndpoints[endpoint];

    rateLimitedEndpoint.queue = rateLimitedEndpoint.queue || [];

    rateLimitedEndpoint.queue.push({
      method,
      url,
      auth,
      data,
      file,
      resolve,
      reject,
    });
  }

  processQueue(endpoint) {
    const rateLimitedEndpoint = this.rateLimitedEndpoints[endpoint];

    // prevent multiple queue processes
    if (!rateLimitedEndpoint.timeout) {
      return;
    }

    // lock the queue
    clearTimeout(rateLimitedEndpoint.timeout);
    rateLimitedEndpoint.timeout = null;

    for (const item of rateLimitedEndpoint.queue) {
      this.makeRequest(item.method, item.url, item.auth, item.data, item.file)
        .then(item.resolve)
        .catch(item.reject);
    }

    rateLimitedEndpoint.queue = [];
  }

  makeRequest(method, url, auth, data, file) {
    /*
    	file is {file, name}
     */
    const apiRequest = request[method](url);

    const endpoint = url.replace(/\/[0-9]+/g, '/:id');

    if (this.rateLimitedEndpoints[endpoint] && this.rateLimitedEndpoints[endpoint].timeout) {
      return new Promise((resolve, reject) => {
        this.addRequestToQueue(method, url, auth, data, file, resolve, reject);
      });
    }

    if (auth) {
      if (this.client.store.token && this.client.store.user && this.client.store.user.bot) {
        apiRequest.set('authorization', `Bot ${this.client.store.token}`);
      } else if (this.client.store.token) {
        apiRequest.set('authorization', this.client.store.token);
      } else {
        throw Constants.Errors.NO_TOKEN;
      }
    }

    if (data) {
      apiRequest.send(data);
    }

    if (file) {
      apiRequest.attach('file', file.file, file.name);
    }

    apiRequest.set('User-Agent', this.userAgentManager.userAgent);

    return new Promise((resolve, reject) => {
      apiRequest.end((err, res) => {
        if (err) {
          const retry = res.headers['retry-after'] || res.headers['Retry-After'];
          if (retry) {
            this.rateLimitedEndpoints[endpoint] = {};
            this.addRequestToQueue(method, url, auth, data, file, resolve, reject);
            this.rateLimitedEndpoints[endpoint].timeout = setTimeout(() => {
              this.processQueue(endpoint);
            }, retry);
            return;
          }

          reject(err);
        } else {
          console.log(res.headers);
          resolve(res ? res.body || {} : {});
        }
      });
    });
  }
}

module.exports = RESTManager;
