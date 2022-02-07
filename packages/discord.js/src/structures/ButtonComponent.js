'use strict';

const { ButtonComponent: BuildersButtonComponent } = require('@discordjs/builders');
const Components = require('../util/Components');

class ButtonComponent extends BuildersButtonComponent {
  constructor(data) {
    super(Components.transformJSON(data));
  }
}

module.exports = ButtonComponent;
