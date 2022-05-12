var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/index.ts
var _Collection = class extends Map {
  ensure(key, defaultValueGenerator) {
    if (this.has(key))
      return this.get(key);
    const defaultValue = defaultValueGenerator(key, this);
    this.set(key, defaultValue);
    return defaultValue;
  }
  hasAll(...keys) {
    return keys.every((k) => super.has(k));
  }
  hasAny(...keys) {
    return keys.some((k) => super.has(k));
  }
  first(amount) {
    if (typeof amount === "undefined")
      return this.values().next().value;
    if (amount < 0)
      return this.last(amount * -1);
    amount = Math.min(this.size, amount);
    const iter = this.values();
    return Array.from({ length: amount }, () => iter.next().value);
  }
  firstKey(amount) {
    if (typeof amount === "undefined")
      return this.keys().next().value;
    if (amount < 0)
      return this.lastKey(amount * -1);
    amount = Math.min(this.size, amount);
    const iter = this.keys();
    return Array.from({ length: amount }, () => iter.next().value);
  }
  last(amount) {
    const arr = [...this.values()];
    if (typeof amount === "undefined")
      return arr[arr.length - 1];
    if (amount < 0)
      return this.first(amount * -1);
    if (!amount)
      return [];
    return arr.slice(-amount);
  }
  lastKey(amount) {
    const arr = [...this.keys()];
    if (typeof amount === "undefined")
      return arr[arr.length - 1];
    if (amount < 0)
      return this.firstKey(amount * -1);
    if (!amount)
      return [];
    return arr.slice(-amount);
  }
  at(index) {
    index = Math.floor(index);
    const arr = [...this.values()];
    return arr.at(index);
  }
  keyAt(index) {
    index = Math.floor(index);
    const arr = [...this.keys()];
    return arr.at(index);
  }
  random(amount) {
    const array = [...this.values()];
    if (!array.length || !amount)
      return [];
    if (amount && amount > array.length)
      amount = array.length;
    if (amount && amount < 1)
      amount = 1;
    const random = [];
    for (let i = 0; i < amount; i++) {
      const num = Math.floor(Math.random() * array.length);
      random.indexOf(num) > -1 ? i -= 1 : random.push(num);
    }
    const results = random.map((r) => array[r]);
    return results.length === 1 ? results[0] : results;
  }
  randomKey(amount) {
    const array = [...this.keys()];
    if (!array.length || !amount)
      return [];
    if (amount && amount > array.length)
      amount = array.length;
    if (amount && amount < 1)
      amount = 1;
    const random = [];
    for (let i = 0; i < amount; i++) {
      const num = Math.floor(Math.random() * array.length);
      random.indexOf(num) > -1 ? i -= 1 : random.push(num);
    }
    const results = random.map((r) => array[r]);
    return results.length === 1 ? results[0] : results;
  }
  reverse() {
    const entries = [...this.entries()].reverse();
    this.clear();
    for (const [key, value] of entries)
      this.set(key, value);
    return this;
  }
  find(fn, thisArg) {
    if (typeof thisArg !== "undefined")
      fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this))
        return val;
    }
    return void 0;
  }
  findKey(fn, thisArg) {
    if (typeof thisArg !== "undefined")
      fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this))
        return key;
    }
    return void 0;
  }
  sweep(fn, thisArg) {
    if (typeof thisArg !== "undefined")
      fn = fn.bind(thisArg);
    const previousSize = this.size;
    for (const [key, val] of this) {
      if (fn(val, key, this))
        this.delete(key);
    }
    return previousSize - this.size;
  }
  filter(fn, thisArg) {
    if (typeof thisArg !== "undefined")
      fn = fn.bind(thisArg);
    const results = new this.constructor[Symbol.species]();
    const predicate = /* @__PURE__ */ __name((v, k, c) => fn(v, k, c) && results.set(k, v), "predicate");
    for (const [key, value] of this) {
      predicate(value, key, this);
    }
    return results;
  }
  partition(fn, thisArg) {
    if (typeof thisArg !== "undefined")
      fn = fn.bind(thisArg);
    const results = [
      new this.constructor[Symbol.species](),
      new this.constructor[Symbol.species]()
    ];
    for (const [key, val] of this) {
      if (fn(val, key, this)) {
        results[0].set(key, val);
      } else {
        results[1].set(key, val);
      }
    }
    return results;
  }
  flatMap(fn, thisArg) {
    const collections = this.map(fn, thisArg);
    return new this.constructor[Symbol.species]().concat(...collections);
  }
  map(fn, thisArg) {
    if (typeof thisArg !== "undefined")
      fn = fn.bind(thisArg);
    const result = [];
    for (const [key, value] of this) {
      result.push(fn(value, key, this));
    }
    return result;
  }
  mapValues(fn, thisArg) {
    if (typeof thisArg !== "undefined")
      fn = fn.bind(thisArg);
    const coll = new this.constructor[Symbol.species]();
    for (const [key, val] of this)
      coll.set(key, fn(val, key, this));
    return coll;
  }
  some(fn, thisArg) {
    if (typeof thisArg !== "undefined")
      fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this))
        return true;
    }
    return false;
  }
  every(fn, thisArg) {
    if (typeof thisArg !== "undefined")
      fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (!fn(val, key, this))
        return false;
    }
    return true;
  }
  reduce(fn, initialValue) {
    let accumulator;
    if (typeof initialValue !== "undefined") {
      accumulator = initialValue;
      for (const [key, val] of this)
        accumulator = fn(accumulator, val, key, this);
      return accumulator;
    }
    let first = true;
    for (const [key, val] of this) {
      if (first) {
        accumulator = val;
        first = false;
        continue;
      }
      accumulator = fn(accumulator, val, key, this);
    }
    if (first) {
      throw new TypeError("Reduce of empty collection with no initial value");
    }
    return accumulator;
  }
  each(fn, thisArg) {
    this.forEach(fn, thisArg);
    return this;
  }
  tap(fn, thisArg) {
    if (typeof thisArg !== "undefined")
      fn = fn.bind(thisArg);
    fn(this);
    return this;
  }
  clone() {
    return new this.constructor[Symbol.species](this);
  }
  concat(...collections) {
    const newColl = this.clone();
    for (const coll of collections) {
      for (const [key, val] of coll)
        newColl.set(key, val);
    }
    return newColl;
  }
  equals(collection) {
    if (!collection)
      return false;
    if (this === collection)
      return true;
    if (this.size !== collection.size)
      return false;
    for (const [key, value] of this) {
      if (!collection.has(key) || value !== collection.get(key)) {
        return false;
      }
    }
    return true;
  }
  sort(compareFunction = _Collection.defaultSort) {
    const entries = [...this.entries()];
    entries.sort((a, b) => compareFunction(a[1], b[1], a[0], b[0]));
    super.clear();
    for (const [k, v] of entries) {
      super.set(k, v);
    }
    return this;
  }
  intersect(other) {
    const coll = new this.constructor[Symbol.species]();
    for (const [k, v] of other) {
      if (this.has(k) && Object.is(v, this.get(k))) {
        coll.set(k, v);
      }
    }
    return coll;
  }
  difference(other) {
    const coll = new this.constructor[Symbol.species]();
    for (const [k, v] of other) {
      if (!this.has(k))
        coll.set(k, v);
    }
    for (const [k, v] of this) {
      if (!other.has(k))
        coll.set(k, v);
    }
    return coll;
  }
  merge(other, whenInSelf, whenInOther, whenInBoth) {
    const coll = new this.constructor[Symbol.species]();
    const keys = /* @__PURE__ */ new Set([...this.keys(), ...other.keys()]);
    for (const k of keys) {
      const hasInSelf = this.has(k);
      const hasInOther = other.has(k);
      if (hasInSelf && hasInOther) {
        const r = whenInBoth(this.get(k), other.get(k), k);
        if (r.keep)
          coll.set(k, r.value);
      } else if (hasInSelf) {
        const r = whenInSelf(this.get(k), k);
        if (r.keep)
          coll.set(k, r.value);
      } else if (hasInOther) {
        const r = whenInOther(other.get(k), k);
        if (r.keep)
          coll.set(k, r.value);
      }
    }
    return coll;
  }
  sorted(compareFunction = _Collection.defaultSort) {
    return new this.constructor[Symbol.species](this).sort((av, bv, ak, bk) => compareFunction(av, bv, ak, bk));
  }
  toJSON() {
    return [...this.values()];
  }
  static defaultSort(firstValue, secondValue) {
    return Number(firstValue > secondValue) || Number(firstValue === secondValue) - 1;
  }
  static combineEntries(entries, combine) {
    const coll = new _Collection();
    for (const [k, v] of entries) {
      if (coll.has(k)) {
        coll.set(k, combine(coll.get(k), v, k));
      } else {
        coll.set(k, v);
      }
    }
    return coll;
  }
};
var Collection = _Collection;
__name(Collection, "Collection");
__publicField(Collection, "default", _Collection);
var src_default = Collection;
export {
  Collection,
  src_default as default
};
//# sourceMappingURL=index.mjs.map