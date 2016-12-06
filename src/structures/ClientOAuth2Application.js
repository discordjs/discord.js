const User = require('./User');
const OAuth2Application = require('./OAuth2Application');

/**
 * Represents the client's OAuth2 Application
 * @extends {OAuth2Application}
 */
class ClientOAuth2Application extends OAuth2Application {
  setup(data) {
    super.setup(data);

    /**
     * The app's flags
     * @type {number}
     */
    this.flags = data.flags;

    /**
     * The app's owner
     * @type {User}
     */
    this.owner = new User(this.client, data.owner);
  }
}

module.exports = ClientOAuth2Application;
