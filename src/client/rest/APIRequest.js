const request = require('superagent');
const Constants = require('../../util/Constants');
const os = require('os');
const version = require('../../../package').version;

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

  getCtx(ctx) {
    return new Buffer(JSON.stringify({
      location: ctx,
    })).toString('base64'));
  }

  getSuper() {
    const super = {
      os: os.type(),
      browser: 'DiscordJS',
      client_version: version,
      os_version: os.release(),
    };
    if (super.os === 'Windows_NT') super.os = 'Windows';
    return new Buffer(JSON.stringify(super)).toString('base64'));
  }

  gen() {
    const API = `${this.client.options.http.host}/api/v${this.client.options.http.version}`;
    const apiRequest = request[this.method](`${API}${this.path}`);
    if (this.auth) apiRequest.set('authorization', this.getAuth());
    if (!this.getAuth().startsWith('Bot')) {
      apiRequest.set('x-super-properties', this.getSuper());
      if (this.ctx) apiRequest.set('x-context-properties', this.getCtx(this.ctx));
    }
    if (this.files) {
      for (const file of this.files) if (file && file.file) apiRequest.attach(file.name, file.file, file.name);
      this.data = this.data || {};
      apiRequest.field('payload_json', JSON.stringify(this.data));
    } else if (this.data) {
      apiRequest.send(this.data);
    }
    if (!this.client.browser) apiRequest.set('User-Agent', this.rest.userAgentManager.userAgent);
    return apiRequest;
  }
}

module.exports = APIRequest;
