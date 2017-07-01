// Simplified state store inspired by redux

/**
 * Redux-style state store
 */
class Store {
  /**
   * @param {Function} reducer Reducer function
   * @param {Object} initial Initial state
   */
  constructor(reducer, initial) {
    this._reducer = reducer;
    this._state = initial;
    this._subscribers = new Set();
    this.dispatch({ type: '@@INIT' });
  }

  /**
   * Current state
   * @type {Object}
   * @readonly
   */
  get state() {
    return this._state;
  }

  /**
   * Add a listener that is called when the state updates
   * @param {Function} listener Function to call when state updates
   * @returns {Function} When called, it unsubscribes
   */
  subscribe(listener) {
    this._subscribers.add(listener);
    return () => {
      this._subscribers.delete(listener);
    };
  }

  /**
   * Action to pass to the store dispatcher
   * @typedef {object} StateReducerAction
   * @prop {*} type Action type
   * @prop {*} [data] Action data to pass to the reducer
   */

  /**
   * Dispatch an action
   * @param {StateReducerAction} action Action to dispatch
   * @returns {StateReducerAction} The action that was passed
   */
  dispatch(action) {
    if (typeof action.type === 'undefined') throw new Error('Actions must have a "type"');
    this._state = this._reducer(this._state, action);
    for (const subscriber of this._subscribers) subscriber();
    return action;
  }
}

module.exports = Store;
