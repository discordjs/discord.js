'use strict';

const { Modal: BuildersModal } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');

class Modal extends BuildersModal {
  constructor(data) {
    super(Transformers.toSnakeCase(data));
  }
}

module.exports = Modal;
