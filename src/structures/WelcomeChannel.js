'use strict';

const Base = require('./Base');
const Emoji = require('./Emoji');

class WelcomeChannel extends Base {
  constructor(guild, data) {
    super(guild.client);
    this.guild = guild;

    this._patch(data);
  }

  _patch(data) {
    if (!data) return;
    this.description = data.description;
    this._emoji = {
      name: data.emoji_name,
      id: data.emoji_id,
    };

    this.channelID = data.channel_id;
  }

  get channel() {
    return this.client.channels.resolve(this.channelID);
  }

  get emoji() {
    return this.client.emojis.resolve(this._emoji.id) ?? new Emoji(this.client, this._emoji);
  }
}

module.exports = WelcomeChannel;
