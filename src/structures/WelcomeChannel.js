'use strict';

const Base = require('./Base');
const Emoji = require('./Emoji');

class WelcomeChannel extends Base {
  constructor(client, guild, data) {
    super(client);
    this.guild = guild;

    this._patch(data);
  }

  _patch(data) {
    if (!data) return;
    this.description = data.description;
    this._data = data;

    this.channelID = data.channel_id;
  }

  get channel() {
    return this.client.guilds.add({ id: this.channelID }, null, false);
  }

  get emoji() {
    const { emoji_id, emoji_name } = this._data;
    return (
      this.client.emojis.resolve(emoji_id) ??
      new Emoji(this.client, {
        name: emoji_name,
        id: emoji_id,
      })
    );
  }
}

module.exports = WelcomeChannel;
