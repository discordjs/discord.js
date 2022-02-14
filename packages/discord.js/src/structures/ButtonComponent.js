'use strict';

const { ButtonComponent: BuildersButtonComponent } = require('@discordjs/builders');
const snakecase = require('snakecase-keys');

class ButtonComponent extends BuildersButtonComponent {
  constructor(data) {
    super(snakecase(data));
  }
}

module.exports = ButtonComponent;
