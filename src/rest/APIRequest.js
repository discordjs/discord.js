const querystring = require('querystring');
const superagent = require('superagent');
const { browser, UserAgent } = require('../util/Constants');

class APIRequest {
  constructor(rest, method, path, options) {
    this.rest = rest;
    this.client = rest.client;
    this.method = method;
    this.route = options.route;
    this.options = options;

    const queryString = (querystring.stringify(options.query).match(/[^=&?]+=[^=&?]+/g) || []).join('&');
    this.path = `${path}${queryString ? `?${queryString}` : ''}`;
  }

  gen() {
    const API = this.options.versioned === false ? this.client.options.http.api :
      `${this.client.options.http.api}/v${this.client.options.http.version}`;

    const request = superagent[this.method](`${API}${this.path}`);

    if (this.options.auth !== false) request.set('Authorization', this.rest.getAuth());
    if (this.options.reason) request.set('X-Audit-Log-Reason', encodeURIComponent(this.options.reason));
    if (!browser) request.set('User-Agent', UserAgent);
    if (this.options.headers) request.set(this.options.headers);

    if (this.options.files) {
      for (const file of this.options.files) if (file && file.file) request.attach(file.name, file.file, file.name);
      if (typeof this.options.data !== 'undefined') request.field('payload_json', JSON.stringify(this.options.data));
    } else if (typeof this.options.data !== 'undefined') {
      request.send(this.options.data);
    }
    return request;
  }
}

module.exports = APIRequest;
