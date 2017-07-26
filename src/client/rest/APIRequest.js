const querystring = require('querystring');
const snekfetch = require('snekfetch');
const { Error } = require('../../errors');

class APIRequest {
  constructor(rest, method, path, options) {
    this.rest = rest;
    this.client = rest.client;
    this.method = method;
    this.path = path.toString();
    this.route = options.route;
    this.options = options;
  }

  getAuth() {
    if (this.client.token && this.client.user && this.client.user.bot) {
      return `Bot ${this.client.token}`;
    } else if (this.client.token) {
      return this.client.token;
    }
    throw new Error('TOKEN_MISSING');
  }

  gen() {
    const API = `${this.client.options.http.api}/v${this.client.options.http.version}`;

    if (this.options.query) {
      const queryString = (querystring.stringify(this.options.query).match(/[^=&?]+=[^=&?]+/g) || []).join('&');
      this.path += `?${queryString}`;
    }

    const request = snekfetch[this.method](`${API}${this.path}`);

    if (this.options.auth !== false) request.set('Authorization', this.getAuth());
    if (this.options.reason) request.set('X-Audit-Log-Reason', encodeURIComponent(this.options.reason));
    if (!this.rest.client.browser) request.set('User-Agent', this.rest.userAgentManager.userAgent);

    if (this.options.files) {
      for (const file of this.options.files) if (file && file.file) request.attach(file.name, file.file, file.name);
      if (typeof this.options.data !== 'undefined') request.attach('payload_json', JSON.stringify(this.options.data));
    } else if (typeof this.options.data !== 'undefined') {
      request.send(this.options.data);
    }
    return request;
  }
}

module.exports = APIRequest;
