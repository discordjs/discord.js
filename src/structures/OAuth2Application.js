/**
 * Represents an OAuth2 Application
 */
class OAuth2Application {
  constructor(client, data) {
    /**
     * The client that instantiated the application
     * @name OAuth2Application#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    this.setup(data);
  }

  setup(data) {
    /**
     * The ID of the app
     * @type {string}
     */
    this.id = data.id;

    /**
     * The name of the app
     * @type {string}
     */
    this.name = data.name;

    /**
     * The app's description
     * @type {string}
     */
    this.description = data.description;

    /**
     * The app's icon hash
     * @type {string}
     */
    this.icon = data.icon;

    /**
     * The app's icon URL
     * @type {string}
     */
    this.iconURL = `https://cdn.discordapp.com/app-icons/${this.id}/${this.icon}.jpg`;

    /**
     * The app's RPC origins
     * @type {Array<string>}
     */
    this.rpcOrigins = data.rpc_origins;
  }

  /**
   * The timestamp the app was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return (this.id / 4194304) + 1420070400000;
  }

  /**
   * The time the app was created
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * When concatenated with a string, this automatically concatenates the app name rather than the app object.
   * @returns {string}
   */
  toString() {
    return this.name;
  }
}

module.exports = OAuth2Application;
