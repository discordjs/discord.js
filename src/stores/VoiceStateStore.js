'use strict';

const DataStore = require('./DataStore');
const VoiceState = require('../structures/VoiceState');

/**
 * Stores voice states.
 * @extends {DataStore}
 */
class VoiceStateStore extends DataStore {
  constructor(guild, iterable) {
    super(guild.client, iterable, VoiceState);
    this.guild = guild;
  }

  add(data, cache = true) {
    const existing = this.get(data.user_id);
    if (existing) return existing._patch(data);

    const entry = new VoiceState(this.guild, data);
    if (cache) this.set(data.user_id, entry);
    return entry;
  }
}

module.exports = VoiceStateStore;
