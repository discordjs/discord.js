'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');
const Structures = require('../../util/Structures');

class StageInstanceUpdateAction extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.cache.get(data.guild_id);
    if (guild) {
      const StageInstance = Structures.get('StageInstance');

      const oldStageInstance = guild.stageInstances.cache.has(data.id)
        ? guild.stageInstances.cache.get(data.id)._clone()
        : new StageInstance(client, data);

      const newStageInstance = guild.stageInstances.add(data);

      /**
       * Emitted whenever a stage instance gets updated - e.g. change in topic or privacy level
       * @event Client#stageInstanceUpdate
       * @param {StageInstance} oldStageInstance The stage instance before the update
       * @param {StageInstance} newStageInstance The stage instance after the update
       */
      client.emit(Events.STAGE_INSTANCE_UPDATE, oldStageInstance, newStageInstance);
    }
  }
}

module.exports = StageInstanceUpdateAction;
