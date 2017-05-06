const snekfetch = require('snekfetch');
const Constants = require('../../util/Constants');
const browser = require('os').platform() === 'browser';

class APIRequest {
  constructor(client, method, path, options = {}) {
    this.client = client;
    this.method = method;
    this.path = path.toString();
    this.route = this.getRoute(this.path);
    this.options = options;
  }

  getRoute(url) {
    let route = url.split('?')[0];
    if (route.includes('/channels/') || route.includes('/guilds/')) {
      const startInd = route.includes('/channels/') ? route.indexOf('/channels/') : route.indexOf('/guilds/');
      const majorID = route.substring(startInd).split('/')[2];
      route = route.replace(/(\d{8,})/g, ':id').replace(':id', majorID);
    }
    return route;
  }

  getAuth() {
    if (this.client.token && this.client.user && this.client.user.bot) {
      return `Bot ${this.client.token}`;
    } else if (this.client.token) {
      return this.client.token;
    }
    throw new Error(Constants.Errors.NO_TOKEN);
  }

  gen() {
    const API = `${this.client.options.http.host}/api/v${this.client.options.http.version}`;
    const request = snekfetch[this.method](`${API}${this.path}`);

    if (this.options.auth !== false) request.set('Authorization', this.getAuth());
    if (!browser) request.set('User-Agent', this.client.rest.userAgent);
    if (this.options.reason) request.set('X-Audit-Log-Reason', this.options.reason);

    if (this.options.files) {
      for (const file of this.options.files) if (file && file.file) request.attach(file.name, file.file, file.name);
      if (typeof this.options.data !== 'undefined') {
        request.attach('payload_json', JSON.stringify(this.options.data));
      }
    } else if (this.options.data) {
      request.send(this.options.data);
    }
    return request;
  }
}

module.exports = APIRequest;
