'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class InteractionCreateAction extends Action {
  handle(data) {
    console.log(data)

    return {};
  }
}

module.exports = InteractionCreateAction;
