'use strict';

const { Modal: BuildersModal } = require('@discordjs/builders');
const snakecase = require('snakecase-keys');

class Modal extends BuildersModal {
  constructor(data = {}) {
    super(snakecase(data));
  }
}

module.exports = Modal;
