'use strict';

const { ButtonComponent: BuildersButtonComponent } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');

class ButtonComponent extends BuildersButtonComponent {
  constructor(data) {
    super(Transformers.toSnakeCase(data));
  }
}

module.exports = ButtonComponent;
