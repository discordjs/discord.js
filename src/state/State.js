const Store = require('./Store');
const { StateActions, InitialState } = require('../util/Constants');

function reducer(state = InitialState, action) {
  switch (action.type) {
    case StateActions.GUILD_CREATE:
      state.guilds.set(action.data.id, action.data);
      break;
    default:
      return state;
  }

  return state;
}

module.exports = new Store(reducer, InitialState);
