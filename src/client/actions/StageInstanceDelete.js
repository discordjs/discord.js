'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class StageInstanceDeleteAction extends Action {
  handle(data) {
    let stageInstance;

    const client = this.client;
    const channel = this.getChannel(data);

    if (channel) {
      stageInstance = channel.guild.stageInstances.add(data);
      if (stageInstance) {
        channel.guild.stageInstances.cache.delete(stageInstance.id);
        stageInstance.deleted = true;

        /**
         * Emitted whenever a stage instance is deleted.
         * @event Client#stageInstanceDelete
         * @param {StageInstance} stageInstance The deleted stage instance
         */
        client.emit(Events.STAGE_INSTANCE_DELETE, stageInstance);
      }
    }

    return { stageInstance };
  }
}

module.exports = StageInstanceDeleteAction;
