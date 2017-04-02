const snekfetch = require('snekfetch');
const Constants = require('../../util/Constants');

class APIRequest {
  constructor(rest, method, path, auth, data, files) {
    this.rest = rest;
    this.client = rest.client;
    this.method = method;
    this.path = path.toString();
    this.auth = auth;
    this.data = data;
    this.files = files;
    this.route = this.getRoute(this.path);
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
    if (this.auth) request.set('Authorization', this.getAuth());
    if (!this.rest.client.browser) request.set('User-Agent', this.rest.userAgentManager.userAgent);
    if (this.files) {
      for (const file of this.files) if (file && file.file) request.attach(file.name, file.file, file.name);
      if (typeof this.data !== 'undefined') request.attach('payload_json', JSON.stringify(this.data));
    } else if (this.data) {
      request.send(this.data);
    }
    return request;
  }
}

module.exports = APIRequest;
