'use strict';

const Action = require('./Action');
const { deletedStageInstances } = require('../../structures/StageInstance');
const { Events } = require('../../util/Constants');

class StageInstanceDeleteAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = this.getChannel(data);

    if (channel) {
      const stageInstance = channel.guild.stageInstances._add(data);
      if (stageInstance) {
        channel.guild.stageInstances.cache.delete(stageInstance.id);
        deletedStageInstances.add(stageInstance);

        /**
         * Emitted whenever a stage instance is deleted.
         * @event Client#stageInstanceDelete
         * @param {StageInstance} stageInstance The deleted stage instance
         */
        client.emit(Events.STAGE_INSTANCE_DELETE, stageInstance);

        return { stageInstance };
      }
    }

    return {};
  }
}

module.exports = StageInstanceDeleteAction;
