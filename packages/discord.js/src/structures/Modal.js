'use strict';

const { Modal: BuildersModal } = require('@discordjs/builders');
const Modals = require('../util/Modals');

class Modal extends BuildersModal {
  constructor(data) {
    super(Modals.transformJSON(data));
  }
}

module.exports = Modal;
