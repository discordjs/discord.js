/**
 * Represents a user connection (or "platform identity")
 */
class UserConnection {
  constructor(user, data) {
    /**
     * The user that owns the Connection
     * @type {User}
     */
    this.user = user;

    this.setup(data);
  }

  setup(data) {
    /**
     * The type of the Connection
     * @type {string}
     */
    this.type = data.type;

    /**
     * The username of the connection account
     * @type {string}
     */
    this.name = data.name;

    /**
     * The id of the connection account
     * @type {string}
     */
    this.id = data.id;

    /**
     * Whether the connection is revoked
     * @type {boolean}
     */
    this.revoked = data.revoked;

    /**
     * an array of partial server integrations (not yet implemented in this lib)
     * @type {Object[]}
     */
    this.integrations = data.integrations;
  }
}

module.exports = UserConnection;
