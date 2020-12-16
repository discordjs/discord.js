'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class MessageCreateAction extends Action {
  handle(data) {
    console.log(data)

    return {};
  }
}

module.exports = MessageCreateAction;
