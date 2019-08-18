'use strict';

const Collection = require('../../util/Collection');
const VoiceConnection = require('./VoiceConnection');
const VoiceBroadcast = require('./VoiceBroadcast');
const { Error } = require('../../errors');

/**
 * Manages voice connections for the client
 */
class ClientVoiceManager {
  constructor(client) {
    /**
     * The client that instantiated this voice manager
     * @type {Client}
     * @readonly
     * @name ClientVoiceManager#client
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * A collection mapping connection IDs to the Connection objects
     * @type {Collection<Snowflake, VoiceConnection>}
     */
    this.connections = new Collection();

    /**
     * Active voice broadcasts that have been created
     * @type {VoiceBroadcast[]}
     */
    this.broadcasts = [];
  }

  /**
   * Creates a voice broadcast.
   * @returns {VoiceBroadcast}
   */
  createBroadcast() {
    const broadcast = new VoiceBroadcast(this.client);
    this.broadcasts.push(broadcast);
    return broadcast;
  }

  onVoiceServer({ guild_id, token, endpoint }) {
    this.client.emit('debug', `[VOICE] voiceServer guild: ${guild_id} token: ${token} endpoint: ${endpoint}`);
    const connection = this.connections.get(guild_id);
    if (connection) connection.setTokenAndEndpoint(token, endpoint);
  }

  onVoiceStateUpdate({ guild_id, session_id, channel_id }) {
    const connection = this.connections.get(guild_id);
    this.client.emit('debug', `[VOICE] connection? ${!!connection}, ${guild_id} ${session_id} ${channel_id}`);
    if (!connection) return;
    if (!channel_id) {
      connection._disconnect();
      this.connections.delete(guild_id);
      return;
    }
    connection.channel = this.client.channels.get(channel_id);
    connection.setSessionID(session_id);
  }

  /**
   * Sets up a request to join a voice channel.
   * @param {VoiceChannel} channel The voice channel to join
   * @returns {Promise<VoiceConnection>}
   * @private
   */
  joinChannel(channel) {
    return new Promise((resolve, reject) => {
      if (!channel.joinable) {
        throw new Error('VOICE_JOIN_CHANNEL', channel.full);
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
        connection.on('debug', msg =>
          this.client.emit('debug', `[VOICE (${channel.guild.id}:${connection.status})]: ${msg}`));
        connection.authenticate();
        this.connections.set(channel.guild.id, connection);
      }

      connection.once('failed', reason => {
        this.connections.delete(channel.guild.id);
        reject(reason);
      });

      connection.once('authenticated', () => {
        connection.once('ready', () => {
          resolve(connection);
          connection.removeListener('error', reject);
        });
        connection.on('error', reject);
        connection.once('disconnect', () => this.connections.delete(channel.guild.id));
      });
    });
  }
}

module.exports = ClientVoiceManager;
