const querystring = require('querystring');
const phin = require('phin').promisified;
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

    let requestHeaders = {};

    if (this.options.auth !== false) requestHeaders.Authorization = this.rest.getAuth();
    if (this.options.reason) requestHeaders['X-Audit-Log-Reason'] = encodeURIComponent(this.options.reason);
    if (!browser) requestHeaders['User-Agent'] = UserAgent;
    if (this.options.headers) Object.assign(requestHeaders, this.options.headers);

    let formData = null;

    if (this.options.files) {
      for (const file of this.options.files) formData[file.name] = file.file;

      if (this.options.data !== 'undefined') formData.payload_json = JSON.stringify(this.options.data);
    }

    const request = phin(Object.assign({
      url: `${API}${this.path}`,
      method: this.method,
      agent,
      headers: requestHeaders,
    }, this.options.files ? { form: formData } : this.options.data !== 'undefined' ? { data: this.options.data } : {}));
    return request;
  }
}

module.exports = APIRequest;
