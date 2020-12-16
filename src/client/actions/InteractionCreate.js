'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class InteractionCreateAction extends Action {
  handle(data) {
    console.log("sata")

    return {};
  }
}

module.exports = InteractionCreateAction;
