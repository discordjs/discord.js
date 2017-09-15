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
    this.userAgent = `DiscordBot (${ua.url}, ${ua.version}) Node.js/${process.version}`;
  }
}

UserAgentManager.DEFAULT = {
  url: Package.homepage.split('#')[0],
  version: Package.version,
};

module.exports = UserAgentManager;
