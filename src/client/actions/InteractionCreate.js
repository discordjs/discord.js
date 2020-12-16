'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class InteractionCreateAction extends Action {
  handle(data) {
    this.client.emit(Events.INTERACTION_CREATE, data);
    return {};
  }
}

module.exports = InteractionCreateAction;
