const User = require('./User');
const OAuth2App = require('./OAuth2App');

/**
 * Represents the client's OAuth2 Application
 */
class ClientOAuth2App extends OAuth2App {
  setup(data) {
    super.setup(data);

    /**
     * The app's flags
     * @type {int}
     */
    this.flags = data.flags;

    /**
     * The app's owner
     * @type {User}
     */
    this.owner = new User(this.client, data.owner);
  }
}

module.exports = ClientOAuth2App;
