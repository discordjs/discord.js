const request = require('superagent');
const Constants = require('../../util/Constants');
const os = require('os');
const version = require('../../../package').version;

class APIRequest {
  constructor(rest, method, url, auth, data, files) {
    this.rest = rest;
    this.method = method;
    this.url = url;
    this.auth = auth;
    this.data = data;
    this.files = files;
    this.route = this.getRoute(this.url);
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
    if (this.rest.client.token && this.rest.client.user && this.rest.client.user.bot) {
      return `Bot ${this.rest.client.token}`;
    } else if (this.rest.client.token) {
      return this.rest.client.token;
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
    const apiRequest = request[this.method](this.url);
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
    if (!this.rest.client.browser) apiRequest.set('User-Agent', this.rest.userAgentManager.userAgent);
    return apiRequest;
  }
}

module.exports = APIRequest;
