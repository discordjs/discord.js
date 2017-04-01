"use strict";

const User = require("./User");

/**
* Represents an extended user
* @extends User
* @prop {String} email The email of the user
* @prop {Boolean} verified Whether the account email has been verified
* @prop {Boolean} mfaEnabled Whether the user has enabled two-factor authentication
*/
class ExtendedUser extends User {
    constructor(data, client) {
        super(data, client);
        this.update(data);
    }

    update(data) {
        super.update(data);
        this.email = data.email !== undefined ? data.email : this.email;
        this.verified = data.verified !== undefined ? data.verified : this.verified;
        this.mfaEnabled = data.mfa_enabled !== undefined ? data.mfa_enabled : this.mfaEnabled;
        this.premium = data.premium !== undefined ? data.premium : this.premium;
    }
}

module.exports = ExtendedUser;
