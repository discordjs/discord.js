"use strict";

class Base {
    constructor(id) {
        if(id) {
            this.id = id;
        }
    }

    get createdAt() {
        return (this.id / 4194304) + 1420070400000;
    }

    toJSON(arg, cache) {
        cache = cache || [];
        if(~cache.indexOf(this)) {
            return "[Circular]";
        } else {
            cache.push(this);
        }
        var copy = {};
        for(var key in this) {
            if(this.hasOwnProperty(key) && !key.startsWith("_")) {
                if(!this[key]) {
                    copy[key] = this[key];
                } else if(this[key] instanceof Set) {
                    copy[key] = Array.from(this[key]);
                } else if(this[key] instanceof Map) {
                    copy[key] = Array.from(this[key].values());
                } else if(typeof this[key].toJSON === "function") {
                    copy[key] = this[key].toJSON(key, cache);
                } else {
                    copy[key] = this[key];
                }
            }
        }
        return copy;
    }

    inspect() {
        // http://stackoverflow.com/questions/5905492/dynamic-function-name-in-javascript
        var copy = new (new Function(`return function ${this.constructor.name}(){}`)());
        for(var key in this) {
            if(this.hasOwnProperty(key) && !key.startsWith("_") && this[key]) {
                copy[key] = this[key];
            }
        }
        return copy;
    }
}

module.exports = Base;
