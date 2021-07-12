'use strict';

const fs = require('fs');

class ActionsManager {
  constructor(client) {
    this.client = client;

    const allFiles = fs.readdirSync(__dirname).filter(
        file => !["Action.js","ActionsManager.js"].includes(file)
    );

    for (const file of allFiles) {
        this.register(require(`./${file}`));
    }
  }

  register(Action) {
    this[Action.name.replace(/Action$/, '')] = new Action(this.client);
  }
}

module.exports = ActionsManager;
