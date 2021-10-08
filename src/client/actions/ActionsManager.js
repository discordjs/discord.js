'use strict';

const ModuleImporter = require('../../util/ModuleImporter');

class ActionsManager {
  constructor(client) {
    this.client = client;

    const modules = ModuleImporter.import('./client/actions', ['Action.js', 'ActionsManager.js']);

    for (const module of modules) {
      this.register(module);
    }
  }

  register(Action) {
    this[Action.name.replace(/Action$/, '')] = new Action(this.client);
  }
}

module.exports = ActionsManager;
