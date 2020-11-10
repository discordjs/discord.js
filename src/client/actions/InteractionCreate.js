'use strict';

const Action = require('./Action');

class InteractionCreateAction extends Action {
  handle(data) {
    this.client.interactionClient.handleFromGateway(data).catch(e => {
      this.client.emit('error', e);
    });

    return {};
  }
}

module.exports = InteractionCreateAction;
