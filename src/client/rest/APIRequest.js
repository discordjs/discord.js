const request = require('superagent');
const Constants = require('../../util/Constants');

class APIRequest {
  constructor(rest, method, url, auth, data, files, forceBot = false) {
    this.client = rest.client;
    this.rest = rest;
    this.method = method;
    this.url = url;
    this.auth = auth;
    this.data = data;
    this.files = files;
    this.route = this.getRoute(this.url);
    this.forceBot = forceBot;
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
    if (this.client.token) {
      if ((this.client.user && this.client.user.bot) || this.forceBot) {
        return `Bot ${this.client.token}`;
      } else {
        return this.client.token;
      }
    } else {
      throw new Error(Constants.Errors.NO_TOKEN);
    }
  }

  gen() {
    const apiRequest = request[this.method](this.url);
    if (this.auth) apiRequest.set('authorization', this.getAuth());
    if (this.files) {
      for (const file of this.files) if (file && file.file) apiRequest.attach(file.name, file.file, file.name);
      this.data = this.data || {};
      apiRequest.field('payload_json', JSON.stringify(this.data));
    } else if (this.data) {
      apiRequest.send(this.data);
    }
    if (!this.rest.client.browser) apiRequest.set('User-Agent', this.rest.userAgentManager.userAgent);
    return apiRequest;
  }
}

module.exports = APIRequest;
