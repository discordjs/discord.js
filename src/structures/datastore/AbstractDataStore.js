class AbstractDataStore {
  constructor() {
    this.data = {};
  }

  register(name) {
    this.data[name] = {};
  }

  add(location, object) {
    if (this.data[location][object.id]) {
      return this.data[location][object.id];
    }
    this.data[location][object.id] = object;
    return object;
  }

  clear(location) {
    this.data[location] = {};
  }

  remove(location, object) {
    const id = (typeof object === 'string' || object instanceof String) ? object : object.id;
    if (this.data[location][id]) {
      delete this.data[location][id];
      return true;
    }
    return false;
  }

  get(location, value) {
    return this.data[location][value];
  }

  getAsArray(location) {
    return Object.values(this.data[location]);
  }
}

module.exports = AbstractDataStore;
