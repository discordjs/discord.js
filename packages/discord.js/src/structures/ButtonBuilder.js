'use strict';

const { ButtonBuilder: BuildersButtonComponent } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');

class ButtonBuilder extends BuildersButtonComponent {
  constructor(data) {
    super(Transformers.toSnakeCase(data));
  }
}

module.exports = ButtonBuilder;
