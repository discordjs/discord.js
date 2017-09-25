const { Package } = require('../util/Constants');

class UserAgentManager {
  constructor() {
    this.build(this.constructor.DEFAULT);
  }

  set({ url, version } = {}) {
    this.build({
      url: url || this.constructor.DFEAULT.url,
      version: version || this.constructor.DEFAULT.version,
    });
  }

  build(ua) {
    const platform = typeof process !== 'undefined' ? `Node.js/${process.platform}` : 'browser';
    this.userAgent = `DiscordBot (${ua.url}, ${ua.version}) ${platform}`;
  }
}

UserAgentManager.DEFAULT = {
  url: Package.homepage.split('#')[0],
  version: Package.version,
};

module.exports = UserAgentManager;
