'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');
const SnowflakeUtil = require('../../util/Snowflake');

const parseContent = options => {
  let content = '';
  options.forEach(element => (content += element.value));
  return content;
};

class InteractionCreateAction extends Action {
  async handle(data) {
    const client = this.client;
    const guild = client.guilds.cache.get(data.guild_id);
    const interaction = {
      channel: client.channels.cache.get(data.channel_id),
      guild: guild,
      member: guild.members.cache.get(data.member.user.id) || (await guild.members.fetch(data.member.user.id)) || null,
      author: client.users.cache.get(data.member.user.id) || (await client.users.fetch(data.member.user.id)) || null,
      name: data.data.name,
      content: parseContent(data.data.options),
      createdTimestamp: SnowflakeUtil.deconstruct(data.id).timestamp,
      options: data.data.options ? data.data.options : null,
    };
    client.emit(Events.INTERACTION_CREATE, interaction);
    return { interaction };
  }
}

module.exports = InteractionCreateAction;
