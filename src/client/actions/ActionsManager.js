'use strict';

const fs = require("fs");

class ActionsManager {
  constructor(client) {
    this.client = client;

    let allFiles = fs.readdirSync("./").filter(
        file => !["Action.js","ActionsManager.js"].some(
            blacklist => blacklist === file
        )
    );

    for (let file of allFiles) {
        this.register(require(`./${file}`));
    }
  }

  register(Action) {
    this[Action.name.replace(/Action$/, '')] = new Action(this.client);
  }
}

module.exports = ActionsManager;
