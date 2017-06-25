class Base {
  constructor(client) {
    /**
     * The client that instantiated this
     * @name Base#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', {
      value: client,
      enumerable: false,
      writable: false,
    });
  }

  _clone() {
    return Object.assign(Object.create(this), this);
  }
}

module.exports = Base;
