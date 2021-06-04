'use strict';

const { Events } = require('../../../util/Constants');
let Structures;

module.exports = (client, { d: data }) => {
  if (!Structures) Structures = require('../../../util/Structures');
  const StageInstance = Structures.get('StageInstance');

  const stageInstance = new StageInstance(client, data);

  client.emit(Events.STAGE_INSTANCE_CREATE, stageInstance);
};
