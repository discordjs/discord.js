'use strict';

class ActionsManager {
  constructor(client) {
    this.client = client;

    const fs = require("fs")
    let allFiles = fs.readdirSync("./").filter(file => !["Action.js","ActionsManager.js"].some(a => a == file))

    for (let file of allFiles) {
        this.register(require(`./${file}`));
    }
  }

  register(Action) {
    this[Action.name.replace(/Action$/, '')] = new Action(this.client);
  }
}

module.exports = ActionsManager;
