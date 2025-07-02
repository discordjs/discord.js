'use strict';

const { Events } = require('../../util/Events.js');
const { Action } = require('./Action.js');

class StageInstanceDeleteAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = this.getChannel({ id: data.channel_id, guild_id: data.guild_id });

    if (channel) {
      const stageInstance = channel.guild.stageInstances._add(data);
      if (stageInstance) {
        channel.guild.stageInstances.cache.delete(stageInstance.id);

        /**
         * Emitted whenever a stage instance is deleted.
         *
         * @event Client#stageInstanceDelete
         * @param {StageInstance} stageInstance The deleted stage instance
         */
        client.emit(Events.StageInstanceDelete, stageInstance);

        return { stageInstance };
      }
    }

    return {};
  }
}

exports.StageInstanceDeleteAction = StageInstanceDeleteAction;
