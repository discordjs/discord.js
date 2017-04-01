"use strict";

const Permission = require("./Permission");

/**
* Represents a permission overwrite
* @extends Permission
* @prop {String} id The ID of the overwrite
* @prop {String} type The type of the overwrite, either "user" or "role"
*/
class PermissionOverwrite extends Permission {
    constructor(data) {
        super(data.allow, data.deny);
        this.id = data.id;
        this.type = data.type;
    }
}

module.exports = PermissionOverwrite;