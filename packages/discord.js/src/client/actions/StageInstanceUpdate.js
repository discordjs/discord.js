'use strict';

const { Events } = require('../../util/Events.js');
const { Action } = require('./Action.js');

class StageInstanceUpdateAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = this.getChannel({ id: data.channel_id, guild_id: data.guild_id });

    if (channel) {
      const oldStageInstance = channel.guild.stageInstances.cache.get(data.id)?._clone() ?? null;
      const newStageInstance = channel.guild.stageInstances._add(data);

      /**
       * Emitted whenever a stage instance gets updated - e.g. change in topic or privacy level
       *
       * @event Client#stageInstanceUpdate
       * @param {?StageInstance} oldStageInstance The stage instance before the update
       * @param {StageInstance} newStageInstance The stage instance after the update
       */
      client.emit(Events.StageInstanceUpdate, oldStageInstance, newStageInstance);

      return { oldStageInstance, newStageInstance };
    }

    return {};
  }
}

exports.StageInstanceUpdateAction = StageInstanceUpdateAction;
