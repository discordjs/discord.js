"use strict";

/**
* Hold a bunch of something
* @extends Map
* @prop {Class} baseObject The base class for all items
* @prop {Number?} limit Max number of items to hold
*/
class Collection extends Map {
    /**
    * Construct a Collection
    * @arg {Class} baseObject The base class for all items
    * @arg {Number} [limit] Max number of items to hold
    */
    constructor(baseObject, limit) {
        super();
        this.baseObject = baseObject;
        this.limit = limit;
    }

    /**
    * Add an object
    * @arg {Object} obj The object data
    * @arg {String} obj.id The ID of the object
    * @arg {Class?} extra An extra parameter the constructor may need
    * @arg {Boolean} replace Whether to replace an existing object with the same ID
    * @returns {Class} The existing or newly created object
    */
    add(obj, extra, replace) {
        if(this.limit === 0) {
            return (obj instanceof this.baseObject) ? obj : new this.baseObject(obj, extra);
        }
        if(obj.id == null) {
            throw new Error("Missing object id");
        }
        var existing = this.get(obj.id);
        if(existing && !replace) {
            return existing;
        }
        if(!(obj instanceof this.baseObject)) {
            obj = new this.baseObject(obj, extra);
        }

        this.set(obj.id, obj);

        if(this.limit && this.size > this.limit) {
            var iter = this.keys();
            while(this.size > this.limit) {
                this.delete(iter.next().value);
            }
        }
        return obj;
    }

    /**
    * Return the first object to make the function evaluate true
    * @arg {function} func A function that takes an object and returns true if it matches
    * @returns {Class?} The first matching object, or undefined if no match
    */
    find(func) {
        for(var item of this.values()) {
            if(func(item)) {
                return item;
            }
        }
        return undefined;
    }

    /**
    * Get a random object from the Collection
    * @returns {Class?} The random object, or undefined if there is no match
    */
    random() {
        if(!this.size) {
            return undefined;
        }
        return Array.from(this.values())[Math.floor(Math.random() * this.size)];
    }

    /**
    * Return all the objects that make the function evaluate true
    * @arg {function} func A function that takes an object and returns true if it matches
    * @returns {Array<Class>} An array containing all the objects that matched
    */
    filter(func) {
        var arr = [];
        for(var item of this.values()) {
            if(func(item)) {
                arr.push(item);
            }
        }
        return arr;
    }

    /**
    * Return an array with the results of applying the given function to each element
    * @arg {function} func A function that takes an object and returns something
    * @returns {Array} An array containing the results
    */
    map(func) {
        var arr = [];
        for(var item of this.values()) {
            arr.push(func(item));
        }
        return arr;
    }

    /**
    * Update an object
    * @arg {Object} obj The updated object data
    * @arg {String} obj.id The ID of the object
    * @arg {Class?} extra An extra parameter the constructor may need
    * @arg {Boolean} replace Whether to replace an existing object with the same ID
    * @returns {Class} The updated object
    */
    update(obj, extra, replace) {
        if(!obj.id && obj.id !== 0) {
            throw new Error("Missing object id");
        }
        var item = this.get(obj.id);
        if(!item) {
            return this.add(obj, extra, replace);
        }
        item.update(obj, extra);
        return item;
    }

    /**
    * Remove an object
    * @arg {Object} obj The object
    * @arg {String} obj.id The ID of the object
    * @returns {Class?} The removed object, or null if nothing was removed
    */
    remove(obj) {
        var item = this.get(obj.id);
        if(!item) {
            return null;
        }
        this.delete(obj.id);
        return item;
    }

    toString() {
        return `[Collection<${this.baseObject.name}>]`;
    }
}

module.exports = Collection;
