const request = require('superagent');
const Constants = require('../../util/Constants');

class APIRequest {
  constructor(rest, method, url, auth, data, file) {
    this.rest = rest;
    this.method = method;
    this.url = url;
    this.auth = auth;
    this.data = data;
    this.file = file;
  }

  getEndpoint() {
    return `${this.method} ${this.url}`;
  }

  getAuth() {
    if (this.rest.client.token && this.rest.client.user && this.rest.client.user.bot) {
      return `Bot ${this.rest.client.token}`;
    } else if (this.rest.client.token) {
      return this.rest.client.token;
    }
    throw new Error(Constants.Errors.NO_TOKEN);
  }

  gen() {
    const apiRequest = request[this.method](this.url);
    if (this.auth) apiRequest.set('authorization', this.getAuth());
    if (this.file && this.file.file) {
      apiRequest.set('Content-Type', 'multipart/form-data');
      apiRequest.attach('file', this.file.file, this.file.name);
    }
    if (this.data) apiRequest.send(this.data);
    apiRequest.set('User-Agent', this.rest.userAgentManager.userAgent);
    return apiRequest;
  }
}

module.exports = APIRequest;
