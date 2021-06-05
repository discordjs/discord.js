'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class StageInstanceCreateAction extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.cache.get(data.guild_id);

    if (guild) {
      const stageInstance = guild.stageInstances.add(data);

      /**
       * Emitted whenever a stage instance is created.
       * @event Client#stageInstanceCreate
       * @param {StageInstance} stageInstance The created stage instance
       */
      client.emit(Events.STAGE_INSTANCE_CREATE, stageInstance);

      return { stageInstance };
    }

    return {};
  }
}

module.exports = StageInstanceCreateAction;
