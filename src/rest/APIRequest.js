const querystring = require('querystring');
const snekfetch = require('snekfetch');
const https = require('https');
const { browser, UserAgent } = require('../util/Constants');

if (https.Agent) var agent = new https.Agent({ keepAlive: true });

class APIRequest {
  constructor(rest, method, path, options) {
    this.rest = rest;
    this.client = rest.client;
    this.method = method;
    this.path = path.toString();
    this.route = options.route;
    this.options = options;
  }

  gen() {
    const API = this.options.versioned === false ? this.client.options.http.api :
      `${this.client.options.http.api}/v${this.client.options.http.version}`;

    if (this.options.query) {
      const queryString = (querystring.stringify(this.options.query).match(/[^=&?]+=[^=&?]+/g) || []).join('&');
      this.path += `?${queryString}`;
    }

    const request = snekfetch[this.method](`${API}${this.path}`, { agent });

    if (this.options.auth !== false) request.set('Authorization', this.rest.getAuth());
    if (this.options.reason) request.set('X-Audit-Log-Reason', encodeURIComponent(this.options.reason));
    if (!browser) request.set('User-Agent', UserAgent);
    if (this.options.headers) request.set(this.options.headers);

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
