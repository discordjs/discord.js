const Collection = require('../../util/Collection');
const VoiceConnection = require('./VoiceConnection');

/**
 * Manages all the voice stuff for the client.
 * @private
 */
class ClientVoiceManager {
  constructor(client) {
    /**
     * The client that instantiated this voice manager
     * @type {Client}
     */
    this.client = client;

    /**
     * A collection mapping connection IDs to the Connection objects
     * @type {Collection<Snowflake, VoiceConnection>}
     */
    this.connections = new Collection();

    this.client.on('self.voiceServer', this.onVoiceServer.bind(this));
    this.client.on('self.voiceStateUpdate', this.onVoiceStateUpdate.bind(this));
  }

  onVoiceServer({ guild_id, token, endpoint }) {
    const connection = this.connections.get(guild_id);
    if (connection) connection.setTokenAndEndpoint(token, endpoint);
  }

  onVoiceStateUpdate({ guild_id, session_id, channel_id }) {
    const connection = this.connections.get(guild_id);
    if (connection) {
      connection.channel = this.client.channels.get(channel_id);
      connection.setSessionID(session_id);
    }
  }

  /**
   * Sets up a request to join a voice channel.
   * @param {VoiceChannel} channel The voice channel to join
   * @returns {Promise<VoiceConnection>}
   */
  joinChannel(channel) {
    return new Promise((resolve, reject) => {
      if (!channel.joinable) {
        if (channel.full) {
          throw new Error('You do not have permission to join this voice channel; it is full.');
        } else {
          throw new Error('You do not have permission to join this voice channel.');
        }
      }

      let connection = this.connections.get(channel.guild.id);

      if (connection) {
        if (connection.channel.id !== channel.id) {
          this.connections.get(channel.guild.id).updateChannel(channel);
        }
        resolve(connection);
        return;
      } else {
        connection = new VoiceConnection(this, channel);
        this.connections.set(channel.guild.id, connection);
      }

      connection.once('failed', reason => {
        this.connections.delete(channel.guild.id);
        reject(reason);
      });

      connection.once('authenticated', () => {
        connection.once('ready', () => resolve(connection));
        connection.once('error', reject);
        connection.once('disconnect', () => this.connections.delete(channel.guild.id));
      });
    });
  }
}

module.exports = ClientVoiceManager;
