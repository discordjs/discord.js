'use strict';

const Base = require('./Base');
const { Events } = require('../util/Constants');
const DataResolver = require('../util/DataResolver');

/**
 * Represents the template for a server.
 * @extends {Base}
 */
class ServerTemplate extends Base {
  /**
   * @param {Client} client The instantiating client
   * @param {Object} data The raw data for the template
   */
  constructor(client, data) {
    super(client);
    this._patch(data);
  }

  /**
   * Builds or updates the template with the provided data.
   * @param {Object} data The raw data for the template
   * @returns {ServerTemplate}
   * @private
   */
  _patch(data) {
    /**
     * The unique code of this template
     * @type {string}
     */
    this.code = data.code;

    /**
     * The name of this template
     * @type {string}
     */
    this.name = data.name;

    /**
     * The description of this template
     * @type {?string}
     */
    this.description = data.description;

    /**
     * The amount of times this template has been used
     * @type {number}
     */
    this.usageCount = data.usage_count;

    /**
     * The ID of the user that created this template
     * @type {Snowflake}
     */
    this.creatorID = data.creator_id;

    /**
     * The user that created this template
     * @type {User}
     */
    this.creator = this.client.users.add(data.creator);

    /**
     * The time of when this template was created at
     * @type {Date}
     */
    this.createdAt = new Date(data.created_at);

    /**
     * The time of when this template was last synced to the server
     * @type {Date}
     */
    this.updatedAt = new Date(data.updated_at);

    /**
     * The ID of the server that this template belongs to
     * @type {Snowflake}
     */
    this.serverID = data.source_server_id;

    /**
     * The data of the server that this template would create
     * @type {Object}
     * @see {@link https://discord.com/developers/docs/resources/server#server-resource}
     */
    this.serializedServer = data.serialized_source_server;

    /**
     * Whether this template has unsynced changes
     * @type {?boolean}
     */
    this.unSynced = 'is_dirty' in data ? Boolean(data.is_dirty) : null;

    return this;
  }

  /**
   * Creates a server based from this template.
   * <warn>This is only available to bots in fewer than 10 servers.</warn>
   * @param {string} name The name of the server
   * @param {BufferResolvable|Base64Resolvable} [icon] The icon for the server
   * @returns {Promise<Server>}
   */
  async createServer(name, icon) {
    const { client } = this;
    const data = await client.api.servers.templates(this.code).post({
      data: {
        name,
        icon: await DataResolver.resolveImage(icon),
      },
    });
    // eslint-disable-next-line consistent-return
    return new Promise(resolve => {
      const createdServer = client.servers.cache.get(data.id);
      if (createdServer) return resolve(createdServer);

      const resolveServer = server => {
        client.off(Events.GUILD_CREATE, handleServer);
        client.decrementMaxListeners();
        resolve(server);
      };

      const handleServer = server => {
        if (server.id === data.id) {
          client.clearTimeout(timeout);
          resolveServer(server);
        }
      };

      client.incrementMaxListeners();
      client.on(Events.GUILD_CREATE, handleServer);

      const timeout = client.setTimeout(() => resolveServer(client.servers.add(data)), 10000);
    });
  }

  /**
   * Updates the metadata on this template.
   * @param {Object} options Options for the template
   * @param {string} [options.name] The name of this template
   * @param {string} [options.description] The description of this template
   * @returns {Promise<ServerTemplate>}
   */
  edit({ name, description } = {}) {
    return this.client.api
      .servers(this.serverID)
      .templates(this.code)
      .patch({ data: { name, description } })
      .then(data => this._patch(data));
  }

  /**
   * Deletes this template.
   * @returns {Promise<ServerTemplate>}
   */
  delete() {
    return this.client.api
      .servers(this.serverID)
      .templates(this.code)
      .delete()
      .then(() => this);
  }

  /**
   * Syncs this template to the current state of the server.
   * @returns {Promise<ServerTemplate>}
   */
  sync() {
    return this.client.api
      .servers(this.serverID)
      .templates(this.code)
      .put()
      .then(data => this._patch(data));
  }

  /**
   * The timestamp of when this template was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return this.createdAt.getTime();
  }

  /**
   * The timestamp of when this template was last synced to the server
   * @type {number}
   * @readonly
   */
  get updatedTimestamp() {
    return this.updatedAt.getTime();
  }

  /**
   * The server that this template belongs to
   * @type {?Server}
   * @readonly
   */
  get server() {
    return this.client.servers.cache.get(this.serverID) || null;
  }

  /**
   * The URL of this template
   * @type {string}
   * @readonly
   */
  get url() {
    return `${this.client.options.http.template}/${this.code}`;
  }

  /**
   * When concatenated with a string, this automatically returns the templates's code instead of the template object.
   * @returns {string}
   * @example
   * // Logs: Template: FKvmczH2HyUf
   * console.log(`Template: ${serverTemplate}!`);
   */
  toString() {
    return this.code;
  }
}

module.exports = ServerTemplate;
