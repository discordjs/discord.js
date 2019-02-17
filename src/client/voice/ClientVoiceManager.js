'use strict';

const Collection = require('../../util/Collection');
const { VoiceStatus } = require('../../util/Constants');
const VoiceConnection = require('./VoiceConnection');
const { Error } = require('../../errors');

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
    if (!channel_id && connection.status !== VoiceStatus.DISCONNECTED) {
      connection._disconnect();
      return;
    }
    connection.channel = this.client.channels.get(channel_id);
    connection.setSessionID(session_id);
  }

  /**
   * Sets up a request to join a voice channel.
   * @param {VoiceChannel} channel The voice channel to join
   * @returns {Promise<VoiceConnection>}
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
